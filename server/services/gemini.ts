import { GoogleGenerativeAI } from "@google/generative-ai";
import { type AiNoteResponse, aiNoteResponseSchema } from "@shared/schema";

// Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
const ai = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

export async function processTextContent(content: string, contentType: string): Promise<AiNoteResponse> {
  const systemPrompt = `You are an expert content analyst. Analyze content and provide structured notes in JSON format. Focus on extracting actionable insights and key information.

Analyze the following ${contentType} content and create structured notes. Return a JSON response with the following structure:

{
  "title": "A concise, descriptive title for the content",
  "summary": "A comprehensive summary in 2-3 sentences",
  "keyPoints": ["Array of 3-5 key points extracted from the content"],
  "actionItems": ["Array of 3-5 actionable items or next steps"],
  "visualCards": [
    {
      "icon": "fas fa-chart-line",
      "label": "Metric or concept name",
      "value": "Relevant value or percentage",
      "color": "blue"
    }
  ]
}

For visualCards, use relevant FontAwesome icons and colors (blue, green, amber, red). Create 2-4 cards with meaningful metrics or concepts.

Provide the response as valid JSON only.`;

  try {
    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json"
      },
      systemInstruction: systemPrompt
    });

    const response = await model.generateContent(content);
    
    const result = response.response.text();
    
    // Parse and validate the JSON response
    let parsedResult;
    try {
      parsedResult = JSON.parse(result);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', result);
      throw new Error('Invalid JSON response from AI model');
    }
    
    // Validate against schema
    const validatedResult = aiNoteResponseSchema.parse(parsedResult);
    return validatedResult;
  } catch (error: any) {
    console.error('Processing error:', error);
    throw new Error(`Failed to process content: ${JSON.stringify(error)}`);
  }
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    // Use Gemini for audio transcription
    const contents = [
      {
        inlineData: {
          data: audioBuffer.toString("base64"),
          mimeType: "audio/wav",
        },
      },
      "Transcribe this audio file and return only the text content.",
    ];

    const model = ai.getGenerativeModel({ model: "gemini-2.5-pro" });
    const response = await model.generateContent(contents);

    return response.response.text() || "Failed to transcribe audio";
  } catch (error) {
    throw new Error(`Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    const pdfParse = await import("pdf-parse");
    const data = await pdfParse.default(pdfBuffer);
    return data.text || "No text content found in PDF";
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function extractVideoContent(videoUrl: string): Promise<string> {
  const YTDlpWrap = (await import('yt-dlp-wrap')).default;
  const fs = await import('fs');
  const path = await import('path');
  const { promisify } = await import('util');
  const writeFile = promisify(fs.writeFile);
  const unlink = promisify(fs.unlink);
  const exists = promisify(fs.exists);

  try {
    console.log(`🎥 Processing video URL: ${videoUrl}`);
    
    // Initialize yt-dlp
    const ytDlp = new YTDlpWrap();
    
    // First, get video info and check for subtitles
    console.log("📋 Fetching video metadata...");
    const videoInfo = await ytDlp.getVideoInfo(videoUrl);
    
    let content = '';
    
    // Add video metadata
    content += `# ${videoInfo.title || 'Video Content'}\n\n`;
    if (videoInfo.description) {
      content += `## Description\n${videoInfo.description}\n\n`;
    }
    if (videoInfo.uploader) {
      content += `**Channel:** ${videoInfo.uploader}\n`;
    }
    if (videoInfo.duration) {
      content += `**Duration:** ${Math.floor(videoInfo.duration / 60)}:${(videoInfo.duration % 60).toString().padStart(2, '0')}\n\n`;
    }

    // Try to get automatic captions/subtitles first
    console.log("📝 Checking for available subtitles...");
    let transcript = '';
    
    try {
      // Try to download auto-generated captions
      const tempDir = '/tmp';
      const captionFile = path.join(tempDir, `captions_${Date.now()}.vtt`);
      
      await ytDlp.exec([
        videoUrl,
        '--write-subs',
        '--write-auto-subs',
        '--sub-lang', 'en',
        '--sub-format', 'vtt',
        '--skip-download',
        '-o', captionFile.replace('.vtt', '.%(ext)s')
      ]);

      // Check if caption file exists
      const vttFile = captionFile.replace('.vtt', '.en.vtt');
      if (await exists(vttFile)) {
        console.log("✅ Found captions, extracting text...");
        const captionContent = await fs.promises.readFile(vttFile, 'utf-8');
        
        // Parse VTT format and extract text
        transcript = captionContent
          .split('\n')
          .filter(line => 
            line.trim() && 
            !line.startsWith('WEBVTT') && 
            !line.includes('-->') &&
            !line.match(/^\d+$/)
          )
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        // Clean up
        await unlink(vttFile).catch(() => {});
        
        if (transcript) {
          content += `## Transcript\n${transcript}\n\n`;
        }
      }
    } catch (captionError) {
      console.log("⚠️ No captions available, will try audio transcription...");
    }

    // If no transcript from captions, try audio extraction and transcription
    if (!transcript) {
      try {
        console.log("🎵 Extracting audio for transcription...");
        const tempDir = '/tmp';
        const audioFile = path.join(tempDir, `audio_${Date.now()}.mp3`);
        
        // Extract audio (limit to first 10 minutes to avoid large files)
        await ytDlp.exec([
          videoUrl,
          '-f', 'bestaudio',
          '--extract-audio',
          '--audio-format', 'mp3',
          '--audio-quality', '5',  // Lower quality for faster processing
          '-o', audioFile,
          '--postprocessor-args', '-t 600'  // Limit to 10 minutes
        ]);
        
        if (await exists(audioFile)) {
          console.log("🎤 Transcribing audio...");
          const audioBuffer = await fs.promises.readFile(audioFile);
          const audioTranscript = await transcribeAudio(audioBuffer);
          
          if (audioTranscript) {
            content += `## Audio Transcript\n${audioTranscript}\n\n`;
          }
          
          // Clean up
          await unlink(audioFile).catch(() => {});
        }
      } catch (audioError) {
        console.log("⚠️ Audio transcription failed:", audioError);
        content += `## Note\nAudio transcription was not available for this video.\n\n`;
      }
    }

    // If we have very little content, add a note
    if (content.length < 200) {
      content += `## Processing Note\nThis video content could not be fully extracted. The video may be private, age-restricted, or have limited metadata available.\n\n`;
      content += `**Original URL:** ${videoUrl}\n`;
    }

    console.log(`✅ Video content extracted: ${content.length} characters`);
    return content;

  } catch (error) {
    console.error("❌ Video extraction error:", error);
    
    // Fallback: return basic video info
    const fallbackContent = `# Video Content\n\n**URL:** ${videoUrl}\n\n**Note:** Unable to extract full video content. This may be due to:\n- Private or restricted video\n- Geographic restrictions\n- Network connectivity issues\n- Unsupported video platform\n\nPlease try with a different video or check if the URL is accessible.`;
    
    return fallbackContent;
  }
}
