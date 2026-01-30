'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Filter, Flame } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const candleProducts = [
    { id: 'c1', name: 'Vanilla Bean Candle', price: 650, image: '/products/vanilla-candle.jpg', category: 'candle' as const },
    { id: 'c2', name: 'Lavender Dreams Candle', price: 550, image: '/products/lavender-candle.jpg', category: 'candle' as const },
    { id: 'c3', name: 'Rose Garden Candle', price: 700, image: '/products/rose-candle.jpg', category: 'candle' as const },
    { id: 'c4', name: 'Sandalwood Bliss', price: 750, image: '/products/vanilla-candle.jpg', category: 'candle' as const },
    { id: 'c5', name: 'Ocean Breeze Candle', price: 600, image: '/products/lavender-candle.jpg', category: 'candle' as const },
    { id: 'c6', name: 'Cinnamon Spice Candle', price: 550, image: '/products/rose-candle.jpg', category: 'candle' as const },
    { id: 'c7', name: 'Jasmine Nights Candle', price: 650, image: '/products/vanilla-candle.jpg', category: 'candle' as const },
    { id: 'c8', name: 'Fresh Linen Candle', price: 500, image: '/products/lavender-candle.jpg', category: 'candle' as const },
];

const fragranceCategories = ['All', 'Floral', 'Woody', 'Fresh', 'Spicy', 'Sweet'];

export default function CandlesPage() {
    return (
        <main className="min-h-screen bg-cream">
            <Navbar />

            {/* Hero Banner */}
            <section className="pt-24 pb-12 px-4 md:px-12 lg:px-24 bg-gradient-to-b from-sage/10 to-cream">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-[family-name:var(--font-dancing)] text-4xl md:text-6xl text-sage mb-4"
                    >
                        The Candle Collection
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-warm-brown text-lg max-w-2xl mx-auto"
                    >
                        Hand-poured soy wax candles in artisanal ceramic vessels.
                        Fill your home with warmth and natural fragrances.
                    </motion.p>
                </div>
            </section>

            {/* Fragrance Categories */}
            <section className="px-4 md:px-12 lg:px-24 py-6">
                <div className="flex flex-wrap gap-2 justify-center">
                    {fragranceCategories.map((cat, index) => (
                        <motion.button
                            key={cat}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${index === 0
                                    ? 'bg-sage text-white'
                                    : 'bg-white text-warm-brown border border-beige hover:border-sage hover:text-sage'
                                }`}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* Filter Bar */}
            <section className="px-4 md:px-12 lg:px-24 py-6 border-b border-beige">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <p className="text-warm-brown">
                        Showing <span className="font-semibold text-deep-brown">{candleProducts.length}</span> candles
                    </p>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 border border-beige rounded-full text-warm-brown hover:border-sage hover:text-sage">
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                        <select className="px-4 py-2 border border-beige rounded-full text-warm-brown bg-white focus:outline-none focus:border-sage">
                            <option>Sort by: Featured</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Newest First</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <section className="px-4 md:px-12 lg:px-24 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {candleProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <ProductCard {...product} />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Candle Care Banner */}
            <section className="px-4 md:px-12 lg:px-24 py-16 bg-sage/10">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-1/2">
                            <div className="relative aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden">
                                <Image
                                    src="/candle-category.jpg"
                                    alt="Candle care"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2">
                            <h2 className="font-[family-name:var(--font-dancing)] text-3xl md:text-4xl text-sage mb-4">
                                Candle Care Tips
                            </h2>
                            <ul className="space-y-3 text-warm-brown">
                                <li className="flex items-start gap-2">
                                    <Flame className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                                    <span>Trim the wick to 1/4 inch before each burn</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Flame className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                                    <span>Let the wax pool reach the edges on first burn</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Flame className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                                    <span>Burn for 2-4 hours at a time for best results</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Flame className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                                    <span>Keep away from drafts and flammable materials</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
