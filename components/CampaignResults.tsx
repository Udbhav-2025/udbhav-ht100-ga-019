'use client';

import { useState } from 'react';
import { Download, Copy, RefreshCw, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { Campaign } from '@/lib/types/campaign.types';
import Image from 'next/image';

interface CampaignResultsProps {
  campaign: Campaign;
  onRegenerate: () => void;
}

export default function CampaignResults({ campaign, onRegenerate }: CampaignResultsProps) {
  const [activeTab, setActiveTab] = useState<string>(campaign.platforms[0]);
  const [showCritique, setShowCritique] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadImage = (url: string, platform: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${campaign.brandResearch?.brandName}-${platform}-ad.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded!');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {campaign.brandResearch?.brandName} Campaign
            </h2>
            <p className="text-gray-400">{campaign.brandResearch?.tagline}</p>
          </div>
          <button
            onClick={onRegenerate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </button>
        </div>

        {/* Brand Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Target Audience</div>
            <div className="text-white font-medium">
              {campaign.brandResearch?.targetAudience}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Positioning</div>
            <div className="text-white font-medium">
              {campaign.brandResearch?.positioning}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Tone of Voice</div>
            <div className="text-white font-medium">
              {campaign.brandResearch?.toneOfVoice}
            </div>
          </div>
        </div>
      </div>

      {/* AI Critique Toggle */}
      <button
        onClick={() => setShowCritique(!showCritique)}
        className="w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-4 flex items-center justify-between hover:from-purple-600/30 hover:to-pink-600/30 transition"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <div className="text-left">
            <div className="text-white font-semibold">AI Critique & Analysis</div>
            <div className="text-sm text-gray-400">
              Score: {campaign.critique?.overallScore}/10
            </div>
          </div>
        </div>
        <div className="text-gray-400">{showCritique ? '▼' : '▶'}</div>
      </button>

      {showCritique && campaign.critique && (
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 space-y-4">
          <div>
            <h4 className="text-green-400 font-semibold mb-2">✓ Strengths</h4>
            <ul className="list-disc list-inside space-y-1">
              {campaign.critique.strengths.map((strength, i) => (
                <li key={i} className="text-gray-300">{strength}</li>
              ))}
            </ul>
          </div>
          
          {campaign.critique.weaknesses.length > 0 && (
            <div>
              <h4 className="text-yellow-400 font-semibold mb-2">⚠ Areas for Improvement</h4>
              <ul className="list-disc list-inside space-y-1">
                {campaign.critique.weaknesses.map((weakness, i) => (
                  <li key={i} className="text-gray-300">{weakness}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-blue-400 font-semibold mb-2">💡 Suggestions</h4>
            <ul className="list-disc list-inside space-y-1">
              {campaign.critique.suggestions.map((suggestion, i) => (
                <li key={i} className="text-gray-300">{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Platform Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {campaign.platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => setActiveTab(platform)}
            className={`px-6 py-3 font-medium capitalize transition ${
              activeTab === platform
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {platform}
          </button>
        ))}
      </div>

      {/* Content Display */}
      <div className="space-y-6">
        {/* Instagram */}
        {activeTab === 'instagram' && campaign.generatedContent?.instagram && (
          <div className="space-y-6">
            {campaign.generatedContent.instagram.postIdeas.map((post, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Post {index + 1}</h3>
                  <button
                    onClick={() => copyToClipboard(`${post.slogan}\n\n${post.caption}\n\n${post.hashtags.join(' ')}`)}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Slogan</div>
                    <div className="text-xl font-semibold text-white">{post.slogan}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Caption</div>
                    <div className="text-gray-200 whitespace-pre-wrap">{post.caption}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Hashtags</div>
                    <div className="text-blue-400 flex flex-wrap gap-2">
                      {post.hashtags.map((tag, i) => (
                        <span key={i}>#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LinkedIn */}
        {activeTab === 'linkedin' && campaign.generatedContent?.linkedin && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Email Templates</h3>
              <div className="space-y-4">
                {campaign.generatedContent.linkedin.emailTemplates.map((email, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm text-gray-400">Template {index + 1}</div>
                      <button
                        onClick={() => copyToClipboard(email)}
                        className="p-2 hover:bg-white/10 rounded-lg transition"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <div className="text-gray-200 whitespace-pre-wrap">{email}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Post Drafts</h3>
              <div className="space-y-4">
                {campaign.generatedContent.linkedin.postDrafts.map((post, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm text-gray-400">Post {index + 1}</div>
                      <button
                        onClick={() => copyToClipboard(post)}
                        className="p-2 hover:bg-white/10 rounded-lg transition"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <div className="text-gray-200 whitespace-pre-wrap">{post}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Twitter */}
        {activeTab === 'twitter' && campaign.generatedContent?.twitter && (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Ad Lines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaign.generatedContent.twitter.adLines.map((line, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm text-gray-400">Ad {index + 1}</div>
                    <button
                      onClick={() => copyToClipboard(line)}
                      className="p-2 hover:bg-white/10 rounded-lg transition"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="text-gray-200">{line}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {line.length} / 280 characters
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated Images */}
        {campaign.generatedImages && campaign.generatedImages.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Visual Assets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaign.generatedImages
                .filter((img) => img.platform === activeTab)
                .map((image, index) => (
                  <div key={index} className="space-y-3">
                    <div className="relative bg-white/5 rounded-lg overflow-hidden aspect-square">
                      <Image
                        src={image.url}
                        alt={`${image.platform} ad`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <button
                      onClick={() => downloadImage(image.url, image.platform)}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
