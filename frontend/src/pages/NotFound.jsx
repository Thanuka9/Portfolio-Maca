import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import PageMeta from '../components/PageMeta';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 text-center pt-24 pb-16">
      <PageMeta title="Page Not Found" description="The page you are looking for does not exist." />
      <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#4b8eff] mb-4">404</span>
      <h1 className="font-display text-4xl md:text-6xl font-bold text-[#e5e2e1] mb-4">
        Page Not Found
      </h1>
      <p className="text-[#c1c6d7] max-w-md mb-10 leading-relaxed">
        The page you requested does not exist or may have been moved. Head back to the portfolio to explore my work.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#4b8eff] text-white font-display font-semibold rounded-sm hover:bg-[#adc6ff] transition-all"
        >
          <Home size={16} />
          Back to Home
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#414755] text-[#e5e2e1] font-display font-semibold rounded-sm hover:border-[#adc6ff] hover:text-[#adc6ff] transition-all"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>
    </main>
  );
}
