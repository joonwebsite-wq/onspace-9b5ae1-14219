import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { HeroSection } from '@/components/features/HeroSection';
import { AboutSection } from '@/components/features/AboutSection';
import { VacanciesSection } from '@/components/features/VacanciesSection';
import { RequirementsSection } from '@/components/features/RequirementsSection';
import { UrgencyBanner } from '@/components/features/UrgencyBanner';
import { ApplicationSection } from '@/components/features/ApplicationSection';
import { ProcessSection } from '@/components/features/ProcessSection';
import { FAQSection } from '@/components/features/FAQSection';
import { TestimonialsSection } from '@/components/features/TestimonialsSection';
import { StateManagersSection } from '@/components/features/StateManagersSection';
import { LegalDocumentsSection } from '@/components/features/LegalDocumentsSection';
import { GallerySection } from '@/components/features/GallerySection';
import { VideoSection } from '@/components/features/VideoSection';

console.log('[HOMEPAGE] Component loaded');

export function HomePage() {
  console.log('[HOMEPAGE] Rendering');
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <VacanciesSection />
      <RequirementsSection />
      <UrgencyBanner />
      <ApplicationSection />
      <ProcessSection />
      <VideoSection />
      <FAQSection />
      <TestimonialsSection />
      <StateManagersSection />
      <LegalDocumentsSection />
      <GallerySection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}