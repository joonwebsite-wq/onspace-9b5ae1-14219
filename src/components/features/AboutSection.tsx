import { Building2, TrendingUp, Globe2, Percent } from 'lucide-react';

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
      </div>
    </section>
  );
}