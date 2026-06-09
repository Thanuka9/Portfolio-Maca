import { useState, useRef, useEffect, useMemo, useCallback, useId } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Star, MessageSquare, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { apiUrl } from '../config/api';
import { site } from '../config/site';
import { CLIENT_REVIEWS } from '../data/clientReviews';

const SLIDE_MS = 6000;

const PLATFORM_META = {
  upwork: { label: 'Upwork', accent: '#6ee7b7', border: 'border-[#6ee7b7]/30', bg: 'bg-[#6ee7b7]/8', line: 'from-[#6ee7b7] via-[#34d399]' },
  fiverr: { label: 'Fiverr', accent: '#1dbf73', border: 'border-[#1dbf73]/30', bg: 'bg-[#1dbf73]/8', line: 'from-[#1dbf73] via-[#14a85c]' },
  local: { label: 'Local Client', accent: '#adc6ff', border: 'border-[#adc6ff]/30', bg: 'bg-[#adc6ff]/8', line: 'from-[#adc6ff] via-[#4b8eff]' },
};

function StarRating({ rating, size = 16 }) {
  const ratingId = useId();
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercent = Math.max(0, Math.min(100, (rating - (star - 1)) * 100));
        const gradientId = `star-grad-${ratingId}-${star}`;
        return (
          <span key={star} className="relative inline-flex" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox="0 0 24 24" className="absolute top-0 left-0" style={{ pointerEvents: 'none' }}>
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset={`${fillPercent}%`} stopColor="#4b8eff" />
                  <stop offset={`${fillPercent}%`} stopColor="#414755" />
                </linearGradient>
              </defs>
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={`url(#${gradientId})`}
                stroke="none"
              />
            </svg>
          </span>
        );
      })}
    </div>
  );
}

function ReviewCard({ review }) {
  const meta = PLATFORM_META[review.platform] || PLATFORM_META.local;

  return (
    <article className="review-slide-card glass-panel rounded-lg p-6 flex flex-col h-full min-h-[280px] relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${meta.line} to-transparent`} />

      <div className="flex items-center justify-between gap-2 mb-4 shrink-0">
        <StarRating rating={review.rating} />
        <span
          className={`inline-flex items-center gap-1 font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-full shrink-0 ${meta.border} ${meta.bg}`}
          style={{ color: meta.accent }}
        >
          <BadgeCheck size={11} />
          {meta.label}
        </span>
      </div>

      <blockquote className="text-[#e5e2e1] leading-relaxed italic text-sm md:text-base flex-1">
        &ldquo;{review.comment}&rdquo;
      </blockquote>

      <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-3 shrink-0">
        <div className="w-11 h-11 rounded-full border border-white/10 bg-[#2a2a2a] flex items-center justify-center font-display font-bold text-sm text-[#adc6ff] shrink-0">
          {review.initials || review.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <div className="min-w-0">
          <div className="font-display font-semibold text-sm text-[#e5e2e1] truncate">{review.name}</div>
          <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-[#8b90a0] truncate">
            {review.role}
            {review.date ? ` · ${review.date}` : ''}
          </div>
        </div>
      </div>
    </article>
  );
}

function useSlidesPerView() {
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    const update = () => {
      if (window.matchMedia('(max-width: 767px)').matches) setPerView(1);
      else if (window.matchMedia('(max-width: 1023px)').matches) setPerView(2);
      else setPerView(3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return perView;
}

function ReviewSlideshow({ reviews, inView }) {
  const perView = useSlidesPerView();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const maxIndex = Math.max(0, reviews.length - perView);

  const go = useCallback(
    (dir) => {
      setIndex((i) => {
        if (dir === 1) return i >= maxIndex ? 0 : i + 1;
        return i <= 0 ? maxIndex : i - 1;
      });
    },
    [maxIndex],
  );

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (!inView || paused || reviews.length <= perView) return undefined;

    timerRef.current = setInterval(() => go(1), SLIDE_MS);
    return () => clearInterval(timerRef.current);
  }, [inView, paused, perView, reviews.length, go]);

  const visible = useMemo(
    () => reviews.slice(index, index + perView),
    [reviews, index, perView],
  );

  const dots = maxIndex + 1;

  return (
    <div
      className="reviews-slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${index}-${perView}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="reviews-slideshow-track"
            style={{ '--reviews-cols': perView }}
          >
            {visible.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </motion.div>
        </AnimatePresence>

        {reviews.length > perView && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="reviews-slideshow-btn reviews-slideshow-btn--prev"
              aria-label="Previous reviews"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="reviews-slideshow-btn reviews-slideshow-btn--next"
              aria-label="Next reviews"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {dots > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: dots }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`reviews-slideshow-dot${i === index ? ' reviews-slideshow-dot--active' : ''}`}
              aria-label={`Go to review slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {reviews.length > perView && (
        <div className="reviews-slideshow-progress mt-4 mx-auto max-w-xs" aria-hidden>
          <div
            key={`${index}-${paused}`}
            className="reviews-slideshow-progress-fill"
            style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }}
          />
        </div>
      )}
    </div>
  );
}

export default function Reviews() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [apiReviews, setApiReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(apiUrl('/api/reviews'));
        setApiReviews(res.data.filter((r) => r.status === 'approved'));
      } catch {
        setApiReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const allReviews = useMemo(() => {
    const staticReviews = CLIENT_REVIEWS.map((r) => ({ ...r, source: r.platform }));
    const siteReviews = apiReviews.map((r) => ({
      ...r,
      platform: 'local',
      source: 'site',
    }));
    return [...staticReviews, ...siteReviews];
  }, [apiReviews]);

  const avgRating = allReviews.length
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    : site.stats.rating;

  return (
    <section id="reviews" className="relative py-24 px-5 md:px-16 max-w-[1440px] mx-auto" ref={ref}>
      <hr className="section-divider mb-24" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center mb-6"
      >
        <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-[#d3bbff] border border-[#d3bbff]/30 bg-[#d3bbff]/8 px-4 py-2.5 rounded-full mb-6">
          <MessageSquare size={14} />
          <span>Client Reviews</span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[#e5e2e1] mb-4">
          What Clients <span className="text-[#d3bbff] text-glow">Say</span>
        </h2>
        <p className="text-[#c1c6d7] max-w-2xl mx-auto">
          Feedback from Upwork, Fiverr, and local clients — projects dating back to 2021.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12"
      >
        <div className="text-center min-w-[100px]">
          <div className="font-display text-4xl font-bold text-[#adc6ff]">{avgRating}</div>
          <StarRating rating={Math.round(Number(avgRating))} />
          <div className="font-mono text-xs text-[#8b90a0] mt-1 tracking-wider">Average Rating</div>
        </div>
        <div className="w-px bg-white/10 hidden sm:block" />
        <div className="text-center min-w-[100px]">
          <div className="font-display text-4xl font-bold text-[#adc6ff]">{site.stats.clients}</div>
          <div className="font-mono text-xs text-[#8b90a0] mt-3 tracking-wider uppercase">Happy Clients</div>
        </div>
        <div className="w-px bg-white/10 hidden sm:block" />
        <div className="text-center min-w-[100px]">
          <div className="font-display text-4xl font-bold text-[#6ee7b7]">{site.stats.projects}</div>
          <div className="font-mono text-xs text-[#8b90a0] mt-3 tracking-wider uppercase">Projects Done</div>
        </div>
      </motion.div>

      {loading && allReviews.length === 0 ? (
        <div className="text-center py-12 text-[#8b90a0] font-mono text-sm">Loading reviews...</div>
      ) : allReviews.length > 0 ? (
        <ReviewSlideshow reviews={allReviews} inView={inView} />
      ) : null}
    </section>
  );
}
