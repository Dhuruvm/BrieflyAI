import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { processContentSchema, insertNoteSchema } from "@shared/schema";
import { processTextContent, transcribeAudio, extractTextFromPDF, extractVideoContent } from "./services/gemini";

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
            } catch (error) {
              return res.status(400).json({ error: "PDF processing not yet implemented. Please try with text content." });
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
            content = await extractVideoContent(content);
          } catch (error) {
            return res.status(400).json({ error: "Video content extraction not yet fully implemented." });
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

  const httpServer = createServer(app);
  return httpServer;
}
