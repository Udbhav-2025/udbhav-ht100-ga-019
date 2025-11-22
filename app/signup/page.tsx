'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, Lock, UserPlus, Sparkles } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useAuth } from '@/lib/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Form from '@/components/ui/Form';
import Label from '@/components/ui/Label';

export default function SignupPage() {
    const router = useRouter();
    const { signUp, signInWithGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            await signUp(email, password);
            toast.success('Account created successfully!');
            router.push('/dashboard');
        } catch (error: any) {
            console.error('Signup error:', error);
            toast.error(error.message || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            await signInWithGoogle();
            toast.success('Successfully signed in with Google!');
            router.push('/dashboard');
        } catch (error: any) {
            console.error('Google sign-in error:', error);
            
            // Handle specific error codes with helpful messages
            let errorMessage = 'Failed to sign in with Google.';
            
            if (error.code === 'auth/unauthorized-domain') {
                const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
                errorMessage = `Domain "${currentDomain}" is not authorized. Please add it to Firebase Authorized Domains in the Firebase Console.`;
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Popup was blocked by your browser. Please allow popups for this site and try again.';
            } else if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Sign-in was cancelled. Please try again.';
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                errorMessage = 'An account already exists with this email. Please sign in with your email and password instead.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your internet connection and try again.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage, { duration: 6000 });
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <AnimatedBackground />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-md mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
                    >
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
                                <UserPlus className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
                            <p className="text-gray-400">Sign up to start creating campaigns</p>
                        </div>

                        <Form onSubmit={handleSignup} className="space-y-6">
                            <Input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                leftIcon={<Mail size={18} />}
                                label="Email Address"
                                className="py-2.5"
                            />

                            <div>
                                <Input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    leftIcon={<Lock size={18} />}
                                    label="Password"
                                    minLength={6}
                                    className="py-2.5"
                                />
                                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                            </div>

                            <Input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                leftIcon={<Lock size={18} />}
                                label="Confirm Password"
                                className="py-2.5"
                            />

                            <Button
                                type="submit"
                                disabled={isLoading || isGoogleLoading}
                                isLoading={isLoading}
                                rightIcon={!isLoading ? <ArrowRight size={18} /> : undefined}
                                className="w-full py-3"
                                animated={false}
                            >
                                Create Account
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white/10 text-white/60">Or continue with</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={isLoading || isGoogleLoading}
                                isLoading={isGoogleLoading}
                                variant="outline"
                                className="w-full py-3 bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30 transition-all"
                                animated={false}
                            >
                                {!isGoogleLoading && (
                                    <svg className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                )}
                                <span>{isGoogleLoading ? 'Signing in...' : 'Sign up with Google'}</span>
                            </Button>
                        </Form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-400">
                                Already have an account?{' '}
                                <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

