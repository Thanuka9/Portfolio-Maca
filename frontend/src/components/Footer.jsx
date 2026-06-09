import { ArrowUp, MessageCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { site } from '../config/site';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { label: 'Upwork', href: site.social.upwork },
  { label: 'WhatsApp', href: site.social.whatsapp, isWhatsApp: true },
  { label: 'Email', href: `mailto:${site.email}` },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
];

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (href) => {
    if (location.pathname !== '/') {
      navigate(`/${href}`);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', href);
    }
  };

  return (
    <footer className="pt-20 pb-10 px-5 md:px-16">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
        <div className="md:col-span-5">
          <div className="font-display text-3xl font-bold tracking-tighter text-[#adc6ff] text-glow mb-4">
            AZEEM NAVEED
          </div>
          <p className="text-[#8b90a0] text-sm leading-relaxed max-w-sm mb-6">
            Professional Video Editor based in Kandy, Sri Lanka. I craft engaging, polished, and visually powerful stories that convert viewers into loyal audiences.
          </p>
          <a href={`mailto:${site.email}`} className="text-[#c1c6d7] hover:text-[#adc6ff] font-mono text-sm transition-colors border-b border-[#414755] pb-1 inline-block">
            {site.email}
          </a>
        </div>

        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 w-full">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs tracking-[0.1em] uppercase text-[#adc6ff]">Explore</span>
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="text-[#c1c6d7] hover:text-[#adc6ff] text-sm transition-colors w-fit"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs tracking-[0.1em] uppercase text-[#adc6ff]">Connect</span>
            {socialLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`text-sm transition-colors w-fit flex items-center gap-1.5 ${
                  link.isWhatsApp
                    ? 'text-[#25d366] hover:text-[#4cdd7f]'
                    : 'text-[#c1c6d7] hover:text-[#adc6ff]'
                }`}
              >
                {link.isWhatsApp && <MessageCircle size={12} />}
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
            <span className="font-mono text-xs tracking-[0.1em] uppercase text-[#adc6ff]">Legal</span>
            {legalLinks.map(link => (
              <Link
                key={link.label}
                to={link.href}
                className="text-[#c1c6d7] hover:text-[#adc6ff] text-sm transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-[#8b90a0]">
        <p>© {new Date().getFullYear()} Azeem Naveed. All rights reserved.</p>

        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#c1c6d7] hover:text-[#adc6ff] hover:bg-white/5 hover:border-[#adc6ff]/50 transition-all group"
          aria-label="Scroll to top"
        >
          <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </footer>
  );
}
