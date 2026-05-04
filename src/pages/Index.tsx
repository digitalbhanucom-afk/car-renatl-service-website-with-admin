import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Fleet from "@/components/Fleet";
import Reviews from "@/components/Reviews";
import Payment from "@/components/Payment";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Fleet />
      <Reviews />
      <Payment />
      <CTA />
      <Footer />
      <FloatingActions />
    </main>
  );
};

export default Index;
