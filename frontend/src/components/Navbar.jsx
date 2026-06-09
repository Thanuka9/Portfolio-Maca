import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      if (location.pathname !== '/') return;

      let current = '';
      const sections = ['hero', 'about', 'services', 'work', 'skills', 'reviews', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = `#${section}`;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate(`/${href}`);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', href);
    }
  };

  const isHome = location.pathname === '/';

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? 'bg-[#050505]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_0_15px_rgba(173,198,255,0.1)] py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center px-5 md:px-16 w-full max-w-[1440px] mx-auto transition-all duration-500">
        <button
          onClick={() => { setMobileOpen(false); navigate('/'); window.scrollTo(0, 0); }}
          className="font-display text-xl md:text-2xl font-bold tracking-tighter text-[#adc6ff] text-glow select-none group justify-self-start"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5">AZEEM NAVEED</span>
        </button>

        <div className="hidden md:flex gap-1 lg:gap-2 items-center justify-self-center">
          {navLinks.map((link) => {
            const isActive = isHome && activeSection === link.href;
            return (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`relative font-display text-sm font-semibold transition-all duration-300 px-3 lg:px-4 py-2 rounded-full ${
                  isActive ? 'text-[#adc6ff]' : 'text-[#c1c6d7] hover:text-[#adc6ff]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-[#adc6ff]/10 border border-[#adc6ff]/20 rounded-full z-[-1]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                {link.label}
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex justify-self-end">
          <button
            onClick={() => handleNavClick('#contact')}
            className="bg-[#4b8eff] text-[#001a41] px-6 py-2.5 rounded-full font-display font-semibold text-sm hover:bg-[#adc6ff] transition-all duration-300 btn-glow hover:-translate-y-0.5"
          >
            Let's Talk
          </button>
        </div>

        <div className="md:hidden flex items-center justify-self-end col-start-3">
          <button
            className="text-[#adc6ff] p-1 transition-transform duration-300 hover:scale-110"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: mobileOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-panel border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {navLinks.map((link) => {
                const isActive = isHome && activeSection === link.href;
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`font-display font-semibold py-3 px-4 rounded-sm transition-all duration-200 text-sm flex items-center justify-between text-left ${
                      isActive
                        ? 'text-[#adc6ff] bg-[#adc6ff]/5 border-l-2 border-[#adc6ff]'
                        : 'text-[#c1c6d7] hover:text-[#adc6ff] hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
              <button
                onClick={() => handleNavClick('#contact')}
                className="mt-4 bg-[#4b8eff] text-[#001a41] px-6 py-3.5 rounded-full font-display font-semibold text-sm text-center hover:bg-[#adc6ff] transition-all btn-glow"
              >
                Let's Talk
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
