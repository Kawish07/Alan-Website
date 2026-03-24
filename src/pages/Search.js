import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Home as HomeIcon } from 'lucide-react';
import { trackBehavior } from '../api';

const C = {
  navy: '#1B2A4A',
  navyDark: '#0F172A',
  navyLight: '#243B6A',
  accent: '#C4956A',
  accentLight: '#D4A97A',
  coolWhite: '#F8FAFC',
  slateDark: '#1E293B',
  slateMed: '#475569',
  slateLight: '#94A3B8',
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

      {/* ── Hero Banner ── */}
      <div style={{
        background: `linear-gradient(135deg, ${C.navyDark} 0%, ${C.navy} 60%, ${C.navyLight} 100%)`,
        paddingTop: 120, paddingBottom: 56, paddingLeft: 32, paddingRight: 32,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(196,149,106,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -120, left: -60, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(196,149,106,0.05)' }} />

        <div style={{ maxWidth: 1320, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13 }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              <HomeIcon size={13} /> Home
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>/</span>
            <span style={{ color: C.accentLight, fontWeight: 500 }}>Property Search</span>
          </nav>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <h1 style={{
                fontFamily: C.display, fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 600,
                color: C.white, margin: '0 0 14px', lineHeight: 1.1,
              }}>
                Denver Metro Listings
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: 0, maxWidth: 520, lineHeight: 1.6 }}>
                Browse live MLS properties across Denver, Aurora, Lakewood, Cherry Creek, and all of Colorado.
              </p>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'flex', gap: 32 }}>
              {[{ n: 'Denver', icon: MapPin }, { n: 'MLS Live', icon: Search }].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <s.icon size={18} style={{ color: C.accent, marginBottom: 6 }} />
                  <p style={{ color: C.white, fontSize: 13, fontWeight: 500, margin: 0 }}>{s.n}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Listings Section ── */}
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '40px 32px 80px' }}>
        {/* Section title bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${C.slateBorder}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 4, height: 28, backgroundColor: C.accent, borderRadius: 2 }} />
            <h2 style={{ fontFamily: C.display, fontSize: 20, fontWeight: 600, color: C.slateDark, margin: 0 }}>
              Available Properties
            </h2>
          </div>
          <p style={{ fontSize: 13, color: C.slateLight, margin: 0 }}>
            Powered by Colorado MLS · Updated in real time
          </p>
        </div>

        <bb-widget data-type="ListingResults"></bb-widget>
      </div>

    </div>
  );
};

export default SearchPage;