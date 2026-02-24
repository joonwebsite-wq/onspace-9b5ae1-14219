import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';

export function UrgencyBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 18,
    minutes: 39,
    seconds: 43,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const scrollToApply = () => {
    const applySection = document.getElementById('apply');
    applySection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-custom max-w-3xl mx-auto">
        <div className="bg-white border-2 border-red-200 rounded-3xl shadow-xl overflow-hidden">
          {/* Warning Header */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b-2 border-red-200 px-8 py-4">
            <div className="flex items-center justify-center gap-2 text-red-600">
              <AlertTriangle size={20} />
              <span className="font-bold text-sm">Limited Time Offer</span>
              <span className="text-xs text-gray-600">(सीमित समय की पेशकश)</span>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3">
              Limited Vacancies — First Come First Serve Basis
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              सीमित रिक्तियां — पहले आओ पहले पाओ के आधार पर
            </p>

            <p className="text-gray-700 mb-3 leading-relaxed">
              Applications are reviewed daily. Secure your spot before the window closes.
            </p>
            <p className="text-sm text-gray-600 mb-8">
              आवेदनों की समीक्षा रोज़ होती है। विंडो बंद होने से पहले अपनी जगह सुरक्षित करें।
            </p>

            {/* Countdown Timer */}
            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-8">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl p-4">
                <div className="text-4xl font-bold text-saffron">{String(timeLeft.days).padStart(2, '0')}</div>
                <div className="text-xs text-gray-600 font-semibold mt-1">Days</div>
                <div className="text-xs text-gray-500">दिन</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl p-4">
                <div className="text-4xl font-bold text-saffron">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-xs text-gray-600 font-semibold mt-1">Hours</div>
                <div className="text-xs text-gray-500">घंटे</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl p-4">
                <div className="text-4xl font-bold text-saffron">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-xs text-gray-600 font-semibold mt-1">Minutes</div>
                <div className="text-xs text-gray-500">मिनट</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl p-4">
                <div className="text-4xl font-bold text-saffron">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-xs text-gray-600 font-semibold mt-1">Seconds</div>
                <div className="text-xs text-gray-500">सेकंड</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={scrollToApply}
                className="bg-saffron hover:bg-saffron-dark text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
              >
                Apply Now <span className="text-sm">(अभी आवेदन करें)</span>
              </button>
              <a
                href="https://wa.me/917073741421"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-saffron text-saffron hover:bg-saffron/5 font-bold py-4 px-8 rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2"
              >
                <span>💬</span>
                Chat on WhatsApp
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-semibold">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-semibold">Fast Response</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-semibold">Verified Process</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
