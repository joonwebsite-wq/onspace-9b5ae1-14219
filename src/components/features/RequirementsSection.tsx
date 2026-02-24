import { FileText, CreditCard, Mail, Phone, Camera, Bike, Smartphone } from 'lucide-react';

export function RequirementsSection() {
  const documents = [
    { icon: FileText, title: 'Bio Data', description: 'Updated resume/CV' },
    { icon: CreditCard, title: 'Aadhaar Card', description: 'Government ID proof' },
    { icon: Mail, title: 'Email ID', description: 'Active email address' },
    { icon: Phone, title: 'Mobile Number', description: 'Valid contact number' },
    { icon: Camera, title: 'Passport Photo', description: 'Recent photograph (white background)' },
    { icon: Bike, title: 'Two Wheeler + License', description: 'Valid driving license' },
    { icon: Smartphone, title: 'Android 5G Phone', description: 'Smartphone required' },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Required Documents
          </h2>
          <div className="w-24 h-1 bg-saffron mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Please ensure you have the following documents ready before applying
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-5 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-saffron/10 text-saffron rounded-lg flex items-center justify-center">
                <doc.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-navy mb-1">{doc.title}</h3>
                <p className="text-sm text-gray-600">{doc.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
          <p className="text-yellow-800">
            <strong>Important:</strong> All documents must be clear, legible, and valid. Passport size photo should have 
            white background. Maximum file size: 5MB per document.
          </p>
        </div>
      </div>
    </section>
  );
}