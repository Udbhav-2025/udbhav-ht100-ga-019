'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Facebook,
    Twitter,
    Linkedin,
    Youtube,
    Instagram,
    ChevronDown,
    Calendar,
    BarChart2,
    MessageCircle,
    Share2,
    ExternalLink
} from 'lucide-react';
import { authenticatedFetch } from '@/lib/utils/api';
import { useAuth } from '@/lib/contexts/AuthContext';
import type { Campaign } from '@/lib/types/campaign.types';
import Link from 'next/link';

type Platform = 'facebook' | 'twitter' | 'linkedin' | 'youtube' | 'instagram';

interface TimelinePost {
    id: string;
    platform: Platform;
    type: string;
    date: string;
    title: string;
    content: string;
    stats: {
        views: string;
        likes: string;
        comments: string;
    };
    details: string;
    campaignId: string;
    status: string;
}

const platformConfig = {
    facebook: {
        icon: Facebook,
        color: 'text-blue-600',
        bg: 'bg-blue-600',
        border: 'border-blue-600',
        borderColor: '#3b82f6',
        gradient: 'from-blue-600 to-blue-400'
    },
    twitter: {
        icon: Twitter,
        color: 'text-sky-500',
        bg: 'bg-sky-500',
        border: 'border-sky-500',
        borderColor: '#0ea5e9',
        gradient: 'from-sky-500 to-sky-300'
    },
    linkedin: {
        icon: Linkedin,
        color: 'text-blue-700',
        bg: 'bg-blue-700',
        border: 'border-blue-700',
        borderColor: '#1d4ed8',
        gradient: 'from-blue-700 to-blue-500'
    },
    youtube: {
        icon: Youtube,
        color: 'text-red-600',
        bg: 'bg-red-600',
        border: 'border-red-600',
        borderColor: '#dc2626',
        gradient: 'from-red-600 to-red-400'
    },
    instagram: {
        icon: Instagram,
        color: 'text-pink-500',
        bg: 'bg-pink-500',
        border: 'border-pink-500',
        borderColor: '#ec4899',
        gradient: 'from-purple-500 via-pink-500 to-orange-500'
    }
};

/**
 * Map Campaign to Timeline Post format
 */
function mapCampaignToPost(campaign: Campaign): TimelinePost[] {
    const posts: TimelinePost[] = [];
    const date = new Date(campaign.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });

    campaign.platforms.forEach((platform) => {
        const platformKey = platform as Platform;
        const config = platformConfig[platformKey] || platformConfig.instagram;

        // Get content for this platform
        let title = `${campaign.brandResearch?.brandName || 'Campaign'} - ${platform}`;
        let content = '';
        let stats = { views: '0', likes: '0', comments: '0' };

        if (platform === 'instagram' && campaign.generatedContent?.instagram?.postIdeas?.[0]) {
            const post = campaign.generatedContent.instagram.postIdeas[0];
            title = post.slogan;
            content = post.caption.substring(0, 100) + (post.caption.length > 100 ? '...' : '');
        } else if (platform === 'linkedin' && campaign.generatedContent?.linkedin?.postDrafts?.[0]) {
            content = campaign.generatedContent.linkedin.postDrafts[0].substring(0, 100) + '...';
        } else if (platform === 'twitter' && campaign.generatedContent?.twitter?.adLines?.[0]) {
            title = campaign.generatedContent.twitter.adLines[0];
            content = title;
        }

        // Map status to type
        const statusTypeMap: Record<string, string> = {
            'pending': 'Draft',
            'researching': 'In Progress',
            'generating-content': 'In Progress',
            'generating-images': 'In Progress',
            'critiquing': 'In Progress',
            'completed': 'Published',
            'failed': 'Failed'
        };

        // Get stats from critique score if available
        if (campaign.critique?.overallScore) {
            const score = campaign.critique.overallScore;
            stats = {
                views: `${Math.round(score * 100)}`,
                likes: `${Math.round(score * 50)}`,
                comments: `${Math.round(score * 10)}`
            };
        }

        posts.push({
            id: `${campaign._id}-${platform}`,
            platform: platformKey,
            type: statusTypeMap[campaign.status] || campaign.status,
            date,
            title,
            content,
            stats,
            details: campaign.critique 
                ? `Score: ${campaign.critique.overallScore}/10. ${campaign.critique.strengths.join(', ')}`
                : `Status: ${campaign.status}`,
            campaignId: campaign._id || '',
            status: campaign.status,
        });
    });

    return posts;
}

export default function Timeline() {
    const { user, loading: authLoading } = useAuth();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [posts, setPosts] = useState<TimelinePost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        // Wait for auth to be ready and user to be authenticated
        if (authLoading || !user) {
            return;
        }

        async function fetchCampaigns() {
            try {
                setLoading(true);
                setError(null);
                
                const response = await authenticatedFetch('/api/campaigns');
                
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Please sign in to view campaigns');
                    }
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Failed to fetch campaigns');
                }

                const data = await response.json();
                const campaigns: Campaign[] = data.campaigns || [];

                // Map campaigns to timeline posts
                const allPosts: TimelinePost[] = [];
                campaigns.forEach((campaign) => {
                    allPosts.push(...mapCampaignToPost(campaign));
                });

                // Sort by date (newest first)
                allPosts.sort((a, b) => {
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                });

                setPosts(allPosts);
            } catch (err: any) {
                console.error('Error fetching campaigns:', err);
                setError(err.message || 'Failed to load campaigns');
            } finally {
                setLoading(false);
            }
        }

        fetchCampaigns();
    }, [user, authLoading]);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Check auth loading first
    if (authLoading) {
        return (
            <div className="w-full max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/70">Loading...</p>
                </div>
            </div>
        );
    }

    // Check if user is authenticated
    if (!user) {
        return (
            <div className="w-full max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <p className="text-white/70">Please sign in to view campaigns</p>
                </div>
            </div>
        );
    }

    // Check data loading
    if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/70">Loading campaigns...</p>
                </div>
            </div>
        );
    }

    // Check for errors
    if (error) {
        return (
            <div className="w-full max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            setLoading(true);
                            window.location.reload();
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg transition-all shadow-lg shadow-blue-500/30"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="w-full">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white">Campaign Timeline</h2>
                <div className="text-center py-8">
                    <p className="text-white/50 text-sm">Timeline will appear here once campaigns are created</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Campaign Timeline</h2>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2"
                >
                    {isExpanded ? 'Collapse' : 'Expand'}
                    <ChevronDown 
                        size={16} 
                        className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                </button>
            </div>
            
            {!isExpanded && posts.length > 0 && (
                <div className="mb-4">
                    <p className="text-sm text-gray-400">
                        Showing {Math.min(3, posts.length)} of {posts.length} items. Click "Expand" to view all.
                    </p>
                </div>
            )}

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/10" />

                <div className="space-y-8">
                    {(isExpanded ? posts : posts.slice(0, 3)).map((post, index) => {
                        const config = platformConfig[post.platform];
                        const Icon = config.icon;
                        const isExpanded = expandedId === post.id;

                        return (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="relative pl-20"
                            >
                                {/* Timeline Dot */}
                                <div className={`absolute left-6 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-slate-900 shadow-lg z-10 ${config.bg}`} />

                                {/* Card */}
                                <motion.div
                                    className="group relative bg-white/5 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 overflow-hidden cursor-pointer border-white/10 hover:border-white/20"
                                    style={{ borderLeftColor: config.borderColor }}
                                    onClick={() => toggleExpand(post.id)}
                                    whileHover={{ y: -2 }}
                                >
                                    {/* Header */}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`p-2 rounded-lg bg-white/10 backdrop-blur-sm ${config.color}`}>
                                                    <Icon size={20} className="text-white" />
                                                </div>
                                                <div>
                                                    <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
                                                        {post.platform} • {post.type}
                                                    </span>
                                                    <h3 className="text-base font-semibold text-white mt-0.5 line-clamp-1">
                                                        {post.title}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-white/60">
                                                <Calendar size={14} />
                                                <span>{post.date}</span>
                                                <motion.div
                                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <ChevronDown size={16} />
                                                </motion.div>
                                            </div>
                                        </div>

                                        <p className="text-white/70 mt-3 line-clamp-1 text-sm">
                                            {post.content}
                                        </p>

                                        {/* Quick Stats */}
                                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10">
                                            <div className="flex items-center gap-1.5 text-xs text-white/50">
                                                <BarChart2 size={14} />
                                                <span>{post.stats.views}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-white/50">
                                                <Share2 size={14} />
                                                <span>{post.stats.likes}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-white/50">
                                                <MessageCircle size={14} />
                                                <span>{post.stats.comments}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="bg-white/5 backdrop-blur-sm"
                                            >
                                                <div className="p-4 border-t border-white/10">
                                                    <p className="text-xs text-white/60 mb-3">
                                                        {post.details}
                                                    </p>

                                                    <div className="mt-4 flex gap-2">
                                                        <Link
                                                            href={`/campaign/${post.campaignId}`}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r ${config.gradient} hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg`}
                                                        >
                                                            View Campaign
                                                            <ExternalLink size={14} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

