import Link from 'next/link';
import Timeline from '@/components/Timeline';
import { Plus, LogOut } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Campaign Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/campaign/new"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <Plus size={16} />
                            New Campaign
                        </Link>
                        <Link
                            href="/login"
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            title="Sign Out"
                        >
                            <LogOut size={20} />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Overview
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Track your recent campaign activities and performance across all platforms.
                    </p>
                </div>

                <Timeline />
            </main>
        </div>
    );
}
