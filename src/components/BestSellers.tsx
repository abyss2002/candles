'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

const bestSellers = [
    {
        id: '1',
        name: 'Floral Fridge Magnet Set',
        price: 450,
        image: '/products/floral-magnet.jpg',
        category: 'quilling' as const,
    },
    {
        id: '2',
        name: 'Vanilla Bean Candle',
        price: 650,
        image: '/products/vanilla-candle.jpg',
        category: 'candle' as const,
    },
    {
        id: '3',
        name: 'Quilled Wall Clock',
        price: 1200,
        image: '/products/wall-clock.jpg',
        category: 'quilling' as const,
    },
    {
        id: '4',
        name: 'Lavender Dreams Candle',
        price: 550,
        image: '/products/lavender-candle.jpg',
        category: 'candle' as const,
    },
    {
        id: '5',
        name: 'Peacock Wall Art',
        price: 1800,
        image: '/products/peacock-art.jpg',
        category: 'quilling' as const,
    },
    {
        id: '6',
        name: 'Rose Garden Candle',
        price: 700,
        image: '/products/rose-candle.jpg',
        category: 'candle' as const,
    },
];

export default function BestSellers() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 320;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className="py-16 md:py-24 bg-beige/30">
            <div className="px-4 md:px-12 lg:px-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end md:justify-between mb-8"
                >
                    <div className="mb-4 md:mb-0">
                        <h2 className="font-[family-name:var(--font-dancing)] text-3xl md:text-4xl text-terracotta mb-2">
                            Best Sellers
                        </h2>
                        <p className="text-warm-brown max-w-md">
                            Our most loved creations, chosen by customers just like you.
                        </p>
                    </div>

                    {/* Desktop Navigation Arrows */}
                    <div className="hidden md:flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => scroll('left')}
                            className="p-3 bg-white rounded-full shadow-md hover:shadow-lg text-warm-brown hover:text-terracotta"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => scroll('right')}
                            className="p-3 bg-white rounded-full shadow-md hover:shadow-lg text-warm-brown hover:text-terracotta"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-4 md:gap-6 overflow-x-auto scroll-hide snap-x-mandatory px-4 md:px-12 lg:px-24 pb-4"
            >
                {bestSellers.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <ProductCard {...product} />
                    </motion.div>
                ))}
            </div>

            {/* Mobile swipe hint */}
            <p className="text-center text-sm text-warm-brown/60 mt-4 md:hidden">
                ← Swipe to explore →
            </p>
        </section>
    );
}
