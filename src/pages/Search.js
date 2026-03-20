import React, { useEffect, useState } from 'react';
import { trackBehavior } from '../api';

const IDX_URL = 'https://matrix.recolorado.com/Matrix/public/IDX.aspx?idx=b094320f&p_search_type=city&p_city=Denver&p_state=CO&p_property_type=RES';

const SearchPage = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    trackBehavior('PAGE_VIEW', { page: 'Search' });
  }, []);

  return (
    <div style={{ paddingTop: 70, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

      {/* Loading skeleton — shown until iframe fires onLoad */}
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0, top: 70,
          backgroundColor: '#F8FAFC',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 16, zIndex: 10,
        }}>
          {/* Animated pulse bars */}
          <div style={{ width: 48, height: 48, border: '4px solid #E2E8F0', borderTop: '4px solid #1B2A4A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#94A3B8', margin: 0 }}>Loading Colorado listings…</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '90%', maxWidth: 900, marginTop: 24 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: 80, backgroundColor: '#E2E8F0', borderRadius: 8, animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
          `}</style>
        </div>
      )}

      <iframe
        src={IDX_URL}
        title="Colorado MLS Property Search"
        style={{
          flex: 1, display: 'block', border: 'none', width: '100%', height: '100%',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
        frameBorder="0"
        scrolling="yes"
        allowFullScreen
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

export default SearchPage;
