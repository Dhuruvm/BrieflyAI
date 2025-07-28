import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { NoteGenOptions } from "@shared/schema";

interface NoteGenControlsProps {
  content: string;
  onGenerate?: (result: any) => void;
  disabled?: boolean;
}

export default function NoteGenControls({ content, onGenerate, disabled = false }: NoteGenControlsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState<NoteGenOptions>({
    generatePDF: false,
    pdfStyle: 'handwritten',
    includeVisuals: true,
    language: 'en'
  });
  const { toast } = useToast();

  const handleGenerateStudyNotes = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "No content available to generate study notes",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      if (options.generatePDF) {
        // Generate and download PDF
        const response = await fetch("/api/generate-study-notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            options
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to generate study notes PDF");
        }

        // Download the PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `study_notes_${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "Success!",
          description: "Study notes PDF generated and downloaded successfully.",
        });
      } else {
        // Generate HTML preview
        const response = await apiRequest("POST", "/api/generate-study-notes", {
          content,
          options
        });
        
        const result = await response.json();
        
        if (onGenerate) {
          onGenerate(result);
        }

        toast({
          title: "Success!",
          description: "Study notes generated successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate study notes",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-ai-surface/50 border-ai-border/50 backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-graduation-cap text-white"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold">NoteGen AI</h3>
              <p className="text-sm text-ai-text-secondary">Generate beautiful study notes</p>
            </div>
          </div>
          <Button
            onClick={handleGenerateStudyNotes}
            disabled={disabled || isGenerating || !content.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {isGenerating ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Generating...
              </div>
            ) : (
              <div className="flex items-center">
                <i className="fas fa-magic mr-2"></i>
                Generate Notes
              </div>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {/* PDF Generation Toggle */}
          <div className="flex items-center justify-between p-3 bg-ai-dark/30 rounded-xl">
            <div className="flex items-center">
              <i className="fas fa-file-pdf text-red-400 mr-3"></i>
              <div>
                <Label className="font-medium">Generate PDF</Label>
                <p className="text-xs text-ai-text-muted">Download as beautifully styled PDF</p>
              </div>
            </div>
            <Switch
              checked={options.generatePDF}
              onCheckedChange={(checked) => setOptions({ ...options, generatePDF: checked })}
            />
          </div>

          {/* Style Selection */}
          <div className="space-y-2">
            <Label className="flex items-center">
              <i className="fas fa-palette mr-2 text-purple-400"></i>
              PDF Style Theme
            </Label>
            <Select
              value={options.pdfStyle}
              onValueChange={(value: any) => setOptions({ ...options, pdfStyle: value })}
            >
              <SelectTrigger className="bg-ai-dark/30 border-ai-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="handwritten">
                  <div className="flex items-center">
                    <i className="fas fa-pen-fancy mr-2"></i>
                    Handwritten Style
                  </div>
                </SelectItem>
                <SelectItem value="minimal">
                  <div className="flex items-center">
                    <i className="fas fa-minimalist mr-2"></i>
                    Minimal Clean
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center">
                    <i className="fas fa-moon mr-2"></i>
                    Dark Mode
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visual Elements Toggle */}
          <div className="flex items-center justify-between p-3 bg-ai-dark/30 rounded-xl">
            <div className="flex items-center">
              <i className="fas fa-images text-blue-400 mr-3"></i>
              <div>
                <Label className="font-medium">Include Visuals</Label>
                <p className="text-xs text-ai-text-muted">Add emojis, colors, and visual elements</p>
              </div>
            </div>
            <Switch
              checked={options.includeVisuals}
              onCheckedChange={(checked) => setOptions({ ...options, includeVisuals: checked })}
            />
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <Label className="flex items-center">
              <i className="fas fa-globe mr-2 text-green-400"></i>
              Language
            </Label>
            <Select
              value={options.language}
              onValueChange={(value) => setOptions({ ...options, language: value })}
            >
              <SelectTrigger className="bg-ai-dark/30 border-ai-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                <SelectItem value="fr">🇫🇷 French</SelectItem>
                <SelectItem value="de">🇩🇪 German</SelectItem>
                <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
          <h4 className="font-medium mb-2 text-purple-300">✨ NoteGen AI Features</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-ai-text-muted">
            <div>🧠 AI Topic Classification</div>
            <div>📚 Smart Content Segmentation</div>
            <div>🎨 Beautiful Formatting</div>
            <div>📄 Professional PDF Export</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}