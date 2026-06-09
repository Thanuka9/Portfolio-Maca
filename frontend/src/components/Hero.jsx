import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronDown, X } from 'lucide-react';
import { projects } from '../data/projects';
import { site } from '../config/site';
import { getEmbedUrl, isDirectVideo } from '../utils/video';
import ShowcaseGallery from './ShowcaseGallery';

const words = ['Creators', 'Brands', 'Businesses', 'Storytellers'];

function HeroSlideshow({ activeProject }) {
  const thumb = activeProject?.thumbnail || projects[0]?.thumbnail;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div key={thumb} className="absolute inset-0 hero-bg-slide">
        <img
          src={thumb}
          alt=""
          className="w-full h-full object-cover hero-bg-image hero-bg-kenburns"
        />
      </div>
      <div className="absolute inset-0 hero-overlay-gradient" />
      <div className="absolute inset-0 hero-overlay-horizontal" />
    </div>
  );
}

function VideoModal({ project, onClose }) {
  const embedUrl = getEmbedUrl(project.videoUrl);
  const useVideoTag = isDirectVideo(project.videoUrl);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-5xl glass-panel rounded-xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close video"
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-[#0b0b0b]/80 border border-white/10 text-[#c1c6d7] hover:text-[#e5e2e1] transition-all"
        >
          <X size={18} />
        </button>
        <div className="aspect-video w-full bg-black">
          {useVideoTag ? (
            <video src={project.videoUrl} controls autoPlay className="w-full h-full" />
          ) : (
            <iframe
              src={embedUrl}
              title={project.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          )}
        </div>
        <div className="px-5 py-4 border-t border-white/5">
          <p className="font-display font-semibold text-[#e5e2e1] text-sm">{project.title}</p>
          <p className="font-mono text-xs text-[#8b90a0] mt-1">{project.category} · {project.year}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayWord, setDisplayWord] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeProject, setActiveProject] = useState(projects[0]);
  const [modalProject, setModalProject] = useState(null);

  useEffect(() => {
    const word = words[wordIndex];
    let timer;
    if (!isDeleting && displayWord.length < word.length) {
      timer = setTimeout(() => setDisplayWord(word.slice(0, displayWord.length + 1)), 80);
    } else if (!isDeleting && displayWord.length === word.length) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayWord.length > 0) {
      timer = setTimeout(() => setDisplayWord(displayWord.slice(0, -1)), 45);
    } else if (isDeleting && displayWord.length === 0) {
      setIsDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
    }
    return () => clearTimeout(timer);
  }, [displayWord, isDeleting, wordIndex]);

  const handleActiveProject = useCallback((project) => {
    setActiveProject(project);
  }, []);

  const scrollToWork = () => document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToContact = () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" className="relative min-h-screen flex flex-col bg-grid-pattern overflow-hidden">
      <HeroSlideshow activeProject={activeProject} />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4b8eff]/8 rounded-full blur-[120px] pointer-events-none z-[1]" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#5d03ca]/8 rounded-full blur-[120px] pointer-events-none z-[1]" />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 md:px-16 flex flex-col items-center text-center flex-1 justify-center pt-28 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6">
          <span className="font-mono text-xs font-medium tracking-[0.2em] uppercase text-[#8b90a0] border border-[#414755]/50 px-4 py-2 rounded-full backdrop-blur-sm bg-[#0b0b0b]/20">
            ◉ &nbsp;Available for Projects
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-[#e5e2e1] text-glow leading-[1] mb-3 uppercase"
        >
          AZEEM NAVEED
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-display text-xl sm:text-2xl md:text-4xl font-semibold text-[#4b8eff] mb-5 h-10 sm:h-12 tracking-tight drop-shadow-md"
        >
          Video Editor for{' '}
          <span className="text-[#adc6ff]">
            {displayWord}
            <span className="cursor-blink text-[#4b8eff]">|</span>
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-[#c1c6d7] text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed mb-8 drop-shadow-md px-2 sm:px-0"
        >
          Based in Kandy, Sri Lanka — I create engaging, polished, and visually powerful videos
          for digital platforms, brands, and content creators worldwide.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full max-w-sm sm:max-w-none flex flex-col sm:flex-row gap-3 justify-center mb-10 sm:mb-12 px-1 sm:px-0"
        >
          <div className="grid grid-cols-2 sm:contents gap-3">
            <button
              onClick={scrollToWork}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3 sm:py-3.5 bg-[#4b8eff] text-white font-display font-semibold rounded-sm hover:bg-[#adc6ff] transition-all btn-glow glow-on-hover text-sm sm:text-base"
            >
              <Play size={14} fill="currentColor" />
              View Portfolio
            </button>
            <button
              onClick={scrollToContact}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3 sm:py-3.5 border border-[#414755] bg-[#0b0b0b]/80 text-[#e5e2e1] font-display font-semibold rounded-sm hover:border-[#adc6ff] hover:text-[#adc6ff] transition-all text-sm sm:text-base"
            >
              Contact Me
            </button>
          </div>
          <a
            href={site.social.upwork}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3 sm:py-3.5 border border-[#414755] bg-[#0b0b0b]/80 text-[#e5e2e1] font-display font-semibold rounded-sm hover:border-[#6ee7b7] hover:text-[#6ee7b7] transition-all text-sm sm:text-base"
          >
            Hire on Upwork ↗
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full flex justify-center mb-8 sm:mb-10"
        >
          <ShowcaseGallery
            onActiveProjectChange={handleActiveProject}
            pausedExternally={!!modalProject}
            onPlay={setModalProject}
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="relative z-10 w-full max-w-[1440px] mx-auto px-5 md:px-16 pb-16 sm:pb-20 pt-6 sm:pt-10 grid grid-cols-3 gap-4 md:gap-16 text-center"
      >
        {[
          { value: site.stats.projects, label: 'Projects Done' },
          { value: `${site.stats.rating}★`, label: 'Average Rating' },
          { value: site.stats.clients, label: 'Happy Clients' },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[#adc6ff]">{stat.value}</div>
            <div className="font-mono text-[10px] sm:text-xs tracking-[0.1em] uppercase text-[#8b90a0] mt-0.5 sm:mt-1">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-[#8b90a0] pointer-events-none"
      >
        <ChevronDown size={18} className="animate-bounce" />
      </motion.div>

      <AnimatePresence>
        {modalProject && (
          <VideoModal project={modalProject} onClose={() => setModalProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
