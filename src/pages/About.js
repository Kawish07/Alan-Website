import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, TrendingUp, Shield, Users, ArrowRight, Globe, Star, ExternalLink, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';
import { submitLead, trackBehavior, trackPageView, trackPhoneClick, trackEmailClick } from '../api';

const C = {
  navy: '#1B2A4A', navyDark: '#0F172A', navyLight: '#243B6A',
  accent: '#C4956A', accentLight: '#D4A97A',
  coolWhite: '#F8FAFC', white: '#FFFFFF',
  slateDark: '#1E293B', slateMed: '#475569', slateLight: '#94A3B8',
  border: '#E2E8F0',
  heading: "'Montserrat', sans-serif",
  body: "'Inter', sans-serif",
};

const memberships = [
  { name: 'National Association of Realtors', abbr: 'NAR' },
  { name: 'Colorado Association of Realtors', abbr: 'CAR' },
  { name: 'Denver Metro Association of Realtors', abbr: 'DMAR' },
  { name: 'Asian Real Estate Association of America', abbr: 'AREAA' },
];

const affiliatedLogos = [
  { name: 'NAR', src: '/R-logo.png', url: 'https://www.nar.realtor' },
  { name: 'reColorado MLS', src: '/Recolorado_Logo.jpg', url: 'https://www.recolorado.com' },
  { name: 'Colorado Home Finder LLC', src: '/CHFR_Logo.png', url: 'https://www.coloradohomefinder.com' },
  { name: 'AREAA', src: '/areaa-logo.png', url: 'https://www.areaa.org' },
  { name: 'Zillow', src: 'https://www.zillowstatic.com/s3/pfs/static/z-logo-default-visual-refresh.svg', url: 'https://www.zillow.com/profile/alain%20ramirez3' },
  { name: 'Realtor.com', src: 'https://static.rdc.moveaws.com/rdc-ui/logos/logo-brand.svg', url: 'https://www.realtor.com/realestateagents/66287142c789e4cbc7224e7b' },
  { name: 'SOLD.com', src: null, url: 'https://www.sold.com/agent-profile/Alain-Ramirez-228234' },
];

const profiles = [
  { name: 'Zillow', status: 'Preferred Agent', url: 'https://www.zillow.com/profile/alain%20ramirez3' },
  { name: 'Realtor.com', status: 'Preferred Agent', url: 'https://www.realtor.com/realestateagents/66287142c789e4cbc7224e7b' },
  { name: 'SOLD.com', status: 'Verified Agent', url: 'https://www.sold.com/agent-profile/Alain-Ramirez-228234' },
];

const About = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', intent: 'Buyer' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { trackPageView('About'); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitLead({ ...formData, source: 'About Page' });
      trackBehavior('FORM_SUBMIT', { source: 'About Page' });
    } catch {}
    setSubmitted(true);
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', border: `1px solid ${C.border}`,
    borderRadius: 8, fontFamily: C.body, fontSize: 14, color: C.slateDark,
    outline: 'none', boxSizing: 'border-box', backgroundColor: C.white,
    transition: 'border-color 0.25s',
  };

  const labelStyle = {
    fontFamily: C.body, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
    color: C.slateLight, display: 'block', marginBottom: 8, fontWeight: 600,
  };

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.white, color: C.slateDark }}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', height: '50vh', minHeight: 400, overflow: 'hidden' }}>
        <img
          src="/modern living in the rockies.jpg"
          alt="Colorado Real Estate"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.35) 0%, rgba(15,23,42,0.75) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 20, fontWeight: 500 }}>About</p>
          <div style={{ width: 48, height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: 24 }} />
          <h1 style={{ fontFamily: C.heading, fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, color: C.white, lineHeight: 1.1 }}>
            Colorado's Trusted<br />Real Estate Agent
          </h1>
          <p style={{ fontFamily: C.body, fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 560, lineHeight: 1.8, marginTop: 16 }}>
            Your trusted real estate partner in the Denver metro area.
          </p>
          {/* Trust logos strip */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'center', marginTop: 32 }}>
            {[
              { name: 'Zillow', src: 'https://www.zillowstatic.com/s3/pfs/static/z-logo-default-visual-refresh.svg', url: 'https://www.zillow.com/profile/alain%20ramirez3' },
              { name: 'Realtor.com', src: 'https://static.rdc.moveaws.com/rdc-ui/logos/logo-brand.svg', url: 'https://www.realtor.com/realestateagents/66287142c789e4cbc7224e7b' },
              { name: 'AREAA', src: '/areaa-logo.png', url: 'https://www.areaa.org' },
              { name: 'REcolorado', src: '/Recolorado_Logo.jpg', url: 'https://www.recolorado.com' },
            ].map((logo, i) => (
              <a key={i} href={logo.url} target="_blank" rel="noopener noreferrer"
                style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 8, padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                <img src={logo.src} alt={logo.name} style={{ height: 28, maxWidth: 90, objectFit: 'contain' }} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agent Bio Section ── */}
      <section style={{ padding: '80px 0', backgroundColor: C.coolWhite }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="about-bio-grid" style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 64, alignItems: 'start' }}>

            {/* Left: Headshot */}
            <div>
              <div style={{ position: 'relative' }}>
                <img
                  src="/alan.png"
                  alt="Alan Ramirez — Colorado Home Finder"
                  style={{
                    width: '100%', height: 520, objectFit: 'cover', objectPosition: 'top',
                    borderRadius: 14, display: 'block',
                  }}
                />
                {/* Accent corner decoration */}
                <div style={{ position: 'absolute', bottom: -12, right: -12, width: 80, height: 80, borderRight: `3px solid ${C.accent}`, borderBottom: `3px solid ${C.accent}`, borderRadius: '0 0 14px 0', pointerEvents: 'none' }} />
              </div>

              {/* Quick contact under photo */}
              <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="tel:+17738180444" onClick={() => trackPhoneClick('About')}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', padding: '14px 20px', borderRadius: 10, backgroundColor: C.white, border: `1px solid ${C.border}`, transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(15,23,42,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <Phone size={16} style={{ color: C.accent }} />
                  <span style={{ fontFamily: C.body, fontSize: 14, color: C.slateDark, fontWeight: 500 }}>+1 (773) 818-0444</span>
                </a>
                <a href="mailto:AmRamz79@gmail.com" onClick={() => trackEmailClick('About')}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', padding: '14px 20px', borderRadius: 10, backgroundColor: C.white, border: `1px solid ${C.border}`, transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(15,23,42,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <Mail size={16} style={{ color: C.accent }} />
                  <span style={{ fontFamily: C.body, fontSize: 14, color: C.slateDark, fontWeight: 500 }}>AmRamz79@gmail.com</span>
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderRadius: 10, backgroundColor: C.white, border: `1px solid ${C.border}` }}>
                  <MapPin size={16} style={{ color: C.accent }} />
                  <span style={{ fontFamily: C.body, fontSize: 14, color: C.slateDark, fontWeight: 500 }}>Denver, CO — Greater Metro Area</span>
                </div>
              </div>
            </div>

            {/* Right: Bio */}
            <div>
              <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.accent, fontWeight: 600, marginBottom: 12 }}>Your Local Agent</p>
              <h2 style={{ fontFamily: C.heading, fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, color: C.navy, lineHeight: 1.2, marginBottom: 16 }}>
                Alan Ramirez
              </h2>
              <p style={{ fontFamily: C.body, fontSize: 13, color: C.slateLight, marginBottom: 24, fontWeight: 500, letterSpacing: '0.03em' }}>
                Lead Agent &bull; Colorado Home Finder LLC
              </p>
              <div style={{ width: 48, height: 2, backgroundColor: C.accent, marginBottom: 28 }} />

              {/* Bio text — placeholder for client-provided content */}
              <p style={{ fontFamily: C.body, fontSize: 15, color: C.slateMed, lineHeight: 1.9, marginBottom: 20 }}>
                Alan Ramirez is a dedicated real estate professional serving the greater Denver metro area. With deep roots in Colorado and a passion for helping families find their perfect home, Alan brings a personal, hands-on approach to every transaction.
              </p>
              <p style={{ fontFamily: C.body, fontSize: 15, color: C.slateMed, lineHeight: 1.9, marginBottom: 20 }}>
                Fluent in English, Filipino, and Japanese, Alan serves a diverse community of buyers and sellers across Colorado's most sought-after neighborhoods. Whether you're a first-time buyer navigating the process or a seasoned investor expanding your portfolio, Alan provides the market insights, negotiation expertise, and unwavering support you need to succeed.
              </p>
              <p style={{ fontFamily: C.body, fontSize: 15, color: C.slateMed, lineHeight: 1.9, marginBottom: 32 }}>
                As the founder of Colorado Home Finder LLC, Alan is committed to delivering an exceptional client experience — from the first conversation to well beyond closing day.
              </p>
              {/* Placeholder note for client */}
              <div style={{ backgroundColor: `${C.accent}08`, border: `1px dashed ${C.accent}40`, borderRadius: 8, padding: '14px 20px', marginBottom: 32 }}>
                <p style={{ fontFamily: C.body, fontSize: 12, color: C.accent, fontStyle: 'italic', lineHeight: 1.6 }}>
                  Note: Full agent bio text will be provided by the client. The above is placeholder copy.
                </p>
              </div>

              {/* Credentials */}
              <div style={{ backgroundColor: C.white, borderRadius: 12, padding: '24px 28px', border: `1px solid ${C.border}`, marginBottom: 32 }}>
                <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accent, marginBottom: 16, fontWeight: 600 }}>Agent Credentials</p>
                {[
                  ['License #', 'FA100104608'],
                  ['reColorado MLS ID', '165065183'],
                  ['Agency', 'Colorado Home Finder LLC'],
                  ['Languages', 'English, Filipino, Japanese'],
                ].map(([label, value], i, arr) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <span style={{ fontFamily: C.body, fontSize: 12, color: C.slateLight, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{label}</span>
                    <span style={{ fontFamily: C.body, fontSize: 13, color: C.slateDark, fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Quick traits */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  [Award, 'Top Producing Agent'],
                  [TrendingUp, 'Market Expert'],
                  [Shield, 'Trusted Advisor'],
                  [Users, 'Client Focused'],
                  [Globe, 'Multilingual'],
                  [Star, '5-Star Rated'],
                ].map(([Icon, label], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon size={16} style={{ color: C.accent, flexShrink: 0 }} />
                    <span style={{ fontFamily: C.body, fontSize: 13, color: C.slateDark, fontWeight: 500 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section style={{ backgroundColor: C.navyDark }}>
        <div className="resp-grid-4-dark" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { val: '500+', label: 'Families Served' },
            { val: '98%', label: 'Client Satisfaction' },
            { val: '3', label: 'Languages Spoken' },
            { val: '24hr', label: 'Response Time' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '40px 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none', transition: 'background 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(196,149,106,0.06)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              <p style={{ fontFamily: C.heading, fontSize: 40, fontWeight: 700, color: C.white, lineHeight: 1, marginBottom: 6 }}>{s.val}</p>
              <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accent, fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Memberships ── */}
      <section style={{ padding: '72px 0', backgroundColor: C.white }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.slateLight, marginBottom: 12, fontWeight: 500 }}>Professional Affiliations</p>
            <h2 style={{ fontFamily: C.heading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 700, color: C.navy, marginBottom: 16 }}>Memberships & Associations</h2>
            <div style={{ width: 48, height: 2, backgroundColor: C.accent, margin: '0 auto' }} />
          </div>

          <div className="resp-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 48 }}>
            {memberships.map((m, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '32px 20px', backgroundColor: C.coolWhite, borderRadius: 12, border: `1px solid ${C.border}`, transition: 'transform 0.3s, box-shadow 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(15,23,42,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <p style={{ fontFamily: C.heading, fontSize: 28, fontWeight: 700, color: C.accent, marginBottom: 8 }}>{m.abbr}</p>
                <p style={{ fontFamily: C.body, fontSize: 12, color: C.slateMed, lineHeight: 1.5 }}>{m.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Affiliated Logos / Brokerage Badges ── */}
      <section style={{ padding: '56px 0', backgroundColor: C.coolWhite, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.slateLight, marginBottom: 36, fontWeight: 500 }}>Trusted By & Affiliated With</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '28px 48px' }}>
            {affiliatedLogos.map((logo, i) => (
              <a key={i} href={logo.url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5, transition: 'all 0.3s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.transform = 'scale(1)'; }}>
                {logo.src ? (
                  <img src={logo.src} alt={logo.name} style={{ height: 44, maxWidth: 130, objectFit: 'contain', filter: 'grayscale(100%)', transition: 'filter 0.3s' }}
                    onMouseEnter={e => e.target.style.filter = 'grayscale(0%)'}
                    onMouseLeave={e => e.target.style.filter = 'grayscale(100%)'} />
                ) : (
                  <span style={{ fontFamily: C.heading, fontSize: 18, fontWeight: 700, color: C.navy }}>{logo.name}</span>
                )}
              </a>
            ))}
          </div>
          {/* Placeholder for additional client-provided logos */}
          <p style={{ fontFamily: C.body, fontSize: 11, color: C.slateLight, fontStyle: 'italic', marginTop: 28 }}>
            Additional brokerage badges and affiliate logos will be added when provided by the client.
          </p>
        </div>
      </section>

      {/* ── Verified Profiles ── */}
      <section style={{ padding: '72px 0', backgroundColor: C.white }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.slateLight, marginBottom: 12, fontWeight: 500 }}>Verified Profiles</p>
            <h2 style={{ fontFamily: C.heading, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 700, color: C.navy, marginBottom: 8 }}>Find Me Online</h2>
            <p style={{ fontFamily: C.body, fontSize: 13, color: C.slateMed }}>Preferred Agent on Zillow & Realtor.com</p>
            <div style={{ width: 48, height: 2, backgroundColor: C.accent, margin: '16px auto 0' }} />
          </div>

          <div className="resp-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {profiles.map((p, i) => (
              <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                style={{ textDecoration: 'none', display: 'block', padding: '36px 28px', backgroundColor: C.coolWhite, borderRadius: 12, textAlign: 'center', border: `1px solid ${C.border}`, transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(15,23,42,0.08)'; e.currentTarget.style.borderColor = C.accent; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = C.border; }}>
                <p style={{ fontFamily: C.heading, fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 6 }}>{p.name}</p>
                <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.accent, fontWeight: 600, marginBottom: 14 }}>{p.status}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: C.slateLight, fontFamily: C.body, fontSize: 12, fontWeight: 500 }}>
                  <span>View Profile</span>
                  <ExternalLink size={12} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section style={{ padding: '80px 0', backgroundColor: C.navyDark }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.accent, marginBottom: 12, fontWeight: 600 }}>Get In Touch</p>
            <h2 style={{ fontFamily: C.heading, fontSize: 'clamp(28px, 3.5vw, 36px)', fontWeight: 700, color: C.white, marginBottom: 12 }}>
              Let's Start a Conversation
            </h2>
            <p style={{ fontFamily: C.body, fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
              Whether you're ready to buy, sell, or just exploring your options — reach out and let's talk.
            </p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <CheckCircle size={56} style={{ color: '#22c55e', margin: '0 auto 20px' }} />
              <h3 style={{ fontFamily: C.heading, fontSize: 24, fontWeight: 700, color: C.white, marginBottom: 12 }}>Thank You!</h3>
              <p style={{ fontFamily: C.body, fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: 28 }}>
                Your message has been received. Alan will get back to you within 24 hours.
              </p>
              <Link to="/search" className="chf-btn chf-btn-gold">Browse Properties</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '40px 36px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}
                   className="resp-form-grid">
                <div>
                  <label style={{ ...labelStyle, color: 'rgba(255,255,255,0.4)' }}>Full Name *</label>
                  <input
                    type="text" required
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="John Doe"
                    style={{ ...inputStyle, backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: C.white }}
                    onFocus={e => e.target.style.borderColor = C.accent}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle, color: 'rgba(255,255,255,0.4)' }}>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    placeholder="(303) 555-0100"
                    style={{ ...inputStyle, backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: C.white }}
                    onFocus={e => e.target.style.borderColor = C.accent}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ ...labelStyle, color: 'rgba(255,255,255,0.4)' }}>Email Address *</label>
                <input
                  type="email" required
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  placeholder="john@example.com"
                  style={{ ...inputStyle, backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: C.white }}
                  onFocus={e => e.target.style.borderColor = C.accent}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ ...labelStyle, color: 'rgba(255,255,255,0.4)' }}>I'm Interested In</label>
                <select
                  value={formData.intent}
                  onChange={e => setFormData(p => ({ ...p, intent: e.target.value }))}
                  style={{ ...inputStyle, backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: C.white, cursor: 'pointer', appearance: 'auto' }}
                  onFocus={e => e.target.style.borderColor = C.accent}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                >
                  <option value="Buyer">Buying a Home</option>
                  <option value="Seller">Selling a Home</option>
                  <option value="Investor">Investment Property</option>
                  <option value="Other">Just Exploring</option>
                </select>
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ ...labelStyle, color: 'rgba(255,255,255,0.4)' }}>Message</label>
                <textarea
                  value={formData.message}
                  onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                  placeholder="Tell me about your real estate goals..."
                  rows={4}
                  style={{ ...inputStyle, backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: C.white, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = C.accent}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              <button type="submit" className="chf-btn chf-btn-gold" style={{ width: '100%', justifyContent: 'center', padding: '16px 0' }}>
                Send Message <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Responsive */}
      <style>{`
        .about-bio-grid { display: grid; grid-template-columns: 420px 1fr; gap: 64px; }
        .resp-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 900px) {
          .about-bio-grid { grid-template-columns: 1fr !important; }
          .about-bio-grid > div:first-child img { height: 400px !important; }
        }
        @media (max-width: 600px) {
          .resp-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default About;