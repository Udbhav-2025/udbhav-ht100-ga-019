import mongoose, { Schema, model, models } from 'mongoose';
import type { Campaign } from '../types/campaign.types';
import { memoryDB } from '../db/memory';
import { isUsingMemoryDB } from '../db/mongodb';

const BrandResearchSchema = new Schema({
  brandName: { type: String, required: true },
  tagline: String,
  description: { type: String, required: true },
  features: [String],
  positioning: { type: String, required: true },
  targetAudience: { type: String, required: true },
  toneOfVoice: { type: String, required: true },
  valuePropositions: [String],
}, { _id: false });

const InstagramPostSchema = new Schema({
  slogan: { type: String, required: true },
  caption: { type: String, required: true },
  hashtags: [String],
}, { _id: false });

const InstagramContentSchema = new Schema({
  postIdeas: [InstagramPostSchema],
}, { _id: false });

const LinkedInContentSchema = new Schema({
  emailTemplates: [String],
  postDrafts: [String],
}, { _id: false });

const TwitterContentSchema = new Schema({
  adLines: [String],
}, { _id: false });

const GeneratedContentSchema = new Schema({
  instagram: InstagramContentSchema,
  linkedin: LinkedInContentSchema,
  twitter: TwitterContentSchema,
}, { _id: false });

const GeneratedImageSchema = new Schema({
  platform: {
    type: String,
    enum: ['instagram', 'linkedin', 'twitter'],
    required: true
  },
  url: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
}, { _id: false });

const CritiqueSummarySchema = new Schema({
  strengths: [String],
  weaknesses: [String],
  suggestions: [String],
  overallScore: { type: Number, min: 0, max: 10 },
}, { _id: false });

const CampaignSchema = new Schema<Campaign>({
  websiteUrl: {
    type: String,
    required: true,
    trim: true,
  },
  platforms: [{
    type: String,
    enum: ['instagram', 'linkedin', 'twitter'],
    required: true,
  }],
  tone: {
    type: String,
    required: true,
    trim: true,
  },
  goal: {
    type: String,
    required: true,
    enum: ['awareness', 'engagement', 'clicks', 'conversions'],
  },
  status: {
    type: String,
    enum: ['pending', 'researching', 'generating-content', 'generating-images', 'critiquing', 'completed', 'failed'],
    default: 'pending',
  },
  brandResearch: BrandResearchSchema,
  generatedContent: GeneratedContentSchema,
  generatedImages: [GeneratedImageSchema],
  critique: CritiqueSummarySchema,
  errorMessage: String,
}, {
  timestamps: true,
});

// Index for efficient querying
CampaignSchema.index({ createdAt: -1 });
CampaignSchema.index({ status: 1 });

const MongooseCampaignModel = models.Campaign || model<Campaign>('Campaign', CampaignSchema);

// Wrapper to use memory DB or Mongoose depending on connection
export const CampaignModel = {
  create: async (data: any) => {
    try {
      console.log('CampaignModel.create: isUsingMemoryDB?', isUsingMemoryDB());
      if (isUsingMemoryDB()) {
        const result = await memoryDB.campaigns.create(data);
        console.log('CampaignModel.create: Created in MemoryDB with ID:', result._id);
        return result;
      }
      return await MongooseCampaignModel.create(data);
    } catch (error) {
      console.log('CampaignModel.create: Error, falling back to MemoryDB');
      return await memoryDB.campaigns.create(data);
    }
  },

  findById: (id: string) => {
    console.log(`CampaignModel.findById: called with ${id}, isUsingMemoryDB? ${isUsingMemoryDB()}`);
    if (isUsingMemoryDB()) {
      console.log('CampaignModel.findById: Using MemoryDB');
      return memoryDB.campaigns.findById(id);
    }
    console.log('CampaignModel.findById: Using Mongoose');
    return MongooseCampaignModel.findById(id);
  },

  findByIdAndUpdate: async (id: string, data: any) => {
    try {
      if (isUsingMemoryDB()) {
        return await memoryDB.campaigns.findByIdAndUpdate(id, data);
      }
      return await MongooseCampaignModel.findByIdAndUpdate(id, data);
    } catch (error) {
      return await memoryDB.campaigns.findByIdAndUpdate(id, data);
    }
  },

  findByIdAndDelete: async (id: string) => {
    try {
      if (isUsingMemoryDB()) {
        return await memoryDB.campaigns.findByIdAndDelete(id);
      }
      return await MongooseCampaignModel.findByIdAndDelete(id);
    } catch (error) {
      return await memoryDB.campaigns.findByIdAndDelete(id);
    }
  },

  find: () => {
    if (isUsingMemoryDB()) {
      console.log('CampaignModel.find: Using MemoryDB');
      return memoryDB.campaigns.find();
    }
    console.log('CampaignModel.find: Using Mongoose');
    return MongooseCampaignModel.find();
  },
};
