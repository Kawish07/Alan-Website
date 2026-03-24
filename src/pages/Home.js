import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Phone, Award, TrendingUp, Shield,
  Star, Quote, Square,DollarSign,
  Home as HomeIcon, BarChart3, Key
} from 'lucide-react';
import API, { trackPhoneClick, trackPageView, submitLead, trackBehavior } from '../api';
import ListingAlertForm from '../components/ListingAlertForm';

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
  display: "'Playfair Display', Georgia, serif",
  body: "'Nunito Sans', system-ui, sans-serif",
};

/* ─── Buying Buddy Search Form + Featured Listings ─── */
const HomeMlsSection = () => {
  useEffect(() => {
    if (window.MBB && typeof window.MBB.loaded === 'function') {
      window.MBB.loaded();
    }

    // Auto-fill BB's search input with the target zip codes after it loads
    let attempts = 0;
    const fillZips = () => {
      attempts++;
      const widgets = document.querySelectorAll('bb-widget[data-type="ListingResults"]');
      if (!widgets.length) { if (attempts < 30) setTimeout(fillZips, 500); return; }
      const widget = widgets[0];
      const inputs = widget.querySelectorAll('input[type="text"], input:not([type="submit"]):not([type="hidden"]):not([type="checkbox"]):not([type="radio"])');
      const viewBtns = widget.querySelectorAll('button');
      const searchInput = Array.from(inputs).find(el => el.offsetParent !== null);
      const viewBtn = Array.from(viewBtns).find(btn => btn.textContent.includes('View') && btn.offsetParent !== null);
      if (!searchInput || !viewBtn) { if (attempts < 30) setTimeout(fillZips, 500); return; }
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(searchInput, '80231, 80014');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
      setTimeout(() => viewBtn.click(), 400);
    };
    const timer = setTimeout(fillZips, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Live MLS Listings Preview */}
      <section style={{ padding: '60px 0 80px', backgroundColor: C.white }}>
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

          {/* Contain BB widget to ~12 listings height, with fade-out at bottom */}
          <div style={{ position: 'relative', maxHeight: 1600, overflow: 'hidden' }}>
            <bb-widget data-type="ListingResults"></bb-widget>
            {/* Gradient fade to signal more content */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 180,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
              pointerEvents: 'none', zIndex: 2,
            }} />
          </div>
          {/* View All button below the fade */}
          <div style={{ textAlign: 'center', marginTop: -40, position: 'relative', zIndex: 3, paddingBottom: 8 }}>
            <Link to="/search" style={{
              fontFamily: C.body, fontSize: 14, fontWeight: 700, color: C.white,
              textDecoration: 'none', backgroundColor: C.navy, padding: '16px 48px',
              borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 10,
              boxShadow: '0 4px 16px rgba(27,42,74,0.15)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.navyLight; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.navy; e.currentTarget.style.transform = 'translateY(0)'; }}>
              View All Listings <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

const Home = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [inlineForm, setInlineForm] = useState({ name: '', phone: '', email: '' });
  const [inlineSubmitted, setInlineSubmitted] = useState(false);

  const handleInlineLead = async (e) => {
    e.preventDefault();
    try {
      await submitLead({ ...inlineForm, source: 'Home Inline CTA', intent: 'Buyer' });
      trackBehavior('FORM_SUBMIT', { source: 'Home Inline CTA' });
    } catch {}
    setInlineSubmitted(true);
  };

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
      <section style={{ position: 'relative', height: '72vh', minHeight: 520, overflow: 'hidden' }}>
        {/* Background image slideshow */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {heroSlides.map((slide, i) => (
            <img key={i} src={slide.image} alt=""
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                opacity: i === activeSlide ? 1 : 0, transition: 'opacity 1.2s ease-in-out',
              }} />
          ))}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.45) 0%, rgba(15,23,42,0.60) 45%, rgba(15,23,42,0.82) 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '80px 24px 40px' }}>

          {/* Eyebrow tag */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(196,149,106,0.18)', border: '1px solid rgba(196,149,106,0.35)', borderRadius: 100, padding: '5px 16px', marginBottom: 18 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: C.accentLight }} />
            <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.accentLight, margin: 0, fontWeight: 700 }}>Denver Metro MLS — Updated Daily</p>
          </div>

          {/* Headline — compact, user-focused */}
          <h1 style={{ fontFamily: C.display, fontSize: 'clamp(26px, 3.8vw, 48px)', fontWeight: 600, color: C.white, lineHeight: 1.2, marginBottom: 28, fontStyle: 'italic', maxWidth: 640 }}>
            Find Your Home in Colorado —<br />
            <span style={{ fontStyle: 'normal', fontWeight: 700 }}>Search 10,000+ Live Listings</span>
          </h1>

          {/* ── BB SearchForm widget — the star of the show ── */}
          <div style={{ width: '100%', maxWidth: 820, boxSizing: 'border-box', padding: '0 16px' }}>
            {/* "Buy" tab */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.97)',
                borderRadius: '8px 8px 0 0',
                padding: '8px 24px',
                fontFamily: C.body,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.navy,
              }}>Search Homes</div>
            </div>
            <div className="hero-bb-searchform" style={{
              backgroundColor: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(16px)',
              borderRadius: '0 8px 8px 8px',
              overflow: 'hidden',
              boxShadow: '0 12px 48px rgba(0,0,0,0.28)',
              width: '100%',
              boxSizing: 'border-box',
            }}>
              <bb-widget data-type="SearchForm"></bb-widget>
            </div>
          </div>

          {/* Quick-action links below search */}
          <div style={{ display: 'flex', gap: 20, marginTop: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: 'Free Home Valuation', href: '/valuation' },
              { label: 'Cash Offer in 24hrs', href: '/cash-offer' },
              { label: 'First-Time Buyers', href: '/first-time-buyers' },
            ].map(({ label, href }) => (
              <a key={href} href={href} style={{
                fontFamily: C.body, fontSize: 12, color: 'rgba(255,255,255,0.80)',
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5,
                fontWeight: 600, letterSpacing: '0.02em', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = C.accentLight}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.80)'}>
                <ArrowRight size={12} /> {label}
              </a>
            ))}
          </div>

          {/* Slide dots */}
          <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setActiveSlide(i)}
                style={{ width: i === activeSlide ? 28 : 8, height: 3, backgroundColor: i === activeSlide ? C.white : 'rgba(255,255,255,0.3)', border: 'none', cursor: 'pointer', borderRadius: 4, transition: 'all 0.4s', padding: 0 }} />
            ))}
          </div>
        </div>
      </section>



      {/* ═══ LIVE MLS LISTINGS (IDX) ═══ */}
      <HomeMlsSection />

      {/* ═══ INLINE LEAD CAPTURE STRIP ═══ */}
      <section style={{
        background: `linear-gradient(135deg, ${C.navyDark} 0%, ${C.navy} 60%, ${C.navyLight} 100%)`,
        padding: '56px 32px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* subtle background pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(196,149,106,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {inlineSubmitted ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <p style={{ fontFamily: C.display, fontSize: 26, fontWeight: 600, color: C.white, margin: '0 0 8px' }}>
                Thank You! ✓
              </p>
              <p style={{ fontFamily: C.body, fontSize: 14, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                Alan will be in touch with you shortly.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {/* Left copy */}
              <div style={{ flex: '1 1 260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 3, backgroundColor: C.accent, borderRadius: 2 }} />
                  <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.accentLight, margin: 0, fontWeight: 600 }}>Free Consultation</p>
                </div>
                <h3 style={{ fontFamily: C.display, fontSize: 'clamp(22px, 2.8vw, 32px)', fontWeight: 600, color: C.white, margin: '0 0 10px', lineHeight: 1.25 }}>
                  Get Exclusive Listings &amp;<br />Off-Market Deals
                </h3>
                <p style={{ fontFamily: C.body, fontSize: 14, color: 'rgba(255,255,255,0.60)', margin: 0, lineHeight: 1.7 }}>
                  Tell us what you're looking for and Alan will send you matching properties — including listings not yet on Zillow.
                </p>
              </div>

              {/* Right form */}
              <form onSubmit={handleInlineLead} style={{
                flex: '2 1 400px', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
              }}>
                {[
                  { type: 'text',  key: 'name',  ph: 'Your Name' },
                  { type: 'tel',   key: 'phone', ph: 'Phone Number' },
                  { type: 'email', key: 'email', ph: 'Email Address' },
                ].map(({ type, key, ph }) => (
                  <input key={key}
                    type={type} placeholder={ph} required
                    value={inlineForm[key]}
                    onChange={e => setInlineForm({ ...inlineForm, [key]: e.target.value })}
                    style={{
                      flex: '1 1 140px', padding: '13px 16px',
                      border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
                      fontFamily: C.body, fontSize: 13, color: C.white,
                      backgroundColor: 'rgba(255,255,255,0.09)',
                      outline: 'none', transition: 'border-color 0.2s, background 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.background = 'rgba(255,255,255,0.14)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.background = 'rgba(255,255,255,0.09)'; }}
                  />
                ))}
                <button type="submit" style={{
                  padding: '13px 28px', backgroundColor: C.accent, color: C.white,
                  border: 'none', borderRadius: 8, fontFamily: C.body, fontSize: 12,
                  fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                  whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(196,149,106,0.35)',
                  transition: 'background 0.2s, transform 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.accentLight; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  Send Me Listings <ArrowRight size={14} />
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* ═══ BROWSE BY NEIGHBORHOOD ═══ */}
      <section style={{ backgroundColor: C.coolWhite, padding: '72px 0', borderTop: `1px solid ${C.slateBorder}` }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 3, backgroundColor: C.accent, borderRadius: 2 }} />
                <p style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accent, margin: 0, fontWeight: 600 }}>Find by Location</p>
              </div>
              <h2 style={{ fontFamily: C.display, fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 600, color: C.slateDark, lineHeight: 1.2, margin: 0 }}>
                Browse by Neighborhood
              </h2>
            </div>
            <Link to="/search" style={{
              fontFamily: C.body, fontSize: 12, fontWeight: 600, color: C.navy,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
              borderBottom: `1px solid ${C.navy}`, paddingBottom: 2, letterSpacing: '0.04em',
            }}>
              View all Denver Metro <ArrowRight size={13} />
            </Link>
          </div>

          {[
            {
              area: 'Aurora',
              hoods: [
                { name: 'Aurora Southeast',   zips: '80013,80014,80015,80016' },
                { name: 'Aurora Central',     zips: '80010,80011,80012' },
                { name: 'Green Valley Ranch', zips: '80019,80239' },
              ],
            },
            {
              area: 'Denver',
              hoods: [
                { name: 'Cherry Creek',       zips: '80206,80209,80246' },
                { name: 'Washington Park',    zips: '80209,80210' },
                { name: 'Highlands / LoHi',   zips: '80211,80212' },
                { name: 'Central Park',       zips: '80238' },
                { name: 'Downtown Denver',    zips: '80202,80203,80204' },
              ],
            },
            {
              area: 'South Metro',
              hoods: [
                { name: 'Centennial',         zips: '80112,80121,80122' },
                { name: 'Highlands Ranch',    zips: '80126,80129,80130' },
                { name: 'Lone Tree',          zips: '80124' },
                { name: 'Parker',             zips: '80134,80138' },
              ],
            },
            {
              area: 'West Metro',
              hoods: [
                { name: 'Lakewood',           zips: '80214,80226,80227,80228' },
                { name: 'Arvada',             zips: '80002,80003,80004,80005' },
                { name: 'Westminster',        zips: '80021,80023,80030,80031' },
              ],
            },
          ].map(({ area, hoods }) => (
            <div key={area} style={{ marginBottom: 32 }}>
              <p style={{ fontFamily: C.body, fontSize: 10, fontWeight: 700, color: C.slateLight, letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-block', width: 20, height: 1, backgroundColor: C.slateBorder }} /> {area}
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {hoods.map(h => (
                  <Link key={h.name}
                    to={`/search?neighborhood=${encodeURIComponent(h.name)}`}
                    style={{
                      fontFamily: C.body, fontSize: 13, fontWeight: 500, color: C.slateDark,
                      textDecoration: 'none', padding: '8px 18px', borderRadius: 24,
                      border: `1px solid ${C.slateBorder}`, backgroundColor: C.white,
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      transition: 'all 0.18s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.navy; e.currentTarget.style.color = C.navy; e.currentTarget.style.backgroundColor = '#EEF2FF'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.slateBorder; e.currentTarget.style.color = C.slateDark; e.currentTarget.style.backgroundColor = C.white; }}>
                    <span style={{ fontSize: 10, color: C.slateLight, fontWeight: 400 }}>{h.zips.split(',')[0]}+</span>
                    {h.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ DAILY LISTING ALERTS ═══ */}
      <section style={{ backgroundColor: C.navy, padding: '80px 0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px' }}>
          <ListingAlertForm source="Home Page Alert Section" />
        </div>
      </section>

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