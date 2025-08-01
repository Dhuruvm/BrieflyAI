import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBreviaStore } from "@/lib/store";
import { 
  Send, 
  Paperclip, 
  Mic, 
  Brain, 
  FileText, 
  Video, 
  Link,
  Sparkles,
  Plus,
  Zap,
  MessageSquare,
  Settings,
  MoreHorizontal,
  Menu,
  Sidebar,
  BarChart3,
  Network,
  Target,
  Filter,
  Download,
  ArrowLeft,
  TrendingUp,
  GitBranch,
  Layers
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  attachments?: any[];
  processing?: boolean;
}

interface ClusteringTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  results?: any;
}

export default function ClusteringAgent() {
  const [, setLocation] = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed } = useBreviaStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to the Clustering Analysis Agent. I can help you analyze document relationships, identify patterns, perform hierarchical clustering, and visualize data connections. What would you like to cluster today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [clusteringTasks, setClusteringTasks] = useState<ClusteringTask[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    const processingMessage: Message = {
      id: Date.now().toString() + '-processing',
      type: 'assistant',
      content: 'Analyzing your clustering request...',
      timestamp: new Date(),
      processing: true
    };

    setMessages(prev => [...prev, userMessage, processingMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Simulate clustering analysis
    setTimeout(() => {
      const response = generateClusteringResponse(inputValue);
      const assistantMessage: Message = {
        id: Date.now().toString() + '-response',
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => prev.filter(msg => !msg.processing).concat(assistantMessage));
      setIsProcessing(false);
    }, 2000);
  };

  const generateClusteringResponse = (query: string) => {
    const responses = [
      "I'll help you perform clustering analysis on your data. I can use hierarchical clustering, K-means, or DBSCAN algorithms depending on your needs. What type of data are you working with?",
      "For document clustering, I recommend starting with hierarchical clustering to identify natural groupings. I can analyze semantic similarities and create visualizations showing document relationships.",
      "I can perform multi-dimensional clustering analysis on your dataset. Would you like me to start with feature extraction or do you have specific clustering parameters in mind?",
      "Based on your request, I'll create a clustering workflow that includes data preprocessing, algorithm selection, and interactive visualizations. Let me know your preferred clustering method."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    {
      icon: BarChart3,
      label: "Document Clustering",
      description: "Cluster documents by semantic similarity",
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700",
      action: () => setInputValue("Help me cluster documents by semantic similarity and topic")
    },
    {
      icon: Network,
      label: "Network Analysis",
      description: "Analyze connections and relationships in data",
      color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700",
      action: () => setInputValue("Perform network analysis to identify key relationships and clusters")
    },
    {
      icon: Target,
      label: "Pattern Discovery",
      description: "Discover hidden patterns and anomalies",
      color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-700",
      action: () => setInputValue("Help me discover patterns and identify outliers in my dataset")
    }
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 h-8 w-8"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setLocation('/workspace')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-foreground">Clustering Agent</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="status-pill status-pill-online">
              <Brain className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
            <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Container - Full Screen */}
      <div className="flex-1 overflow-hidden flex mt-16">
        <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`flex w-full ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`${
                    message.type === 'user' 
                      ? 'chat-message chat-message-user' 
                      : message.type === 'system'
                      ? 'chat-message chat-message-system'
                      : 'chat-message chat-message-assistant'
                  } animate-fade-in`}>
                      {message.processing && (
                        <div className="flex items-center space-x-2 sm:space-x-3 mb-3 p-2 sm:p-3 bg-muted/50 rounded-xl sm:rounded-2xl">
                          <div className="flex space-x-1">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full"
                            />
                          </div>
                          <span className="text-xs sm:text-sm text-muted-foreground font-medium">Clustering analysis in progress...</span>
                        </div>
                      )}
                      <div className={`${
                        message.type === 'user' 
                          ? 'text-primary-foreground' 
                          : 'text-card-foreground'
                      } text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words`}>
                        {message.content.split('\n').map((line, index) => (
                          <div key={index} className={line.startsWith('**') ? 'font-semibold mt-2' : ''}>
                            {line.replace(/\*\*/g, '')}
                          </div>
                        ))}
                      </div>
                      <div className={`text-xs mt-2 sm:mt-3 ${
                        message.type === 'user' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Quick Actions for Clustering */}
            {messages.length <= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
              >
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`professional-card cursor-pointer ${action.color} border-0 animate-scale-in`}
                      onClick={action.action}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <action.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm mb-1">{action.label}</h3>
                            <p className="text-xs opacity-80 leading-relaxed">{action.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 pb-6 border-t border-border bg-background">
            <div className="max-w-4xl mx-auto">
              <div className="chat-input-container flex items-end space-x-3">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <Textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Describe your clustering analysis needs..."
                    className="min-h-[60px] max-h-32 resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:text-muted-foreground"
                    disabled={isProcessing}
                  />
                  <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                    <span>Shift+Enter for new lines</span>
                    <span>{inputValue.length}/2000</span>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isProcessing}
                  size="sm"
                  className="p-2 h-8 w-8 rounded-xl"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}