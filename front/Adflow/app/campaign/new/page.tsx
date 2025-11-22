'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import CampaignForm from '@/components/CampaignForm';

export default function NewCampaignPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Create New Campaign
            </h1>
            <p className="text-xl text-gray-300">
              Enter your brand details and let AI create a comprehensive marketing campaign
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
            <CampaignForm />
          </div>

          {/* Info Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="text-white font-semibold mb-2">Brand Research</h3>
              <p className="text-sm text-gray-400">
                We'll analyze your website to understand your brand positioning and audience
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-2xl mb-2">✨</div>
              <h3 className="text-white font-semibold mb-2">Content Creation</h3>
              <p className="text-sm text-gray-400">
                AI generates platform-optimized copy and creates custom visual assets
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="text-white font-semibold mb-2">Quality Assurance</h3>
              <p className="text-sm text-gray-400">
                Multi-agent system reviews and refines everything before delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
