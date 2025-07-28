import { apiRequest } from "./queryClient";
import type { Note, ProcessContentRequest } from "@shared/schema";

export const api = {
  // Get all notes
  getNotes: async (): Promise<Note[]> => {
    const response = await apiRequest("GET", "/api/notes");
    return response.json();
  },

  // Get single note
  getNote: async (id: string): Promise<Note> => {
    const response = await apiRequest("GET", `/api/notes/${id}`);
    return response.json();
  },

  // Process content
  processContent: async (data: ProcessContentRequest): Promise<Note> => {
    const response = await apiRequest("POST", "/api/process", data);
    return response.json();
  },

  // Delete note
  deleteNote: async (id: string): Promise<void> => {
    await apiRequest("DELETE", `/api/notes/${id}`);
  },
};
