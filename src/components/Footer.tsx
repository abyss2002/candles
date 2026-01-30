'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Instagram, Facebook, Mail, MapPin, Phone, Sparkles } from 'lucide-react';
import Link from 'next/link';

const footerSections = [
    {
        title: 'Quick Links',
        links: [
            { name: 'Home', href: '/' },
            { name: 'Quilling Art', href: '/quilling' },
            { name: 'Scented Candles', href: '/candles' },
            { name: 'About Us', href: '/about' },
        ],
    },
    {
        title: 'Customer Care',
        links: [
            { name: 'Shipping Info', href: '/shipping' },
            { name: 'Returns & Exchange', href: '/returns' },
            { name: 'FAQs', href: '/faqs' },
            { name: 'Contact Us', href: '/contact' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Refund Policy', href: '/refund' },
        ],
    },
];

export default function Footer() {
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (title: string) => {
        setOpenSection(openSection === title ? null : title);
    };

    return (
        <footer className="bg-deep-brown text-white">
            {/* Newsletter Section */}
            <div className="px-4 md:px-12 lg:px-24 py-12 border-b border-white/10">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="font-[family-name:var(--font-dancing)] text-3xl md:text-4xl mb-4">
                        Join Our Community
                    </h3>
                    <p className="text-white/70 mb-6 max-w-md mx-auto">
                        Get exclusive offers, new product alerts, and behind-the-scenes stories.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-terracotta"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-terracotta rounded-full font-medium hover:bg-terracotta/90"
                        >
                            Subscribe
                        </motion.button>
                    </form>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="px-4 md:px-12 lg:px-24 py-12">
                {/* Desktop: 4-column grid */}
                <div className="hidden md:grid md:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-6 h-6 text-terracotta" />
                            <span className="font-[family-name:var(--font-dancing)] text-2xl">
                                Handcrafted Joy
                            </span>
                        </Link>
                        <p className="text-white/70 text-sm mb-4">
                            Bringing handmade beauty into everyday life through intricate quilling
                            and aromatic candles.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-terracotta transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-terracotta transition-colors">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-terracotta transition-colors">
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h4 className="font-semibold mb-4">{section.title}</h4>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-white/70 hover:text-terracotta text-sm transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Mobile: Accordion */}
                <div className="md:hidden">
                    {/* Brand */}
                    <div className="mb-8 text-center">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <Sparkles className="w-6 h-6 text-terracotta" />
                            <span className="font-[family-name:var(--font-dancing)] text-2xl">
                                Handcrafted Joy
                            </span>
                        </Link>
                        <p className="text-white/70 text-sm mb-4">
                            Bringing handmade beauty into everyday life.
                        </p>
                        <div className="flex justify-center gap-3">
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-terracotta transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-terracotta transition-colors">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-terracotta transition-colors">
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Accordion Sections */}
                    {footerSections.map((section) => (
                        <div key={section.title} className="border-t border-white/10">
                            <button
                                onClick={() => toggleSection(section.title)}
                                className="w-full flex items-center justify-between py-4 text-left"
                            >
                                <span className="font-semibold">{section.title}</span>
                                <motion.div
                                    animate={{ rotate: openSection === section.title ? 180 : 0 }}
                                >
                                    <ChevronDown className="w-5 h-5" />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {openSection === section.title && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <ul className="pb-4 space-y-2">
                                            {section.links.map((link) => (
                                                <li key={link.name}>
                                                    <Link
                                                        href={link.href}
                                                        className="text-white/70 hover:text-terracotta text-sm transition-colors"
                                                    >
                                                        {link.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Contact Info */}
                <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 text-white/60 text-sm">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                            <span className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Guwahati, India
                            </span>
                            <span className="flex items-center gap-2">
                                <Phone className="w-4 h-4" /> +91 98765 43210
                            </span>
                            <span className="flex items-center gap-2">
                                <Mail className="w-4 h-4" /> hello@handcraftedjoy.in
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="px-4 md:px-12 lg:px-24 py-6 bg-black/20 text-center text-white/50 text-sm">
                © {new Date().getFullYear()} Handcrafted Joy. All rights reserved. Made with ❤️ in India.
            </div>
        </footer>
    );
}
