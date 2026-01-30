'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Filter, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const quillingProducts = [
    { id: 'q1', name: 'Floral Fridge Magnet Set', price: 450, image: '/products/floral-magnet.jpg', category: 'quilling' as const },
    { id: 'q2', name: 'Quilled Wall Clock', price: 1200, image: '/products/wall-clock.jpg', category: 'quilling' as const },
    { id: 'q3', name: 'Peacock Wall Art', price: 1800, image: '/products/peacock-art.jpg', category: 'quilling' as const },
    { id: 'q4', name: 'Butterfly Magnet Set', price: 350, image: '/products/floral-magnet.jpg', category: 'quilling' as const },
    { id: 'q5', name: 'Mandala Wall Decor', price: 2200, image: '/products/peacock-art.jpg', category: 'quilling' as const },
    { id: 'q6', name: 'Floral Photo Frame', price: 900, image: '/products/wall-clock.jpg', category: 'quilling' as const },
    { id: 'q7', name: 'Earring Set - Petals', price: 250, image: '/products/floral-magnet.jpg', category: 'quilling' as const },
    { id: 'q8', name: 'Coaster Set of 4', price: 600, image: '/products/peacock-art.jpg', category: 'quilling' as const },
];

export default function QuillingPage() {
    return (
        <main className="min-h-screen bg-cream">
            <Navbar />

            {/* Hero Banner */}
            <section className="pt-24 pb-12 px-4 md:px-12 lg:px-24 bg-gradient-to-b from-terracotta/10 to-cream">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-[family-name:var(--font-dancing)] text-4xl md:text-6xl text-terracotta mb-4"
                    >
                        The Quilling Collection
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-warm-brown text-lg max-w-2xl mx-auto"
                    >
                        Intricate paper art crafted with patience and love. Each piece is a unique creation
                        that brings color and elegance to your space.
                    </motion.p>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="px-4 md:px-12 lg:px-24 py-6 border-b border-beige">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <p className="text-warm-brown">
                        Showing <span className="font-semibold text-deep-brown">{quillingProducts.length}</span> products
                    </p>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 border border-beige rounded-full text-warm-brown hover:border-terracotta hover:text-terracotta">
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                        <select className="px-4 py-2 border border-beige rounded-full text-warm-brown bg-white focus:outline-none focus:border-terracotta">
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
                    {quillingProducts.map((product, index) => (
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

            {/* CTA Banner */}
            <section className="px-4 md:px-12 lg:px-24 py-16 bg-soft-pink/30">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="font-[family-name:var(--font-dancing)] text-3xl md:text-4xl text-terracotta mb-4">
                        Custom Orders Welcome
                    </h2>
                    <p className="text-warm-brown mb-6">
                        Looking for something special? I create custom quilling pieces for weddings,
                        anniversaries, and special occasions.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-terracotta text-white rounded-full font-medium flex items-center gap-2 mx-auto"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Request Custom Order
                    </motion.button>
                </div>
            </section>

            <Footer />
        </main>
    );
}
