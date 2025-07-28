import { GoogleGenAI } from "@google/genai";
import { type AiNoteResponse, aiNoteResponseSchema } from "@shared/schema";

// Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            summary: { type: "string" },
            keyPoints: { 
              type: "array",
              items: { type: "string" }
            },
            actionItems: {
              type: "array", 
              items: { type: "string" }
            },
            visualCards: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  icon: { type: "string" },
                  label: { type: "string" },
                  value: { type: "string" },
                  color: { type: "string" }
                },
                required: ["icon", "label", "value", "color"]
              }
            }
          },
          required: ["title", "summary", "keyPoints", "actionItems", "visualCards"]
        }
      },
      contents: `Content to analyze:\n${content}`,
    });

    const rawJson = response.text;
    console.log(`Raw JSON from Gemini: ${rawJson}`);

    if (rawJson) {
      const result = JSON.parse(rawJson);
      return aiNoteResponseSchema.parse(result);
    } else {
      throw new Error("Empty response from Gemini model");
    }
  } catch (error) {
    throw new Error(`Failed to process content: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: contents,
    });

    return response.text || "Failed to transcribe audio";
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
  const prompt = `
Extract the main content and transcript from this video URL: ${videoUrl}

Note: This is a placeholder implementation. In production, you would:
1. Use YouTube Data API to get video details
2. Use youtube-dl or similar to extract audio
3. Transcribe the audio using Gemini
4. Combine with video description and metadata

For now, please provide guidance on implementing video content extraction.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Video content extraction not fully implemented yet.";
  } catch (error) {
    throw new Error(`Failed to extract video content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
