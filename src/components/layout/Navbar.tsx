import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container-custom px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-3">
            <img src={logo} alt="Meri Pahal" className="h-14 w-14 object-contain" />
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-navy">Meri Pahal</p>
              <p className="text-xs text-gray-600">Fast Help Artists Welfare</p>
            </div>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('about')}
              className="text-navy hover:text-saffron font-medium transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('vacancies')}
              className="text-navy hover:text-saffron font-medium transition-colors"
            >
              Vacancies
            </button>
            <button
              onClick={() => scrollToSection('apply')}
              className="text-navy hover:text-saffron font-medium transition-colors"
            >
              Apply
            </button>
            <button
              onClick={() => scrollToSection('legal')}
              className="text-navy hover:text-saffron font-medium transition-colors"
            >
              Legal Docs
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className="text-navy hover:text-saffron font-medium transition-colors"
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection('apply')}
              className="cta-button"
            >
              Apply Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-navy p-2"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection('about')}
                className="text-navy hover:text-saffron font-medium transition-colors text-left py-2"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('vacancies')}
                className="text-navy hover:text-saffron font-medium transition-colors text-left py-2"
              >
                Vacancies
              </button>
              <button
                onClick={() => scrollToSection('apply')}
                className="text-navy hover:text-saffron font-medium transition-colors text-left py-2"
              >
                Apply
              </button>
              <button
                onClick={() => scrollToSection('legal')}
                className="text-navy hover:text-saffron font-medium transition-colors text-left py-2"
              >
                Legal Docs
              </button>
              <button
                onClick={() => scrollToSection('gallery')}
                className="text-navy hover:text-saffron font-medium transition-colors text-left py-2"
              >
                Gallery
              </button>
              <button
                onClick={() => scrollToSection('apply')}
                className="cta-button text-center"
              >
                Apply Now
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}