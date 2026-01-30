'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, X, ImageIcon, CheckCircle, ArrowLeft, Palette } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/Toast';
import { createCustomOrder } from '@/lib/api/custom-orders';
import type { CustomOrderFormData } from '@/lib/types';

export default function CustomOrderPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [referenceImages, setReferenceImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();

    const [formData, setFormData] = useState<CustomOrderFormData>({
        user_email: '',
        user_name: '',
        user_phone: '',
        description: '',
        budget_range: '',
        deadline: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + referenceImages.length > 5) {
            toast.warning('Maximum 5 reference images allowed');
            return;
        }

        setReferenceImages(prev => [...prev, ...files]);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        setReferenceImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const order = await createCustomOrder(formData, referenceImages);
            if (order) {
                setSubmitted(true);
            } else {
                toast.error('Failed to submit request. Please try again.');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-cream">
                <Navbar />
                <section className="pt-28 pb-16 px-4 md:px-12 lg:px-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-lg mx-auto bg-white rounded-2xl p-8 text-center shadow-lg"
                    >
                        <div className="w-20 h-20 bg-terracotta/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Palette className="w-10 h-10 text-terracotta" />
                        </div>
                        <h1 className="text-2xl font-bold text-deep-brown mb-2">Request Submitted!</h1>
                        <p className="text-warm-brown mb-6">
                            Thank you for your custom order request! We'll review your requirements and get back to you with a quote soon.
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            You can track the status of your request on the{' '}
                            <Link href="/orders" className="text-terracotta hover:underline">Orders page</Link>
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-terracotta text-white rounded-full hover:bg-warm-brown transition-colors"
                        >
                            Back to Home
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
                <div className="max-w-2xl mx-auto">
                    <Link
                        href="/quilling"
                        className="inline-flex items-center gap-2 text-warm-brown hover:text-terracotta mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Quilling Collection
                    </Link>

                    <div className="text-center mb-8">
                        <h1 className="font-[family-name:var(--font-dancing)] text-4xl md:text-5xl text-terracotta mb-4">
                            Custom Quilling Order
                        </h1>
                        <p className="text-warm-brown max-w-lg mx-auto">
                            Have something special in mind? Describe your vision and I'll create a unique quilling piece just for you.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 md:p-8 shadow-sm space-y-6">
                        {/* Contact Details */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-deep-brown">Your Details</h2>

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
                        </div>

                        {/* Project Details */}
                        <div className="space-y-4 pt-4 border-t border-beige">
                            <h2 className="text-lg font-semibold text-deep-brown">Project Details</h2>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Describe Your Vision *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    placeholder="Tell me about the design you have in mind. Include details like size, colors, style, purpose (gift, home decor, etc.), and any specific elements you'd like..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="budget_range" className="block text-sm font-medium text-gray-700 mb-1">
                                        Budget Range
                                    </label>
                                    <select
                                        id="budget_range"
                                        name="budget_range"
                                        value={formData.budget_range}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                                    >
                                        <option value="">Select budget range</option>
                                        <option value="Under ₹500">Under ₹500</option>
                                        <option value="₹500 - ₹1000">₹500 - ₹1000</option>
                                        <option value="₹1000 - ₹2000">₹1000 - ₹2000</option>
                                        <option value="₹2000 - ₹5000">₹2000 - ₹5000</option>
                                        <option value="Above ₹5000">Above ₹5000</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                                        Desired Deadline
                                    </label>
                                    <input
                                        type="date"
                                        id="deadline"
                                        name="deadline"
                                        value={formData.deadline}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Reference Images */}
                        <div className="space-y-4 pt-4 border-t border-beige">
                            <h2 className="text-lg font-semibold text-deep-brown">Reference Images (Optional)</h2>
                            <p className="text-sm text-gray-500">Upload up to 5 images for inspiration</p>

                            <div className="flex flex-wrap gap-3">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                                        <img src={preview} alt={`Reference ${index + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}

                                {imagePreviews.length < 5 && (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-terracotta transition-colors"
                                    >
                                        <Upload className="w-6 h-6 text-gray-400 mb-1" />
                                        <span className="text-xs text-gray-500">Add</span>
                                    </div>
                                )}
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageAdd}
                                className="hidden"
                            />
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 bg-terracotta text-white font-medium rounded-full hover:bg-warm-brown disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Submitting...' : 'Submit Request'}
                        </motion.button>

                        <p className="text-sm text-center text-gray-500">
                            I'll review your request and send you a quote within 2-3 business days.
                        </p>
                    </form>
                </div>
            </section>

            <Footer />
        </main>
    );
}
