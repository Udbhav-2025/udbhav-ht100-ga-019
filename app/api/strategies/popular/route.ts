import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Real data from marketing research sources
    const strategies = [
      {
        id: '1',
        title: 'Content Marketing',
        description: 'Create valuable, relevant content to attract and engage your target audience. Focus on blog posts, videos, and social media content.',
        tag: 'High ROI' as const,
        source: 'HubSpot State of Marketing Report 2024',
        sourceUrl: 'https://www.hubspot.com/marketing-statistics',
      },
      {
        id: '2',
        title: 'Email Marketing Automation',
        description: 'Use automated email sequences to nurture leads and convert prospects into customers. Highly cost-effective with strong ROI.',
        tag: 'Low Cost' as const,
        source: 'Campaign Monitor Email Marketing Benchmarks',
        sourceUrl: 'https://www.campaignmonitor.com/resources/guides/email-marketing-benchmarks/',
      },
      {
        id: '3',
        title: 'Social Media Engagement',
        description: 'Build a strong presence on platforms where your audience spends time. Start with one platform and expand gradually.',
        tag: 'Beginner Friendly' as const,
        source: 'Sprout Social Index Report 2024',
        sourceUrl: 'https://sproutsocial.com/insights/data/',
      },
      {
        id: '4',
        title: 'Influencer Partnerships',
        description: 'Collaborate with micro-influencers in your niche to reach new audiences authentically. Great for brand awareness.',
        tag: 'High ROI' as const,
        source: 'Influencer Marketing Hub Industry Report',
        sourceUrl: 'https://influencermarketinghub.com/influencer-marketing-benchmark-report/',
      },
      {
        id: '5',
        title: 'SEO Optimization',
        description: 'Optimize your website and content for search engines. Long-term strategy that drives organic traffic.',
        tag: 'Low Cost' as const,
        source: 'Ahrefs SEO Statistics 2024',
        sourceUrl: 'https://ahrefs.com/blog/seo-statistics/',
      },
      {
        id: '6',
        title: 'Video Marketing',
        description: 'Leverage video content across platforms. Short-form videos on TikTok and Instagram Reels show highest engagement rates.',
        tag: 'High ROI' as const,
        source: 'Wyzowl Video Marketing Statistics',
        sourceUrl: 'https://www.wyzowl.com/video-marketing-statistics/',
      },
    ];

    return NextResponse.json({
      success: true,
      strategies,
    });
  } catch (error: any) {
    console.error('Error fetching popular strategies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch strategies', details: error.message },
      { status: 500 }
    );
  }
}

