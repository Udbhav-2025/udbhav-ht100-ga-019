'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Instagram, 
  Linkedin, 
  Twitter, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle,
  ArrowRight,
  Sparkles,
  Trash2
} from 'lucide-react';
import { authenticatedFetch } from '@/lib/utils/api';
import type { Campaign } from '@/lib/types/campaign.types';

interface CampaignCardProps {
  campaign: Campaign;
  index: number;
  onDelete?: (campaignId: string) => void;
}

const platformIcons = {
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
};

const statusConfig = {
  pending: { 
    label: 'Initializing', 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-400/20', 
    border: 'border-yellow-400/30',
    icon: Clock 
  },
  researching: { 
    label: 'Researching', 
    color: 'text-blue-400', 
    bg: 'bg-blue-400/20', 
    border: 'border-blue-400/30',
    icon: Sparkles 
  },
  'generating-content': { 
    label: 'Creating Content', 
    color: 'text-purple-400', 
    bg: 'bg-purple-400/20', 
    border: 'border-purple-400/30',
    icon: Sparkles 
  },
  'generating-images': { 
    label: 'Creating Visuals', 
    color: 'text-pink-400', 
    bg: 'bg-pink-400/20', 
    border: 'border-pink-400/30',
    icon: Sparkles 
  },
  critiquing: { 
    label: 'Reviewing', 
    color: 'text-indigo-400', 
    bg: 'bg-indigo-400/20', 
    border: 'border-indigo-400/30',
    icon: Sparkles 
  },
  completed: { 
    label: 'Completed', 
    color: 'text-green-400', 
    bg: 'bg-green-400/20', 
    border: 'border-green-400/30',
    icon: CheckCircle2 
  },
  failed: { 
    label: 'Failed', 
    color: 'text-red-400', 
    bg: 'bg-red-400/20', 
    border: 'border-red-400/30',
    icon: XCircle 
  },
};

export default function CampaignCard({ campaign, index, onDelete }: CampaignCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const status = campaign.status as keyof typeof statusConfig;
  const config = statusConfig[status] || statusConfig.pending;
  const StatusIcon = config.icon;
  
  const date = new Date(campaign.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const platformCount = campaign.platforms.length;
  const hasContent = campaign.generatedContent !== undefined;
  const hasImages = campaign.generatedImages && campaign.generatedImages.length > 0;
  const score = campaign.critique?.overallScore;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await authenticatedFetch(`/api/campaigns/${campaign._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to delete campaign' }));
        throw new Error(error.error || 'Failed to delete campaign');
      }

      toast.success('Campaign deleted successfully');
      
      // Call onDelete callback if provided
      if (onDelete) {
        onDelete(campaign._id || '');
      } else {
        // Otherwise refresh the page
        router.refresh();
      }
    } catch (error: any) {
      console.error('Error deleting campaign:', error);
      toast.error(error.message || 'Failed to delete campaign');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <div className="relative h-full group">
        <Link href={`/campaign/${campaign._id}`} className="block h-full">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 p-6 cursor-pointer h-full relative">
          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-4 right-4 p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed z-10"
            title="Delete campaign"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>

          {/* Header */}
          <div className="flex items-start justify-between mb-4 pr-8">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                {campaign.brandResearch?.brandName || 'Untitled Campaign'}
              </h3>
              {campaign.brandResearch?.tagline && (
                <p className="text-sm text-gray-400 line-clamp-1">
                  {campaign.brandResearch.tagline}
                </p>
              )}
            </div>
            
            {/* Status Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bg} ${config.border} border`}>
              <StatusIcon className={`w-4 h-4 ${config.color}`} />
              <span className={`text-xs font-medium ${config.color}`}>
                {config.label}
              </span>
            </div>
          </div>

          {/* Platforms */}
          <div className="flex items-center gap-2 mb-4">
            {campaign.platforms.map((platform) => {
              const Icon = platformIcons[platform as keyof typeof platformIcons];
              return (
                <div
                  key={platform}
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/20"
                  title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                >
                  {Icon && <Icon className="w-4 h-4 text-white" />}
                </div>
              );
            })}
            {platformCount > 3 && (
              <span className="text-xs text-gray-400">+{platformCount - 3}</span>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="text-xs text-gray-400 mb-1">Platforms</div>
              <div className="text-lg font-semibold text-white">{platformCount}</div>
            </div>
            {score !== undefined ? (
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-xs text-gray-400 mb-1">AI Score</div>
                <div className="text-lg font-semibold text-green-400">{score}/10</div>
              </div>
            ) : (
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-xs text-gray-400 mb-1">Content</div>
                <div className="text-lg font-semibold text-white">
                  {hasContent ? 'Ready' : 'Pending'}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400 group-hover:gap-3 transition-all">
              <span className="text-sm font-medium">View Details</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Preview Content */}
          {hasContent && campaign.status === 'completed' && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-xs text-gray-400 mb-2">Preview</div>
              {campaign.generatedContent?.instagram?.postIdeas?.[0] && (
                <p className="text-sm text-gray-300 line-clamp-2">
                  {campaign.generatedContent.instagram.postIdeas[0].slogan}
                </p>
              )}
              {campaign.generatedContent?.twitter?.adLines?.[0] && !campaign.generatedContent?.instagram?.postIdeas?.[0] && (
                <p className="text-sm text-gray-300 line-clamp-2">
                  {campaign.generatedContent.twitter.adLines[0]}
                </p>
              )}
            </div>
          )}
        </div>
        </Link>
      </div>
    </motion.div>
  );
}

