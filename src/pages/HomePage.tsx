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

export function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header style={{padding: '20px', backgroundColor: '#0B1E2D', color: 'white'}}>
        <h1>PM Surya Ghar Muft Bijli Yojana</h1>
        <p>Recruitment 2026</p>
      </header>
      <main style={{flex: 1, padding: '40px', backgroundColor: '#f5f5f5'}}>
        <p>Loading website... If you see this message, the app is rendering correctly!</p>
      </main>
      <footer style={{padding: '20px', backgroundColor: '#0B1E2D', color: 'white', textAlign: 'center'}}>
        <p>&copy; 2026 Meri Pahal | All Rights Reserved</p>
      </footer>
    </div>
  );
}