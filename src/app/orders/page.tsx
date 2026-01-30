'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, Clock, XCircle, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getOrdersByEmail } from '@/lib/api/orders';
import { getCustomOrdersByEmail } from '@/lib/api/custom-orders';
import type { Order, CustomOrder } from '@/lib/types';

const orderStatusInfo: Record<Order['status'], { icon: React.ReactNode; color: string; label: string }> = {
    pending: { icon: <Clock className="w-5 h-5" />, color: 'text-yellow-600 bg-yellow-100', label: 'Pending Review' },
    approved: { icon: <CheckCircle className="w-5 h-5" />, color: 'text-blue-600 bg-blue-100', label: 'Approved' },
    rejected: { icon: <XCircle className="w-5 h-5" />, color: 'text-red-600 bg-red-100', label: 'Rejected' },
    processing: { icon: <Package className="w-5 h-5" />, color: 'text-purple-600 bg-purple-100', label: 'Being Made' },
    shipped: { icon: <Truck className="w-5 h-5" />, color: 'text-green-600 bg-green-100', label: 'Shipped' },
    delivered: { icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-700 bg-green-200', label: 'Delivered' },
    cancelled: { icon: <XCircle className="w-5 h-5" />, color: 'text-gray-600 bg-gray-100', label: 'Cancelled' },
};

export default function OrdersPage() {
    const [email, setEmail] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Helper function to ensure URL has proper protocol
    const formatTrackingUrl = (url: string): string => {
        if (!url) return '';
        // If URL doesn't start with http:// or https://, add https://
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `https://${url}`;
        }
        return url;
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        try {
            // Convert email to lowercase for case-insensitive search
            const normalizedEmail = email.trim().toLowerCase();
            const [orderData, customOrderData] = await Promise.all([
                getOrdersByEmail(normalizedEmail),
                getCustomOrdersByEmail(normalizedEmail),
            ]);
            setOrders(orderData);
            setCustomOrders(customOrderData);
            setSearched(true);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-cream">
            <Navbar />

            <section className="pt-28 pb-16 px-4 md:px-12 lg:px-24">
                <div className="max-w-3xl mx-auto">
                    <h1 className="font-[family-name:var(--font-dancing)] text-4xl md:text-5xl text-terracotta mb-4 text-center">
                        Track Your Orders
                    </h1>
                    <p className="text-warm-brown text-center mb-8">
                        Enter your email to view your order history and tracking information
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="bg-white rounded-xl p-6 shadow-sm mb-8">
                        <div className="flex gap-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                required
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                            />
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-3 bg-terracotta text-white font-medium rounded-lg hover:bg-warm-brown disabled:opacity-50 flex items-center gap-2"
                            >
                                <Search className="w-5 h-5" />
                                {loading ? 'Searching...' : 'Search'}
                            </motion.button>
                        </div>
                    </form>

                    {/* Results */}
                    {searched && (
                        <div className="space-y-8">
                            {/* Regular Orders */}
                            <div>
                                <h2 className="text-xl font-semibold text-deep-brown mb-4">Your Orders</h2>
                                {orders.length === 0 ? (
                                    <div className="bg-white rounded-xl p-8 text-center text-warm-brown">
                                        No orders found for this email
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => {
                                            const status = orderStatusInfo[order.status];
                                            return (
                                                <motion.div
                                                    key={order.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-white rounded-xl p-6 shadow-sm"
                                                >
                                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500">
                                                                Order placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric',
                                                                })}
                                                            </p>
                                                            <p className="text-xs text-gray-400 font-mono mt-1">ID: {order.id}</p>
                                                        </div>
                                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.color}`}>
                                                            {status.icon}
                                                            <span className="font-medium">{status.label}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-deep-brown">
                                                                <span className="font-semibold">Total:</span> ₹{order.total_amount}
                                                            </p>
                                                            <p className="text-sm text-warm-brown mt-1">📍 {order.shipping_address}</p>
                                                        </div>
                                                    </div>

                                                    {/* Tracking Link */}
                                                    {order.tracking_link && (
                                                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                                                            <p className="text-sm text-green-700 font-medium mb-2">
                                                                🎉 Your order has been shipped!
                                                            </p>
                                                            <a
                                                                href={formatTrackingUrl(order.tracking_link)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 text-green-600 hover:text-green-800"
                                                            >
                                                                <Truck className="w-4 h-4" />
                                                                Track Your Package
                                                                <ExternalLink className="w-4 h-4" />
                                                            </a>
                                                        </div>
                                                    )}

                                                    {/* Status Messages */}
                                                    {order.status === 'pending' && (
                                                        <p className="mt-4 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg">
                                                            Your order is being reviewed. We'll confirm it soon!
                                                        </p>
                                                    )}
                                                    {order.status === 'approved' && (
                                                        <p className="mt-4 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
                                                            Your order has been approved! We'll start preparing it.
                                                        </p>
                                                    )}
                                                    {order.status === 'processing' && (
                                                        <p className="mt-4 text-sm text-purple-700 bg-purple-50 p-3 rounded-lg">
                                                            Your order is being made with love. It'll be shipped soon!
                                                        </p>
                                                    )}
                                                    {order.status === 'rejected' && (
                                                        <p className="mt-4 text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                                                            Unfortunately, your order couldn't be fulfilled. Please contact us for details.
                                                        </p>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Custom Orders */}
                            {customOrders.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold text-deep-brown mb-4">Custom Order Requests</h2>
                                    <div className="space-y-4">
                                        {customOrders.map((order) => (
                                            <motion.div
                                                key={order.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white rounded-xl p-6 shadow-sm"
                                            >
                                                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">
                                                            Requested on {new Date(order.created_at).toLocaleDateString('en-IN')}
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        order.status === 'quoted' ? 'bg-purple-100 text-purple-700' :
                                                            order.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                                order.status === 'in_progress' ? 'bg-orange-100 text-orange-700' :
                                                                    order.status === 'completed' ? 'bg-green-200 text-green-800' :
                                                                        'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                                                    </span>
                                                </div>

                                                <p className="text-warm-brown mb-4">{order.description}</p>

                                                {order.quoted_price && (
                                                    <div className="p-4 bg-purple-50 rounded-lg">
                                                        <p className="text-purple-700">
                                                            <span className="font-semibold">Quoted Price:</span> ₹{order.quoted_price}
                                                        </p>
                                                        {order.admin_notes && (
                                                            <p className="text-sm text-purple-600 mt-2">{order.admin_notes}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
