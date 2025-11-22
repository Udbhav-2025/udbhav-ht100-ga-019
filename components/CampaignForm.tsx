'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { authenticatedFetch } from '@/lib/utils/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Label from '@/components/ui/Label';
import Form from '@/components/ui/Form';

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
    <Form onSubmit={handleSubmit} className="w-full space-y-8">
      {/* Website URL */}
      <div>
        <Input
          type="text"
          value={formData.websiteUrl}
          onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
          placeholder="https://example.com"
          label="Brand Website URL"
          disabled={loading}
        />
      </div>

      {/* Platforms */}
      <div>
        <Label className="mb-3">Target Platforms</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PLATFORM_OPTIONS.map((platform) => (
            <Button
              key={platform.value}
              type="button"
              onClick={() => handlePlatformToggle(platform.value)}
              disabled={loading}
              variant={formData.platforms.includes(platform.value) ? 'primary' : 'outline'}
              className={`p-4 flex-col ${formData.platforms.includes(platform.value) ? 'scale-105' : ''}`}
              animated={false}
            >
              <span className="text-2xl mb-1">{platform.icon}</span>
              <span className="text-sm font-medium">{platform.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Tone */}
      <div>
        <Select
          value={formData.tone}
          onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
          options={TONE_OPTIONS}
          label="Campaign Tone"
          disabled={loading}
        />

        {formData.tone === 'custom' && (
          <Input
            type="text"
            value={formData.customTone}
            onChange={(e) => setFormData({ ...formData, customTone: e.target.value })}
            placeholder="Describe your desired tone..."
            className="mt-3"
            disabled={loading}
          />
        )}
      </div>

      {/* Goal */}
      <div>
        <Select
          value={formData.goal}
          onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
          options={GOAL_OPTIONS}
          label="Primary Goal"
          disabled={loading}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        isLoading={loading}
        leftIcon={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : undefined}
        className="w-full py-4"
        size="lg"
      >
        {loading ? 'Creating Campaign...' : 'Create Campaign'}
      </Button>
    </Form>
  );
}
