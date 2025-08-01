import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ExternalLink,
  Download,
  BookOpen,
  Calendar,
  Users,
  TrendingUp,
  Star,
  Eye,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share
} from 'lucide-react';

interface ClusteringResultsProps {
  analysis: any;
}

export default function ClusteringResults({ analysis }: ClusteringResultsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [filterCluster, setFilterCluster] = useState('all');
  const [expandedClusters, setExpandedClusters] = useState<Set<string>>(new Set());

  const toggleCluster = (clusterId: string) => {
    const newExpanded = new Set(expandedClusters);
    if (newExpanded.has(clusterId)) {
      newExpanded.delete(clusterId);
    } else {
      newExpanded.add(clusterId);
    }
    setExpandedClusters(newExpanded);
  };

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 0.8) return 'text-emerald-400 bg-emerald-400/20';
    if (relevance >= 0.6) return 'text-yellow-400 bg-yellow-400/20';
    return 'text-orange-400 bg-orange-400/20';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950">
      {/* Header Controls */}
      <div className="delv-header p-6 border-b border-zinc-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="delv-title">Research Results</h2>
            <p className="delv-caption mt-1">
              {analysis.clusters.reduce((sum: number, cluster: any) => sum + cluster.documents.length, 0)} papers across {analysis.clusters.length} clusters
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button className="delv-button-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button className="delv-button-secondary">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search papers, authors, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="delv-input pl-10"
            />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="delv-select w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="relevance" className="text-zinc-100 focus:bg-zinc-700">Relevance</SelectItem>
              <SelectItem value="date" className="text-zinc-100 focus:bg-zinc-700">Publication Date</SelectItem>
              <SelectItem value="citations" className="text-zinc-100 focus:bg-zinc-700">Citations</SelectItem>
              <SelectItem value="title" className="text-zinc-100 focus:bg-zinc-700">Title A-Z</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCluster} onValueChange={setFilterCluster}>
            <SelectTrigger className="delv-select w-48">
              <SelectValue placeholder="Filter by cluster" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="all" className="text-zinc-100 focus:bg-zinc-700">All Clusters</SelectItem>
              {analysis.clusters.map((cluster: any) => (
                <SelectItem key={cluster.id} value={cluster.id} className="text-zinc-100 focus:bg-zinc-700">
                  {cluster.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {analysis.clusters.map((cluster: any) => (
            <div key={cluster.id} className="delv-card">
              {/* Cluster Header */}
              <div 
                className="p-4 border-b border-zinc-700/50 cursor-pointer hover:bg-zinc-800/30 transition-colors"
                onClick={() => toggleCluster(cluster.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cluster.color }}
                    />
                    <div>
                      <h3 className="delv-subtitle">{cluster.label}</h3>
                      <p className="delv-caption mt-1">
                        {cluster.documents.length} papers • Cluster {cluster.id.split('-')[1]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={`${getRelevanceColor(cluster.documents[0]?.relevance || 0)} border-0`}>
                      Avg {((cluster.documents.reduce((sum: number, doc: any) => sum + doc.relevance, 0) / cluster.documents.length) * 100).toFixed(0)}% relevance
                    </Badge>
                    {expandedClusters.has(cluster.id) ? (
                      <ChevronUp className="h-4 w-4 text-zinc-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-zinc-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Documents */}
              {expandedClusters.has(cluster.id) && (
                <div className="divide-y divide-zinc-700/30">
                  {cluster.documents.map((document: any) => (
                    <div key={document.id} className="p-6 hover:bg-zinc-800/20 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0 mr-4">
                          <h4 className="font-semibold text-zinc-100 mb-2 line-clamp-2 hover:text-emerald-300 transition-colors cursor-pointer">
                            {document.title}
                          </h4>
                          <p className="delv-body mb-3 line-clamp-3">
                            {document.snippet}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Badge className={`${getRelevanceColor(document.relevance)} border-0 text-xs`}>
                            {(document.relevance * 100).toFixed(0)}%
                          </Badge>
                          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-xs text-zinc-400">
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{document.authors.join(', ')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(document.publishedDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-3 w-3" />
                            <span>{document.venue}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{document.citationCount} citations</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="delv-header p-4 border-t border-zinc-700/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <span className="delv-caption">
              {analysis.clusters.length} clusters found
            </span>
            <span className="delv-caption">
              {analysis.clusters.reduce((sum: number, cluster: any) => sum + cluster.documents.length, 0)} total papers
            </span>
            <span className="delv-caption">
              Processed in {analysis.metadata?.processingTime || 421}ms
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="delv-caption">Algorithm:</span>
            <Badge variant="outline" className="border-zinc-600 text-zinc-300 text-xs">
              {analysis.metadata?.algorithm || 'Hierarchical'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}