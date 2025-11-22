'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PopularStrategiesCard from '@/components/PopularStrategiesCard';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Loader2, ArrowLeft, Sparkles } from 'lucide-react';

export default function PopularStrategiesPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [strategies, setStrategies] = useState<any[]>([]);
    const [strategiesLoading, setStrategiesLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        async function fetchStrategies() {
            try {
                setStrategiesLoading(true);
                const response = await fetch('/api/strategies/popular');
                if (response.ok) {
                    const data = await response.json();
                    setStrategies(data.strategies || []);
                }
            } catch (error) {
                console.error('Error fetching strategies:', error);
            } finally {
                setStrategiesLoading(false);
            }
        }

        fetchStrategies();
    }, []);

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
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                                            Popular Marketing Strategies
                                        </h1>
                                        <p className="text-base sm:text-lg text-gray-300">
                                            Explore effective marketing strategies with proven results
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Strategies List */}
                        {strategiesLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                            </div>
                        ) : (
                            <PopularStrategiesCard 
                                strategies={strategies} 
                                loading={false}
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

