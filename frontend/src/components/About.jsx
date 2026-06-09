import { motion, useInView } from 'framer-motion';
import { useRef, useState, useCallback } from 'react';
import { Clapperboard, Zap, Globe2, MessageSquare, User } from 'lucide-react';

const highlights = [
  { icon: Clapperboard, label: 'Storytelling', text: 'Every frame serves the narrative' },
  { icon: Zap, label: 'Fast Delivery', text: 'Clean edits, on-time, every time' },
  { icon: Globe2, label: 'Remote-Friendly', text: 'Working with global clients seamlessly' },
  { icon: MessageSquare, label: 'Clear Comms', text: 'Fast responses and easy collaboration' },
];

const tools = ['Adobe Premiere Pro', 'Final Cut Pro', 'Avid Media Composer'];

const PROFILE_IMAGE = '/assets/images/profile_azeem.png';

function ProfileHero({ inView }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, active: false });

  const handleMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 8, ry: x * 10, active: true });
  }, []);

  const handleLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0, active: false });
  }, []);

  return (
    <div className="profile-hero" onMouseMove={handleMove} onMouseLeave={handleLeave}>
      <div className="profile-hero__halo" aria-hidden />
      <div className="profile-hero__halo profile-hero__halo--2" aria-hidden />

      <motion.div
        className="profile-hero__wrap"
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 220, damping: 22, delay: 0.05 }}
      >
        <div
          ref={cardRef}
          className={`profile-hero__tilt${tilt.active ? ' is-active' : ''}`}
          style={{ '--rx': `${tilt.rx}deg`, '--ry': `${tilt.ry}deg` }}
        >
          <div className="profile-hero__border">
            <div className="profile-hero__card">
              <img
                src={PROFILE_IMAGE}
                alt="Azeem Naveed - Professional Video Editor"
                loading="eager"
                fetchPriority="high"
                width={480}
                height={600}
              />
            </div>
          </div>
        </div>

        <motion.div
          className="profile-hero__caption"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.35 }}
        >
          <h3 className="profile-hero__name">Azeem Naveed</h3>
          <p className="profile-hero__role">Video Editor · Kandy, Sri Lanka</p>
          <p className="profile-hero__status">
            <span className="profile-hero__dot" aria-hidden />
            Available for work
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="relative py-24 px-5 md:px-16 max-w-[1440px] mx-auto" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center mb-10 md:mb-12"
      >
        <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-[#4b8eff] border border-[#4b8eff]/30 bg-[#4b8eff]/8 px-4 py-2.5 rounded-full">
          <User size={14} />
          <span>About Me</span>
        </div>
      </motion.div>

      <div className="about-split">
        <div className="about-split__media">
          <ProfileHero inView={inView} />
        </div>

        <motion.div
          className="about-split__content"
          initial={{ opacity: 0, x: 32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="about-split__heading font-display text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-bold tracking-tight text-[#e5e2e1] mb-6 leading-[1.12]">
            <span className="block">Crafting Stories Through</span>
            <span className="block text-[#4b8eff] text-glow">Precise Editing</span>
          </h2>

          <div className="space-y-4 mb-6">
            <p className="text-[#c1c6d7] text-base leading-relaxed">
              I am a passionate and dedicated Video Editor with over 6 years of experience creating engaging and impactful visual content. Throughout my career, I have worked with corporate clients, small businesses, independent filmmakers, and content creators, helping bring their ideas to life through compelling storytelling and high-quality video production.
            </p>

            <p className="text-[#8b90a0] leading-relaxed">
              I am proficient in industry-standard editing software, including Adobe Premiere Pro, Final Cut Pro, and Avid Media Composer, and have experience working with a wide range of video formats and production workflows. My strong attention to detail, creative mindset, and technical expertise allow me to deliver polished content that meets both creative and business objectives.
            </p>

            <p className="text-[#8b90a0] leading-relaxed">
              As a fast learner, I continuously adapt to new technologies, editing techniques, and industry trends. I thrive in fast-paced environments, work efficiently under tight deadlines, and am always eager to push creative boundaries to produce innovative and engaging content. My goal is to create videos that not only capture attention but also leave a lasting impact on audiences.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {tools.map((tool) => (
              <span
                key={tool}
                className="font-mono text-[10px] sm:text-xs tracking-wide uppercase px-3 py-1.5 rounded-full border border-[#4b8eff]/25 bg-[#4b8eff]/8 text-[#adc6ff]"
              >
                {tool}
              </span>
            ))}
          </div>

          <p className="text-[#adc6ff] font-medium leading-relaxed mb-8 text-sm border-l-2 border-[#4b8eff] pl-4 italic">
            Polished edits, clear communication, and creative energy — from a single YouTube video to an ongoing content partnership.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {highlights.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.3 + i * 0.08 }}
                className="glass-panel rounded-lg p-3 md:p-4 border border-[#414755]/50 hover:border-[#adc6ff]/30 transition-colors group"
              >
                <h.icon size={18} className="text-[#4b8eff] mb-2 group-hover:text-[#adc6ff] transition-colors" />
                <div className="font-display font-semibold text-xs md:text-sm text-[#e5e2e1] mb-0.5">{h.label}</div>
                <div className="font-body text-xs text-[#8b90a0] leading-snug hidden sm:block">{h.text}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
