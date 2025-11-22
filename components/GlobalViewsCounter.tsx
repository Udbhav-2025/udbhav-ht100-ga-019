'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Instagram, Youtube, Linkedin, Music, Facebook, ChevronDown, X } from 'lucide-react';
import { authenticatedFetch } from '@/lib/utils/api';
import Button from '@/components/ui/Button';

interface PlatformViews {
  instagram: number;
  youtube: number;
  linkedin: number;
  tiktok: number;
  facebook: number;
}

interface AnalyticsData {
  total_views: number;
  platforms: PlatformViews;
}

const platformConfig = {
  instagram: {
    icon: Instagram,
    name: 'Instagram',
    color: 'text-pink-500',
    bg: 'bg-pink-500/20',
    border: 'border-pink-500/30',
  },
  youtube: {
    icon: Youtube,
    name: 'YouTube',
    color: 'text-red-500',
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
  },
  linkedin: {
    icon: Linkedin,
    name: 'LinkedIn',
    color: 'text-blue-700',
    bg: 'bg-blue-700/20',
    border: 'border-blue-700/30',
  },
  tiktok: {
    icon: Music,
    name: 'TikTok',
    color: 'text-purple-500',
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/30',
  },
  facebook: {
    icon: Facebook,
    name: 'Facebook',
    color: 'text-blue-600',
    bg: 'bg-blue-600/20',
    border: 'border-blue-600/30',
  },
};

// Count-up animation function
function useCountUp(end: number, duration: number = 2000, start: number = 0) {
  const [count, setCount] = useState(start);
  const startTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    if (end === start) {
      setCount(end);
      return;
    }

    const animate = (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(start + (end - start) * easeOutQuart);

      setCount(currentCount);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [end, start, duration]);

  return count;
}

export default function GlobalViewsCounter() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [previousTotal, setPreviousTotal] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const animatedCount = useCountUp(data?.total_views || 0, 2000, previousTotal);

  useEffect(() => {
    async function fetchViews() {
      try {
        setLoading(true);
        const response = await authenticatedFetch('/api/analytics/total-views');
        
        if (response.ok) {
          const result = await response.json();
          setPreviousTotal(data?.total_views || 0);
          setData({
            total_views: result.total_views || 0,
            platforms: result.platforms || {},
          });
        }
      } catch (error) {
        console.error('Error fetching total views:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchViews();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchViews, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    }

    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const platforms = data?.platforms || {};
  const totalViews = data?.total_views || 0;

  return (
    <div className="relative" ref={cardRef}>
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden group"
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        whileHover={{ scale: 1.02 }}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-blue-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider">
                  Total Views
                </h3>
                <p className="text-xs text-white/50">All Platforms</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isPopoverOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 ml-2"
            >
              <ChevronDown className="w-5 h-5 text-white/50" />
            </motion.div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-2 w-full">
              <div className="w-full overflow-hidden">
                <motion.div
                  key={animatedCount}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="font-bold text-white leading-none w-full"
                  style={{
                    fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                >
                  <span className="inline-block max-w-full">
                    {formatNumber(animatedCount)}
                  </span>
                </motion.div>
              </div>
              <p className="text-sm text-white/60">
                {isPopoverOpen ? 'Click to collapse' : 'Click to view breakdown'}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Popover */}
      <AnimatePresence>
        {isPopoverOpen && data && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsPopoverOpen(false)}
            />
            
            {/* Popover Content */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl z-50 p-6 max-h-[500px] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">Platform Breakdown</h4>
                <Button
                  onClick={() => setIsPopoverOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="p-1"
                  animated={false}
                >
                  <X className="w-4 h-4 text-white/70" />
                </Button>
              </div>

              <div className="space-y-3">
                {Object.entries(platforms).map(([platformKey, views]) => {
                  const config = platformConfig[platformKey as keyof typeof platformConfig];
                  if (!config) return null;

                  const Icon = config.icon;
                  const percentage = totalViews > 0 ? (views / totalViews) * 100 : 0;

                  return (
                    <motion.div
                      key={platformKey}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${config.bg} ${config.border} border`}>
                            <Icon className={`w-4 h-4 ${config.color}`} />
                          </div>
                          <span className="text-sm font-medium text-white">{config.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-white">
                          {formatNumber(views)}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className={`h-full ${config.bg} ${config.border} border`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/70">Total</span>
                  <span className="text-lg font-bold text-white">{formatNumber(totalViews)}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

