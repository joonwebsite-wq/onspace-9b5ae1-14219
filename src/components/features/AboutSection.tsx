import { Building2, TrendingUp, Globe2, Percent, Newspaper, ExternalLink } from 'lucide-react';

export function AboutSection() {
  const features = [
    {
      icon: Building2,
      title: 'Government Initiative',
      titleHindi: 'सरकारी पहल',
      bgColor: 'bg-orange-50',
      iconColor: 'text-saffron',
    },
    {
      icon: TrendingUp,
      title: 'Direct Bank Subsidy',
      titleHindi: 'सीधे बैंक सब्सिडी',
      bgColor: 'bg-orange-50',
      iconColor: 'text-saffron',
    },
    {
      icon: Globe2,
      title: 'Official Portal Based Process',
      titleHindi: 'आधिकारिक पोर्टल प्रक्रिया',
      bgColor: 'bg-orange-50',
      iconColor: 'text-saffron',
    },
    {
      icon: Percent,
      title: 'Loan Available @ 6.5%',
      titleHindi: '6.5% पर ऋण उपलब्ध',
      bgColor: 'bg-orange-50',
      iconColor: 'text-saffron',
    },
  ];

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-custom max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-saffron text-sm font-bold mb-3 tracking-wide uppercase flex items-center justify-center gap-2">
            <span className="text-saffron">☀</span> ABOUT THE PROJECT
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3">
            About PM Surya Ghar Muft Bijli Yojana
          </h2>
          <p className="text-gray-600 text-sm">
            पीएम सूर्य घर मुफ्त बिजली योजना के बारे में
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Description */}
          <div className="space-y-6">
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                This is a <span className="text-saffron font-semibold">flagship government initiative</span> to provide free electricity to households through solar rooftop installations. The scheme aims to light up millions of homes across India while creating sustainable employment opportunities.
              </p>
              <p className="text-sm text-gray-600">
                यह सोलर रूफटॉप installations के माध्यम से घरों को मुफ्त बिजली प्रदान करने के लिए एक प्रमुख सरकारी पहल है।
              </p>

              <p className="pt-4">
                Eligible homeowners receive subsidy directly into their bank account, with loan support available at <span className="font-semibold text-navy">6.5% interest</span>. This makes solar adoption affordable for middle-class families across the nation.
              </p>
              <p className="text-sm text-gray-600">
                पात्र गृहस्वामियों को उनके बैंक खाते में सीधे सब्सिडी मिलती है और 6.5% ब्याज पर ऋण का समर्थन उपलब्ध है।
              </p>

              <p className="pt-4">
                The mission creates thousands of on-ground jobs— this recruitment drive is your entry into India's clean energy transition. Join us in building a sustainable future while securing a stable career.
              </p>
              <p className="text-sm text-gray-600">
                यह मिशन हजारों ऑन-ग्राउंड नौकरियां बनाता है — यह भर्ती अभियान भारत के स्वच्छ ऊर्जा संक्रमण में आपका प्रवेश द्वार है।
              </p>
            </div>
          </div>

          {/* Right: Feature Cards 2x2 Grid */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.bgColor} border-2 border-orange-100 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 ${feature.bgColor} ${feature.iconColor} rounded-full mb-4 border-2 border-saffron/20`}>
                  <feature.icon size={28} strokeWidth={2.5} />
                </div>
                <h3 className="text-sm font-bold text-navy mb-1 leading-tight">{feature.title}</h3>
                <p className="text-xs text-gray-600">{feature.titleHindi}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Blog/News Section */}
        <div className="mt-16 bg-gradient-to-br from-saffron/5 via-orange-50 to-saffron/5 border-2 border-saffron/20 rounded-2xl p-8 md:p-10">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-saffron text-white p-3 rounded-lg">
              <Newspaper size={28} />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-navy">
                PM Surya Ghar: Muft Bijli Yojana Rajasthan
              </h3>
              <p className="text-saffron font-semibold text-sm">राजस्थान के निवासियों के लिए विशेष सब्सिडी</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-5 text-gray-700 leading-relaxed">
            <p className="text-lg font-semibold text-navy">
              भारत सरकार और राजस्थान सरकार की महत्वाकांक्षी योजना - हर महीने <span className="text-saffron">300 यूनिट तक मुफ्त बिजली</span> पाएं!
            </p>

            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-saffron">
              <h4 className="font-bold text-navy text-xl mb-4">💰 कुल सब्सिडी ₹95,000 तक</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-saffron text-xl">✓</span>
                  <span><strong className="text-navy">₹78,000</strong> - केंद्र सरकार द्वारा</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indiaGreen text-xl">✓</span>
                  <span><strong className="text-navy">₹17,000</strong> - राजस्थान सरकार द्वारा अतिरिक्त सब्सिडी + <strong>Free Smart Meter</strong></span>
                </li>
              </ul>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-5 text-center shadow-md border-t-4 border-saffron">
                <p className="text-3xl font-bold text-saffron mb-2">1.1 kW</p>
                <p className="text-sm text-gray-600">150 यूनिट/माह मुफ्त बिजली</p>
              </div>
              <div className="bg-white rounded-lg p-5 text-center shadow-md border-t-4 border-indiaGreen">
                <p className="text-3xl font-bold text-indiaGreen mb-2">2 kW</p>
                <p className="text-sm text-gray-600">200 यूनिट/माह मुफ्त बिजली</p>
              </div>
              <div className="bg-white rounded-lg p-5 text-center shadow-md border-t-4 border-navy">
                <p className="text-3xl font-bold text-navy mb-2">3 kW+</p>
                <p className="text-sm text-gray-600">300 यूनिट/माह मुफ्त बिजली</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy text-lg mb-3">📋 पात्रता (Eligibility)</h4>
              <ul className="space-y-2 text-gray-700 grid md:grid-cols-2 gap-2">
                <li className="flex items-center gap-2">
                  <span className="text-saffron">✓</span> पक्का घर (Permanent House)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-saffron">✓</span> बिजली कनेक्शन (Electricity Connection)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-saffron">✓</span> बैंक खाता (Bank Account)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-saffron">✓</span> आधार कार्ड (Aadhaar Card)
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-navy text-lg mb-3">📄 आवश्यक दस्तावेज़ (Required Documents)</h4>
              <div className="grid md:grid-cols-2 gap-3 text-gray-700">
                <p>• आधार कार्ड (Aadhaar Card)</p>
                <p>• बिजली बिल (Electricity Bill)</p>
                <p>• बैंक पासबुक (Bank Passbook)</p>
                <p>• पासपोर्ट साइज़ फोटो (Photo)</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="https://pmsuryaghar.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button inline-flex items-center justify-center gap-2"
              >
                आधिकारिक पोर्टल पर आवेदन करें
                <ExternalLink size={18} />
              </a>
              <a
                href="https://rajasthanlink.com/VanuDetails/jaipur/yojana/132436/pm-surya-ghar-muft-bijli-yojana-rajasthan"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indiaGreen hover:bg-indiaGreen-dark text-white font-bold px-8 py-4 rounded-lg transition-all inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                राजस्थान पात्रता चेक करें
                <ExternalLink size={18} />
              </a>
            </div>

            <div className="bg-gradient-to-r from-saffron to-red-600 text-white rounded-xl p-6 text-center shadow-lg">
              <p className="text-2xl font-bold mb-2">⚡ आज ही आवेदन करें और ₹0 बिजली बिल का लाभ उठाएं!</p>
              <p className="text-sm opacity-90">Join India's Clean Energy Revolution with PM Surya Ghar</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}