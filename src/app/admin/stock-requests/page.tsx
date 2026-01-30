'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Package } from 'lucide-react';
import { getAllStockRequests, updateStockRequestStatus } from '@/lib/api/custom-orders';
import type { StockRequest } from '@/lib/types';

export default function StockRequestsPage() {
    const [requests, setRequests] = useState<(StockRequest & { product_name?: string })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRequests();
    }, []);

    async function loadRequests() {
        setLoading(true);
        const data = await getAllStockRequests();
        setRequests(data);
        setLoading(false);
    }

    async function handleMarkNotified(id: string) {
        const success = await updateStockRequestStatus(id, 'notified');
        if (success) {
            setRequests(requests.map(r => r.id === id ? { ...r, status: 'notified' } : r));
        }
    }

    async function handleMarkFulfilled(id: string) {
        const success = await updateStockRequestStatus(id, 'fulfilled');
        if (success) {
            setRequests(requests.map(r => r.id === id ? { ...r, status: 'fulfilled' } : r));
        }
    }

    const pendingCount = requests.filter(r => r.status === 'pending').length;

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-deep-brown">Stock Requests</h1>
                <p className="text-warm-brown mt-1">
                    Customers waiting for out-of-stock products
                    {pendingCount > 0 && (
                        <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                            {pendingCount} pending
                        </span>
                    )}
                </p>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="bg-white p-8 rounded-xl text-center text-gray-500">Loading requests...</div>
                ) : requests.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No stock requests yet</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Customers can request notifications when out-of-stock items are available
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {requests.map((request) => (
                                    <motion.tr
                                        key={request.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <Package className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <span className="font-medium text-deep-brown">
                                                    {request.product_name || 'Unknown Product'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-deep-brown">{request.user_name}</p>
                                            <p className="text-sm text-gray-500">{request.user_email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-deep-brown">
                                            {request.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(request.created_at).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : request.status === 'notified'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-green-100 text-green-700'
                                                }`}>
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {request.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleMarkNotified(request.id)}
                                                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                                    >
                                                        Mark Notified
                                                    </button>
                                                )}
                                                {request.status === 'notified' && (
                                                    <button
                                                        onClick={() => handleMarkFulfilled(request.id)}
                                                        className="flex items-center gap-1 px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                                                    >
                                                        <Check className="w-3 h-3" /> Fulfilled
                                                    </button>
                                                )}
                                                {request.status === 'fulfilled' && (
                                                    <span className="text-sm text-gray-400">Done</span>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="font-medium text-blue-800 mb-2">How Stock Requests Work</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• When a product is out of stock, customers can request to be notified</li>
                    <li>• When you restock the item, mark requests as "Notified"</li>
                    <li>• After the customer purchases, mark as "Fulfilled"</li>
                </ul>
            </div>
        </div>
    );
}
