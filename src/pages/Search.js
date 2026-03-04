import React, { useState, useEffect } from 'react';
import API from '../api';
import { trackBehavior } from '../api';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid3X3, List, Bed, Bath, Square, Heart, X, ChevronDown } from 'lucide-react';

const C = {
  black: '#0a0a0a', cream: '#f5f3ef', midCream: '#ede9e3',
  gold: '#c9a96e', muted: '#8a8078', white: '#ffffff',
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Jost', sans-serif",
};

const SearchPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', beds: '', baths: '', city: '', propertyType: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    trackBehavior('PAGE_VIEW', { page: 'Search' });
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const query = Object.entries(filters).filter(([_, v]) => v).map(([k, v]) => `${k}=${v}`).join('&');
      const res = await API.get(`/properties?${query}`);
      setProperties(res.data);
    } catch {
      setProperties([
        { _id: '1', price: 15950000, address: '5673 W County Highway', city: 'Santa Rosa Beach', beds: 8, baths: 9, sqft: 6944, status: 'FOR SALE', description: 'Designed by acclaimed architects, this newly completed Gulf-front estate represents one of the most compelling offerings along Florida\'s iconic 30A corridor.', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900'] },
        { _id: '2', price: 19245000, address: '3504 E County Hwy 30A', city: 'Santa Rosa Beach', beds: 9, baths: 10, sqft: 8524, status: 'PENDING', description: 'The pinnacle of Gulf front residential living primely located in Seagrove Beach along scenic County Highway 30A, this pristine new construction yields exceptional resort style amenities.', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900'] },
        { _id: '3', price: 2150000, address: '789 Luxury Lane', city: 'Denver', beds: 5, baths: 4, sqft: 4200, status: 'FOR SALE', description: 'Stunning modern masterpiece in the heart of Denver. Features panoramic mountain views, smart home integration, and a private backyard oasis.', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900'] },
        { _id: '4', price: 1595000, address: '4845 W County Hwy 30A', city: 'Boulder', beds: 6, baths: 5, sqft: 4500, status: 'FOR SALE', description: 'Exceptional contemporary residence offering the finest in luxury living with sweeping views and premier finishes throughout.', images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900'] },
      ]);
    } finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    trackBehavior('SEARCH_FILTER', filters);
    fetchProperties();
    setShowFilters(false);
  };

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.white, minHeight: '100vh' }}>

      {/* ── Hero Banner ── */}
      <section style={{ position: 'relative', height: 480, overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(245,243,239,0.12)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Our Current</p>
          <div style={{ width: 48, height: 1, backgroundColor: C.black, marginBottom: 20 }} />
          <h1 style={{ fontFamily: C.display, fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 300, color: C.white, letterSpacing: '0.05em', lineHeight: 1 }}>
            ACTIVE PROPERTIES
          </h1>
          <button onClick={() => document.getElementById('listings').scrollIntoView({ behavior: 'smooth' })}
            style={{ marginTop: 40, width: 48, height: 48, border: `1px solid ${C.black}`, borderRadius: '50%', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronDown size={20} />
          </button>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <div style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.midCream}`, position: 'sticky', top: 60, zIndex: 40 }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <form onSubmit={handleSearch} className="resp-filter-bar" style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap' }}>

            {/* Search input */}
            <div style={{ flex: 1, minWidth: 260, display: 'flex', alignItems: 'center', gap: 12, padding: '18px 0', borderRight: `1px solid ${C.midCream}`, paddingRight: 24 }}>
              <Search size={16} style={{ color: C.muted, flexShrink: 0 }} />
              <input type="text" placeholder="Search by address"
                style={{ background: 'none', border: 'none', outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, width: '100%' }}
                value={filters.city} onChange={e => setFilters({ ...filters, city: e.target.value })} />
            </div>

            {/* Neighborhood */}
            <div className="resp-filter-hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '18px 24px', borderRight: `1px solid ${C.midCream}`, cursor: 'pointer', minWidth: 200 }}>
              <span style={{ fontFamily: C.body, fontSize: 13, color: C.black }}>Select neighborhood</span>
              <ChevronDown size={16} style={{ color: C.muted }} />
            </div>

            {/* Advanced */}
            <button type="button" onClick={() => setShowFilters(!showFilters)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 24px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 12, letterSpacing: '0.1em', color: C.black, borderRight: `1px solid ${C.midCream}` }}>
              <SlidersHorizontal size={15} /> Advanced Filters
            </button>

            {/* View toggle */}
            <div style={{ display: 'flex', gap: 2, padding: '0 24px', borderRight: `1px solid ${C.midCream}` }}>
              {[['grid', Grid3X3], ['list', List]].map(([v, Icon]) => (
                <button key={v} type="button" onClick={() => setView(v)}
                  style={{ width: 36, height: 36, border: 'none', borderRadius: 4, cursor: 'pointer', backgroundColor: view === v ? C.black : 'transparent', color: view === v ? C.white : C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} />
                </button>
              ))}
            </div>

            <button type="submit"
              style={{ backgroundColor: C.black, color: C.white, padding: '18px 32px', border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', marginLeft: 'auto' }}>
              Search
            </button>
          </form>

          {/* Advanced filters panel */}
          {showFilters && (
            <div style={{ padding: '24px 0', borderTop: `1px solid ${C.midCream}`, display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Price Range */}
              <div>
                <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', color: C.muted, textTransform: 'uppercase', marginBottom: 8 }}>Sales Price</p>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: C.muted }}>{'<$1M'}</span>
                  <input type="range" min="500000" max="25000000" step="500000" style={{ width: 160, accentColor: C.black }}
                    value={filters.minPrice || 500000} onChange={e => setFilters({ ...filters, minPrice: e.target.value })} />
                  <span style={{ fontSize: 12, color: C.muted }}>$25M+</span>
                </div>
              </div>

              {/* Sqft */}
              <div>
                <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', color: C.muted, textTransform: 'uppercase', marginBottom: 8 }}>Sq. Ft.</p>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: C.muted }}>{'<500'}</span>
                  <input type="range" min="500" max="10000" step="500" style={{ width: 160, accentColor: C.black }} />
                  <span style={{ fontSize: 12, color: C.muted }}>10K+</span>
                </div>
              </div>

              {/* Beds */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, marginRight: 4 }}>Beds</span>
                {['Any', '2+', '3+', '4+', '5+'].map(opt => (
                  <button key={opt} type="button" onClick={() => setFilters({ ...filters, beds: opt === 'Any' ? '' : opt[0] })}
                    style={{ padding: '6px 14px', border: `1px solid ${filters.beds === (opt === 'Any' ? '' : opt[0]) ? C.black : C.midCream}`, borderRadius: 40, backgroundColor: filters.beds === (opt === 'Any' ? '' : opt[0]) ? C.black : 'transparent', color: filters.beds === (opt === 'Any' ? '' : opt[0]) ? C.white : C.black, fontFamily: C.body, fontSize: 11, cursor: 'pointer' }}>
                    {opt}
                  </button>
                ))}
              </div>

              <button type="button" onClick={() => { setFilters({ minPrice: '', maxPrice: '', beds: '', baths: '', city: '', propertyType: '' }); setShowFilters(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, marginLeft: 'auto' }}>
                Clear <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      <div id="listings" style={{ maxWidth: 1320, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
          <div>
            <h2 style={{ fontFamily: C.display, fontSize: 36, fontWeight: 300, color: C.black }}>Properties For Sale</h2>
            <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted, marginTop: 4 }}>{properties.length} Results Found</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: C.body, fontSize: 11, color: C.muted, letterSpacing: '0.1em' }}>Sort by:</span>
            <select style={{ fontFamily: C.body, fontSize: 12, border: 'none', outline: 'none', color: C.black, cursor: 'pointer' }}>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 360, backgroundColor: C.cream, borderRadius: 2, animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : view === 'list' ? (
          /* ── Alternating List ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {properties.map((p, i) => (
              <PropertyRow key={p._id} property={p} index={i} />
            ))}
          </div>
        ) : (
          /* ── Grid ── */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 32 }}>
            {properties.map(p => <PropertyGridCard key={p._id} property={p} />)}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

/* ─── Alternating Row Card ─── */
const PropertyRow = ({ property: p, index: i }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/property/${p._id}`}
      className="resp-property-row"
      style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? '55% 45%' : '45% 55%', minHeight: 400, textDecoration: 'none', color: 'inherit', borderBottom: `1px solid ${C.midCream}` }}>

      {/* Image */}
      <div style={{ order: i % 2 === 0 ? 0 : 1, position: 'relative', overflow: 'hidden' }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <img src={p.images[0]} alt={p.address}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease', transform: hovered ? 'scale(1.04)' : 'scale(1)', display: 'block', minHeight: 360 }} />
        <div style={{ position: 'absolute', top: 20, left: 20 }}>
          <span style={{ backgroundColor: C.black, color: C.white, fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '7px 18px', borderRadius: 40 }}>
            {p.status || 'For Sale'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ order: i % 2 === 0 ? 1 : 0, padding: '48px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: i % 2 !== 0 ? C.cream : C.white }}>
        <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, marginBottom: 10 }}>
          {p.city}, Colorado
        </p>
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 400, color: C.black, marginBottom: 6, lineHeight: 1.3 }}>
          {p.address}
        </h3>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 40, fontWeight: 300, color: C.black, marginBottom: 20, lineHeight: 1 }}>
          ${p.price.toLocaleString()}
        </p>

        {/* Property stats - pill badges */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
          {[[Bed, `${p.beds} Beds`], [Bath, `${p.baths} Baths`], [Square, `${p.sqft?.toLocaleString()} Sq.Ft.`]].map(([Icon, label], j) => (
            <span key={j} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: C.black, color: C.white, fontFamily: "'Jost', sans-serif", fontSize: 11, padding: '7px 16px', borderRadius: 40 }}>
              <Icon size={13} /> {label}
            </span>
          ))}
        </div>

        {p.description && (
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, lineHeight: 1.8, color: '#5a5248', marginBottom: 28,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {p.description}
          </p>
        )}

        <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.black, display: 'inline-flex', alignItems: 'center', gap: 10, border: `1px solid ${C.black}`, padding: '10px 24px', borderRadius: 40, width: 'fit-content', transition: 'all 0.2s' }}>
          Property Details —
        </span>
      </div>
    </Link>
  );
};

/* ─── Grid Card ─── */
const PropertyGridCard = ({ property: p }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/property/${p._id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block', backgroundColor: C.white }}>
      <div style={{ position: 'relative', overflow: 'hidden', marginBottom: 16 }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <img src={p.images[0]} alt={p.address}
          style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease', transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
        <span style={{ position: 'absolute', top: 16, left: 16, backgroundColor: C.black, color: C.white, fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '6px 16px', borderRadius: 40 }}>
          {p.status || 'For Sale'}
        </span>
        <button style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hovered ? 1 : 0, transition: 'opacity 0.2s' }}>
          <Heart size={15} />
        </button>
      </div>
      <div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: C.black, marginBottom: 4 }}>
          ${p.price.toLocaleString()}
        </p>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: C.black, marginBottom: 2 }}>{p.address}</p>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: C.muted, marginBottom: 14 }}>{p.city}, Colorado</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[[Bed, `${p.beds} Beds`], [Bath, `${p.baths} Baths`], [Square, `${p.sqft?.toLocaleString()} Sq.Ft.`]].map(([Icon, label], j) => (
            <span key={j} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: C.black, color: C.white, fontFamily: "'Jost', sans-serif", fontSize: 10, padding: '5px 12px', borderRadius: 40 }}>
              <Icon size={11} /> {label}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default SearchPage;