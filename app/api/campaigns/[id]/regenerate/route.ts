import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import { CampaignModel } from '@/lib/models/Campaign.model';
import { agentService } from '@/lib/services/agent.service';
import type { Campaign } from '@/lib/types/campaign.types';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const { tone } = body;

    const campaign = await CampaignModel.findById(params.id);

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (!campaign.brandResearch) {
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
    
    const campaign = await CampaignModel.findById(campaignId);
    if (!campaign) return;

    const updateStatus = async (status: Campaign['status']) => {
      await CampaignModel.findByIdAndUpdate(campaignId, { status });
    };

    await updateStatus('generating-content');

    const result = await agentService.regenerateCampaign(
      campaign.toObject(),
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
