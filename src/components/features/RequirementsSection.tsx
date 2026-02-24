import { FileText, CreditCard, Mail, Phone, Camera, Bike, Smartphone, CheckCircle } from 'lucide-react';

export function RequirementsSection() {
  const requirements = [
    { icon: FileText, label: 'Bio Data', labelHindi: 'बायो डाटा' },
    { icon: CreditCard, label: 'Aadhaar Card', labelHindi: 'आधार कार्ड' },
    { icon: Mail, label: 'Email ID', labelHindi: 'ईमेल आईडी' },
    { icon: Phone, label: 'Mobile Number', labelHindi: 'मोबाइल नंबर' },
    { icon: Camera, label: 'Passport Size Photo...', labelHindi: 'पासपोर्ट साइज फोटो' },
    { icon: Bike, label: 'Two Wheeler with...', labelHindi: 'दो पहिया वाहन + लाइसेंस' },
    { icon: Smartphone, label: 'Android 5G Phone', labelHindi: 'एंड्रॉइड 5जी फोन' },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-saffron text-sm font-bold mb-3 tracking-wide uppercase">
            REQUIREMENTS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3">
            Documents Required
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            आवश्यक दस्तावेज़
          </p>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Please keep these documents ready before applying. Incomplete applications may be rejected.
          </p>
          <p className="text-sm text-gray-600">
            आवेदन करने से पहले इन दस्तावेजों को तैयार रखें। अधूरे आवेदन अस्वीकार किए जा सकते हैं।
          </p>
        </div>

        {/* Requirements Grid */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {requirements.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 bg-orange-50 text-saffron rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon size={24} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-navy leading-tight truncate">{item.label}</p>
                  <p className="text-xs text-gray-600">{item.labelHindi}</p>
                </div>
                <div className="flex-shrink-0">
                  <CheckCircle size={20} className="text-green-500" fill="currentColor" />
                  <p className="text-xs text-green-600 font-semibold">Required</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note Box */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong className="text-navy">Note:</strong> All documents should be clear and legible. <strong>Aadhaar card should be linked with your mobile number.</strong>
          </p>
          <p className="text-xs text-gray-600 mt-2">
            नोट: सभी दस्तावेज़ स्पष्ट और पठनीय होने चाहिए। <strong>आधार कार्ड आपके मोबाइल नंबर से लिंक होना चाहिए।</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
