import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import UploadZone from "@/components/upload-zone";
import NoteCards from "@/components/note-cards";
import NoteGenControls from "@/components/notegen-controls";
import { AdvancedNoteGenPanel } from "@/components/advanced-notegen-panel";
import TypingAnimation from "@/components/ui/typing-animation";
import { useFileUpload } from "@/hooks/use-file-upload";
import { apiRequest } from "@/lib/queryClient";
import type { Note } from "@shared/schema";
import brieflyLogo from "@assets/briefly-logo.png";

export default function Workspace() {
  const [, setLocation] = useLocation();
  const [showTextInput, setShowTextInput] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const { uploadFile, isUploading } = useFileUpload();
  
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false);
  const [processingMetrics, setProcessingMetrics] = useState<any>(null);

  // Get all notes
  const { data: notes } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  // Process content mutation
  const processContentMutation = useMutation({
    mutationFn: async (data: { content?: string; contentType?: string; file?: File }) => {
      if (data.file) {
        return uploadFile(data.file);
      } else if (data.content) {
        const response = await apiRequest("POST", "/api/process", {
          content: data.content,
          contentType: data.contentType || "text",
        });
        return response.json();
      }
      throw new Error("No content provided");
    },
    onSuccess: (note: Note) => {
      setCurrentNote(note);
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "Success!",
        description: "Your content has been processed and notes generated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process content",
        variant: "destructive",
      });
    },
  });

  const handleTextProcess = () => {
    if (!textContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to process",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    processContentMutation.mutate({
      content: textContent,
      contentType: "text",
    });
  };

  const handleVideoUrlProcess = () => {
    if (!videoUrl.trim()) {
      toast({
        title: "Error", 
        description: "Please enter a video URL",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    processContentMutation.mutate({
      content: videoUrl,
      contentType: "video_url",
    });
  };

  const handleFileUpload = (file: File) => {
    setIsProcessing(true);
    processContentMutation.mutate({ file });
  };

  // Advanced NoteGen mutation
  const advancedNoteGenMutation = useMutation({
    mutationFn: async ({ content, options }: { content: string; options: any }) => {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('options', JSON.stringify(options));
      
      const response = await fetch('/api/generate-advanced-notes', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      if (options.generatePDF) {
        // Handle automatic PDF download
        const blob = await response.blob();
        
        // Validate PDF response
        if (blob.type !== 'application/pdf' && blob.size > 0) {
          const text = await blob.text();
          throw new Error(text || 'Invalid PDF response received');
        }
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `advanced-notes-${Date.now()}.pdf`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        // Clean up after download
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 100);
        
        return { success: true, message: "PDF downloaded successfully" };
      } else {
        return response.json();
      }
    },
    onSuccess: (data) => {
      setProcessingMetrics(data.processingMetrics);
      setIsProcessing(false);
      toast({
        title: "Advanced Notes Generated!",
        description: data.message || "Your advanced study notes are ready.",
      });
    },
    onError: (error: Error) => {
      setIsProcessing(false);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate advanced notes",
        variant: "destructive",
      });
    },
  });

  const handleAdvancedGenerate = (content: string, options: any) => {
    setIsProcessing(true);
    setProcessingMetrics(null);
    advancedNoteGenMutation.mutate({ content, options });
  };

  const startRecording = () => {
    toast({
      title: "Coming Soon",
      description: "Voice recording feature will be available soon!",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-ai-black/80 backdrop-blur-lg border-b border-ai-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => setLocation("/")}
                className="text-ai-text-secondary hover:text-ai-text mr-4 p-2"
              >
                <i className="fas fa-arrow-left"></i>
              </Button>
              <img 
                src={brieflyLogo} 
                alt="Briefly.AI" 
                className="h-12 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-ai-text-secondary hover:text-ai-text p-2">
                <i className="fas fa-history"></i>
              </Button>
              <Button variant="ghost" className="text-ai-text-secondary hover:text-ai-text p-2">
                <i className="fas fa-cog"></i>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 min-h-screen bg-gradient-to-br from-ai-black via-ai-darker to-ai-black">
        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="grid lg:grid-cols-2 gap-8 h-full">
            
            {/* Input Section */}
            <div className="flex flex-col">
              <div className="bg-ai-surface/50 backdrop-blur-xl border border-ai-border/50 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-3xl font-bold mb-8 logo-text text-center">Upload Your Content</h2>
                
                {/* Professional Upload Zone */}
                <UploadZone 
                  onFileSelect={handleFileUpload}
                  isUploading={isUploading || processContentMutation.isPending}
                  className="mb-8"
                />

                {/* ChatGPT-style Input Container */}
                <div className="space-y-6">
                  {/* Text Input with ChatGPT styling */}
                  <div className="relative">
                    <div className="bg-ai-dark/80 border border-ai-border rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
                      <Textarea
                        placeholder="Message Briefly.AI... Describe what you want to analyze or paste your content here"
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        className="w-full min-h-[120px] bg-transparent border-0 text-ai-text placeholder-ai-text-muted resize-none focus:ring-0 focus:outline-none text-lg leading-relaxed"
                      />
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-ai-border/30">
                        <div className="flex items-center space-x-4">
                          <Button
                            onClick={startRecording}
                            variant="ghost"
                            size="sm"
                            className="text-ai-text-secondary hover:text-ai-green hover:bg-ai-green/10 p-2 rounded-lg transition-all"
                          >
                            <i className="fas fa-microphone"></i>
                          </Button>
                          <span className="text-xs text-ai-text-muted">Press / for commands</span>
                        </div>
                        <Button
                          onClick={handleTextProcess}
                          disabled={!textContent.trim() || processContentMutation.isPending}
                          className="bg-ai-blue hover:bg-ai-blue-dark disabled:bg-ai-border disabled:cursor-not-allowed px-6 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          {processContentMutation.isPending ? (
                            <div className="flex items-center">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Processing...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <span>Send</span>
                              <i className="fas fa-paper-plane ml-2"></i>
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* URL Input */}
                  <div className="relative">
                    <div className="bg-ai-dark/80 border border-ai-border rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
                      <Input
                        type="url"
                        placeholder="🔗 Paste YouTube/Vimeo URL here..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full bg-transparent border-0 text-ai-text placeholder-ai-text-muted focus:ring-0 focus:outline-none text-lg"
                      />
                      {videoUrl && (
                        <div className="flex justify-end mt-3 pt-3 border-t border-ai-border/30">
                          <Button
                            onClick={handleVideoUrlProcess}
                            disabled={processContentMutation.isPending}
                            className="bg-ai-green hover:bg-ai-green/80 px-6 py-2 rounded-xl font-medium transition-all duration-300"
                          >
                            {processContentMutation.isPending ? "Processing..." : "Process Video"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={startRecording}
                      variant="outline"
                      className="bg-ai-dark/50 hover:bg-ai-green/10 border-ai-border hover:border-ai-green p-4 rounded-xl transition-all duration-300 flex items-center justify-center group"
                    >
                      <i className="fas fa-microphone text-ai-green mr-3 group-hover:scale-110 transition-transform"></i>
                      <span>Voice Record</span>
                    </Button>
                    <Button
                      onClick={() => setShowTextInput(!showTextInput)}
                      variant="outline"
                      className="bg-ai-dark/50 hover:bg-ai-blue/10 border-ai-border hover:border-ai-blue p-4 rounded-xl transition-all duration-300 flex items-center justify-center group"
                    >
                      <i className="fas fa-keyboard text-ai-blue mr-3 group-hover:scale-110 transition-transform"></i>
                      <span>Type Text</span>
                    </Button>
                  </div>

                  {/* Advanced NoteGen Toggle */}
                  <div className="mt-6 pt-6 border-t border-ai-border/30">
                    <Button
                      onClick={() => setShowAdvancedPanel(!showAdvancedPanel)}
                      variant="outline"
                      className="w-full bg-gradient-to-r from-purple-600/10 to-blue-600/10 hover:from-purple-600/20 hover:to-blue-600/20 border-purple-400/30 hover:border-purple-400/50 p-4 rounded-xl transition-all duration-300 flex items-center justify-center group"
                    >
                      <i className="fas fa-brain text-purple-400 mr-3 group-hover:scale-110 transition-transform"></i>
                      <span className="font-medium">
                        {showAdvancedPanel ? 'Hide Advanced NoteGen' : 'Show Advanced NoteGen Engine'}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Processing Status */}
                {(isUploading || processContentMutation.isPending) && (
                  <div className="mt-8 bg-ai-blue/10 border border-ai-blue/30 rounded-2xl p-6 backdrop-blur-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-ai-blue/20 rounded-full flex items-center justify-center mr-3">
                          <i className="fas fa-robot text-ai-blue"></i>
                        </div>
                        <span className="font-medium text-ai-blue">AI is analyzing your content</span>
                      </div>
                      <TypingAnimation />
                    </div>
                    <div className="w-full bg-ai-blue/20 rounded-full h-2 overflow-hidden">
                      <div className="bg-ai-blue h-2 rounded-full animate-pulse w-3/4 transition-all duration-500"></div>
                    </div>
                    <p className="text-sm text-ai-text-secondary mt-3">This may take a few moments...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Output Section */}
            <div className="flex flex-col">
              <div className="bg-ai-surface/50 backdrop-blur-xl border border-ai-border/50 rounded-2xl p-8 shadow-2xl h-full">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold logo-text">Generated Notes</h2>
                  {currentNote && (
                    <div className="flex space-x-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-ai-text-secondary hover:text-ai-blue hover:bg-ai-blue/10 p-3 rounded-xl transition-all"
                        onClick={() => window.open(`/api/notes/${currentNote.id}/download-pdf`, '_blank')}
                      >
                        <i className="fas fa-download mr-2"></i>
                        Download PDF
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-ai-text-secondary hover:text-ai-green hover:bg-ai-green/10 p-3 rounded-xl transition-all"
                      >
                        <i className="fas fa-share mr-2"></i>
                        Share
                      </Button>
                    </div>
                  )}
                </div>

                {/* AI Status Indicator */}
                <div className="mb-8">
                  {processContentMutation.isPending ? (
                    <div className="flex items-center p-4 bg-ai-blue/10 border border-ai-blue/30 rounded-xl">
                      <div className="w-8 h-8 bg-ai-blue/20 rounded-full flex items-center justify-center mr-3">
                        <i className="fas fa-robot text-ai-blue animate-pulse"></i>
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-ai-blue">AI Assistant is thinking</span>
                        <TypingAnimation />
                      </div>
                    </div>
                  ) : currentNote ? (
                    <div className="flex items-center p-4 bg-ai-green/10 border border-ai-green/30 rounded-xl">
                      <div className="w-8 h-8 bg-ai-green/20 rounded-full flex items-center justify-center mr-3">
                        <i className="fas fa-check-circle text-ai-green"></i>
                      </div>
                      <span className="font-medium text-ai-green">Notes generated successfully!</span>
                    </div>
                  ) : (
                    <div className="flex items-center p-4 bg-ai-surface/30 border border-ai-border/30 rounded-xl">
                      <div className="w-8 h-8 bg-ai-border/20 rounded-full flex items-center justify-center mr-3">
                        <i className="fas fa-robot text-ai-text-muted"></i>
                      </div>
                      <span className="text-ai-text-muted">Ready to analyze your content</span>
                    </div>
                  )}
                </div>

                {/* Notes Content */}
                <div className="flex-1 overflow-y-auto space-y-6">
                  {currentNote ? (
                    <div className="space-y-6">
                      <NoteCards note={currentNote} />
                      
                      {/* NoteGen AI Controls */}
                      <NoteGenControls 
                        content={currentNote.originalContent}
                        disabled={processContentMutation.isPending}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-[400px]">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-ai-surface/50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                          <i className="fas fa-brain text-ai-blue text-3xl"></i>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-ai-text-secondary">Ready to Generate Notes</h3>
                        <p className="text-ai-text-muted max-w-md mx-auto leading-relaxed">
                          Upload files, paste text, or share URLs to get AI-powered structured notes with summaries, key points, and actionable insights.
                        </p>
                        
                        {/* Show NoteGen preview when content is available */}
                        {textContent && (
                          <div className="mt-8 max-w-md mx-auto">
                            <NoteGenControls 
                              content={textContent}
                              disabled={processContentMutation.isPending}
                            />
                          </div>
                        )}

                        {/* Advanced NoteGen Panel */}
                        {showAdvancedPanel && (
                          <div className="mt-8 w-full">
                            <AdvancedNoteGenPanel
                              onGenerate={handleAdvancedGenerate}
                              isProcessing={isProcessing}
                              processingMetrics={processingMetrics}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
