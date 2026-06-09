import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Mail, MapPin, Send, CheckCircle2, MessageCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { apiUrl } from '../config/api';
import { site } from '../config/site';

const projectTypeOptions = [
  'YouTube Video', 'Reel / Short Video', 'Promotional Video',
  'Event Video', 'Wedding Video', 'Corporate Video', 'Social Media Ad', 'Other',
];

const budgetOptions = [
  'Under $50', '$50 – $100', '$100 – $250', '$250 – $500', '$500+', 'Not sure yet',
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', projectType: '', budget: '', message: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(apiUrl('/api/contact'), form);
      setSubmitted(true);
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to send message. Please try again or email directly.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 px-5 md:px-16 max-w-[1440px] mx-auto" ref={ref}>
      <hr className="section-divider mb-24" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-[#00c4cc] border border-[#00c4cc]/30 bg-[#00c4cc]/8 px-4 py-2.5 rounded-full mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(0,196,204,0.05)] hover:border-[#00c4cc]/60 transition-all duration-300">
          <Send size={14} className="animate-pulse" />
          <span>Get In Touch</span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[#e5e2e1] mb-4">
          Ready to Create Something <span className="text-[#00c4cc] text-glow">Great?</span>
        </h2>
        <p className="text-[#c1c6d7] max-w-2xl mx-auto">
          Let's discuss your next video project. Fill out the form and I'll get back to you shortly.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-6"
        >
          <div className="glass-panel rounded-xl p-6 border border-[#414755]/50">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#4b8eff]/15 border border-[#4b8eff]/30 flex items-center justify-center">
                <Mail size={18} className="text-[#4b8eff]" />
              </div>
              <div>
                <div className="font-mono text-xs tracking-wider uppercase text-[#8b90a0]">Email</div>
                <a href={`mailto:${site.email}`} className="font-display font-semibold text-sm text-[#e5e2e1] mt-0.5 hover:text-[#4b8eff] transition-colors block">
                  {site.email}
                </a>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6 border border-[#25d366]/20 hover:border-[#25d366]/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#25d366]/15 border border-[#25d366]/30 flex items-center justify-center group-hover:bg-[#25d366]/25 transition-all">
                <MessageCircle size={18} className="text-[#25d366]" />
              </div>
              <div>
                <div className="font-mono text-xs tracking-wider uppercase text-[#8b90a0]">WhatsApp</div>
                <a
                  href={site.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display font-semibold text-sm text-[#e5e2e1] mt-0.5 hover:text-[#25d366] transition-colors block"
                >
                  {site.phone}
                </a>
                <span className="text-[#25d366] text-[10px] font-mono mt-0.5 block">Chat on WhatsApp →</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6 border border-[#414755]/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#6ee7b7]/15 border border-[#6ee7b7]/30 flex items-center justify-center">
                <MapPin size={18} className="text-[#6ee7b7]" />
              </div>
              <div>
                <div className="font-mono text-xs tracking-wider uppercase text-[#8b90a0]">Location</div>
                <div className="font-display font-semibold text-sm text-[#e5e2e1] mt-0.5">
                  {site.location}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-5 border border-[#4b8eff]/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-[#6ee7b7] rounded-full animate-pulse" />
              <span className="font-mono text-xs tracking-wider text-[#6ee7b7] uppercase">Usually responds within 24h</span>
            </div>
            <p className="text-[#8b90a0] text-xs leading-relaxed">
              Available for new projects. Remote-friendly workflow for local and international clients.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="glass-panel rounded-xl p-8 border border-[#414755]/50">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 rounded-full bg-[#6ee7b7]/15 border border-[#6ee7b7]/30 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={32} className="text-[#6ee7b7]" />
                </div>
                <h3 className="font-display text-2xl font-bold text-[#e5e2e1] mb-3">Message Sent!</h3>
                <p className="text-[#c1c6d7] leading-relaxed max-w-sm mx-auto">
                  Thanks for reaching out! I'll review your project details and get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-name" className="font-mono text-xs tracking-[0.12em] uppercase text-[#8b90a0]">Name *</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                      className="glass-input rounded-sm px-4 py-3 w-full text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-email" className="font-mono text-xs tracking-[0.12em] uppercase text-[#8b90a0]">Email *</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="glass-input rounded-sm px-4 py-3 w-full text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-phone" className="font-mono text-xs tracking-[0.12em] uppercase text-[#8b90a0]">Phone Number</label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8901"
                    className="glass-input rounded-sm px-4 py-3 w-full text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-project" className="font-mono text-xs tracking-[0.12em] uppercase text-[#8b90a0]">Project Type</label>
                    <select
                      id="contact-project"
                      name="projectType"
                      value={form.projectType}
                      onChange={handleChange}
                      className="glass-input rounded-sm px-4 py-3 w-full text-sm appearance-none"
                    >
                      <option value="" disabled>Select type...</option>
                      {projectTypeOptions.map((pt) => (
                        <option key={pt} value={pt} className="bg-[#1c1b1b]">{pt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-budget" className="font-mono text-xs tracking-[0.12em] uppercase text-[#8b90a0]">Budget Range</label>
                    <select
                      id="contact-budget"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      className="glass-input rounded-sm px-4 py-3 w-full text-sm appearance-none"
                    >
                      <option value="" disabled>Select budget...</option>
                      {budgetOptions.map((b) => (
                        <option key={b} value={b} className="bg-[#1c1b1b]">{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-message" className="font-mono text-xs tracking-[0.12em] uppercase text-[#8b90a0]">Message *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project — what you need edited, timeline, any references..."
                    rows={5}
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
                  id="contact-submit-btn"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-[#4b8eff] text-[#001a41] font-display font-semibold py-3.5 px-8 rounded-sm hover:bg-[#adc6ff] transition-all btn-glow mt-1 disabled:opacity-60"
                >
                  {loading ? 'Sending...' : (
                    <>
                      Send Message
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
