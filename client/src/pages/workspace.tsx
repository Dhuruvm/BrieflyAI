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
  MoreHorizontal
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to your AI Research Workbench. I can help you analyze documents, generate notes, perform clustering analysis, and much more. What would you like to work on today?',
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
      setMessages(prev => prev.map(msg => 
        msg.processing ? { 
          ...msg, 
          processing: false, 
          content: "I encountered an error processing your request. Please try again."
        } : msg
      ));
      setIsProcessing(false);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
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
      label: "Clustering Analysis",
      description: "Analyze document relationships",
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700",
      action: () => setLocation('/clustering')
    },
    {
      icon: FileText,
      label: "Generate Notes",
      description: "Create structured summaries",
      color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700",
      action: () => setInputValue("Please generate structured notes from my content")
    },
    {
      icon: Sparkles,
      label: "Smart Analysis",
      description: "Advanced AI insights",
      color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-700",
      action: () => setInputValue("Perform a comprehensive analysis with insights and recommendations")
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Mobile-First Header */}
      <div className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">Brevia Assistant</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Powered by advanced AI models</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Badge className="status-pill-success text-xs px-2 py-1 sm:px-3 sm:py-1">
              <Zap className="h-3 w-3 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Online</span>
              <span className="sm:hidden">●</span>
            </Badge>
            <Button variant="ghost" size="sm" className="rounded-2xl h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-muted hover:opacity-50">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Chat Container */}
      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 space-y-4 sm:space-y-6">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`${
                    message.type === 'user' 
                      ? 'chat-bubble-user' 
                      : message.type === 'system'
                      ? 'chat-bubble-system'
                      : 'chat-bubble-assistant'
                  }`}>
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
                      className={`modern-card cursor-pointer ${action.color} border-0`}
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

          {/* Mobile-Optimized Input Area */}
          <div className="p-4 sm:p-6 bg-card backdrop-blur-sm border-t border-border">
            <div className="modern-surface">
              <div className="flex items-end space-x-2 sm:space-x-3">
                <div className="flex space-x-1 sm:space-x-2">
                  <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground hover:text-foreground h-8 w-8 sm:h-10 sm:w-10 p-0">
                    <Paperclip className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground hover:text-foreground h-8 w-8 sm:h-10 sm:w-10 p-0">
                    <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    className="input-modern min-h-[40px] sm:min-h-[44px] max-h-24 sm:max-h-32 resize-none text-sm sm:text-base"
                    disabled={isProcessing}
                  />
                </div>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isProcessing}
                  className="btn-modern-primary rounded-xl p-2 sm:p-3 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-2 sm:mt-3 text-xs text-muted-foreground">
                <span className="hidden sm:inline">Use Shift+Enter for new lines</span>
                <span className="sm:hidden">Shift+Enter for lines</span>
                <div className="flex items-center space-x-1">
                  <Sparkles className="h-3 w-3" />
                  <span className="hidden sm:inline">Powered by AI</span>
                  <span className="sm:hidden">AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}