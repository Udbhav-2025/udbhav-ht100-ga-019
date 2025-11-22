'use client';

import { motion } from 'framer-motion';
import { Instagram, Youtube, Linkedin, Music } from 'lucide-react';

interface SocialTrend {
  id: string;
  name: string;
  platform: 'Instagram' | 'YouTube' | 'TikTok' | 'LinkedIn';
  summary: string;
  engagement: string;
  source?: string;
  sourceUrl?: string;
}

interface SocialTrendsCardProps {
  trends: SocialTrend[];
  loading?: boolean;
}

const platformConfig = {
  Instagram: {
    icon: Instagram,
    color: 'text-pink-400',
    bg: 'bg-pink-400/20',
    border: 'border-pink-400/30',
  },
  YouTube: {
    icon: Youtube,
    color: 'text-red-400',
    bg: 'bg-red-400/20',
    border: 'border-red-400/30',
  },
  TikTok: {
    icon: Music,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/20',
    border: 'border-cyan-400/30',
  },
  LinkedIn: {
    icon: Linkedin,
    color: 'text-blue-400',
    bg: 'bg-blue-400/20',
    border: 'border-blue-400/30',
  },
};

export default function SocialTrendsCard({ trends, loading }: SocialTrendsCardProps) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Instagram className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-white">Current Social Media Trends</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      </motion.div>
    );
  }

  if (!trends || trends.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Instagram className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Current Social Media Trends</h2>
        </div>
        <p className="text-gray-400 text-sm">No trends available</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-purple-500/50 transition-all"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <Instagram className="w-5 h-5 text-purple-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Current Social Media Trends</h2>
      </div>

      <div className="space-y-4">
        {trends.map((trend, index) => {
          const platform = platformConfig[trend.platform];
          const PlatformIcon = platform.icon;

          return (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              onClick={() => {
                if (trend.sourceUrl) {
                  window.open(trend.sourceUrl, '_blank', 'noopener,noreferrer');
                } else if (trend.source) {
                  alert(`Source: ${trend.source}`);
                }
              }}
              title={trend.source ? `Source: ${trend.source}. Click to view.` : 'Click to view source'}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1.5 rounded-lg ${platform.bg} ${platform.border} border`}>
                      <PlatformIcon className={`w-3.5 h-3.5 ${platform.color}`} />
                    </div>
                    <span className={`text-xs font-medium ${platform.color}`}>
                      {trend.platform}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    {trend.name}
                  </h3>
                </div>
                <div className="px-2.5 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <span className="text-xs font-semibold text-green-400">
                    {trend.engagement}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-2">
                {trend.summary}
              </p>
              {trend.source && (
                <p className="text-xs text-gray-500 italic">
                  Source: {trend.source}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

