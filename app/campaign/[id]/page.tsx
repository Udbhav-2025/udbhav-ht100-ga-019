'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import useSWR from 'swr';
import AnimatedBackground from '@/components/AnimatedBackground';
import StatusProgress from '@/components/StatusProgress';
import CampaignResults from '@/components/CampaignResults';
import type { Campaign } from '@/lib/types/campaign.types';
import { toast } from 'react-hot-toast';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CampaignPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Fetch campaign with auto-refresh while processing
  const { data, error, mutate } = useSWR(
    `/api/campaigns/${params.id}`,
    fetcher,
    {
      refreshInterval: (data) => {
        // Only refresh if campaign is still processing
        if (!data?.campaign) return 0;
        const status = data.campaign.status;
        return ['pending', 'researching', 'generating-content', 'generating-images', 'critiquing'].includes(status)
          ? 2000 // Poll every 2 seconds
          : 0; // Stop polling
      },
    }
  );

  const campaign: Campaign | undefined = data?.campaign;

  useEffect(() => {
    if (error) {
      toast.error('Failed to load campaign');
    }
  }, [error]);

  const handleRegenerate = async () => {
    const newTone = prompt('Enter a new tone (or leave empty to keep current):');
    
    setIsRegenerating(true);
    
    try {
      const response = await fetch(`/api/campaigns/${params.id}/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tone: newTone || undefined }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate');
      }

      toast.success('Regenerating campaign...');
      
      // Start polling again
      mutate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to regenerate campaign');
    } finally {
      setIsRegenerating(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <AnimatedBackground />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Error Loading Campaign</h1>
          <p className="text-gray-400 mb-8">Unable to load campaign details</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <AnimatedBackground />
        <div className="relative z-10">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const isProcessing = ['pending', 'researching', 'generating-content', 'generating-images', 'critiquing'].includes(
    campaign.status
  );

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {isProcessing ? 'Creating Your Campaign...' : 'Campaign Ready!'}
            </h1>
          </div>

          {/* Content */}
          {isProcessing && (
            <StatusProgress
              currentStatus={campaign.status}
              error={campaign.errorMessage}
            />
          )}

          {campaign.status === 'completed' && (
            <CampaignResults campaign={campaign} onRegenerate={handleRegenerate} />
          )}

          {campaign.status === 'failed' && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-red-400 mb-2">Campaign Failed</h3>
              <p className="text-gray-300 mb-6">{campaign.errorMessage}</p>
              <Link
                href="/campaign/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Try Again
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
