import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategorySplit from '@/components/CategorySplit';
import BestSellers from '@/components/BestSellers';
import AboutArtist from '@/components/AboutArtist';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <Hero />
      <CategorySplit />
      <BestSellers />
      <AboutArtist />
      <Footer />
    </main>
  );
}
