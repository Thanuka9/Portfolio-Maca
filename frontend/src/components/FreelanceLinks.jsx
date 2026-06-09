import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Briefcase, Mail, MessageCircle } from 'lucide-react';
import { site } from '../config/site';

const platforms = [
  {
    name: 'Upwork',
    description: 'View my full profile, portfolio, work history, and client reviews on Upwork.',
    href: site.social.upwork,
    label: 'Hire Me on Upwork',
    icon: Briefcase,
    color: '#6ee7b7',
    badge: 'Freelance',
  },
  {
    name: 'WhatsApp',
    description: 'Message me directly for quick project inquiries, timelines, and collaboration details.',
    href: site.social.whatsapp,
    label: 'Chat on WhatsApp',
    icon: MessageCircle,
    color: '#25d366',
    badge: 'Direct',
  },
  {
    name: 'Email',
    description: 'Send a detailed project brief, references, and files for a formal project discussion.',
    href: `mailto:${site.email}`,
    label: 'Send an Email',
    icon: Mail,
    color: '#adc6ff',
    badge: 'Professional',
  },
];

export default function FreelanceLinks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="freelance" className="relative py-24 px-5 md:px-16 max-w-[1440px] mx-auto" ref={ref}>
      <hr className="section-divider mb-24" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#8b90a0] border border-[#414755] px-4 py-2 rounded-full">
          Find Me Online
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[#e5e2e1] mt-6 mb-4">
          Let's Work <span className="text-[#adc6ff] text-glow">Together</span>
        </h2>
        <p className="text-[#c1c6d7] max-w-2xl mx-auto">
          You can also find me on freelance platforms. For project inquiries or collaborations,
          use the links below or reach out directly.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platforms.map((platform, i) => (
          <motion.a
            key={platform.name}
            href={platform.href}
            target={platform.href.startsWith('http') ? '_blank' : undefined}
            rel={platform.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            className="glass-panel rounded-xl p-7 flex flex-col gap-4 group video-card no-underline"
            id={`platform-${platform.name.toLowerCase()}`}
          >
            <div className="flex items-center justify-between">
              <span
                className="font-mono text-xs tracking-[0.1em] uppercase px-3 py-1 rounded-full"
                style={{ color: platform.color, border: `1px solid ${platform.color}40`, background: `${platform.color}10` }}
              >
                {platform.badge}
              </span>
              <ExternalLink size={16} className="text-[#414755] group-hover:text-[#adc6ff] transition-colors" />
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ background: `${platform.color}15`, border: `1px solid ${platform.color}30` }}
              >
                <platform.icon size={22} style={{ color: platform.color }} />
              </div>
              <div className="font-display text-xl font-bold text-[#e5e2e1]">{platform.name}</div>
            </div>

            <p className="text-[#8b90a0] text-sm leading-relaxed">{platform.description}</p>

            <div
              className="mt-2 font-mono text-xs tracking-[0.1em] uppercase group-hover:underline transition-all"
              style={{ color: platform.color }}
            >
              {platform.label} →
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
