import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

export interface TextOverlayOptions {
  text: string;
  width: number;
  height: number;
  fontSize?: number;
  fontColor?: string;
  backgroundColor?: string;
  position?: 'top' | 'center' | 'bottom';
  padding?: number;
  maxWidth?: number;
}

export class TextOverlayService {
  /**
   * Add text overlay to an image
   * Uses SVG text rendering which is more reliable than canvas on Windows
   */
  async addTextOverlay(
    imagePath: string,
    options: TextOverlayOptions
  ): Promise<Buffer> {
    try {
      // Check if image file exists
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Image file not found: ${imagePath}`);
      }

      // Read the base image
      const imageBuffer = fs.readFileSync(imagePath);
      
      // Validate that we have text to overlay
      if (!options.text || options.text.trim().length === 0) {
        console.warn('No text provided for overlay, returning original image');
        return imageBuffer;
      }
      
      // Create SVG text overlay
      const svgOverlay = this.createTextSVG(options);
      const svgBuffer = Buffer.from(svgOverlay);
      
      // Calculate overlay dimensions for positioning
      const wrappedLines = this.wrapText(
        options.text,
        (options.maxWidth || options.width * 0.9) - (options.padding || 20) * 2,
        options.fontSize || 60
      );
      const lineHeight = (options.fontSize || 60) * 1.2;
      const overlayHeight = wrappedLines.length * lineHeight + (options.padding || 20) * 2;
      const overlayWidth = Math.min(options.maxWidth || options.width * 0.9, options.width - (options.padding || 20) * 2);
      
      // Composite the text overlay onto the image
      const result = await sharp(imageBuffer)
        .composite([
          {
            input: svgBuffer,
            top: this.calculateVerticalPosition(
              options.position || 'bottom',
              options.height,
              options.fontSize || 60,
              overlayHeight
            ),
            left: this.calculateHorizontalPosition(options.width, overlayWidth),
          },
        ])
        .png()
        .toBuffer();

      return result;
    } catch (error: any) {
      console.error('Text overlay error:', error.message);
      // Return original image if overlay fails, but check if file exists first
      try {
        if (fs.existsSync(imagePath)) {
          return fs.readFileSync(imagePath);
        }
      } catch (readError) {
        console.error('Failed to read original image:', readError);
      }
      // If we can't read the original, throw the original error
      throw error;
    }
  }

  /**
   * Create SVG text overlay with proper wrapping
   */
  private createTextSVG(options: TextOverlayOptions): string {
    const {
      text,
      width,
      fontSize = 60,
      fontColor = '#FFFFFF',
      backgroundColor = 'rgba(0, 0, 0, 0.7)',
      padding = 20,
      maxWidth = width * 0.9,
    } = options;

    // Wrap text to fit within maxWidth
    const wrappedLines = this.wrapText(text, maxWidth - padding * 2, fontSize);
    const lineHeight = fontSize * 1.2;
    const totalHeight = wrappedLines.length * lineHeight + padding * 2;
    const svgWidth = Math.min(maxWidth, width - padding * 2);

    // Create SVG with background and text
    const svg = `
      <svg width="${svgWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background rectangle with rounded corners -->
        <rect 
          width="${svgWidth}" 
          height="${totalHeight}" 
          fill="${backgroundColor}" 
          rx="12" 
          ry="12"
        />
        <!-- Text lines -->
        ${wrappedLines
          .map(
            (line, index) => `
          <text 
            x="${svgWidth / 2}" 
            y="${padding + fontSize + index * lineHeight}" 
            dominant-baseline="hanging"
            text-anchor="middle" 
            font-family="Arial, Helvetica, sans-serif" 
            font-size="${fontSize}" 
            font-weight="bold"
            fill="${fontColor}"
          >
            ${this.escapeXml(line)}
          </text>
        `
          )
          .join('')}
      </svg>
    `.trim();

    return svg;
  }

  /**
   * Wrap text to fit within specified width
   * Estimates character width based on font size
   */
  private wrapText(text: string, maxWidth: number, fontSize: number): string[] {
    // Estimate average character width (rough approximation: fontSize * 0.6)
    const avgCharWidth = fontSize * 0.6;
    const maxCharsPerLine = Math.floor(maxWidth / avgCharWidth);
    
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      
      // Check if adding this word would exceed the line length
      if (testLine.length <= maxCharsPerLine) {
        currentLine = testLine;
      } else {
        // Save current line and start new one
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
        
        // If a single word is too long, truncate it
        if (word.length > maxCharsPerLine) {
          const truncated = word.substring(0, maxCharsPerLine - 3) + '...';
          currentLine = truncated;
        }
      }
    }

    // Add the last line
    if (currentLine) {
      lines.push(currentLine);
    }

    // If no lines were created, return at least one line with the text
    if (lines.length === 0) {
      return [text.substring(0, maxCharsPerLine)];
    }

    return lines;
  }

  /**
   * Calculate vertical position for text overlay
   */
  private calculateVerticalPosition(
    position: 'top' | 'center' | 'bottom',
    imageHeight: number,
    fontSize: number,
    overlayHeight?: number
  ): number {
    const padding = 40;
    const estimatedOverlayHeight = overlayHeight || fontSize * 2.5; // Rough estimate if not provided
    
    switch (position) {
      case 'top':
        return padding;
      case 'center':
        return Math.floor((imageHeight - estimatedOverlayHeight) / 2);
      case 'bottom':
      default:
        return Math.max(0, imageHeight - estimatedOverlayHeight - padding);
    }
  }

  /**
   * Calculate horizontal position (centered)
   */
  private calculateHorizontalPosition(imageWidth: number, overlayWidth: number): number {
    return Math.floor((imageWidth - overlayWidth) / 2);
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Extract headline text for a platform from generated content
   */
  extractHeadline(
    platform: 'instagram' | 'linkedin' | 'twitter',
    generatedContent: any
  ): string | null {
    try {
      if (platform === 'instagram' && generatedContent?.instagram?.postIdeas?.[0]?.slogan) {
        return generatedContent.instagram.postIdeas[0].slogan;
      }
      
      if (platform === 'linkedin' && generatedContent?.linkedin?.postDrafts?.[0]) {
        // Extract first sentence or first 50 chars from LinkedIn post
        const post = generatedContent.linkedin.postDrafts[0];
        const firstSentence = post.split(/[.!?]/)[0];
        return firstSentence.length > 60 ? firstSentence.substring(0, 57) + '...' : firstSentence;
      }
      
      if (platform === 'twitter' && generatedContent?.twitter?.adLines?.[0]) {
        return generatedContent.twitter.adLines[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting headline:', error);
      return null;
    }
  }
}

export const textOverlayService = new TextOverlayService();

