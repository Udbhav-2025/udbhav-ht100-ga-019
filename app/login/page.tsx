'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, Lock, Sparkles } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import FloatingSocialIcons from '@/components/FloatingSocialIcons';
import { useAuth } from '@/lib/contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoError, setVideoError] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await signIn(email, password);
            toast.success('Successfully signed in!');
            router.push('/dashboard');
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            <AnimatedBackground />

            <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
                {/* Left Side - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="w-full max-w-md"
                    >
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 sm:p-10 shadow-2xl">
                            {/* Logo & App Name */}
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-blue-500/30"
                                >
                                    <Sparkles className="w-8 h-8 text-white" />
                                </motion.div>
                                <h1 className="text-3xl font-bold text-white mb-2">.AdFlow</h1>
                                <p className="text-gray-300">AI-Powered Marketing</p>
                            </div>

                            {/* Login Form */}
                            <form onSubmit={handleLogin} className="space-y-5">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-2"
                                >
                                    <label className="text-sm font-medium text-gray-300">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-300">Password</label>
                                        <Link
                                            href="#"
                                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </motion.div>

                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3.5 rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Log In
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-6 text-center"
                            >
                                <p className="text-sm text-gray-400">
                                    Don't have an account?{' '}
                                    <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                                        Sign up
                                    </Link>
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side - Visual Area */}
                <div className="w-full lg:w-1/2 relative hidden lg:flex items-center justify-center overflow-hidden">
                    {/* Background Video */}
                    <div className="absolute inset-0">
                        {!videoError ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                                onError={() => setVideoError(true)}
                            >
                                <source src="https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4" type="video/mp4" />
                                <source src="https://videos.pexels.com/video-files/2491284/2491284-hd_1920_1080_25fps.mp4" type="video/mp4" />
                            </video>
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-pink-900/50" />
                        )}
                        {/* Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-transparent" />
                    </div>

                    {/* Floating Icons */}
                    <div className="relative z-10 w-full h-full">
                        <FloatingSocialIcons />
                    </div>
                </div>

                {/* Mobile: Stacked Layout */}
                <div className="w-full lg:hidden relative h-64 sm:h-80 overflow-hidden">
                    {/* Background Video for Mobile */}
                    <div className="absolute inset-0">
                        {!videoError ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                                onError={() => setVideoError(true)}
                            >
                                <source src="https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4" type="video/mp4" />
                                <source src="https://videos.pexels.com/video-files/2491284/2491284-hd_1920_1080_25fps.mp4" type="video/mp4" />
                            </video>
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-pink-900/50" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-slate-900/40" />
                    </div>

                    {/* Floating Icons - Lighter for Mobile */}
                    <div className="relative z-10 w-full h-full">
                        <FloatingSocialIcons />
                    </div>
                </div>
            </div>
        </div>
    );
}

