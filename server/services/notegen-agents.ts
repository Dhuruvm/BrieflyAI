import { GoogleGenAI } from "@google/genai";
import type { Note } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Agent 1: Topic Classifier
export interface ClassificationResult {
  subject: string;
  tone: string;
  language: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export async function classifyContent(content: string): Promise<ClassificationResult> {
  const prompt = `Analyze this content and classify it. Return JSON with:
  - subject: The main academic subject (e.g., "Physics", "Mathematics", "Biology", "History")
  - tone: The writing style (e.g., "academic", "casual", "technical", "explanatory")
  - language: The language of the content
  - tags: Array of relevant tags (e.g., ["definitions", "formulas", "examples", "diagrams"])
  - difficulty: Level assessment ("beginner", "intermediate", "advanced")

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
            difficulty: { type: "string", enum: ["beginner", "intermediate", "advanced"] }
          },
          required: ["subject", "tone", "language", "tags", "difficulty"]
        }
      },
      contents: prompt
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    throw new Error(`Classification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Agent 2: Content Segmentor
export interface NoteSection {
  type: 'heading' | 'bullet' | 'definition' | 'example' | 'formula' | 'callout';
  content: string;
  level?: number; // for headings
  style?: string;
}

export interface SegmentedContent {
  title: string;
  sections: NoteSection[];
}

export async function segmentContent(content: string, classification: ClassificationResult): Promise<SegmentedContent> {
  const prompt = `Segment this ${classification.subject} content into structured note sections. 
  
  Create a JSON response with:
  - title: Main title for the notes
  - sections: Array of section objects with:
    - type: "heading", "bullet", "definition", "example", "formula", or "callout"
    - content: The text content
    - level: For headings (1-3)
    - style: Optional style hint
  
  Focus on creating clear, study-friendly segments. Break down complex concepts into digestible pieces.
  
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
                  type: { type: "string", enum: ["heading", "bullet", "definition", "example", "formula", "callout"] },
                  content: { type: "string" },
                  level: { type: "number" },
                  style: { type: "string" }
                },
                required: ["type", "content"]
              }
            }
          },
          required: ["title", "sections"]
        }
      },
      contents: prompt
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    throw new Error(`Segmentation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Agent 3: Structure Formatter
export interface FormattedSection {
  type: string;
  content: string;
  emoji?: string;
  color?: string;
  highlights?: string[];
  level?: number;
}

export interface FormattedNotes {
  title: string;
  emoji: string;
  color_theme: string;
  sections: FormattedSection[];
}

export async function formatNotes(segmented: SegmentedContent, classification: ClassificationResult): Promise<FormattedNotes> {
  const prompt = `Transform these segmented notes into a beautifully formatted structure with emojis, colors, and highlights.

  Subject: ${classification.subject}
  Difficulty: ${classification.difficulty}
  Tags: ${classification.tags.join(', ')}

  Add appropriate emojis for each section type:
  - Headings: Subject-relevant emojis (🧬 for biology, ⚗️ for chemistry, 📐 for math, etc.)
  - Definitions: 📝, 📖, 💡
  - Examples: 🔍, 📊, 🎯
  - Formulas: 🧮, ⚡, 🔢
  - Callouts: 💡, ⚠️, ✨, 🎓

  Choose a color theme based on subject:
  - Science: blue/teal
  - Math: purple/violet  
  - History: brown/gold
  - Language: green/emerald
  - Art: pink/rose

  Identify key terms to highlight in bold or with background colors.

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
                  level: { type: "number" }
                },
                required: ["type", "content"]
              }
            }
          },
          required: ["title", "emoji", "color_theme", "sections"]
        }
      },
      contents: prompt
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    throw new Error(`Formatting failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Agent 4: Aesthetic Designer
export interface DesignedLayout {
  title: string;
  theme: string;
  layout_blocks: LayoutBlock[];
  style_config: StyleConfig;
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
  };
}

export interface StyleConfig {
  page_size: string;
  margins: { top: number; right: number; bottom: number; left: number };
  font_families: { heading: string; body: string; accent: string };
  color_palette: { primary: string; secondary: string; accent: string; background: string };
}

export async function designLayout(formatted: FormattedNotes): Promise<DesignedLayout> {
  const prompt = `Create an aesthetic layout design for these formatted notes. Design it like beautiful handwritten study notes.

  Use these handwritten-style fonts:
  - Headings: "Patrick Hand", "Shadows Into Light", "Kalam"
  - Body: "Caveat", "Dancing Script", "Baloo 2"
  - Accent: "Permanent Marker", "Fredoka One"

  Create a layout with visual elements:
  - Pastel color backgrounds for sections
  - Decorative borders and dividers
  - Proper spacing and hierarchy
  - Emoji placement
  - Highlight boxes for key terms

  Color themes:
  - ${formatted.color_theme}: Use appropriate pastel shades
  - Background: cream/off-white
  - Text: dark gray/charcoal
  - Accents: bright but soft colors

  Input: ${JSON.stringify(formatted)}`;

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
                      padding: { type: "number" }
                    },
                    required: ["font_family", "font_size", "color", "padding"]
                  }
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
                    accent: { type: "string" }
                  },
                  required: ["heading", "body", "accent"]
                },
                color_palette: {
                  type: "object",
                  properties: {
                    primary: { type: "string" },
                    secondary: { type: "string" },
                    accent: { type: "string" },
                    background: { type: "string" }
                  },
                  required: ["primary", "secondary", "accent", "background"]
                }
              },
              required: ["page_size", "margins", "font_families", "color_palette"]
            }
          },
          required: ["title", "theme", "layout_blocks", "style_config"]
        }
      },
      contents: prompt
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    throw new Error(`Design failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Agent 5: PDF Renderer (HTML to PDF)
export function generatePDFHTML(design: DesignedLayout): string {
  const { style_config, layout_blocks, title } = design;
  
  // Generate CSS for handwritten style
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand:wght@400&family=Caveat:wght@400;700&family=Shadows+Into+Light&family=Kalam:wght@300;400;700&family=Dancing+Script:wght@400;700&family=Baloo+2:wght@400;500;700&family=Permanent+Marker&family=Fredoka+One:wght@400&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: '${style_config.font_families.body}', cursive;
      background: ${style_config.color_palette.background};
      color: #2d3748;
      line-height: 1.6;
      padding: ${style_config.margins.top}px ${style_config.margins.right}px ${style_config.margins.bottom}px ${style_config.margins.left}px;
    }
    
    .page {
      width: 100%;
      min-height: 100vh;
      position: relative;
      background: linear-gradient(135deg, #fefcfb 0%, #f8f6f3 100%);
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    
    .title {
      font-family: '${style_config.font_families.heading}', cursive;
      font-size: 2.5rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 2rem;
      color: ${style_config.color_palette.primary};
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
      transform: rotate(-1deg);
    }
    
    .section {
      margin-bottom: 1.5rem;
      position: relative;
    }
    
    .heading {
      font-family: '${style_config.font_families.heading}', cursive;
      font-size: 1.8rem;
      font-weight: 700;
      color: ${style_config.color_palette.primary};
      margin-bottom: 1rem;
      position: relative;
      transform: rotate(-0.5deg);
    }
    
    .bullet {
      font-family: '${style_config.font_families.body}', cursive;
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      padding-left: 1.5rem;
      position: relative;
    }
    
    .bullet::before {
      content: "•";
      color: ${style_config.color_palette.accent};
      font-size: 1.5rem;
      position: absolute;
      left: 0;
      top: -2px;
    }
    
    .definition {
      background: linear-gradient(135deg, ${style_config.color_palette.secondary}20, ${style_config.color_palette.secondary}10);
      border-left: 4px solid ${style_config.color_palette.accent};
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 8px;
      font-family: '${style_config.font_families.body}', cursive;
      transform: rotate(0.2deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .example {
      background: linear-gradient(135deg, #e3f2fd, #bbdefb);
      border: 2px dashed ${style_config.color_palette.primary};
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 12px;
      font-family: '${style_config.font_families.body}', cursive;
      transform: rotate(-0.3deg);
    }
    
    .formula {
      background: linear-gradient(135deg, #f3e5f5, #e1bee7);
      border: 2px solid ${style_config.color_palette.accent};
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 8px;
      font-family: '${style_config.font_families.accent}', cursive;
      text-align: center;
      font-size: 1.2rem;
      transform: rotate(0.1deg);
    }
    
    .callout {
      background: linear-gradient(135deg, #fff3e0, #ffe0b2);
      border: 2px solid #ff9800;
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 12px;
      font-family: '${style_config.font_families.body}', cursive;
      position: relative;
      transform: rotate(-0.2deg);
    }
    
    .callout::before {
      content: "💡";
      position: absolute;
      top: -10px;
      left: -10px;
      font-size: 1.5rem;
      background: white;
      border-radius: 50%;
      padding: 5px;
    }
    
    .highlight {
      background: linear-gradient(135deg, #ffeb3b, #fff59d);
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
    }
    
    .emoji {
      font-size: 1.2em;
      margin-right: 0.5rem;
    }
    
    .footer {
      position: fixed;
      bottom: 20px;
      right: 20px;
      font-family: '${style_config.font_families.body}', cursive;
      color: #9e9e9e;
      font-size: 0.9rem;
    }
    
    @media print {
      body { 
        background: white;
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      .page {
        box-shadow: none;
        margin: 0;
      }
    }
  `;

  // Generate HTML content
  let htmlContent = '';
  
  layout_blocks.forEach(block => {
    const emoji = block.content.match(/^[^\w\s]+/)?.[0] || '';
    const content = block.content.replace(/^[^\w\s]+\s*/, '');
    
    switch (block.type) {
      case 'heading':
        htmlContent += `<div class="section"><h${block.style.font_size > 20 ? '2' : '3'} class="heading"><span class="emoji">${emoji}</span>${content}</h${block.style.font_size > 20 ? '2' : '3'}></div>`;
        break;
      case 'bullet':
        htmlContent += `<div class="bullet"><span class="emoji">${emoji}</span>${content}</div>`;
        break;
      case 'definition':
        htmlContent += `<div class="definition"><span class="emoji">${emoji}</span><strong>Definition:</strong> ${content}</div>`;
        break;
      case 'example':
        htmlContent += `<div class="example"><span class="emoji">${emoji}</span><strong>Example:</strong> ${content}</div>`;
        break;
      case 'formula':
        htmlContent += `<div class="formula"><span class="emoji">${emoji}</span>${content}</div>`;
        break;
      case 'callout':
        htmlContent += `<div class="callout"><span class="emoji">${emoji}</span>${content}</div>`;
        break;
      default:
        htmlContent += `<div class="section">${block.content}</div>`;
    }
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Study Notes</title>
      <style>${css}</style>
    </head>
    <body>
      <div class="page">
        <h1 class="title">${title}</h1>
        ${htmlContent}
        <div class="footer">Generated by Briefly.AI NoteGen</div>
      </div>
    </body>
    </html>
  `;
}

// Main NoteGen Engine Function
export async function generateStudyNotesPDF(content: string): Promise<{ html: string; filename: string }> {
  try {
    console.log("🔍 Step 1: Classifying content...");
    const classification = await classifyContent(content);
    
    console.log("✂️ Step 2: Segmenting content...");
    const segmented = await segmentContent(content, classification);
    
    console.log("🎨 Step 3: Formatting notes...");
    const formatted = await formatNotes(segmented, classification);
    
    console.log("🖼️ Step 4: Designing layout...");
    const designed = await designLayout(formatted);
    
    console.log("📄 Step 5: Generating PDF HTML...");
    const html = generatePDFHTML(designed);
    
    const filename = `${formatted.title.replace(/[^a-zA-Z0-9]/g, '_')}_study_notes.pdf`;
    
    return { html, filename };
  } catch (error) {
    throw new Error(`NoteGen Engine failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}