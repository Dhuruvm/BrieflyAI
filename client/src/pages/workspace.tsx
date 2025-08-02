import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import { useBreviaStore } from "@/lib/store";
import brieflyLogo from "@assets/briefly-logo.png";
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
  User,
  Bot,
  Clock,
  Check,
  Upload,
  Image,
  Cpu,
  Target
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  attachments?: any[];
  processing?: boolean;
}

export default function Workspace() {
  const [, setLocation] = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed } = useBreviaStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to your Bravia AI Research Assistant. I can analyze documents, generate intelligent insights, perform advanced clustering analysis, and help with complex research tasks. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  const processMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/process", {
        content,
        contentType: "text",
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Add assistant response
      const assistantMessage: Message = {
        id: Date.now().toString() + '-assistant',
        type: 'assistant',
        content: `I've analyzed your content and generated structured notes. Here's what I found:

**Title:** ${data.title}

**Summary:** ${data.summary}

**Key Points:**
${data.keyPoints.map((point: string, i: number) => `${i + 1}. ${point}`).join('\n')}

**Action Items:**
${data.actionItems.map((item: string, i: number) => `• ${item}`).join('\n')}

Would you like me to export this as a PDF or perform any additional analysis?`,
        timestamp: new Date()
      };

      setMessages(prev => prev.map(msg => 
        msg.processing ? { ...msg, processing: false } : msg
      ).concat(assistantMessage));
      setIsProcessing(false);
    },
    onError: (error: Error) => {
      // Remove processing message and add error message
      setMessages(prev => {
        const newMessages = prev.filter(msg => !msg.processing);
        const errorMessage: Message = {
          id: Date.now().toString() + '-error',
          type: 'assistant',
          content: 'I encountered an issue processing your request. This might be due to API configuration or network connectivity. Please check that your API keys are properly configured and try again.',
          timestamp: new Date()
        };
        return [...newMessages, errorMessage];
      });
      setIsProcessing(false);
      console.error('Processing error:', error);
    }
  });

  const handleSendMessage = () => {
    if (!inputValue.trim() || isProcessing) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    // Add processing message
    const processingMessage: Message = {
      id: Date.now().toString() + '-processing',
      type: 'assistant',
      content: 'Analyzing your content...',
      timestamp: new Date(),
      processing: true
    };

    setMessages(prev => [...prev, userMessage, processingMessage]);
    setIsProcessing(true);

    // Process the message
    processMessageMutation.mutate(inputValue.trim());
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    {
      icon: Brain,
      label: "Document Analysis",
      description: "Analyze and extract insights from documents with Bravia AI",
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700",
      action: () => setInputValue("Help me analyze a document and extract key insights using Bravia AI")
    },
    {
      icon: BarChart3,
      label: "Cluster Analysis",
      description: "Perform advanced data clustering with Bravia intelligence",
      color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700",
      action: () => setLocation('/clustering')
    },
    {
      icon: Sparkles,
      label: "Research Assistant",
      description: "Get expert help with complex research using Bravia AI",
      color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-700",
      action: () => setInputValue("I need help with a research project. Can Bravia AI assist me?")
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Professional Header with Bravia Branding */}
      <div className="header-modern border-b border-border bg-card sticky top-0 z-50">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted md:hidden"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <img 
                src={brieflyLogo} 
                alt="Bravia AI" 
                className="h-8 w-auto"
              />
              <div className="hidden sm:block w-px h-8 bg-border"></div>
            </div>
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Bravia <span className="text-primary">Assistant</span>
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Advanced AI research and analysis platform
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="status-pill-success hidden sm:inline-flex">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Active
            </Badge>
            <Button variant="outline" size="sm" className="hidden md:inline-flex">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Container - Full Screen */}
      <div className="flex-1 overflow-hidden flex">
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
                        <div className="flex items-center space-x-2 sm:space-x-3 mb-3 p-2 sm:p-3 bg-muted opacity-20 rounded-xl sm:rounded-2xl">
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
                          <span className="text-xs sm:text-sm text-muted-foreground font-medium">AI is thinking...</span>
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
                          ? 'text-primary-foreground opacity-70' 
                          : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Quick Actions (shown when no messages or minimal conversation) */}
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
                          <div className="w-10 h-10 rounded-xl bg-white opacity-10 flex items-center justify-center">
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

          {/* Professional Mobile-First Input Area */}
          <div className="p-3 sm:p-4 pb-4 sm:pb-6 border-t border-border bg-background/80 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative bg-card border border-border rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-3 sm:p-4"
              >
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="flex flex-col space-y-2 pt-2">
                    <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all duration-200">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all duration-200">
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <Textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything..."
                      className="min-h-[60px] sm:min-h-[70px] max-h-32 sm:max-h-40 resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm sm:text-base placeholder:text-muted-foreground/70 leading-relaxed p-0"
                      disabled={isProcessing}
                    />
                    <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                      <span className="hidden sm:inline">Shift+Enter for new lines</span>
                      <span className="sm:hidden">⇧↵ new line</span>
                      <span>{inputValue.length}/2000</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isProcessing}
                      size="sm"
                      className="p-2 h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      {isProcessing ? (
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="rounded-full h-4 w-4 border-2 border-white border-t-transparent" 
                        />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}