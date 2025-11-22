'use client';

import { motion } from 'framer-motion';
import { TrendingUp, ArrowUp, Flame } from 'lucide-react';

interface TrendingStrategy {
  id: string;
  title: string;
  trendScore: number;
  growth: string;
  explanation: string;
  source?: string;
  sourceUrl?: string;
}

interface TrendingStrategiesCardProps {
  strategies: TrendingStrategy[];
  loading?: boolean;
}

export default function TrendingStrategiesCard({ strategies, loading }: TrendingStrategiesCardProps) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-white">Trending Strategies Right Now</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white/5 rounded-lg animate-pulse" />
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
          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Trending Strategies Right Now</h2>
        </div>
        <p className="text-gray-400 text-sm">No trending strategies available</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-orange-500/50 transition-all"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
          <Flame className="w-5 h-5 text-orange-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Trending Strategies Right Now</h2>
      </div>

      <div className="space-y-4">
        {strategies.map((strategy, index) => (
          <motion.div
            key={strategy.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-orange-500/30 transition-all cursor-pointer"
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
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded-lg">
                  <TrendingUp className="w-3 h-3 text-orange-400" />
                  <span className="text-xs font-semibold text-orange-400">
                    {strategy.trendScore}
                  </span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <ArrowUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs font-semibold text-green-400">
                    {strategy.growth}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-2">
              {strategy.explanation}
            </p>
            {strategy.source && (
              <p className="text-xs text-gray-500 italic">
                Source: {strategy.source}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

