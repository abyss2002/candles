'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Heart } from 'lucide-react';

export default function Hero() {
    return (
        <section className="min-h-screen pt-20 px-4 md:px-12 lg:px-24 flex flex-col md:flex-row items-center">
            {/* Mobile: Image First, Desktop: Text First */}
            <div className="order-2 md:order-1 w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left py-8 md:py-0">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-soft-pink/50 rounded-full text-terracotta text-sm font-medium mb-6">
                        <Heart className="w-4 h-4" /> Made with Love
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-deep-brown leading-tight mb-6"
                >
                    <span className="font-[family-name:var(--font-dancing)] text-terracotta">Handcrafted</span>
                    <br />
                    Joy for Your Home
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-warm-brown text-lg md:text-xl max-w-md mb-8"
                >
                    Discover intricate quilling art and aromatic hand-poured candles,
                    each piece crafted with passion and care.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-terracotta text-white font-semibold rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        Shop Collection <ArrowRight className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 border-2 border-warm-brown text-warm-brown font-semibold rounded-full hover:bg-warm-brown hover:text-white"
                    >
                        Our Story
                    </motion.button>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex gap-8 mt-12"
                >
                    <div>
                        <span className="block text-3xl font-bold text-terracotta">500+</span>
                        <span className="text-sm text-warm-brown">Happy Customers</span>
                    </div>
                    <div className="border-l border-beige pl-8">
                        <span className="block text-3xl font-bold text-terracotta">200+</span>
                        <span className="text-sm text-warm-brown">Unique Designs</span>
                    </div>
                </motion.div>
            </div>

            {/* Hero Image */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="order-1 md:order-2 w-full md:w-1/2 relative"
            >
                <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-full aspect-square max-w-lg mx-auto"
                >
                    {/* Decorative circles */}
                    <div className="absolute -top-4 -left-4 w-32 h-32 bg-soft-pink/30 rounded-full blur-2xl" />
                    <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-sage/20 rounded-full blur-3xl" />

                    {/* Main Image */}
                    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-beige">
                        <Image
                            src="/hero-image.jpg"
                            alt="Handcrafted quilling art and scented candles display"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Floating Card - Quilling */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="absolute left-4 md:-left-8 top-1/4 bg-white p-3 rounded-xl shadow-lg"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-terracotta/10 rounded-lg flex items-center justify-center">
                                <span className="text-xl">🎨</span>
                            </div>
                            <div>
                                <span className="text-xs text-warm-brown">Quilling Art</span>
                                <span className="block text-sm font-semibold text-deep-brown">50+ Designs</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating Card - Candles */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 }}
                        className="absolute right-4 md:-right-8 bottom-1/4 bg-white p-3 rounded-xl shadow-lg"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-sage/20 rounded-lg flex items-center justify-center">
                                <span className="text-xl">🕯️</span>
                            </div>
                            <div>
                                <span className="text-xs text-warm-brown">Scented Candles</span>
                                <span className="block text-sm font-semibold text-deep-brown">15+ Fragrances</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
