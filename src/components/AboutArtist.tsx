'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Quote } from 'lucide-react';

export default function AboutArtist() {
    return (
        <section className="py-16 md:py-24 bg-stone-100">
            <div className="px-4 md:px-12 lg:px-24">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                    {/* Text Content - Slides from Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="w-full md:w-1/2 order-2 md:order-1"
                    >
                        <div className="max-w-lg mx-auto md:mx-0">
                            <span className="inline-flex items-center gap-2 text-terracotta text-sm font-medium mb-4">
                                <Quote className="w-4 h-4" /> Our Story
                            </span>

                            <h2 className="font-[family-name:var(--font-dancing)] text-4xl md:text-5xl text-terracotta mb-6">
                                Meet the Artist
                            </h2>

                            <p className="text-warm-brown text-lg leading-relaxed mb-6">
                                Hi, I&apos;m Lopamudra! What started as a hobby during quiet evenings has
                                blossomed into a passion I&apos;m thrilled to share with you.
                            </p>

                            <p className="text-warm-brown leading-relaxed mb-6">
                                Each quilling piece takes hours of patient work — rolling, shaping,
                                and arranging delicate paper strips into intricate designs. My candles
                                are hand-poured in small batches, using natural soy wax and essential
                                oils to fill your space with warmth.
                            </p>

                            <p className="text-warm-brown leading-relaxed mb-8">
                                Every creation carries a piece of my heart. I believe in slow,
                                intentional crafting — because beautiful things take time.
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center">
                                    <span className="text-2xl">✨</span>
                                </div>
                                <div>
                                    <span className="block font-semibold text-deep-brown">Lopamudra Chandra</span>
                                    <span className="text-sm text-warm-brown">Artist & Founder</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Image Content - Slides from Right */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full md:w-1/2 order-1 md:order-2"
                    >
                        <div className="relative max-w-md mx-auto">
                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-soft-pink/40 rounded-full blur-xl" />
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-sage/30 rounded-full blur-xl" />

                            {/* Main Image */}
                            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                                <Image
                                    src="/artist-working.jpg"
                                    alt="Artist creating quilling art"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Floating Quote Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="absolute bottom-4 left-4 md:-bottom-6 md:-left-12 bg-white p-4 rounded-xl shadow-lg max-w-[180px] md:max-w-[200px]"
                            >
                                <Quote className="w-5 h-5 md:w-6 md:h-6 text-terracotta mb-2" />
                                <p className="text-xs md:text-sm text-deep-brown italic leading-relaxed">
                                    &quot;Handmade isn&apos;t just a process, it&apos;s a promise of uniqueness.&quot;
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
