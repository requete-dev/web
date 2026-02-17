import { ArchitectureSection } from "@/components/home/ArchitectureSection";
import { CTASection } from "@/components/home/CTASection";
import { FeatureSection } from "@/components/home/FeatureSection";
import { HeroSection } from "@/components/home/HeroSection";
import { IDEShowcase } from "@/components/home/IDEShowcase";
import { TechLogosBar } from "@/components/home/TechLogosBar";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TechLogosBar />
      <FeatureSection />
      <ArchitectureSection />
      <IDEShowcase />
      <CTASection />
    </>
  );
}
