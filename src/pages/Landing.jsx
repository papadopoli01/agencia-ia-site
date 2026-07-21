import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import HowItWorks from '../components/sections/HowItWorks';
import Contact from '../components/sections/Contact';
import Footer from '../components/layout/Footer';
import useLenis from '../hooks/useLenis';

export default function Landing() {
  useLenis();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-void text-ink selection:bg-neon-purple/40">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Contact />
      <Footer />
    </div>
  );
}
