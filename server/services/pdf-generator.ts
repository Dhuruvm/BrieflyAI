import puppeteer from 'puppeteer';
import { writeFileSync, unlinkSync } from 'fs';
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

export async function generatePDFFromHTML(
  html: string, 
  filename: string,
  options: PDFOptions = {}
): Promise<Buffer> {
  let browser;
  
  try {
    // Launch puppeteer with optimized settings
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set content with proper encoding
    await page.setContent(html, {
      waitUntil: ['networkidle0', 'domcontentloaded']
    });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // Generate PDF with high quality settings
    const pdfUint8Array = await page.pdf({
      format: options.format || 'A4',
      landscape: options.orientation === 'landscape',
      margin: options.margin || {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      displayHeaderFooter: options.displayHeaderFooter || false,
      headerTemplate: options.headerTemplate || '',
      footerTemplate: options.footerTemplate || '',
      printBackground: true,
      preferCSSPageSize: true,
      scale: 1
    });

    return Buffer.from(pdfUint8Array);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
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

// Alternative lightweight PDF generation
// Note: html-pdf-node types not available, using any

export async function generatePDFAlternative(html: string, filename: string): Promise<Buffer> {
  try {
    // Using dynamic import to handle missing types
    const htmlPdf = await import('html-pdf-node');
    
    const options = {
      format: 'A4',
      landscape: false,
      border: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      },
      paginationOffset: 0,
      type: 'pdf',
      timeout: 30000,
      renderDelay: 2000,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    };

    const file = { content: html };
    const pdfBuffer = await htmlPdf.generatePdf(file, options);
    
    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('Alternative PDF generation error:', error);
    throw new Error(`Failed to generate PDF with alternative method: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}