import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[90] glass-panel rounded-xl p-5 border border-[#414755]/50 shadow-2xl"
    >
      <p className="text-[#c1c6d7] text-sm leading-relaxed mb-4">
        This site uses essential cookies for form functionality and basic preferences. See our{' '}
        <Link to="/cookie-policy" className="text-[#adc6ff] hover:underline">
          Cookie Policy
        </Link>{' '}
        for details.
      </p>
      <button
        type="button"
        onClick={accept}
        className="w-full sm:w-auto px-6 py-2.5 bg-[#4b8eff] text-white font-display font-semibold text-sm rounded-sm hover:bg-[#adc6ff] transition-all"
      >
        Accept
      </button>
    </div>
  );
}
