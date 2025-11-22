import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import type { BrandResearch, GeneratedContent, Platform } from '../types/campaign.types';

const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai';

// Initialize clients
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export class LLMService {
  async generateContent(
    brandResearch: BrandResearch,
    platforms: Platform[],
    tone: string,
    goal: string
  ): Promise<GeneratedContent> {
    const content: GeneratedContent = {};

    const prompt = this.buildContentPrompt(brandResearch, platforms, tone, goal);

    try {
      const response = await this.callLLM(prompt);
      const parsed = JSON.parse(response);

      if (platforms.includes('instagram') && parsed.instagram) {
        content.instagram = parsed.instagram;
      }
      if (platforms.includes('linkedin') && parsed.linkedin) {
        content.linkedin = parsed.linkedin;
      }
      if (platforms.includes('twitter') && parsed.twitter) {
        content.twitter = parsed.twitter;
      }

      return content;
    } catch (error: any) {
      console.error('Content generation error:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }

  async critiqueContent(
    brandResearch: BrandResearch,
    content: GeneratedContent,
    tone: string
  ): Promise<{ strengths: string[]; weaknesses: string[]; suggestions: string[] }> {
    const prompt = `You are a senior marketing performance analyst. Review the following ad campaign content.

Brand: ${brandResearch.brandName}
Brand Description: ${brandResearch.description}
Target Audience: ${brandResearch.targetAudience}
Desired Tone: ${tone}

Generated Content:
${JSON.stringify(content, null, 2)}

Provide a critical analysis in JSON format with:
{
  "strengths": ["strength 1", "strength 2", ...],
  "weaknesses": ["weakness 1", "weakness 2", ...],
  "suggestions": ["suggestion 1", "suggestion 2", ...]
}

Focus on: brand alignment, audience fit, engagement potential, clarity, and professionalism.`;

    try {
      const response = await this.callLLM(prompt);
      return JSON.parse(response);
    } catch (error: any) {
      console.error('Critique error:', error);
      return {
        strengths: ['Content generated successfully'],
        weaknesses: [],
        suggestions: ['Consider A/B testing different variations'],
      };
    }
  }

  async refineContent(
    originalContent: GeneratedContent,
    critique: { strengths: string[]; weaknesses: string[]; suggestions: string[] },
    brandResearch: BrandResearch
  ): Promise<GeneratedContent> {
    const prompt = `You are a senior copywriter. Refine the following ad campaign based on the critique.

Original Content:
${JSON.stringify(originalContent, null, 2)}

Critique:
Weaknesses: ${critique.weaknesses.join(', ')}
Suggestions: ${critique.suggestions.join(', ')}

Brand Context:
- Name: ${brandResearch.brandName}
- Description: ${brandResearch.description}
- Audience: ${brandResearch.targetAudience}

Provide refined content in the EXACT SAME JSON structure as the original. Keep what works, improve what doesn't.`;

    try {
      const response = await this.callLLM(prompt);
      return JSON.parse(response);
    } catch (error: any) {
      console.error('Refinement error:', error);
      return originalContent; // Fallback to original if refinement fails
    }
  }

  private buildContentPrompt(
    brandResearch: BrandResearch,
    platforms: Platform[],
    tone: string,
    goal: string
  ): string {
    const platformRequirements = {
      instagram: platforms.includes('instagram'),
      linkedin: platforms.includes('linkedin'),
      twitter: platforms.includes('twitter'),
    };

    return `You are a senior performance marketer specializing in multi-platform ad campaigns.

Brand Information:
- Name: ${brandResearch.brandName}
- Tagline: ${brandResearch.tagline || 'N/A'}
- Description: ${brandResearch.description}
- Key Features: ${brandResearch.features.join(', ')}
- Positioning: ${brandResearch.positioning}
- Target Audience: ${brandResearch.targetAudience}
- Tone of Voice: ${brandResearch.toneOfVoice}
- Value Propositions: ${brandResearch.valuePropositions.join(', ')}

Campaign Parameters:
- Desired Tone: ${tone}
- Primary Goal: ${goal}
- Target Platforms: ${platforms.join(', ')}

Generate a comprehensive ad campaign with content for the selected platforms. Return ONLY valid JSON (no markdown, no additional text) in this exact structure:

{${platformRequirements.instagram ? `
  "instagram": {
    "postIdeas": [
      {
        "slogan": "Eye-catching slogan (5-8 words)",
        "caption": "Engaging caption with storytelling (100-150 words)",
        "hashtags": ["hashtag1", "hashtag2", ... 10-15 relevant hashtags]
      },
      ... (3-5 post ideas total)
    ]
  },` : ''}${platformRequirements.linkedin ? `
  "linkedin": {
    "emailTemplates": [
      "Professional cold outreach email template 1 (200-250 words)",
      "Professional cold outreach email template 2 (200-250 words)"
    ],
    "postDrafts": [
      "Thought leadership post 1 (150-200 words)",
      "Thought leadership post 2 (150-200 words)",
      "Product highlight post (150-200 words)"
    ]
  },` : ''}${platformRequirements.twitter ? `
  "twitter": {
    "adLines": [
      "Punchy ad line 1 (max 280 chars)",
      "Punchy ad line 2 (max 280 chars)",
      ... (5-10 ad lines total)
    ]
  }` : ''}
}

Ensure all content:
1. Aligns with the brand's positioning and tone
2. Speaks directly to the target audience
3. Optimizes for the stated goal (${goal})
4. Follows platform best practices
5. Is compelling and action-oriented`;
  }

  private async callLLM(prompt: string): Promise<string> {
    if (LLM_PROVIDER === 'openai' && openai) {
      return this.callOpenAI(prompt);
    } else if (LLM_PROVIDER === 'anthropic' && anthropic) {
      return this.callAnthropic(prompt);
    } else {
      throw new Error('No LLM provider configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY in .env');
    }
  }

  private async callOpenAI(prompt: string): Promise<string> {
    if (!openai) throw new Error('OpenAI not configured');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert marketing AI that generates high-quality ad content. Always respond with valid JSON when requested.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    return completion.choices[0]?.message?.content || '{}';
  }

  private async callAnthropic(prompt: string): Promise<string> {
    if (!anthropic) throw new Error('Anthropic not configured');

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.8,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return content.text;
    }

    return '{}';
  }
}

export const llmService = new LLMService();
