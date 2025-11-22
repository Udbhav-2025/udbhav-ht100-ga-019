'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Sparkles, Target, Zap, CheckCircle } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Don't show landing page if user is authenticated (will redirect)
  if (loading || user) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Autonomous AI Marketing Assistant
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
              .Ad
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {''}Flow
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your 24/7 AI marketing team. Just give us a URL, and we'll research your brand, 
              create multi-platform campaigns, generate stunning visuals, and self-critique 
              everything before showing you polished results.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link
                href="/campaign/new"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 text-lg"
              >
                Start a Campaign
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-200 text-lg"
              >
                Sign In
              </Link>
              <Link
                href="#how-it-works"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-200 text-lg"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-16">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400">3+</div>
                <div className="text-sm text-gray-400 mt-1">Platforms</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400">100%</div>
                <div className="text-sm text-gray-400 mt-1">Autonomous</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-400">AI</div>
                <div className="text-sm text-gray-400 mt-1">Powered</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-400">
                Four autonomous steps to professional campaigns
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Research</h3>
                <p className="text-gray-400">
                  AI crawls your website to understand your brand, audience, positioning, and value propositions.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Create</h3>
                <p className="text-gray-400">
                  Generate platform-optimized copy and AI-designed visuals for Instagram, LinkedIn, and Twitter.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-pink-500/50 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Self-Critique</h3>
                <p className="text-gray-400">
                  Multi-agent AI system reviews and refines content for quality, brand fit, and engagement.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-green-500/50 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Deliver</h3>
                <p className="text-gray-400">
                  Get polished, ready-to-use campaign assets with actionable insights and suggestions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-4 bg-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Everything You Need
              </h2>
              <p className="text-xl text-gray-400">
                Professional marketing campaigns, completely automated
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Multi-Platform Support',
                  description: 'Instagram posts with hashtags, LinkedIn email templates and posts, Twitter ad lines',
                },
                {
                  title: 'AI-Generated Visuals',
                  description: 'Custom banners and creatives powered by Stable Diffusion, optimized for each platform',
                },
                {
                  title: 'Smart Brand Analysis',
                  description: 'Deep understanding of positioning, tone, audience, and value propositions',
                },
                {
                  title: 'Self-Improving AI',
                  description: 'Multi-agent system that critiques and refines content before delivery',
                },
                {
                  title: 'Instant Export',
                  description: 'Copy text with one click, download images individually or in bulk',
                },
                {
                  title: 'Flexible Regeneration',
                  description: 'Change tone or parameters and regenerate content without starting over',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
                >
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create Your Campaign?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let AI handle the research, creation, and refinement. You focus on results.
            </p>
            <Link
              href="/campaign/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
            >
              Start a Campaign
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
            <p>© 2025 The Agentic Marketer. Powered by AI.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
