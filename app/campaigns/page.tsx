'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CampaignCard from '@/components/CampaignCard';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useAuth } from '@/lib/contexts/AuthContext';
import { authenticatedFetch } from '@/lib/utils/api';
import { Loader2, FileText, RefreshCw, Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { Campaign } from '@/lib/types/campaign.types';

export default function CampaignsPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [campaignsLoading, setCampaignsLoading] = useState(true);
    const [showToneSelector, setShowToneSelector] = useState(false);
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
    const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
    const [addingPlatformsId, setAddingPlatformsId] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (!user || loading) return;

        async function fetchCampaigns() {
            try {
                setCampaignsLoading(true);
                const response = await authenticatedFetch('/api/campaigns');
                if (response.ok) {
                    const data = await response.json();
                    setCampaigns(data.campaigns || []);
                }
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            } finally {
                setCampaignsLoading(false);
            }
        }

        fetchCampaigns();
    }, [user, loading]);

    const handleRegenerate = (campaignId: string) => {
        setSelectedCampaignId(campaignId);
        setShowToneSelector(true);
    };

    const handleToneSelect = async (tone: string) => {
        if (!selectedCampaignId) return;

        setRegeneratingId(selectedCampaignId);
        try {
            const response = await authenticatedFetch(`/api/campaigns/${selectedCampaignId}/regenerate`, {
                method: 'POST',
                body: JSON.stringify({ tone: tone || undefined }),
            });

            if (!response.ok) {
                throw new Error('Failed to regenerate');
            }

            toast.success('Regenerating campaign...');
            router.push(`/campaign/${selectedCampaignId}`);
        } catch (error: any) {
            toast.error(error.message || 'Failed to regenerate campaign');
        } finally {
            setRegeneratingId(null);
            setShowToneSelector(false);
            setSelectedCampaignId(null);
        }
    };

    const handleAddPlatforms = async (campaignId: string, currentPlatforms: string[]) => {
        const availablePlatforms = ['instagram', 'linkedin', 'twitter'];
        const missingPlatforms = availablePlatforms.filter(p => !currentPlatforms.includes(p));
        
        if (missingPlatforms.length === 0) {
            toast.error('All platforms are already included');
            return;
        }

        const platformToAdd = prompt(`Enter platform to add (${missingPlatforms.join(', ')}):`);
        if (!platformToAdd || !missingPlatforms.includes(platformToAdd.toLowerCase())) {
            toast.error('Invalid platform');
            return;
        }

        setAddingPlatformsId(campaignId);
        try {
            // For now, we'll regenerate with the new platform
            // In a full implementation, you'd have an API endpoint to add platforms
            toast.info('Adding platform requires campaign regeneration');
            handleRegenerate(campaignId);
        } catch (error: any) {
            toast.error(error.message || 'Failed to add platform');
        } finally {
            setAddingPlatformsId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen relative">
            <AnimatedBackground />
            
            <div className="relative z-10">
                <Navbar />

                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 sm:mb-12"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <Link
                                href="/dashboard"
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-white" />
                            </Link>
                            <div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                                    All Campaigns
                                </h1>
                                <p className="text-base sm:text-lg text-gray-300">
                                    Manage and regenerate your campaigns
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Campaigns Grid */}
                    {campaignsLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                        </div>
                    ) : campaigns.length === 0 ? (
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center">
                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No campaigns yet</h3>
                            <p className="text-gray-400 mb-6">Create your first campaign to get started</p>
                            <Link
                                href="/campaign/new"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all shadow-lg"
                            >
                                Create Campaign
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {campaigns.map((campaign, index) => (
                                <motion.div
                                    key={campaign._id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative"
                                >
                                    <CampaignCard 
                                        campaign={campaign} 
                                        index={index}
                                        onDelete={(campaignId) => {
                                            setCampaigns(prev => prev.filter(c => c._id !== campaignId));
                                        }}
                                    />
                                    
                                    {/* Action Buttons Overlay */}
                                    {campaign.status === 'completed' && (
                                        <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-20">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleRegenerate(campaign._id || '');
                                                }}
                                                disabled={regeneratingId === campaign._id}
                                                className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                                            >
                                                {regeneratingId === campaign._id ? (
                                                    <>
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                        Regenerating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <RefreshCw className="w-3 h-3" />
                                                        Regenerate
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleAddPlatforms(campaign._id || '', campaign.platforms);
                                                }}
                                                disabled={addingPlatformsId === campaign._id}
                                                className="flex-1 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                                            >
                                                {addingPlatformsId === campaign._id ? (
                                                    <>
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                        Adding...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="w-3 h-3" />
                                                        Add Platform
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <ToneSelectorPopup
                isOpen={showToneSelector}
                onClose={() => {
                    setShowToneSelector(false);
                    setSelectedCampaignId(null);
                }}
                onSelect={handleToneSelect}
                currentTone={selectedCampaignId ? campaigns.find(c => c._id === selectedCampaignId)?.tone : undefined}
            />
        </div>
    );
}

