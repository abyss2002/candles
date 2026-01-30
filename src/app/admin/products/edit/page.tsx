'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductForm from '@/components/admin/ProductForm';
import { getProductById, updateProduct } from '@/lib/api/products';
import type { ProductFormData, Product } from '@/lib/types';

function EditProductContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProduct() {
            if (!productId) return;

            const data = await getProductById(productId);
            if (data) {
                setProduct(data);
            } else {
                setError('Product not found');
            }
            setIsFetching(false);
        }

        loadProduct();
    }, [productId]);

    async function handleSubmit(data: ProductFormData, imageFile?: File) {
        if (!productId) return;

        setIsLoading(true);
        setError(null);

        try {
            const updated = await updateProduct(productId, data, imageFile);
            if (updated) {
                router.push('/admin/products');
            } else {
                setError('Failed to update product. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    if (!productId) {
        return (
            <div className="p-6 lg:p-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    Missing product ID
                </div>
            </div>
        );
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
                <h1 className="text-3xl font-bold text-deep-brown">Edit Product</h1>
                <p className="text-warm-brown mt-1">Update the product details below</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                {isFetching ? (
                    <div className="py-8 text-center text-gray-500">Loading product...</div>
                ) : product ? (
                    <ProductForm
                        initialData={{
                            name: product.name,
                            price: product.price,
                            description: product.description || '',
                            category: product.category,
                            fragrance_type: product.fragrance_type || '',
                            stock: product.stock,
                            is_bestseller: product.is_bestseller,
                            is_active: product.is_active,
                            image_url: product.image_url || undefined,
                        }}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                        submitLabel="Update Product"
                    />
                ) : (
                    <div className="py-8 text-center text-red-500">Product not found</div>
                )}
            </div>
        </div>
    );
}

export default function EditProductPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading editor...</div>}>
            <EditProductContent />
        </Suspense>
    );
}
