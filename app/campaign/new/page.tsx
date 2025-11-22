'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, Search, Wand2, CheckCircle2 } from 'lucide-react';
import CampaignForm from '@/components/CampaignForm';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function NewCampaignPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <Navbar />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 sm:mb-12 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl mb-4 sm:mb-6 border border-white/10 shadow-lg">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
              Create New Campaign
            </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Enter your brand details and let AI create a comprehensive marketing campaign
            </p>
            </motion.div>

          {/* Form Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12 shadow-xl"
            >
            <CampaignForm />
            </motion.div>

          {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center mb-4 border border-blue-500/30">
                  <Search className="w-6 h-6 text-blue-400" />
                </div>
              <h3 className="text-white font-semibold mb-2">Brand Research</h3>
                <p className="text-sm text-gray-300">
                We'll analyze your website to understand your brand positioning and audience
              </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mb-4 border border-purple-500/30">
                  <Wand2 className="w-6 h-6 text-purple-400" />
            </div>
              <h3 className="text-white font-semibold mb-2">Content Creation</h3>
                <p className="text-sm text-gray-300">
                AI generates platform-optimized copy and creates custom visual assets
              </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-green-500/50 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center mb-4 border border-green-500/30">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
              <h3 className="text-white font-semibold mb-2">Quality Assurance</h3>
                <p className="text-sm text-gray-300">
                Multi-agent system reviews and refines everything before delivery
              </p>
              </motion.div>
            </motion.div>
            </div>
        </main>
      </div>
    </div>
  );
}
