import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import { CampaignModel } from '@/lib/models/Campaign.model';
import { agentService } from '@/lib/services/agent.service';
import { getUserIdFromRequest } from '@/lib/middleware/auth.middleware';
import type { Campaign } from '@/lib/types/campaign.types';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { tone } = body;

    const campaignQuery = CampaignModel.findById(params.id);
    
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
      console.log('Campaign not found:', params.id);
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    const campaignUserId = String(campaignData.userId || '');
    const requestUserId = String(userId || '');
    
    // Debug logging
    console.log('Regenerate ownership check:', {
      campaignId: params.id,
      campaignUserId,
      requestUserId,
      match: campaignUserId === requestUserId,
      hasUserId: !!campaignData.userId,
    });
    
    if (campaignUserId !== requestUserId) {
      console.log('Regenerate ownership check failed - returning 403');
      return NextResponse.json(
        { error: 'Unauthorized. You do not have access to this campaign.' },
        { status: 403 }
      );
    }

    if (!campaignData.brandResearch) {
      return NextResponse.json(
        { error: 'Campaign must be completed before regeneration' },
        { status: 400 }
      );
    }

    // Start regeneration asynchronously
    regenerateCampaignAsync(params.id, tone);

    return NextResponse.json({
      success: true,
      message: 'Regeneration started',
    });

  } catch (error: any) {
    console.error('Regeneration error:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate campaign', details: error.message },
      { status: 500 }
    );
  }
}

async function regenerateCampaignAsync(campaignId: string, newTone?: string) {
  try {
    await connectDB();
    
    const campaignQuery = CampaignModel.findById(campaignId);
    
    // Handle both Mongoose and memoryDB responses
    let campaignData: any = null;
    
    if (campaignQuery && typeof (campaignQuery as any).lean === 'function') {
      campaignData = await (campaignQuery as any).lean();
    } else if (campaignQuery && typeof (campaignQuery as any).then === 'function') {
      const campaign = await campaignQuery;
      if (campaign) {
        campaignData = campaign && typeof (campaign as any).toObject === 'function' 
          ? (campaign as any).toObject() 
          : campaign;
      }
    } else if (campaignQuery) {
      campaignData = campaignQuery;
    }
    
    if (!campaignData) {
      console.error('Campaign not found for regeneration:', campaignId);
      return;
    }

    const updateStatus = async (status: Campaign['status']) => {
      await CampaignModel.findByIdAndUpdate(campaignId, { status });
    };

    await updateStatus('generating-content');

    const result = await agentService.regenerateCampaign(
      campaignData,
      newTone,
      updateStatus
    );

    await CampaignModel.findByIdAndUpdate(campaignId, {
      status: 'completed',
      generatedContent: result.generatedContent,
      critique: result.critique,
      ...(newTone && { tone: newTone }),
    });

  } catch (error: any) {
    console.error('Regeneration processing error:', error);
    await CampaignModel.findByIdAndUpdate(campaignId, {
      status: 'failed',
      errorMessage: error.message,
    });
  }
}
