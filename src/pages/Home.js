import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, ArrowRight, Phone, Award, TrendingUp, Shield,
  Star, Quote, Bed, Bath, Square, Instagram, Linkedin, ChevronDown,
  Home as HomeIcon, DollarSign, BarChart3, Key
} from 'lucide-react';
import API from '../api';
import { trackBehavior } from '../api';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredListings, setFeaturedListings] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [videoSrc, setVideoSrc] = useState((typeof window !== 'undefined' && window.location.origin) + '/videos/hero.mp4');
  const [showVideo, setShowVideo] = useState(true);

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      label: "Experience Colorado's Finest Properties",
      title: 'For Those Who\nSeek An Exceptional Life',
    },
    {
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      label: 'Contemporary Homes for Discerning Buyers',
      title: 'Modern Elegance\nRedefined',
    },
    {
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      label: 'Your Dream Home Awaits',
      title: 'Mountain Retreats\nBeyond Compare',
    },
  ];

  const stats = [
    { value: '#1', label: 'Large Team', sub: 'Compass Florida' },
    { value: '$2B+', label: 'Career Sales', sub: 'Volume' },
    { value: '#1', label: 'ECAR MLS', sub: 'Top Selling Team' },
    { value: '1.5B+', label: '2024 Global', sub: 'Media Impressions' },
  ];

  const teamMembers = [
    { name: 'Luke Andrews', role: 'Partner & Director of New Development', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { name: 'Maria Coukoulis', role: 'Chief Operating Officer', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { name: "John D'Amico", role: 'Luxury Real Estate Advisor', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
  ];

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await API.get('/properties?featured=true&limit=4');
        if (res.data?.length > 0) { setFeaturedListings(res.data); return; }
      } catch {}
      setFeaturedListings([
        { _id: '1', price: 15950000, address: '5673 W County Highway', city: 'Santa Rosa Beach', beds: 8, baths: 9, sqft: 6944, status: 'FOR SALE', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'] },
        { _id: '2', price: 19245000, address: '3504 E County Hwy 30A', city: 'Santa Rosa Beach', beds: 9, baths: 10, sqft: 8524, status: 'PENDING', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'] },
        { _id: '3', price: 2150000, address: '123 Mountain Vista Dr', city: 'Denver', beds: 5, baths: 4, sqft: 4200, status: 'FOR SALE', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'] },
        { _id: '4', price: 1924500, address: '4845 W County Hwy 30A', city: 'Boulder', beds: 6, baths: 5, sqft: 4500, status: 'FOR SALE', images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'] },
      ]);
    };
    fetchListings();
    const t = setInterval(() => setActiveSlide(p => (p + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = () => {
    trackBehavior('SEARCH_FILTER', { query: searchQuery });
    window.location.href = `/search?location=${searchQuery}`;
  };

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.white, color: C.black }}>

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        {/* Background video (local /videos/hero.mp4 first, then external demo, then image fallback) */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {showVideo ? (
            <video
              key={videoSrc}
              poster={heroSlides[activeSlide].image}
              autoPlay
              muted
              loop
              playsInline
              onError={() => {
                // if local failed, try a remote demo video; if remote fails, hide video
                const remote = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
                if (videoSrc.includes('/videos/hero.mp4')) {
                  setVideoSrc(remote);
                } else if (videoSrc === remote) {
                  setShowVideo(false);
                }
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : (
            <img src={heroSlides[activeSlide].image} alt="Hero background" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.06) 0%, rgba(10,10,10,0.08) 40%, rgba(10,10,10,0.12) 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 20 }}>
            {heroSlides[activeSlide].label}
          </p>
          <h1 style={{ fontFamily: C.display, fontSize: 'clamp(48px, 7vw, 90px)', fontWeight: 300, color: C.white, lineHeight: 1.1, marginBottom: 48, whiteSpace: 'pre-line' }}>
            {heroSlides[activeSlide].title}
          </h1>

          {/* Search */}
          <div style={{ width: '100%', maxWidth: 760, backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 24px', borderRight: '1px solid #e8e4de' }}>
                <MapPin size={18} style={{ color: C.muted, marginRight: 12, flexShrink: 0 }} />
                <input type="text" placeholder="Search by City, Address, or ZIP..."
                  style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontFamily: C.body, fontSize: 14, color: C.black, padding: '18px 0' }}
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()} />
              </div>
              <button onClick={handleSearch}
                style={{ backgroundColor: C.black, color: C.white, padding: '0 36px', border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = C.gold}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = C.black}>
                <Search size={16} /> Search
              </button>
            </div>
          </div>

          {/* Slide dots */}
          <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10 }}>
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setActiveSlide(i)}
                style={{ width: i === activeSlide ? 40 : 8, height: 2, backgroundColor: i === activeSlide ? C.white : 'rgba(255,255,255,0.35)', border: 'none', cursor: 'pointer', borderRadius: 2, transition: 'all 0.4s', padding: 0 }} />
            ))}
          </div>

          {/* Scroll indicator */}
          <div style={{ position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <ChevronDown size={20} style={{ color: 'rgba(255,255,255,0.5)', animation: 'bounce 2s infinite' }} />
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section style={{ backgroundColor: C.cream, borderTop: `1px solid ${C.midCream}`, borderBottom: `1px solid ${C.midCream}` }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '48px 24px', borderRight: i < 3 ? `1px solid ${C.midCream}` : 'none' }}>
              <p style={{ fontFamily: C.display, fontSize: 52, fontWeight: 300, color: C.black, lineHeight: 1, marginBottom: 8 }}>{s.value}</p>
              <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.black, fontWeight: 500 }}>{s.label}</p>
              <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted, marginTop: 4 }}>{s.sub}</p>
            </div>
          ))}
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
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Agent" style={{ width: '100%', height: 560, objectFit: 'cover' }} />
            <div style={{ position: 'absolute', right: -32, bottom: -32, backgroundColor: C.black, color: C.white, padding: 32 }}>
              <p style={{ fontFamily: C.display, fontSize: 48, fontWeight: 300 }}>15+</p>
              <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Years of Excellence</p>
            </div>
            <div style={{ position: 'absolute', top: -16, left: -16, width: 80, height: 80, border: `1px solid ${C.muted}` }} />
          </div>

          <div>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>About Us</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300, color: C.black, lineHeight: 1.15, marginBottom: 24 }}>
              An <em>Overachiever</em><br />In Every Sense
            </h2>
            <div style={{ width: 48, height: 1, backgroundColor: C.black, marginBottom: 32 }} />
            <p style={{ fontSize: 14, lineHeight: 1.9, color: '#5a5248', marginBottom: 16 }}>
              Jonathan entered college early at just 16 years old, majoring in Business Finance. By 19, he earned his Bachelor's Degree in Business Administration, setting the foundation for an exceptional career in real estate.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.9, color: '#5a5248', marginBottom: 36 }}>
              Today, Alan Ramirez leads Colorado Home Finder with the same dedication and excellence. With over $2 billion in career sales and recognition as the #1 Large Team in Colorado, we deliver exceptional results for every client.
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, backgroundColor: 'rgba(255,255,255,0.07)' }}>
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

      {/* ═══ TEAM ═══ */}
      <section style={{ padding: '96px 0', backgroundColor: C.white }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Our Experts</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 300, color: C.black, marginBottom: 20 }}>Meet Our Team</h2>
            <div style={{ width: 60, height: 1, backgroundColor: C.black, margin: '0 auto' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {teamMembers.map((m, i) => (
              <div key={i} style={{ overflow: 'hidden' }}>
                <div style={{ position: 'relative', overflow: 'hidden', marginBottom: 20 }}>
                  <img src={m.image} alt={m.name}
                    style={{ width: '100%', height: 380, objectFit: 'cover', transition: 'transform 0.6s ease', display: 'block' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 100%)', opacity: 0, transition: 'opacity 0.3s', display: 'flex', gap: 12, justifyContent: 'center' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                    {[Linkedin, Instagram].map((Icon, j) => (
                      <a key={j} href="#"
                        style={{ width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, textDecoration: 'none' }}>
                        <Icon size={15} />
                      </a>
                    ))}
                  </div>
                </div>
                <h3 style={{ fontFamily: C.display, fontSize: 22, fontWeight: 400, color: C.black, marginBottom: 4 }}>{m.name}</h3>
                <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.1em', color: C.muted }}>{m.role}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <Link to="/about"
              style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.black, textDecoration: 'none', border: `1px solid ${C.black}`, padding: '14px 36px', display: 'inline-block' }}>
              View All Team Members
            </Link>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
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
          <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 32 }}>Trusted Affiliations & Reviews</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 56, flexWrap: 'wrap' }}>
            {['NAR', 'CAR', 'DMAR', 'MLS'].map(badge => (
              <div key={badge} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', border: `1px solid ${C.midCream}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={24} style={{ color: C.gold }} />
                </div>
                <span style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted }}>{badge}</span>
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} style={{ fill: C.gold, color: C.gold }} />)}
              </div>
              <span style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted }}>Zillow 5-Star Reviews</span>
            </div>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
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
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/valuation"
              style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.white, textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', padding: '16px 40px', display: 'inline-block', backdropFilter: 'blur(8px)' }}>
              Get Home Value
            </Link>
            <a href="tel:3035550123"
              style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.black, textDecoration: 'none', backgroundColor: C.white, padding: '16px 40px', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <Phone size={14} /> Call (303) 555-0123
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