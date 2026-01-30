'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categories = [
    {
        id: 'quilling',
        title: 'The Quilling Collection',
        subtitle: 'Intricate Paper Art',
        description: 'Fridge magnets, wall clocks, and decor pieces crafted with delicate paper strips.',
        image: '/quilling-category.jpg',
        color: 'from-terracotta/80 to-terracotta/40',
        link: '/quilling',
    },
    {
        id: 'candles',
        title: 'The Candle Collection',
        subtitle: 'Hand-Poured Aromatics',
        description: 'Soy wax candles in handmade ceramic vessels, infused with natural fragrances.',
        image: '/candle-category.jpg',
        color: 'from-sage/80 to-sage/40',
        link: '/candles',
    },
];

export default function CategorySplit() {
    return (
        <section className="py-16 md:py-24 px-4 md:px-12 lg:px-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="font-[family-name:var(--font-dancing)] text-3xl md:text-4xl text-terracotta mb-4">
                    Explore Our World
                </h2>
                <p className="text-warm-brown max-w-md mx-auto">
                    Two passions, one vision — bringing handmade beauty into everyday life.
                </p>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {categories.map((category, index) => (
                    <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex-1 group"
                    >
                        <Link href={category.link}>
                            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-lg">
                                {/* Background Image */}
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />

                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-t ${category.color}`} />

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                                    <span className="text-white/80 text-sm font-medium mb-2">
                                        {category.subtitle}
                                    </span>
                                    <h3 className="text-white text-2xl md:text-3xl font-bold mb-3">
                                        {category.title}
                                    </h3>
                                    <p className="text-white/90 text-sm md:text-base mb-4 max-w-xs">
                                        {category.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-white font-medium group-hover:gap-4 transition-all">
                                        <span>Explore</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
