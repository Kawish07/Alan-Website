import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, ArrowRight, Phone, Award, TrendingUp, Shield,
  Star, Quote, Bed, Bath, Square,
  Home as HomeIcon, DollarSign, BarChart3, Key
} from 'lucide-react';
import API from '../api';
import { trackBehavior, trackPhoneClick, trackPageView } from '../api';

/* ─── style constants ─── */
const C = {
  black: '#0a0a0a',
  cream: '#f5f3ef',
  midCream: '#ede9e3',
  gold: '#c9a96e',
  muted: '#8a8078',
  white: '#ffffff',
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Jost', sans-serif",
};

const Home = () => {
  const [mlsCity, setMlsCity] = useState('');
  const [mlsMinPrice, setMlsMinPrice] = useState('');
  const [mlsMaxPrice, setMlsMaxPrice] = useState('');
  const [mlsBeds, setMlsBeds] = useState('');
  const [mlsType, setMlsType] = useState('buy');
  const [featuredListings, setFeaturedListings] = useState([]);
  const [mlsListings, setMlsListings] = useState([]);
  const [mlsLoading, setMlsLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [videoSrc, setVideoSrc] = useState((typeof window !== 'undefined' && window.location.origin) + '/videos/hero.mp4');

  useEffect(() => { trackPageView('Home'); }, []);

  const heroSlides = [
    {
      label: "Experience Colorado's Finest Properties",
      title: 'For Those Who\nSeek An Exceptional Life',
    },
    {
      label: 'Contemporary Homes for Discerning Buyers',
      title: 'Modern Elegance\nRedefined',
    },
    {
      label: 'Your Dream Home Awaits',
      title: 'Mountain Retreats\nBeyond Compare',
    },
  ];

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await API.get('/properties?featured=true&limit=4');
        if (res.data?.length > 0) { setFeaturedListings(res.data); return; }
      } catch {}
      setFeaturedListings([
        { _id: '1', price: 1295000, address: '5673 E Colfax Ave', city: 'Denver', beds: 5, baths: 4, sqft: 3800, status: 'FOR SALE', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'] },
        { _id: '2', price: 875000, address: '1204 S Pearl St', city: 'Denver', beds: 4, baths: 3, sqft: 2850, status: 'FOR SALE', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'] },
        { _id: '3', price: 2150000, address: '123 Mountain Vista Dr', city: 'Boulder', beds: 5, baths: 4, sqft: 4200, status: 'FOR SALE', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'] },
        { _id: '4', price: 725000, address: '4845 W Alameda Ave', city: 'Lakewood', beds: 3, baths: 2, sqft: 2200, status: 'FOR SALE', images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'] },
      ]);
    };
    const fetchMlsFeed = async () => {
      setMlsLoading(true);
      try {
        const res = await API.get('/properties?limit=12');
        if (res.data?.length > 0) { setMlsListings(res.data); } else { setMlsDefaultListings(); }
      } catch { setMlsDefaultListings(); }
      setMlsLoading(false);
    };
    fetchListings();
    fetchMlsFeed();
    const t = setInterval(() => setActiveSlide(p => (p + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const setMlsDefaultListings = () => {
    setMlsListings([
      { _id: '1', price: 1295000, address: '5673 E Colfax Ave', city: 'Denver', beds: 5, baths: 4, sqft: 3800, status: 'FOR SALE', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'] },
      { _id: '2', price: 875000, address: '1204 S Pearl St', city: 'Denver', beds: 4, baths: 3, sqft: 2850, status: 'FOR SALE', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'] },
      { _id: '3', price: 2150000, address: '123 Mountain Vista Dr', city: 'Boulder', beds: 5, baths: 4, sqft: 4200, status: 'FOR SALE', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'] },
      { _id: '4', price: 725000, address: '4845 W Alameda Ave', city: 'Lakewood', beds: 3, baths: 2, sqft: 2200, status: 'FOR SALE', images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'] },
      { _id: '5', price: 549000, address: '789 Columbine St', city: 'Denver', beds: 3, baths: 2, sqft: 1850, status: 'FOR SALE', images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'] },
      { _id: '6', price: 1750000, address: '456 Mapleton Ave', city: 'Boulder', beds: 4, baths: 3, sqft: 3400, status: 'FOR SALE', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'] },
      { _id: '7', price: 425000, address: '321 Elm St', city: 'Aurora', beds: 3, baths: 2, sqft: 1600, status: 'FOR SALE', images: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'] },
      { _id: '8', price: 985000, address: '1010 Highlands Dr', city: 'Denver', beds: 4, baths: 3, sqft: 2900, status: 'FOR SALE', images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'] },
    ]);
  };

  const handleMlsSearch = () => {
    const params = new URLSearchParams();
    if (mlsCity) params.set('city', mlsCity);
    if (mlsMinPrice) params.set('minPrice', mlsMinPrice);
    if (mlsMaxPrice) params.set('maxPrice', mlsMaxPrice);
    if (mlsBeds) params.set('beds', mlsBeds);
    trackBehavior('SEARCH_FILTER', { city: mlsCity, minPrice: mlsMinPrice, maxPrice: mlsMaxPrice, beds: mlsBeds, type: mlsType });
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.white, color: C.black }}>

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        {/* Background video */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <video
            key={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            onError={() => {
              const backupVideo = (typeof window !== 'undefined' && window.location.origin) + '/videos/video.mp4';
              if (videoSrc.includes('/videos/hero.mp4')) {
                setVideoSrc(backupVideo);
              }
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.08) 0%, rgba(10,10,10,0.15) 50%, rgba(10,10,10,0.25) 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 20 }}>
            {heroSlides[activeSlide].label}
          </p>
          <h1 style={{ fontFamily: C.display, fontSize: 'clamp(44px, 7vw, 88px)', fontWeight: 300, color: C.white, lineHeight: 1.1, marginBottom: 40, whiteSpace: 'pre-line' }}>
            {heroSlides[activeSlide].title}
          </h1>

          {/* ── MLS Search Bar ── */}
          <div style={{ width: '100%', maxWidth: 960 }}>
            {/* Buy/Rent toggle tabs */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 0 }}>
              {['buy', 'rent', 'sold'].map(tab => (
                <button key={tab} onClick={() => setMlsType(tab)}
                  style={{
                    fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500,
                    padding: '12px 28px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                    backgroundColor: mlsType === tab ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
                    color: mlsType === tab ? C.black : 'rgba(255,255,255,0.8)',
                    borderRadius: tab === 'buy' ? '6px 0 0 0' : tab === 'sold' ? '0 6px 0 0' : '0',
                    backdropFilter: 'blur(8px)',
                  }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Search fields row */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', borderRadius: '0 6px 6px 6px', overflow: 'hidden' }}>
              <div className="resp-hero-search" style={{ display: 'flex', flexWrap: 'wrap' }}>
                {/* Location */}
                <div style={{ flex: '2 1 200px', display: 'flex', alignItems: 'center', padding: '0 20px', borderRight: '1px solid #e8e4de', minHeight: 56 }}>
                  <MapPin size={16} style={{ color: C.gold, marginRight: 10, flexShrink: 0 }} />
                  <input type="text" placeholder="City, Address, or ZIP..."
                    style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontFamily: C.body, fontSize: 14, color: C.black, padding: '16px 0' }}
                    value={mlsCity} onChange={e => setMlsCity(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleMlsSearch()} />
                </div>
                {/* Price Range */}
                <div style={{ flex: '1 1 140px', display: 'flex', alignItems: 'center', padding: '0 12px', borderRight: '1px solid #e8e4de', gap: 4 }}>
                  <DollarSign size={14} style={{ color: C.gold, flexShrink: 0 }} />
                  <select value={mlsMinPrice} onChange={e => setMlsMinPrice(e.target.value)}
                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, padding: '16px 0', cursor: 'pointer', appearance: 'none' }}>
                    <option value="">Min Price</option>
                    <option value="200000">$200k</option>
                    <option value="400000">$400k</option>
                    <option value="600000">$600k</option>
                    <option value="800000">$800k</option>
                    <option value="1000000">$1M</option>
                    <option value="1500000">$1.5M</option>
                    <option value="2000000">$2M+</option>
                  </select>
                  <span style={{ color: C.muted, fontSize: 12 }}>–</span>
                  <select value={mlsMaxPrice} onChange={e => setMlsMaxPrice(e.target.value)}
                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, padding: '16px 0', cursor: 'pointer', appearance: 'none' }}>
                    <option value="">Max</option>
                    <option value="400000">$400k</option>
                    <option value="600000">$600k</option>
                    <option value="800000">$800k</option>
                    <option value="1000000">$1M</option>
                    <option value="1500000">$1.5M</option>
                    <option value="2000000">$2M</option>
                    <option value="5000000">$5M+</option>
                  </select>
                </div>
                {/* Beds */}
                <div style={{ flex: '0 1 110px', display: 'flex', alignItems: 'center', padding: '0 12px', borderRight: '1px solid #e8e4de' }}>
                  <Bed size={14} style={{ color: C.gold, marginRight: 8, flexShrink: 0 }} />
                  <select value={mlsBeds} onChange={e => setMlsBeds(e.target.value)}
                    style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, padding: '16px 0', cursor: 'pointer', appearance: 'none' }}>
                    <option value="">Beds</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>
                {/* Search Button */}
                <button onClick={handleMlsSearch}
                  style={{ flex: '0 0 auto', backgroundColor: C.gold, color: C.white, padding: '0 32px', border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s', minHeight: 56 }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = C.black}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = C.gold}>
                  <Search size={16} /> Search MLS
                </button>
              </div>
            </div>

            {/* Quick links */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
              {[
                { label: 'Denver', city: 'Denver' },
                { label: 'Boulder', city: 'Boulder' },
                { label: 'Aurora', city: 'Aurora' },
                { label: 'Lakewood', city: 'Lakewood' },
                { label: 'Colorado Springs', city: 'Colorado Springs' },
              ].map(q => (
                <button key={q.label} onClick={() => { window.location.href = `/search?city=${encodeURIComponent(q.city)}`; }}
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 16px', fontFamily: C.body, fontSize: 11, color: 'rgba(255,255,255,0.8)', cursor: 'pointer', borderRadius: 20, transition: 'all 0.2s', letterSpacing: '0.05em', backdropFilter: 'blur(6px)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}>
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Slide dots */}
          <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10 }}>
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setActiveSlide(i)}
                style={{ width: i === activeSlide ? 40 : 8, height: 2, backgroundColor: i === activeSlide ? C.white : 'rgba(255,255,255,0.35)', border: 'none', cursor: 'pointer', borderRadius: 2, transition: 'all 0.4s', padding: 0 }} />
            ))}
          </div>
        </div>
      </section>



      {/* ═══ MLS LISTING FEED ═══ */}
      <section style={{ padding: '80px 0', backgroundColor: C.white }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.4)' }} />
                <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted }}>Live MLS Feed</p>
              </div>
              <h2 style={{ fontFamily: C.display, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, color: C.black, lineHeight: 1.15 }}>
                Latest Colorado Listings
              </h2>
            </div>
            <Link to="/search"
              style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.black, textDecoration: 'none', border: `1px solid ${C.black}`, padding: '12px 28px', borderRadius: 40, display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'all 0.3s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.black; e.currentTarget.style.color = C.white; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = C.black; }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {/* MLS Grid */}
          {mlsLoading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ width: 40, height: 40, border: `2px solid ${C.midCream}`, borderTopColor: C.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
              <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted }}>Loading MLS listings...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <div className="resp-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {mlsListings.slice(0, 8).map((p) => (
                <Link key={p._id} to={`/property/${p._id}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block', backgroundColor: C.white, border: `1px solid ${C.midCream}`, overflow: 'hidden', transition: 'transform 0.3s, box-shadow 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  {/* Image */}
                  <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                    <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'} alt={p.address}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                    <div style={{ position: 'absolute', top: 10, left: 10 }}>
                      <span style={{ backgroundColor: C.black, color: C.white, fontFamily: C.body, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 3 }}>
                        {p.status || 'For Sale'}
                      </span>
                    </div>
                    <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
                      <span style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: C.white, fontFamily: C.display, fontSize: 20, fontWeight: 400, padding: '4px 12px', borderRadius: 3, backdropFilter: 'blur(4px)' }}>
                        ${p.price?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {/* Info */}
                  <div style={{ padding: '16px 16px 20px' }}>
                    <h3 style={{ fontFamily: C.body, fontSize: 14, fontWeight: 500, color: C.black, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.address}
                    </h3>
                    <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted, marginBottom: 12 }}>{p.city}, Colorado</p>
                    <div style={{ display: 'flex', gap: 16, borderTop: `1px solid ${C.midCream}`, paddingTop: 12 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: C.body, fontSize: 12, color: C.muted }}>
                        <Bed size={13} /> {p.beds}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: C.body, fontSize: 12, color: C.muted }}>
                        <Bath size={13} /> {p.baths}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: C.body, fontSize: 12, color: C.muted }}>
                        <Square size={13} /> {p.sqft?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* MLS attribution */}
          <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <img src="/Recolorado_Logo.jpg" alt="reColorado MLS" style={{ height: 20, objectFit: 'contain', opacity: 0.5 }} />
            <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted, letterSpacing: '0.05em' }}>
              Listing data provided by reColorado MLS. Updated frequently.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PROPERTIES ═══ */}
      <section style={{ padding: '96px 0', backgroundColor: C.white }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Exclusive Listings</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 300, color: C.black, marginBottom: 20 }}>Our Current Active Properties</h2>
            <div style={{ width: 60, height: 1, backgroundColor: C.black, margin: '0 auto' }} />
          </div>

          {/* Alternating property rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {featuredListings.map((p, i) => (
              <Link key={p._id} to={`/property/${p._id}`}
                className="resp-property-row"
                style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? '60% 40%' : '40% 60%', minHeight: 420, textDecoration: 'none', color: 'inherit' }}>

                {/* Image */}
                <div style={{ order: i % 2 === 0 ? 0 : 1, position: 'relative', overflow: 'hidden' }}>
                  <img src={p.images[0]} alt={p.address}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease', display: 'block' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                  <div style={{ position: 'absolute', top: 20, left: 20 }}>
                    <span style={{ backgroundColor: p.status === 'PENDING' ? C.black : C.black, color: C.white, fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '6px 16px', borderRadius: 40 }}>
                      {p.status || 'For Sale'}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div style={{ order: i % 2 === 0 ? 1 : 0, padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: i % 2 === 0 ? C.white : C.cream }}>
                  <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, marginBottom: 12 }}>
                    {p.city}, Colorado
                  </p>
                  <h3 style={{ fontFamily: C.display, fontSize: 'clamp(20px, 2.5vw, 30px)', fontWeight: 400, color: C.black, marginBottom: 16, lineHeight: 1.3 }}>
                    {p.address}
                  </h3>
                  <p style={{ fontFamily: C.display, fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 300, color: C.black, marginBottom: 28 }}>
                    ${p.price.toLocaleString()}
                  </p>

                  {/* Pill badges */}
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
                    {[
                      [Bed, `${p.beds} Beds`],
                      [Bath, `${p.baths} Baths`],
                      [Square, `${p.sqft.toLocaleString()} Sq.Ft.`],
                    ].map(([Icon, label], j) => (
                      <span key={j} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: C.black, color: C.white, fontFamily: C.body, fontSize: 11, padding: '8px 16px', borderRadius: 40 }}>
                        <Icon size={13} /> {label}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: C.body, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.black, borderBottom: `1px solid ${C.black}`, paddingBottom: 4, width: 'fit-content' }}>
                    Property Details <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <Link to="/search"
              style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.black, textDecoration: 'none', border: `1px solid ${C.black}`, padding: '14px 36px', borderRadius: 40, display: 'inline-flex', alignItems: 'center', gap: 12, transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.black; e.currentTarget.style.color = C.white; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = C.black; }}>
              View All Properties <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section style={{ backgroundColor: C.cream, padding: '96px 0' }}>
        <div className="resp-split" style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <img src="/alan.png"
              alt="Alan Ramirez" style={{ width: '100%', height: 560, objectFit: 'cover' }} />
            <div className="resp-about-overlay" style={{ position: 'absolute', right: -32, bottom: -32, backgroundColor: C.black, color: C.white, padding: 32 }}>
              <p style={{ fontFamily: C.display, fontSize: 48, fontWeight: 300 }}>15+</p>
              <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Years of Excellence</p>
            </div>
            <div className="resp-hide-tablet" style={{ position: 'absolute', top: -16, left: -16, width: 80, height: 80, border: `1px solid ${C.muted}` }} />
          </div>

          <div>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>About Us</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300, color: C.black, lineHeight: 1.15, marginBottom: 24 }}>
              An <em>Overachiever</em><br />In Every Sense
            </h2>
            <div style={{ width: 48, height: 1, backgroundColor: C.black, marginBottom: 32 }} />
            <p style={{ fontSize: 14, lineHeight: 1.9, color: '#5a5248', marginBottom: 16 }}>
              Alan Ramirez brings over 15 years of dedicated real estate experience to the Denver market. Fluent in English, Filipino, and Japanese, he connects with a diverse range of clients across Colorado's dynamic housing landscape.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.9, color: '#5a5248', marginBottom: 36 }}>
              As the founder of Colorado Home Finder LLC, Alan delivers exceptional results with a client-first approach. Licensed in Colorado (FA100104608) and backed by memberships in NAR, CAR, DMAR, and AREAA, his commitment to excellence speaks for itself.
            </p>
            <div style={{ display: 'flex', gap: 32, marginBottom: 40 }}>
              {[[Award, 'Award Winning'], [TrendingUp, 'Top Producer'], [Shield, 'Trusted Expert']].map(([Icon, label], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={18} style={{ color: C.gold }} />
                  <span style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.1em', color: C.black }}>{label}</span>
                </div>
              ))}
            </div>
            <Link to="/about"
              style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.white, textDecoration: 'none', backgroundColor: C.black, padding: '14px 36px', display: 'inline-block' }}>
              Read More
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section style={{ padding: '96px 0', backgroundColor: C.black }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Services</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 300, color: C.white, marginBottom: 20 }}>How Can We Help?</h2>
            <div style={{ width: 60, height: 1, backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 auto' }} />
          </div>

          <div className="resp-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, backgroundColor: 'rgba(255,255,255,0.07)' }}>
            {[
              { title: 'Buy a Home', desc: 'Discover your dream home with exclusive access to listings and expert guidance through every step.', link: '/first-time-buyers', cta: 'Start Search' },
              { title: 'Sell Your Home', desc: 'Get top dollar with strategic marketing, professional staging, and expert negotiation skills.', link: '/valuation', cta: 'Get Value' },
              { title: 'Cash Offer', desc: 'Need to sell fast? Get a guaranteed cash offer within 24 hours with no obligations.', link: '/cash-offer', cta: 'Get Offer' },
            ].map((item, i) => (
              <Link key={i} to={item.link} style={{ textDecoration: 'none', backgroundColor: C.black, padding: '56px 48px', display: 'block', transition: 'background 0.3s, transform 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#161614'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.black; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.gold, marginBottom: 20 }}>0{i + 1}</p>
                <h3 style={{ fontFamily: C.display, fontSize: 32, fontWeight: 300, color: C.white, marginBottom: 16, lineHeight: 1.2 }}>{item.title}</h3>
                <div style={{ width: 32, height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 20 }} />
                <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>{item.desc}</p>
                <span style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', display: 'inline-flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 4 }}>
                  {item.cta} <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* ═══ TESTIMONIALS ═══ */}
      <section style={{ padding: '96px 0', backgroundColor: C.cream }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Testimonials</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 300, color: C.black, marginBottom: 20 }}>What Our Clients Say</h2>
            <div style={{ width: 60, height: 1, backgroundColor: C.black, margin: '0 auto' }} />
          </div>

          <div className="resp-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {[
              { quote: '"Alan made the home buying process seamless. His knowledge of the Colorado market is unmatched, and he negotiated $20,000 off our dream home. We couldn\'t be happier!"', name: 'Sarah & Michael Johnson', location: 'Denver, CO', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
              { quote: '"Professional, responsive, and truly cares about his clients. Alan sold our home in just 3 days above asking price. Highly recommend Colorado Home Finder!"', name: 'David Thompson', location: 'Boulder, CO', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
            ].map((t, i) => (
              <div key={i} className="chf-card" style={{ backgroundColor: C.white, padding: '48px', position: 'relative' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} style={{ fill: C.gold, color: C.gold }} />)}
                </div>
                <p style={{ fontFamily: C.display, fontSize: 20, fontStyle: 'italic', lineHeight: 1.7, color: '#3a3530', marginBottom: 32 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <img src={t.img} alt={t.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <p style={{ fontFamily: C.body, fontWeight: 500, fontSize: 14, color: C.black }}>{t.name}</p>
                    <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted }}>{t.location}</p>
                  </div>
                </div>
                <Quote style={{ position: 'absolute', top: 32, right: 32, color: C.midCream }} size={52} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST SECTION ═══ */}
      <section style={{ padding: '64px 0', backgroundColor: C.white, borderTop: `1px solid ${C.midCream}`, borderBottom: `1px solid ${C.midCream}` }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 40 }}>Trusted Affiliations & Reviews</p>
          <div className="resp-trust-badges" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
            {[
              { name: 'NAR', src: '/R-logo.png', url: 'https://www.nar.realtor' },
              { name: 'reColorado MLS', src: '/Recolorado_Logo.jpg', url: 'https://www.recolorado.com' },
              { name: 'Zillow', src: 'https://www.zillowstatic.com/s3/pfs/static/z-logo-default-visual-refresh.svg', url: 'https://www.zillow.com/profile/alain%20ramirez3' },
              { name: 'Realtor.com', src: 'https://static.rdc.moveaws.com/rdc-ui/logos/logo-brand.svg', url: 'https://www.realtor.com/realestateagents/66287142c789e4cbc7224e7b' },
              { name: 'Colorado Home Finder LLC', src: '/CHFR_Logo.png', url: 'https://www.coloradohomefinder.com' },
              { name: 'AREAA', src: '/areaa-logo.png', url: 'https://www.areaa.org' },
            ].map((logo, i) => (
              <a key={i} href={logo.url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5, transition: 'opacity 0.3s, transform 0.3s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.transform = 'scale(1)'; }}>
                <img src={logo.src} alt={logo.name} style={{ height: 44, maxWidth: 120, objectFit: 'contain', filter: 'grayscale(100%)', transition: 'filter 0.3s' }}
                  onMouseEnter={e => e.target.style.filter = 'grayscale(0%)'}
                  onMouseLeave={e => e.target.style.filter = 'grayscale(100%)'} />
              </a>
            ))}
            <a href="https://www.zillow.com/profile/alain%20ramirez3" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textDecoration: 'none', opacity: 0.7, transition: 'opacity 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} style={{ fill: C.gold, color: C.gold }} />)}
              </div>
              <span style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted }}>Zillow 5-Star Reviews</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ LEAD MAGNETS ═══ */}
      <section style={{ padding: '96px 0', backgroundColor: C.cream }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Resources</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 300, color: C.black, marginBottom: 20 }}>Free Homebuyer Tools</h2>
            <div style={{ width: 60, height: 1, backgroundColor: C.black, margin: '0 auto' }} />
          </div>
          <div className="resp-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {[
              { icon: Key, title: 'First-Time Buyer Guide', desc: 'Step-by-step guide to purchasing your first home in Colorado.', link: '/first-time-buyers', cta: 'Download Guide' },
              { icon: DollarSign, title: 'Cash Offer Program', desc: 'Get a guaranteed cash offer on your property within 24 hours.', link: '/cash-offer', cta: 'Get Your Offer' },
              { icon: BarChart3, title: 'Home Valuation', desc: 'Find out what your property is worth in today\'s market.', link: '/valuation', cta: 'Get Value' },
              { icon: HomeIcon, title: 'Sell Before You Buy', desc: 'Use your current home\'s equity to buy before you sell.', link: '/sell-before-you-buy', cta: 'Learn More' },
            ].map((item, i) => (
              <Link key={i} to={item.link} style={{ textDecoration: 'none', backgroundColor: C.white, padding: '40px 32px', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s, box-shadow 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <item.icon size={28} style={{ color: C.gold, marginBottom: 20 }} />
                <h3 style={{ fontFamily: C.display, fontSize: 22, fontWeight: 400, color: C.black, marginBottom: 12, lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: C.muted, marginBottom: 24, flex: 1 }}>{item.desc}</p>
                <span style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.black, display: 'inline-flex', alignItems: 'center', gap: 8, borderBottom: `1px solid ${C.black}`, paddingBottom: 4, width: 'fit-content' }}>
                  {item.cta} <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ position: 'relative', padding: '120px 0', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10,10,10,0.82)' }} />
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 700, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Get Started</p>
          <h2 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, color: C.white, marginBottom: 20, lineHeight: 1.1 }}>
            Ready to Find Your Dream Home?
          </h2>
          <div style={{ width: 60, height: 1, backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 auto 32px' }} />
          <p style={{ fontFamily: C.body, fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 48 }}>
            Let's discuss your real estate goals today. No obligation, just expert advice from Colorado's top team.
          </p>
          <div className="resp-cta-buttons" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/valuation"
              style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.white, textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', padding: '16px 40px', display: 'inline-block', backdropFilter: 'blur(8px)' }}>
              Get Home Value
            </Link>
            <a href="tel:+17738180444"
              onClick={() => trackPhoneClick('Home')}
              style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.black, textDecoration: 'none', backgroundColor: C.white, padding: '16px 40px', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <Phone size={14} /> Call (773) 818-0444
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
      `}</style>
    </div>
  );
};

export default Home;