import { useEffect } from 'react';
import { site } from '../config/site';

const DEFAULT_TITLE = site.title;
const DEFAULT_DESCRIPTION =
  'Based in Kandy, Sri Lanka — I create engaging, polished, and visually powerful videos for digital platforms, brands, and content creators worldwide.';

export default function PageMeta({ title, description = DEFAULT_DESCRIPTION }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${site.name}` : DEFAULT_TITLE;
    document.title = fullTitle;

    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', fullTitle);

    const twitterDesc = document.querySelector('meta[property="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', description);

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description]);

  return null;
}
