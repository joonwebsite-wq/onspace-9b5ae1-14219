import { useState, useEffect } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-government-solar.jpg';

export function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 12,
    minutes: 30,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const scrollToApply = () => {
    const element = document.getElementById('apply');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-gradient-to-br from-navy via-navy-light to-navy">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 opacity-10">
        <img src={heroImage} alt="Government Solar" className="w-full h-full object-cover" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-saffron/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-indiaGreen/20 rounded-full blur-3xl"></div>

      <div className="container-custom px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Government Badge */}
          <div className="inline-flex items-center gap-2 bg-indiaGreen text-white px-6 py-3 rounded-full mb-6 shadow-lg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="font-bold text-sm">GOVERNMENT LINKED PROJECT</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            State & District Level Government Project
            <span className="block text-saffron mt-3 text-4xl md:text-6xl lg:text-7xl">PM Surya Ghar Muft Bijli Yojana</span>
            <span className="block text-white mt-2 text-2xl md:text-4xl lg:text-5xl">Recruitment for Vendors 2026</span>
          </h1>

          {/* Hindi Subheadline */}
          <p className="text-2xl md:text-3xl text-saffron mb-8 font-bold">
            राज्य एवं जिला स्तर प्रोजेक्ट भर्ती 2026
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
              <p className="text-saffron text-2xl font-bold mb-1">₹80,000</p>
              <p className="text-white text-sm">Salary Up To</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
              <p className="text-saffron text-2xl font-bold mb-1">6 States</p>
              <p className="text-white text-sm">Work in Your State</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
              <p className="text-saffron text-2xl font-bold mb-1">Limited</p>
              <p className="text-white text-sm">Vacancies</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
              <p className="text-saffron text-2xl font-bold mb-1">24/7</p>
              <p className="text-white text-sm">WhatsApp Support</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button onClick={scrollToApply} className="cta-button text-lg">
              APPLY NOW
              <ArrowRight className="inline ml-2" size={20} />
            </button>
            <a
              href="https://wa.me/917073741421"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-button text-lg justify-center"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Countdown Timer */}
          <div className="bg-red-600/90 backdrop-blur-sm border border-red-500 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="text-white" size={24} />
              <p className="text-white font-bold text-lg">Application Deadline</p>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-white">{timeLeft.days}</p>
                <p className="text-sm text-white/80">Days</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</p>
                <p className="text-sm text-white/80">Hours</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</p>
                <p className="text-sm text-white/80">Minutes</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</p>
                <p className="text-sm text-white/80">Seconds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}