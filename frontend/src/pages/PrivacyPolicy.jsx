import { useEffect } from 'react';
import PageMeta from '../components/PageMeta';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PageMeta title="Privacy Policy" description="Privacy policy for Azeem Naveed's video editor portfolio website." />
      <div className="pt-32 pb-24 px-5 md:px-16 max-w-[1000px] mx-auto min-h-screen">
      <div className="glass-panel p-8 md:p-12 rounded-xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#e5e2e1] mb-8 tracking-tight">Privacy <span className="text-[#adc6ff] text-glow">Policy</span></h1>
        
        <div className="space-y-8 text-[#c1c6d7] leading-relaxed">
          <section>
            <h2 className="font-display text-2xl font-semibold text-[#e5e2e1] mb-4">1. Information Collection</h2>
            <p>
              When you use this website, we may collect personal information such as your name, email address, phone number, and any project details you choose to provide via the contact form or review submissions. This information is collected solely for the purpose of communicating with you and delivering our video editing services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[#e5e2e1] mb-4">2. Use of Information</h2>
            <p>
              The information you provide is used to respond to inquiries, process payments (via third-party platforms like Upwork if applicable), deliver requested services, and improve the user experience on our website. We do not sell, rent, or lease your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[#e5e2e1] mb-4">3. Data Protection</h2>
            <p>
              We implement industry-standard security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[#e5e2e1] mb-4">4. Third-Party Links</h2>
            <p>
              This website may contain links to external sites, including YouTube, Vimeo, Instagram, LinkedIn, and Upwork. These third-party sites have their own independent privacy policies. We are not responsible or liable for the content or activities of these linked sites.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[#e5e2e1] mb-4">5. Cookies</h2>
            <p>
              Our website may use local storage to save basic preferences, such as cookie consent and form-related settings, to provide a smoother experience on return visits.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[#e5e2e1] mb-4">6. Contact Information</h2>
            <p>
              If you have any questions regarding this Privacy Policy, you may contact us using the information on the Contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
    </>
  );
}
