'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/Toast';
import { createOrder } from '@/lib/api/orders';
import type { CartItem, OrderFormData } from '@/lib/types';

export default function CheckoutPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const toast = useToast();

    const [formData, setFormData] = useState<OrderFormData>({
        user_email: '',
        user_name: '',
        user_phone: '',
        shipping_address: '',
        notes: '',
    });

    useEffect(() => {
        setIsClient(true);
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const items = JSON.parse(savedCart);
            if (items.length === 0) {
                router.push('/cart');
            }
            setCartItems(items);
        } else {
            router.push('/cart');
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const order = await createOrder(formData, cartItems);
            if (order) {
                // Clear cart
                localStorage.removeItem('cart');
                setOrderId(order.id);
                setOrderPlaced(true);
            } else {
                toast.error('Failed to place order. Please try again.');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    if (!isClient) return null;

    if (orderPlaced) {
        return (
            <main className="min-h-screen bg-cream">
                <Navbar />
                <section className="pt-28 pb-16 px-4 md:px-12 lg:px-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-lg mx-auto bg-white rounded-2xl p-8 text-center shadow-lg"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-deep-brown mb-2">Order Placed Successfully!</h1>
                        <p className="text-warm-brown mb-6">
                            Thank you for your order! We'll review it and get back to you soon.
                        </p>
                        <div className="bg-beige/50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-warm-brown">Order ID</p>
                            <p className="font-mono text-deep-brown">{orderId}</p>
                        </div>
                        <p className="text-sm text-warm-brown mb-6">
                            You can track your order status using your email at the{' '}
                            <Link href="/orders" className="text-terracotta hover:underline">Orders page</Link>
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-terracotta text-white rounded-full hover:bg-warm-brown transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </motion.div>
                </section>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-cream">
            <Navbar />

            <section className="pt-28 pb-16 px-4 md:px-12 lg:px-24">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/cart"
                        className="inline-flex items-center gap-2 text-warm-brown hover:text-terracotta mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Cart
                    </Link>

                    <h1 className="font-[family-name:var(--font-dancing)] text-4xl md:text-5xl text-terracotta mb-8">
                        Checkout
                    </h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-6">
                                <h2 className="text-xl font-semibold text-deep-brown">Your Details</h2>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="user_name"
                                            name="user_name"
                                            value={formData.user_name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="user_email"
                                            name="user_email"
                                            value={formData.user_email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="user_phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="user_phone"
                                        name="user_phone"
                                        value={formData.user_phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-1">
                                        Shipping Address *
                                    </label>
                                    <textarea
                                        id="shipping_address"
                                        name="shipping_address"
                                        value={formData.shipping_address}
                                        onChange={handleChange}
                                        required
                                        rows={3}
                                        placeholder="Street address, City, State, PIN code"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                        Order Notes (optional)
                                    </label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={2}
                                        placeholder="Any special requests or instructions..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                                    />
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Note:</strong> Payment will be arranged after order confirmation.
                                        We'll contact you via email or phone to finalize the order.
                                    </p>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 bg-terracotta text-white font-medium rounded-full hover:bg-warm-brown disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Placing Order...' : 'Place Order'}
                                </motion.button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-28">
                                <h2 className="text-xl font-semibold text-deep-brown mb-4">Order Summary</h2>

                                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div key={item.product.id} className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="text-deep-brown text-sm font-medium">{item.product.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-terracotta font-medium">₹{item.product.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-beige pt-4">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-warm-brown">Subtotal</span>
                                        <span className="text-deep-brown">₹{total}</span>
                                    </div>
                                    <div className="flex justify-between mb-4">
                                        <span className="text-warm-brown">Shipping</span>
                                        <span className="text-sage text-sm">To be calculated</span>
                                    </div>
                                    <div className="flex justify-between border-t border-beige pt-4">
                                        <span className="font-semibold text-deep-brown">Total</span>
                                        <span className="text-xl font-bold text-terracotta">₹{total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
