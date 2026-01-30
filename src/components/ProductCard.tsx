'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import type { Product } from '@/lib/types';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
    onRequestStock?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onRequestStock }: ProductCardProps) {
    const isOutOfStock = product.stock === 0;

    const handleAddToCart = () => {
        if (onAddToCart && !isOutOfStock) {
            onAddToCart(product);
        }
    };

    const handleRequestStock = () => {
        if (onRequestStock && isOutOfStock) {
            onRequestStock(product);
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            className="group w-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl"
        >
            {/* Image Container */}
            <div className="relative h-[220px] md:h-[250px] overflow-hidden bg-beige">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-warm-brown">
                        <ShoppingCart className="w-12 h-12 opacity-50" />
                    </div>
                )}

                {/* Category Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium text-white ${product.category === 'quilling' ? 'bg-terracotta' : 'bg-sage'
                    }`}>
                    {product.category === 'quilling' ? 'Quilling Art' : 'Candle'}
                </div>

                {/* Out of Stock Badge */}
                {isOutOfStock && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-white">
                        Out of Stock
                    </div>
                )}

                {/* Bestseller Badge */}
                {product.is_bestseller && (
                    <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-gold-accent text-white">
                        ★ Bestseller
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-deep-brown text-lg truncate">{product.name}</h3>
                {product.description && (
                    <p className="text-sm text-warm-brown truncate mt-1">{product.description}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                    <span className="text-gold-accent font-bold text-xl">₹{product.price}</span>
                    {isOutOfStock ? (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleRequestStock}
                            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-300 flex items-center gap-1"
                        >
                            <AlertCircle className="w-4 h-4" />
                            Notify Me
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddToCart}
                            className="px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-full hover:bg-warm-brown flex items-center gap-1"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
