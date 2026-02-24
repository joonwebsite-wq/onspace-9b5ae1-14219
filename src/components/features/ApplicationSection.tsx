import { ApplicationForm } from '@/components/forms/ApplicationForm';
import { MessageCircle } from 'lucide-react';

export function ApplicationSection() {
  return (
    <section id="apply" className="section-padding bg-gray-50">
      <div className="container-custom max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Application Form (2/3 width) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
              {/* Header */}
              <div className="mb-8">
                <p className="text-saffron text-sm font-bold mb-3 tracking-wide uppercase">
                  APPLICATION
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3">
                  Apply Now
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  अभी आवेदन करें
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Fill the form below. Our team will contact you within 24-48 hours.
                </p>
                <p className="text-sm text-gray-600">
                  नीचे फॉर्म भरें। हमारी टीम 24-48 घंटों के भीतर आपसे संपर्क करेगी।
                </p>
              </div>

              {/* Form */}
              <ApplicationForm />
            </div>
          </div>

          {/* Right: Help Card (1/3 width - Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gradient-to-br from-navy to-navy-light text-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle size={32} />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">
                  Need Help?
                </h3>
                <p className="text-sm text-gray-200 mb-2">
                  मदद चाहिए?
                </p>
                
                <p className="text-gray-200 mb-6 leading-relaxed">
                  Have questions about the application? Chat with us on WhatsApp.
                </p>
                <p className="text-xs text-gray-300 mb-6">
                  आवेदन के बारे में प्रश्न हैं? व्हाट्सएप पर हमसे चैट करें।
                </p>

                <a
                  href="https://wa.me/917073741421"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-saffron hover:bg-saffron-dark text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl mb-6"
                >
                  <span className="text-xl">💬</span> Chat on WhatsApp
                </a>

                <div className="border-t border-white/20 pt-6">
                  <p className="text-sm font-semibold text-gray-200 mb-2">
                    Response Time
                  </p>
                  <p className="text-xs text-gray-300 mb-3">
                    प्रतिक्रिया समय
                  </p>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-3xl font-bold">Within 24 hours</p>
                    <p className="text-xs text-gray-300 mt-1">24 घंटे के भीतर</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
