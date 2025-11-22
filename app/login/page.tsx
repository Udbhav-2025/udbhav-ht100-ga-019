'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, Lock, Sparkles } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import FloatingSocialIcons from '@/components/FloatingSocialIcons';
import { useAuth } from '@/lib/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Form from '@/components/ui/Form';
import Label from '@/components/ui/Label';
import { useState as useReactState } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const { signIn, signInWithGoogle, sendPasswordReset } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [isResetting, setIsResetting] = useState(false);

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

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetEmail.trim()) {
            toast.error('Please enter your email address');
            return;
        }

        setIsResetting(true);
        try {
            await sendPasswordReset(resetEmail);
            toast.success('Password reset email sent! Check your inbox.');
            setShowForgotPassword(false);
            setResetEmail('');
        } catch (error: any) {
            console.error('Password reset error:', error);
            toast.error(error.message || 'Failed to send password reset email.');
        } finally {
            setIsResetting(false);
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
                            <Form onSubmit={handleLogin}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        leftIcon={<Mail size={18} />}
                                        label="Email Address"
                                        className="py-3"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <Label>Password</Label>
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotPassword(true)}
                                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                    <Input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        leftIcon={<Lock size={18} />}
                                        className="py-3"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="space-y-3"
                                >
                                    <Button
                                        type="submit"
                                        disabled={isLoading || isGoogleLoading}
                                        isLoading={isLoading}
                                        rightIcon={!isLoading ? <ArrowRight size={18} /> : undefined}
                                        className="w-full py-3.5"
                                        animated={false}
                                    >
                                        Log In
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
                                        className="w-full py-3.5 bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30 transition-all"
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
                                        <span>{isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}</span>
                                    </Button>
                                </motion.div>
                            </Form>

                            {/* Forgot Password Modal */}
                            {showForgotPassword && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                                >
                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForgotPassword(false)} />
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="relative bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl p-6 w-full max-w-md z-10"
                                    >
                                        <h3 className="text-xl font-bold text-white mb-4">Reset Password</h3>
                                        <Form onSubmit={handleForgotPassword}>
                                            <Input
                                                type="email"
                                                value={resetEmail}
                                                onChange={(e) => setResetEmail(e.target.value)}
                                                placeholder="Enter your email address"
                                                label="Email Address"
                                                leftIcon={<Mail size={18} />}
                                                required
                                            />
                                            <div className="flex gap-3 mt-4">
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowForgotPassword(false);
                                                        setResetEmail('');
                                                    }}
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    isLoading={isResetting}
                                                    className="flex-1"
                                                >
                                                    Send Reset Link
                                                </Button>
                                            </div>
                                        </Form>
                                    </motion.div>
                                </motion.div>
                            )}

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
                    {/* Background - Using gradient instead of video due to Pexels 403 errors */}
                    <div className="absolute inset-0">
                        <div className="w-full h-full bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-pink-900/50" />
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
                    {/* Background - Using gradient fallback due to Pexels 403 errors */}
                    <div className="absolute inset-0">
                        <div className="w-full h-full bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-pink-900/50" />
                        {/* Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-transparent" />
                    </div>
                </div>
            </div>
        </div>
    );
}

