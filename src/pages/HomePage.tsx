import { Suspense } from 'react';
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

const LoadingFallback = () => (
  <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
    Loading section...
  </div>
);

export function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <AboutSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <VacanciesSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <RequirementsSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <UrgencyBanner />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <ApplicationSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <ProcessSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <VideoSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <FAQSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <TestimonialsSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <StateManagersSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <LegalDocumentsSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <GallerySection />
      </Suspense>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}