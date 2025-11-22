import axios from 'axios';
import * as cheerio from 'cheerio';
import type { BrandResearch } from '../types/campaign.types';

export class ScraperService {
  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

  async scrapeWebsite(url: string): Promise<BrandResearch> {
    try {
      // Normalize URL
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;

      // Fetch page content
      const response = await axios.get(normalizedUrl, {
        headers: {
          'User-Agent': this.userAgent,
        },
        timeout: 15000,
        maxRedirects: 5,
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Remove script and style tags
      $('script, style, noscript').remove();

      // Extract text content
      const extractText = (selector: string): string => {
        return $(selector).text().trim().replace(/\s+/g, ' ');
      };

      // Extract brand name
      const brandName = 
        $('meta[property="og:site_name"]').attr('content') ||
        $('title').text().split('|')[0].split('-')[0].trim() ||
        new URL(normalizedUrl).hostname.replace('www.', '').split('.')[0];

      // Extract tagline
      const tagline = 
        $('meta[name="description"]').attr('content') ||
        $('meta[property="og:description"]').attr('content') ||
        $('h2').first().text().trim() ||
        '';

      // Extract main description
      const description = 
        $('meta[name="description"]').attr('content') ||
        $('p').first().text().trim() ||
        extractText('main') ||
        'No description found';

      // Extract features from lists and headings
      const features: string[] = [];
      $('ul li, ol li').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 10 && text.length < 200) {
          features.push(text);
        }
      });

      // Extract headings as potential features
      $('h3, h4').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 5 && text.length < 100) {
          features.push(text);
        }
      });

      // Get all text content for analysis
      const allText = extractText('body');
      const textSample = allText.substring(0, 2000);

      // Basic tone analysis
      const toneOfVoice = this.analyzeTone(textSample);

      // Extract value propositions from headings
      const valuePropositions: string[] = [];
      $('h2, h3').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 10 && text.length < 150) {
          valuePropositions.push(text);
        }
      });

      return {
        brandName: this.capitalize(brandName),
        tagline: tagline.substring(0, 200),
        description: description.substring(0, 500),
        features: features.slice(0, 10),
        positioning: this.inferPositioning(textSample),
        targetAudience: this.inferAudience(textSample),
        toneOfVoice,
        valuePropositions: valuePropositions.slice(0, 5),
      };

    } catch (error: any) {
      console.error('Scraping error:', error.message);
      throw new Error(`Failed to scrape website: ${error.message}`);
    }
  }

  private analyzeTone(text: string): string {
    const lower = text.toLowerCase();
    
    if (lower.includes('enterprise') || lower.includes('business') || lower.includes('professional')) {
      return 'Professional and business-oriented';
    } else if (lower.includes('fun') || lower.includes('easy') || lower.includes('simple')) {
      return 'Casual and friendly';
    } else if (lower.includes('innovative') || lower.includes('cutting-edge') || lower.includes('revolutionary')) {
      return 'Bold and innovative';
    } else {
      return 'Balanced and informative';
    }
  }

  private inferPositioning(text: string): string {
    const lower = text.toLowerCase();
    
    if (lower.includes('leader') || lower.includes('best')) {
      return 'Market leader positioning';
    } else if (lower.includes('affordable') || lower.includes('budget')) {
      return 'Value-focused positioning';
    } else if (lower.includes('premium') || lower.includes('luxury')) {
      return 'Premium positioning';
    } else if (lower.includes('fast') || lower.includes('quick')) {
      return 'Speed and efficiency positioning';
    } else {
      return 'Quality and reliability positioning';
    }
  }

  private inferAudience(text: string): string {
    const lower = text.toLowerCase();
    
    if (lower.includes('business') || lower.includes('enterprise') || lower.includes('b2b')) {
      return 'Business professionals and enterprises';
    } else if (lower.includes('developer') || lower.includes('technical')) {
      return 'Developers and technical users';
    } else if (lower.includes('small business') || lower.includes('startup')) {
      return 'Small businesses and startups';
    } else if (lower.includes('creative') || lower.includes('designer')) {
      return 'Creatives and designers';
    } else {
      return 'General consumers and professionals';
    }
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export const scraperService = new ScraperService();
