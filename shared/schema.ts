import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const notes = pgTable("notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  keyPoints: json("key_points").$type<string[]>().notNull(),
  actionItems: json("action_items").$type<string[]>().notNull(),
  visualCards: json("visual_cards").$type<{ icon: string; label: string; value: string; color: string }[]>().notNull(),
  originalContent: text("original_content").notNull(),
  contentType: text("content_type").notNull(),
  processingStatus: text("processing_status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
});

export const processContentSchema = z.object({
  content: z.string().min(1, "Content is required"),
  contentType: z.enum(["text", "pdf", "audio", "video_url"]),
  fileName: z.string().optional(),
});

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;
export type ProcessContentRequest = z.infer<typeof processContentSchema>;

// AI Response Schema for structured output
export const aiNoteResponseSchema = z.object({
  title: z.string(),
  summary: z.string(),
  keyPoints: z.array(z.string()),
  actionItems: z.array(z.string()),
  visualCards: z.array(z.object({
    icon: z.string(),
    label: z.string(),
    value: z.string(),
    color: z.string(),
  })),
});

export type AiNoteResponse = z.infer<typeof aiNoteResponseSchema>;

// Enhanced NoteGen Agent Schemas
export const noteGenOptionsSchema = z.object({
  generatePDF: z.boolean().default(false),
  pdfStyle: z.enum(['handwritten', 'minimal', 'dark', 'academic', 'creative']).default('handwritten'),
  includeVisuals: z.boolean().default(true),
  includeDiagrams: z.boolean().default(true),
  language: z.string().default('en'),
  complexityLevel: z.enum(['simple', 'moderate', 'complex']).default('moderate'),
  visualDensity: z.enum(['minimal', 'balanced', 'rich']).default('balanced'),
  colorScheme: z.enum(['warm', 'cool', 'neutral', 'vibrant', 'pastel']).default('warm'),
  fontStyle: z.enum(['handwritten', 'clean', 'academic', 'creative']).default('handwritten'),
});

export type NoteGenOptions = z.infer<typeof noteGenOptionsSchema>;

// Agent Pipeline Schemas
export const layoutDataSchema = z.object({
  headings: z.array(z.object({
    level: z.number(),
    text: z.string(),
    position: z.number(),
  })),
  bullets: z.array(z.object({
    text: z.string(),
    level: z.number(),
    type: z.enum(['bullet', 'number', 'arrow', 'check']),
  })),
  paragraphs: z.array(z.object({
    text: z.string(),
    type: z.enum(['introduction', 'body', 'conclusion', 'definition']),
  })),
  suggestedDiagrams: z.array(z.object({
    type: z.enum(['flowchart', 'cycle', 'hierarchy', 'timeline', 'mindmap']),
    keywords: z.array(z.string()),
    description: z.string(),
  })),
});

export const styledDataSchema = z.object({
  elements: z.array(z.object({
    type: z.enum(['heading', 'bullet', 'paragraph', 'highlight', 'definition', 'diagram']),
    content: z.string(),
    styles: z.object({
      color: z.string(),
      backgroundColor: z.string().optional(),
      fontWeight: z.enum(['normal', 'bold', 'bolder']).optional(),
      textDecoration: z.enum(['none', 'underline', 'line-through']).optional(),
      border: z.string().optional(),
      icon: z.string().optional(),
    }),
    importance: z.enum(['low', 'medium', 'high', 'critical']),
  })),
  colorMapping: z.record(z.string()),
});

export const diagramInstructionsSchema = z.object({
  diagrams: z.array(z.object({
    type: z.string(),
    elements: z.array(z.string()),
    connections: z.array(z.object({
      from: z.string(),
      to: z.string(),
      label: z.string().optional(),
    })),
    mermaidCode: z.string(),
    svgCode: z.string().optional(),
  })),
});

// Self-Learning Schemas
export const classificationResultSchema = z.object({
  subject: z.enum(['science', 'math', 'history', 'literature', 'technology', 'business', 'other']),
  tone: z.enum(['formal', 'casual', 'academic', 'conversational']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  keywords: z.array(z.string()),
  patterns: z.array(z.string()),
  confidence: z.number(),
});

export const performanceMetricSchema = z.object({
  processingTime: z.number(),
  userSatisfaction: z.number().min(0).max(10),
  errorRate: z.number(),
  timestamp: z.number(),
  agentName: z.string(),
  inputSize: z.number(),
  outputQuality: z.number().min(0).max(10),
});

export type LayoutData = z.infer<typeof layoutDataSchema>;
export type StyledData = z.infer<typeof styledDataSchema>;
export type DiagramInstructions = z.infer<typeof diagramInstructionsSchema>;
export type ClassificationResult = z.infer<typeof classificationResultSchema>;
export type PerformanceMetric = z.infer<typeof performanceMetricSchema>;
