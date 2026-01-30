'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Loader2, Palette } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import NotifyModal from '@/components/NotifyModal';
import { useToast } from '@/components/Toast';
import { getProducts } from '@/lib/api/products';
import { createStockRequest } from '@/lib/api/custom-orders';
import type { Product, CartItem } from '@/lib/types';

export default function QuillingPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const toast = useToast();

    useEffect(() => {
        async function loadProducts() {
            const data = await getProducts('quilling');
            setProducts(data);
            setLoading(false);
        }
        loadProducts();
    }, []);

    const handleAddToCart = (product: Product) => {
        const savedCart = localStorage.getItem('cart');
        const cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

        const existingIndex = cart.findIndex(item => item.product.id === product.id);
        if (existingIndex >= 0) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({ product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
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
                        Intricate paper art pieces handcrafted with love and patience.
                        Each piece tells a unique story through delicate swirls and curves.
                    </motion.p>
                </div>
            </section>

            {/* Custom Order CTA */}
            <section className="px-4 md:px-12 lg:px-24 py-8">
                <div className="bg-gradient-to-r from-terracotta/10 to-gold-accent/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Palette className="w-10 h-10 text-terracotta" />
                        <div>
                            <h3 className="font-semibold text-deep-brown">Looking for something unique?</h3>
                            <p className="text-warm-brown text-sm">Get a custom quilling piece made just for you!</p>
                        </div>
                    </div>
                    <Link
                        href="/custom-order"
                        className="px-6 py-3 bg-terracotta text-white rounded-full font-medium hover:bg-warm-brown transition-colors"
                    >
                        Request Custom Order
                    </Link>
                </div>
            </section>

            {/* Products Grid */}
            <section className="px-4 md:px-12 lg:px-24 pb-16">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-terracotta animate-spin" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl text-deep-brown mb-2">No quilling art available yet</h3>
                        <p className="text-warm-brown">Check back soon for new creations!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <ProductCard
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                    onRequestStock={handleRequestStock}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            <Footer />

            {/* Notify Modal */}
            <NotifyModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onSubmit={handleNotifySubmit}
                productName={selectedProduct?.name || ''}
            />
        </main>
    );
}
