'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Quilling', href: '/quilling' },
    { name: 'Candles', href: '/candles' },
    { name: 'About', href: '/about' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="px-4 md:px-12 lg:px-24 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-terracotta" />
                            <span className="font-[family-name:var(--font-dancing)] text-2xl md:text-3xl text-deep-brown">
                                Handcrafted Joy
                            </span>
                        </Link>

                        {/* Desktop Navigation - Hidden on mobile */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-warm-brown hover:text-terracotta font-medium transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Actions - Hidden on mobile */}
                        <div className="hidden md:flex items-center gap-4">
                            <button className="p-2 text-warm-brown hover:text-terracotta transition-colors">
                                <Search className="w-5 h-5" />
                            </button>
                            <Link href="/cart" className="relative p-2 text-warm-brown hover:text-terracotta transition-colors">
                                <ShoppingBag className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-terracotta text-white text-xs rounded-full flex items-center justify-center">
                                    3
                                </span>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 text-warm-brown"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Sheet */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                        />

                        {/* Sheet */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[280px] bg-cream z-50 shadow-2xl md:hidden"
                        >
                            <div className="p-6">
                                <div className="flex justify-end mb-8">
                                    <button onClick={() => setIsOpen(false)}>
                                        <X className="w-6 h-6 text-warm-brown" />
                                    </button>
                                </div>

                                <nav className="flex flex-col gap-4">
                                    {navLinks.map((link, index) => (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className="block py-3 text-lg font-medium text-deep-brown hover:text-terracotta border-b border-beige"
                                            >
                                                {link.name}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>

                                {/* Mobile Actions */}
                                <div className="mt-8 flex items-center gap-4">
                                    <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-beige rounded-full text-warm-brown">
                                        <Search className="w-5 h-5" />
                                        <span>Search</span>
                                    </button>
                                    <Link href="/cart" onClick={() => setIsOpen(false)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-terracotta rounded-full text-white">
                                        <ShoppingBag className="w-5 h-5" />
                                        <span>Cart (3)</span>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
