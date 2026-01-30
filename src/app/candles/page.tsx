'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Filter, Flame, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import NotifyModal from '@/components/NotifyModal';
import { useToast } from '@/components/Toast';
import { getProducts } from '@/lib/api/products';
import { createStockRequest } from '@/lib/api/custom-orders';
import type { Product, CartItem } from '@/lib/types';

const fragranceCategories = ['All', 'Floral', 'Woody', 'Fresh', 'Spicy', 'Sweet', 'Citrus'];

export default function CandlesPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const toast = useToast();

    useEffect(() => {
        async function loadProducts() {
            const data = await getProducts('candle');
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

    const filteredProducts = activeFilter === 'All'
        ? products
        : products.filter(p => p.fragrance_type?.toLowerCase() === activeFilter.toLowerCase());

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

            {/* Fragrance Filters */}
            <section className="px-4 md:px-12 lg:px-24 py-8">
                <div className="flex items-center gap-4 mb-6">
                    <Filter className="w-5 h-5 text-sage" />
                    <span className="text-deep-brown font-medium">Filter by fragrance:</span>
                </div>
                <div className="flex flex-wrap gap-3">
                    {fragranceCategories.map((cat) => (
                        <motion.button
                            key={cat}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === cat
                                ? 'bg-sage text-white'
                                : 'bg-white text-warm-brown border border-beige hover:border-sage'
                                }`}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* Products Grid */}
            <section className="px-4 md:px-12 lg:px-24 pb-16">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-sage animate-spin" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <Flame className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl text-deep-brown mb-2">No candles found</h3>
                        <p className="text-warm-brown">Try a different fragrance filter.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
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
                            <h2 className="font-[family-name:var(--font-dancing)] text-3xl text-sage mb-4">
                                Candle Care Tips
                            </h2>
                            <ul className="space-y-3 text-warm-brown">
                                <li className="flex items-start gap-3">
                                    <Flame className="w-5 h-5 text-gold-accent flex-shrink-0 mt-1" />
                                    <span>First burn should last until the wax pool reaches the edges</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Flame className="w-5 h-5 text-gold-accent flex-shrink-0 mt-1" />
                                    <span>Trim wick to 1/4 inch before each lighting</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Flame className="w-5 h-5 text-gold-accent flex-shrink-0 mt-1" />
                                    <span>Keep away from drafts for an even burn</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Flame className="w-5 h-5 text-gold-accent flex-shrink-0 mt-1" />
                                    <span>Never burn for more than 4 hours at a time</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
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
