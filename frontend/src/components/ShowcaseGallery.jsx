import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, Sparkles, Film, Palette, PenLine } from 'lucide-react';
import { SHOWCASE_CATEGORIES, getProjectsByShowcase } from '../data/projects';

const SLIDE_INTERVAL = 7000;

const CATEGORY_ICONS = {
  ai: Sparkles,
  normal: Film,
  '2d': Palette,
  whiteboard: PenLine,
};

const CAROUSEL_SPRING = { type: 'spring', stiffness: 220, damping: 26, mass: 0.85 };
const TAB_SPRING = { type: 'spring', stiffness: 380, damping: 32 };

function wrapIndex(index, len) {
  if (len === 0) return 0;
  return ((index % len) + len) % len;
}

function ProgressBar({ paused, resetKey }) {
  return (
    <div className="flex-1 h-px bg-white/10 rounded-full overflow-hidden">
      <div
        key={resetKey}
        className={`showcase-progress-fill h-full rounded-full ${paused ? 'showcase-progress-paused' : ''}`}
        style={{ '--slide-duration': `${SLIDE_INTERVAL}ms` }}
      />
    </div>
  );
}

export default function ShowcaseGallery({ onActiveProjectChange, onPlay, pausedExternally }) {
  const [activeCategory, setActiveCategory] = useState(SHOWCASE_CATEGORIES[0].id);
  const [slideIndex, setSlideIndex] = useState(0);
  const [cardSpacing, setCardSpacing] = useState(158);
  const [slideDir, setSlideDir] = useState(1);
  const tabsRef = useRef(null);
  const stateRef = useRef({ activeCategory, slideIndex });

  useEffect(() => {
    stateRef.current = { activeCategory, slideIndex };
  }, [activeCategory, slideIndex]);

  useEffect(() => {
    const update = () => setCardSpacing(window.innerWidth < 640 ? 122 : 158);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const categoryMeta = SHOWCASE_CATEGORIES.find((c) => c.id === activeCategory) || SHOWCASE_CATEGORIES[1];
  const items = getProjectsByShowcase(activeCategory);
  const project = items[slideIndex];
  const isPaused = !!pausedExternally;
  const progressKey = `${activeCategory}-${slideIndex}`;

  useEffect(() => {
    setSlideIndex(0);
    setSlideDir(1);
  }, [activeCategory]);

  useEffect(() => {
    if (project) onActiveProjectChange?.(project);
  }, [project, onActiveProjectChange]);

  const categoryIndex = SHOWCASE_CATEGORIES.findIndex((c) => c.id === activeCategory);

  const selectCategory = useCallback((catId) => {
    const nextIdx = SHOWCASE_CATEGORIES.findIndex((c) => c.id === catId);
    const curIdx = SHOWCASE_CATEGORIES.findIndex((c) => c.id === activeCategory);
    setSlideDir(nextIdx >= curIdx ? 1 : -1);
    setActiveCategory(catId);
    setSlideIndex(0);
  }, [activeCategory]);

  const goTo = useCallback((index) => {
    if (items.length === 0) return;
    setSlideDir(index >= slideIndex ? 1 : -1);
    setSlideIndex(wrapIndex(index, items.length));
  }, [items.length, slideIndex]);

  const advance = useCallback(() => {
    setSlideDir(1);
    const { activeCategory: cat, slideIndex: idx } = stateRef.current;
    const catIdx = SHOWCASE_CATEGORIES.findIndex((c) => c.id === cat);
    const catItems = getProjectsByShowcase(cat);

    if (catItems.length === 0 || idx >= catItems.length - 1) {
      const nextIdx = (catIdx + 1) % SHOWCASE_CATEGORIES.length;
      setActiveCategory(SHOWCASE_CATEGORIES[nextIdx].id);
      setSlideIndex(0);
    } else {
      setSlideIndex(idx + 1);
    }
  }, []);

  const retreat = useCallback(() => {
    setSlideDir(-1);
    const catIdx = SHOWCASE_CATEGORIES.findIndex((c) => c.id === activeCategory);

    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    } else {
      const prevIdx = (catIdx - 1 + SHOWCASE_CATEGORIES.length) % SHOWCASE_CATEGORIES.length;
      const prevCat = SHOWCASE_CATEGORIES[prevIdx];
      const prevItems = getProjectsByShowcase(prevCat.id);
      setActiveCategory(prevCat.id);
      setSlideIndex(Math.max(0, prevItems.length - 1));
    }
  }, [activeCategory, slideIndex]);

  useEffect(() => {
    if (isPaused) return undefined;
    const timer = window.setTimeout(advance, SLIDE_INTERVAL);
    return () => window.clearTimeout(timer);
  }, [isPaused, slideIndex, activeCategory, advance]);

  const offsets = items.length === 0
    ? []
    : items.length === 1
      ? [{ offset: 0, index: 0 }]
      : [-1, 0, 1].map((o) => ({
          offset: o,
          index: wrapIndex(slideIndex + o, items.length),
        }));

  return (
    <div
      className={`showcase-gallery w-full max-w-5xl mx-auto ${isPaused ? 'showcase-gallery-paused' : ''}`}
      style={{
        '--sc-accent': categoryMeta.color,
        '--sc-accent-2': categoryMeta.color2,
        '--slide-duration': `${SLIDE_INTERVAL}ms`,
      }}
    >
      <div className="showcase-cat-track flex items-center justify-center gap-2 mb-2.5">
        {SHOWCASE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => selectCategory(cat.id)}
            aria-label={`${cat.label} category`}
            className={`showcase-cat-pip ${activeCategory === cat.id ? 'showcase-cat-pip-active' : ''}`}
            style={{ '--pip-color': cat.color }}
          >
            {activeCategory === cat.id && (
              <motion.span
                layoutId="showcase-cat-pip-glow"
                className="showcase-cat-pip-glow"
                style={{ background: cat.color }}
                transition={TAB_SPRING}
              />
            )}
          </button>
        ))}
        <span className="font-mono text-[9px] text-[#8b90a0] ml-1 tabular-nums">
          {String(categoryIndex + 1).padStart(2, '0')}/{String(SHOWCASE_CATEGORIES.length).padStart(2, '0')}
        </span>
      </div>

      <div ref={tabsRef} className="showcase-tabs">
        {SHOWCASE_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id] || Film;
          const count = getProjectsByShowcase(cat.id).length;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => selectCategory(cat.id)}
              className={`showcase-tab ${isActive ? 'showcase-tab-active' : ''}`}
            >
              {isActive && (
                <motion.span
                  layoutId="showcase-tab-glow"
                  className="showcase-tab-glow"
                  style={{ background: `linear-gradient(135deg, ${cat.color}40, ${cat.color2}28)` }}
                  transition={TAB_SPRING}
                />
              )}
              <Icon size={14} className="relative z-10 shrink-0" style={{ color: isActive ? cat.color : undefined }} />
              <span className="relative z-10">{cat.label}</span>
              <span className="relative z-10 showcase-tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="showcase-frame">
        <motion.div
          className="showcase-frame-glow"
          aria-hidden
          animate={{ opacity: [0.1, 0.22, 0.1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {items.length === 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="showcase-empty"
            >
              <div className="showcase-empty-icon" style={{ color: categoryMeta.color }}>
                {(() => { const I = CATEGORY_ICONS[activeCategory]; return I ? <I size={28} /> : null; })()}
              </div>
              <p className="font-display text-base font-semibold text-[#e5e2e1] mb-1">Coming Soon</p>
              <p className="text-[#8b90a0] text-sm max-w-xs text-center leading-relaxed mb-4">
                {categoryMeta.label} samples are being added. Contact me to discuss your project in this style.
              </p>
              <div className="flex items-center gap-3 w-full max-w-xs">
                <ProgressBar paused={isPaused} resetKey={progressKey} />
                <span className="font-mono text-[10px] text-[#8b90a0] shrink-0">Next category</span>
              </div>
              <button type="button" onClick={retreat} className="showcase-arrow showcase-arrow-left showcase-arrow-empty" aria-label="Previous category">
                <ChevronLeft size={20} />
              </button>
              <button type="button" onClick={advance} className="showcase-arrow showcase-arrow-right showcase-arrow-empty" aria-label="Next category">
                <ChevronRight size={20} />
              </button>
            </motion.div>
          </AnimatePresence>
        ) : (
          <>
            <div className="showcase-stage relative">
              <div className="showcase-stage-inner">
                {offsets.map(({ offset, index }) => {
                  const p = items[index];
                  const isCenter = offset === 0;
                  return (
                    <motion.button
                      key={`${activeCategory}-${p.id}-${offset}`}
                      type="button"
                      onClick={() => {
                        if (isCenter) onPlay(p);
                        else goTo(index);
                      }}
                      className={`showcase-card ${isCenter ? 'showcase-card-center' : 'showcase-card-side'}`}
                      animate={{
                        x: offset * cardSpacing,
                        scale: isCenter ? 1 : 0.8,
                        rotateY: offset * -16,
                        zIndex: isCenter ? 10 : 5 - Math.abs(offset),
                        opacity: isCenter ? 1 : 0.4,
                      }}
                      transition={CAROUSEL_SPRING}
                      aria-label={isCenter ? `Play ${p.title}` : `View ${p.title}`}
                    >
                      <div className="showcase-card-inner">
                        {isCenter ? (
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                              key={`${activeCategory}-${p.id}-${slideIndex}`}
                              className="showcase-card-media absolute inset-0"
                              initial={{ opacity: 0, x: slideDir * 48, scale: 1.06 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: slideDir * -48, scale: 0.94 }}
                              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <img
                                src={p.thumbnail}
                                alt=""
                                loading="eager"
                                decoding="async"
                                className="showcase-card-img showcase-card-img-active"
                              />
                            </motion.div>
                          </AnimatePresence>
                        ) : (
                          <img
                            src={p.thumbnail}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="showcase-card-img"
                          />
                        )}
                        <div className="showcase-card-overlay" />
                        {isCenter && (
                          <>
                            <div className="showcase-card-shine" aria-hidden />
                            <motion.div
                              className="showcase-play-ring"
                              initial={{ scale: 0.7, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.12 }}
                            >
                              <div className="showcase-play-btn">
                                <Play size={22} fill="currentColor" className="ml-0.5" />
                              </div>
                            </motion.div>
                          </>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <button type="button" onClick={retreat} className="showcase-arrow showcase-arrow-left" aria-label="Previous">
                <ChevronLeft size={20} />
              </button>
              <button type="button" onClick={advance} className="showcase-arrow showcase-arrow-right" aria-label="Next">
                <ChevronRight size={20} />
              </button>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${activeCategory}-${project.id}`}
                initial={{ opacity: 0, x: slideDir * 28, y: 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: slideDir * -20, y: -6 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="showcase-info"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="showcase-badge">{categoryMeta.label}</span>
                      <span className="font-mono text-[10px] text-[#8b90a0]">{project.year}</span>
                    </div>
                    <h3 className="font-display text-sm sm:text-base font-bold text-[#e5e2e1] line-clamp-2 leading-snug mb-1">
                      {project.title}
                    </h3>
                    <p className="text-[#8b90a0] text-xs line-clamp-2 leading-relaxed hidden sm:block">
                      {project.description}
                    </p>
                  </div>
                  <button type="button" onClick={() => onPlay(project)} className="showcase-open-btn shrink-0">
                    <Play size={14} fill="currentColor" />
                    Open
                  </button>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex gap-1.5">
                    {items.map((p, i) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Slide ${i + 1}`}
                        className={`showcase-dot ${i === slideIndex ? 'showcase-dot-active' : ''}`}
                      />
                    ))}
                  </div>
                  <ProgressBar paused={isPaused} resetKey={progressKey} />
                  <span className="font-mono text-[10px] text-[#8b90a0] tabular-nums shrink-0">
                    {String(slideIndex + 1).padStart(2, '0')}/{String(items.length).padStart(2, '0')}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
