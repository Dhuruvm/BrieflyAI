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

// NoteGen Agent Schemas
export const noteGenOptionsSchema = z.object({
  generatePDF: z.boolean().default(false),
  pdfStyle: z.enum(['handwritten', 'minimal', 'dark']).default('handwritten'),
  includeVisuals: z.boolean().default(true),
  language: z.string().default('en'),
});

export type NoteGenOptions = z.infer<typeof noteGenOptionsSchema>;
