import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { CheckCircle2, Award } from 'lucide-react';

const reasons = [
  {
    title: 'Creative & Detail-Focused',
    desc: 'Every cut, transition, and color grade is done with intention — I notice what most editors miss.',
  },
  {
    title: 'Fast Communication',
    desc: 'Clear, fast, and professional communication throughout the project from start to finish.',
  },
  {
    title: 'Clean Professional Delivery',
    desc: 'Properly formatted files, labeled exports, and organized deliverables every time.',
  },
  {
    title: 'Social Media Expertise',
    desc: 'Deep understanding of what works on YouTube, Instagram, TikTok, and other platforms.',
  },
  {
    title: 'Remote-Friendly Workflow',
    desc: 'Fully set up for remote collaboration — files, revisions, and feedback are handled smoothly online.',
  },
  {
    title: 'Flexible Editing Style',
    desc: 'I adapt my style to match your brand voice, from cinematic and emotional to fast-paced and punchy.',
  },
  {
    title: 'Client Satisfaction Focus',
    desc: 'Revisions are part of the process. I work until you\'re genuinely happy with the result.',
  },
  {
    title: 'Platform-Aware Editing',
    desc: 'Understands pacing, storytelling, aspect ratios, and platform requirements for every video type.',
  },
];

export default function WhyMe() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="why-me" className="relative py-24 px-5 md:px-16 max-w-[1440px] mx-auto" ref={ref}>
      <hr className="section-divider mb-24" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-[#ef6719] border border-[#ef6719]/30 bg-[#ef6719]/8 px-4 py-2.5 rounded-full mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(239,103,25,0.05)] hover:border-[#ef6719]/60 transition-all duration-300">
          <Award size={14} className="animate-pulse" />
          <span>Why Work With Me</span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[#e5e2e1] mb-4">
          Why Choose <span className="text-[#ef6719] text-glow">Azeem</span>
        </h2>
        <p className="text-[#c1c6d7] max-w-2xl mx-auto">
          Choosing the right editor can make a huge difference in how your content feels and performs.
          Here's what sets me apart.
        </p>
      </motion.div>

      {/* Reasons grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
        {reasons.map((reason, i) => (
          <motion.div
            key={reason.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.08 }}
            className="glass-panel rounded-xl p-4 md:p-6 flex gap-3 md:gap-4 group hover:border-[#adc6ff]/20 transition-colors"
          >
            <div className="shrink-0 mt-0.5">
              <CheckCircle2 size={18} className="text-[#4b8eff] group-hover:text-[#adc6ff] transition-colors" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-sm md:text-base text-[#e5e2e1] mb-1">
                {reason.title}
              </h3>
              <p className="text-[#8b90a0] text-xs md:text-sm leading-relaxed">{reason.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
