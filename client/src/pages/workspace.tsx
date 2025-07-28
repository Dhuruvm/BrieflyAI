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
                className="h-6 w-auto mr-2"
              />
              <span className="text-lg font-bold">Briefly.AI Workspace</span>
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

      <div className="pt-16 flex flex-col lg:flex-row min-h-screen">
        {/* Upload Section */}
        <div className="lg:w-1/2 p-6 lg:p-8 border-r border-ai-border">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 glow-text">Upload Your Content</h2>
            
            {/* Upload Zone */}
            <UploadZone 
              onFileSelect={handleFileUpload}
              isUploading={isUploading || processContentMutation.isPending}
            />

            {/* Input Options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                onClick={startRecording}
                variant="outline"
                className="bg-ai-surface hover:bg-ai-border p-4 rounded-xl border-ai-border transition-all duration-300 flex items-center justify-center"
              >
                <i className="fas fa-microphone text-ai-green mr-2"></i>
                Record Voice
              </Button>
              <Button
                onClick={() => setShowTextInput(!showTextInput)}
                variant="outline"
                className="bg-ai-surface hover:bg-ai-border p-4 rounded-xl border-ai-border transition-all duration-300 flex items-center justify-center"
              >
                <i className="fas fa-keyboard text-ai-blue mr-2"></i>
                Type Text
              </Button>
            </div>

            {/* Text Input Area */}
            {showTextInput && (
              <div className="mb-6">
                <Textarea
                  placeholder="Paste your text here..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="w-full h-40 bg-ai-surface border-ai-border rounded-xl p-4 text-ai-text placeholder-ai-text-muted resize-none focus:border-ai-blue"
                />
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={handleTextProcess}
                    disabled={processContentMutation.isPending}
                    className="bg-ai-blue hover:bg-ai-blue-dark px-6 py-2 rounded-lg"
                  >
                    {processContentMutation.isPending ? "Processing..." : "Process Text"}
                  </Button>
                </div>
              </div>
            )}

            {/* URL Input for Videos */}
            <div className="mb-6">
              <Input
                type="url"
                placeholder="Or paste YouTube/Vimeo URL here..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-ai-surface border-ai-border rounded-xl p-4 text-ai-text placeholder-ai-text-muted focus:border-ai-blue"
              />
              {videoUrl && (
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={handleVideoUrlProcess}
                    disabled={processContentMutation.isPending}
                    className="bg-ai-blue hover:bg-ai-blue-dark px-6 py-2 rounded-lg"
                  >
                    {processContentMutation.isPending ? "Processing..." : "Process Video"}
                  </Button>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {(isUploading || processContentMutation.isPending) && (
              <Card className="bg-ai-surface border-ai-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Processing...</span>
                    <TypingAnimation />
                  </div>
                  <div className="w-full bg-ai-border rounded-full h-2">
                    <div className="bg-ai-blue h-2 rounded-full animate-pulse w-3/4"></div>
                  </div>
                  <p className="text-sm text-ai-text-secondary mt-2">Analyzing content with AI...</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Output Section */}
        <div className="lg:w-1/2 p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold glow-text">Generated Notes</h2>
              {currentNote && (
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="text-ai-text-secondary hover:text-ai-text p-2">
                    <i className="fas fa-download"></i>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-ai-text-secondary hover:text-ai-text p-2">
                    <i className="fas fa-share"></i>
                  </Button>
                </div>
              )}
            </div>

            {/* AI Assistant Status */}
            {processContentMutation.isPending ? (
              <div className="flex items-center mb-6 text-ai-text-secondary">
                <i className="fas fa-robot text-ai-blue mr-2"></i>
                <span>AI Assistant is thinking</span>
                <TypingAnimation />
              </div>
            ) : currentNote ? (
              <div className="flex items-center mb-6 text-ai-green">
                <i className="fas fa-check-circle text-ai-green mr-2"></i>
                <span>Notes generated successfully!</span>
              </div>
            ) : (
              <div className="flex items-center mb-6 text-ai-text-muted">
                <i className="fas fa-robot text-ai-text-muted mr-2"></i>
                <span>Upload content to generate notes</span>
              </div>
            )}

            {/* Generated Note Cards */}
            {currentNote ? (
              <NoteCards note={currentNote} />
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-file-text text-ai-text-muted text-6xl mb-4"></i>
                <h3 className="text-xl font-semibold mb-2 text-ai-text-muted">No notes yet</h3>
                <p className="text-ai-text-muted">Upload content to start generating AI-powered notes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
