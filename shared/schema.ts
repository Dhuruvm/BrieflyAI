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

// Brevia AI Research Platform Schemas
export const researchProjects = pgTable("research_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"),
  metadata: json("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const clusterAnalysis = pgTable("cluster_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => researchProjects.id),
  query: text("query").notNull(),
  algorithm: text("algorithm").notNull().default("kmeans"),
  resultCount: text("result_count").notNull().default("50"),
  dataSource: text("data_source").notNull(),
  clusters: json("clusters").$type<ClusterData[]>().notNull(),
  visualization: json("visualization").$type<VisualizationData>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => researchProjects.id),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'pdf', 'text', 'web', 'note'
  content: text("content"),
  metadata: json("metadata").$type<DocumentMetadata>(),
  highlights: json("highlights").$type<Highlight[]>().default([]),
  aiAnnotations: json("ai_annotations").$type<AIAnnotation[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => researchProjects.id),
  title: text("title").notNull(),
  messages: json("messages").$type<ChatMessage[]>().notNull().default([]),
  context: json("context").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const plannerTasks = pgTable("planner_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => researchProjects.id),
  sessionId: varchar("session_id").references(() => chatSessions.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"),
  priority: text("priority").notNull().default("medium"),
  steps: json("steps").$type<TaskStep[]>().notNull().default([]),
  dependencies: json("dependencies").$type<string[]>().default([]),
  estimatedTime: text("estimated_time"),
  actualTime: text("actual_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type definitions for complex objects
export const clusterDataSchema = z.object({
  id: z.string(),
  label: z.string(),
  size: z.number(),
  documents: z.array(z.object({
    id: z.string(),
    title: z.string(),
    relevance: z.number(),
    snippet: z.string(),
  })),
  keywords: z.array(z.string()),
  coordinates: z.object({
    x: z.number(),
    y: z.number(),
  }),
  color: z.string(),
});

export const visualizationDataSchema = z.object({
  type: z.enum(['treemap', 'sunburst', 'list', 'network']),
  data: z.record(z.any()),
  layout: z.record(z.any()),
  config: z.record(z.any()),
});

export const documentMetadataSchema = z.object({
  fileSize: z.number().optional(),
  pageCount: z.number().optional(),
  author: z.string().optional(),
  createdDate: z.string().optional(),
  language: z.string().optional(),
  extractedText: z.string().optional(),
  thumbnails: z.array(z.string()).optional(),
});

export const highlightSchema = z.object({
  id: z.string(),
  text: z.string(),
  startPosition: z.number(),
  endPosition: z.number(),
  color: z.string(),
  note: z.string().optional(),
  createdAt: z.string(),
});

export const aiAnnotationSchema = z.object({
  id: z.string(),
  type: z.enum(['summary', 'key_point', 'question', 'insight']),
  content: z.string(),
  position: z.object({
    page: z.number(),
    x: z.number(),
    y: z.number(),
  }),
  confidence: z.number(),
  createdAt: z.string(),
});

export const chatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.string(),
  attachments: z.array(z.object({
    type: z.string(),
    url: z.string(),
    name: z.string(),
  })).optional(),
  metadata: z.record(z.any()).optional(),
});

export const taskStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'failed']),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  output: z.string().optional(),
  error: z.string().optional(),
});

export type ClusterData = z.infer<typeof clusterDataSchema>;
export type VisualizationData = z.infer<typeof visualizationDataSchema>;
export type DocumentMetadata = z.infer<typeof documentMetadataSchema>;
export type Highlight = z.infer<typeof highlightSchema>;
export type AIAnnotation = z.infer<typeof aiAnnotationSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type TaskStep = z.infer<typeof taskStepSchema>;

// Insert schemas
export const insertResearchProjectSchema = createInsertSchema(researchProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClusterAnalysisSchema = createInsertSchema(clusterAnalysis).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPlannerTaskSchema = createInsertSchema(plannerTasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertResearchProject = z.infer<typeof insertResearchProjectSchema>;
export type InsertClusterAnalysis = z.infer<typeof insertClusterAnalysisSchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type InsertPlannerTask = z.infer<typeof insertPlannerTaskSchema>;

export type ResearchProject = typeof researchProjects.$inferSelect;
export type ClusterAnalysisType = typeof clusterAnalysis.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type ChatSession = typeof chatSessions.$inferSelect;
export type PlannerTask = typeof plannerTasks.$inferSelect;
