import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import { CampaignModel } from '@/lib/models/Campaign.model';
import { agentService } from '@/lib/services/agent.service';
import type { Campaign } from '@/lib/types/campaign.types';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { websiteUrl, platforms, tone, goal } = body;

    // Validation
    if (!websiteUrl || !platforms || !tone || !goal) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'At least one platform must be selected' },
        { status: 400 }
      );
    }

    // URL validation
    try {
      const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid website URL' },
        { status: 400 }
      );
    }

    // Create campaign
    const campaign = await CampaignModel.create({
      websiteUrl,
      platforms,
      tone,
      goal,
      status: 'pending',
    });

    // Start async processing (don't wait for it)
    processCampaignAsync(campaign._id.toString());

    return NextResponse.json({
      success: true,
      campaignId: campaign._id,
      message: 'Campaign created successfully',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Campaign creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get all campaigns, sorted by most recent
    const campaigns = await CampaignModel.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-__v')
      .lean();

    return NextResponse.json({
      success: true,
      campaigns,
    });

  } catch (error: any) {
    console.error('Campaigns fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Process campaign asynchronously
 */
async function processCampaignAsync(campaignId: string) {
  try {
    await connectDB();
    
    const campaign = await CampaignModel.findById(campaignId);
    if (!campaign) {
      console.error('Campaign not found:', campaignId);
      return;
    }

    const updateStatus = async (status: Campaign['status']) => {
      await CampaignModel.findByIdAndUpdate(campaignId, { status });
    };

    // Run the agent service
    const result = await agentService.processCampaign(campaign.toObject(), updateStatus);

    // Update campaign with results
    await CampaignModel.findByIdAndUpdate(campaignId, {
      status: 'completed',
      brandResearch: result.brandResearch,
      generatedContent: result.generatedContent,
      generatedImages: result.generatedImages,
      critique: result.critique,
    });

    console.log('✅ Campaign completed:', campaignId);

  } catch (error: any) {
    console.error('Campaign processing error:', error);
    
    await CampaignModel.findByIdAndUpdate(campaignId, {
      status: 'failed',
      errorMessage: error.message,
    });
  }
}
