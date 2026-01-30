'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell } from 'lucide-react';

interface NotifyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (email: string, name: string) => void;
    productName: string;
}

export default function NotifyModal({ isOpen, onClose, onSubmit, productName }: NotifyModalProps) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setIsSubmitting(true);
        await onSubmit(email.trim().toLowerCase(), name.trim() || 'Customer');
        setIsSubmitting(false);
        setEmail('');
        setName('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl p-6 mx-4">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center">
                                        <Bell className="w-5 h-5 text-terracotta" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-deep-brown">Get Notified</h3>
                                        <p className="text-sm text-gray-500">We&apos;ll email you when it&apos;s back</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Product Name */}
                            <div className="bg-cream rounded-xl p-3 mb-4">
                                <p className="text-sm text-warm-brown">Product</p>
                                <p className="font-medium text-deep-brown">{productName}</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Name (optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !email.trim()}
                                    className="w-full py-3 bg-terracotta text-white rounded-xl font-medium hover:bg-warm-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Notify Me'}
                                </button>
                            </form>

                            <p className="text-xs text-gray-400 text-center mt-4">
                                We&apos;ll only use your email to notify you about this product.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
