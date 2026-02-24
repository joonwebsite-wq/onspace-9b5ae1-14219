import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, User } from 'lucide-react';

interface StateManager {
  id: string;
  state: string;
  name: string;
  mobile: string;
  photo_url: string;
  email?: string;
  is_active: boolean;
}

export function StateManagersSection() {
  const [managers, setManagers] = useState<StateManager[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    const { data, error } = await supabase
      .from('state_project_managers')
      .select('*')
      .eq('is_active', true)
      .order('state', { ascending: true });

    if (error) {
      console.error('Error fetching managers:', error);
      toast.error('Failed to load state managers');
    } else {
      setManagers(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom text-center">
          <p className="text-gray-600">Loading state managers...</p>
        </div>
      </section>
    );
  }

  if (managers.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="text-saffron text-sm font-bold mb-3 tracking-wide uppercase">
            हमारी टीम से मिलें
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Our State Project Managers
          </h2>
          <div className="w-24 h-1 bg-saffron mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            राज्य परियोजना प्रबंधक जो आपकी सहायता के लिए तैयार हैं
          </p>
          <p className="text-sm text-gray-600">
            Meet the leaders driving solar revolution across six states
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {managers.map((manager) => (
            <div
              key={manager.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-saffron to-orange-500 h-24"></div>

              {/* Photo */}
              <div className="relative -mt-16 text-center px-6">
                <div className="inline-block">
                  <img
                    src={manager.photo_url}
                    alt={manager.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                  <div className="absolute bottom-0 right-0 bg-indiaGreen text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white">
                    <User size={20} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 pt-4 text-center">
                <h3 className="text-xl font-bold text-navy mb-1">{manager.name}</h3>
                <p className="text-sm font-semibold text-white bg-saffron inline-block px-4 py-1 rounded-full mb-4">
                  State Project Manager
                </p>

                {/* State */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <MapPin size={16} className="text-saffron" />
                  <span className="text-navy font-bold">{manager.state}</span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mt-4">
                  <a
                    href={`tel:+91${manager.mobile}`}
                    className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Phone size={16} />
                    <span className="font-semibold text-sm">+91 {manager.mobile}</span>
                  </a>

                  {manager.email && (
                    <a
                      href={`mailto:${manager.email}`}
                      className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Mail size={16} />
                      <span className="font-semibold text-sm truncate">{manager.email}</span>
                    </a>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a
                    href={`https://wa.me/91${manager.mobile.replace(/\D/g, '')}?text=नमस्ते, मुझे PM Surya Ghar योजना के बारे में जानकारी चाहिए`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-indiaGreen hover:bg-indiaGreen-dark text-white font-bold px-6 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Phone size={16} />
                    Contact on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-12 bg-gradient-to-r from-navy to-navy-light text-white rounded-2xl p-8 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-3">
            Need Help? Contact Your State Manager
          </h3>
          <p className="text-gray-200 mb-4">
            सहायता चाहिए? अपने राज्य के प्रबंधक से संपर्क करें
          </p>
          <p className="text-sm text-gray-300">
            Our state managers are available to answer your questions and guide you through the application process
          </p>
        </div>
      </div>
    </section>
  );
}
