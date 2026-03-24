import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react';
import { trackBehavior } from '../api';

const C = {
  navy: '#1B2A4A',
  navyDark: '#0F172A',
  accent: '#C4956A',
  accentLight: '#D4A97A',
  coolWhite: '#F8FAFC',
  slateDark: '#1E293B',
  slateLight: '#94A3B8',
  slateBorder: '#E2E8F0',
  white: '#ffffff',
  display: "'Montserrat', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
};

const ListingDetails = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    trackBehavior('PAGE_VIEW', { page: 'ListingDetails' });
  }, []);

  useEffect(() => {
    if (window.MBB && typeof window.MBB.loaded === 'function') {
      window.MBB.loaded();
    }
  }, []);

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', backgroundColor: C.coolWhite, fontFamily: C.body }}>

      {/* Header bar */}
      <div style={{ backgroundColor: C.navyDark, paddingTop: 90, paddingBottom: 24, paddingLeft: 32, paddingRight: 32 }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              <HomeIcon size={13} /> Home
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>/</span>
            <Link to="/listing-results" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
              Listings
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>/</span>
            <span style={{ color: C.accentLight, fontWeight: 500 }}>Property Details</span>
          </nav>
        </div>
      </div>

      {/* Property detail widget */}
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '32px 32px 80px' }}>
        <bb-widget data-type="SearchDetails"></bb-widget>
      </div>

    </div>
  );
};

export default ListingDetails;
