import { useMutation, useQuery } from '@tanstack/react-query';
import { useBreviaStore } from '@/lib/store';

// Mock clustering utilities for development
export const clusteringUtils = {
  transformForVisualization: (clusters: any[], type: string) => {
    if (!clusters) return null;
    
    switch (type) {
      case 'treemap':
        return {
          children: clusters.map((cluster, index) => ({
            name: cluster.label || `Cluster ${index + 1}`,
            value: cluster.documents?.length || 0,
            children: cluster.documents?.slice(0, 5).map((doc: any) => ({
              name: doc.title || 'Untitled',
              value: Math.round(doc.relevance * 100) || 50
            })) || []
          }))
        };
      default:
        return clusters;
    }
  },
  
  generateClusterColors: (count: number) => {
    const colors = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  },
  
  calculateClusterStats: (clusters: any[]) => {
    if (!clusters?.length) {
      return { clusterCount: 0, totalDocuments: 0, avgClusterSize: 0, largestCluster: 0 };
    }
    
    const totalDocuments = clusters.reduce((sum, cluster) => sum + (cluster.documents?.length || 0), 0);
    const avgClusterSize = Math.round(totalDocuments / clusters.length);
    const largestCluster = Math.max(...clusters.map(cluster => cluster.documents?.length || 0));
    
    return {
      clusterCount: clusters.length,
      totalDocuments,
      avgClusterSize,
      largestCluster
    };
  }
};

export interface ClusteringRequest {
  query: string;
  algorithm: 'kmeans' | 'hierarchical' | 'dbscan';
  resultCount: number;
  dataSource: string;
  projectId?: string;
}

export interface ClusteringResponse {
  id: string;
  clusters: ClusterData[];
  visualization: VisualizationData;
  metadata: {
    totalDocuments: number;
    processingTime: number;
    algorithm: string;
    parameters: Record<string, any>;
  };
}

// Fetch clustering analysis
export const useClusteringAnalysis = (analysisId: string) => {
  return useQuery({
    queryKey: ['clustering', analysisId],
    queryFn: () => fetch(`/api/clustering/${analysisId}`).then(res => res.json()),
    enabled: !!analysisId,
  });
};

// Fetch clustering history for a project
export const useClusteringHistory = (projectId: string) => {
  return useQuery({
    queryKey: ['clustering', 'history', projectId],
    queryFn: () => fetch(`/api/clustering/history/${projectId}`).then(res => res.json()),
    enabled: !!projectId,
  });
};

// Create new clustering analysis
export const useCreateClusteringAnalysis = () => {
  const { activeProjectId } = useBreviaStore();
  
  return useMutation({
    mutationFn: async (request: ClusteringRequest): Promise<ClusteringResponse> => {
      const payload = {
        ...request,
        projectId: request.projectId || activeProjectId,
      };
      
      const response = await fetch('/api/clustering/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('Clustering analysis failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate clustering queries to refresh the UI
      if (activeProjectId) {
        // Note: queryClient invalidation would be handled in the calling component
      }
    },
  });
};

// Real-time clustering progress tracking
export const useClusteringProgress = (analysisId: string) => {
  return useQuery({
    queryKey: ['clustering', 'progress', analysisId],
    queryFn: () => fetch(`/api/clustering/progress/${analysisId}`).then(res => res.json()),
    enabled: !!analysisId,
    refetchInterval: 2000, // Poll every 2 seconds
    refetchIntervalInBackground: false,
  });
};

// Generate clustering suggestions based on content
export const useClusteringSuggestions = (content: string) => {
  return useQuery({
    queryKey: ['clustering', 'suggestions', content],
    queryFn: () => fetch('/api/clustering/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    }).then(res => res.json()),
    enabled: !!content && content.length > 10,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Export clustering results
export const useExportClustering = () => {
  return useMutation({
    mutationFn: async ({ analysisId, format }: { analysisId: string; format: 'json' | 'csv' | 'pdf' }) => {
      const response = await fetch(`/api/clustering/export/${analysisId}?format=${format}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clustering-analysis-${analysisId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return blob;
    },
  });
};

// Delete clustering analysis
export const useDeleteClusteringAnalysis = () => {
  return useMutation({
    mutationFn: (analysisId: string) => 
      fetch(`/api/clustering/${analysisId}`, {
        method: 'DELETE',
      }).then(res => res.json()),
  });
};

// Additional visualization helper that extends the basic utilities
export const visualizationHelpers = {
  transformForVisualization: (clusters: any[], type: 'treemap' | 'sunburst' | 'network') => {
    switch (type) {
      case 'treemap':
        return {
          name: 'Clusters',
          children: clusters.map(cluster => ({
            name: cluster.label,
            value: cluster.documents.length,
            color: cluster.color,
            children: cluster.documents.map(doc => ({
              name: doc.title,
              value: doc.relevance,
              snippet: doc.snippet,
            })),
          })),
        };
        
      case 'sunburst':
        return {
          name: 'Root',
          children: clusters.map(cluster => ({
            name: cluster.label,
            size: cluster.documents.length,
            color: cluster.color,
            children: cluster.documents.map(doc => ({
              name: doc.title,
              size: doc.relevance,
              snippet: doc.snippet,
            })),
          })),
        };
        
      case 'network':
        const nodes = clusters.flatMap(cluster => [
          {
            id: cluster.id,
            name: cluster.label,
            type: 'cluster',
            size: cluster.documents.length,
            color: cluster.color,
          },
          ...cluster.documents.map(doc => ({
            id: doc.id,
            name: doc.title,
            type: 'document',
            clusterId: cluster.id,
            relevance: doc.relevance,
          })),
        ]);
        
        const links = clusters.flatMap(cluster =>
          cluster.documents.map(doc => ({
            source: cluster.id,
            target: doc.id,
            weight: doc.relevance,
          }))
        );
        
        return { nodes, links };
        
      default:
        return clusters;
    }
  },
};