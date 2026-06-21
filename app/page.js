import HeroBanner from "@/components/home/HeroBanner";
import NewArrivals from "@/components/home/NewArrivals";
import CategoryGrid from "@/components/home/CategoryGrid";
import Bestsellers from "@/components/home/Bestsellers";
import PromoBanner from "@/components/home/PromoBanner";
import SaleBanner from "@/components/home/SaleBanner";
import Testimonials from "@/components/home/Testimonials";
import HowItWorks from "@/components/home/HowItWorks";
import NewsletterSignup from "@/components/home/NewsletterSignup";
import InstagramFeed from "@/components/home/InstagramFeed";

export default function HomePage() {
  return (
    <main>
      <HeroBanner />
      <NewArrivals />
      <CategoryGrid />
      <Bestsellers />
      <div className="px-4 py-12">
        <PromoBanner />
      </div>
      <SaleBanner />
      <Testimonials />
      <HowItWorks />
      <NewsletterSignup />
      <InstagramFeed />
    </main>
  );
}