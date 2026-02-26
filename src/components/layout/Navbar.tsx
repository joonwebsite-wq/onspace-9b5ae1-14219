import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '@/assets/logo.png';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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
      className={`fixed md:top-0 bottom-0 md:bottom-auto left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container-custom px-4">
        <div className="flex md:flex-row flex-col-reverse md:items-center justify-between md:h-20 h-auto py-3 md:py-0">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="hidden md:flex items-center gap-3">
            <img src={logo} alt="Meri Pahal" className="h-14 w-14 object-contain" />
            <div className="text-left">
              <p className="text-sm font-bold text-navy">Meri Pahal</p>
              <p className="text-xs text-gray-600">Fast Help Artists Welfare</p>
            </div>
          </button>

          {/* Mobile Apply Button - Centered */}
          <button
            onClick={() => scrollToSection('apply')}
            disabled={!isHomePage}
            className="md:hidden w-full cta-button !py-3 !text-base font-bold mb-2"
          >
            Apply Now / अभी आवेदन करें
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-navy hover:text-saffron font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className="text-navy hover:text-saffron font-medium transition-colors"
            >
              Job Portal
            </Link>
            <button
              onClick={() => scrollToSection('about')}
              disabled={!isHomePage}
              className="text-navy hover:text-saffron font-medium transition-colors disabled:opacity-50"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('vacancies')}
              disabled={!isHomePage}
              className="text-navy hover:text-saffron font-medium transition-colors disabled:opacity-50"
            >
              Vacancies
            </button>
            <button
              onClick={() => scrollToSection('apply')}
              disabled={!isHomePage}
              className="text-navy hover:text-saffron font-medium transition-colors disabled:opacity-50"
            >
              Apply
            </button>
            <button
              onClick={() => scrollToSection('legal')}
              disabled={!isHomePage}
              className="text-navy hover:text-saffron font-medium transition-colors disabled:opacity-50"
            >
              Legal Docs
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              disabled={!isHomePage}
              className="text-navy hover:text-saffron font-medium transition-colors disabled:opacity-50"
            >
              Gallery
            </button>
            {isHomePage && (
              <button
                onClick={() => scrollToSection('apply')}
                className="cta-button"
              >
                Apply Now
              </button>
            )}
          </div>

          {/* Mobile Quick Links - Hidden on Desktop */}
          <div className="md:hidden flex items-center justify-around w-full gap-2 text-xs">
            <Link
              to="/"
              className="text-navy hover:text-saffron font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className="text-navy hover:text-saffron font-medium transition-colors"
            >
              Jobs
            </Link>
            <button
              onClick={() => scrollToSection('about')}
              disabled={!isHomePage}
              className="text-navy hover:text-saffron font-medium transition-colors disabled:opacity-50"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('vacancies')}
              disabled={!isHomePage}
              className="text-navy hover:text-saffron font-medium transition-colors disabled:opacity-50"
            >
              Vacancies
            </button>
            <button
              onClick={() => scrollToSection('legal')}
              disabled={!isHomePage}
              className="text-navy hover:text-saffron font-medium transition-colors disabled:opacity-50"
            >
              Legal
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              disabled={!isHomePage}
              className="text-navy hover:text-saffron font-medium transition-colors disabled:opacity-50"
            >
              Gallery
            </button>
          </div>
        </div>


      </div>
    </nav>
  );
}
