import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../api';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Reset Lenis smooth-scroll instance (it hijacks native scroll)
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }

    // 2. Force native scroll reset as fallback
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 3. Extra safety — some browsers need a micro-delay after Lenis reset
    const timer = setTimeout(() => {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true });
      }
      window.scrollTo(0, 0);
    }, 50);

    // 4. Track page view on every route change
    trackPageView(pathname);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
