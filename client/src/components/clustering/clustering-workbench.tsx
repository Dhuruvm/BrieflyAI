import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Settings,
  Play,
  BarChart3,
  Network,
  Download,
  RefreshCw,
  Brain,
  ArrowLeft
} from 'lucide-react';

export function ClusteringWorkbench() {
  const [query, setQuery] = useState('');
  const [algorithm, setAlgorithm] = useState('hierarchical');
  const [resultCount, setResultCount] = useState(100);
  const [dataSource, setDataSource] = useState('pubmed');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();

  // Mock analysis data for demo
  const mockAnalysis = {
    id: 'demo-analysis',
    clusters: [
      {
        id: 'cluster-1',
        label: 'Machine Learning Research',
        color: '#3b82f6',
        documents: [
          {
            id: 'doc-1',
            title: 'Deep Learning Applications in Healthcare',
            snippet: 'A comprehensive review of neural networks in medical diagnosis...',
            authors: ['Smith, J.', 'Doe, A.'],
            venue: 'Nature Medicine',
            citationCount: 245,
            relevance: 0.92
          },
          {
            id: 'doc-2',
            title: 'Transformer Networks for Medical Image Analysis',
            snippet: 'Novel transformer architectures for analyzing radiological images...',
            authors: ['Johnson, K.', 'Lee, M.'],
            venue: 'Medical Image Analysis',
            citationCount: 189,
            relevance: 0.87
          }
        ]
      },
      {
        id: 'cluster-2',
        label: 'Clinical Applications',
        color: '#10b981',
        documents: [
          {
            id: 'doc-3',
            title: 'AI-Powered Diagnostic Tools in Emergency Medicine',
            snippet: 'Implementation of machine learning systems in emergency departments...',
            authors: ['Brown, S.', 'Wilson, T.'],
            venue: 'Emergency Medicine Journal',
            citationCount: 156,
            relevance: 0.84
          }
        ]
      }
    ],
    metadata: {
      totalDocuments: 150,
      processingTime: 4.2,
      accuracy: 95.2
    }
  };

  const runAnalysis = async () => {
    if (!query.trim()) return;
    
    setIsAnalyzing(true);
    setProgress(0);
    setCurrentStep('Initializing analysis...');

    const steps = [
      'Searching research papers...',
      'Extracting key concepts...',
      'Computing similarity matrices...',
      'Performing clustering analysis...',
      'Generating visualizations...',
      'Finalizing results...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i]);
      setProgress((i + 1) * (100 / steps.length));
      await new Promise(resolve => setTimeout(resolve, 1200));
    }

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
    setCurrentStep('Analysis complete');
    
    toast({
      title: "Analysis Complete!",
      description: `Found ${mockAnalysis.clusters.length} clusters from ${mockAnalysis.metadata.totalDocuments} documents`
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      {/* Professional Header - Mobile-First Design */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
                  <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm sm:text-lg font-semibold text-foreground truncate">Clustering Analysis</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">AI-powered data clustering</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              <Badge className="status-pill status-pill-success text-xs px-2 py-1">
                <Brain className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">AI Powered</span>
                <span className="sm:hidden">AI</span>
              </Badge>
              <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Professional Mobile-First Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Professional Search and Input Section */}
          <div className="bg-card border border-border rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-foreground">Search & Configure Analysis</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Configure your clustering parameters</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Search Query</label>
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your research topic..."
                    className="w-full h-10 sm:h-11 rounded-xl border-border focus:border-primary transition-colors"
                    onKeyPress={(e) => e.key === 'Enter' && runAnalysis()}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Algorithm</label>
                  <Select value={algorithm} onValueChange={setAlgorithm}>
                    <SelectTrigger className="h-10 sm:h-11 rounded-xl border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hierarchical">Hierarchical</SelectItem>
                      <SelectItem value="kmeans">K-Means</SelectItem>
                      <SelectItem value="dbscan">DBSCAN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Data Source</label>
                  <Select value={dataSource} onValueChange={setDataSource}>
                    <SelectTrigger className="h-10 sm:h-11 rounded-xl border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pubmed">PubMed</SelectItem>
                      <SelectItem value="arxiv">arXiv</SelectItem>
                      <SelectItem value="custom">Custom Dataset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Results: {resultCount}</span>
                  <Slider
                    value={[resultCount]}
                    onValueChange={(value) => setResultCount(value[0])}
                    max={1000}
                    min={10}
                    step={10}
                    className="w-24 sm:w-32"
                  />
                </div>
                
                <Button
                  onClick={runAnalysis}
                  disabled={!query.trim() || isAnalyzing}
                  className="px-4 sm:px-6 h-10 sm:h-11 bg-primary hover:bg-primary/90 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isAnalyzing ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                      </motion.div>
                      <span className="hidden sm:inline">Analyzing...</span>
                      <span className="sm:hidden">Analyzing</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Start Analysis</span>
                      <span className="sm:hidden">Start</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Progress Bar */}
              {isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="p-3 sm:p-4 bg-muted/50 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{currentStep}</span>
                    <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="h-2 sm:h-2.5" />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Results Display */}
          {analysis ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground">Analysis Results</h3>
                <Button variant="outline" size="sm" className="text-muted-foreground">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              
              {analysis.clusters.map((cluster: any, index: number) => (
                <motion.div
                  key={cluster.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="bg-card border border-border rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: cluster.color }}
                        />
                        <CardTitle className="text-base sm:text-lg text-foreground">{cluster.label}</CardTitle>
                        <Badge variant="secondary" className="bg-muted text-xs">
                          {cluster.documents.length} docs
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {cluster.documents.map((doc: any) => (
                          <div key={doc.id} className="p-3 sm:p-4 bg-muted/30 rounded-xl">
                            <h4 className="font-semibold text-sm sm:text-base text-foreground mb-2">{doc.title}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-2">{doc.snippet}</p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span>{doc.authors.join(', ')}</span>
                              <span>•</span>
                              <span>{doc.venue}</span>
                              <span>•</span>
                              <span>{doc.citationCount} citations</span>
                              <span>•</span>
                              <span className="font-medium text-primary">{(doc.relevance * 100).toFixed(1)}% relevant</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : !isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-8 sm:py-12"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl flex items-center justify-center mb-4 sm:mb-6 mx-auto animate-pulse-gentle">
                <Network className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">Ready for Analysis</h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto px-4">
                Enter a research query above to discover clusters and relationships in academic literature using AI-powered analysis.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ClusteringWorkbench;