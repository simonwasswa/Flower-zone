import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Opens each new page at the top, or at its #section when the link has one.
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }

    // Sections can render after their data loads, so keep looking briefly.
    let attempts = 0;
    let timer = 0;
    function scrollToHash() {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (attempts++ < 20) timer = window.setTimeout(scrollToHash, 100);
    }
    scrollToHash();
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
