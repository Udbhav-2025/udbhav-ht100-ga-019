import { scraperService } from './scraper.service';
import { llmService } from './llm.service';
import { imageService } from './image.service';
import type {
  Campaign,
  BrandResearch,
  GeneratedContent,
  CritiqueSummary
} from '../types/campaign.types';

export class AgentService {
  /**
   * Orchestrates the entire campaign creation workflow
   * This implements the agentic workflow: Research -> Create -> Critique -> Refine
   */
  async processCampaign(campaign: Campaign, updateStatus: (status: Campaign['status']) => Promise<void>): Promise<{
    brandResearch: BrandResearch;
    generatedContent: GeneratedContent;
    generatedImages: any[];
    critique: CritiqueSummary;
  }> {
    try {
      // Step 1: Research Phase
      await updateStatus('researching');
      console.log('AgentService: campaign object:', JSON.stringify(campaign, null, 2));
      console.log('AgentService: websiteUrl:', campaign.websiteUrl);
      const brandResearch = await scraperService.scrapeWebsite(campaign.websiteUrl);

      // Step 2: Content Generation Phase
      await updateStatus('generating-content');
      const initialContent = await llmService.generateContent(
        brandResearch,
        campaign.platforms,
        campaign.tone,
        campaign.goal
      );

      // Step 3: Critique Phase (AI self-review)
      await updateStatus('critiquing');
      const critiqueResult = await llmService.critiqueContent(
        brandResearch,
        initialContent,
        campaign.tone
      );

      // Step 4: Refinement Phase
      const refinedContent = await llmService.refineContent(
        initialContent,
        critiqueResult,
        brandResearch
      );

      // Step 5: Image Generation Phase
      await updateStatus('generating-images');
      const generatedImages = await imageService.generateImages(
        brandResearch,
        campaign.platforms,
        campaign._id as string,
        refinedContent // Pass refined content for text overlay
      );

      // Step 6: Final Critique Summary
      const finalCritique = await this.generateFinalCritique(
        critiqueResult,
        refinedContent
      );

      return {
        brandResearch,
        generatedContent: refinedContent,
        generatedImages,
        critique: finalCritique,
      };

    } catch (error: any) {
      console.error('Agent processing error:', error);
      throw error;
    }
  }

  /**
   * Generate final critique summary with scoring
   */
  private async generateFinalCritique(
    critiqueResult: { strengths: string[]; weaknesses: string[]; suggestions: string[] },
    refinedContent: GeneratedContent
  ): Promise<CritiqueSummary> {
    // Calculate overall score based on critique
    const score = this.calculateQualityScore(critiqueResult, refinedContent);

    return {
      strengths: critiqueResult.strengths,
      weaknesses: critiqueResult.weaknesses,
      suggestions: [
        ...critiqueResult.suggestions,
        'Test multiple variations to optimize performance',
        'Monitor engagement metrics and iterate based on data',
      ],
      overallScore: score,
    };
  }

  /**
   * Calculate quality score (0-10) based on content analysis
   */
  private calculateQualityScore(
    critique: { strengths: string[]; weaknesses: string[]; suggestions: string[] },
    content: GeneratedContent
  ): number {
    let score = 7; // Base score

    // Add points for strengths
    score += Math.min(critique.strengths.length * 0.5, 2);

    // Subtract points for weaknesses
    score -= Math.min(critique.weaknesses.length * 0.3, 2);

    // Add points for content completeness
    let completeness = 0;
    if (content.instagram?.postIdeas && content.instagram.postIdeas.length >= 3) completeness++;
    if (content.linkedin?.postDrafts && content.linkedin.postDrafts.length >= 2) completeness++;
    if (content.twitter?.adLines && content.twitter.adLines.length >= 5) completeness++;

    score += completeness * 0.5;

    // Ensure score is between 0 and 10
    return Math.max(0, Math.min(10, Math.round(score * 10) / 10));
  }

  /**
   * Regenerate campaign with new parameters
   */
  async regenerateCampaign(
    campaign: Campaign,
    newTone?: string,
    updateStatus?: (status: Campaign['status']) => Promise<void>
  ): Promise<{
    generatedContent: GeneratedContent;
    critique: CritiqueSummary;
  }> {
    if (!campaign.brandResearch) {
      throw new Error('Campaign must have brand research before regeneration');
    }

    const tone = newTone || campaign.tone;

    if (updateStatus) {
      await updateStatus('generating-content');
    }

    const newContent = await llmService.generateContent(
      campaign.brandResearch,
      campaign.platforms,
      tone,
      campaign.goal
    );

    if (updateStatus) {
      await updateStatus('critiquing');
    }

    const critiqueResult = await llmService.critiqueContent(
      campaign.brandResearch,
      newContent,
      tone
    );

    const refinedContent = await llmService.refineContent(
      newContent,
      critiqueResult,
      campaign.brandResearch
    );

    const critique = await this.generateFinalCritique(critiqueResult, refinedContent);

    return {
      generatedContent: refinedContent,
      critique,
    };
  }
}

export const agentService = new AgentService();
