import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import type { BrandResearch, Platform, GeneratedContent } from '../types/campaign.types';
import { textOverlayService } from './text-overlay.service';

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const STABILITY_API_HOST = 'https://api.stability.ai';

export class ImageService {
  private outputDir = path.join(process.cwd(), 'public', 'generated');

  constructor() {
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generateImages(
    brandResearch: BrandResearch,
    platforms: Platform[],
    campaignId: string,
    generatedContent?: GeneratedContent
  ): Promise<{ platform: Platform; url: string; width: number; height: number }[]> {
    const images: { platform: Platform; url: string; width: number; height: number }[] = [];

    for (const platform of platforms) {
      try {
        const image = await this.generateImageForPlatform(
          brandResearch,
          platform,
          campaignId,
          generatedContent
        );
        images.push(image);
      } catch (error: any) {
        console.error(`Failed to generate image for ${platform}:`, error.message);
        // Continue with other platforms even if one fails
      }
    }

    return images;
  }

  private async generateImageForPlatform(
    brandResearch: BrandResearch,
    platform: Platform,
    campaignId: string,
    generatedContent?: GeneratedContent
  ): Promise<{ platform: Platform; url: string; width: number; height: number }> {
    const dimensions = this.getPlatformDimensions(platform);
    const prompt = this.buildImagePrompt(brandResearch, platform);

    if (!STABILITY_API_KEY) {
      // Return placeholder if API key not configured
      return {
        platform,
        url: `/placeholders/${platform}-placeholder.svg`,
        width: dimensions.width,
        height: dimensions.height,
      };
    }

    try {
      const response = await axios.post(
        `${STABILITY_API_HOST}/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`,
        {
          text_prompts: [
            {
              text: prompt,
              weight: 1,
            },
            {
              text: 'blurry, bad quality, distorted, ugly, low resolution, watermark',
              weight: -1,
            },
          ],
          cfg_scale: 7,
          height: dimensions.height,
          width: dimensions.width,
          samples: 1,
          steps: 30,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${STABILITY_API_KEY}`,
          },
        }
      );

      const image = response.data.artifacts[0];
      const fileName = `${campaignId}-${platform}-${Date.now()}.png`;
      const filePath = path.join(this.outputDir, fileName);

      // Save base64 image to file
      const buffer = Buffer.from(image.base64, 'base64');
      fs.writeFileSync(filePath, buffer);

      // Add text overlay if headline is available
      let finalBuffer: Buffer = buffer;
      if (generatedContent) {
        const headline = textOverlayService.extractHeadline(platform, generatedContent);
        if (headline) {
          try {
            const overlayBuffer = await textOverlayService.addTextOverlay(filePath, {
              text: headline,
              width: dimensions.width,
              height: dimensions.height,
              fontSize: this.getFontSizeForPlatform(platform, dimensions.height),
              fontColor: '#FFFFFF',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              position: 'bottom',
              padding: 20,
              maxWidth: dimensions.width * 0.9,
            });
            
            finalBuffer = Buffer.from(overlayBuffer);
            
            // Save the image with text overlay
            fs.writeFileSync(filePath, finalBuffer);
          } catch (overlayError: any) {
            console.error(`Text overlay failed for ${platform}, using original image:`, overlayError.message);
            // Continue with original image if overlay fails
          }
        }
      }

      return {
        platform,
        url: `/generated/${fileName}`,
        width: dimensions.width,
        height: dimensions.height,
      };
    } catch (error: any) {
      console.error(`Stability AI error for ${platform}:`, error.response?.data || error.message);
      
      // Return placeholder on error
      return {
        platform,
        url: `/placeholders/${platform}-placeholder.svg`,
        width: dimensions.width,
        height: dimensions.height,
      };
    }
  }

  /**
   * Get appropriate font size based on platform and image height
   */
  private getFontSizeForPlatform(platform: Platform, imageHeight: number): number {
    // Scale font size based on image height (base: 60px for 1024px height)
    const baseFontSize = 60;
    const scaleFactor = imageHeight / 1024;
    
    const platformFontSizes = {
      instagram: baseFontSize * scaleFactor,
      linkedin: baseFontSize * scaleFactor * 0.9, // Slightly smaller for LinkedIn
      twitter: baseFontSize * scaleFactor * 0.85,  // Smaller for Twitter
    };

    return Math.max(32, Math.min(80, platformFontSizes[platform])); // Clamp between 32-80px
  }

  private buildImagePrompt(brandResearch: BrandResearch, platform: Platform): string {
    const basePrompt = `Professional ${platform} ad banner for ${brandResearch.brandName}. `;
    
    const styleMap = {
      instagram: 'vibrant, eye-catching, modern design with bold colors',
      linkedin: 'professional, corporate, clean business aesthetic',
      twitter: 'bold, minimalist, attention-grabbing design',
    };

    const description = `${brandResearch.description.substring(0, 150)}. `;
    const style = styleMap[platform];
    const context = `${brandResearch.positioning}. High quality, professional marketing material, `;
    const technical = 'sharp focus, detailed, commercial photography style, no text or letters';

    return `${basePrompt}${description}${style}, ${context}${technical}`;
  }

  private getPlatformDimensions(platform: Platform): { width: number; height: number } {
    const dimensionsMap = {
      instagram: { width: 1024, height: 1024 }, // Square post
      linkedin: { width: 1024, height: 512 },   // Banner ~2:1
      twitter: { width: 1024, height: 512 },    // Card ~2:1
    };

    return dimensionsMap[platform];
  }

  // Create placeholder images if Stability AI is not configured
  createPlaceholders(): void {
    const placeholderDir = path.join(process.cwd(), 'public', 'placeholders');
    
    if (!fs.existsSync(placeholderDir)) {
      fs.mkdirSync(placeholderDir, { recursive: true });
    }

    const platforms: Platform[] = ['instagram', 'linkedin', 'twitter'];
    
    for (const platform of platforms) {
      const dimensions = this.getPlatformDimensions(platform);
      const svg = this.createPlaceholderSVG(platform, dimensions.width, dimensions.height);
      const fileName = `${platform}-placeholder.png`;
      const filePath = path.join(placeholderDir, fileName);
      
      // For now, just create a simple marker file
      // In production, you'd generate actual placeholder images
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(
          filePath.replace('.png', '.svg'),
          svg
        );
      }
    }
  }

  private createPlaceholderSVG(platform: Platform, width: number, height: number): string {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="32" fill="#6b7280">
        ${platform.toUpperCase()} Ad Banner
      </text>
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="#9ca3af">
        ${width} × ${height}
      </text>
    </svg>`;
  }
}

export const imageService = new ImageService();
