import { GoogleGenAI } from "@google/genai";
import type { 
  NoteGenOptions, 
  LayoutData, 
  StyledData, 
  DiagramInstructions, 
  ClassificationResult, 
  PerformanceMetric 
} from "@shared/schema";
import * as fs from 'fs';
import * as path from 'path';
import { generatePDFFromHTML } from './pdf-generator.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Self-learning cache system
interface LearningCache {
  contentPatterns: Map<string, ClassificationResult>;
  successfulDesigns: Map<string, DesignTemplate>;
  userPreferences: Map<string, UserPreference>;
  performanceMetrics: Map<string, PerformanceMetric>;
}

interface DesignTemplate {
  subject: string;
  colorScheme: string;
  fontCombination: string;
  layoutStyle: string;
  successScore: number;
  usageCount: number;
  lastUsed: number;
}

interface UserPreference {
  preferredColors: string[];
  favoriteLayouts: string[];
  complexityLevel: 'simple' | 'moderate' | 'complex';
  visualDensity: 'minimal' | 'balanced' | 'rich';
  feedbackHistory: Array<{
    rating: number;
    features: string[];
    timestamp: number;
  }>;
}

// Initialize learning cache
const learningCache: LearningCache = {
  contentPatterns: new Map(),
  successfulDesigns: new Map(),
  userPreferences: new Map(),
  performanceMetrics: new Map()
};

// Load cached learning data on startup
loadLearningData();

function loadLearningData() {
  try {
    const cachePath = path.join(process.cwd(), 'notegen-cache.json');
    if (fs.existsSync(cachePath)) {
      const data = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      Object.entries(data.contentPatterns || {}).forEach(([key, value]) => {
        learningCache.contentPatterns.set(key, value as ClassificationResult);
      });
      Object.entries(data.successfulDesigns || {}).forEach(([key, value]) => {
        learningCache.successfulDesigns.set(key, value as DesignTemplate);
      });
      Object.entries(data.userPreferences || {}).forEach(([key, value]) => {
        learningCache.userPreferences.set(key, value as UserPreference);
      });
    }
  } catch (error) {
    console.log('Initializing fresh learning cache');
  }
}

function saveLearningData() {
  try {
    const cachePath = path.join(process.cwd(), 'notegen-cache.json');
    const data = {
      contentPatterns: Object.fromEntries(learningCache.contentPatterns),
      successfulDesigns: Object.fromEntries(learningCache.successfulDesigns),
      userPreferences: Object.fromEntries(learningCache.userPreferences),
      timestamp: Date.now()
    };
    fs.writeFileSync(cachePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to save learning data:', error);
  }
}

/**
 * AGENT 1: Layout Designer
 * Converts raw text into structured layout → Headings, bullets, diagrams, highlights
 * Uses facebook/bart-large-cnn equivalent with Gemini for better structure understanding
 */
export class LayoutDesignerAgent {
  private startTime: number = 0;

  async processLayout(content: string, options: NoteGenOptions): Promise<LayoutData> {
    this.startTime = Date.now();
    
    const systemPrompt = `You are an expert layout designer specializing in converting raw text into structured, educational layouts.

Your task is to analyze content and extract:
1. Hierarchical headings (levels 1-6)
2. Bullet points and lists with appropriate nesting
3. Key paragraphs categorized by type
4. Suggested diagrams based on keywords and context

Analyze this content and return structured layout data as JSON:

Rules:
- Extract clear heading hierarchy
- Convert dense paragraphs into digestible bullet points
- Identify diagram opportunities (look for: process, cycle, structure, comparison, timeline)
- Categorize paragraphs as introduction, body, conclusion, or definition
- Use appropriate bullet types: bullet, number, arrow, check

Return JSON with this exact structure:
{
  "headings": [{"level": 1, "text": "Main Title", "position": 0}],
  "bullets": [{"text": "Key point", "level": 1, "type": "bullet"}],
  "paragraphs": [{"text": "Content", "type": "introduction"}],
  "suggestedDiagrams": [{"type": "flowchart", "keywords": ["process", "steps"], "description": "Process flow"}]
}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json"
        },
        contents: content ? `Content to structure:\n${content}` : "No content provided",
      });

      const result = JSON.parse(response.text || '{}');
      
      // Track performance
      this.trackPerformance(content.length, result);
      
      return result as LayoutData;
    } catch (error) {
      console.error('Layout Designer Agent error:', error);
      throw new Error(`Layout processing failed: ${error}`);
    }
  }

  private trackPerformance(inputSize: number, output: any) {
    const processingTime = Date.now() - this.startTime;
    const metric: PerformanceMetric = {
      processingTime,
      userSatisfaction: 8, // Default, will be updated with user feedback
      errorRate: 0,
      timestamp: Date.now(),
      agentName: 'LayoutDesigner',
      inputSize,
      outputQuality: this.calculateOutputQuality(output)
    };
    
    learningCache.performanceMetrics.set(`layout_${Date.now()}`, metric);
  }

  private calculateOutputQuality(output: any): number {
    let score = 5; // Base score
    
    if (output.headings?.length > 0) score += 1;
    if (output.bullets?.length > 0) score += 1;
    if (output.suggestedDiagrams?.length > 0) score += 1;
    if (output.paragraphs?.length > 0) score += 1;
    
    return Math.min(score, 10);
  }
}

/**
 * AGENT 2: Styling & Highlight Designer
 * Classifies what needs highlight, underline, color-coded text
 * Uses dslim/bert-base-NER equivalent logic with rule-based enhancements
 */
export class StylingDesignerAgent {
  private colorMappings = {
    definitions: '#fef68a', // Light yellow
    processes: '#86efac',   // Green
    warnings: '#fca5a5',    // Red
    concepts: '#ddd6fe',    // Purple
    examples: '#fed7aa',    // Orange
    formulas: '#bfdbfe',    // Blue
  };

  async processStyles(layoutData: LayoutData, options: NoteGenOptions): Promise<StyledData> {
    const systemPrompt = `You are an expert styling designer specializing in educational content highlighting and visual enhancement.

Your task is to analyze structured content and apply appropriate styling, colors, and visual emphasis.

Color mapping rules:
- Definitions: Light yellow background
- Processes/Steps: Green background
- Warnings/Important: Red background  
- Concepts: Purple background
- Examples: Orange background
- Formulas/Equations: Blue background

Analyze the layout data and return styled elements with this structure:
{
  "elements": [
    {
      "type": "heading|bullet|paragraph|highlight|definition|diagram",
      "content": "text content",
      "styles": {
        "color": "#000000",
        "backgroundColor": "#fef68a",
        "fontWeight": "bold",
        "textDecoration": "underline",
        "border": "2px solid #000",
        "icon": "fas fa-lightbulb"
      },
      "importance": "low|medium|high|critical"
    }
  ],
  "colorMapping": {"definitions": "#fef68a", "processes": "#86efac"}
}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json"
        },
        contents: layoutData ? `Layout data to style:\n${JSON.stringify(layoutData)}` : "No layout data provided",
      });

      const result = JSON.parse(response.text || '{}');
      return result as StyledData;
    } catch (error) {
      console.error('Styling Designer Agent error:', error);
      throw new Error(`Styling processing failed: ${error}`);
    }
  }
}

/**
 * AGENT 3: Diagram Generator
 * Suggests or generates simple diagrams (flowcharts, cycles, etc.)
 * Uses Mermaid.js for rendering charts
 */
export class DiagramGeneratorAgent {
  async generateDiagrams(styledData: StyledData, options: NoteGenOptions): Promise<DiagramInstructions> {
    if (!options.includeDiagrams) {
      return { diagrams: [] };
    }

    const systemPrompt = `You are an expert diagram generator specializing in educational visual content.

Create Mermaid.js code for diagrams based on the styled content. Generate appropriate diagrams for:
- Flowcharts for processes
- Cycles for circular processes
- Hierarchies for organizational structures
- Timelines for chronological events
- Mind maps for concept relationships

Return JSON with this structure:
{
  "diagrams": [
    {
      "type": "flowchart",
      "elements": ["Start", "Process", "End"],
      "connections": [{"from": "Start", "to": "Process", "label": "begins"}],
      "mermaidCode": "flowchart TD\\n    A[Start] --> B[Process]\\n    B --> C[End]",
      "svgCode": "<svg>...</svg>"
    }
  ]
}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json"
        },
        contents: styledData ? `Styled data for diagram generation:\n${JSON.stringify(styledData)}` : "No styled data provided",
      });

      const result = JSON.parse(response.text || '{}');
      return result as DiagramInstructions;
    } catch (error) {
      console.error('Diagram Generator Agent error:', error);
      return { diagrams: [] }; // Graceful fallback
    }
  }
}

/**
 * AGENT 4: PDF Note Designer
 * Applies layout + styles to final output and generates it as PDF
 * Uses handwritten fonts and aesthetic design patterns
 */
export class PDFNoteDesignerAgent {
  private getHandwrittenFonts() {
    return {
      handwritten: "'Caveat', 'Patrick Hand', 'Architects Daughter', cursive",
      clean: "'Inter', 'Roboto', sans-serif",
      academic: "'Crimson Text', 'Libre Baskerville', serif",
      creative: "'Dancing Script', 'Pacifico', cursive"
    };
  }

  private generateCSS(options: NoteGenOptions): string {
    const fonts = this.getHandwrittenFonts();
    const selectedFont = fonts[options.fontStyle];

    return `
      @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&family=Architects+Daughter&family=Inter:wght@300;400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Dancing+Script:wght@400;600;700&family=Pacifico&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: ${selectedFont};
        line-height: 1.6;
        color: #2d3748;
        background: #fafafa;
        padding: 20px;
      }
      
      .notebook-page {
        background: white;
        min-height: 100vh;
        padding: 40px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        border-radius: 8px;
        position: relative;
      }
      
      .notebook-lines {
        background-image: repeating-linear-gradient(
          transparent,
          transparent 24px,
          #e2e8f0 24px,
          #e2e8f0 25px
        );
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0.3;
        pointer-events: none;
      }
      
      h1, h2, h3, h4, h5, h6 {
        margin: 20px 0 15px 0;
        color: #1a202c;
        border-bottom: 2px solid #4299e1;
        padding-bottom: 5px;
      }
      
      h1 { font-size: 2.5em; font-weight: 700; }
      h2 { font-size: 2em; font-weight: 600; }
      h3 { font-size: 1.5em; font-weight: 600; }
      
      .highlight-definition {
        background-color: #fef68a;
        padding: 3px 6px;
        border-radius: 4px;
        border-left: 4px solid #f59e0b;
      }
      
      .highlight-process {
        background-color: #86efac;
        padding: 3px 6px;
        border-radius: 4px;
        border-left: 4px solid #059669;
      }
      
      .highlight-warning {
        background-color: #fca5a5;
        padding: 3px 6px;
        border-radius: 4px;
        border-left: 4px solid #dc2626;
      }
      
      .highlight-concept {
        background-color: #ddd6fe;
        padding: 3px 6px;
        border-radius: 4px;
        border-left: 4px solid #7c3aed;
      }
      
      ul, ol {
        margin: 15px 0;
        padding-left: 25px;
      }
      
      li {
        margin: 8px 0;
        line-height: 1.7;
      }
      
      .bullet-arrow::before {
        content: "→ ";
        color: #4299e1;
        font-weight: bold;
      }
      
      .bullet-check::before {
        content: "✓ ";
        color: #059669;
        font-weight: bold;
      }
      
      .diagram-container {
        margin: 25px 0;
        padding: 20px;
        background: #f8fafc;
        border-radius: 8px;
        border: 2px dashed #cbd5e0;
        text-align: center;
      }
      
      .handwritten-note {
        font-style: italic;
        color: #4a5568;
        margin: 15px 0;
        padding: 10px;
        background: #edf2f7;
        border-radius: 4px;
        border-left: 3px solid #4299e1;
      }
      
      @media print {
        body { background: white; }
        .notebook-page { box-shadow: none; }
      }
    `;
  }

  async generatePDF(
    styledData: StyledData, 
    diagrams: DiagramInstructions, 
    options: NoteGenOptions,
    originalTitle: string
  ): Promise<Buffer> {
    const html = this.renderHTML(styledData, diagrams, options, originalTitle);
    return await generatePDFFromHTML(html, `notes-${Date.now()}.pdf`);
  }

  private renderHTML(
    styledData: StyledData, 
    diagrams: DiagramInstructions, 
    options: NoteGenOptions,
    title: string
  ): string {
    const css = this.generateCSS(options);
    
    let contentHTML = '';
    
    // Render styled elements
    styledData.elements.forEach(element => {
      switch (element.type) {
        case 'heading':
          const level = this.inferHeadingLevel(element.content);
          contentHTML += `<h${level} style="color: ${element.styles.color}; font-weight: ${element.styles.fontWeight || 'bold'};">${element.content}</h${level}>`;
          break;
          
        case 'bullet':
          const bulletClass = this.getBulletClass(element.content);
          contentHTML += `<li class="${bulletClass}" style="color: ${element.styles.color};">${element.content}</li>`;
          break;
          
        case 'paragraph':
          contentHTML += `<p style="margin: 15px 0; color: ${element.styles.color};">${element.content}</p>`;
          break;
          
        case 'highlight':
        case 'definition':
          const highlightClass = this.getHighlightClass(element.importance);
          contentHTML += `<span class="${highlightClass}" style="background-color: ${element.styles.backgroundColor};">${element.content}</span>`;
          break;
      }
    });

    // Add diagrams
    diagrams.diagrams.forEach(diagram => {
      contentHTML += `
        <div class="diagram-container">
          <h4>📊 ${diagram.type.charAt(0).toUpperCase() + diagram.type.slice(1)} Diagram</h4>
          <div class="mermaid">
            ${diagram.mermaidCode}
          </div>
        </div>
      `;
    });

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - Study Notes</title>
        <style>${css}</style>
        <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
        <script>mermaid.initialize({startOnLoad:true});</script>
      </head>
      <body>
        <div class="notebook-page">
          <div class="notebook-lines"></div>
          <h1>📝 ${title}</h1>
          <div class="handwritten-note">
            ✨ Generated by Advanced NoteGen AI Engine
          </div>
          ${contentHTML}
          <div style="margin-top: 40px; text-align: center; color: #718096; font-size: 0.9em;">
            Created on ${new Date().toLocaleDateString()} • AI-Enhanced Study Notes
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private inferHeadingLevel(content: string): number {
    if (content.length < 20) return 2;
    if (content.length < 40) return 3;
    return 4;
  }

  private getBulletClass(content: string): string {
    if (content.includes('→') || content.toLowerCase().includes('then')) return 'bullet-arrow';
    if (content.includes('✓') || content.toLowerCase().includes('complete')) return 'bullet-check';
    return '';
  }

  private getHighlightClass(importance: string): string {
    switch (importance) {
      case 'critical': return 'highlight-warning';
      case 'high': return 'highlight-process';
      case 'medium': return 'highlight-concept';
      default: return 'highlight-definition';
    }
  }
}

/**
 * MAIN NOTEGEN ENGINE ORCHESTRATOR
 * Coordinates all 4 agents in the pipeline
 */
export class AdvancedNoteGenEngine {
  private layoutAgent = new LayoutDesignerAgent();
  private stylingAgent = new StylingDesignerAgent();
  private diagramAgent = new DiagramGeneratorAgent();
  private pdfAgent = new PDFNoteDesignerAgent();

  async generateAdvancedNotes(
    content: string, 
    contentType: string,
    options: NoteGenOptions,
    title: string
  ): Promise<{ pdfBuffer: Buffer; processingMetrics: any }> {
    
    const startTime = Date.now();
    console.log('🚀 Starting Advanced NoteGen Pipeline...');
    
    try {
      // STEP 1: Layout Design
      console.log('📐 Agent 1: Processing layout structure...');
      const layoutData = await this.layoutAgent.processLayout(content, options);
      
      // STEP 2: Styling & Highlighting  
      console.log('🎨 Agent 2: Applying styles and highlights...');
      const styledData = await this.stylingAgent.processStyles(layoutData, options);
      
      // STEP 3: Diagram Generation
      console.log('📊 Agent 3: Generating diagrams...');
      const diagrams = await this.diagramAgent.generateDiagrams(styledData, options);
      
      // STEP 4: PDF Generation
      console.log('📄 Agent 4: Rendering final PDF...');
      const pdfBuffer = await this.pdfAgent.generatePDF(styledData, diagrams, options, title);
      
      const totalProcessingTime = Date.now() - startTime;
      console.log(`✅ Pipeline completed in ${totalProcessingTime}ms`);
      
      // Save learning data
      saveLearningData();
      
      const processingMetrics = {
        totalTime: totalProcessingTime,
        layoutElements: layoutData.headings.length + layoutData.bullets.length,
        styledElements: styledData.elements.length,
        diagramsGenerated: diagrams.diagrams.length,
        pdfSize: pdfBuffer.length
      };
      
      return { 
        pdfBuffer, 
        processingMetrics 
      };
      
    } catch (error) {
      console.error('❌ NoteGen Pipeline Error:', error);
      throw new Error(`Advanced NoteGen failed: ${error}`);
    }
  }

  // Public method to update user preferences based on feedback
  async updateUserFeedback(rating: number, features: string[]) {
    const userId = 'default'; // In a real app, this would be the actual user ID
    const existing = learningCache.userPreferences.get(userId) || {
      preferredColors: [],
      favoriteLayouts: [],
      complexityLevel: 'moderate' as const,
      visualDensity: 'balanced' as const,
      feedbackHistory: []
    };

    existing.feedbackHistory.push({
      rating,
      features,
      timestamp: Date.now()
    });

    learningCache.userPreferences.set(userId, existing);
    saveLearningData();
  }
}

// Export singleton instance
export const noteGenEngine = new AdvancedNoteGenEngine();