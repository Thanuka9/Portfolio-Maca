import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Star, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { apiUrl } from '../config/api';

const projectTypes = [
  'YouTube Video',
  'Reel / Short Video',
  'Promotional Video',
  'Event Video',
  'Wedding Video',
  'Corporate Video',
  'Social Media Ad',
  'Other',
];

export default function ReviewForm() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    projectType: '',
    comment: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { setError('Please select a star rating.'); return; }
    if (!form.name.trim() || !form.comment.trim()) {
      setError('Name and review comment are required.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axios.post(apiUrl('/api/reviews'), { ...form, rating });
      setSubmitted(true);
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to submit review. Please try again later.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="review-form" className="relative py-24 px-5 md:px-16" ref={ref}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="glass-panel rounded-xl p-8 md:p-10 border border-[#414755]/50"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-[#6ee7b7]/15 border border-[#6ee7b7]/30 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={32} className="text-[#6ee7b7]" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#e5e2e1] mb-3">
                Thank You!
              </h3>
              <p className="text-[#c1c6d7] leading-relaxed">
                Your review has been submitted and will appear after approval.
                I appreciate you taking the time to share your experience!
              </p>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#8b90a0] border border-[#414755] px-4 py-2 rounded-full">
                  Share Your Experience
                </span>
                <h2 className="font-display text-3xl font-bold text-[#e5e2e1] mt-5 mb-2">
                  Leave a Review
                </h2>
                <p className="text-[#c1c6d7] text-sm">
                  Worked together recently? I'd love to hear your thoughts.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="review-name" className="font-mono text-xs tracking-[0.12em] uppercase text-[#8b90a0]">
                      Your Name *
                    </label>
                    <input
                      id="review-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="glass-input rounded-sm px-4 py-3 w-full text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="review-email" className="font-mono text-xs tracking-[0.12em] uppercase text-[#8b90a0]">
                      Email Address
                    </label>
                    <input
                      id="review-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="glass-input rounded-sm px-4 py-3 w-full text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="review-role" className="font-mono text-xs tracking-[0.12em] uppercase text-[#8b90a0]">
                    Role / Company
                  </label>
                  <input
                    id="review-role"
                    name="role"
                    type="text"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="e.g. Content Creator at Studio X"
                    className="glass-input rounded-sm px-4 py-3 w-full text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="review-project" className="font-mono text-xs tracking-[0.12em] uppercase text-[#8b90a0]">
                    Project Type
                  </label>
                  <select
                    id="review-project"
                    name="projectType"
                    value={form.projectType}
                    onChange={handleChange}
                    className="glass-input rounded-sm px-4 py-3 w-full text-sm appearance-none"
                  >
                    <option value="" disabled>Select project type...</option>
                    {projectTypes.map((pt) => (
                      <option key={pt} value={pt} className="bg-[#1c1b1b]">{pt}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-mono text-xs tracking-[0.12em] uppercase text-[#8b90a0]">
                    Rating *
                  </span>
                  <div
                    className="flex gap-2"
                    id="star-rating-group"
                    onMouseLeave={() => setHoverRating(0)}
                    role="group"
                    aria-label="Star rating"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        className="star-icon transition-all duration-150"
                        id={`star-${star}`}
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      >
                        <Star
                          size={30}
                          className={
                            (hoverRating || rating) >= star
                              ? 'text-[#4b8eff] fill-[#4b8eff] scale-110'
                              : 'text-[#414755]'
                          }
                          style={{ transition: 'all 0.15s ease' }}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-2 font-mono text-xs text-[#adc6ff] self-center">
                        {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great!' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="review-comment" className="font-mono text-xs tracking-[0.12em] uppercase text-[#8b90a0]">
                    Your Review *
                  </label>
                  <textarea
                    id="review-comment"
                    name="comment"
                    value={form.comment}
                    onChange={handleChange}
                    placeholder="Share your experience working with Azeem..."
                    rows={4}
                    required
                    className="glass-input rounded-sm px-4 py-3 w-full text-sm resize-none"
                  />
                </div>

                {error && (
                  <div role="alert" className="flex items-start gap-2 text-[#ffb4ab] text-sm font-mono border border-[#93000a] bg-[#93000a]/20 rounded-sm px-4 py-3">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  id="submit-review-btn"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-[#4b8eff] text-[#001a41] font-display font-semibold py-3.5 px-6 rounded-sm hover:bg-[#adc6ff] transition-all btn-glow mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="font-mono text-sm">Submitting...</span>
                  ) : (
                    <>
                      Submit Review
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
