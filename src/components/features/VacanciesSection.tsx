import { User, MapPin, Map } from 'lucide-react';

export function VacanciesSection() {
  const positions = [
    {
      icon: User,
      title: 'State Project Manager',
      titleHindi: 'राज्य परियोजना प्रबंधक',
      qualification: 'Graduate + 5 Years Experience',
      qualificationHindi: 'स्नातक + 5 वर्ष अनुभव',
      qualificationDetail: '(Marketing & Team Handling)',
      qualificationDetailHindi: 'विपणन + 5 वर्ष अनुभव',
      salary: '₹80,000',
      salaryDetail: '(including TA)',
      ta: '',
      featured: true,
    },
    {
      icon: MapPin,
      title: 'District Project Manager',
      titleHindi: 'जिला परियोजना प्रबंधक',
      qualification: 'Graduate + 2 Years Experience',
      qualificationHindi: 'स्नातक + 2 वर्ष अनुभव',
      qualificationDetail: '',
      qualificationDetailHindi: '',
      salary: '₹40,000',
      salaryDetail: '',
      ta: '+ ₹10,000 TA',
      featured: false,
    },
    {
      icon: Map,
      title: 'Project Facilitator',
      titleHindi: 'परियोजना सहायक',
      qualification: '12th Pass',
      qualificationHindi: '12वीं पास',
      qualificationDetail: '',
      qualificationDetailHindi: '',
      salary: '₹27,000',
      salaryDetail: '',
      ta: '+ ₹3,000 TA',
      featured: false,
    },
  ];

  const scrollToApply = () => {
    const applySection = document.getElementById('apply');
    applySection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="vacancies" className="section-padding bg-gray-50">
      <div className="container-custom max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-saffron text-sm font-bold mb-3 tracking-wide uppercase">
            CAREER OPPORTUNITIES
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3">
            Current Open Positions
          </h2>
          <p className="text-gray-600 text-sm">
            वर्तमान खुली पदों की जानकारी
          </p>
        </div>

        {/* Position Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {positions.map((position, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-navy to-navy-light text-white p-5 relative">
                {position.featured && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-saffron text-white text-xs font-bold px-3 py-1 rounded-full">
                      ⭐ Featured Position
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <position.icon size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold leading-tight">{position.title}</h3>
                    <p className="text-xs text-gray-200">{position.titleHindi}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Qualification */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-saffron">🎓</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">QUALIFICATION</p>
                    <p className="text-sm font-semibold text-navy leading-tight">
                      {position.qualification}
                      {position.qualificationDetail && (
                        <span className="block text-xs text-gray-600 mt-0.5">{position.qualificationDetail}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-600">{position.qualificationHindi}</p>
                  </div>
                </div>

                {/* Salary */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-saffron">₹</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">SALARY</p>
                    <p className="text-2xl font-bold text-saffron leading-tight">
                      {position.salary}
                      {position.salaryDetail && (
                        <span className="block text-xs text-gray-600 font-normal">{position.salaryDetail}</span>
                      )}
                    </p>
                    {position.ta && (
                      <p className="text-sm text-gray-700 mt-1">{position.ta}</p>
                    )}
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={scrollToApply}
                  className="w-full bg-saffron hover:bg-saffron-dark text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Apply Now <span className="text-xs">(अभी आवेदन करें)</span>
                </button>

                {/* WhatsApp Button */}
                <a
                  href="https://wa.me/917073741421"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 border-2 border-saffron text-saffron hover:bg-saffron/5 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  <span>💬</span>
                  <span>Ask on WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
