import { useEffect } from 'react';

/**
 * useLenis — lightweight Lenis smooth scroll hook
 * Installs Lenis and exposes the instance on `window.__lenis` so other code
 * can call `window.__lenis.scrollTo(...)` when needed (e.g. route changes).
 * Install: `npm install lenis`
 */
const useLenis = () => {
  useEffect(() => {
    let lenis = null;
    let rafId = null;

    const init = async () => {
      try {
        const { default: Lenis } = await import('lenis');

        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo easing
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          infinite: false,
        });

        // expose to window so other components can call scrollTo
        try {
          // eslint-disable-next-line no-undef
          window.__lenis = lenis;
        } catch (e) {
          // ignore when window not available
        }

        const loop = (time) => {
          if (lenis) lenis.raf(time);
          rafId = requestAnimationFrame(loop);
        };
        rafId = requestAnimationFrame(loop);
      } catch (err) {
        // Lenis not installed — silent fallback to native scroll
        // eslint-disable-next-line no-console
        console.warn('Lenis not found. Run: npm install lenis');
      }
    };

    init();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
      try {
        // remove global reference
        // eslint-disable-next-line no-undef
        if (window && window.__lenis) delete window.__lenis;
      } catch (e) {
        // ignore
      }
    };
  }, []);
};

export default useLenis;