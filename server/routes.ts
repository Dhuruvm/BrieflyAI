import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { processContentSchema, insertNoteSchema, noteGenOptionsSchema } from "@shared/schema";
import { processTextContent, transcribeAudio, extractTextFromPDF, extractVideoContent } from "./services/gemini";
import { generateStudyNotesPDF } from "./services/notegen-agents";
import { generatePDFFromHTML } from "./services/pdf-generator";
import { noteGenEngine } from "./services/advanced-notegen-engine";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all notes
  app.get("/api/notes", async (req, res) => {
    try {
      const notes = await storage.getAllNotes();
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  // Get single note
  app.get("/api/notes/:id", async (req, res) => {
    try {
      const note = await storage.getNote(req.params.id);
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch note" });
    }
  });

  // Process content and create note
  app.post("/api/process", upload.single("file"), async (req, res) => {
    try {
      let content: string;
      let contentType: string;
      let fileName: string | undefined;

      if (req.file) {
        // Handle file upload
        fileName = req.file.originalname;
        const fileExtension = fileName.split('.').pop()?.toLowerCase();
        
        switch (fileExtension) {
          case 'txt':
            content = req.file.buffer.toString('utf-8');
            contentType = "text";
            break;
          case 'pdf':
            try {
              content = await extractTextFromPDF(req.file.buffer);
              contentType = "pdf";
              if (!content || content.trim().length === 0) {
                return res.status(400).json({ error: "Could not extract text from PDF. Please ensure the PDF contains readable text." });
              }
            } catch (error) {
              console.error("PDF processing error:", error);
              return res.status(400).json({ error: `PDF processing failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
            }
            break;
          case 'mp3':
          case 'wav':
          case 'm4a':
            try {
              content = await transcribeAudio(req.file.buffer);
              contentType = "audio";
            } catch (error) {
              return res.status(400).json({ error: "Audio transcription failed. Please check your OpenAI API key." });
            }
            break;
          default:
            return res.status(400).json({ error: "Unsupported file type" });
        }
      } else if (req.body.content) {
        // Handle text or URL input
        const validation = processContentSchema.safeParse(req.body);
        if (!validation.success) {
          return res.status(400).json({ error: validation.error.errors });
        }

        content = validation.data.content;
        contentType = validation.data.contentType;
        fileName = validation.data.fileName;

        // Handle video URL processing
        if (contentType === "video_url") {
          try {
            console.log(`🎥 Starting video processing for: ${content}`);
            content = await extractVideoContent(content);
            console.log(`✅ Video content extracted successfully`);
          } catch (error) {
            console.error("❌ Video processing error:", error);
            return res.status(400).json({ 
              error: `Failed to process video: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure the video URL is accessible and try again.` 
            });
          }
        }
      } else {
        return res.status(400).json({ error: "No content provided" });
      }

      // Process content with AI
      const aiResponse = await processTextContent(content, contentType);

      // Create note
      const noteData = insertNoteSchema.parse({
        title: aiResponse.title,
        summary: aiResponse.summary,
        keyPoints: aiResponse.keyPoints,
        actionItems: aiResponse.actionItems,
        visualCards: aiResponse.visualCards,
        originalContent: content,
        contentType,
        processingStatus: "completed",
      });

  // Get NoteGen performance analytics
  app.get("/api/notegen-analytics", async (req, res) => {
    try {
      const { getPerformanceAnalytics } = await import("./services/notegen-agents.js");
      const analytics = getPerformanceAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: "Failed to get analytics" });
    }
  });



      const note = await storage.createNote(noteData);
      res.json(note);

    } catch (error) {
      console.error("Processing error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to process content" 
      });
    }
  });

  // Delete note
  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const success = await storage.deleteNote(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete note" });
    }
  });

  // Generate Study Notes PDF endpoint (Legacy)
  app.post("/api/generate-study-notes", upload.single("file"), async (req, res) => {
    try {
      let content: string;
      let noteGenOptions;
      try {
        noteGenOptions = noteGenOptionsSchema.parse(
          typeof req.body.options === 'string' 
            ? JSON.parse(req.body.options) 
            : (req.body.options || {})
        );
      } catch (error) {
        console.log('Options parsing error:', error);
        noteGenOptions = noteGenOptionsSchema.parse({});
      }

      if (req.file) {
        // Handle file upload
        const fileName = req.file.originalname;
        const fileExtension = fileName.split('.').pop()?.toLowerCase();
        
        switch (fileExtension) {
          case 'txt':
            content = req.file.buffer.toString('utf-8');
            break;
          case 'pdf':
            content = await extractTextFromPDF(req.file.buffer);
            break;
          case 'mp3':
          case 'wav':
          case 'm4a':
            content = await transcribeAudio(req.file.buffer);
            break;
          default:
            return res.status(400).json({ error: "Unsupported file type for study notes generation" });
        }
      } else if (req.body.content) {
        content = req.body.content;
      } else {
        return res.status(400).json({ error: "No content provided" });
      }

      // Generate study notes using NoteGen agents
      console.log("🚀 Starting NoteGen AI pipeline...");
      const { html, filename } = await generateStudyNotesPDF(content);

      if (noteGenOptions.generatePDF) {
        // Generate PDF from HTML
        const pdfBuffer = await generatePDFFromHTML(html, filename);
        
        // Set headers for PDF download with proper filename encoding
        const encodedFilename = encodeURIComponent(filename);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`);
        res.setHeader('Content-Length', pdfBuffer.length);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        return res.send(pdfBuffer);
      } else {
        // Return HTML for preview
        return res.json({
          success: true,
          html: html,
          filename: filename,
          message: "Study notes generated successfully"
        });
      }
    } catch (error) {
      console.error('Study notes generation error:', error);
      res.status(500).json({ 
        error: `Failed to generate study notes: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  });

  // Advanced NoteGen Engine endpoint
  app.post("/api/generate-advanced-notes", upload.single("file"), async (req, res) => {
    try {
      let content: string;
      let title: string = "Study Notes";
      let contentType: string = "text";
      let noteGenOptions;
      try {
        noteGenOptions = noteGenOptionsSchema.parse(
          typeof req.body.options === 'string' 
            ? JSON.parse(req.body.options) 
            : (req.body.options || {})
        );
      } catch (error) {
        console.log('Advanced options parsing error:', error);
        noteGenOptions = noteGenOptionsSchema.parse({});
      }

      if (req.file) {
        // Handle file upload
        title = req.file.originalname.split('.')[0];
        const fileName = req.file.originalname;
        const fileExtension = fileName.split('.').pop()?.toLowerCase();
        
        switch (fileExtension) {
          case 'txt':
            content = req.file.buffer.toString('utf-8');
            contentType = "text";
            break;
          case 'pdf':
            content = await extractTextFromPDF(req.file.buffer);
            contentType = "pdf";
            break;
          case 'mp3':
          case 'wav':
          case 'm4a':
            content = await transcribeAudio(req.file.buffer);
            contentType = "audio";
            break;
          default:
            return res.status(400).json({ error: "Unsupported file type for advanced notes generation" });
        }
      } else if (req.body.content) {
        content = req.body.content;
        title = req.body.title || "Study Notes";
        contentType = req.body.contentType || "text";
      } else {
        return res.status(400).json({ error: "No content provided" });
      }

      // Generate advanced notes using the new 4-agent pipeline
      console.log("🚀 Starting Advanced NoteGen Engine Pipeline...");
      const { pdfBuffer, processingMetrics } = await noteGenEngine.generateAdvancedNotes(
        content, 
        contentType, 
        noteGenOptions,
        title
      );

      if (noteGenOptions.generatePDF) {
        // Return PDF with proper download headers
        const filename = `advanced-notes-${Date.now()}.pdf`;
        const encodedFilename = encodeURIComponent(filename);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`);
        res.setHeader('Content-Length', pdfBuffer.length);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        return res.send(pdfBuffer);
      } else {
        // Return processing metrics and success info
        return res.json({
          success: true,
          message: "Advanced study notes generated successfully",
          processingMetrics,
          pdfSize: pdfBuffer.length,
          agentsPipeline: [
            "Layout Designer - Structure extraction",
            "Styling Designer - Visual enhancement",
            "Diagram Generator - Visual aids",
            "PDF Designer - Final rendering"
          ]
        });
      }
    } catch (error) {
      console.error('Advanced notes generation error:', error);
      res.status(500).json({ 
        error: `Failed to generate advanced notes: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  });

  // Download PDF from existing note
  app.get("/api/notes/:id/download-pdf", async (req, res) => {
    try {
      const note = await storage.getNote(req.params.id);
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }

      // Generate study notes PDF from existing note content
      const { html, filename } = await generateStudyNotesPDF(note.originalContent);
      const pdfBuffer = await generatePDFFromHTML(html, filename);
      
      // Set headers for PDF download with proper encoding
      const encodedFilename = encodeURIComponent(filename);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      res.send(pdfBuffer);
    } catch (error) {
      console.error('PDF download error:', error);
      res.status(500).json({ 
        error: `Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  });

  // User feedback endpoint for self-learning system
  app.post("/api/notegen-feedback", async (req, res) => {
    try {
      const { rating, features } = req.body;
      
      if (typeof rating !== 'number' || rating < 0 || rating > 10) {
        return res.status(400).json({ error: "Rating must be a number between 0 and 10" });
      }
      
      if (!Array.isArray(features)) {
        return res.status(400).json({ error: "Features must be an array" });
      }
      
      await noteGenEngine.updateUserFeedback(rating, features);
      
      res.json({ 
        success: true, 
        message: "Feedback received and learning system updated" 
      });
    } catch (error) {
      console.error('Feedback processing error:', error);
      res.status(500).json({ 
        error: `Failed to process feedback: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  });

  // NoteGen Analytics endpoint
  app.get("/api/notegen-analytics", async (req, res) => {
    try {
      // Return analytics data from the engine
      const analytics = await noteGenEngine.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
