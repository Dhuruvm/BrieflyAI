import { useState, useEffect } from 'react';
import { useBreviaStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import ClusteringVisualization from './clustering-visualization';
import ClusteringResults from './clustering-results';
import {
  Search,
  Settings,
  Play,
  BarChart3,
  TreePine,
  Network,
  List,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Database,
  Clock,
  TrendingUp,
  Target,
  Sparkles,
  Brain,
  BookOpen,
  FileText,
  Globe
} from 'lucide-react';

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
  } = useBreviaStore();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);

  // Mock analysis data
  const mockAnalysis = {
    id: 'analysis-1',
    clusters: [
      {
        id: 'cluster-1',
        label: 'Retinal Cell Regeneration',
        documents: [
          {
            id: 'doc-1',
            title: 'Sub-Retinal Delivery of Human Embryonic Stem Cell Derived Progenitor in r510 Mice',
            snippet: 'Regeneration of photoreceptor cells using human pluripotent stem cells as a promising therapy for retinal degenerative diseases at advanced stages...',
            relevance: 0.94,
            authors: ['Zhang et al.'],
            publishedDate: '2023-03-15',
            venue: 'JOVE',
            citationCount: 23
          },
          {
            id: 'doc-2',
            title: 'Therapeutic strategies for glaucoma and optic neuropathies',
            snippet: 'Glaucoma is a neurodegenerative eye disease that causes permanent vision impairment. The main pathological characteristics of glaucoma are...',
            relevance: 0.87,
            authors: ['Smith et al.'],
            publishedDate: '2023-02-28',
            venue: 'Molecular Medicine',
            citationCount: 45
          }
        ],
        color: '#ef4444'
      },
      {
        id: 'cluster-2',
        label: 'Clinical Trials & Treatments',
        documents: [
          {
            id: 'doc-3',
            title: 'RPE Transplantation for AMD',
            snippet: 'Clinical trials examining retinal pigment epithelium transplantation as a treatment for age-related macular degeneration...',
            relevance: 0.82,
            authors: ['Johnson et al.'],
            publishedDate: '2023-01-12',
            venue: 'Clinical Trials',
            citationCount: 67
          }
        ],
        color: '#10b981'
      },
      {
        id: 'cluster-3',
        label: 'Stem Cell Therapy',
        documents: [
          {
            id: 'doc-4',
            title: 'Organoid Cell Therapy Applications',
            snippet: 'Development of organoid-based therapeutic approaches for retinal diseases using stem cell technology...',
            relevance: 0.79,
            authors: ['Lee et al.'],
            publishedDate: '2023-04-20',
            venue: 'Nature Medicine',
            citationCount: 89
          }
        ],
        color: '#f59e0b'
      }
    ],
    metadata: {
      totalDocuments: 100,
      processingTime: 421,
      algorithm: 'hierarchical',
      parameters: { clusters: 3, similarity_threshold: 0.7 }
    }
  };

  const dataSources = [
    { value: 'arxiv', label: 'arXiv', icon: BookOpen, description: 'Computer Science & Physics' },
    { value: 'pubmed', label: 'PubMed', icon: FileText, description: 'Medical & Life Sciences' },
    { value: 'semantic', label: 'Semantic Scholar', icon: Brain, description: 'Cross-disciplinary' },
    { value: 'crossref', label: 'CrossRef', icon: Globe, description: 'Academic Publications' }
  ];

  const visualizationTypes = [
    { value: 'sunburst', label: 'Sunburst', icon: Target, description: 'Hierarchical view' },
    { value: 'treemap', label: 'Treemap', icon: BarChart3, description: 'Area-based clusters' },
    { value: 'network', label: 'Network', icon: Network, description: 'Relationship graph' },
    { value: 'list', label: 'List', icon: List, description: 'Detailed breakdown' }
  ];

  const runAnalysis = async () => {
    if (!clusteringQuery.trim()) return;

    setIsAnalyzing(true);
    setProgress(0);
    setCurrentStep('Initializing search...');

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
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
    setCurrentStep('Analysis complete');
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950">
      {/* Header */}
      <div className="delv-header p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center delv-glow">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="delv-title">Clustering Workbench</h1>
                <p className="delv-caption">AI-powered research clustering & analysis</p>
              </div>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Enhanced
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            <div className="delv-stats-card px-4 py-2">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="delv-metric text-lg">100</span>
                  <span className="delv-metric-label">Results</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="delv-metric text-lg">31</span>
                  <span className="delv-metric-label">Clusters</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="delv-metric text-lg">89.0%</span>
                  <span className="delv-metric-label">Clustered Docs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="delv-metric text-lg">421ms</span>
                  <span className="delv-metric-label">Clustering Time</span>
                </div>
              </div>
            </div>
            <Button className="delv-button-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <Input
              placeholder="Enter research query (e.g., 'treating retinal degenerations with stem cells')"
              value={clusteringQuery}
              onChange={(e) => setClusteringQuery(e.target.value)}
              className="delv-input pl-12 h-12 text-base"
            />
          </div>
          <Button 
            onClick={runAnalysis}
            disabled={isAnalyzing || !clusteringQuery.trim()}
            className="delv-button-primary h-12 px-8"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Cluster
              </>
            )}
          </Button>
        </div>

        {/* Progress Bar */}
        {isAnalyzing && (
          <div className="mt-4 delv-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="delv-body">{currentStep}</span>
              <span className="delv-caption">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Configuration Panel */}
        <div className="w-80 delv-sidebar border-r border-zinc-700/50 p-6">
          <div className="space-y-6">
            {/* Data Source */}
            <div>
              <label className="delv-metric-label mb-3 block">Data Source</label>
              <Select value={clusteringDataSource} onValueChange={setClusteringDataSource}>
                <SelectTrigger className="delv-select">
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {dataSources.map((source) => (
                    <SelectItem key={source.value} value={source.value} className="text-zinc-100 focus:bg-zinc-700">
                      <div className="flex items-center space-x-3">
                        <source.icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{source.label}</div>
                          <div className="text-xs text-zinc-400">{source.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clustering Algorithm */}
            <div>
              <label className="delv-metric-label mb-3 block">Clustering Algorithm</label>
              <Select value={clusteringAlgorithm} onValueChange={setClusteringAlgorithm}>
                <SelectTrigger className="delv-select">
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="kmeans" className="text-zinc-100 focus:bg-zinc-700">K-Means</SelectItem>
                  <SelectItem value="hierarchical" className="text-zinc-100 focus:bg-zinc-700">Hierarchical</SelectItem>
                  <SelectItem value="dbscan" className="text-zinc-100 focus:bg-zinc-700">DBSCAN</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Max Results */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="delv-metric-label">Max Results</label>
                <span className="text-emerald-400 font-semibold">{clusteringResultCount}</span>
              </div>
              <Slider
                value={[clusteringResultCount]}
                onValueChange={(value) => setClusteringResultCount(value[0])}
                max={500}
                min={10}
                step={10}
                className="delv-fade-in"
              />
              <div className="flex justify-between text-xs text-zinc-500 mt-1">
                <span>10</span>
                <span>500</span>
              </div>
            </div>

            {/* Visualization Type */}
            <div>
              <label className="delv-metric-label mb-3 block">Visualization</label>
              <div className="grid grid-cols-2 gap-2">
                {visualizationTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={clusteringVisualization === type.value ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setClusteringVisualization(type.value as any)}
                    className={`h-auto p-3 flex flex-col items-center space-y-1 ${
                      clusteringVisualization === type.value 
                        ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                    }`}
                  >
                    <type.icon className="h-4 w-4" />
                    <span className="text-xs font-medium">{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="delv-card p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Settings className="h-4 w-4 text-zinc-400" />
                <span className="delv-metric-label">Advanced</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="delv-body">Auto-cluster</span>
                  <div className="w-10 h-5 bg-emerald-500 rounded-full flex items-center justify-end pr-1">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="delv-body">Filter duplicates</span>
                  <div className="w-10 h-5 bg-emerald-500 rounded-full flex items-center justify-end pr-1">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {analysis ? (
            <Tabs defaultValue="visualization" className="flex-1 flex flex-col">
              <div className="border-b border-zinc-700/50 px-6 py-3">
                <TabsList className="bg-zinc-800/50 border border-zinc-700/50">
                  <TabsTrigger value="visualization" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Visualization
                  </TabsTrigger>
                  <TabsTrigger value="results" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                    <List className="h-4 w-4 mr-2" />
                    Results
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="visualization" className="flex-1 m-0">
                <ClusteringVisualization 
                  analysis={analysis}
                  visualizationType={clusteringVisualization}
                />
              </TabsContent>

              <TabsContent value="results" className="flex-1 m-0">
                <ClusteringResults analysis={analysis} />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex-1 flex items-center justify-center p-12">
              <div className="text-center space-y-6 max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full flex items-center justify-center mx-auto delv-glow">
                  <Target className="h-12 w-12 text-emerald-400" />
                </div>
                <div>
                  <h3 className="delv-title mb-2">Ready to Cluster</h3>
                  <p className="delv-body">
                    Enter a research query above to start AI-powered clustering analysis. 
                    Our system will find relevant papers and group them by themes.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="delv-card p-3">
                    <Zap className="h-5 w-5 text-emerald-400 mb-2" />
                    <div className="delv-caption">Fast AI Analysis</div>
                  </div>
                  <div className="delv-card p-3">
                    <TrendingUp className="h-5 w-5 text-blue-400 mb-2" />
                    <div className="delv-caption">Smart Clustering</div>
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