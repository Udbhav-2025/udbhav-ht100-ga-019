'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { authenticatedFetch } from '@/lib/utils/api';

const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram', icon: '📸' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
];

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'playful', label: 'Playful' },
  { value: 'bold', label: 'Bold' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'custom', label: 'Custom' },
];

const GOAL_OPTIONS = [
  { value: 'awareness', label: 'Brand Awareness' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'clicks', label: 'Website Clicks' },
  { value: 'conversions', label: 'Conversions' },
];

export default function CampaignForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    websiteUrl: '',
    platforms: [] as string[],
    tone: 'professional',
    customTone: '',
    goal: 'awareness',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handlePlatformToggle = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.websiteUrl.trim()) {
      toast.error('Please enter a website URL');
      return;
    }

    if (formData.platforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    setLoading(true);

    try {
      const tone = formData.tone === 'custom' && formData.customTone
        ? formData.customTone
        : formData.tone;

      const response = await authenticatedFetch('/api/campaigns', {
        method: 'POST',
        body: JSON.stringify({
          websiteUrl: formData.websiteUrl,
          platforms: formData.platforms,
          tone,
          goal: formData.goal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create campaign');
      }

      toast.success('Campaign created! Processing...');
      router.push(`/campaign/${data.campaignId}`);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to create campaign');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8">
      {/* Website URL */}
      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Brand Website URL *
        </label>
        <input
          type="text"
          value={formData.websiteUrl}
          onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
          placeholder="https://example.com"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition backdrop-blur-sm"
          disabled={loading}
        />
      </div>

      {/* Platforms */}
      <div>
        <label className="block text-sm font-medium text-white/90 mb-3">
          Target Platforms *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PLATFORM_OPTIONS.map((platform) => (
            <button
              key={platform.value}
              type="button"
              onClick={() => handlePlatformToggle(platform.value)}
              disabled={loading}
              className={`p-4 rounded-lg border-2 transition-all duration-200 backdrop-blur-sm ${
                formData.platforms.includes(platform.value)
                  ? 'border-blue-500 bg-blue-500/20 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'border-white/20 bg-white/5 text-gray-300 hover:border-blue-400/50 hover:bg-white/10'
              }`}
            >
              <span className="text-2xl mb-1 block">{platform.icon}</span>
              <span className="text-sm font-medium">{platform.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tone */}
      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Campaign Tone *
        </label>
        <select
          value={formData.tone}
          onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition backdrop-blur-sm"
          disabled={loading}
        >
          {TONE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-800">
              {option.label}
            </option>
          ))}
        </select>

        {formData.tone === 'custom' && (
          <input
            type="text"
            value={formData.customTone}
            onChange={(e) => setFormData({ ...formData, customTone: e.target.value })}
            placeholder="Describe your desired tone..."
            className="mt-3 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition backdrop-blur-sm"
            disabled={loading}
          />
        )}
      </div>

      {/* Goal */}
      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Primary Goal *
        </label>
        <select
          value={formData.goal}
          onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition backdrop-blur-sm"
          disabled={loading}
        >
          {GOAL_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-800">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating Campaign...
          </>
        ) : (
          'Create Campaign'
        )}
      </button>
    </form>
  );
}
