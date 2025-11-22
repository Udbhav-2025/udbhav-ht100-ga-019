'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Trash2 } from 'lucide-react';
import useSWR from 'swr';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import StatusProgress from '@/components/StatusProgress';
import CampaignResults from '@/components/CampaignResults';
import ToneSelectorPopup from '@/components/ToneSelectorPopup';
import type { Campaign } from '@/lib/types/campaign.types';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/lib/contexts/AuthContext';
import { authenticatedFetch } from '@/lib/utils/api';

const fetcher = async (url: string) => {
  const res = await authenticatedFetch(url);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to fetch campaign' }));
    throw new Error(error.error || `Failed to fetch: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

export default function CampaignPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showToneSelector, setShowToneSelector] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch campaign with auto-refresh while processing
  // Only fetch if user is authenticated
  const { data, error, mutate } = useSWR(
    user && !authLoading ? `/api/campaigns/${params.id}` : null,
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
      onError: (error) => {
        console.error('SWR fetch error:', error);
        if (error.message?.includes('403')) {
          toast.error('You do not have access to this campaign');
          router.push('/dashboard');
        } else if (error.message?.includes('404') || error.message?.includes('Campaign not found')) {
          toast.error('Campaign not found');
          router.push('/dashboard');
        }
      },
    }
  );

  const campaign: Campaign | undefined = data?.campaign;

  useEffect(() => {
    if (error) {
      toast.error('Failed to load campaign');
    }
  }, [error]);

  const handleRegenerate = async (newTone?: string) => {
    setIsRegenerating(true);
    
    try {
      const response = await authenticatedFetch(`/api/campaigns/${params.id}/regenerate`, {
        method: 'POST',
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await authenticatedFetch(`/api/campaigns/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to delete campaign' }));
        throw new Error(error.error || 'Failed to delete campaign');
      }

      toast.success('Campaign deleted successfully');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error deleting campaign:', error);
      toast.error(error.message || 'Failed to delete campaign');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <div className="relative z-10">
          <Navbar />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="text-center max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Error Loading Campaign</h1>
              <p className="text-gray-300 mb-8 text-lg">Unable to load campaign details</p>
          <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg transition-all shadow-lg shadow-blue-500/30"
          >
                Back to Dashboard
          </Link>
            </div>
          </div>
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
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
            <div className="mb-8 sm:mb-12">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
              {isProcessing ? 'Creating Your Campaign...' : 'Campaign Ready!'}
            </h1>
                  <p className="text-lg text-gray-300">
                    {isProcessing ? 'Our AI agents are working on your campaign' : 'Your campaign is ready to use'}
                  </p>
                </div>
                {!isProcessing && campaign.status !== 'failed' && (
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg flex items-center gap-2 transition border border-red-500/30"
                    title="Delete campaign"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                )}
              </div>
          </div>

          {/* Content */}
          {isProcessing && (
            <StatusProgress
              currentStatus={campaign.status}
              error={campaign.errorMessage}
            />
          )}

          {campaign.status === 'completed' && (
            <CampaignResults campaign={campaign} onRegenerate={() => setShowToneSelector(true)} />
          )}

          <ToneSelectorPopup
            isOpen={showToneSelector}
            onClose={() => setShowToneSelector(false)}
            onSelect={handleRegenerate}
            currentTone={campaign.tone}
          />

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
        </main>
      </div>
    </div>
  );
}
