import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, MapPin, Home as HomeIcon, X } from 'lucide-react';
import { trackBehavior } from '../api';
import ListingAlertForm from '../components/ListingAlertForm';

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
  display: "'Playfair Display', Georgia, serif",
  body: "'Nunito Sans', system-ui, sans-serif",
};

// ─────────────────────────────────────────────────────────────────────────────
// NEIGHBORHOOD → ZIP CODE MAP
// Alan: replace the zip codes below once you confirm your full list.
// Multiple zips per neighborhood should be comma-separated, e.g. '80231,80014'
// ─────────────────────────────────────────────────────────────────────────────
const NEIGHBORHOODS = [
  // Aurora
  { name: 'Aurora Southeast',    area: 'Aurora',      zips: '80013,80014,80015,80016' },
  { name: 'Aurora Central',      area: 'Aurora',      zips: '80010,80011,80012'       },
  { name: 'Green Valley Ranch',  area: 'Aurora',      zips: '80019,80239'             },
  { name: 'Saddle Rock / Tallyn\'s Reach', area: 'Aurora', zips: '80016'            },
  // Denver
  { name: 'Cherry Creek',        area: 'Denver',      zips: '80206,80209,80246'       },
  { name: 'Washington Park',     area: 'Denver',      zips: '80209,80210'             },
  { name: 'Highlands / LoHi',    area: 'Denver',      zips: '80211,80212'             },
  { name: 'Central Park',        area: 'Denver',      zips: '80238'                   },
  { name: 'Park Hill',           area: 'Denver',      zips: '80207,80220'             },
  { name: 'Downtown Denver',     area: 'Denver',      zips: '80202,80203,80204'       },
  { name: 'Five Points / RiNo',  area: 'Denver',      zips: '80205'                   },
  { name: 'Platt Park',          area: 'Denver',      zips: '80210'                   },
  // South Metro
  { name: 'Centennial',          area: 'South Metro', zips: '80112,80121,80122'       },
  { name: 'Englewood',           area: 'South Metro', zips: '80110,80111'             },
  { name: 'Highlands Ranch',     area: 'South Metro', zips: '80126,80129,80130'       },
  { name: 'Lone Tree',           area: 'South Metro', zips: '80124'                   },
  { name: 'Parker',              area: 'South Metro', zips: '80134,80138'             },
  // West Metro
  { name: 'Lakewood',            area: 'West Metro',  zips: '80214,80226,80227,80228' },
  { name: 'Arvada',              area: 'West Metro',  zips: '80002,80003,80004,80005' },
  { name: 'Westminster',         area: 'West Metro',  zips: '80021,80023,80030,80031' },
  { name: 'Wheat Ridge',         area: 'West Metro',  zips: '80033,80212'             },
];

const AREAS = ['Aurora', 'Denver', 'South Metro', 'West Metro'];

const SearchPage = () => {
  const containerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [filterArea, setFilterArea] = useState('All');

  // Parse URL search params passed from the hero search bar
  const urlParams = new URLSearchParams(location.search);
  const searchCity         = urlParams.get('city')         || '';
  const searchZip          = urlParams.get('zip')          || '';
  const searchNeighborhood = urlParams.get('neighborhood') || '';
  const searchMinPrice     = urlParams.get('minPrice')     || '';
  const searchMaxPrice     = urlParams.get('maxPrice')     || '';
  const searchBeds         = urlParams.get('beds')         || '';
  const searchBaths        = urlParams.get('baths')        || '';

  const hasFilters = searchCity || searchZip || searchMinPrice || searchMaxPrice || searchBeds || searchBaths;

  // Derive active neighborhood and its zip codes
  const activeHood  = NEIGHBORHOODS.find(n => n.name === searchNeighborhood) || null;
  const listingZips = activeHood?.zips || '';

  const selectNeighborhood = (name) => {
    if (searchNeighborhood === name) {
      navigate('/search');
    } else {
      navigate(`/search?neighborhood=${encodeURIComponent(name)}`);
      setTimeout(() => {
        document.getElementById('listings-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
    trackBehavior('SEARCH_FILTER', { filter: 'neighborhood', value: name });
  };

  useEffect(() => {
    trackBehavior('PAGE_VIEW', { page: 'Search' });
  }, []);

  // Signal BB that widgets are ready on page mount
  useEffect(() => {
    if (window.MBB && typeof window.MBB.loaded === 'function') {
      window.MBB.loaded();
    }
  }, []);

  // When a neighborhood is selected, wait for BB to render then
  // programmatically inject the zip codes into BB's own search input and click View
  useEffect(() => {
    // Re-init BB widgets after React remount
    const initTimer = setTimeout(() => {
      if (window.MBB && typeof window.MBB.loaded === 'function') {
        window.MBB.loaded();
      }
    }, 300);

    if (!listingZips) return () => clearTimeout(initTimer);

    let attempts = 0;
    const injectZips = () => {
      attempts++;
      const section = document.getElementById('listings-section');
      if (!section) { if (attempts < 40) setTimeout(injectZips, 500); return; }

      // Find all text inputs inside the listings section (BB renders its own search bar)
      const inputs = section.querySelectorAll('input[type="text"], input:not([type="submit"]):not([type="hidden"]):not([type="checkbox"]):not([type="radio"])');
      const viewBtns = section.querySelectorAll('button');

      // Pick the first visible text input and the View button
      const searchInput = Array.from(inputs).find(el => el.offsetParent !== null);
      const viewBtn = Array.from(viewBtns).find(btn => btn.textContent.includes('View') && btn.offsetParent !== null);

      if (!searchInput || !viewBtn) {
        if (attempts < 40) setTimeout(injectZips, 500);
        return;
      }

      // Use native setter so BB's internal state picks up the change
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(searchInput, listingZips.replace(/,/g, ', '));
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));

      // Click View after a short delay
      setTimeout(() => viewBtn.click(), 400);
    };

    // Wait for BB to fully render before attempting injection
    const fillTimer = setTimeout(injectZips, 1500);

    return () => { clearTimeout(initTimer); clearTimeout(fillTimer); };
  }, [listingZips]);

  // Pre-fill and submit BB's SearchForm using the URL params from the hero
  useEffect(() => {
    if (!hasFilters) return;

    const query = searchCity || searchZip;

    let attempts = 0;
    const tryFill = () => {
      attempts++;

      const formWidget = document.querySelector('bb-widget[data-type="SearchForm"]');
      if (!formWidget) {
        if (attempts < 30) setTimeout(tryFill, 400);
        return;
      }

      // Find BB's location text input
      const textInput = formWidget.querySelector('input[type="text"], input:not([type="submit"]):not([type="hidden"]):not([type="checkbox"])');
      // Find BB's "View" / submit button
      const viewBtn = formWidget.querySelector('button');

      if (!textInput || !viewBtn) {
        if (attempts < 30) setTimeout(tryFill, 400);
        return;
      }

      // Inject query into the input in a way React/BB's internal state picks up
      if (query) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(textInput, query);
        textInput.dispatchEvent(new Event('input',  { bubbles: true }));
        textInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Short delay then click View to trigger BB's search
      setTimeout(() => viewBtn.click(), 300);
    };

    // Wait for MBB to set up the widget DOM before polling
    setTimeout(tryFill, 1200);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div ref={containerRef} style={{ minHeight: '100vh', backgroundColor: C.white, fontFamily: C.body }}>

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
                fontFamily: C.display, fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600,
                color: C.white, margin: '0 0 12px', lineHeight: 1.1, fontStyle: 'italic',
              }}>
                {searchNeighborhood
                  ? <><span style={{ fontStyle: 'normal' }}>Homes in </span>{searchNeighborhood}</>                  : searchCity ? `Properties in ${searchCity}`
                  : searchZip ? `Properties near ${searchZip}`
                  : 'Denver Metro Listings'}
              </h1>
              {searchNeighborhood && activeHood && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <MapPin size={13} style={{ color: C.accent }} />
                  <span style={{ color: C.accentLight, fontSize: 13, fontWeight: 600 }}>Zip codes: {activeHood.zips}</span>
                </div>
              )}
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0, maxWidth: 520, lineHeight: 1.6 }}>
                {searchNeighborhood
                  ? `Live MLS listings filtered to ${searchNeighborhood} · Updated in real time`
                  : searchCity || searchZip
                  ? `Showing live MLS listings${searchBeds ? ` · ${searchBeds}+ beds` : ''}${searchMinPrice ? ` · $${parseInt(searchMinPrice).toLocaleString()}+` : ''}`
                  : 'Browse live MLS properties across Denver, Aurora, Lakewood, Cherry Creek, and all of Colorado.'}
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

      {/* ── Browse by Neighborhood ── */}
      <div style={{ backgroundColor: C.coolWhite, borderBottom: `1px solid ${C.slateBorder}`, padding: '24px 32px 20px' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={15} style={{ color: C.accent }} />
              <span style={{ fontFamily: C.body, fontSize: 12, fontWeight: 700, color: C.slateDark, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Browse by Neighborhood</span>
            </div>
            {/* Area filter tabs */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginLeft: 'auto' }}>
              {['All', ...AREAS].map(area => (
                <button key={area} onClick={() => setFilterArea(area)} style={{
                  fontFamily: C.body, fontSize: 11, padding: '5px 14px', borderRadius: 20,
                  border: `1px solid ${filterArea === area ? C.navy : C.slateBorder}`,
                  backgroundColor: filterArea === area ? C.navy : C.white,
                  color: filterArea === area ? C.white : C.slateMed,
                  cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}>{area}</button>
              ))}
              {searchNeighborhood && (
                <button onClick={() => navigate('/search')} style={{
                  fontFamily: C.body, fontSize: 11, padding: '5px 14px', borderRadius: 20,
                  border: `1px solid ${C.slateBorder}`, backgroundColor: C.white,
                  color: C.slateLight, cursor: 'pointer', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <X size={11} /> Clear filter
                </button>
              )}
            </div>
          </div>

          {/* Neighborhood pills grouped by area */}
          {(filterArea === 'All' ? AREAS : [filterArea]).map(area => (
            <div key={area} style={{ marginBottom: 12 }}>
              <p style={{ fontFamily: C.body, fontSize: 10, fontWeight: 700, color: C.slateLight, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 8px' }}>{area}</p>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {NEIGHBORHOODS.filter(n => n.area === area).map(hood => {
                  const isActive = searchNeighborhood === hood.name;
                  return (
                    <button key={hood.name} onClick={() => selectNeighborhood(hood.name)} style={{
                      fontFamily: C.body, fontSize: 12, fontWeight: isActive ? 700 : 500,
                      padding: '7px 16px', borderRadius: 20,
                      border: `1px solid ${isActive ? C.accent : C.slateBorder}`,
                      backgroundColor: isActive ? C.navy : C.white,
                      color: isActive ? C.white : C.slateDark,
                      cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
                      boxShadow: isActive ? '0 2px 8px rgba(27,42,74,0.18)' : 'none',
                    }}
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = C.navy; e.currentTarget.style.color = C.navy; }}}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = C.slateBorder; e.currentTarget.style.color = C.slateDark; }}}>
                      {hood.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Search Form Section ── */}
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '32px 32px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 4, height: 28, backgroundColor: C.accent, borderRadius: 2 }} />
          <h2 style={{ fontFamily: C.display, fontSize: 18, fontWeight: 600, color: C.slateDark, margin: 0 }}>
            {searchNeighborhood ? `Search within ${searchNeighborhood}` : 'Search All Properties'}
          </h2>
        </div>
        <bb-widget data-type="SearchForm"></bb-widget>
      </div>

      {/* ── Listings Section ── */}
      <div id="listings-section" style={{ maxWidth: 1320, margin: '0 auto', padding: '40px 32px 80px' }}>
        {/* Section title bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${C.slateBorder}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 4, height: 28, backgroundColor: C.accent, borderRadius: 2 }} />
            <h2 style={{ fontFamily: C.display, fontSize: 20, fontWeight: 600, color: C.slateDark, margin: 0 }}>
              {searchNeighborhood ? `Homes in ${searchNeighborhood}` : 'Available Properties'}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {searchNeighborhood && activeHood && (
              <span style={{ fontSize: 12, color: C.accent, fontWeight: 600, fontFamily: C.body }}>
                📍 Zips: {activeHood.zips}
              </span>
            )}
            <p style={{ fontSize: 13, color: C.slateLight, margin: 0 }}>
              Powered by Colorado MLS · Updated in real time
            </p>
          </div>
        </div>

        {/* BB ListingResults widget */}
        <div key={listingZips || 'all-denver'}>
          <bb-widget data-type="ListingResults"></bb-widget>
        </div>

        {/* ═══ LISTING ALERT SIGN-UP ═══ */}
        <div style={{ maxWidth: 760, margin: '48px auto 40px', padding: '0 24px' }}>
          <ListingAlertForm source="Search Page" compact />
        </div>

      </div>

    </div>
  );
};

export default SearchPage;