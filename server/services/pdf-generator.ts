
import { readFileSync } from 'fs';
import { join } from 'path';

export interface PDFOptions {
  format?: 'A4' | 'Letter' | 'A3' | 'A5';
  orientation?: 'portrait' | 'landscape';
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  displayHeaderFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
}

// Fast PDF generation using simple HTML to text conversion
export async function generatePDFFromHTML(
  html: string, 
  filename: string,
  options: PDFOptions = {}
): Promise<Buffer> {
  try {
    // Dynamic import to avoid module loading issues
    const { jsPDF } = await import('jspdf');
    
    // Create new PDF document
    const doc = new jsPDF({
      orientation: options.orientation === 'landscape' ? 'landscape' : 'portrait',
      unit: 'mm',
      format: options.format?.toLowerCase() || 'a4'
    });

    // Extract text content from HTML
    const textContent = extractTextFromHTML(html);
    
    // Set up margins
    const margin = {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20
    };

    // Get page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margin.left - margin.right;
    const contentHeight = pageHeight - margin.top - margin.bottom;

    // Set font
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    // Split text into lines that fit the page width
    const lines = doc.splitTextToSize(textContent, contentWidth);
    
    let currentY = margin.top;
    const lineHeight = 7;

    // Add text to PDF, handling page breaks
    for (let i = 0; i < lines.length; i++) {
      if (currentY + lineHeight > contentHeight + margin.top) {
        doc.addPage();
        currentY = margin.top;
      }
      
      doc.text(lines[i], margin.left, currentY);
      currentY += lineHeight;
    }

    // Convert to buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    return pdfBuffer;

  } catch (error) {
    console.error('jsPDF generation error:', error);
    
    // Ultimate fallback - create a simple text-based PDF response
    return createSimplePDFBuffer(html, filename);
  }
}

// Extract readable text from HTML
function extractTextFromHTML(html: string): string {
  // Remove script and style elements
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Convert common HTML elements to readable text
  text = text.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n$1\n' + '='.repeat(50) + '\n');
  text = text.replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n');
  text = text.replace(/<br[^>]*>/gi, '\n');
  text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\n');
  text = text.replace(/<div[^>]*>(.*?)<\/div>/gi, '\n$1\n');
  text = text.replace(/<span[^>]*>(.*?)<\/span>/gi, '$1');
  
  // Remove all remaining HTML tags
  text = text.replace(/<[^>]*>/g, '');
  
  // Clean up whitespace
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  
  // Normalize whitespace
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
  text = text.replace(/^\s+|\s+$/g, '');
  
  return text;
}

// Create a minimal PDF buffer as ultimate fallback
function createSimplePDFBuffer(html: string, filename: string): Buffer {
  const textContent = extractTextFromHTML(html);
  
  // Create a minimal PDF structure
  const pdfHeader = '%PDF-1.4\n';
  const pdfContent = `1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length ${Buffer.byteLength(textContent, 'utf8') + 100}
>>
stream
BT
/F1 12 Tf
50 750 Td
(${textContent.replace(/\n/g, ') Tj 0 -14 Td (').substring(0, 1000)}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000424 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
521
%%EOF`;

  return Buffer.from(pdfHeader + pdfContent, 'utf8');
}

export async function generateStudyNotesPDF(html: string, filename: string): Promise<Buffer> {
  return generatePDFFromHTML(html, filename, {
    format: 'A4',
    orientation: 'portrait',
    margin: {
      top: '15mm',
      right: '15mm', 
      bottom: '15mm',
      left: '15mm'
    },
    displayHeaderFooter: false,
  });
}

// Alternative lightweight PDF generation - now using jsPDF
export async function generatePDFAlternative(html: string, filename: string): Promise<Buffer> {
  return generatePDFFromHTML(html, filename);
}
