'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Award, Clock, Leaf, Instagram, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const values = [
    {
        icon: Heart,
        title: 'Crafted with Love',
        description: 'Every piece is made by hand with care and attention to detail.',
    },
    {
        icon: Award,
        title: 'Quality Materials',
        description: 'We use premium papers and natural soy wax in all our creations.',
    },
    {
        icon: Clock,
        title: 'Slow Craft',
        description: 'Beautiful things take time. We never rush the creative process.',
    },
    {
        icon: Leaf,
        title: 'Eco-Friendly',
        description: 'Sustainable materials and minimal packaging for a greener planet.',
    },
];

const timeline = [
    { year: '2018', event: 'Started quilling as a hobby during evenings' },
    { year: '2019', event: 'First sale at a local craft fair' },
    { year: '2020', event: 'Began hand-pouring scented candles' },
    { year: '2021', event: 'Launched online store' },
    { year: '2022', event: 'Crossed 500+ happy customers' },
    { year: '2023', event: 'Featured in local artisan magazine' },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-cream">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-24 pb-16 px-4 md:px-12 lg:px-24">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full md:w-1/2"
                    >
                        <span className="text-terracotta font-medium mb-4 block">Our Story</span>
                        <h1 className="font-[family-name:var(--font-dancing)] text-4xl md:text-6xl text-deep-brown mb-6">
                            Hello, I&apos;m Lopamudra
                        </h1>
                        <p className="text-warm-brown text-lg leading-relaxed mb-6">
                            Welcome to my little corner of handmade happiness! I&apos;m an artist based in
                            Guwahati, India, passionate about creating beautiful things with my hands.
                        </p>
                        <p className="text-warm-brown leading-relaxed mb-6">
                            What started as a way to unwind after work has grown into a full-fledged
                            passion. Quilling art found me first — the meditative process of rolling
                            and shaping paper strips into intricate designs became my escape. Then
                            came candle-making, where I could play with fragrances and create little
                            vessels of warmth.
                        </p>
                        <p className="text-warm-brown leading-relaxed">
                            Every piece you see here is made by me, in my small home studio, with
                            love and intention. I hope my creations bring as much joy to your home
                            as they bring to me while making them.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full md:w-1/2"
                    >
                        <div className="relative max-w-md mx-auto">
                            <div className="absolute -top-4 -left-4 w-32 h-32 bg-soft-pink/30 rounded-full blur-2xl" />
                            <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-sage/20 rounded-full blur-2xl" />
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                                <Image
                                    src="/artist-working.jpg"
                                    alt="Lopamudra Chandra - Artist"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 px-4 md:px-12 lg:px-24 bg-beige/30">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-[family-name:var(--font-dancing)] text-3xl md:text-4xl text-terracotta text-center mb-12"
                    >
                        What We Believe In
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-6 rounded-2xl shadow-md text-center"
                            >
                                <div className="w-14 h-14 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <value.icon className="w-7 h-7 text-terracotta" />
                                </div>
                                <h3 className="font-semibold text-deep-brown mb-2">{value.title}</h3>
                                <p className="text-warm-brown text-sm">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-16 px-4 md:px-12 lg:px-24">
                <div className="max-w-3xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-[family-name:var(--font-dancing)] text-3xl md:text-4xl text-terracotta text-center mb-12"
                    >
                        Our Journey
                    </motion.h2>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-beige md:-translate-x-1/2" />

                        {timeline.map((item, index) => (
                            <motion.div
                                key={item.year}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative flex items-center gap-4 mb-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                            >
                                {/* Dot */}
                                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-terracotta rounded-full md:-translate-x-1/2 z-10" />

                                {/* Content */}
                                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                                    <span className="text-terracotta font-bold text-lg">{item.year}</span>
                                    <p className="text-warm-brown">{item.event}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-16 px-4 md:px-12 lg:px-24 bg-stone-100">
                <div className="max-w-2xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-[family-name:var(--font-dancing)] text-3xl md:text-4xl text-terracotta mb-4"
                    >
                        Let&apos;s Connect
                    </motion.h2>
                    <p className="text-warm-brown mb-8">
                        Have questions or want to discuss a custom order? I&apos;d love to hear from you!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.a
                            href="mailto:hello@handcraftedjoy.in"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-terracotta text-white rounded-full font-medium"
                        >
                            <Mail className="w-5 h-5" />
                            Email Me
                        </motion.a>
                        <motion.a
                            href="#"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-terracotta text-terracotta rounded-full font-medium hover:bg-terracotta hover:text-white"
                        >
                            <Instagram className="w-5 h-5" />
                            Follow on Instagram
                        </motion.a>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
