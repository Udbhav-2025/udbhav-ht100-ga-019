'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Timeline from '@/components/Timeline';
import CampaignCard from '@/components/CampaignCard';
import PopularStrategiesCard from '@/components/PopularStrategiesCard';
import TrendingStrategiesCard from '@/components/TrendingStrategiesCard';
import SocialTrendsCard from '@/components/SocialTrendsCard';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useAuth } from '@/lib/contexts/AuthContext';
import { authenticatedFetch } from '@/lib/utils/api';
import { Loader2, BarChart3, TrendingUp, Activity, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Campaign } from '@/lib/types/campaign.types';

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [campaignsLoading, setCampaignsLoading] = useState(true);
    
    // New sections data
    const [popularStrategies, setPopularStrategies] = useState<any[]>([]);
    const [trendingStrategies, setTrendingStrategies] = useState<any[]>([]);
    const [socialTrends, setSocialTrends] = useState<any[]>([]);
    const [strategiesLoading, setStrategiesLoading] = useState(true);

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

    // Fetch marketing strategies and trends
    useEffect(() => {
        async function fetchStrategiesAndTrends() {
            try {
                setStrategiesLoading(true);
                
                // Fetch all three endpoints in parallel
                const [popularRes, trendingRes, socialRes] = await Promise.all([
                    fetch('/api/strategies/popular'),
                    fetch('/api/strategies/trending'),
                    fetch('/api/trends/social'),
                ]);

                if (popularRes.ok) {
                    const data = await popularRes.json();
                    // Show only first 3 in dashboard
                    setPopularStrategies((data.strategies || []).slice(0, 3));
                }

                if (trendingRes.ok) {
                    const data = await trendingRes.json();
                    // Show only first 3 in dashboard
                    setTrendingStrategies((data.strategies || []).slice(0, 3));
                }

                if (socialRes.ok) {
                    const data = await socialRes.json();
                    // Show only first 3 in dashboard
                    setSocialTrends((data.trends || []).slice(0, 3));
                }
            } catch (error) {
                console.error('Error fetching strategies and trends:', error);
            } finally {
                setStrategiesLoading(false);
            }
        }

        fetchStrategiesAndTrends();
    }, []);

    // Calculate stats
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(
        c => ['pending', 'researching', 'generating-content', 'generating-images', 'critiquing'].includes(c.status)
    ).length;
    const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;

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
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen relative">
            <AnimatedBackground />
            
            <div className="relative z-10">
                <Navbar />

                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    {/* Page Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8 sm:mb-12"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                                <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                                    Dashboard Overview
                                </h1>
                                <p className="text-base sm:text-lg text-gray-300 max-w-2xl">
                                    Track your recent campaign activities and performance across all platforms.
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 hover:border-blue-500/50 transition-all"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <Activity className="w-5 h-5 text-blue-400" />
                                    </div>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                    {campaignsLoading ? '...' : activeCampaigns}
                                </h3>
                                <p className="text-sm text-white/60">Active Campaigns</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 hover:border-purple-500/50 transition-all"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-purple-400" />
                                    </div>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                    {campaignsLoading ? '...' : completedCampaigns}
                                </h3>
                                <p className="text-sm text-white/60">Completed</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 hover:border-pink-500/50 transition-all"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-pink-400" />
                                    </div>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                    {campaignsLoading ? '...' : totalCampaigns}
                                </h3>
                                <p className="text-sm text-white/60">Total Campaigns</p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Campaigns Grid Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mb-8 sm:mb-12"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white">Recent Campaigns</h2>
                            {campaigns.length > 3 && (
                                <Link
                                    href="/campaigns"
                                    className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2 transition-colors"
                                >
                                    View All ({campaigns.length})
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                        
                        {campaignsLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                            </div>
                        ) : campaigns.length === 0 ? (
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center">
                                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">No campaigns yet</h3>
                                <p className="text-gray-400 mb-6">Create your first campaign to get started</p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => router.push('/campaign/new')}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all shadow-lg"
                                >
                                    Create Campaign
                                </motion.button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {campaigns.slice(0, 3).map((campaign, index) => (
                                        <CampaignCard 
                                            key={campaign._id || index} 
                                            campaign={campaign} 
                                            index={index}
                                            onDelete={(campaignId) => {
                                                // Remove the deleted campaign from the list
                                                setCampaigns(prev => prev.filter(c => c._id !== campaignId));
                                            }}
                                        />
                                    ))}
                                </div>
                                {campaigns.length > 3 && (
                                    <div className="mt-6 text-center">
                                        <Link
                                            href="/campaigns"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium rounded-lg transition-all"
                                        >
                                            View All Campaigns ({campaigns.length})
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>

                    {/* Marketing Strategies Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 sm:mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <PopularStrategiesCard 
                                strategies={popularStrategies} 
                                loading={strategiesLoading}
                            />
                            {popularStrategies.length >= 3 && (
                                <div className="mt-4 text-center">
                                    <Link
                                        href="/strategies/popular"
                                        className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                    >
                                        View All Popular Strategies
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <TrendingStrategiesCard 
                                strategies={trendingStrategies} 
                                loading={strategiesLoading}
                            />
                            {trendingStrategies.length >= 3 && (
                                <div className="mt-4 text-center">
                                    <Link
                                        href="/strategies/trending"
                                        className="text-orange-400 hover:text-orange-300 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                    >
                                        View All Trending Strategies
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Social Media Trends Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="mb-8 sm:mb-12"
                    >
                        <SocialTrendsCard 
                            trends={socialTrends} 
                            loading={strategiesLoading}
                        />
                        {socialTrends.length >= 3 && (
                            <div className="mt-4 text-center">
                                <Link
                                    href="/trends/social"
                                    className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    View All Social Media Trends
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </motion.div>

                    {/* Timeline Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 lg:p-10 shadow-xl"
                    >
                        <Timeline />
                    </motion.div>
                </main>
            </div>
        </div>
    );
}


