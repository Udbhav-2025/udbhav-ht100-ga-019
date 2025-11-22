import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import { CampaignModel } from '@/lib/models/Campaign.model';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const campaign = await CampaignModel.findById(params.id)
      .select('status errorMessage updatedAt')
      .lean();

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      status: campaign.status,
      errorMessage: campaign.errorMessage,
      updatedAt: campaign.updatedAt,
    });

  } catch (error: any) {
    console.error('Status fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch status', details: error.message },
      { status: 500 }
    );
  }
}
