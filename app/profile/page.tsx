'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useAuth } from '@/lib/contexts/AuthContext';
import { authenticatedFetch } from '@/lib/utils/api';
import { Loader2, User, Settings, Save, ArrowLeft, Mail, Key } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Label from '@/components/ui/Label';

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        researchPrompt: '',
        contentPrompt: '',
        critiquePrompt: '',
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            setFormData({
                displayName: user.displayName || user.email?.split('@')[0] || '',
                email: user.email || '',
                researchPrompt: '', // Load from user settings
                contentPrompt: '', // Load from user settings
                critiquePrompt: '', // Load from user settings
            });
        }
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Update Firebase user profile
            if (user) {
                const { updateProfile, reload } = await import('firebase/auth');
                const { auth } = await import('@/lib/firebase/config');
                
                if (auth && auth.currentUser) {
                    await updateProfile(auth.currentUser, {
                        displayName: formData.displayName || null,
                    });
                    
                    // Reload the user to get the updated profile
                    await reload(auth.currentUser);
                    
                    toast.success('Display name updated successfully');
                } else {
                    throw new Error('User not authenticated');
                }
            }
        } catch (error: any) {
            console.error('Error saving settings:', error);
            toast.error(error.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

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
        return null;
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
                            className="mb-8 sm:mb-12"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <Link
                                    href="/dashboard"
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-white" />
                                </Link>
                                <div>
                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                                        Profile Settings
                                    </h1>
                                    <p className="text-base sm:text-lg text-gray-300">
                                        Manage your account and customize AI prompts
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="space-y-6">
                            {/* Personal Information */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sm:p-8"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Personal Information</h2>
                                </div>

                                <div className="space-y-4">
                                    <Input
                                        type="text"
                                        value={formData.displayName}
                                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                        placeholder="Your display name"
                                        label="Display Name"
                                    />

                                    <div>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            placeholder="your@email.com"
                                            label="Email Address"
                                            leftIcon={<Mail className="w-5 h-5" />}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* AI Prompt Customization */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sm:p-8"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                        <Settings className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-white">AI Prompt Customization</h2>
                                        <p className="text-xs text-yellow-400 mt-1">✨ Future Premium Feature</p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-400 mb-6">
                                    Customize the prompts used by AI agents for your campaigns. Leave empty to use default prompts.
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <Textarea
                                            value={formData.researchPrompt}
                                            onChange={(e) => setFormData({ ...formData, researchPrompt: e.target.value })}
                                            rows={4}
                                            label="Research Agent Prompt"
                                            className="font-mono text-sm"
                                            placeholder="Default: Analyze the brand website and extract key information..."
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Used by the Research Agent to analyze brands</p>
                                    </div>

                                    <div>
                                        <Textarea
                                            value={formData.contentPrompt}
                                            onChange={(e) => setFormData({ ...formData, contentPrompt: e.target.value })}
                                            rows={4}
                                            label="Content Generation Prompt"
                                            placeholder="Default: Generate platform-optimized content based on brand research..."
                                            className="font-mono text-sm focus:ring-purple-500/50 focus:border-purple-500/50"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Used by the Content Creator to generate posts</p>
                                    </div>

                                    <div>
                                        <Textarea
                                            value={formData.critiquePrompt}
                                            onChange={(e) => setFormData({ ...formData, critiquePrompt: e.target.value })}
                                            rows={4}
                                            label="Critique Agent Prompt"
                                            placeholder="Default: Review and critique the generated content for quality..."
                                            className="font-mono text-sm focus:ring-pink-500/50 focus:border-pink-500/50"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Used by the Critique Agent to review content</p>
                                    </div>

                                    <Textarea
                                        value={formData.contentPrompt}
                                        onChange={(e) => setFormData({ ...formData, contentPrompt: e.target.value })}
                                        rows={4}
                                        label="Content Generation Prompt"
                                        placeholder="Default: Generate platform-optimized content based on brand research..."
                                        className="font-mono text-sm focus:ring-purple-500/50 focus:border-purple-500/50"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Used by the Content Creator to generate posts</p>

                                    <Textarea
                                        value={formData.critiquePrompt}
                                        onChange={(e) => setFormData({ ...formData, critiquePrompt: e.target.value })}
                                        rows={4}
                                        label="Critique Agent Prompt"
                                        placeholder="Default: Review and critique the generated content for quality..."
                                        className="font-mono text-sm focus:ring-pink-500/50 focus:border-pink-500/50"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Used by the Critique Agent to review content</p>
                                </div>
                            </motion.div>

                            {/* Save Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex justify-end"
                            >
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    isLoading={saving}
                                    leftIcon={!saving ? <Save className="w-5 h-5" /> : undefined}
                                >
                                    {saving ? 'Saving...' : 'Save Settings'}
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

