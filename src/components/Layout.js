import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube, Menu, X, LogIn
} from 'lucide-react';

/* ── Google Fonts injection ── */
if (typeof document !== 'undefined' && !document.getElementById('spears-fonts')) {
  const link = document.createElement('link');
  link.id = 'spears-fonts';
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap';
  document.head.appendChild(link);
}

/* ── Layout styles injection ── */
if (typeof document !== 'undefined' && !document.getElementById('layout-styles')) {
  const style = document.createElement('style');
  style.id = 'layout-styles';
  style.innerHTML = `
    :root { --accent: #c9a96e; --muted: rgba(9,9,9,0.6); --bg-dark: #0a0a0a; }

    /* ── NAVBAR ── driven entirely by CSS classes, no inline recalc ── */
    .chf-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 50;
      background-color: transparent;
      box-shadow: none;
      padding: 22px 0;
      transition: background-color .5s cubic-bezier(.22,1,.36,1), box-shadow .5s cubic-bezier(.22,1,.36,1), padding .4s cubic-bezier(.22,1,.36,1);
    }
    .chf-nav.scrolled {
      background-color: #ffffff;
      box-shadow: 0 1px 0 0 #e8e4de, 0 6px 24px rgba(0,0,0,0.04);
      padding: 14px 0;
    }
    .chf-nav .chf-nav-inner { max-width: 1320px; margin: 0 auto; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; }

    /* logo */
    .chf-logo { text-decoration: none; display: flex; align-items: center; gap: 8px; }
    .chf-logo-text { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 18px; letter-spacing: 0.12em; color: #ffffff; transition: color .5s cubic-bezier(.22,1,.36,1); }
    .chf-logo-sub  { display: block; font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase; color: rgba(255,255,255,0.7); margin-top: 2px; transition: color .5s cubic-bezier(.22,1,.36,1); }
    .chf-nav.scrolled .chf-logo-text { color: #0a0a0a; }
    .chf-nav.scrolled .chf-logo-sub  { color: #9a8c7e; }

    /* nav links */
    .nav-links { display: flex; gap: 36px; align-items: center; }
    .nav-link {
      font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: 0.18em;
      text-transform: uppercase; font-weight: 400; text-decoration: none;
      position: relative; padding: 6px 2px;
      color: rgba(255,255,255,0.9);
      transition: color .5s cubic-bezier(.22,1,.36,1), transform .22s cubic-bezier(.22,1,.36,1);
    }
    .nav-link.active { font-weight: 500; color: var(--accent) !important; }
    .chf-nav.scrolled .nav-link { color: #0a0a0a; }
    .chf-nav.scrolled .nav-link.active { color: var(--accent) !important; }
    .nav-link::after { content: ''; position: absolute; left: 0; right: 0; bottom: -6px; height: 2px; background: transparent; transform: scaleX(0); transform-origin: left; transition: transform .3s cubic-bezier(.22,1,.36,1), background-color .3s; }
    .nav-link:hover { color: var(--accent); transform: translateY(-2px); }
    .nav-link:hover::after { transform: scaleX(1); background: linear-gradient(90deg, rgba(201,169,110,1), rgba(255,210,140,0.8)); }

    /* cta */
    .chf-cta {
      border-radius: 40px; padding: 10px 24px; display: inline-flex; gap: 10px; align-items: center;
      border: 1px solid rgba(255,255,255,0.7); background: transparent; color: #ffffff;
      text-decoration: none; font-family: 'Jost', sans-serif; font-size: 11px;
      letter-spacing: 0.18em; text-transform: uppercase; font-weight: 500;
      transition: color .5s cubic-bezier(.22,1,.36,1), border-color .5s cubic-bezier(.22,1,.36,1), background-color .3s cubic-bezier(.22,1,.36,1), box-shadow .3s cubic-bezier(.22,1,.36,1), transform .3s cubic-bezier(.22,1,.36,1);
    }
    .chf-nav.scrolled .chf-cta { border-color: #0a0a0a; color: #0a0a0a; }
    .chf-cta:hover { color: #ffffff !important; background: linear-gradient(90deg, rgba(201,169,110,1), rgba(255,210,140,0.12)); box-shadow: 0 8px 30px rgba(9,9,9,0.18); transform: translateY(-3px) scale(1.02); border-color: var(--accent); }

    /* login */
    .chf-admin-link {
      display: inline-flex; gap: 8px; align-items: center; padding: 8px 12px; border-radius: 28px;
      font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: 0.12em;
      text-transform: uppercase; opacity: 0.9; border: 1px solid transparent;
      text-decoration: none; color: #ffffff;
      transition: color .5s cubic-bezier(.22,1,.36,1), background .3s cubic-bezier(.22,1,.36,1), box-shadow .3s cubic-bezier(.22,1,.36,1), transform .3s cubic-bezier(.22,1,.36,1), border-color .3s cubic-bezier(.22,1,.36,1);
    }
    .chf-nav.scrolled .chf-admin-link { color: #0a0a0a; }
    .chf-admin-icon { transition: transform .22s, color .22s; display: inline-flex; align-items: center; }
    .chf-admin-link:hover { color: var(--accent) !important; transform: translateY(-3px); background: linear-gradient(90deg, rgba(201,169,110,0.08), rgba(255,210,140,0.02)); box-shadow: 0 10px 30px rgba(0,0,0,0.14); border-color: rgba(201,169,110,0.18); }
    .chf-admin-link:hover .chf-admin-icon { transform: translateY(-2px) rotate(-6deg); }

    /* mobile toggle */
    .chf-mobile-toggle { background: none; border: none; cursor: pointer; color: #ffffff; padding: 4px; transition: color .5s cubic-bezier(.22,1,.36,1) !important; }
    .chf-nav.scrolled .chf-mobile-toggle { color: #0a0a0a; }

    /* footer & social */
    .chf-social { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition: all .22s cubic-bezier(.22,1,.36,1); color: rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.15); }
    .chf-social:hover { color: #ffffff; transform: translateY(-4px) scale(1.06); background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)); box-shadow: 0 6px 20px rgba(0,0,0,0.35); border-color: rgba(255,255,255,0.28); }
    .chf-footer-link { color: rgba(255,255,255,0.6); text-decoration: none; transition: color .22s, transform .22s; display:block; padding:6px 0; }
    .chf-footer-link:hover { color: #ffffff; transform: translateX(6px); }
    .chf-mobile-link { display:block; font-family:'Jost', sans-serif; font-size:13px; letter-spacing:0.2em; text-transform:uppercase; color:#ffffff; text-decoration:none; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.08); transition: color .22s; }
    .chf-mobile-link:hover { color: var(--accent); }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }

    /* ── Global interactive helpers ── */
    .chf-btn { display:inline-flex; align-items:center; gap:10px; cursor:pointer; font-family:'Jost',sans-serif; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; font-weight:500; border:none; text-decoration:none; transition: background-color .3s, color .3s, transform .3s, box-shadow .3s; position:relative; overflow:hidden; }
    .chf-btn-primary { background:#0a0a0a; color:#ffffff; padding:16px 36px; }
    .chf-btn-primary:hover { background:#c9a96e; transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.18); }
    .chf-btn-outline { background:transparent; border:1px solid #0a0a0a; color:#0a0a0a; padding:14px 36px; }
    .chf-btn-outline:hover { background:#0a0a0a; color:#ffffff; transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.12); }
    .chf-btn-gold { background:#c9a96e; color:#0a0a0a; padding:16px 36px; }
    .chf-btn-gold:hover { background:#b8944f; transform:translateY(-3px); box-shadow:0 12px 32px rgba(201,169,110,0.3); }
    .chf-card { transition: transform .4s ease, box-shadow .4s ease; }
    .chf-card:hover { transform:translateY(-8px); box-shadow:0 20px 48px rgba(0,0,0,0.1); }
    .chf-img-zoom { overflow:hidden; }
    .chf-img-zoom img { transition: transform .6s ease; display:block; width:100%; height:100%; object-fit:cover; }
    .chf-img-zoom:hover img { transform:scale(1.05); }
    .chf-link { color:inherit; text-decoration:none; transition: color .22s; }
    .chf-link:hover { color:var(--accent); }
    .chf-underline-link { display:inline-flex; align-items:center; gap:8px; font-family:'Jost',sans-serif; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:#0a0a0a; text-decoration:none; border-bottom:1px solid #0a0a0a; padding-bottom:4px; transition: color .25s, border-color .25s, transform .25s; }
    .chf-underline-link:hover { color:var(--accent); border-color:var(--accent); transform:translateX(4px); }
    .chf-input { font-family:'Jost',sans-serif; font-size:13px; color:#0a0a0a; border:none; border-bottom:1px solid #ede9e3; outline:none; padding:12px 0; background:transparent; width:100%; transition: border-color .25s; }
    .chf-input:focus { border-color:#c9a96e; }
    .chf-input-dark { font-family:'Jost',sans-serif; font-size:13px; color:#ffffff; border:none; border-bottom:1px solid rgba(255,255,255,0.15); outline:none; padding:12px 0; background:transparent; width:100%; transition: border-color .25s; }
    .chf-input-dark:focus { border-color:#c9a96e; }

    /* ── Smooth auto transitions for form elements + buttons ── */
    input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]),
    select, textarea { transition: border-color .25s ease, box-shadow .25s ease, background-color .25s ease !important; }
    input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]):focus,
    select:focus, textarea:focus { border-color: var(--accent) !important; box-shadow: 0 2px 12px rgba(201,169,110,0.08) !important; }
    button { transition: background-color .28s ease, color .28s ease, transform .28s ease, box-shadow .28s ease, border-color .28s ease, opacity .28s ease !important; }
    button[type="submit"]:hover:not(:disabled),
    button[style*="uppercase"]:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    a[style*="padding"]:not(.nav-link):not(.chf-footer-link):not(.chf-mobile-link):not(.chf-cta):not(.chf-admin-link):not(.chf-social) { transition: background-color .3s ease, color .3s ease, transform .3s ease, box-shadow .3s ease, border-color .3s ease !important; }
    a[style*="padding"]:not(.nav-link):not(.chf-footer-link):not(.chf-mobile-link):not(.chf-cta):not(.chf-admin-link):not(.chf-social):hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
    img[style*="object-fit"] { transition: transform .6s cubic-bezier(.4,0,.2,1) !important; }
    img[style*="object-fit"]:hover { transform: scale(1.04); }
    a[href^="tel:"], a[href^="mailto:"] { transition: color .25s ease !important; }
    a[href^="tel:"]:hover, a[href^="mailto:"]:hover { color: var(--accent) !important; }

    /* ── PAGE LOADER ── */
    .chf-loader-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: radial-gradient(ellipse at 50% 40%, #141210 0%, #0a0a0a 70%);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      opacity: 1;
      transition: opacity .55s cubic-bezier(.22,1,.36,1);
      pointer-events: all;
      overflow: hidden;
    }
    .chf-loader-overlay.exit {
      opacity: 0;
      pointer-events: none;
    }

    /* ambient gold glow behind content */
    .chf-loader-glow {
      position: absolute; width: 320px; height: 320px;
      border-radius: 50%; filter: blur(90px);
      background: radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 70%);
      animation: chf-glow-pulse 2.4s ease-in-out infinite;
      pointer-events: none;
    }

    /* decorative top accent line */
    .chf-loader-accent-line {
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent 0%, rgba(201,169,110,0) 20%, rgba(201,169,110,0.5) 50%, rgba(201,169,110,0) 80%, transparent 100%);
      transform: scaleX(0);
      animation: chf-line-reveal .7s cubic-bezier(.22,1,.36,1) .15s forwards;
    }

    /* floating gold particles */
    .chf-loader-particle {
      position: absolute; border-radius: 50%; pointer-events: none;
      background: radial-gradient(circle, rgba(201,169,110,0.6) 0%, transparent 70%);
      animation: chf-particle-float linear infinite;
    }
    .chf-loader-particle:nth-child(1) { width: 3px; height: 3px; left: 20%; bottom: -10px; animation-duration: 3.5s; animation-delay: 0s; }
    .chf-loader-particle:nth-child(2) { width: 2px; height: 2px; left: 35%; bottom: -10px; animation-duration: 4.2s; animation-delay: .4s; }
    .chf-loader-particle:nth-child(3) { width: 4px; height: 4px; left: 50%; bottom: -10px; animation-duration: 3s; animation-delay: .1s; }
    .chf-loader-particle:nth-child(4) { width: 2px; height: 2px; left: 65%; bottom: -10px; animation-duration: 4.8s; animation-delay: .7s; }
    .chf-loader-particle:nth-child(5) { width: 3px; height: 3px; left: 80%; bottom: -10px; animation-duration: 3.8s; animation-delay: .3s; }
    .chf-loader-particle:nth-child(6) { width: 2px; height: 2px; left: 45%; bottom: -10px; animation-duration: 5s; animation-delay: .9s; }

    /* logo with shimmer */
    .chf-loader-logo {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 28px; font-weight: 400; letter-spacing: 0.16em;
      color: #ffffff; margin-bottom: 10px; position: relative;
      opacity: 0; transform: translateY(14px);
      animation: chf-fade-up .65s cubic-bezier(.22,1,.36,1) .15s forwards;
    }
    .chf-loader-logo::after {
      content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(201,169,110,0.2), transparent);
      animation: chf-shimmer 2s ease-in-out .8s infinite;
    }

    .chf-loader-sub {
      font-family: 'Jost', sans-serif;
      font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase;
      color: rgba(255,255,255,0.35); margin-bottom: 44px;
      opacity: 0; transform: translateY(8px);
      animation: chf-fade-up .55s cubic-bezier(.22,1,.36,1) .3s forwards;
    }

    /* progress bar */
    .chf-loader-bar-track {
      width: 200px; height: 2px; background: rgba(255,255,255,0.06);
      border-radius: 4px; overflow: hidden; position: relative;
      opacity: 0; animation: chf-fade-up .4s cubic-bezier(.22,1,.36,1) .38s forwards;
    }
    .chf-loader-bar-fill {
      position: absolute; top: 0; left: 0; height: 100%; width: 0;
      background: linear-gradient(90deg, #c9a96e, #e8c88a, #c9a96e);
      border-radius: 4px;
      box-shadow: 0 0 12px rgba(201,169,110,0.4);
      animation: chf-bar-fill .75s cubic-bezier(.22,1,.36,1) .42s forwards;
    }

    /* bottom accent line */
    .chf-loader-line {
      position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, rgba(201,169,110,0.35), transparent);
      transform: scaleX(0);
      animation: chf-line-reveal .65s cubic-bezier(.22,1,.36,1) .2s forwards;
    }

    /* side decorative dashes */
    .chf-loader-dash-left, .chf-loader-dash-right {
      position: absolute; top: 50%; width: 60px; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(201,169,110,0.18));
      opacity: 0;
      animation: chf-fade-in .5s ease .5s forwards;
    }
    .chf-loader-dash-left  { right: calc(50% + 160px); transform: translateY(-50%); }
    .chf-loader-dash-right { left: calc(50% + 160px); transform: translateY(-50%) rotate(180deg); }

    @keyframes chf-fade-up { to { opacity: 1; transform: translateY(0); } }
    @keyframes chf-fade-in { to { opacity: 1; } }
    @keyframes chf-bar-fill { to { width: 100%; } }
    @keyframes chf-line-reveal { to { transform: scaleX(1); } }
    @keyframes chf-shimmer { 0% { left: -100%; } 100% { left: 200%; } }
    @keyframes chf-glow-pulse { 0%, 100% { opacity: .5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }
    @keyframes chf-particle-float {
      0%   { transform: translateY(0) scale(1); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: .6; }
      100% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

const navLinks = [
  { name: 'Properties', path: '/search' },
  { name: 'Services', path: '/services' },
  { name: 'Home Valuation', path: '/valuation' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

/* ── Page Loader Component ── */
const PageLoader = ({ show, loaderKey }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div key={loaderKey} className={`chf-loader-overlay${show ? '' : ' exit'}`}>
      {/* ambient glow */}
      <div className="chf-loader-glow" />

      {/* floating particles */}
      <div className="chf-loader-particle" />
      <div className="chf-loader-particle" />
      <div className="chf-loader-particle" />
      <div className="chf-loader-particle" />
      <div className="chf-loader-particle" />
      <div className="chf-loader-particle" />

      {/* accent lines */}
      <div className="chf-loader-accent-line" />
      <div className="chf-loader-line" />

      {/* side dashes */}
      <div className="chf-loader-dash-left" />
      <div className="chf-loader-dash-right" />

      {/* content */}
      <div className="chf-loader-logo">COLORADO HOME FINDER</div>
      <div className="chf-loader-sub">Luxury Real Estate</div>
      <div className="chf-loader-bar-track">
        <div className="chf-loader-bar-fill" />
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [loaderKey, setLoaderKey] = useState(0);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHomepage = location.pathname === '/';

  // Nav gets "scrolled" class on non-homepage OR when scrolled past threshold
  const navScrolled = !isHomepage || isScrolled;

  /* Scroll listener — uses RAF debounce to avoid jank */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Page transition loader on route change */
  useEffect(() => {
    setMobileMenuOpen(false);
    setLoaderKey(k => k + 1); // force fresh animations
    setPageLoading(true);
    window.scrollTo(0, 0);
    const t = setTimeout(() => setPageLoading(false), 850);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", backgroundColor: '#ffffff' }}>

      {/* PAGE LOADER */}
      <PageLoader show={pageLoading} loaderKey={loaderKey} />

      {/* NAVBAR — all colors driven by CSS .scrolled class, zero inline color recalculation */}
      {!isAdminRoute && (
        <nav className={`chf-nav${navScrolled ? ' scrolled' : ''}`}>
          <div className="chf-nav-inner">

            {/* Logo */}
            <Link to="/" className="chf-logo">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="chf-logo-text">COLORADO HOME FINDER</span>
                <span className="chf-logo-sub">Luxury Real Estate</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex nav-links">
              {navLinks.map(link => (
                <Link key={link.name} to={link.path}
                  className={`nav-link${location.pathname === link.path ? ' active' : ''}`}>
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} className="hidden lg:flex">
              <Link to="/contact" className="chf-cta">
                Contact Us <span style={{ width: 32, height: 1, backgroundColor: 'currentColor', display: 'inline-block' }} />
              </Link>
              <Link to="/login" className="chf-admin-link">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>Login</span>
                <LogIn size={18} className="chf-admin-icon" />
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden chf-mobile-toggle">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div style={{ backgroundColor: '#0a0a0a', padding: '24px 32px 32px' }}>
              {navLinks.map(link => (
                <Link key={link.name} to={link.path} className="chf-mobile-link">
                  {link.name}
                </Link>
              ))}
              <Link to="/contact" className="chf-cta" style={{ display: 'inline-block', marginTop: 20, color: '#ffffff', border: '1px solid rgba(255,255,255,0.4)', padding: '12px 28px' }}>
                Contact Us
              </Link>
            </div>
          )}
        </nav>
      )}

      {/* MAIN */}
      <main>{children}</main>

      {/* FOOTER */}
      {!isAdminRoute && <footer style={{ backgroundColor: '#0a0a0a', color: '#ffffff', paddingTop: 80, paddingBottom: 40 }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 48, marginBottom: 64 }}>

            {/* Brand */}
            <div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, letterSpacing: '0.1em', marginBottom: 16 }}>
                COLORADO<br />HOME FINDER
              </p>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
                Your trusted partner in Colorado Real Estate. Helping buyers and sellers achieve their dreams since 2010.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="chf-social">
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Quick Links</p>
              {navLinks.map(link => (
                <Link key={link.name} to={link.path} className="chf-footer-link" style={{ fontSize: 13, padding: '6px 0', letterSpacing: '0.05em' }}>
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Services */}
            <div>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Services</p>
              {[['First-Time Buyers', '/first-time-buyers'], ['Cash Offers', '/cash-offer'], ['Sell Before You Buy', '/sell-before-you-buy'], ['Home Valuation', '/valuation'], ['Loan Application', '/loan-application'], ['Book a Showing', '/book-showing']].map(([name, path]) => (
                <Link key={name} to={path} className="chf-footer-link" style={{ fontSize: 13, padding: '6px 0', letterSpacing: '0.05em' }}>
                  {name}
                </Link>
              ))}
            </div>

            {/* Contact */}
            <div>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Contact</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  [MapPin, '123 Real Estate Ave, Denver, CO 80000'],
                  [Phone, '(303) 555-0123'],
                  [Mail, 'info@coloradohomefinder.com'],
                ].map(([Icon, text], i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <Icon size={15} style={{ color: 'rgba(255,255,255,0.4)', marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 48, paddingBottom: 48, marginBottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: '#ffffff', marginBottom: 8 }}>Stay Connected</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Get early access to luxury listings & market insights.</p>
            </div>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: 0 }}>
              <input type="email" placeholder="Enter your email" style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '14px 20px', border: '1px solid rgba(255,255,255,0.15)', borderRight: 'none', backgroundColor: 'transparent', color: '#ffffff', outline: 'none', minWidth: 260 }} />
              <button type="submit" style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500, padding: '14px 28px', backgroundColor: '#c9a96e', color: '#0a0a0a', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}>
                Subscribe
              </button>
            </form>
          </div>

          {/* Bottom */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
              © {new Date().getFullYear()} Colorado Home Finder LLC. All rights reserved. | License #XXX-XXX-XXXX
            </p>
            <div style={{ display: 'flex', gap: 20 }}>
              {['NAR', 'DMAR', 'Realtor'].map(b => (
                <span key={b} style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>}
    </div>
  );
};

export default Layout;