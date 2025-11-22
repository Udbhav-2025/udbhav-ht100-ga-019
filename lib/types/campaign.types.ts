export interface BrandResearch {
  brandName: string;
  tagline?: string;
  description: string;
  features: string[];
  positioning: string;
  targetAudience: string;
  toneOfVoice: string;
  valuePropositions: string[];
}

export interface InstagramContent {
  postIdeas: {
    slogan: string;
    caption: string;
    hashtags: string[];
  }[];
}

export interface LinkedInContent {
  emailTemplates: string[];
  postDrafts: string[];
}

export interface TwitterContent {
  adLines: string[];
}

export interface GeneratedContent {
  instagram?: InstagramContent;
  linkedin?: LinkedInContent;
  twitter?: TwitterContent;
}

export interface GeneratedImage {
  platform: 'instagram' | 'linkedin' | 'twitter';
  url: string;
  width: number;
  height: number;
}

export interface CritiqueSummary {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  overallScore: number;
}

export interface Campaign {
  _id?: string;
  websiteUrl: string;
  platforms: ('instagram' | 'linkedin' | 'twitter')[];
  tone: string;
  goal: string;
  status: 'pending' | 'researching' | 'generating-content' | 'generating-images' | 'critiquing' | 'completed' | 'failed';
  brandResearch?: BrandResearch;
  generatedContent?: GeneratedContent;
  generatedImages?: GeneratedImage[];
  critique?: CritiqueSummary;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Platform = 'instagram' | 'linkedin' | 'twitter';
export type Tone = 'professional' | 'playful' | 'bold' | 'minimal' | 'custom';
export type Goal = 'awareness' | 'engagement' | 'clicks' | 'conversions';
export type CampaignStatus = Campaign['status'];
