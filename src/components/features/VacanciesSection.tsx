import { Briefcase, MapPin, IndianRupee } from 'lucide-react';

export function VacanciesSection() {
  const vacancies = [
    {
      title: 'State Project Manager',
      requirements: 'Graduate + 5 Years Experience',
      salary: '₹80,000',
      ta: null,
      color: 'from-saffron to-orange-600',
    },
    {
      title: 'District Project Manager',
      requirements: 'Graduate + 2 Years Experience',
      salary: '₹40,000',
      ta: '+ ₹10,000 TA',
      color: 'from-indiaGreen to-green-700',
    },
    {
      title: 'Project Facilitator',
      requirements: 'Graduate',
      salary: '₹27,000',
      ta: '+ ₹3,000 TA',
      color: 'from-navy to-blue-900',
    },
  ];

  const scrollToApply = () => {
    const element = document.getElementById('apply');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="vacancies" className="section-padding bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Job Vacancies Available
          </h2>
          <div className="w-24 h-1 bg-saffron mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Join our mission to transform India's energy landscape. Multiple positions available across 6 states.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {vacancies.map((vacancy, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`bg-gradient-to-r ${vacancy.color} p-6 text-white`}>
                <Briefcase size={40} className="mb-3" />
                <h3 className="text-2xl font-bold mb-2">{vacancy.title}</h3>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-1">Requirements:</p>
                  <p className="text-navy font-semibold">{vacancy.requirements}</p>
                </div>

                <div className="mb-6 bg-gradient-to-r from-saffron/10 to-transparent p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee size={20} className="text-saffron" />
                    <p className="text-sm text-gray-600">Salary Package:</p>
                  </div>
                  <p className="text-3xl font-bold text-navy">{vacancy.salary}</p>
                  {vacancy.ta && (
                    <p className="text-indiaGreen font-semibold mt-1">{vacancy.ta}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <MapPin size={18} />
                  <p className="text-sm">Rajasthan, AP, Telangana, Karnataka, TN, Kerala</p>
                </div>

                <button
                  onClick={scrollToApply}
                  className="w-full bg-saffron hover:bg-saffron-dark text-white font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}