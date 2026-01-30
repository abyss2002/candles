'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingCart, Palette, TrendingUp } from 'lucide-react';
import { getOrderStats } from '@/lib/api/orders';
import { getPendingCustomOrders } from '@/lib/api/custom-orders';
import { getAllProducts } from '@/lib/api/products';

interface Stats {
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    totalProducts: number;
    pendingCustomOrders: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const [orderStats, products, customOrders] = await Promise.all([
                    getOrderStats(),
                    getAllProducts(),
                    getPendingCustomOrders(),
                ]);

                setStats({
                    ...orderStats,
                    totalProducts: products.length,
                    pendingCustomOrders: customOrders.length,
                });
            } catch (error) {
                console.error('Error loading stats:', error);
            } finally {
                setLoading(false);
            }
        }

        loadStats();
    }, []);

    const statCards = [
        {
            label: 'Total Products',
            value: stats?.totalProducts || 0,
            icon: Package,
            color: 'bg-blue-500',
            href: '/admin/products',
        },
        {
            label: 'Pending Orders',
            value: stats?.pendingOrders || 0,
            icon: ShoppingCart,
            color: 'bg-orange-500',
            href: '/admin/orders',
        },
        {
            label: 'Custom Requests',
            value: stats?.pendingCustomOrders || 0,
            icon: Palette,
            color: 'bg-purple-500',
            href: '/admin/custom-orders',
        },
        {
            label: 'Total Revenue',
            value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: TrendingUp,
            color: 'bg-green-500',
            href: '/admin/orders',
        },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-deep-brown">Dashboard</h1>
                <p className="text-warm-brown mt-1">Welcome back! Here's what's happening.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-deep-brown mt-1">
                                        {loading ? '...' : stat.value}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-deep-brown mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <Link
                        href="/admin/products/add"
                        className="px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-warm-brown transition-colors"
                    >
                        + Add New Product
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage/80 transition-colors"
                    >
                        View Pending Orders
                    </Link>
                    <Link
                        href="/admin/custom-orders"
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                        Review Custom Orders
                    </Link>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-deep-brown mb-2">Order Workflow</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            <span><strong>Pending</strong> - New orders awaiting your review</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span><strong>Approved</strong> - Order accepted, ready to make</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span><strong>Processing</strong> - Product being made</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span><strong>Shipped</strong> - Add tracking link for customer</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-deep-brown mb-2">Tips</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Mark products as "Bestseller" to feature them on the homepage</li>
                        <li>• Set stock to 0 to enable "Request when available" for customers</li>
                        <li>• Add tracking links when shipping to keep customers informed</li>
                        <li>• Review custom orders promptly and provide quotes</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
