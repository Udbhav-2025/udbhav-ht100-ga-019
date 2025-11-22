'use client';

import { useState } from 'react';
import { Download, Copy, RefreshCw, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { Campaign } from '@/lib/types/campaign.types';

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

  // Helper function to get post information for an image
  const getPostInfoForImage = (
    platform: string,
    postIndex: number | undefined,
    generatedContent?: Campaign['generatedContent']
  ): { title: string; subtitle?: string } | null => {
    if (postIndex === undefined || !generatedContent) return null;

    try {
      switch (platform) {
        case 'instagram':
          const instagramPost = generatedContent.instagram?.postIdeas?.[postIndex];
          if (instagramPost) {
            return {
              title: instagramPost.slogan,
              subtitle: instagramPost.caption?.substring(0, 100) + '...',
            };
          }
          break;
        case 'linkedin':
          const linkedinPost = generatedContent.linkedin?.postDrafts?.[postIndex];
          if (linkedinPost) {
            const postText = typeof linkedinPost === 'string' ? linkedinPost : linkedinPost.body || '';
            return {
              title: `Post ${postIndex + 1}`,
              subtitle: postText.substring(0, 100) + '...',
            };
          }
          break;
        case 'twitter':
          const twitterAdLine = generatedContent.twitter?.adLines?.[postIndex];
          if (twitterAdLine) {
            return {
              title: twitterAdLine,
            };
          }
          break;
      }
    } catch (error) {
      console.error('Error getting post info:', error);
    }

    return null;
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
                {campaign.generatedContent.linkedin.emailTemplates.map((email, index) => {
                  // Handle both string and object formats
                  const isObject = typeof email === 'object' && email !== null;
                  const emailSubject = isObject && 'subject' in email ? email.subject : null;
                  const emailBody = isObject && 'body' in email ? email.body : (typeof email === 'string' ? email : '');
                  const emailText = typeof email === 'string' 
                    ? email 
                    : (isObject && emailSubject && emailBody ? `${emailSubject}\n\n${emailBody}` : (emailBody || JSON.stringify(email)));
                  
                  return (
                    <div key={index} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-sm text-gray-400">Template {index + 1}</div>
                        <button
                          onClick={() => copyToClipboard(emailText)}
                          className="p-2 hover:bg-white/10 rounded-lg transition"
                        >
                          <Copy className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      {emailSubject && (
                        <div className="mb-2">
                          <div className="text-sm text-gray-400 mb-1">Subject</div>
                          <div className="text-lg font-semibold text-white">{emailSubject}</div>
                        </div>
                      )}
                      <div className="text-gray-200 whitespace-pre-wrap">{emailBody}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Post Drafts</h3>
              <div className="space-y-4">
                {campaign.generatedContent.linkedin.postDrafts.map((post, index) => {
                  // Handle both string and object formats
                  const isObject = typeof post === 'object' && post !== null;
                  const postSubject = isObject && 'subject' in post ? post.subject : null;
                  const postBody = isObject && 'body' in post ? post.body : (typeof post === 'string' ? post : '');
                  const postText = typeof post === 'string' 
                    ? post 
                    : (isObject && postSubject && postBody ? `${postSubject}\n\n${postBody}` : (postBody || JSON.stringify(post)));
                  
                  return (
                    <div key={index} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-sm text-gray-400">Post {index + 1}</div>
                        <button
                          onClick={() => copyToClipboard(postText)}
                          className="p-2 hover:bg-white/10 rounded-lg transition"
                        >
                          <Copy className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      {postSubject && (
                        <div className="mb-2">
                          <div className="text-sm text-gray-400 mb-1">Subject</div>
                          <div className="text-lg font-semibold text-white">{postSubject}</div>
                        </div>
                      )}
                      <div className="text-gray-200 whitespace-pre-wrap">{postBody}</div>
                    </div>
                  );
                })}
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
                .map((image, index) => {
                  // Get post information for this image
                  const postInfo = getPostInfoForImage(activeTab, image.postIndex, campaign.generatedContent);
                  
                  return (
                    <div key={index} className="space-y-3">
                      <div className="relative bg-white/5 rounded-lg overflow-hidden aspect-square">
                        <img
                          src={image.url || `/placeholders/${image.platform}-placeholder.svg`}
                          alt={`${image.platform} ad ${(image.postIndex ?? 0) + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Image load error:', image.url);
                            const target = e.target as HTMLImageElement;
                            if (target && !target.src.includes('placeholder')) {
                              target.src = `/placeholders/${image.platform}-placeholder.svg`;
                            }
                          }}
                        />
                        {postInfo && (
                          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            Post {(image.postIndex ?? 0) + 1}
                          </div>
                        )}
                      </div>
                      {postInfo && (
                        <div className="text-sm text-gray-300 bg-white/5 rounded p-2">
                          <p className="font-medium text-white truncate">{postInfo.title}</p>
                          {postInfo.subtitle && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{postInfo.subtitle}</p>
                          )}
                        </div>
                      )}
                      <button
                        onClick={() => {
                          const postNum = (image.postIndex ?? 0) + 1;
                          const link = document.createElement('a');
                          link.href = image.url;
                          link.download = `${campaign.brandResearch?.brandName}-${image.platform}-post${postNum}.png`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          toast.success('Image downloaded!');
                        }}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
