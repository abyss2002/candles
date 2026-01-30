'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X, ShoppingBag, ArrowRight, Truck, Shield, RotateCcw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    category: 'quilling' | 'candle';
}

const initialCartItems: CartItem[] = [
    { id: 'q1', name: 'Floral Fridge Magnet Set', price: 450, image: '/products/floral-magnet.jpg', quantity: 2, category: 'quilling' },
    { id: 'c1', name: 'Vanilla Bean Candle', price: 650, image: '/products/vanilla-candle.jpg', quantity: 1, category: 'candle' },
    { id: 'q3', name: 'Peacock Wall Art', price: 1800, image: '/products/peacock-art.jpg', quantity: 1, category: 'quilling' },
];

const benefits = [
    { icon: Truck, text: 'Free shipping on orders above ₹999' },
    { icon: Shield, text: 'Secure payment gateway' },
    { icon: RotateCcw, text: '7-day easy returns' },
];

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

    const updateQuantity = (id: string, delta: number) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const removeItem = (id: string) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 999 ? 0 : 99;
    const total = subtotal + shipping;

    return (
        <main className="min-h-screen bg-cream">
            <Navbar />

            <div className="pt-24 pb-16 px-4 md:px-12 lg:px-24">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-[family-name:var(--font-dancing)] text-4xl md:text-5xl text-deep-brown mb-8"
                >
                    Your Cart
                </motion.h1>

                {cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <ShoppingBag className="w-16 h-16 text-beige mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-deep-brown mb-2">Your cart is empty</h2>
                        <p className="text-warm-brown mb-6">Looks like you haven&apos;t added anything yet.</p>
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-terracotta text-white rounded-full font-medium"
                            >
                                Continue Shopping
                            </motion.button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items */}
                        <div className="flex-1">
                            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                                <AnimatePresence>
                                    {cartItems.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 md:p-6 ${index !== cartItems.length - 1 ? 'border-b border-beige' : ''
                                                }`}
                                        >
                                            {/* Product Image */}
                                            <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1">
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.category === 'quilling' ? 'bg-terracotta/10 text-terracotta' : 'bg-sage/10 text-sage'
                                                    }`}>
                                                    {item.category === 'quilling' ? 'Quilling Art' : 'Candle'}
                                                </span>
                                                <h3 className="font-semibold text-deep-brown mt-1">{item.name}</h3>
                                                <p className="text-warm-brown">₹{item.price}</p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-beige hover:border-terracotta hover:text-terracotta"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-semibold text-deep-brown">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-beige hover:border-terracotta hover:text-terracotta"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Item Total */}
                                            <div className="text-right">
                                                <p className="font-bold text-deep-brown">₹{item.price * item.quantity}</p>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 text-warm-brown hover:text-red-500"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Benefits */}
                            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-2 text-warm-brown text-sm">
                                        <benefit.icon className="w-4 h-4 text-terracotta" />
                                        <span>{benefit.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-96">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-md p-6 sticky top-24"
                            >
                                <h2 className="font-semibold text-xl text-deep-brown mb-6">Order Summary</h2>

                                <div className="space-y-3 text-warm-brown">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                        <span>₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className={shipping === 0 ? 'text-green-600' : ''}>
                                            {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                        </span>
                                    </div>
                                    {subtotal < 999 && (
                                        <p className="text-xs text-terracotta">
                                            Add ₹{999 - subtotal} more for free shipping!
                                        </p>
                                    )}
                                </div>

                                <div className="border-t border-beige my-4 pt-4">
                                    <div className="flex justify-between font-bold text-deep-brown text-lg">
                                        <span>Total</span>
                                        <span>₹{total}</span>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 bg-terracotta text-white rounded-full font-semibold flex items-center justify-center gap-2 mt-4"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>

                                <Link href="/" className="block text-center text-terracotta mt-4 hover:underline">
                                    Continue Shopping
                                </Link>

                                {/* Promo Code */}
                                <div className="mt-6 pt-6 border-t border-beige">
                                    <label className="text-sm text-warm-brown block mb-2">Have a promo code?</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter code"
                                            className="flex-1 px-4 py-2 border border-beige rounded-full text-sm focus:outline-none focus:border-terracotta"
                                        />
                                        <button className="px-4 py-2 bg-beige text-warm-brown rounded-full text-sm hover:bg-warm-brown hover:text-white">
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
