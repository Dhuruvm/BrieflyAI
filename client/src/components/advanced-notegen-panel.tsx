import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { 
  Brain, 
  Palette, 
  FileText, 
  Sparkles, 
  Settings, 
  Download,
  Star,
  Users,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AdvancedNoteGenOptions {
  generatePDF: boolean;
  pdfStyle: 'handwritten' | 'minimal' | 'dark' | 'academic' | 'creative';
  includeVisuals: boolean;
  includeDiagrams: boolean;
  language: string;
  complexityLevel: 'simple' | 'moderate' | 'complex';
  visualDensity: 'minimal' | 'balanced' | 'rich';
  colorScheme: 'warm' | 'cool' | 'neutral' | 'vibrant' | 'pastel';
  fontStyle: 'handwritten' | 'clean' | 'academic' | 'creative';
}

interface ProcessingMetrics {
  totalTime: number;
  layoutElements: number;
  styledElements: number;
  diagramsGenerated: number;
  pdfSize: number;
}

interface AdvancedNoteGenPanelProps {
  onGenerate: (content: string, options: AdvancedNoteGenOptions) => void;
  isProcessing: boolean;
  processingMetrics?: ProcessingMetrics;
}

export function AdvancedNoteGenPanel({ onGenerate, isProcessing, processingMetrics }: AdvancedNoteGenPanelProps) {
  const { toast } = useToast();
  const [options, setOptions] = useState<AdvancedNoteGenOptions>({
    generatePDF: true,
    pdfStyle: 'handwritten',
    includeVisuals: true,
    includeDiagrams: true,
    language: 'en',
    complexityLevel: 'moderate',
    visualDensity: 'balanced',
    colorScheme: 'warm',
    fontStyle: 'handwritten'
  });

  const [content, setContent] = useState('');
  const [userFeedback, setUserFeedback] = useState({ rating: 8, features: [] as string[] });

  // Feedback mutation
  const feedbackMutation = useMutation({
    mutationFn: async (feedback: { rating: number; features: string[] }) => {
      const response = await fetch('/api/notegen-feedback', {
        method: 'POST',
        body: JSON.stringify(feedback),
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Feedback Submitted",
        description: "Thank you! The AI learning system has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Feedback Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleGenerate = (forcePDF = false) => {
    if (!content.trim()) {
      toast({
        title: "No Content",
        description: "Please enter some content to generate notes from.",
        variant: "destructive",
      });
      return;
    }
    const finalOptions = forcePDF ? { ...options, generatePDF: true } : options;
    onGenerate(content, finalOptions);
  };

  const handleFeedbackSubmit = () => {
    feedbackMutation.mutate(userFeedback);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="h-8 w-8 text-blue-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Advanced NoteGen Engine
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Powered by 4 specialized AI agents for superior note generation with self-learning capabilities
        </p>
        
        {/* Agent Pipeline Badges */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Layout Designer
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Palette className="h-3 w-3" />
            Styling Designer
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            Diagram Generator
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            PDF Designer
          </Badge>
        </div>
      </motion.div>

      {/* Content Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Input
          </CardTitle>
          <CardDescription>
            Enter your content or upload a file to generate advanced study notes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your content here, or use the file upload above..."
            className="w-full min-h-[200px] p-4 border rounded-lg resize-none"
            disabled={isProcessing}
          />
        </CardContent>
      </Card>

      {/* Advanced Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Options
          </CardTitle>
          <CardDescription>
            Customize your note generation with AI-powered preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Style Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="pdfStyle" className="text-sm font-medium">PDF Style</Label>
              <Select
                value={options.pdfStyle}
                onValueChange={(value) => setOptions(prev => ({ ...prev, pdfStyle: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="handwritten">📝 Handwritten</SelectItem>
                  <SelectItem value="minimal">✨ Minimal</SelectItem>
                  <SelectItem value="dark">🌙 Dark Theme</SelectItem>
                  <SelectItem value="academic">🎓 Academic</SelectItem>
                  <SelectItem value="creative">🎨 Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="colorScheme" className="text-sm font-medium">Color Scheme</Label>
              <Select
                value={options.colorScheme}
                onValueChange={(value) => setOptions(prev => ({ ...prev, colorScheme: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warm">🔥 Warm Tones</SelectItem>
                  <SelectItem value="cool">❄️ Cool Tones</SelectItem>
                  <SelectItem value="neutral">⚪ Neutral</SelectItem>
                  <SelectItem value="vibrant">🌈 Vibrant</SelectItem>
                  <SelectItem value="pastel">🦋 Pastel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Complexity and Density */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="complexityLevel" className="text-sm font-medium">Complexity Level</Label>
              <Select
                value={options.complexityLevel}
                onValueChange={(value) => setOptions(prev => ({ ...prev, complexityLevel: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">🟢 Simple</SelectItem>
                  <SelectItem value="moderate">🟡 Moderate</SelectItem>
                  <SelectItem value="complex">🔴 Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="visualDensity" className="text-sm font-medium">Visual Density</Label>
              <Select
                value={options.visualDensity}
                onValueChange={(value) => setOptions(prev => ({ ...prev, visualDensity: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">📄 Minimal</SelectItem>
                  <SelectItem value="balanced">⚖️ Balanced</SelectItem>
                  <SelectItem value="rich">🎯 Rich</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Toggle Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Include Visual Elements</Label>
                <p className="text-xs text-muted-foreground">Add icons, highlights, and visual enhancements</p>
              </div>
              <Switch
                checked={options.includeVisuals}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeVisuals: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Generate Diagrams</Label>
                <p className="text-xs text-muted-foreground">Auto-generate flowcharts, cycles, and mind maps</p>
              </div>
              <Switch
                checked={options.includeDiagrams}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeDiagrams: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Generate PDF</Label>
                <p className="text-xs text-muted-foreground">Create downloadable PDF study notes</p>
              </div>
              <Switch
                checked={options.generatePDF}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, generatePDF: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Metrics */}
      {processingMetrics && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Sparkles className="h-5 w-5" />
                Processing Complete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{processingMetrics.totalTime}ms</div>
                  <div className="text-xs text-muted-foreground">Processing Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{processingMetrics.layoutElements}</div>
                  <div className="text-xs text-muted-foreground">Layout Elements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{processingMetrics.styledElements}</div>
                  <div className="text-xs text-muted-foreground">Styled Elements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{processingMetrics.diagramsGenerated}</div>
                  <div className="text-xs text-muted-foreground">Diagrams Generated</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* User Feedback Section */}
      {processingMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Rate Your Experience
            </CardTitle>
            <CardDescription>
              Help our self-learning AI improve by providing feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Quality Rating: {userFeedback.rating}/10</Label>
              <Slider
                value={[userFeedback.rating]}
                onValueChange={(value) => setUserFeedback(prev => ({ ...prev, rating: value[0] }))}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
            <Button 
              onClick={handleFeedbackSubmit}
              disabled={feedbackMutation.isPending}
              className="w-full"
              variant="outline"
            >
              {feedbackMutation.isPending ? "Submitting..." : "Submit Feedback"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          onClick={() => handleGenerate(false)}
          disabled={isProcessing || !content.trim()}
          size="lg"
          className="px-8 py-3 text-lg"
        >
          {isProcessing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Brain className="h-5 w-5" />
              </motion.div>
              Processing with AI Agents...
            </>
          ) : (
            <>
              <Download className="mr-2 h-5 w-5" />
              Generate Advanced Notes
            </>
          )}
        </Button>

        {/* Professional PDF Download Button */}
        <Button
          onClick={() => handleGenerate(true)}
          disabled={isProcessing || !content.trim()}
          size="lg"
          variant="outline"
          className="px-8 py-3 text-lg border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500"
        >
          <FileText className="mr-2 h-5 w-5" />
          Generate Professional PDF
        </Button>
      </div>
    </div>
  );
}