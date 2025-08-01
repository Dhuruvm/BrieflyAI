import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Document, InsertDocument, Highlight, AIAnnotation } from '@/../../shared/schema';
import { useBreviaStore } from '@/lib/store';

export interface DocumentUploadRequest {
  file: File;
  projectId?: string;
  extractText?: boolean;
  generateThumbnails?: boolean;
}

export interface DocumentHighlightRequest {
  documentId: string;
  highlights: Omit<Highlight, 'id' | 'createdAt'>[];
}

export interface AIAnnotationRequest {
  documentId: string;
  content: string;
  type: 'summary' | 'key_point' | 'question' | 'insight';
}

// Fetch documents for a project
export const useDocuments = (projectId: string) => {
  return useQuery({
    queryKey: ['documents', projectId],
    queryFn: () => fetch(`/api/documents/project/${projectId}`).then(res => res.json()),
    enabled: !!projectId,
  });
};

// Fetch single document
export const useDocument = (documentId: string) => {
  return useQuery({
    queryKey: ['documents', documentId],
    queryFn: () => fetch(`/api/documents/${documentId}`).then(res => res.json()),
    enabled: !!documentId,
  });
};

// Upload document
export const useUploadDocument = () => {
  const { activeProjectId } = useBreviaStore();
  
  return useMutation({
    mutationFn: async (request: DocumentUploadRequest): Promise<Document> => {
      const formData = new FormData();
      formData.append('file', request.file);
      formData.append('projectId', request.projectId || activeProjectId || '');
      formData.append('extractText', String(request.extractText ?? true));
      formData.append('generateThumbnails', String(request.generateThumbnails ?? true));
      
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
  });
};

// Create document from text
export const useCreateDocument = () => {
  const { activeProjectId } = useBreviaStore();
  
  return useMutation({
    mutationFn: async (document: Omit<InsertDocument, 'projectId'> & { projectId?: string }): Promise<Document> => {
      const payload = {
        ...document,
        projectId: document.projectId || activeProjectId,
      };
      
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('Document creation failed');
      }
      
      return response.json();
    },
  });
};

// Update document
export const useUpdateDocument = () => {
  return useMutation({
    mutationFn: ({ documentId, updates }: { documentId: string; updates: Partial<Document> }) =>
      fetch(`/api/documents/${documentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      }).then(res => res.json()),
  });
};

// Delete document
export const useDeleteDocument = () => {
  return useMutation({
    mutationFn: (documentId: string) =>
      fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      }).then(res => res.json()),
  });
};

// Add highlights to document
export const useAddHighlights = () => {
  return useMutation({
    mutationFn: (request: DocumentHighlightRequest) =>
      fetch(`/api/documents/${request.documentId}/highlights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ highlights: request.highlights }),
      }).then(res => res.json()),
  });
};

// Remove highlight
export const useRemoveHighlight = () => {
  return useMutation({
    mutationFn: ({ documentId, highlightId }: { documentId: string; highlightId: string }) =>
      fetch(`/api/documents/${documentId}/highlights/${highlightId}`, {
        method: 'DELETE',
      }).then(res => res.json()),
  });
};

// Generate AI annotation
export const useGenerateAIAnnotation = () => {
  return useMutation({
    mutationFn: async (request: AIAnnotationRequest): Promise<AIAnnotation> => {
      const response = await fetch(`/api/documents/${request.documentId}/annotations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: request.content,
          type: request.type,
        }),
      });
      
      if (!response.ok) {
        throw new Error('AI annotation generation failed');
      }
      
      return response.json();
    },
  });
};

// Extract text from PDF
export const useExtractPDFText = () => {
  return useMutation({
    mutationFn: async (file: File): Promise<{ text: string; metadata: any }> => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/documents/extract-text', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Text extraction failed');
      }
      
      return response.json();
    },
  });
};

// Search within documents
export const useSearchDocuments = (projectId: string, query: string) => {
  return useQuery({
    queryKey: ['documents', 'search', projectId, query],
    queryFn: () => fetch(`/api/documents/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectId, query }),
    }).then(res => res.json()),
    enabled: !!projectId && !!query && query.length > 2,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get document analytics
export const useDocumentAnalytics = (documentId: string) => {
  return useQuery({
    queryKey: ['documents', documentId, 'analytics'],
    queryFn: () => fetch(`/api/documents/${documentId}/analytics`).then(res => res.json()),
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Export document with highlights
export const useExportDocument = () => {
  return useMutation({
    mutationFn: async ({ 
      documentId, 
      format, 
      includeHighlights = true, 
      includeAnnotations = true 
    }: { 
      documentId: string; 
      format: 'pdf' | 'docx' | 'markdown'; 
      includeHighlights?: boolean;
      includeAnnotations?: boolean;
    }) => {
      const params = new URLSearchParams({
        format,
        includeHighlights: String(includeHighlights),
        includeAnnotations: String(includeAnnotations),
      });
      
      const response = await fetch(`/api/documents/${documentId}/export?${params}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document-${documentId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return blob;
    },
  });
};

// Document utilities
export const documentUtils = {
  // Get file type icon
  getFileTypeIcon: (type: string): string => {
    const typeMap: Record<string, string> = {
      'pdf': '📄',
      'text': '📝',
      'web': '🌐',
      'note': '📋',
      'docx': '📘',
      'doc': '📘',
      'pptx': '📊',
      'ppt': '📊',
      'xlsx': '📈',
      'xls': '📈',
    };
    
    return typeMap[type.toLowerCase()] || '📄';
  },
  
  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  // Generate thumbnail URL
  getThumbnailUrl: (documentId: string, page: number = 1): string => {
    return `/api/documents/${documentId}/thumbnail?page=${page}&size=200`;
  },
  
  // Extract text preview
  getTextPreview: (text: string, maxLength: number = 200): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },
  
  // Calculate reading time
  calculateReadingTime: (text: string): number => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  },
  
  // Highlight text with search query
  highlightSearchTerms: (text: string, query: string): string => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },
};