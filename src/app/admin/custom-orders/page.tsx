'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, DollarSign, CheckCircle, X, Palette } from 'lucide-react';
import { getAllCustomOrders, updateCustomOrder } from '@/lib/api/custom-orders';
import type { CustomOrder } from '@/lib/types';

const statusColors: Record<CustomOrder['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    reviewed: 'bg-blue-100 text-blue-700',
    quoted: 'bg-purple-100 text-purple-700',
    accepted: 'bg-green-100 text-green-700',
    in_progress: 'bg-orange-100 text-orange-700',
    completed: 'bg-green-200 text-green-800',
    rejected: 'bg-red-100 text-red-700',
};

const statusLabels: Record<CustomOrder['status'], string> = {
    pending: 'Pending Review',
    reviewed: 'Under Review',
    quoted: 'Quote Sent',
    accepted: 'Accepted',
    in_progress: 'In Progress',
    completed: 'Completed',
    rejected: 'Rejected',
};

export default function CustomOrdersPage() {
    const [orders, setOrders] = useState<CustomOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null);
    const [quotePrice, setQuotePrice] = useState('');
    const [adminNotes, setAdminNotes] = useState('');

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        setLoading(true);
        const data = await getAllCustomOrders();
        setOrders(data);
        setLoading(false);
    }

    async function handleStatusChange(id: string, status: CustomOrder['status']) {
        const success = await updateCustomOrder(id, { status });
        if (success) {
            setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
        }
    }

    async function handleSendQuote() {
        if (!selectedOrder || !quotePrice) return;

        const success = await updateCustomOrder(selectedOrder.id, {
            status: 'quoted',
            quoted_price: parseFloat(quotePrice),
            admin_notes: adminNotes || undefined,
        });

        if (success) {
            setOrders(orders.map(o =>
                o.id === selectedOrder.id
                    ? { ...o, status: 'quoted', quoted_price: parseFloat(quotePrice), admin_notes: adminNotes }
                    : o
            ));
            setSelectedOrder(null);
            setQuotePrice('');
            setAdminNotes('');
        }
    }

    return (
        <>
            <div className="p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-deep-brown">Custom Orders</h1>
                    <p className="text-warm-brown mt-1">Review and quote custom quilling requests</p>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="bg-white p-8 rounded-xl text-center text-gray-500">Loading orders...</div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl text-center">
                            <Palette className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No custom orders yet</p>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-6 rounded-xl shadow-sm"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                                {statusLabels[order.status]}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-deep-brown">{order.user_name}</h3>
                                        <p className="text-sm text-gray-500">{order.user_email}</p>
                                        {order.user_phone && (
                                            <p className="text-sm text-gray-500">{order.user_phone}</p>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        {order.quoted_price && (
                                            <p className="text-2xl font-bold text-terracotta">₹{order.quoted_price}</p>
                                        )}
                                        {order.budget_range && (
                                            <p className="text-sm text-gray-500">Budget: {order.budget_range}</p>
                                        )}
                                        {order.deadline && (
                                            <p className="text-sm text-gray-500">
                                                Deadline: {new Date(order.deadline).toLocaleDateString('en-IN')}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mt-4 p-4 bg-cream rounded-lg">
                                    <h4 className="font-medium text-deep-brown mb-2">Customer Request:</h4>
                                    <p className="text-warm-brown whitespace-pre-wrap">{order.description}</p>
                                </div>

                                {/* Reference Images */}
                                {order.reference_images && order.reference_images.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-medium text-deep-brown mb-2">Reference Images:</h4>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {order.reference_images.map((img, idx) => (
                                                <a
                                                    key={idx}
                                                    href={img}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 hover:opacity-80"
                                                >
                                                    <img src={img} alt={`Reference ${idx + 1}`} className="w-full h-full object-cover" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Admin Notes */}
                                {order.admin_notes && (
                                    <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                                        <p className="text-sm text-purple-700"><strong>Your Notes:</strong> {order.admin_notes}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {order.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setAdminNotes(order.admin_notes || '');
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-warm-brown"
                                            >
                                                <DollarSign className="w-4 h-4" /> Send Quote
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(order.id, 'rejected')}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" /> Decline
                                            </button>
                                        </>
                                    )}
                                    {order.status === 'accepted' && (
                                        <button
                                            onClick={() => handleStatusChange(order.id, 'in_progress')}
                                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                                        >
                                            Start Working
                                        </button>
                                    )}
                                    {order.status === 'in_progress' && (
                                        <button
                                            onClick={() => handleStatusChange(order.id, 'completed')}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Mark Complete
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Quote Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-deep-brown mb-4">Send Quote</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quote Price (₹)
                                </label>
                                <input
                                    type="number"
                                    value={quotePrice}
                                    onChange={(e) => setQuotePrice(e.target.value)}
                                    placeholder="Enter your price"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes for Customer (optional)
                                </label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    rows={3}
                                    placeholder="Any additional details about the quote..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={handleSendQuote}
                                disabled={!quotePrice}
                                className="flex-1 py-2 bg-terracotta text-white rounded-lg hover:bg-warm-brown disabled:opacity-50"
                            >
                                Send Quote
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedOrder(null);
                                    setQuotePrice('');
                                    setAdminNotes('');
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
