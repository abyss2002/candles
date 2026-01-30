'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductForm from '@/components/admin/ProductForm';
import { createProduct } from '@/lib/api/products';
import type { ProductFormData } from '@/lib/types';

export default function NewProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(data: ProductFormData, imageFile?: File) {
        setIsLoading(true);
        setError(null);

        try {
            const product = await createProduct(data, imageFile);
            if (product) {
                router.push('/admin/products');
            } else {
                setError('Failed to create product. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/admin/products"
                    className="inline-flex items-center gap-2 text-warm-brown hover:text-terracotta mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Products
                </Link>
                <h1 className="text-3xl font-bold text-deep-brown">Add New Product</h1>
                <p className="text-warm-brown mt-1">Fill in the details below to add a new product</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <ProductForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    submitLabel="Create Product"
                />
            </div>
        </div>
    );
}
