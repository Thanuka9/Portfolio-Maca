import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Cpu } from 'lucide-react';

const tools = [
  { name: 'Adobe Premiere Pro', icon: '🎬', color: '#9999ff' },
  { name: 'Adobe After Effects', icon: '✨', color: '#9999ff' },
  { name: 'DaVinci Resolve', icon: '🎨', color: '#ff4444' },
  { name: 'CapCut', icon: '✂️', color: '#adc6ff' },
  { name: 'Adobe Photoshop', icon: '🖼️', color: '#31a8ff' },
  { name: 'Canva', icon: '🎭', color: '#00c4cc' },
  { name: 'Adobe Audition', icon: '🔊', color: '#4af' },
];

const skills = [
  'Video Editing', 'Color Grading', 'Storytelling', 'Sound Design',
  'Subtitles & Captions', 'Motion Graphics', 'Social Media Formatting',
  'Fast-Paced Editing', 'Cinematic Editing', 'YouTube Editing',
  'Reels & Short-Form', 'Promotional Video', 'Audio Cleanup',
  'Brand-Focused Editing', 'Pacing & Rhythm', 'Transitions',
];

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" className="relative py-24 px-5 md:px-16 max-w-[1440px] mx-auto" ref={ref}>
      <hr className="section-divider mb-24" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-[#ffb595] border border-[#ffb595]/30 bg-[#ffb595]/8 px-4 py-2.5 rounded-full mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(255,181,149,0.05)] hover:border-[#ffb595]/60 transition-all duration-300">
          <Cpu size={14} className="animate-pulse" />
          <span>Skills & Tools</span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[#e5e2e1] mb-4">
          My <span className="text-[#ffb595] text-glow">Toolkit</span>
        </h2>
        <p className="text-[#c1c6d7] max-w-2xl mx-auto">
          Industry-standard tools combined with a creative eye to deliver results that stand out.
        </p>
      </motion.div>

      {/* Tools grid */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 mb-12 md:mb-16">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            className="glass-panel rounded-xl p-3 md:p-5 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-300 cursor-default"
          >
            <span className="text-2xl md:text-3xl mb-2 md:mb-3">{tool.icon}</span>
            <span className="font-mono text-[10px] md:text-xs tracking-[0.05em] md:tracking-[0.08em] text-[#c1c6d7] leading-snug group-hover:text-[#adc6ff] transition-colors">
              {tool.name}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Skills tag cloud */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center"
      >
        <h3 className="font-display text-lg font-semibold text-[#8b90a0] mb-6 tracking-wide uppercase text-sm">
          Core Skills
        </h3>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {skills.map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.04 }}
              className="skill-badge font-mono text-[10px] md:text-xs tracking-[0.08em] md:tracking-[0.1em] uppercase text-[#c1c6d7] border border-[#414755] px-3 md:px-4 py-1.5 md:py-2 rounded-full"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
