import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Phone, Award, TrendingUp, Shield,
  Star, Quote, Square,DollarSign,
  Home as HomeIcon, BarChart3, Key
} from 'lucide-react';
import API from '../api';
import { trackPhoneClick, trackPageView } from '../api';

/* ─── style constants — Modern Denver Suburbs palette ─── */
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

/* ─── Buying Buddy Search Form + Featured Listings ─── */
const HomeMlsSection = () => {
  useEffect(() => {
    if (window.MBB && typeof window.MBB.loaded === 'function') {
      window.MBB.loaded();
    }
  }, []);

  return (
    <>
      {/* Live MLS Listings Preview */}
      <section style={{ padding: '60px 0 80px', backgroundColor: C.coolWhite }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 3, backgroundColor: C.accent, borderRadius: 2 }} />
                <p style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accent, margin: 0, fontWeight: 600 }}>Real-Time MLS</p>
              </div>
              <h2 style={{ fontFamily: C.display, fontSize: 'clamp(26px, 3.2vw, 42px)', fontWeight: 600, color: C.slateDark, lineHeight: 1.15, margin: 0 }}>
                Denver Metro Properties
              </h2>
              <p style={{ fontFamily: C.body, fontSize: 14, color: C.slateMed, marginTop: 8, marginBottom: 0, maxWidth: 500 }}>
                Live listings from Colorado MLS, updated in real time.
              </p>
            </div>
            <a href="/listing-results"
              className="chf-cta"
              style={{
                fontFamily: C.body, fontSize: 13, fontWeight: 600, color: C.white,
                textDecoration: 'none', backgroundColor: C.navy, padding: '12px 28px',
                borderRadius: 8, letterSpacing: '0.04em', display: 'inline-flex',
                alignItems: 'center', gap: 8, transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(27,42,74,0.15)',
              }}
              onMouseEnter={e => { e.target.style.backgroundColor = C.navyLight; e.target.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.target.style.backgroundColor = C.navy; e.target.style.transform = 'translateY(0)'; }}>
              View All Listings →
            </a>
          </div>

          {/* Divider */}
          <div style={{ width: '100%', height: 1, backgroundColor: C.slateBorder, marginBottom: 32 }} />

          <bb-widget data-type="ListingResults" data-count="6"></bb-widget>
        </div>
      </section>
    </>
  );
};

const Home = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => { trackPageView('Home'); }, []);

  const heroSlides = [
    {
      label: "Denver Metro's Trusted Real Estate Team",
      title: 'Find Your Perfect\nColorado Home',
      image: '/find your perfect coleredo image.jpg',
    },
    {
      label: 'Expert Guidance for Every Neighborhood',
      title: 'Modern Living\nin the Rockies',
      image: '/modern living in the rockies.jpg',
    },
    {
      label: 'Your Neighborhood, Your Future',
      title: "Denver Metro\nAt It's Best",
      image: '/devner metro at its best.jpg',
    },
  ];

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await API.get('/properties?featured=true&limit=4');
        const data = res.data?.properties || res.data;
        if (data?.length > 0) setFeaturedListings(data);
      } catch {}
    };
    fetchListings();
    const t = setInterval(() => setActiveSlide(p => (p + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, [heroSlides.length]);

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.white, color: C.slateDark }}>

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        {/* Background image slideshow */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {heroSlides.map((slide, i) => (
            <img key={i} src={slide.image} alt=""
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                opacity: i === activeSlide ? 1 : 0, transition: 'opacity 1.2s ease-in-out',
              }} />
          ))}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.35) 0%, rgba(15,23,42,0.55) 50%, rgba(15,23,42,0.7) 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: C.body, fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accentLight, marginBottom: 20, fontWeight: 500 }}>
            {heroSlides[activeSlide].label}
          </p>
          <h1 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 600, color: C.white, lineHeight: 1.15, marginBottom: 40, whiteSpace: 'pre-line' }}>
            {heroSlides[activeSlide].title}
          </h1>

          {/* ── BB SearchForm widget — same bar as the /search page ── */}
          <div style={{ width: '100%', maxWidth: 960, boxSizing: 'border-box', padding: '0 32px' }}>
            {/* "Buy" tab — anchored top-left, same as old custom bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(8px)',
                borderRadius: '8px 8px 0 0',
                padding: '10px 28px',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#1B2A4A',
              }}>Buy</div>
            </div>
            <div className="hero-bb-searchform" style={{
              backgroundColor: 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(16px)',
              borderRadius: '0 8px 8px 8px',
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            }}>
              <bb-widget data-type="SearchForm"></bb-widget>
            </div>
          </div>

          {/* Slide dots */}
          <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10 }}>
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setActiveSlide(i)}
                style={{ width: i === activeSlide ? 40 : 10, height: 4, backgroundColor: i === activeSlide ? C.white : 'rgba(255,255,255,0.35)', border: 'none', cursor: 'pointer', borderRadius: 4, transition: 'all 0.4s', padding: 0 }} />
            ))}
          </div>
        </div>
      </section>



      {/* ═══ LIVE MLS LISTINGS (IDX) ═══ */}
      <HomeMlsSection />

      {/* ═══ ABOUT ═══ */}
      <section style={{ backgroundColor: C.white, padding: '96px 0' }}>
        <div className="resp-split" style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <img src="/agent-about.jpg"
              alt="Modern Denver home" style={{ width: '100%', height: 560, objectFit: 'cover', borderRadius: 16 }} />
            <div className="resp-about-overlay" style={{ position: 'absolute', right: -24, bottom: -24, backgroundColor: C.navy, color: C.white, padding: 28, borderRadius: 12, boxShadow: '0 12px 32px rgba(15,23,42,0.2)' }}>
              <p style={{ fontFamily: C.display, fontSize: 44, fontWeight: 700 }}>15+</p>
              <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Years of Excellence</p>
            </div>
            <div className="resp-hide-tablet" style={{ position: 'absolute', top: -12, left: -12, width: 80, height: 80, border: `2px solid ${C.slateBorder}`, borderRadius: 12 }} />
          </div>

          <div>
            <p style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accent, marginBottom: 12, fontWeight: 600 }}>About Us</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 600, color: C.slateDark, lineHeight: 1.2, marginBottom: 24 }}>
              Your Local Denver<br />Real Estate Expert
            </h2>
            <div style={{ width: 48, height: 3, backgroundColor: C.accent, marginBottom: 32, borderRadius: 2 }} />
            <p style={{ fontSize: 15, lineHeight: 1.9, color: C.slateMed, marginBottom: 16 }}>
              Alan Ramirez brings over 15 years of dedicated real estate experience to the Denver market. Fluent in English, Filipino, and Japanese, he connects with a diverse range of clients across Colorado's dynamic housing landscape.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: C.slateMed, marginBottom: 36 }}>
              As the founder of Colorado Home Finder LLC, Alan delivers exceptional results with a client-first approach. Licensed in Colorado (FA100104608) and backed by memberships in NAR, CAR, DMAR, and AREAA, his commitment to excellence speaks for itself.
            </p>
            <div style={{ display: 'flex', gap: 32, marginBottom: 40 }}>
              {[[Award, 'Award Winning'], [TrendingUp, 'Top Producer'], [Shield, 'Trusted Expert']].map(([Icon, label], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: C.coolWhite, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} style={{ color: C.accent }} />
                  </div>
                  <span style={{ fontFamily: C.body, fontSize: 13, color: C.slateDark, fontWeight: 500 }}>{label}</span>
                </div>
              ))}
            </div>
            <Link to="/about"
              style={{ fontFamily: C.body, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.white, textDecoration: 'none', backgroundColor: C.navy, padding: '14px 36px', display: 'inline-block', borderRadius: 8, fontWeight: 600, transition: 'all 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = C.navyLight}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = C.navy}>
              Read More
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section style={{ padding: '96px 0', backgroundColor: C.navy }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accentLight, marginBottom: 12, fontWeight: 600 }}>Services</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600, color: C.white, marginBottom: 20 }}>How Can We Help?</h2>
            <div style={{ width: 60, height: 3, backgroundColor: C.accent, margin: '0 auto', borderRadius: 2 }} />
          </div>

          <div className="resp-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { title: 'Buy a Home', desc: 'Discover your dream home with exclusive access to listings and expert guidance through every step.', link: '/first-time-buyers', cta: 'Start Search' },
              { title: 'Sell Your Home', desc: 'Get top dollar with strategic marketing, professional staging, and expert negotiation skills.', link: '/valuation', cta: 'Get Value' },
              { title: 'Cash Offer', desc: 'Need to sell fast? Get a guaranteed cash offer within 24 hours with no obligations.', link: '/cash-offer', cta: 'Get Offer' },
            ].map((item, i) => (
              <Link key={i} to={item.link} style={{ textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '48px 40px', display: 'block', transition: 'all 0.3s', borderRadius: 12 }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(196,149,106,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                <p style={{ fontFamily: C.display, fontSize: 14, fontWeight: 600, color: C.accent, marginBottom: 20 }}>0{i + 1}</p>
                <h3 style={{ fontFamily: C.display, fontSize: 26, fontWeight: 600, color: C.white, marginBottom: 16, lineHeight: 1.3 }}>{item.title}</h3>
                <div style={{ width: 32, height: 2, backgroundColor: C.accent, marginBottom: 20, borderRadius: 2 }} />
                <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>{item.desc}</p>
                <span style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.accentLight, display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 600 }}>
                  {item.cta} <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* ═══ TESTIMONIALS ═══ */}
      <section style={{ padding: '96px 0', backgroundColor: C.coolWhite }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accent, marginBottom: 12, fontWeight: 600 }}>Testimonials</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600, color: C.slateDark, marginBottom: 20 }}>What Our Clients Say</h2>
            <div style={{ width: 60, height: 3, backgroundColor: C.accent, margin: '0 auto', borderRadius: 2 }} />
          </div>

          <div className="resp-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {[
              { quote: '"Alan made the home buying process seamless. His knowledge of the Colorado market is unmatched, and he negotiated $20,000 off our dream home. We couldn\'t be happier!"', name: 'Sarah & Michael Johnson', location: 'Denver, CO', img: '/testimonial-sarah.jpg' },
              { quote: '"Professional, responsive, and truly cares about his clients. Alan sold our home in just 3 days above asking price. Highly recommend Colorado Home Finder!"', name: 'David Thompson', location: 'Boulder, CO', img: '/testimonial-david.jpg' },
            ].map((t, i) => (
              <div key={i} className="chf-card" style={{ backgroundColor: C.white, padding: 48, position: 'relative', borderRadius: 16, border: `1px solid ${C.slateBorder}` }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} style={{ fill: C.accent, color: C.accent }} />)}
                </div>
                <p style={{ fontFamily: C.body, fontSize: 16, lineHeight: 1.8, color: C.slateMed, marginBottom: 32 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <img src={t.img} alt={t.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <p style={{ fontFamily: C.body, fontWeight: 600, fontSize: 14, color: C.slateDark }}>{t.name}</p>
                    <p style={{ fontFamily: C.body, fontSize: 13, color: C.slateLight }}>{t.location}</p>
                  </div>
                </div>
                <Quote style={{ position: 'absolute', top: 32, right: 32, color: C.slateBorder }} size={52} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST SECTION ═══ */}
      <section style={{ padding: '64px 0', backgroundColor: C.white, borderTop: `1px solid ${C.slateBorder}`, borderBottom: `1px solid ${C.slateBorder}` }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <p style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.slateLight, marginBottom: 40, fontWeight: 500 }}>Trusted Affiliations & Reviews</p>
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
                {[...Array(5)].map((_, i) => <Star key={i} size={16} style={{ fill: C.accent, color: C.accent }} />)}
              </div>
              <span style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.slateLight, fontWeight: 500 }}>Zillow 5-Star Reviews</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ LEAD MAGNETS ═══ */}
      <section style={{ padding: '96px 0', backgroundColor: C.coolWhite }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accent, marginBottom: 12, fontWeight: 600 }}>Resources</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600, color: C.slateDark, marginBottom: 20 }}>Free Homebuyer Tools</h2>
            <div style={{ width: 60, height: 3, backgroundColor: C.accent, margin: '0 auto', borderRadius: 2 }} />
          </div>
          <div className="resp-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {[
              { icon: Key, title: 'First-Time Buyer Guide', desc: 'Step-by-step guide to purchasing your first home in Colorado.', link: '/first-time-buyers', cta: 'Download Guide' },
              { icon: DollarSign, title: 'Cash Offer Program', desc: 'Get a guaranteed cash offer on your property within 24 hours.', link: '/cash-offer', cta: 'Get Your Offer' },
              { icon: BarChart3, title: 'Home Valuation', desc: 'Find out what your property is worth in today\'s market.', link: '/valuation', cta: 'Get Value' },
              { icon: HomeIcon, title: 'Sell Before You Buy', desc: 'Use your current home\'s equity to buy before you sell.', link: '/sell-before-you-buy', cta: 'Learn More' },
            ].map((item, i) => (
              <Link key={i} to={item.link} style={{ textDecoration: 'none', backgroundColor: C.white, padding: '40px 32px', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s, box-shadow 0.3s', borderRadius: 12, border: `1px solid ${C.slateBorder}` }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(15,23,42,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, backgroundColor: C.coolWhite, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <item.icon size={24} style={{ color: C.accent }} />
                </div>
                <h3 style={{ fontFamily: C.display, fontSize: 20, fontWeight: 600, color: C.slateDark, marginBottom: 12, lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: C.slateMed, marginBottom: 24, flex: 1 }}>{item.desc}</p>
                <span style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.navy, display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, width: 'fit-content' }}>
                  {item.cta} <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ position: 'relative', padding: '120px 0', overflow: 'hidden' }}>
        <img src="/cta-bg.jpg"
          alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.75), rgba(15,23,42,0.9))' }} />
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 700, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <p style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accentLight, marginBottom: 20, fontWeight: 600 }}>Get Started</p>
          <h2 style={{ fontFamily: C.display, fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600, color: C.white, marginBottom: 20, lineHeight: 1.2 }}>
            Ready to Find Your Dream Home?
          </h2>
          <div style={{ width: 60, height: 3, backgroundColor: C.accent, margin: '0 auto 32px', borderRadius: 2 }} />
          <p style={{ fontFamily: C.body, fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: 48 }}>
            Let's discuss your real estate goals today. No obligation, just expert advice from Colorado's top team.
          </p>
          <div className="resp-cta-buttons" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/valuation"
              style={{ fontFamily: C.body, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.white, textDecoration: 'none', border: '2px solid rgba(255,255,255,0.3)', padding: '16px 40px', display: 'inline-block', borderRadius: 8, fontWeight: 600, transition: 'all 0.3s', backdropFilter: 'blur(8px)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.backgroundColor = 'rgba(196,149,106,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
              Get Home Value
            </Link>
            <a href="tel:+17738180444"
              onClick={() => trackPhoneClick('Home')}
              style={{ fontFamily: C.body, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.navy, textDecoration: 'none', backgroundColor: C.white, padding: '16px 40px', display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 8, fontWeight: 600, transition: 'all 0.3s', border: '2px solid transparent' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = C.white; e.currentTarget.style.color = C.white; e.currentTarget.querySelectorAll('*').forEach(el => el.style.color = C.white); }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = C.navy; e.currentTarget.querySelectorAll('*').forEach(el => el.style.color = ''); }}>
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