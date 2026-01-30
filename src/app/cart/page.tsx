'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { CartItem } from '@/lib/types';

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    const updateCart = (items: CartItem[]) => {
        setCartItems(items);
        localStorage.setItem('cart', JSON.stringify(items));
    };

    const updateQuantity = (productId: string, delta: number) => {
        const updated = cartItems.map(item => {
            if (item.product.id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        });
        updateCart(updated);
    };

    const removeItem = (productId: string) => {
        const updated = cartItems.filter(item => item.product.id !== productId);
        updateCart(updated);
    };

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    if (!isClient) {
        return null;
    }

    return (
        <main className="min-h-screen bg-cream">
            <Navbar />

            <section className="pt-28 pb-16 px-4 md:px-12 lg:px-24">
                <div className="max-w-4xl mx-auto">
                    <h1 className="font-[family-name:var(--font-dancing)] text-4xl md:text-5xl text-terracotta mb-8">
                        Your Cart
                    </h1>

                    {cartItems.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                            <ShoppingBag className="w-16 h-16 text-beige mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-deep-brown mb-2">Your cart is empty</h2>
                            <p className="text-warm-brown mb-6">Browse our collections and add some beautiful items!</p>
                            <div className="flex gap-4 justify-center">
                                <Link
                                    href="/candles"
                                    className="px-6 py-3 bg-sage text-white rounded-full hover:bg-sage/80 transition-colors"
                                >
                                    Shop Candles
                                </Link>
                                <Link
                                    href="/quilling"
                                    className="px-6 py-3 bg-terracotta text-white rounded-full hover:bg-warm-brown transition-colors"
                                >
                                    Shop Quilling
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item.product.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        className="bg-white rounded-xl p-4 shadow-sm flex gap-4"
                                    >
                                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-beige flex-shrink-0">
                                            {item.product.image_url ? (
                                                <img
                                                    src={item.product.image_url}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-warm-brown">
                                                    <ShoppingBag className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-semibold text-deep-brown">{item.product.name}</h3>
                                            <p className="text-sm text-warm-brown capitalize">{item.product.category}</p>
                                            <p className="text-terracotta font-bold mt-1">₹{item.product.price}</p>
                                        </div>

                                        <div className="flex flex-col items-end justify-between">
                                            <button
                                                onClick={() => removeItem(item.product.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>

                                            <div className="flex items-center gap-2 bg-beige/50 rounded-full p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, -1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl p-6 shadow-sm sticky top-28">
                                    <h2 className="text-xl font-semibold text-deep-brown mb-4">Order Summary</h2>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-warm-brown">
                                            <span>Subtotal ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                                            <span>₹{total}</span>
                                        </div>
                                        <div className="flex justify-between text-warm-brown">
                                            <span>Shipping</span>
                                            <span className="text-sage">Calculated at checkout</span>
                                        </div>
                                        <div className="border-t border-beige pt-3 flex justify-between">
                                            <span className="font-semibold text-deep-brown">Total</span>
                                            <span className="text-xl font-bold text-terracotta">₹{total}</span>
                                        </div>
                                    </div>

                                    <Link
                                        href="/checkout"
                                        className="w-full py-3 bg-terracotta text-white font-medium rounded-full hover:bg-warm-brown flex items-center justify-center gap-2 transition-colors"
                                    >
                                        Proceed to Checkout
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>

                                    <Link
                                        href="/"
                                        className="block text-center text-warm-brown hover:text-terracotta mt-4 text-sm"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
