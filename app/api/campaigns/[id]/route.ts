import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import { CampaignModel } from '@/lib/models/Campaign.model';
import { getUserIdFromRequest } from '@/lib/middleware/auth.middleware';

export async function GET(
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
    console.log('Campaign ownership check:', {
      campaignId: params.id,
      campaignUserId,
      requestUserId,
      match: campaignUserId === requestUserId,
      hasUserId: !!campaignData.userId,
    });
    
    if (campaignUserId !== requestUserId) {
      console.log('Ownership check failed - returning 403');
      return NextResponse.json(
        { error: 'Unauthorized. You do not have access to this campaign.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      campaign: campaignData,
    });

  } catch (error: any) {
    console.error('Campaign fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check ownership before deleting
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
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    const campaignUserId = String(campaignData.userId || '');
    const requestUserId = String(userId || '');
    
    if (campaignUserId !== requestUserId) {
      return NextResponse.json(
        { error: 'Unauthorized. You do not have access to this campaign.' },
        { status: 403 }
      );
    }

    // Delete the campaign
    await CampaignModel.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully',
    });

  } catch (error: any) {
    console.error('Campaign deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete campaign', details: error.message },
      { status: 500 }
    );
  }
}
