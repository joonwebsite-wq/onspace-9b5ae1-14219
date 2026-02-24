import { CheckCircle, FileCheck, UserCheck, Award } from 'lucide-react';

export function ProcessSection() {
  const steps = [
    {
      icon: FileCheck,
      title: 'Step 1: Apply',
      description: 'Fill the application form with all required documents',
      color: 'bg-blue-500',
    },
    {
      icon: CheckCircle,
      title: 'Step 2: Verification',
      description: 'Our team will verify your credentials and documents',
      color: 'bg-indiaGreen',
    },
    {
      icon: UserCheck,
      title: 'Step 3: Interview',
      description: 'Shortlisted candidates will be called for interview',
      color: 'bg-saffron',
    },
    {
      icon: Award,
      title: 'Step 4: Appointment',
      description: 'Selected candidates will receive appointment letter',
      color: 'bg-navy',
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-navy to-navy-light text-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Selection Process
          </h2>
          <div className="w-24 h-1 bg-saffron mx-auto mb-6"></div>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Simple and transparent 4-step selection process
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-20 h-20 ${step.color} text-white rounded-full mb-4 shadow-lg`}>
                  <step.icon size={36} />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-200 text-sm leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-white/30"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}