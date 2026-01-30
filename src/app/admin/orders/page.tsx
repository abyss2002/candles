'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Truck, Eye, Package } from 'lucide-react';
import { getAllOrders, updateOrderStatus, getOrderWithItems } from '@/lib/api/orders';
import type { Order, OrderItem } from '@/lib/types';

const statusColors: Record<Order['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-green-100 text-green-700',
    delivered: 'bg-green-200 text-green-800',
    cancelled: 'bg-gray-100 text-gray-500',
};

const statusLabels: Record<Order['status'], string> = {
    pending: 'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<Order['status'] | 'all'>('all');
    const [selectedOrder, setSelectedOrder] = useState<{ order: Order; items: OrderItem[] } | null>(null);
    const [trackingLink, setTrackingLink] = useState('');
    const [showTrackingModal, setShowTrackingModal] = useState<string | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        setLoading(true);
        const data = await getAllOrders();
        setOrders(data);
        setLoading(false);
    }

    async function handleStatusChange(id: string, status: Order['status']) {
        const success = await updateOrderStatus(id, status);
        if (success) {
            setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
        }
    }

    async function handleAddTracking(id: string) {
        if (!trackingLink.trim()) return;

        const success = await updateOrderStatus(id, 'shipped', trackingLink);
        if (success) {
            setOrders(orders.map(o =>
                o.id === id ? { ...o, status: 'shipped', tracking_link: trackingLink } : o
            ));
            setShowTrackingModal(null);
            setTrackingLink('');
        }
    }

    async function viewOrderDetails(orderId: string) {
        const data = await getOrderWithItems(orderId);
        setSelectedOrder(data);
    }

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(o => o.status === filter);

    return (
        <>
            <div className="p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-deep-brown">Orders</h1>
                    <p className="text-warm-brown mt-1">Manage customer orders and approvals</p>
                </div>

                {/* Status Filters */}
                <div className="flex flex-wrap gap-2">
                    {(['all', 'pending', 'approved', 'processing', 'shipped', 'delivered', 'rejected'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === status
                                ? 'bg-terracotta text-white'
                                : 'bg-white text-warm-brown border border-beige hover:border-terracotta'
                                }`}
                        >
                            {status === 'all' ? 'All Orders' : statusLabels[status]}
                            {status === 'pending' && (
                                <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {orders.filter(o => o.status === 'pending').length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="bg-white p-8 rounded-xl text-center text-gray-500">Loading orders...</div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl text-center">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No orders found</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-6 rounded-xl shadow-sm"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-deep-brown">{order.user_name}</h3>
                                        <p className="text-sm text-gray-500">{order.user_email}</p>
                                        {order.user_phone && (
                                            <p className="text-sm text-gray-500">{order.user_phone}</p>
                                        )}
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                            📍 {order.shipping_address}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-terracotta">₹{order.total_amount}</p>
                                        <button
                                            onClick={() => viewOrderDetails(order.id)}
                                            className="text-sm text-sage hover:underline mt-1 flex items-center gap-1 ml-auto"
                                        >
                                            <Eye className="w-4 h-4" /> View Items
                                        </button>
                                    </div>
                                </div>

                                {/* Order Notes */}
                                {order.notes && (
                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600"><strong>Notes:</strong> {order.notes}</p>
                                    </div>
                                )}

                                {/* Tracking Link */}
                                {order.tracking_link && (
                                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                        <p className="text-sm text-green-700">
                                            <strong>Tracking:</strong>{' '}
                                            <a href={order.tracking_link} target="_blank" rel="noopener noreferrer" className="underline">
                                                {order.tracking_link}
                                            </a>
                                        </p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {order.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusChange(order.id, 'approved')}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                            >
                                                <Check className="w-4 h-4" /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(order.id, 'rejected')}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" /> Reject
                                            </button>
                                        </>
                                    )}
                                    {order.status === 'approved' && (
                                        <button
                                            onClick={() => handleStatusChange(order.id, 'processing')}
                                            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                                        >
                                            Start Processing
                                        </button>
                                    )}
                                    {order.status === 'processing' && (
                                        <button
                                            onClick={() => setShowTrackingModal(order.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage/80"
                                        >
                                            <Truck className="w-4 h-4" /> Add Tracking & Ship
                                        </button>
                                    )}
                                    {order.status === 'shipped' && (
                                        <button
                                            onClick={() => handleStatusChange(order.id, 'delivered')}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            <Check className="w-4 h-4" /> Mark Delivered
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Tracking Link Modal */}
            {showTrackingModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-deep-brown mb-4">Add Tracking Link</h3>
                        <input
                            type="url"
                            value={trackingLink}
                            onChange={(e) => setTrackingLink(e.target.value)}
                            placeholder="https://tracking.example.com/..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta mb-4"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleAddTracking(showTrackingModal)}
                                className="flex-1 py-2 bg-terracotta text-white rounded-lg hover:bg-warm-brown"
                            >
                                Save & Ship
                            </button>
                            <button
                                onClick={() => {
                                    setShowTrackingModal(null);
                                    setTrackingLink('');
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-deep-brown">Order Items</h3>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {selectedOrder.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-deep-brown">{item.product_name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-terracotta">₹{item.product_price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                            <span className="font-semibold">Total</span>
                            <span className="text-xl font-bold text-terracotta">₹{selectedOrder.order.total_amount}</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
