'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import ProductCard from './ProductCard';
import NotifyModal from './NotifyModal';
import { useToast } from './Toast';
import { getBestsellers } from '@/lib/api/products';
import { createStockRequest } from '@/lib/api/custom-orders';
import type { Product, CartItem } from '@/lib/types';

export default function BestSellers() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const toast = useToast();

    useEffect(() => {
        async function loadProducts() {
            const data = await getBestsellers();
            setProducts(data);
            setLoading(false);
        }
        loadProducts();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 320;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const handleAddToCart = (product: Product) => {
        // Get current cart from localStorage
        const savedCart = localStorage.getItem('cart');
        const cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

        // Check if product already in cart
        const existingIndex = cart.findIndex(item => item.product.id === product.id);
        if (existingIndex >= 0) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({ product, quantity: 1 });
        }

        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Show toast
        toast.success(`${product.name} added to cart!`);
    };

    const handleRequestStock = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleNotifySubmit = async (email: string, name: string) => {
        if (!selectedProduct) return;

        const result = await createStockRequest(selectedProduct.id, email, name);
        if (result) {
            toast.success(`We'll notify you at ${email} when ${selectedProduct.name} is back in stock!`);
        } else {
            toast.error('Something went wrong. Please try again.');
        }
        setSelectedProduct(null);
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

                    {/* Navigation Arrows */}
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => scroll('left')}
                            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-deep-brown hover:bg-terracotta hover:text-white transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => scroll('right')}
                            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-deep-brown hover:bg-terracotta hover:text-white transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </motion.div>

                {/* Products Carousel */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-terracotta animate-spin" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 text-warm-brown">
                        <p>No bestsellers available yet. Check back soon!</p>
                    </div>
                ) : (
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-4 -mx-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {products.map((product) => (
                            <div key={product.id} className="flex-shrink-0 w-[280px] md:w-[300px]">
                                <ProductCard
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                    onRequestStock={handleRequestStock}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Notify Modal */}
            <NotifyModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onSubmit={handleNotifySubmit}
                productName={selectedProduct?.name || ''}
            />
        </section>
    );
}
