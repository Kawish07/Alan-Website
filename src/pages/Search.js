import React, { useEffect, useRef } from 'react';
import { trackBehavior } from '../api';

const C = {
  navy: '#1B2A4A',
  navyDark: '#0F172A',
  accent: '#C4956A',
  accentLight: '#D4A97A',
  coolWhite: '#F8FAFC',
  slateDark: '#1E293B',
  slateBorder: '#E2E8F0',
  white: '#ffffff',
  display: "'Montserrat', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
};

const SearchPage = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    trackBehavior('PAGE_VIEW', { page: 'Search' });
  }, []);

  useEffect(() => {
    if (window.MBB && typeof window.MBB.loaded === 'function') {
      window.MBB.loaded();
    }
  }, []);

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', backgroundColor: C.coolWhite, fontFamily: C.body }}>

      {/* Page Header Banner */}
      <div style={{ backgroundColor: C.navyDark, paddingTop: 110, paddingBottom: 48, paddingLeft: 32, paddingRight: 32 }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 12, letterSpacing: '0.08em' }}>Home</a>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>›</span>
            <span style={{ color: C.accentLight, fontSize: 12, letterSpacing: '0.08em', fontWeight: 500 }}>Property Search</span>
          </div>
          <h1 style={{ fontFamily: C.display, fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600, color: C.white, margin: '0 0 12px', lineHeight: 1.15 }}>
            Denver Metro Listings
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, margin: 0, letterSpacing: '0.02em' }}>
            Search live MLS listings across Denver, Aurora, Cherry Creek, and Colorado
          </p>
        </div>
      </div>

      {/* Widget Container */}
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '40px 32px 80px' }}>
        <bb-widget data-type="ListingResults"></bb-widget>
      </div>

    </div>
  );
};

export default SearchPage;