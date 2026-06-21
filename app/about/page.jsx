import AboutHero from "@/components/about/AboutHero";
import FeaturesGrid from "@/components/about/FeaturesGrid";
import StorySection from "@/components/about/StorySection";
import DesignSection from "@/components/about/DesignSection";
import MissionVision from "@/components/about/MissionVision";
import NewsletterSignup from "@/components/home/NewsletterSignup";
import InstagramFeed from "@/components/home/InstagramFeed";

export const metadata = {
  title: "About | Velora",
  description: "Born from a passion for timeless design and everyday comfort",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <FeaturesGrid />
      <StorySection />
      <DesignSection />
      <MissionVision />
      <NewsletterSignup />
      <InstagramFeed />
    </main>
  );
}