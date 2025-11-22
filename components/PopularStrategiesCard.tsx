'use client';

import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, Sparkles } from 'lucide-react';

interface Strategy {
  id: string;
  title: string;
  description: string;
  tag: 'High ROI' | 'Low Cost' | 'Beginner Friendly';
  source?: string;
  sourceUrl?: string;
}

interface PopularStrategiesCardProps {
  strategies: Strategy[];
  loading?: boolean;
}

const tagConfig = {
  'High ROI': {
    color: 'text-green-400',
    bg: 'bg-green-400/20',
    border: 'border-green-400/30',
    icon: DollarSign,
  },
  'Low Cost': {
    color: 'text-blue-400',
    bg: 'bg-blue-400/20',
    border: 'border-blue-400/30',
    icon: DollarSign,
  },
  'Beginner Friendly': {
    color: 'text-purple-400',
    bg: 'bg-purple-400/20',
    border: 'border-purple-400/30',
    icon: Users,
  },
};

export default function PopularStrategiesCard({ strategies, loading }: PopularStrategiesCardProps) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-white">Popular Marketing Strategies</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      </motion.div>
    );
  }

  if (!strategies || strategies.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Popular Marketing Strategies</h2>
        </div>
        <p className="text-gray-400 text-sm">No strategies available</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-blue-500/50 transition-all"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Popular Marketing Strategies</h2>
      </div>

      <div className="space-y-4">
        {strategies.map((strategy, index) => {
          const tagStyle = tagConfig[strategy.tag];
          const TagIcon = tagStyle.icon;

          return (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              onClick={() => {
                if (strategy.sourceUrl) {
                  window.open(strategy.sourceUrl, '_blank', 'noopener,noreferrer');
                } else if (strategy.source) {
                  alert(`Source: ${strategy.source}`);
                }
              }}
              title={strategy.source ? `Source: ${strategy.source}. Click to view.` : 'Click to view source'}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-base font-semibold text-white flex-1">
                  {strategy.title}
                </h3>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${tagStyle.bg} ${tagStyle.border} border`}>
                  <TagIcon className={`w-3 h-3 ${tagStyle.color}`} />
                  <span className={`text-xs font-medium ${tagStyle.color}`}>
                    {strategy.tag}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-2">
                {strategy.description}
              </p>
              {strategy.source && (
                <p className="text-xs text-gray-500 italic">
                  Source: {strategy.source}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

