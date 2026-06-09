import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Video, Smartphone, Megaphone, Film, Calendar,
  Briefcase, Palette, Volume2, Sparkles, ImageIcon
} from 'lucide-react';

const services = [
  {
    icon: Video,
    title: 'YouTube Video Editing',
    description: 'Clean cuts, pacing, transitions, subtitles, sound balancing, and engaging storytelling for long-form YouTube content.',
    color: '#ff4444',
  },
  {
    icon: Smartphone,
    title: 'Reels / TikTok / Shorts',
    description: 'Fast-paced vertical video editing for Instagram Reels, TikTok, YouTube Shorts, and all social media platforms.',
    color: '#adc6ff',
  },
  {
    icon: Megaphone,
    title: 'Social Media Ads',
    description: 'Professional video ads designed for social media campaigns, product promotions, and brand awareness.',
    color: '#d3bbff',
  },
  {
    icon: Film,
    title: 'Promotional Videos',
    description: 'Clean and polished promotional edits for businesses, brands, products, services, and events.',
    color: '#4b8eff',
  },
  {
    icon: Calendar,
    title: 'Event Highlight Videos',
    description: 'Cinematic highlight edits for weddings, parties, events, business functions, and special occasions.',
    color: '#ffb595',
  },
  {
    icon: Briefcase,
    title: 'Corporate Videos',
    description: 'Professional edits for companies, interviews, training videos, internal content, and business presentations.',
    color: '#6ee7b7',
  },
  {
    icon: Palette,
    title: 'Color Correction',
    description: 'Improving video colors, lighting, contrast, and visual consistency for a cinematic and professional look.',
    color: '#adc6ff',
  },
  {
    icon: Volume2,
    title: 'Audio Cleanup',
    description: 'Improving sound quality, balancing volume levels, reducing noise, and making the final video sound clean.',
    color: '#d3bbff',
  },
  {
    icon: Sparkles,
    title: 'Motion Graphics',
    description: 'Basic animations, text effects, lower thirds, intros, outros, and branded visual elements.',
    color: '#4b8eff',
  },
  {
    icon: ImageIcon,
    title: 'Thumbnail Support',
    description: 'Simple thumbnail design or visual support for YouTube videos and social media content.',
    color: '#ffb595',
  },
];

const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 36,
    scale: 0.82,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 380,
      damping: 18,
      mass: 0.75,
    },
  },
};

const iconVariants = {
  hidden: { scale: 0, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 420, damping: 14, delay: 0.06 },
  },
};

function ServiceCard({ service }) {
  const Icon = service.icon;

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: -8,
        scale: 1.03,
        transition: { type: 'spring', stiffness: 400, damping: 22 },
      }}
      className="service-card glass-panel rounded-lg p-4 md:p-6 group relative overflow-hidden cursor-default h-full"
      style={{ '--service-accent': service.color }}
    >
      <motion.div
        className="service-card-accent-line"
        variants={{
          hidden: { scaleX: 0 },
          show: { scaleX: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.05 } },
        }}
        aria-hidden
      />

      <motion.div
        variants={iconVariants}
        className="service-card-icon w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center mb-3 md:mb-4"
        style={{ backgroundColor: `${service.color}18`, border: `1px solid ${service.color}35` }}
      >
        <Icon size={18} style={{ color: service.color }} />
      </motion.div>

      <h3 className="font-display font-semibold text-sm md:text-base text-[#e5e2e1] mb-1.5 md:mb-2 leading-snug group-hover:text-[#adc6ff] transition-colors duration-200">
        {service.title}
      </h3>

      <p className="text-[#8b90a0] text-xs md:text-sm leading-relaxed hidden sm:block">
        {service.description}
      </p>
    </motion.article>
  );
}

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="services" className="relative py-24 px-5 md:px-16 max-w-[1440px] mx-auto" ref={ref}>
      <hr className="section-divider mb-24" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-[#d3bbff] border border-[#d3bbff]/30 bg-[#d3bbff]/8 px-4 py-2.5 rounded-full mb-6">
          <Sparkles size={14} />
          <span>Services</span>
        </div>

        <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[#e5e2e1] mb-4">
          What I{' '}
          <motion.span
            className="text-[#d3bbff] text-glow inline-block"
            initial={{ opacity: 0, scale: 0.7, y: 16 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ type: 'spring', stiffness: 360, damping: 16, delay: 0.12 }}
          >
            Offer
          </motion.span>
        </h2>

        <p className="text-[#c1c6d7] max-w-2xl mx-auto">
          From short-form social media edits to long-form cinematic productions — tailored to your platform and vision.
        </p>
      </motion.div>

      <motion.div
        className="service-grid grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5"
        variants={gridVariants}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
      >
        {services.map((service) => (
          <ServiceCard key={service.title} service={service} />
        ))}
      </motion.div>
    </section>
  );
}
