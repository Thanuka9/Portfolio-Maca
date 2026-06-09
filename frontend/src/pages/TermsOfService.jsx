import { useEffect } from 'react';
import PageMeta from '../components/PageMeta';

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PageMeta title="Terms of Service" description="Terms of service for Azeem Naveed's video editor portfolio website." />
      <div className="pt-32 pb-24 px-5 md:px-16 max-w-[1000px] mx-auto min-h-screen">
      <div className="glass-panel p-8 md:p-12 rounded-xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#e5e2e1] mb-8 tracking-tight">Terms of <span className="text-[#adc6ff] text-glow">Service</span></h1>
        
        <div className="space-y-8 text-[#c1c6d7] leading-relaxed">
          <section>
            <h2 className="font-display text-2xl font-semibold text-[#e5e2e1] mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing and using this website, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[#e5e2e1] mb-4">2. Intellectual Property Rights</h2>
            <p>
              Unless otherwise stated, all material, text, design layouts, and custom code on this site are the intellectual property of Azeem Naveed. The portfolio videos shown are projects edited by Azeem Naveed, and the rights to raw content/original footage belong to their respective creators or companies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[#e5e2e1] mb-4">3. Custom Video Editing Services</h2>
            <p>
              All video editing services, deliverables, revision terms, and budgets are negotiated separately on a project-by-project basis. Client contracts initiated on Upwork are subject to Upwork's terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[#e5e2e1] mb-4">4. Client Reviews & Feedback</h2>
            <p>
              By submitting a review via our review form, you grant us permission to display your name, role/company, and rating on this website as testimonials. We reserve the right to review, edit for clarity, or remove any submitted feedback.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[#e5e2e1] mb-4">5. Revisions and Modifications</h2>
            <p>
              We reserve the right to update these terms at any time without notice. Your continued use of the website following any changes indicates your acceptance of the revised Terms of Service.
            </p>
          </section>
        </div>
      </div>
    </div>
    </>
  );
}
