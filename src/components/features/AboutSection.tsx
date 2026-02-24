import { Shield, CreditCard, Globe, Landmark } from 'lucide-react';

export function AboutSection() {
  const features = [
    {
      icon: Shield,
      title: 'Government Initiative',
      description: 'Official PM Surya Ghar Muft Bijli Yojana Program',
    },
    {
      icon: CreditCard,
      title: 'Direct Bank Transfer',
      description: 'Subsidy transferred directly to bank accounts',
    },
    {
      icon: Globe,
      title: 'Official Portal',
      description: 'Registered on government portal system',
    },
    {
      icon: Landmark,
      title: 'Loan Support',
      description: 'Financial assistance @ 6.5% interest rate',
    },
  ];

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            About PM Surya Ghar Muft Bijli Yojana
          </h2>
          <div className="w-24 h-1 bg-saffron mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            PM Surya Ghar Muft Bijli Yojana is a flagship solar subsidy scheme launched by the Government of India 
            to promote clean energy adoption. This initiative provides financial assistance for rooftop solar installations, 
            offering direct subsidies and loan support at competitive rates.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indiaGreen/10 text-indiaGreen rounded-full mb-4">
                <feature.icon size={32} />
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-saffron/10 via-white to-indiaGreen/10 border-l-4 border-saffron rounded-lg p-8">
          <h3 className="text-2xl font-bold text-navy mb-4">Why Join This Program?</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-indiaGreen text-xl">✓</span>
              <span><strong>Clean Energy Mission:</strong> Contribute to India's sustainable energy goals</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indiaGreen text-xl">✓</span>
              <span><strong>Direct Subsidy:</strong> Government subsidy transferred directly to beneficiary bank accounts</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indiaGreen text-xl">✓</span>
              <span><strong>Affordable Financing:</strong> Loan availability at 6.5% interest rate</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indiaGreen text-xl">✓</span>
              <span><strong>Career Opportunity:</strong> Be part of a nationwide solar revolution with competitive salary packages</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}