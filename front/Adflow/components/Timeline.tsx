'use client';

import React, { useState } from 'react';
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
    Share2
} from 'lucide-react';

type Platform = 'facebook' | 'twitter' | 'linkedin' | 'youtube' | 'instagram';

interface Post {
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
}

const posts: Post[] = [
    {
        id: '1',
        platform: 'facebook',
        type: 'Announcement',
        date: 'Oct 24, 2023',
        title: 'Product Launch Event',
        content: 'Join us for the big reveal! We are excited to announce our new product line.',
        stats: { views: '1.2k', likes: '450', comments: '89' },
        details: 'Target audience: Tech enthusiasts aged 25-40. Campaign budget: $500. Conversion rate: 3.2%.'
    },
    {
        id: '2',
        platform: 'instagram',
        type: 'Story',
        date: 'Oct 25, 2023',
        title: 'Behind the Scenes',
        content: 'A sneak peek into our design process. #DesignLife #Creative',
        stats: { views: '3.5k', likes: '1.2k', comments: '120' },
        details: 'Visual focus: Vibrant colors and team collaboration. Engagement peaked at 6 PM.'
    },
    {
        id: '3',
        platform: 'twitter',
        type: 'Thread',
        date: 'Oct 26, 2023',
        title: 'Industry Insights',
        content: 'Here are 5 trends shaping the future of marketing in 2024. 🧵👇',
        stats: { views: '5k', likes: '890', comments: '210' },
        details: 'Top performing tweet in the thread discussed AI integration. Retweet ratio: 15%.'
    },
    {
        id: '4',
        platform: 'linkedin',
        type: 'Article',
        date: 'Oct 27, 2023',
        title: 'Leadership Thoughts',
        content: 'Why empathy is the most underrated leadership skill in the modern workplace.',
        stats: { views: '800', likes: '320', comments: '56' },
        details: 'Shared by 15 industry leaders. High engagement from HR professionals.'
    },
    {
        id: '5',
        platform: 'youtube',
        type: 'Video',
        date: 'Oct 28, 2023',
        title: 'Tutorial: Getting Started',
        content: 'Learn how to set up your account in less than 5 minutes.',
        stats: { views: '10k', likes: '2.1k', comments: '340' },
        details: 'Average watch time: 4:30. CTR: 5.8%. Most viewers came from search.'
    }
];

const platformConfig = {
    facebook: {
        icon: Facebook,
        color: 'text-facebook',
        bg: 'bg-facebook',
        border: 'border-facebook',
        gradient: 'from-blue-600 to-blue-400'
    },
    twitter: {
        icon: Twitter,
        color: 'text-twitter',
        bg: 'bg-twitter',
        border: 'border-twitter',
        gradient: 'from-sky-500 to-sky-300'
    },
    linkedin: {
        icon: Linkedin,
        color: 'text-linkedin',
        bg: 'bg-linkedin',
        border: 'border-linkedin',
        gradient: 'from-blue-700 to-blue-500'
    },
    youtube: {
        icon: Youtube,
        color: 'text-youtube',
        bg: 'bg-youtube',
        border: 'border-youtube',
        gradient: 'from-red-600 to-red-400'
    },
    instagram: {
        icon: Instagram,
        color: 'text-pink-500', // Fallback for text
        bg: 'bg-pink-500', // Fallback for bg
        border: 'border-pink-500',
        gradient: 'from-purple-500 via-pink-500 to-orange-500'
    }
};

export default function Timeline() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Campaign Timeline</h2>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                <div className="space-y-8">
                    {posts.map((post, index) => {
                        const config = platformConfig[post.platform];
                        const Icon = config.icon;
                        const isExpanded = expandedId === post.id;

                        return (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative pl-20"
                            >
                                {/* Timeline Dot */}
                                <div className={`absolute left-6 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 shadow-sm z-10 ${config.bg}`} />

                                {/* Card */}
                                <div
                                    className={`
                    group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 overflow-hidden cursor-pointer
                    ${config.border}
                  `}
                                    onClick={() => toggleExpand(post.id)}
                                >
                                    {/* Header */}
                                    <div className="p-5">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-700 ${config.color}`}>
                                                    <Icon size={20} />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        {post.platform} • {post.type}
                                                    </span>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-0.5">
                                                        {post.title}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
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

                                        <p className="text-gray-600 dark:text-gray-300 mt-3 line-clamp-2">
                                            {post.content}
                                        </p>

                                        {/* Quick Stats */}
                                        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <BarChart2 size={16} />
                                                <span>{post.stats.views}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Share2 size={16} />
                                                <span>{post.stats.likes}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <MessageCircle size={16} />
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
                                                className="bg-gray-50 dark:bg-gray-700/30"
                                            >
                                                <div className="p-5 border-t border-gray-100 dark:border-gray-700">
                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                                        Campaign Details
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        {post.details}
                                                    </p>

                                                    <div className="mt-4 flex gap-2">
                                                        <button className={`px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r ${config.gradient} hover:opacity-90 transition-opacity`}>
                                                            View Post
                                                        </button>
                                                        <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                            Analytics
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
