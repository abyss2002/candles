import type { Metadata } from "next";
import { Outfit, Dancing_Script } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Handcrafted Joy | Quilling Art & Scented Candles",
  description: "Discover handmade quilling art fridge magnets, clocks, wall decor, and hand-poured scented candles. Unique artisanal creations for your home.",
  keywords: ["quilling art", "handmade candles", "fridge magnets", "wall decor", "artisanal gifts"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${dancingScript.variable} antialiased font-[family-name:var(--font-outfit)]`}
      >
        {children}
      </body>
    </html>
  );
}
