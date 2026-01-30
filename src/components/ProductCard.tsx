'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    category: 'quilling' | 'candle';
}

export default function ProductCard({ id, name, price, image, category }: ProductCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            className="group flex-shrink-0 w-[280px] md:w-[300px] bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl snap-center"
        >
            {/* Image Container - 70% of card */}
            <div className="relative h-[220px] md:h-[250px] overflow-hidden bg-beige">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Category Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium text-white ${category === 'quilling' ? 'bg-terracotta' : 'bg-sage'
                    }`}>
                    {category === 'quilling' ? 'Quilling Art' : 'Candle'}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-deep-brown text-lg truncate">{name}</h3>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-gold-accent font-bold text-xl">₹{price}</span>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-full hover:bg-warm-brown"
                    >
                        Add to Cart
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
