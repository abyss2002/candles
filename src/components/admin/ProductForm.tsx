'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, ImageIcon } from 'lucide-react';
import type { ProductFormData } from '@/lib/types';

interface ProductFormProps {
    initialData?: Partial<ProductFormData> & { image_url?: string };
    onSubmit: (data: ProductFormData, imageFile?: File) => Promise<void>;
    isLoading: boolean;
    submitLabel?: string;
}

const fragranceTypes = ['Floral', 'Woody', 'Fresh', 'Spicy', 'Sweet', 'Citrus'];

export default function ProductForm({
    initialData,
    onSubmit,
    isLoading,
    submitLabel = 'Save Product'
}: ProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        name: initialData?.name || '',
        price: initialData?.price || 0,
        description: initialData?.description || '',
        category: initialData?.category || 'candle',
        fragrance_type: initialData?.fragrance_type || '',
        stock: initialData?.stock || 0,
        is_bestseller: initialData?.is_bestseller || false,
        is_active: initialData?.is_active ?? true,
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData, imageFile || undefined);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                </label>
                <div className="flex items-start gap-4">
                    {imagePreview ? (
                        <div className="relative w-40 h-40 rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-40 h-40 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-terracotta transition-colors"
                        >
                            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Upload Image</span>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    {imagePreview && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <Upload className="w-4 h-4 inline mr-2" />
                            Change
                        </button>
                    )}
                </div>
            </div>

            {/* Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                />
            </div>

            {/* Price and Stock Row */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price (₹) *
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                    />
                </div>
                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Quantity
                    </label>
                    <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                    />
                </div>
            </div>

            {/* Category */}
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                </label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                >
                    <option value="candle">Candle</option>
                    <option value="quilling">Quilling Art</option>
                </select>
            </div>

            {/* Fragrance Type (for candles) */}
            {formData.category === 'candle' && (
                <div>
                    <label htmlFor="fragrance_type" className="block text-sm font-medium text-gray-700 mb-1">
                        Fragrance Type
                    </label>
                    <select
                        id="fragrance_type"
                        name="fragrance_type"
                        value={formData.fragrance_type}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                    >
                        <option value="">Select fragrance</option>
                        {fragranceTypes.map(type => (
                            <option key={type} value={type.toLowerCase()}>{type}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                />
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="is_bestseller"
                        checked={formData.is_bestseller}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-terracotta focus:ring-terracotta border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Mark as Bestseller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-terracotta focus:ring-terracotta border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Active (visible to customers)</span>
                </label>
            </div>

            {/* Submit Button */}
            <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-terracotta text-white font-medium rounded-lg hover:bg-warm-brown disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Saving...' : submitLabel}
            </motion.button>
        </form>
    );
}
