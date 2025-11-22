import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import { CampaignModel } from '@/lib/models/Campaign.model';
import { agentService } from '@/lib/services/agent.service';
import { getUserIdFromRequest } from '@/lib/middleware/auth.middleware';
import type { Campaign } from '@/lib/types/campaign.types';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

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

    // Create campaign with userId
    const campaign = await CampaignModel.create({
      websiteUrl,
      platforms,
      tone,
      goal,
      userId: String(userId), // Ensure userId is a string
      status: 'pending',
    });

    const campaignId = String(campaign._id || campaign.id);
    
    // Verify the campaign was created with the correct userId
    // Note: For memoryDB, we need to call .lean() to get the actual data
    const createdCampaignQuery = CampaignModel.findById(campaignId);
    let campaignData: any = null;
    
    if (createdCampaignQuery && typeof (createdCampaignQuery as any).lean === 'function') {
      // MemoryDB returns an object with lean() method
      campaignData = await (createdCampaignQuery as any).lean();
    } else if (createdCampaignQuery && typeof (createdCampaignQuery as any).then === 'function') {
      // Mongoose returns a promise
      const campaignDoc = await createdCampaignQuery;
      if (campaignDoc) {
        campaignData = campaignDoc && typeof (campaignDoc as any).toObject === 'function' 
          ? (campaignDoc as any).toObject() 
          : campaignDoc;
      }
    }
    
    if (campaignData) {
      console.log('Campaign created:', {
        campaignId,
        savedUserId: String(campaignData.userId || ''),
        requestUserId: String(userId),
        match: String(campaignData.userId || '') === String(userId),
      });
    }

    // Start async processing (don't wait for it)
    processCampaignAsync(campaignId, String(userId));

    return NextResponse.json({
      success: true,
      campaignId: campaignId,
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
    // Verify authentication
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get campaigns for this user
    const { isUsingMemoryDB } = await import('@/lib/db/mongodb');
    let campaigns: any[] = [];
    
    if (isUsingMemoryDB()) {
      // Use memoryDB's getAll method
      const { memoryDB } = await import('@/lib/db/memory');
      campaigns = await memoryDB.campaigns.getAll();
    } else {
      // Use Mongoose
      const campaignsQuery = CampaignModel.find();
      const campaignsResult = await campaignsQuery;
      campaigns = Array.isArray(campaignsResult) ? campaignsResult : [];
    }
    
    // Filter by userId
    campaigns = campaigns.filter((campaign: any) => {
      const campaignData = campaign.toObject ? campaign.toObject() : campaign;
      return String((campaignData as any).userId || '') === String(userId);
    });

    // Sort by createdAt (newest first)
    campaigns.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

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
async function processCampaignAsync(campaignId: string, userId: string) {
  try {
    await connectDB();

    const campaignQuery = CampaignModel.findById(campaignId);
    
    // Handle both Mongoose and memoryDB responses
    let campaignData: any = null;
    
    // Check if it's a memoryDB query (has lean method)
    if (campaignQuery && typeof (campaignQuery as any).lean === 'function') {
      // MemoryDB returns an object with lean() method
      campaignData = await (campaignQuery as any).lean();
    } else if (campaignQuery && typeof (campaignQuery as any).then === 'function') {
      // Mongoose returns a promise
      const campaign = await campaignQuery;
      if (campaign) {
        campaignData = campaign && typeof (campaign as any).toObject === 'function' 
          ? (campaign as any).toObject() 
          : campaign;
      }
    } else if (campaignQuery) {
      // Direct object (fallback)
      campaignData = campaignQuery;
    }
    
    if (!campaignData) {
      console.error('Campaign not found:', campaignId);
      return;
    }

    // Verify ownership
    const campaignUserId = String(campaignData.userId || '');
    const requestUserId = String(userId || '');
    
    if (campaignUserId !== requestUserId) {
      console.error('Unauthorized campaign access:', {
        campaignId,
        campaignUserId,
        requestUserId,
        match: campaignUserId === requestUserId,
      });
      return;
    }

    const updateStatus = async (status: Campaign['status']) => {
      await CampaignModel.findByIdAndUpdate(campaignId, { status });
    };

    // Type assertion for campaign data
    const typedCampaign = campaignData as Campaign;

    // Run the agent service
    const result = await agentService.processCampaign(typedCampaign, updateStatus);

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
