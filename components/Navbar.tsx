'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, 
    LogOut, 
    LayoutDashboard, 
    FilePlus,
    User,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/login');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/campaign/new', label: 'New Campaign', icon: FilePlus },
        { href: '/profile', label: 'Profile', icon: User },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <header className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center justify-between">
                    {/* Logo/Brand */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold text-white">
                                    .AdFlow
                                </h1>
                                <p className="text-xs text-white/60">AI Marketing</p>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        active
                                            ? 'text-white bg-white/10'
                                            : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {active && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute inset-0 bg-white/10 rounded-lg"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <Icon size={18} className="relative z-10" />
                                    <span className="relative z-10">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        {/* User Info */}
                        {user && (
                            <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <User size={16} className="text-white" />
                                </div>
                                <div className="hidden lg:block">
                                    <p className="text-sm font-medium text-white">
                                        {user.displayName || user.email?.split('@')[0] || 'User'}
                                    </p>
                                    <p className="text-xs text-white/60">Active</p>
                                </div>
                            </div>
                        )}

                        {/* Sign Out Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleSignOut}
                            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            title="Sign Out"
                        >
                            <LogOut size={20} />
                        </motion.button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden overflow-hidden border-t border-white/10"
                        >
                            <nav className="py-4 space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                                active
                                                    ? 'text-white bg-white/10'
                                                    : 'text-white/70 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            <Icon size={20} />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}

