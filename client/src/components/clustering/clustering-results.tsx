import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { clusteringUtils } from '@/hooks/use-clustering';

import {
  Search,
  ExternalLink,
  Star,
  Filter,
  SortAsc,
  FileText,
  Calendar,
  User,
  Download,
} from 'lucide-react';

interface ClusteringResultsProps {
  analysis: any;
}

export function ClusteringResults({ analysis }: ClusteringResultsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title'>('relevance');

  if (!analysis?.clusters) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p className="text-brevia-muted">No results to display</p>
      </div>
    );
  }

  const stats = clusteringUtils.calculateClusterStats(analysis.clusters);
  const colors = clusteringUtils.generateClusterColors(analysis.clusters.length);

  const filteredClusters = analysis.clusters.filter((cluster: any) => {
    if (selectedCluster && cluster.id !== selectedCluster) return false;
    if (searchQuery) {
      return cluster.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
             cluster.documents.some((doc: any) => 
               doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               doc.snippet.toLowerCase().includes(searchQuery.toLowerCase())
             );
    }
    return true;
  });

  const sortDocuments = (documents: any[]) => {
    return [...documents].sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.relevance - a.relevance;
        case 'date':
          return new Date(b.publishedDate || 0).getTime() - new Date(a.publishedDate || 0).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header with Stats */}
      <div className="border-b border-brevia-default p-6 bg-brevia-secondary">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-brevia-primary">{stats.clusterCount}</div>
            <div className="text-xs text-brevia-muted">Clusters</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brevia-primary">{stats.totalDocuments}</div>
            <div className="text-xs text-brevia-muted">Total Documents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brevia-primary">{stats.avgClusterSize}</div>
            <div className="text-xs text-brevia-muted">Avg Cluster Size</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brevia-primary">{stats.largestCluster}</div>
            <div className="text-xs text-brevia-muted">Largest Cluster</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brevia-muted" />
            <Input
              placeholder="Search clusters and documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const nextSort = sortBy === 'relevance' ? 'date' : sortBy === 'date' ? 'title' : 'relevance';
              setSortBy(nextSort);
            }}
          >
            <SortAsc className="h-4 w-4 mr-2" />
            Sort: {sortBy}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Cluster List */}
        <div className="w-80 border-r border-brevia-default bg-brevia-secondary">
          <div className="p-4 border-b border-brevia-default">
            <h3 className="font-medium">Clusters ({filteredClusters.length})</h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              <Button
                variant={selectedCluster === null ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => setSelectedCluster(null)}
              >
                All Clusters
              </Button>
              {analysis.clusters.map((cluster: any, index: number) => (
                <Button
                  key={cluster.id || index}
                  variant={selectedCluster === cluster.id ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => setSelectedCluster(cluster.id)}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <div className="font-medium text-sm truncate">{cluster.label}</div>
                      <div className="text-xs text-brevia-muted">
                        {cluster.documents.length} documents
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Document Details */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {filteredClusters.map((cluster: any, clusterIndex: number) => (
                <div key={cluster.id || clusterIndex}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colors[clusterIndex % colors.length] }}
                    />
                    <h2 className="text-xl font-semibold">{cluster.label}</h2>
                    <Badge variant="secondary">
                      {cluster.documents.length} documents
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {sortDocuments(cluster.documents).map((doc: any, docIndex: number) => (
                      <Card key={doc.id || docIndex} className="brevia-workbench-card">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base leading-tight pr-4">
                              {doc.title}
                            </CardTitle>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <Badge variant="outline" className="text-xs">
                                {Math.round(doc.relevance * 100)}%
                              </Badge>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Star className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-brevia-muted mb-3 line-clamp-3">
                            {doc.snippet}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-brevia-muted">
                            <div className="flex items-center space-x-4">
                              {doc.authors && (
                                <div className="flex items-center space-x-1">
                                  <User className="h-3 w-3" />
                                  <span>{doc.authors.slice(0, 2).join(', ')}</span>
                                  {doc.authors.length > 2 && <span>+{doc.authors.length - 2}</span>}
                                </div>
                              )}
                              {doc.publishedDate && (
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(doc.publishedDate).getFullYear()}</span>
                                </div>
                              )}
                              {doc.venue && (
                                <div className="flex items-center space-x-1">
                                  <FileText className="h-3 w-3" />
                                  <span>{doc.venue}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {doc.citationCount && (
                                <Badge variant="outline" className="text-xs">
                                  {doc.citationCount} citations
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

export default ClusteringResults;