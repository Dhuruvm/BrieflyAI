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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="grid lg:grid-cols-2 gap-8 h-full">
            
            {/* Input Section */}
            <div className="flex flex-col">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white text-center">Upload Your Content</h2>
                
                {/* Professional Upload Zone */}
                <UploadZone 
                  onFileSelect={handleFileUpload}
                  isUploading={isUploading || processContentMutation.isPending}
                  className="mb-8"
                />

                {/* Clean Input Container */}
                <div className="space-y-6">
                  {/* Text Input with clean styling */}
                  <div className="relative">
                    <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                      <Textarea
                        placeholder="Message Brevia AI... Describe what you want to analyze or paste your content here"
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        className="w-full min-h-[120px] bg-transparent border-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-0 focus:outline-none text-base leading-relaxed"
                      />
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center space-x-4">
                          <Button
                            onClick={startRecording}
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded-lg transition-colors"
                          >
                            <i className="fas fa-microphone"></i>
                          </Button>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Press / for commands</span>
                        </div>
                        <Button
                          onClick={handleTextProcess}
                          disabled={!textContent.trim() || processContentMutation.isPending}
                          className="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          {processContentMutation.isPending ? (
                            <div className="flex items-center">
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
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
                    <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                      <Input
                        type="url"
                        placeholder="🔗 Paste YouTube/Vimeo URL here..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full bg-transparent border-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 focus:outline-none text-base"
                      />
                      {videoUrl && (
                        <div className="flex justify-end mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <Button
                            onClick={handleVideoUrlProcess}
                            disabled={processContentMutation.isPending}
                            className="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 px-6 py-2 rounded-lg font-medium transition-colors"
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
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 p-4 rounded-lg transition-colors flex items-center justify-center group"
                    >
                      <i className="fas fa-microphone text-gray-600 dark:text-gray-400 mr-3"></i>
                      <span className="text-gray-700 dark:text-gray-300">Voice Record</span>
                    </Button>
                    <Button
                      onClick={() => setShowTextInput(!showTextInput)}
                      variant="outline"
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 p-4 rounded-lg transition-colors flex items-center justify-center group"
                    >
                      <i className="fas fa-keyboard text-gray-600 dark:text-gray-400 mr-3"></i>
                      <span className="text-gray-700 dark:text-gray-300">Type Text</span>
                    </Button>
                  </div>

                  {/* Advanced NoteGen Toggle */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <Button
                      onClick={() => setShowAdvancedPanel(!showAdvancedPanel)}
                      variant="outline"
                      className="w-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 p-4 rounded-lg transition-colors flex items-center justify-center group"
                    >
                      <i className="fas fa-brain text-blue-600 dark:text-blue-400 mr-3"></i>
                      <span className="font-medium text-blue-700 dark:text-blue-300">
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
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm h-full">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Generated Notes</h2>
                  {currentNote && (
                    <div className="flex space-x-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors"
                        onClick={() => window.open(`/api/notes/${currentNote.id}/download-pdf`, '_blank')}
                      >
                        <i className="fas fa-download mr-2"></i>
                        Download PDF
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors"
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
                    <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mr-3">
                        <i className="fas fa-robot text-blue-600 dark:text-blue-400 animate-pulse"></i>
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-blue-700 dark:text-blue-300">AI Assistant is thinking</span>
                        <TypingAnimation />
                      </div>
                    </div>
                  ) : currentNote ? (
                    <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mr-3">
                        <i className="fas fa-check-circle text-green-600 dark:text-green-400"></i>
                      </div>
                      <span className="font-medium text-green-700 dark:text-green-300">Notes generated successfully!</span>
                    </div>
                  ) : (
                    <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                        <i className="fas fa-robot text-gray-600 dark:text-gray-400"></i>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">Ready to analyze your content</span>
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
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-6 mx-auto">
                          <i className="fas fa-brain text-gray-600 dark:text-gray-400 text-3xl"></i>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Ready to Generate Notes</h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
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
  );
}
