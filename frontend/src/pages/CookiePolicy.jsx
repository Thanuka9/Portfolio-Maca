import { useEffect } from 'react';
import PageMeta from '../components/PageMeta';

export default function CookiePolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PageMeta title="Cookie Policy" description="Cookie policy for Azeem Naveed's video editor portfolio website." />
      <div className="pt-32 pb-24 px-5 md:px-16 max-w-[1000px] mx-auto min-h-screen">
      <div className="glass-panel p-8 md:p-12 rounded-xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#e5e2e1] mb-8 tracking-tight">Cookie <span className="text-[#adc6ff] text-glow">Policy</span></h1>
        
        <div className="space-y-8 text-[#c1c6d7] leading-relaxed">
          <section>
            <h2 className="font-display text-2xl font-semibold text-[#e5e2e1] mb-4">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your computer or mobile device when you visit a website. They are widely used to make websites work or improve user experience.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[#e5e2e1] mb-4">2. How We Use Cookies</h2>
            <p>
              Our website uses cookies and browser local storage for essential functionality, such as remembering cookie consent and supporting contact form features during your visit.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[#e5e2e1] mb-4">3. Third-Party Analytics and Content</h2>
            <p>
              Because we embed videos directly from platforms like YouTube, those providers may set cookies when you interact with their video players. We do not control or access these third-party cookies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[#e5e2e1] mb-4">4. Managing Cookies</h2>
            <p>
              You can set your browser to block or delete cookies. If you choose to disable cookies, some site features may not function as intended.
            </p>
          </section>
        </div>
      </div>
    </div>
    </>
  );
}
