'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { getAllProducts, hardDeleteProduct, updateStock } from '@/lib/api/products';
import type { Product } from '@/lib/types';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'candle' | 'quilling'>('all');
    const toast = useToast();

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
        setLoading(false);
    }

    async function handleDelete(id: string, name: string) {
        if (!confirm(`Are you sure you want to permanently delete "${name}"? This cannot be undone.`)) return;

        const success = await hardDeleteProduct(id);
        if (success) {
            setProducts(products.filter(p => p.id !== id));
            toast.success('Product deleted successfully');
        } else {
            toast.error('Failed to delete product. Please try again.');
        }
    }

    async function handleStockChange(id: string, newStock: number) {
        await updateStock(id, newStock);
        setProducts(products.map(p =>
            p.id === id ? { ...p, stock: newStock } : p
        ));
    }

    const filteredProducts = filter === 'all'
        ? products
        : products.filter(p => p.category === filter);

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-deep-brown">Products</h1>
                    <p className="text-warm-brown mt-1">Manage your product catalog</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-warm-brown transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {(['all', 'candle', 'quilling'] as const).map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === cat
                            ? 'bg-terracotta text-white'
                            : 'bg-white text-warm-brown border border-beige hover:border-terracotta'
                            }`}
                    >
                        {cat === 'all' ? 'All Products' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading products...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-8 text-center">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No products found</p>
                        <Link
                            href="/admin/products/new"
                            className="text-terracotta hover:underline mt-2 inline-block"
                        >
                            Add your first product
                        </Link>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <motion.tr
                                    key={product.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-deep-brown">{product.name}</p>
                                                {product.is_bestseller && (
                                                    <span className="text-xs text-terracotta">★ Bestseller</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.category === 'candle'
                                            ? 'bg-sage/20 text-sage'
                                            : 'bg-terracotta/20 text-terracotta'
                                            }`}>
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-deep-brown font-medium">
                                        ₹{product.price}
                                    </td>
                                    <td className="px-6 py-4">
                                        <input
                                            type="number"
                                            value={product.stock}
                                            onChange={(e) => handleStockChange(product.id, parseInt(e.target.value) || 0)}
                                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                                            min="0"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/products/edit?id=${product.id}`}
                                                className="p-2 text-gray-500 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id, product.name)}
                                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
