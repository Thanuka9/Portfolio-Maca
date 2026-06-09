import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Play, X, ExternalLink, Film } from 'lucide-react';
import { projects, projectCategories, COMING_SOON_CATEGORIES, CATEGORY_FILTER_COLORS } from '../data/projects';

/**
 * Converts any video share URL to an embeddable URL.
 * Supports: YouTube, Vimeo, Google Drive, direct video files.
 */
function getEmbedUrl(url) {
  if (!url) return '';

  // YouTube: watch?v=ID  or  youtu.be/ID  or  already /embed/
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const idMatch =
      url.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ||
      url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ||
      url.match(/embed\/([a-zA-Z0-9_-]{11})/);
    const id = idMatch ? idMatch[1] : null;
    return id
      ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
      : url;
  }

  // Vimeo
  if (url.includes('vimeo.com')) {
    const idMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return idMatch
      ? `https://player.vimeo.com/video/${idMatch[1]}?autoplay=1`
      : url;
  }

  // Google Drive: /file/d/FILE_ID/view  →  /file/d/FILE_ID/preview
  if (url.includes('drive.google.com')) {
    const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return idMatch
      ? `https://drive.google.com/file/d/${idMatch[1]}/preview`
      : url;
  }

  // Direct video file — return as-is (handled by <video>)
  return url;
}

function isDirectVideo(url) {
  return (
    !url.includes('youtube') &&
    !url.includes('youtu.be') &&
    !url.includes('vimeo') &&
    !url.includes('drive.google.com')
  );
}

function VideoModal({ project, onClose }) {
  const embedUrl = getEmbedUrl(project.videoUrl);
  const useVideoTag = isDirectVideo(project.videoUrl);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-4xl glass-panel rounded-xl overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close video"
            className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-[#0b0b0b]/80 border border-white/10 text-[#c1c6d7] hover:text-[#e5e2e1] hover:bg-[#adc6ff]/20 transition-all"
            id="modal-close-btn"
          >
            <X size={18} />
          </button>

          {/* Video player */}
          <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
            {useVideoTag ? (
              <video
                src={project.videoUrl}
                controls
                autoPlay
                className="w-full h-full"
              />
            ) : (
              <iframe
                src={embedUrl}
                title={project.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            )}
          </div>

          {/* Info */}
          <div className="p-6 border-t border-white/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-xs tracking-[0.12em] uppercase text-[#adc6ff] mb-2 block">
                  {project.category}
                </span>
                <h3 className="font-display text-xl font-bold text-[#e5e2e1]">{project.title}</h3>
                <p className="text-[#8b90a0] text-sm mt-2 leading-relaxed">{project.description}</p>
              </div>
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-2 text-[#8b90a0] hover:text-[#adc6ff] transition-colors text-sm font-mono"
              >
                <ExternalLink size={14} />
                Open
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


function ProjectCard({ project, onClick, index, inView }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="glass-panel rounded-xl overflow-hidden group cursor-pointer video-card flex flex-col"
      onClick={() => onClick(project)}
      id={`project-card-${project.id}`}
    >
      {/* Thumbnail */}
      <div className="relative h-52 overflow-hidden bg-[#1c1b1b] video-card-thumb">
        <img
          src={project.thumbnail}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover opacity-70"
        />

        {/* Play overlay */}
        <div className="absolute inset-0 bg-[#050505]/40 flex items-center justify-center group-hover:bg-[#050505]/20 transition-all duration-400 z-10">
          <div className="w-14 h-14 rounded-full bg-[#4b8eff]/25 flex items-center justify-center backdrop-blur-md border border-[#4b8eff]/50 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(75,142,255,0.4)]">
            <Play size={22} className="text-[#adc6ff] ml-0.5" fill="currentColor" />
          </div>
        </div>

        {/* Year / platform badge */}
        <div className="absolute top-3 right-3 z-20">
          <span className="font-mono text-xs text-[#adc6ff] bg-[#050505]/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
            {project.year}
          </span>
        </div>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 z-20">
            <span className="font-mono text-xs text-[#6ee7b7] bg-[#050505]/80 backdrop-blur-md border border-[#6ee7b7]/30 px-3 py-1 rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <span className="font-mono text-xs tracking-[0.12em] uppercase text-[#d3bbff] mb-2">
          {project.category}
        </span>
        <h3 className="font-display font-semibold text-base text-[#e5e2e1] mb-2 group-hover:text-[#adc6ff] transition-colors leading-snug">
          {project.title}
        </h3>
        <p className="text-[#8b90a0] text-sm leading-relaxed flex-1">
          {project.description}
        </p>
        <button className="mt-4 w-full py-2 border border-[#414755] text-[#c1c6d7] font-mono text-xs tracking-[0.1em] uppercase rounded-sm hover:border-[#adc6ff] hover:text-[#adc6ff] transition-all group-hover:border-[#4b8eff]/50">
          Watch Project →
        </button>
      </div>
    </motion.article>
  );
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  const isComingSoon = COMING_SOON_CATEGORIES.includes(activeCategory);

  return (
    <section id="work" className="relative py-24 px-5 md:px-16 max-w-[1440px] mx-auto" ref={ref}>
      <hr className="section-divider mb-24" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-[#6ee7b7] border border-[#6ee7b7]/30 bg-[#6ee7b7]/8 px-4 py-2.5 rounded-full mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(110,231,183,0.05)] hover:border-[#6ee7b7]/60 transition-all duration-300">
          <Film size={14} className="animate-pulse" />
          <span>Past Projects</span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[#e5e2e1] mb-4">
          Projects <span className="text-[#6ee7b7] text-glow">Archive</span>
        </h2>
        <p className="text-[#c1c6d7] max-w-2xl mx-auto">
          A collection of past editing work across YouTube, social media, corporate, and cinematic projects.
        </p>
      </motion.div>

      {/* Filter chips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="portfolio-filters glass-panel rounded-xl px-4 py-3 md:p-4 mb-8 md:mb-10"
        style={{ '--filter-accent': CATEGORY_FILTER_COLORS[activeCategory] || '#adc6ff' }}
      >
        <div className="portfolio-filters__scroll chips-scroll-mobile items-center">
          <span className="portfolio-filters__label font-mono text-xs tracking-[0.15em] uppercase shrink-0">
            Genre:
          </span>
          {projectCategories.map((cat, i) => {
            const color = CATEGORY_FILTER_COLORS[cat] || '#adc6ff';
            const isActive = activeCategory === cat;

            return (
              <motion.button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`portfolio-filter-chip${isActive ? ' is-active' : ''}`}
                style={{ '--chip-color': color }}
                initial={{ opacity: 0, y: 14, scale: 0.92 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ type: 'spring', stiffness: 380, damping: 22, delay: 0.12 + i * 0.04 }}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.94 }}
                id={`filter-${cat.toLowerCase().replace(/\//g, '-')}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="portfolioFilterPill"
                    className="portfolio-filter-chip__pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                    aria-hidden
                  />
                )}
                <span className="portfolio-filter-chip__dot" aria-hidden />
                <span className="portfolio-filter-chip__text">{cat}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Grid / Coming Soon */}
      <AnimatePresence mode="wait">
        {isComingSoon ? (
          <motion.div
            key={`coming-soon-${activeCategory}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="glass-panel rounded-xl py-16 px-6 md:py-20 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center bg-[#4b8eff]/10 border border-[#4b8eff]/25">
              <Film size={28} className="text-[#adc6ff]" />
            </div>
            <p className="font-mono text-xs tracking-[0.15em] uppercase text-[#adc6ff] mb-3">
              {activeCategory}
            </p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-[#e5e2e1] mb-3">
              Coming Soon
            </h3>
            <p className="text-[#8b90a0] text-sm md:text-base max-w-md mx-auto leading-relaxed">
              {activeCategory} projects are being added to the archive. Check back soon or contact me to discuss a project in this style.
            </p>
          </motion.div>
        ) : (
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={setSelectedProject}
              index={i}
              inView={inView}
            />
          ))}
        </motion.div>
        )}
      </AnimatePresence>

      {/* Video modal */}
      {selectedProject && (
        <VideoModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
