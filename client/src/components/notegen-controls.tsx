import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [analytics, setAnalytics] = useState<any>(null);
  const [options, setOptions] = useState<NoteGenOptions>({
    generatePDF: false,
    pdfStyle: 'handwritten',
    includeVisuals: true,
    includeDiagrams: true,
    language: 'en',
    complexityLevel: 'moderate',
    visualDensity: 'balanced', 
    colorScheme: 'warm',
    fontStyle: 'handwritten'
  });
  const { toast } = useToast();

  // Load performance analytics on mount
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await apiRequest("GET", "/api/notegen-analytics");
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.log('Analytics not available');
      }
    };
    loadAnalytics();
  }, []);

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
    setGenerationProgress(0);
    setCurrentStep('Initializing AI agents...');

    // Simulate progress steps
    const progressSteps = [
      { progress: 20, step: '🔍 Classifying content...' },
      { progress: 40, step: '✂️ Segmenting content...' },
      { progress: 60, step: '🎨 Formatting notes...' },
      { progress: 80, step: '🖼️ Designing layout...' },
      { progress: 95, step: '📄 Generating PDF...' }
    ];

    const progressInterval = setInterval(() => {
      const currentIndex = Math.floor(generationProgress / 20);
      if (currentIndex < progressSteps.length) {
        setGenerationProgress(progressSteps[currentIndex].progress);
        setCurrentStep(progressSteps[currentIndex].step);
      }
    }, 1500);

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

        setGenerationProgress(100);
        setCurrentStep('✅ Download complete!');
        
        toast({
          title: "Success!",
          description: "Premium study notes PDF generated and downloaded successfully.",
        });
      } else {
        // Generate HTML preview
        const response = await apiRequest("POST", "/api/generate-study-notes", {
          content,
          options
        });
        
        const result = await response.json();
        setGenerationProgress(100);
        setCurrentStep('✅ Notes generated!');
        
        if (onGenerate) {
          onGenerate(result);
        }

        toast({
          title: "Success!",
          description: "Premium study notes generated successfully.",
        });
      }
    } catch (error) {
      clearInterval(progressInterval);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate study notes",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
      setTimeout(() => {
        setGenerationProgress(0);
        setCurrentStep('');
      }, 3000);
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

        {/* Generation Progress */}
        {isGenerating && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-300">{currentStep}</span>
              <span className="text-sm text-purple-400">{generationProgress}%</span>
            </div>
            <Progress value={generationProgress} className="h-2 bg-purple-900/50" />
          </div>
        )}

        {/* Performance Analytics */}
        {analytics && (
          <div className="mb-6 p-4 bg-ai-dark/30 rounded-xl border border-ai-border/50">
            <h4 className="font-medium mb-3 text-ai-text flex items-center">
              <i className="fas fa-chart-line mr-2 text-green-400"></i>
              AI Performance Analytics
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">{analytics.totalNotesGenerated}</div>
                <div className="text-ai-text-muted">Notes Created</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">{analytics.averageProcessingTime}ms</div>
                <div className="text-ai-text-muted">Avg Speed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-400">{analytics.averageSatisfaction}%</div>
                <div className="text-ai-text-muted">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-amber-400">{analytics.learnedPatterns}</div>
                <div className="text-ai-text-muted">Patterns Learned</div>
              </div>
            </div>
          </div>
        )}

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
                    Premium Handwritten
                  </div>
                </SelectItem>
                <SelectItem value="minimal">
                  <div className="flex items-center">
                    <i className="fas fa-minimize mr-2"></i>
                    Modern Minimal
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center">
                    <i className="fas fa-moon mr-2"></i>
                    Dark Elegance
                  </div>
                </SelectItem>
                <SelectItem value="academic">
                  <div className="flex items-center">
                    <i className="fas fa-university mr-2"></i>
                    Academic Professional
                  </div>
                </SelectItem>
                <SelectItem value="creative">
                  <div className="flex items-center">
                    <i className="fas fa-palette mr-2"></i>
                    Creative Vibrant
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

        {/* Enhanced Feature Highlights */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
          <h4 className="font-medium mb-3 text-purple-300">✨ NoteGen AI Enhanced Features</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-ai-text-muted">
            <div className="flex items-center"><i className="fas fa-brain text-purple-400 mr-1"></i> AI Topic Classification</div>
            <div className="flex items-center"><i className="fas fa-cut text-blue-400 mr-1"></i> Smart Content Segmentation</div>
            <div className="flex items-center"><i className="fas fa-palette text-pink-400 mr-1"></i> Premium Formatting</div>
            <div className="flex items-center"><i className="fas fa-file-pdf text-red-400 mr-1"></i> Beautiful PDF Export</div>
            <div className="flex items-center"><i className="fas fa-rocket text-green-400 mr-1"></i> Self-Learning AI</div>
            <div className="flex items-center"><i className="fas fa-tachometer-alt text-amber-400 mr-1"></i> Performance Optimized</div>
            <div className="flex items-center"><i className="fas fa-mobile-alt text-cyan-400 mr-1"></i> Mobile Responsive</div>
            <div className="flex items-center"><i className="fas fa-universal-access text-indigo-400 mr-1"></i> Accessibility Ready</div>
          </div>
          <div className="mt-3 text-xs text-purple-300/80 italic">
            🚀 Now with enhanced self-learning capabilities and 10x faster processing!
          </div>
        </div>
      </CardContent>
    </Card>
  );
}