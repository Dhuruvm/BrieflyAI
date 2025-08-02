import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import brieflyLogo from "@assets/briefly-logo.png";
import { 
  BarChart3, 
  Upload, 
  Settings, 
  Download, 
  Play,
  Brain,
  Zap,
  Target,
  TrendingUp,
  GitBranch,
  Layers,
  Sparkles,
  FileText,
  Database,
  Cpu,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";

interface ClusterResult {
  id: string;
  name: string;
  size: number;
  characteristics: string[];
  color: string;
}

export default function ClusteringPage() {
  const [activeTab, setActiveTab] = useState("upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const processingSteps = [
    "Analyzing data structure",
    "Preprocessing features", 
    "Applying clustering algorithm",
    "Generating insights",
    "Creating visualizations"
  ];

  const mockClusters: ClusterResult[] = [
    {
      id: "cluster-1",
      name: "High Engagement Users",
      size: 2847,
      characteristics: ["Frequent usage", "High session duration", "Premium features"],
      color: "bg-emerald-500"
    },
    {
      id: "cluster-2", 
      name: "Casual Browsers",
      size: 1523,
      characteristics: ["Moderate usage", "Short sessions", "Basic features"],
      color: "bg-blue-500"
    },
    {
      id: "cluster-3",
      name: "Power Users",
      size: 892,
      characteristics: ["Advanced features", "API usage", "Integrations"],
      color: "bg-purple-500"
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const startClustering = () => {
    setIsProcessing(true);
    setProcessingStep(0);
    
    const interval = setInterval(() => {
      setProcessingStep(prev => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(interval);
          setIsProcessing(false);
          setActiveTab("results");
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Professional Header with Bravia Branding */}
      <div className="header-modern border-b border-border bg-card">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img 
                src={brieflyLogo} 
                alt="Bravia AI" 
                className="h-8 w-auto"
              />
              <div className="hidden sm:block w-px h-8 bg-border"></div>
            </div>
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Bravia <span className="text-primary">Cluster Analysis</span>
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Advanced AI-powered data clustering and pattern recognition
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="status-pill-success hidden sm:inline-flex">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
            <Button variant="outline" size="sm" className="hidden md:inline-flex">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content with Professional Layout */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Modern Tab Navigation */}
            <div className="mb-8">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-muted rounded-2xl">
                <TabsTrigger 
                  value="upload" 
                  className="rounded-xl py-3 px-4 data-[state=active]:bg-card data-[state=active]:shadow-md"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Data Upload</span>
                  <span className="sm:hidden">Upload</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="configure"
                  className="rounded-xl py-3 px-4 data-[state=active]:bg-card data-[state=active]:shadow-md"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Configure</span>
                  <span className="sm:hidden">Config</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="results"
                  className="rounded-xl py-3 px-4 data-[state=active]:bg-card data-[state=active]:shadow-md"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Results</span>
                  <span className="sm:hidden">Results</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="insights"
                  className="rounded-xl py-3 px-4 data-[state=active]:bg-card data-[state=active]:shadow-md"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">AI Insights</span>
                  <span className="sm:hidden">Insights</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <TabsContent value="upload" className="space-y-6 mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Upload Section */}
                  <Card className="modern-card">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg">
                        <Database className="h-5 w-5 mr-3 text-primary" />
                        Dataset Upload
                        <Badge className="ml-3 status-pill" variant="secondary">
                          Step 1
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Drag & Drop Zone */}
                        <div className="relative">
                          <input
                            type="file"
                            accept=".csv,.json,.xlsx,.xls"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className={`modern-embed border-2 border-dashed transition-all duration-300 p-8 sm:p-12 text-center hover:border-primary/50 hover:bg-primary/5 ${uploadedFile ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}`}>
                            <div className="space-y-4">
                              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                {uploadedFile ? (
                                  <CheckCircle className="h-8 w-8 text-primary" />
                                ) : (
                                  <Upload className="h-8 w-8 text-primary" />
                                )}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                  {uploadedFile ? uploadedFile.name : "Drop your dataset here"}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                  {uploadedFile 
                                    ? `File size: ${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`
                                    : "or click to browse files"
                                  }
                                </p>
                              </div>
                              {!uploadedFile && (
                                <Button variant="outline" className="mt-4">
                                  <Upload className="h-4 w-4 mr-2" />
                                  Choose File
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Supported Formats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {[
                            { icon: FileText, name: "CSV", desc: "Comma separated" },
                            { icon: Database, name: "JSON", desc: "JavaScript object" },
                            { icon: FileText, name: "Excel", desc: "XLSX/XLS files" },
                            { icon: Layers, name: "TSV", desc: "Tab separated" }
                          ].map((format, index) => (
                            <div key={index} className="p-4 border border-border rounded-xl text-center hover:bg-muted/50 transition-colors">
                              <format.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                              <div className="text-sm font-medium text-foreground">{format.name}</div>
                              <div className="text-xs text-muted-foreground">{format.desc}</div>
                            </div>
                          ))}
                        </div>

                        {uploadedFile && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="flex justify-center"
                          >
                            <Button 
                              onClick={() => setActiveTab("configure")}
                              className="btn-modern-primary"
                              size="lg"
                            >
                              Continue to Configuration
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="configure" className="space-y-6 mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Algorithm Configuration */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="modern-card">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Cpu className="h-5 w-5 mr-3 text-primary" />
                          Algorithm Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="algorithm">Clustering Algorithm</Label>
                          <Select defaultValue="kmeans">
                            <SelectTrigger className="input-modern">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kmeans">K-Means Clustering</SelectItem>
                              <SelectItem value="dbscan">DBSCAN</SelectItem>
                              <SelectItem value="hierarchical">Hierarchical</SelectItem>
                              <SelectItem value="gaussian">Gaussian Mixture</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clusters">Number of Clusters</Label>
                          <Input 
                            id="clusters" 
                            type="number" 
                            defaultValue="3"
                            className="input-modern"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="iterations">Max Iterations</Label>
                          <Input 
                            id="iterations" 
                            type="number" 
                            defaultValue="300"
                            className="input-modern"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="modern-card">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Target className="h-5 w-5 mr-3 text-primary" />
                          Feature Selection
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Features to Include</Label>
                          <Textarea 
                            placeholder="Select feature columns from your dataset..."
                            className="input-modern min-h-[100px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Normalization Method</Label>
                          <Select defaultValue="standard">
                            <SelectTrigger className="input-modern">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard Scaling</SelectItem>
                              <SelectItem value="minmax">Min-Max Scaling</SelectItem>
                              <SelectItem value="robust">Robust Scaling</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Advanced Options */}
                  <Card className="modern-card">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="h-5 w-5 mr-3 text-primary" />
                        Advanced Options
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Distance Metric</Label>
                          <Select defaultValue="euclidean">
                            <SelectTrigger className="input-modern">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="euclidean">Euclidean</SelectItem>
                              <SelectItem value="manhattan">Manhattan</SelectItem>
                              <SelectItem value="cosine">Cosine</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Initialization Method</Label>
                          <Select defaultValue="kmeans++">
                            <SelectTrigger className="input-modern">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kmeans++">K-means++</SelectItem>
                              <SelectItem value="random">Random</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Random Seed</Label>
                          <Input 
                            type="number" 
                            defaultValue="42"
                            className="input-modern"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Start Analysis Button */}
                  <Card className="modern-card border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <div className="flex items-center justify-center space-x-2 text-primary">
                          <Brain className="h-5 w-5" />
                          <span className="font-medium">Ready to start analysis</span>
                        </div>
                        <Button 
                          size="lg" 
                          className="btn-modern-primary px-8"
                          onClick={startClustering}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Play className="h-5 w-5 mr-2" />
                              Start Bravia Cluster Analysis
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="results" className="space-y-6 mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Processing State */}
                  {isProcessing && (
                    <Card className="modern-card border-primary/20 bg-primary/5">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-center space-x-3">
                            <Brain className="h-6 w-6 text-primary animate-pulse" />
                            <h3 className="text-lg font-semibold text-foreground">
                              Bravia AI is analyzing your data...
                            </h3>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {processingSteps[processingStep]}
                              </span>
                              <span className="text-primary font-medium">
                                {Math.round(((processingStep + 1) / processingSteps.length) * 100)}%
                              </span>
                            </div>
                            <Progress 
                              value={((processingStep + 1) / processingSteps.length) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Results Dashboard */}
                  {!isProcessing && (
                    <>
                      {/* Summary Cards */}
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                          { label: "Total Clusters", value: "3", icon: GitBranch, color: "text-blue-600" },
                          { label: "Data Points", value: "5,262", icon: Database, color: "text-green-600" },
                          { label: "Silhouette Score", value: "0.73", icon: Target, color: "text-purple-600" },
                          { label: "Processing Time", value: "2.4s", icon: Zap, color: "text-orange-600" }
                        ].map((stat, index) => (
                          <Card key={index} className="modern-surface">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                </div>
                                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Cluster Results */}
                      <div className="grid gap-6 lg:grid-cols-2">
                        {/* Visualization Panel */}
                        <Card className="modern-card">
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <BarChart3 className="h-5 w-5 mr-3 text-primary" />
                              Cluster Visualization
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center relative overflow-hidden">
                              {/* Mock Scatter Plot */}
                              <div className="absolute inset-4 flex items-center justify-center">
                                <div className="grid grid-cols-3 gap-8 text-center">
                                  {mockClusters.map((cluster, index) => (
                                    <div key={cluster.id} className="space-y-2">
                                      <div className={`w-12 h-12 ${cluster.color} rounded-full mx-auto opacity-80 animate-pulse`} />
                                      <div className="text-xs font-medium text-foreground">{cluster.name}</div>
                                      <div className="text-xs text-muted-foreground">{cluster.size} points</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="absolute bottom-4 right-4">
                                <Badge className="status-pill">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  Interactive
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Cluster Details */}
                        <Card className="modern-card">
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Layers className="h-5 w-5 mr-3 text-primary" />
                              Cluster Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {mockClusters.map((cluster, index) => (
                                <motion.div
                                  key={cluster.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                      <div className={`w-4 h-4 ${cluster.color} rounded-full`} />
                                      <div>
                                        <h4 className="font-semibold text-foreground">{cluster.name}</h4>
                                        <p className="text-sm text-muted-foreground">{cluster.size} data points</p>
                                      </div>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="space-y-1">
                                    {cluster.characteristics.map((char, charIndex) => (
                                      <Badge key={charIndex} variant="secondary" className="mr-2 mb-1">
                                        {char}
                                      </Badge>
                                    ))}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Export Options */}
                      <Card className="modern-card">
                        <CardContent className="pt-6">
                          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-medium text-foreground">Analysis Complete</span>
                            </div>
                            <div className="flex space-x-3">
                              <Button variant="outline" className="btn-modern-secondary">
                                <Download className="h-4 w-4 mr-2" />
                                Export Results
                              </Button>
                              <Button className="btn-modern-primary">
                                <Brain className="h-4 w-4 mr-2" />
                                View AI Insights
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6 mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* AI Insights Header */}
                  <Card className="modern-card border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary rounded-xl">
                          <Brain className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-foreground">
                            Bravia AI Insights
                          </h2>
                          <p className="text-muted-foreground">
                            Advanced pattern analysis and strategic recommendations
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Findings */}
                  <Card className="modern-card">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-3 text-primary" />
                        Key Findings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        {
                          title: "Distinct User Segments Identified",
                          description: "The analysis reveals three clearly separated user groups with unique behavioral patterns and engagement levels.",
                          icon: CheckCircle,
                          type: "success"
                        },
                        {
                          title: "High Clustering Quality",
                          description: "Silhouette score of 0.73 indicates excellent cluster separation and meaningful groupings.",
                          icon: TrendingUp,
                          type: "info"
                        },
                        {
                          title: "Optimization Opportunity",
                          description: "Casual browsers represent 29% of users but show potential for conversion to higher engagement.",
                          icon: AlertCircle,
                          type: "warning"
                        }
                      ].map((finding, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-xl border ${
                            finding.type === 'success' ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' :
                            finding.type === 'warning' ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20' :
                            'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <finding.icon className={`h-5 w-5 mt-0.5 ${
                              finding.type === 'success' ? 'text-green-600' :
                              finding.type === 'warning' ? 'text-orange-600' :
                              'text-blue-600'
                            }`} />
                            <div>
                              <h4 className="font-semibold text-foreground mb-1">{finding.title}</h4>
                              <p className="text-sm text-muted-foreground">{finding.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Strategic Recommendations */}
                  <Card className="modern-card">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Sparkles className="h-5 w-5 mr-3 text-primary" />
                        Strategic Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        {
                          title: "Personalized Engagement Strategy",
                          description: "Develop targeted campaigns for each cluster based on their unique characteristics and usage patterns.",
                          priority: "High",
                          impact: "Revenue Growth"
                        },
                        {
                          title: "Feature Development Focus",
                          description: "Prioritize advanced features that appeal to power users while improving accessibility for casual browsers.",
                          priority: "Medium", 
                          impact: "User Retention"
                        },
                        {
                          title: "Conversion Optimization",
                          description: "Create specific conversion paths to move casual browsers toward higher engagement levels.",
                          priority: "High",
                          impact: "User Growth"
                        }
                      ].map((rec, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-foreground">{rec.title}</h4>
                            <div className="flex space-x-2">
                              <Badge variant={rec.priority === 'High' ? 'destructive' : 'secondary'}>
                                {rec.priority}
                              </Badge>
                              <Badge variant="outline">{rec.impact}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Next Steps */}
                  <Card className="modern-card border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          <span className="font-semibold text-foreground">Ready for Implementation</span>
                        </div>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                          Your clustering analysis is complete. Use these insights to drive data-driven decisions and optimize your strategies.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button className="btn-modern-primary">
                            <Download className="h-4 w-4 mr-2" />
                            Export Full Report
                          </Button>
                          <Button variant="outline" className="btn-modern-secondary">
                            <Brain className="h-4 w-4 mr-2" />
                            Schedule Follow-up Analysis
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </div>
  );
}