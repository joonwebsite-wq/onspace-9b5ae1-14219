import { AlertTriangle, Clock } from 'lucide-react';

export function UrgencyBanner() {
  return (
    <section className="py-8 bg-gradient-to-r from-red-600 to-red-700 text-white">
      <div className="container-custom px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
          <AlertTriangle size={32} className="animate-pulse" />
          <div>
            <h3 className="text-2xl font-bold mb-1">Limited Vacancies Available!</h3>
            <p className="text-red-100">Apply now before positions are filled. First come, first served basis.</p>
          </div>
          <Clock size={32} className="animate-pulse" />
        </div>
      </div>
    </section>
  );
}