import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is PM Surya Ghar Muft Bijli Yojana?',
      answer: 'PM Surya Ghar Muft Bijli Yojana is a government initiative to promote rooftop solar installations with direct subsidy and loan support at 6.5% interest rate.',
    },
    {
      question: 'Which states are covered under this recruitment?',
      answer: 'This recruitment covers 6 states: Rajasthan, Andhra Pradesh, Telangana, Karnataka, Tamil Nadu, and Kerala.',
    },
    {
      question: 'What are the minimum qualifications required?',
      answer: 'Minimum graduation is required for all positions. State Project Manager needs 5+ years experience, District Manager needs 2+ years, and Project Facilitator needs fresh graduates.',
    },
    {
      question: 'Is there any application fee?',
      answer: 'No, there is no application fee. The application process is completely free of cost.',
    },
    {
      question: 'What is the salary structure?',
      answer: 'State Project Manager: ₹80,000, District Manager: ₹40,000 + ₹10,000 TA, Project Facilitator: ₹27,000 + ₹3,000 TA.',
    },
    {
      question: 'How will I be contacted after applying?',
      answer: 'Shortlisted candidates will be contacted via email and phone within 7-10 working days. You can also check status on WhatsApp.',
    },
    {
      question: 'Do I need to have a two-wheeler?',
      answer: 'Yes, having a two-wheeler with a valid driving license is mandatory as field visits are part of the job role.',
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Frequently Asked Questions
          </h2>
          <div className="w-24 h-1 bg-saffron mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Find answers to common questions about the recruitment process
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors text-left"
              >
                <span className="font-semibold text-navy pr-4">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-saffron transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 bg-gray-50">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}