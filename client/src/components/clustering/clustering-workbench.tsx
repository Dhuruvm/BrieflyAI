import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBreviaStore } from '@/lib/store';
import { useCreateClusteringAnalysis, useClusteringHistory, clusteringUtils } from '@/hooks/use-clustering';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import {
  Brain,
  Search,
  Settings,
  Play,
  RefreshCw,
  Download,
  BarChart3,
  TreePine,
  PieChart,
  Network,
  FileText,
  Clock,
  Zap,
  Target,
} from 'lucide-react';

import { ClusteringVisualization } from './clustering-visualization';
import { ClusteringResults } from './clustering-results';

export function ClusteringWorkbench() {
  const {
    clusteringQuery,
    clusteringAlgorithm,
    clusteringResultCount,
    clusteringDataSource,
    clusteringVisualization,
    setClusteringQuery,
    setClusteringAlgorithm,
    setClusteringResultCount,
    setClusteringDataSource,
    setClusteringVisualization,
    activeProjectId,
  } = useBreviaStore();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);

  const createAnalysis = useCreateClusteringAnalysis();
  const { data: history, isLoading: historyLoading } = useClusteringHistory(activeProjectId || '');

  const handleStartAnalysis = async () => {
    if (!clusteringQuery.trim()) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const result = await createAnalysis.mutateAsync({
        query: clusteringQuery,
        algorithm: clusteringAlgorithm,
        resultCount: clusteringResultCount,
        dataSource: clusteringDataSource,
        projectId: activeProjectId || undefined,
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setCurrentAnalysis(result);
      
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Clustering analysis failed:', error);
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const algorithmOptions = [
    { value: 'kmeans', label: 'K-Means', description: 'Fast and efficient for spherical clusters' },
    { value: 'hierarchical', label: 'Hierarchical', description: 'Great for discovering cluster hierarchies' },
    { value: 'dbscan', label: 'DBSCAN', description: 'Handles noise and arbitrary cluster shapes' },
  ];

  const dataSourceOptions = [
    { value: 'arxiv', label: 'arXiv Papers', description: '2M+ research papers' },
    { value: 'pubmed', label: 'PubMed', description: '30M+ biomedical abstracts' },
    { value: 'semantic_scholar', label: 'Semantic Scholar', description: '200M+ papers across domains' },
    { value: 'google_scholar', label: 'Google Scholar', description: 'Comprehensive academic search' },
    { value: 'project_docs', label: 'Project Documents', description: 'Your uploaded documents' },
  ];

  const visualizationOptions = [
    { value: 'sunburst', label: 'Sunburst', icon: PieChart, description: 'Hierarchical circular view' },
    { value: 'treemap', label: 'Treemap', icon: TreePine, description: 'Space-efficient rectangles' },
    { value: 'network', label: 'Network', icon: Network, description: 'Connection-based graph' },
    { value: 'list', label: 'List', icon: BarChart3, description: 'Traditional table view' },
  ];

  return (
    <div className="h-full flex flex-col bg-brevia-primary">
      {/* Header */}
      <div className="border-b border-brevia-default p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-brevia-primary" />
            <div>
              <h1 className="text-2xl font-bold text-brevia-primary">Clustering Workbench</h1>
              <p className="text-brevia-muted">Discover patterns in academic literature and documents</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Advanced
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Configuration */}
        <div className="w-96 border-r border-brevia-default bg-brevia-secondary p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Query Input */}
            <div className="space-y-3">
              <Label htmlFor="query" className="text-sm font-medium">Search Query</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brevia-muted" />
                <Input
                  id="query"
                  placeholder="e.g., large language models, neural networks..."
                  value={clusteringQuery}
                  onChange={(e) => setClusteringQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              <p className="text-xs text-brevia-muted">
                Enter keywords or phrases to search and cluster relevant documents
              </p>
            </div>

            {/* Data Source */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Data Source</Label>
              <Select value={clusteringDataSource} onValueChange={setClusteringDataSource}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dataSourceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-brevia-muted">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Algorithm Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Clustering Algorithm</Label>
              <Select value={clusteringAlgorithm} onValueChange={(value: any) => setClusteringAlgorithm(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {algorithmOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-brevia-muted">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Result Count */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Number of Results: {clusteringResultCount}
              </Label>
              <Slider
                value={[clusteringResultCount]}
                onValueChange={(value) => setClusteringResultCount(value[0])}
                max={500}
                min={10}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-brevia-muted">
                <span>10</span>
                <span>500</span>
              </div>
            </div>

            {/* Visualization Type */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Visualization</Label>
              <div className="grid grid-cols-2 gap-2">
                {visualizationOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={clusteringVisualization === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setClusteringVisualization(option.value as any)}
                    className="h-auto p-3 flex flex-col"
                  >
                    <option.icon className="h-4 w-4 mb-1" />
                    <span className="text-xs">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Start Analysis Button */}
            <Button
              onClick={handleStartAnalysis}
              disabled={!clusteringQuery.trim() || isAnalyzing}
              className="w-full h-11"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Analysis
                </>
              )}
            </Button>

            {/* Progress */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span>Processing...</span>
                    <span>{Math.round(analysisProgress)}%</span>
                  </div>
                  <Progress value={analysisProgress} className="w-full" />
                  <p className="text-xs text-brevia-muted">
                    Fetching documents and performing cluster analysis
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recent Analyses */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Recent Analyses</Label>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {history?.slice(0, 5).map((analysis: any, index: number) => (
                    <Card key={analysis.id || index} className="p-3 cursor-pointer hover:bg-brevia-tertiary transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">
                            {analysis.query || 'Untitled Analysis'}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {analysis.algorithm || 'kmeans'}
                            </Badge>
                            <span className="text-xs text-brevia-muted">
                              {analysis.clusters?.length || 0} clusters
                            </span>
                          </div>
                        </div>
                        <Clock className="h-3 w-3 text-brevia-muted ml-2 flex-shrink-0" />
                      </div>
                    </Card>
                  ))}
                  
                  {(!history || history.length === 0) && !historyLoading && (
                    <p className="text-xs text-brevia-muted text-center py-4">
                      No analyses yet. Start your first clustering analysis above.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentAnalysis ? (
            <Tabs defaultValue="visualization" className="flex-1 flex flex-col">
              <div className="border-b border-brevia-default px-6 py-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="visualization" className="flex items-center space-x-2">
                    <PieChart className="h-4 w-4" />
                    <span>Visualization</span>
                  </TabsTrigger>
                  <TabsTrigger value="results" className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Results</span>
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="flex items-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span>Insights</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="visualization" className="flex-1 m-0">
                <ClusteringVisualization 
                  analysis={currentAnalysis}
                  visualizationType={clusteringVisualization}
                />
              </TabsContent>
              
              <TabsContent value="results" className="flex-1 m-0">
                <ClusteringResults analysis={currentAnalysis} />
              </TabsContent>
              
              <TabsContent value="insights" className="flex-1 m-0 p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Analysis Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Cluster Quality</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-brevia-success">85%</div>
                        <p className="text-xs text-brevia-muted">Well-separated clusters</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Coverage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-brevia-primary">
                          {currentAnalysis.metadata?.totalDocuments || 0}
                        </div>
                        <p className="text-xs text-brevia-muted">Documents analyzed</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Processing Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-brevia-accent">
                          {currentAnalysis.metadata?.processingTime || 0}s
                        </div>
                        <p className="text-xs text-brevia-muted">Analysis duration</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center space-y-4 max-w-md">
                <div className="w-16 h-16 bg-brevia-secondary rounded-full flex items-center justify-center mx-auto">
                  <Brain className="h-8 w-8 text-brevia-primary" />
                </div>
                <h3 className="text-lg font-semibold">Ready to Start Clustering</h3>
                <p className="text-brevia-muted">
                  Configure your analysis parameters and click "Start Analysis" to discover patterns 
                  in academic literature and research documents.
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-brevia-muted">
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4" />
                    <span>Smart clustering</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4" />
                    <span>Real-time analysis</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClusteringWorkbench;