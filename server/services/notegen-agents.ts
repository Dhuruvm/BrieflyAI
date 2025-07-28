
import { GoogleGenAI } from "@google/genai";
import type { Note } from "@shared/schema";
import * as fs from 'fs';
import * as path from 'path';

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
}

interface UserPreference {
  preferredColors: string[];
  favoriteLayouts: string[];
  complexityLevel: 'simple' | 'moderate' | 'complex';
  visualDensity: 'minimal' | 'balanced' | 'rich';
}

interface PerformanceMetric {
  processingTime: number;
  userSatisfaction: number;
  errorRate: number;
  timestamp: number;
}

// Initialize learning cache
const learningCache: LearningCache = {
  contentPatterns: new Map(),
  successfulDesigns: new Map(),
  userPreferences: new Map(),
  performanceMetrics: new Map()
};

// Load cached learning data
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
    }
  } catch (error) {
    console.log('No existing cache found, starting fresh');
  }
}

// Save learning data
function saveLearningData() {
  try {
    const cachePath = path.join(process.cwd(), 'notegen-cache.json');
    const data = {
      contentPatterns: Object.fromEntries(learningCache.contentPatterns),
      successfulDesigns: Object.fromEntries(learningCache.successfulDesigns),
      timestamp: Date.now()
    };
    fs.writeFileSync(cachePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to save learning data:', error);
  }
}

// Initialize on module load
loadLearningData();

// Agent 1: Enhanced Topic Classifier with Learning
export interface ClassificationResult {
  subject: string;
  tone: string;
  language: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  contentType: 'academic' | 'business' | 'creative' | 'technical';
  visualComplexity: 'simple' | 'moderate' | 'complex';
  confidence: number;
}

export async function classifyContent(content: string): Promise<ClassificationResult> {
  const startTime = Date.now();
  
  // Check cache first for performance
  const contentHash = Buffer.from(content.substring(0, 500)).toString('base64');
  const cached = learningCache.contentPatterns.get(contentHash);
  
  if (cached && cached.confidence > 0.8) {
    console.log('🚀 Using cached classification (fast path)');
    return cached;
  }

  const enhancedPrompt = `Analyze this content with advanced classification. Consider previous learning patterns and return JSON with:
  - subject: The main academic subject with subcategory
  - tone: Writing style analysis
  - language: Language and regional variant
  - tags: Comprehensive relevant tags (min 5, max 10)
  - difficulty: Precise level assessment
  - contentType: Content category classification
  - visualComplexity: Visual design complexity needed
  - confidence: Classification confidence (0-1)

  Previous successful patterns: ${Array.from(learningCache.contentPatterns.values()).slice(-3).map(p => p.subject).join(', ')}

  Content: ${content}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            subject: { type: "string" },
            tone: { type: "string" },
            language: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            difficulty: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
            contentType: { type: "string", enum: ["academic", "business", "creative", "technical"] },
            visualComplexity: { type: "string", enum: ["simple", "moderate", "complex"] },
            confidence: { type: "number", minimum: 0, maximum: 1 }
          },
          required: ["subject", "tone", "language", "tags", "difficulty", "contentType", "visualComplexity", "confidence"]
        }
      },
      contents: enhancedPrompt
    });

    const result = JSON.parse(response.text || "{}");
    
    // Cache for future use
    if (result.confidence > 0.7) {
      learningCache.contentPatterns.set(contentHash, result);
    }
    
    // Record performance metrics
    const processingTime = Date.now() - startTime;
    learningCache.performanceMetrics.set(`classify_${Date.now()}`, {
      processingTime,
      userSatisfaction: 0.8, // Default, can be updated with user feedback
      errorRate: 0,
      timestamp: Date.now()
    });

    return result;
  } catch (error) {
    throw new Error(`Enhanced classification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Agent 2: Smart Content Segmentor with Learning
export interface NoteSection {
  type: 'heading' | 'bullet' | 'definition' | 'example' | 'formula' | 'callout' | 'diagram' | 'summary';
  content: string;
  level?: number;
  style?: string;
  importance: 'high' | 'medium' | 'low';
  visualHint?: string;
}

export interface SegmentedContent {
  title: string;
  sections: NoteSection[];
  structure: 'linear' | 'hierarchical' | 'network';
  estimatedReadTime: number;
}

export async function segmentContent(content: string, classification: ClassificationResult): Promise<SegmentedContent> {
  const prompt = `Create advanced segmented notes for ${classification.subject} content with ${classification.visualComplexity} complexity.
  
  Based on successful patterns from similar content, create optimal segments with:
  - title: Engaging, memorable title
  - sections: Enhanced section objects with:
    - type: Extended types including "diagram", "summary"
    - content: Clear, student-friendly text
    - level: Hierarchy depth (1-4)
    - style: Visual style hints
    - importance: Content priority level
    - visualHint: Suggestions for visual elements
  - structure: Overall organization pattern
  - estimatedReadTime: Reading time in minutes

  Optimize for ${classification.difficulty} level learners in ${classification.contentType} context.
  Use successful design patterns: ${Array.from(learningCache.successfulDesigns.values()).slice(-2).map(d => d.layoutStyle).join(', ')}
  
  Content: ${content}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["heading", "bullet", "definition", "example", "formula", "callout", "diagram", "summary"] },
                  content: { type: "string" },
                  level: { type: "number" },
                  style: { type: "string" },
                  importance: { type: "string", enum: ["high", "medium", "low"] },
                  visualHint: { type: "string" }
                },
                required: ["type", "content", "importance"]
              }
            },
            structure: { type: "string", enum: ["linear", "hierarchical", "network"] },
            estimatedReadTime: { type: "number" }
          },
          required: ["title", "sections", "structure", "estimatedReadTime"]
        }
      },
      contents: prompt
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    throw new Error(`Enhanced segmentation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Agent 3: Advanced Structure Formatter with Adaptive Design
export interface FormattedSection {
  type: string;
  content: string;
  emoji?: string;
  color?: string;
  highlights?: string[];
  level?: number;
  visualElements?: string[];
  animations?: string[];
  interactivity?: string;
}

export interface FormattedNotes {
  title: string;
  emoji: string;
  color_theme: string;
  sections: FormattedSection[];
  designLanguage: string;
  accessibility: object;
  responsiveness: object;
}

export async function formatNotes(segmented: SegmentedContent, classification: ClassificationResult): Promise<FormattedNotes> {
  // Get best design template for this subject
  const bestTemplate = Array.from(learningCache.successfulDesigns.values())
    .filter(d => d.subject === classification.subject)
    .sort((a, b) => b.successScore - a.successScore)[0];

  const prompt = `Transform notes into premium design with adaptive formatting.

  Subject: ${classification.subject} (${classification.contentType})
  Difficulty: ${classification.difficulty}
  Visual Complexity: ${classification.visualComplexity}
  ${bestTemplate ? `Use successful template: ${bestTemplate.colorScheme} with ${bestTemplate.layoutStyle}` : ''}

  Enhanced features:
  - Modern emoji usage with semantic meaning
  - Advanced color psychology for ${classification.subject}
  - Progressive disclosure patterns
  - Visual hierarchy optimization
  - Accessibility considerations
  - Mobile-responsive design hints

  Premium design themes by subject:
  - Science: Aurora gradients (blue/teal/purple)
  - Math: Geometric patterns (purple/gold/silver)
  - History: Vintage elegance (sepia/gold/burgundy)
  - Language: Nature-inspired (green/earth tones)
  - Business: Professional modern (navy/silver/accent)
  - Art: Creative freedom (rainbow/pastels/bold)

  Input: ${JSON.stringify(segmented)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            emoji: { type: "string" },
            color_theme: { type: "string" },
            sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  content: { type: "string" },
                  emoji: { type: "string" },
                  color: { type: "string" },
                  highlights: { type: "array", items: { type: "string" } },
                  level: { type: "number" },
                  visualElements: { type: "array", items: { type: "string" } },
                  animations: { type: "array", items: { type: "string" } },
                  interactivity: { type: "string" }
                },
                required: ["type", "content"]
              }
            },
            designLanguage: { type: "string" },
            accessibility: { 
              type: "object",
              properties: {
                altText: { type: "string" },
                contrast: { type: "string" },
                fontSize: { type: "string" }
              }
            },
            responsiveness: { 
              type: "object",
              properties: {
                mobile: { type: "string" },
                tablet: { type: "string" },
                desktop: { type: "string" }
              }
            }
          },
          required: ["title", "emoji", "color_theme", "sections", "designLanguage"]
        }
      },
      contents: prompt
    });

    const result = JSON.parse(response.text || "{}");
    
    // Learn from successful formatting
    const designKey = `${classification.subject}_${classification.difficulty}`;
    const existingTemplate = learningCache.successfulDesigns.get(designKey);
    
    if (existingTemplate) {
      existingTemplate.usageCount++;
    } else {
      learningCache.successfulDesigns.set(designKey, {
        subject: classification.subject,
        colorScheme: result.color_theme,
        fontCombination: result.designLanguage,
        layoutStyle: segmented.structure,
        successScore: 0.8,
        usageCount: 1
      });
    }

    return result;
  } catch (error) {
    throw new Error(`Enhanced formatting failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Agent 4: Next-Gen Aesthetic Designer
export interface DesignedLayout {
  title: string;
  theme: string;
  layout_blocks: LayoutBlock[];
  style_config: StyleConfig;
  animations: AnimationConfig[];
  interactions: InteractionConfig[];
  responsive_breakpoints: ResponsiveConfig;
}

export interface LayoutBlock {
  type: string;
  content: string;
  position: { x: number; y: number; width: number; height: number };
  style: {
    font_family: string;
    font_size: number;
    color: string;
    background?: string;
    border?: string;
    padding: number;
    shadow?: string;
    transform?: string;
  };
  animation?: string;
  interaction?: string;
}

export interface StyleConfig {
  page_size: string;
  margins: { top: number; right: number; bottom: number; left: number };
  font_families: { heading: string; body: string; accent: string; code?: string };
  color_palette: { 
    primary: string; 
    secondary: string; 
    accent: string; 
    background: string;
    gradient?: string;
  };
  spacing_system: number[];
  typography_scale: number[];
}

export interface AnimationConfig {
  name: string;
  trigger: string;
  duration: number;
  easing: string;
}

export interface InteractionConfig {
  element: string;
  action: string;
  effect: string;
}

export interface ResponsiveConfig {
  mobile: object;
  tablet: object;
  desktop: object;
}

export async function designLayout(formatted: FormattedNotes): Promise<DesignedLayout> {
  const prompt = `Design a stunning, next-generation layout for study notes with premium aesthetics.

  Create an award-winning design with:
  - Modern typography combinations
  - Sophisticated color gradients
  - Micro-interactions and subtle animations
  - Perfect spacing and visual rhythm
  - Mobile-first responsive design
  - Accessibility compliance
  - Print optimization

  Premium font pairings:
  - Academic: "Inter" + "JetBrains Mono" + "Playfair Display"
  - Creative: "Poppins" + "Fira Code" + "Dancing Script"
  - Professional: "Source Sans Pro" + "Source Code Pro" + "Merriweather"
  - Playful: "Nunito" + "Ubuntu Mono" + "Pacifico"

  Advanced design systems:
  - Color harmony with psychological impact
  - Golden ratio spacing (1.618)
  - Typographic scales (1.25, 1.333, 1.414)
  - Shadow depth layers
  - Motion design principles

  Input theme: ${formatted.color_theme}
  Content: ${JSON.stringify(formatted).substring(0, 1000)}...`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            theme: { type: "string" },
            layout_blocks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  content: { type: "string" },
                  position: {
                    type: "object",
                    properties: {
                      x: { type: "number" },
                      y: { type: "number" },
                      width: { type: "number" },
                      height: { type: "number" }
                    },
                    required: ["x", "y", "width", "height"]
                  },
                  style: {
                    type: "object",
                    properties: {
                      font_family: { type: "string" },
                      font_size: { type: "number" },
                      color: { type: "string" },
                      background: { type: "string" },
                      border: { type: "string" },
                      padding: { type: "number" },
                      shadow: { type: "string" },
                      transform: { type: "string" }
                    },
                    required: ["font_family", "font_size", "color", "padding"]
                  },
                  animation: { type: "string" },
                  interaction: { type: "string" }
                },
                required: ["type", "content", "position", "style"]
              }
            },
            style_config: {
              type: "object",
              properties: {
                page_size: { type: "string" },
                margins: {
                  type: "object",
                  properties: {
                    top: { type: "number" },
                    right: { type: "number" },
                    bottom: { type: "number" },
                    left: { type: "number" }
                  },
                  required: ["top", "right", "bottom", "left"]
                },
                font_families: {
                  type: "object",
                  properties: {
                    heading: { type: "string" },
                    body: { type: "string" },
                    accent: { type: "string" },
                    code: { type: "string" }
                  },
                  required: ["heading", "body", "accent"]
                },
                color_palette: {
                  type: "object",
                  properties: {
                    primary: { type: "string" },
                    secondary: { type: "string" },
                    accent: { type: "string" },
                    background: { type: "string" },
                    gradient: { type: "string" }
                  },
                  required: ["primary", "secondary", "accent", "background"]
                },
                spacing_system: { type: "array", items: { type: "number" } },
                typography_scale: { type: "array", items: { type: "number" } }
              },
              required: ["page_size", "margins", "font_families", "color_palette", "spacing_system", "typography_scale"]
            },
            animations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  trigger: { type: "string" },
                  duration: { type: "number" },
                  easing: { type: "string" }
                },
                required: ["name", "trigger", "duration", "easing"]
              }
            },
            interactions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  element: { type: "string" },
                  action: { type: "string" },
                  effect: { type: "string" }
                },
                required: ["element", "action", "effect"]
              }
            },
            responsive_breakpoints: {
              type: "object",
              properties: {
                mobile: { type: "object" },
                tablet: { type: "object" },
                desktop: { type: "object" }
              },
              required: ["mobile", "tablet", "desktop"]
            }
          },
          required: ["title", "theme", "layout_blocks", "style_config", "animations", "interactions", "responsive_breakpoints"]
        }
      },
      contents: prompt
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    throw new Error(`Enhanced design failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Agent 5: Premium PDF Renderer with Advanced Styling
export function generatePDFHTML(design: DesignedLayout): string {
  const { style_config, layout_blocks, title, animations = [], interactions = [] } = design;
  
  // Generate advanced CSS with modern features
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&family=Source+Sans+Pro:wght@300;400;600&family=Nunito:wght@300;400;600;700&family=Ubuntu+Mono:wght@400;700&family=Merriweather:wght@300;400;700&display=swap');
    
    :root {
      --primary: ${style_config.color_palette.primary};
      --secondary: ${style_config.color_palette.secondary};
      --accent: ${style_config.color_palette.accent};
      --background: ${style_config.color_palette.background};
      --gradient: ${style_config.color_palette.gradient || 'linear-gradient(135deg, var(--primary), var(--accent))'};
      --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
      --shadow-md: 0 4px 12px rgba(0,0,0,0.15);
      --shadow-lg: 0 8px 24px rgba(0,0,0,0.2);
      --radius: 12px;
      --spacing-xs: ${style_config.spacing_system[0] || 4}px;
      --spacing-sm: ${style_config.spacing_system[1] || 8}px;
      --spacing-md: ${style_config.spacing_system[2] || 16}px;
      --spacing-lg: ${style_config.spacing_system[3] || 24}px;
      --spacing-xl: ${style_config.spacing_system[4] || 32}px;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: '${style_config.font_families.body}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--background);
      color: #2a2e33;
      line-height: 1.7;
      padding: ${style_config.margins.top}px ${style_config.margins.right}px ${style_config.margins.bottom}px ${style_config.margins.left}px;
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .page {
      width: 100%;
      min-height: 100vh;
      position: relative;
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      box-shadow: var(--shadow-lg);
      border-radius: var(--radius);
      overflow: hidden;
    }
    
    .title {
      font-family: '${style_config.font_families.heading}', serif;
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 700;
      text-align: center;
      margin-bottom: var(--spacing-xl);
      background: var(--gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
      letter-spacing: -0.02em;
    }
    
    .title::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 4px;
      background: var(--gradient);
      border-radius: 2px;
    }
    
    .section {
      margin-bottom: var(--spacing-lg);
      position: relative;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .section:hover {
      transform: translateY(-2px);
    }
    
    .heading {
      font-family: '${style_config.font_families.heading}', serif;
      font-size: clamp(1.25rem, 3vw, 2rem);
      font-weight: 600;
      color: var(--primary);
      margin-bottom: var(--spacing-md);
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }
    
    .heading::before {
      content: '';
      width: 4px;
      height: 100%;
      background: var(--gradient);
      border-radius: 2px;
    }
    
    .bullet {
      font-family: '${style_config.font_families.body}', sans-serif;
      font-size: 1.1rem;
      margin-bottom: var(--spacing-sm);
      padding-left: var(--spacing-lg);
      position: relative;
      line-height: 1.6;
    }
    
    .bullet::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0.6em;
      width: 8px;
      height: 8px;
      background: var(--gradient);
      border-radius: 50%;
      box-shadow: var(--shadow-sm);
    }
    
    .definition {
      background: linear-gradient(135deg, var(--secondary)15, var(--secondary)08);
      border-left: 4px solid var(--accent);
      padding: var(--spacing-md);
      margin: var(--spacing-md) 0;
      border-radius: var(--radius);
      font-family: '${style_config.font_families.body}', sans-serif;
      box-shadow: var(--shadow-md);
      position: relative;
      overflow: hidden;
    }
    
    .definition::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--gradient);
    }
    
    .example {
      background: linear-gradient(135deg, #e3f2fd, #bbdefb);
      border: 2px solid var(--primary);
      padding: var(--spacing-md);
      margin: var(--spacing-md) 0;
      border-radius: var(--radius);
      font-family: '${style_config.font_families.body}', sans-serif;
      position: relative;
      box-shadow: var(--shadow-md);
    }
    
    .formula {
      background: linear-gradient(135deg, #f3e5f5, #e1bee7);
      border: 2px solid var(--accent);
      padding: var(--spacing-md);
      margin: var(--spacing-md) 0;
      border-radius: var(--radius);
      font-family: '${style_config.font_families.code || 'JetBrains Mono'}', monospace;
      text-align: center;
      font-size: 1.2rem;
      box-shadow: var(--shadow-md);
      letter-spacing: 0.02em;
    }
    
    .callout {
      background: linear-gradient(135deg, #fff3e0, #ffe0b2);
      border: 2px solid #ff9800;
      padding: var(--spacing-md);
      margin: var(--spacing-md) 0;
      border-radius: var(--radius);
      font-family: '${style_config.font_families.body}', sans-serif;
      position: relative;
      box-shadow: var(--shadow-md);
    }
    
    .callout::before {
      content: "💡";
      position: absolute;
      top: -12px;
      left: var(--spacing-md);
      font-size: 1.5rem;
      background: white;
      border-radius: 50%;
      padding: 6px;
      box-shadow: var(--shadow-sm);
    }
    
    .diagram {
      background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
      border: 2px dashed var(--primary);
      padding: var(--spacing-lg);
      margin: var(--spacing-md) 0;
      border-radius: var(--radius);
      text-align: center;
      font-family: '${style_config.font_families.body}', sans-serif;
      min-height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    
    .summary {
      background: var(--gradient);
      color: white;
      padding: var(--spacing-lg);
      margin: var(--spacing-lg) 0;
      border-radius: var(--radius);
      font-family: '${style_config.font_families.body}', sans-serif;
      box-shadow: var(--shadow-lg);
      position: relative;
    }
    
    .highlight {
      background: linear-gradient(135deg, #ffeb3b, #fff59d);
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 600;
      box-shadow: var(--shadow-sm);
    }
    
    .emoji {
      font-size: 1.4em;
      margin-right: var(--spacing-sm);
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
    }
    
    .footer {
      position: fixed;
      bottom: var(--spacing-md);
      right: var(--spacing-md);
      font-family: '${style_config.font_families.body}', sans-serif;
      color: #64748b;
      font-size: 0.9rem;
      background: rgba(255,255,255,0.9);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: 6px;
      backdrop-filter: blur(10px);
    }
    
    /* Animation keyframes */
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      body { font-size: 14px; padding: var(--spacing-md); }
      .title { font-size: 2rem; }
      .heading { font-size: 1.5rem; }
      .section { margin-bottom: var(--spacing-md); }
    }
    
    @media print {
      body { 
        background: white;
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      .page { box-shadow: none; margin: 0; }
      .footer { position: static; margin-top: var(--spacing-lg); }
    }
  `;

  // Generate enhanced HTML content with semantic structure
  let htmlContent = '';
  
  layout_blocks.forEach((block, index) => {
    const emoji = block.content.match(/^[^\w\s]+/)?.[0] || '';
    const content = block.content.replace(/^[^\w\s]+\s*/, '');
    const animationClass = block.animation ? `style="animation: ${block.animation} 0.6s ease-out ${index * 0.1}s both"` : '';
    
    switch (block.type) {
      case 'heading':
        const level = block.style.font_size > 20 ? '2' : '3';
        htmlContent += `<div class="section" ${animationClass}><h${level} class="heading"><span class="emoji">${emoji}</span>${content}</h${level}></div>`;
        break;
      case 'bullet':
        htmlContent += `<div class="bullet" ${animationClass}><span class="emoji">${emoji}</span>${content}</div>`;
        break;
      case 'definition':
        htmlContent += `<div class="definition" ${animationClass}><span class="emoji">${emoji}</span><strong>Definition:</strong> ${content}</div>`;
        break;
      case 'example':
        htmlContent += `<div class="example" ${animationClass}><span class="emoji">${emoji}</span><strong>Example:</strong> ${content}</div>`;
        break;
      case 'formula':
        htmlContent += `<div class="formula" ${animationClass}><span class="emoji">${emoji}</span>${content}</div>`;
        break;
      case 'callout':
        htmlContent += `<div class="callout" ${animationClass}><span class="emoji">${emoji}</span>${content}</div>`;
        break;
      case 'diagram':
        htmlContent += `<div class="diagram" ${animationClass}><span class="emoji">${emoji}</span><strong>Diagram:</strong> ${content}</div>`;
        break;
      case 'summary':
        htmlContent += `<div class="summary" ${animationClass}><span class="emoji">${emoji}</span><strong>Summary:</strong> ${content}</div>`;
        break;
      default:
        htmlContent += `<div class="section" ${animationClass}>${block.content}</div>`;
    }
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Premium Study Notes</title>
      <meta name="description" content="AI-generated study notes with beautiful design">
      <style>${css}</style>
    </head>
    <body>
      <div class="page">
        <h1 class="title">${title}</h1>
        ${htmlContent}
        <div class="footer">✨ Generated by Briefly.AI NoteGen • Premium Design</div>
      </div>
    </body>
    </html>
  `;
}

// Enhanced Main NoteGen Engine with Learning & Performance Optimization
export async function generateStudyNotesPDF(content: string): Promise<{ html: string; filename: string }> {
  const startTime = Date.now();
  console.log("🚀 Enhanced NoteGen AI Engine starting...");
  
  try {
    console.log("🔍 Step 1: Advanced content classification...");
    const classification = await classifyContent(content);
    console.log(`📊 Classification confidence: ${classification.confidence}`);
    
    console.log("✂️ Step 2: Intelligent content segmentation...");
    const segmented = await segmentContent(content, classification);
    console.log(`📖 Estimated read time: ${segmented.estimatedReadTime} minutes`);
    
    console.log("🎨 Step 3: Adaptive formatting with learning...");
    const formatted = await formatNotes(segmented, classification);
    
    console.log("🖼️ Step 4: Next-gen aesthetic design...");
    const designed = await designLayout(formatted);
    
    console.log("📄 Step 5: Premium PDF generation...");
    const html = generatePDFHTML(designed);
    
    const processingTime = Date.now() - startTime;
    console.log(`⚡ Total processing time: ${processingTime}ms`);
    
    // Update learning metrics
    learningCache.performanceMetrics.set(`full_pipeline_${Date.now()}`, {
      processingTime,
      userSatisfaction: 0.9, // Will be updated with actual feedback
      errorRate: 0,
      timestamp: Date.now()
    });
    
    // Save learning data periodically
    if (Math.random() < 0.1) { // 10% chance to save
      saveLearningData();
    }
    
    const filename = `${formatted.title.replace(/[^a-zA-Z0-9]/g, '_')}_premium_notes.pdf`;
    
    return { html, filename };
  } catch (error) {
    console.error("❌ NoteGen Engine error:", error);
    throw new Error(`Enhanced NoteGen Engine failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Learning feedback function (to be called when user provides feedback)
export function updateLearningFeedback(contentHash: string, satisfactionScore: number, designPreferences: Partial<UserPreference>) {
  const metric = learningCache.performanceMetrics.get(contentHash);
  if (metric) {
    metric.userSatisfaction = satisfactionScore;
  }
  
  // Update user preferences
  const userId = 'default'; // In real app, get from user session
  const existing = learningCache.userPreferences.get(userId) || {
    preferredColors: [],
    favoriteLayouts: [],
    complexityLevel: 'moderate',
    visualDensity: 'balanced'
  };
  
  learningCache.userPreferences.set(userId, { ...existing, ...designPreferences });
  saveLearningData();
}

// Performance analytics
export function getPerformanceAnalytics() {
  const metrics = Array.from(learningCache.performanceMetrics.values());
  const avgProcessingTime = metrics.reduce((sum, m) => sum + m.processingTime, 0) / metrics.length;
  const avgSatisfaction = metrics.reduce((sum, m) => sum + m.userSatisfaction, 0) / metrics.length;
  const totalProcessed = metrics.length;
  
  return {
    averageProcessingTime: Math.round(avgProcessingTime),
    averageSatisfaction: Math.round(avgSatisfaction * 100),
    totalNotesGenerated: totalProcessed,
    successfulDesigns: learningCache.successfulDesigns.size,
    learnedPatterns: learningCache.contentPatterns.size
  };
}
