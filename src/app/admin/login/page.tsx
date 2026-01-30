'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { verifyAdminPassword, setAdminAuthenticated, isAdminAuthenticated } from '@/lib/admin-auth';

export default function AdminLoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Redirect if already authenticated
        if (isAdminAuthenticated()) {
            router.push('/admin');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const isValid = await verifyAdminPassword(password);

            if (isValid) {
                setAdminAuthenticated();
                router.push('/admin');
            } else {
                setError('Incorrect password. Please try again.');
                setIsLoading(false);
            }
        } catch {
            setError('Something went wrong. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-deep-brown via-warm-brown to-terracotta flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 text-terracotta" />
                        </div>
                        <h1 className="text-2xl font-bold text-deep-brown">Admin Access</h1>
                        <p className="text-warm-brown mt-2">Enter password to continue</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter admin password"
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={isLoading || !password}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 bg-terracotta text-white font-medium rounded-lg hover:bg-warm-brown disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    Login
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Back to site */}
                    <div className="mt-6 text-center">
                        <a href="/" className="text-sm text-warm-brown hover:text-terracotta">
                            ← Back to website
                        </a>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
