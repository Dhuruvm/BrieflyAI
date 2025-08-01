import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Settings,
  Play,
  BarChart3,
  Network,
  List,
  Download,
  RefreshCw,
  Brain,
  BookOpen,
  FileText,
  Globe,
  ArrowLeft,
  Target,
  Sparkles,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function ClusteringWorkbench() {
  const [query, setQuery] = useState('');
  const [algorithm, setAlgorithm] = useState('hierarchical');
  const [resultCount, setResultCount] = useState(100);
  const [dataSource, setDataSource] = useState('pubmed');
  const [visualization, setVisualization] = useState('network');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();

  // Initialize with sample data for demo
  useEffect(() => {
    // Load sample clustering analysis after a delay
    setTimeout(() => {
      setAnalysis({
        id: 'demo-analysis',
        clusters: [
          {
            id: 'cluster-1',
            label: 'Machine Learning Research',
            documents: [
              {
                id: 'doc-1',
                title: 'Deep Learning Approaches in Medical Diagnosis',
                snippet: 'Comprehensive review of deep learning methodologies applied to medical imaging and diagnosis...',
                relevance: 0.95,
                authors: ['Smith et al.'],
                publishedDate: '2024-01-15',
                venue: 'Nature Medicine',
                citationCount: 245
              },
              {
                id: 'doc-2',
                title: 'Neural Networks for Predictive Healthcare Analytics',
                snippet: 'Analysis of neural network architectures for predicting patient outcomes in healthcare settings...',
                relevance: 0.92,
                authors: ['Johnson et al.'],
                publishedDate: '2023-11-20',
                venue: 'Journal of Medical Internet Research',
                citationCount: 178
              }
            ],
            color: '#3b82f6'
          },
          {
            id: 'cluster-2',
            label: 'Clinical Applications',
            documents: [
              {
                id: 'doc-3',
                title: 'AI-Powered Clinical Decision Support Systems',
                snippet: 'Implementation and evaluation of artificial intelligence systems in clinical workflows...',
                relevance: 0.88,
                authors: ['Brown et al.'],
                publishedDate: '2023-12-10',
                venue: 'The Lancet Digital Health',
                citationCount: 156
              }
            ],
            color: '#10b981'
          },
          {
            id: 'cluster-3',
            label: 'Data Processing & Ethics',
            documents: [
              {
                id: 'doc-4',
                title: 'Privacy-Preserving Medical Data Processing',
                snippet: 'Techniques for processing sensitive medical data while maintaining patient privacy...',
                relevance: 0.85,
                authors: ['Lee et al.'],
                publishedDate: '2023-09-20',
                venue: 'Science',
                citationCount: 134
              }
            ],
            color: '#f59e0b'
          }
        ],
        metadata: {
          totalDocuments: 847,
          processingTime: 2.3,
          algorithm: 'hierarchical',
          parameters: { clusters: 3, similarity_threshold: 0.75 }
        }
      });
    }, 1500);
  }, []);

  // Mock analysis data with ChatGPT-style structure
  const mockAnalysis = {
    id: 'analysis-1',
    clusters: [
      {
        id: 'cluster-1',
        label: 'Neural Networks & AI',
        documents: [
          {
            id: 'doc-1',
            title: 'Deep Learning Applications in Medical Imaging',
            snippet: 'Advanced neural network architectures for medical image analysis and diagnosis...',
            relevance: 0.94,
            authors: ['Zhang et al.'],
            publishedDate: '2023-12-15',
            venue: 'Nature Medicine',
            citationCount: 156
          },
          {
            id: 'doc-2',
            title: 'Transformer Models for Healthcare',
            snippet: 'Application of transformer architectures in healthcare data processing and analysis...',
            relevance: 0.91,
            authors: ['Smith et al.'],
            publishedDate: '2023-11-28',
            venue: 'JAMA',
            citationCount: 203
          }
        ],
        color: '#3b82f6'
      },
      {
        id: 'cluster-2',
        label: 'Clinical Applications',
        documents: [
          {
            id: 'doc-3',
            title: 'AI-Assisted Diagnosis in Primary Care',
            snippet: 'Implementation of AI diagnostic tools in primary healthcare settings...',
            relevance: 0.88,
            authors: ['Johnson et al.'],
            publishedDate: '2023-10-12',
            venue: 'The Lancet',
            citationCount: 89
          }
        ],
        color: '#10b981'
      },
      {
        id: 'cluster-3',
        label: 'Data Processing',
        documents: [
          {
            id: 'doc-4',
            title: 'Large-Scale Medical Data Processing',
            snippet: 'Scalable approaches for processing and analyzing large medical datasets...',
            relevance: 0.85,
            authors: ['Lee et al.'],
            publishedDate: '2023-09-20',
            venue: 'Science',
            citationCount: 134
          }
        ],
        color: '#f59e0b'
      }
    ],
    metadata: {
      totalDocuments: 847,
      processingTime: 2.3,
      algorithm: 'hierarchical',
      parameters: { clusters: 3, similarity_threshold: 0.75 }
    }
  };

  const dataSources = [
    { value: 'pubmed', label: 'PubMed', icon: FileText, description: 'Medical & Life Sciences' },
    { value: 'arxiv', label: 'arXiv', icon: BookOpen, description: 'Computer Science & Physics' },
    { value: 'semantic', label: 'Semantic Scholar', icon: Brain, description: 'Cross-disciplinary' },
    { value: 'crossref', label: 'CrossRef', icon: Globe, description: 'Academic Publications' }
  ];

  const visualizationTypes = [
    { value: 'network', label: 'Network', icon: Network, description: 'Relationship graph' },
    { value: 'treemap', label: 'Treemap', icon: BarChart3, description: 'Area-based clusters' },
    { value: 'list', label: 'List', icon: List, description: 'Detailed breakdown' },
    { value: 'sunburst', label: 'Sunburst', icon: Target, description: 'Hierarchical view' }
  ];

  const runAnalysis = async () => {
    if (!query.trim()) {
      toast({
        title: "Enter a search query",
        description: "Please enter a research topic to analyze",
        variant: "destructive"
      });
      return;
    }

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
    <div className="min-h-screen bg-background">
      {/* Professional Header - ChatGPT Style */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Clustering Analysis</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">AI-powered data clustering</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className="status-pill status-pill-online">
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
      </div>

      {/* Professional Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        {/* Professional Search and Input Section */}
        <div className="space-y-6">
          <div className="chat-input-container p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium text-foreground">Search & Configure Analysis</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Search Query</label>
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your research topic..."
                    className="w-full"
                    onKeyPress={(e) => e.key === 'Enter' && runAnalysis()}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Algorithm</label>
                  <Select value={algorithm} onValueChange={setAlgorithm}>
                    <SelectTrigger>
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
                    <SelectTrigger>
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
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">Results: {resultCount}</span>
                  <Slider
                    value={[resultCount]}
                    onValueChange={(value) => setResultCount(value[0])}
                    max={1000}
                    min={10}
                    step={10}
                    className="w-32"
                  />
                </div>
                
                <Button
                  onClick={runAnalysis}
                  disabled={!query.trim() || isAnalyzing}
                  className="px-6 bg-primary hover:bg-primary/90"
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
              </div>

              {/* Progress Bar */}
              {isAnalyzing && (
                <div className="mt-4 p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground font-medium">{currentStep}</span>
                    <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </div>
          </div>

          {/* Results Display */}
          {analysis ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">Analysis Results</h3>
                <Button variant="outline" size="sm" className="text-muted-foreground">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              
              {analysis.clusters.map((cluster: any, index: number) => (
                <Card key={cluster.id} className="professional-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: cluster.color }}
                      />
                      <CardTitle className="text-lg text-foreground">{cluster.label}</CardTitle>
                      <Badge variant="secondary" className="bg-muted">
                        {cluster.documents.length} docs
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {cluster.documents.map((doc: any) => (
                        <div key={doc.id} className="p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-semibold text-foreground mb-2">{doc.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{doc.snippet}</p>
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
              ))}
            </div>
          ) : !isAnalyzing && (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Network className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Ready for Analysis</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enter a research query above to discover clusters and relationships in academic literature using AI-powered analysis.
              </p>
            </div>
          )}
        </div>

        {/* Configuration Panel - Mobile Collapsible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="modern-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-foreground">Configuration</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="md:hidden rounded-2xl h-10 w-10 p-0 hover:bg-muted/50"
                >
                  {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className={`${showAdvanced ? 'block' : 'hidden md:block'} pt-0`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Data Source */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Data Source</label>
                  <Select value={dataSource} onValueChange={setDataSource}>
                    <SelectTrigger className="modern-surface h-12">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataSources.map((source) => (
                        <SelectItem key={source.value} value={source.value}>
                          <div className="flex items-center space-x-2">
                            <source.icon className="h-4 w-4" />
                            <span>{source.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Algorithm */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Algorithm</label>
                  <Select value={algorithm} onValueChange={setAlgorithm}>
                    <SelectTrigger className="border-slate-300 dark:border-slate-600">
                      <SelectValue placeholder="Select algorithm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kmeans">K-Means</SelectItem>
                      <SelectItem value="hierarchical">Hierarchical</SelectItem>
                      <SelectItem value="dbscan">DBSCAN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Max Results */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Max Results</label>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{resultCount}</span>
                  </div>
                  <Slider
                    value={[resultCount]}
                    onValueChange={(value) => setResultCount(value[0])}
                    max={500}
                    min={10}
                    step={10}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>10</span>
                    <span>500</span>
                  </div>
                </div>

                {/* Visualization */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Visualization</label>
                  <Select value={visualization} onValueChange={setVisualization}>
                    <SelectTrigger className="border-slate-300 dark:border-slate-600">
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      {visualizationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <type.icon className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        {analysis ? (
          <div className="space-y-6 animate-fade-in">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analysis.metadata.totalDocuments}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Documents</div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{analysis.clusters.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Clusters</div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">95.2%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{analysis.metadata.processingTime}s</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
                </CardContent>
              </Card>
            </div>

            {/* Clusters */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Discovered Clusters</h3>
                <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-400">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              
              {analysis.clusters.map((cluster: any, index: number) => (
                <Card key={cluster.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: cluster.color }}
                      />
                      <CardTitle className="text-lg text-gray-900 dark:text-white">{cluster.label}</CardTitle>
                      <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700">
                        {cluster.documents.length} docs
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {cluster.documents.map((doc: any) => (
                        <div key={doc.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{doc.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{doc.snippet}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{doc.authors.join(', ')}</span>
                            <span>•</span>
                            <span>{doc.venue}</span>
                            <span>•</span>
                            <span>{doc.citationCount} citations</span>
                            <span>•</span>
                            <span className="font-medium text-blue-600 dark:text-blue-400">{(doc.relevance * 100).toFixed(1)}% relevant</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : !isAnalyzing && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl flex items-center justify-center mb-6 mx-auto animate-pulse-gentle">
              <Network className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Ready for Analysis</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Enter a research query above to discover clusters and relationships in academic literature using AI-powered analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClusteringWorkbench;