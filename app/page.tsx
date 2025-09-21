import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { CryptoBenefitsSection } from "@/components/crypto-benefits-section"
import { FeaturesSection } from "@/components/features-section"
import { StatsSection } from "@/components/stats-section"
import { PropertiesSection } from "@/components/properties-section"
import { CryptoTestimonialsSection } from "@/components/crypto-testimonials-section"
import { CommunitySection } from "@/components/community-section"
import { CryptoFooter } from "@/components/crypto-footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <CryptoBenefitsSection />
      <FeaturesSection />
      <StatsSection />
      <PropertiesSection />
      <CryptoTestimonialsSection />
      <CommunitySection />
      <CryptoFooter />
    </main>
  )
}
