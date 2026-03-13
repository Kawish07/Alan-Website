import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, DollarSign, Clock, Shield, CheckCircle, Home, ChevronRight } from 'lucide-react';
import { submitLead, trackPageView } from '../api';

const C = {
  black: '#0a0a0a', cream: '#f5f3ef', midCream: '#ede9e3',
  gold: '#c9a96e', muted: '#8a8078', white: '#ffffff',
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Jost', sans-serif",
};

const BEDS_OPTIONS = ['1', '2', '3', '4', '5+'];
const BATHS_OPTIONS = ['1', '1.5', '2', '3', '4+'];
const PRICE_RANGES = [
  'Under $200k', '$200k – $300k', '$300k – $500k',
  '$500k – $750k', '$750k – $1M', '$1M – $2M', '$2M+',
];

const HomeSellers = () => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', beds: '', baths: '', priceRange: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { trackPageView('Home Sellers'); }, []);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fullName = `${form.firstName} ${form.lastName}`.trim();
      const details = [
        form.address && `Property: ${form.address}`,
        form.beds && `Beds: ${form.beds}`,
        form.baths && `Baths: ${form.baths}`,
        form.priceRange && `Est. Value: ${form.priceRange}`,
        form.message,
      ].filter(Boolean).join(' | ');
      await submitLead({
        name: fullName,
        email: form.email,
        phone: form.phone,
        intent: 'Seller',
        source: 'Home Sellers Page',
        message: details,
      });
      setSubmitted(true);
    } catch {
      // allow retry
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '14px 0',
    border: 'none', borderBottom: `1px solid ${focused === field ? C.black : C.midCream}`,
    outline: 'none', fontFamily: C.body, fontSize: 14, color: C.black,
    backgroundColor: 'transparent', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  });

  const selectStyle = (field) => ({
    ...inputStyle(field),
    appearance: 'none', WebkitAppearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%238a8078\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center',
    cursor: 'pointer', paddingRight: 24,
  });

  const labelStyle = {
    fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em',
    textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8,
  };

  const subpages = [
    {
      icon: TrendingUp,
      title: 'Home Valuation',
      desc: 'Discover what your home is worth in today\'s market with a free, no-obligation analysis.',
      path: '/valuation',
      cta: 'Get Your Valuation',
    },
    {
      icon: DollarSign,
      title: 'Cash Offers',
      desc: 'Skip the hassle — get a guaranteed all-cash offer on your home within 24 hours.',
      path: '/cash-offer',
      cta: 'Request Cash Offer',
    },
  ];

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.white, color: C.black, minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: '70vh', backgroundColor: C.black, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Colorado luxury home"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(9,9,9,0.92), rgba(9,9,9,0.4))' }} />

        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', width: '100%', position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: 620 }}>
            <div style={{ width: 40, height: 1, backgroundColor: C.gold, marginBottom: 24 }} />
            <h1 style={{ fontFamily: C.display, fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: 300, color: C.white, lineHeight: 0.95, letterSpacing: '0.02em', marginBottom: 24 }}>
              Sell Your Home<br /><em style={{ color: C.gold }}>With Confidence</em>
            </h1>
            <p style={{ fontFamily: C.body, fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.9, letterSpacing: '0.04em', maxWidth: 460, marginBottom: 40 }}>
              Whether you need a quick cash offer or want to maximize your sale price, we have the expertise and market knowledge to get it done.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/valuation"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 28px', backgroundColor: C.gold, color: C.black, fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 500, transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                Free Valuation <ArrowRight size={14} />
              </Link>
              <Link to="/cash-offer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 28px', border: '1px solid rgba(255,255,255,0.25)', color: C.white, fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 500, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = C.white; }}>
                Cash Offer <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', top: '12%', right: '8%', width: '35%', height: '76%', border: '1px solid rgba(255,255,255,0.1)', zIndex: 1 }} />
      </section>

      {/* ── Subpage Cards (6.1 Dropdown destinations) ── */}
      <section style={{ backgroundColor: C.cream, padding: '80px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Selling Options</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, color: C.black, lineHeight: 1.15 }}>
              Choose Your <em>Path</em>
            </h2>
          </div>
          <div className="resp-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {subpages.map(({ icon: Icon, title, desc, path, cta }) => (
              <Link key={path} to={path} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ backgroundColor: C.white, padding: '48px 40px', transition: 'box-shadow 0.3s, transform 0.3s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 60px -15px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                  <div style={{ width: 56, height: 56, border: `1px solid ${C.midCream}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                    <Icon size={24} style={{ color: C.gold }} />
                  </div>
                  <h3 style={{ fontFamily: C.display, fontSize: 28, fontWeight: 400, color: C.black, marginBottom: 12 }}>{title}</h3>
                  <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, lineHeight: 1.8, marginBottom: 24 }}>{desc}</p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black, fontWeight: 500 }}>
                    {cta} <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Sell With Us ── */}
      <section style={{ backgroundColor: C.white, padding: '80px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Why Choose Us</p>
          <h2 style={{ fontFamily: C.display, fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, color: C.black, lineHeight: 1.15, marginBottom: 56 }}>
            The <em>Smart Way</em> to Sell
          </h2>
          <div className="resp-form-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            {[
              [TrendingUp, 'Market Expertise', 'Deep knowledge of Denver metro pricing and trends.'],
              [Clock, 'Fast Results', 'Our listings sell 20% faster than the area average.'],
              [Shield, 'Full Support', 'From staging to closing, we handle every detail.'],
              [Home, 'Max Value', 'Strategic pricing and marketing to get top dollar.'],
            ].map(([Icon, title, desc], i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, border: `1px solid ${C.midCream}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Icon size={20} style={{ color: C.gold }} />
                </div>
                <h3 style={{ fontFamily: C.display, fontSize: 20, fontWeight: 400, color: C.black, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lead Capture Form ── */}
      <section style={{ padding: '96px 0', backgroundColor: C.cream }}>
        <div className="resp-split" style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, alignItems: 'start' }}>

          {/* Left - Copy */}
          <div>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Get Started</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300, color: C.black, lineHeight: 1.15, marginBottom: 24 }}>
              Ready to<br /><em>Sell?</em>
            </h2>
            <div style={{ width: 48, height: 1, backgroundColor: C.black, marginBottom: 32 }} />
            <p style={{ fontFamily: C.body, fontSize: 14, lineHeight: 1.9, color: '#5a5248', marginBottom: 32 }}>
              Tell us about your property and timeline. We'll provide a personalized selling strategy tailored to your goals — whether that's maximizing your sale price or closing as quickly as possible.
            </p>

            <div style={{ padding: '24px 28px', backgroundColor: C.white, marginBottom: 24 }}>
              <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, fontWeight: 600, marginBottom: 12 }}>What to Expect</p>
              {[
                'Free comparative market analysis (CMA)',
                'Custom selling strategy & timeline',
                'Professional staging & photography guidance',
                'Expert negotiation to maximize your sale price',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < 3 ? 10 : 0 }}>
                  <CheckCircle size={14} style={{ color: C.gold, flexShrink: 0 }} />
                  <p style={{ fontFamily: C.body, fontSize: 13, color: C.black, lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>

            <div style={{ padding: '20px 24px', backgroundColor: C.white }}>
              <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, fontWeight: 600, marginBottom: 8 }}>Agent</p>
              <p style={{ fontFamily: C.body, fontSize: 13, color: C.black }}>Alan Ramirez — Colorado Home Finder LLC</p>
              <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted }}>License #FA100104608 · +1 (773) 818-0444</p>
            </div>
          </div>

          {/* Right - Form */}
          <div>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Seller Inquiry</p>
            <h3 style={{ fontFamily: C.display, fontSize: 40, fontWeight: 300, color: C.black, marginBottom: 40, lineHeight: 1.1 }}>
              Tell Us About<br />Your <em>Property</em>
            </h3>

            {submitted ? (
              <div style={{ padding: '48px 0', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, border: `1px solid ${C.black}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <span style={{ fontFamily: C.display, fontSize: 28 }}>✓</span>
                </div>
                <h4 style={{ fontFamily: C.display, fontSize: 36, fontWeight: 300, color: C.black, marginBottom: 12 }}>Request Received</h4>
                <div style={{ width: 40, height: 1, backgroundColor: C.black, margin: '0 auto 20px' }} />
                <p style={{ fontFamily: C.body, fontSize: 14, color: C.muted, lineHeight: 1.8 }}>
                  Thank you! One of our listing specialists will review your property details and reach out within 24 hours with a personalized selling plan.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 32 }}>

                  {/* First & Last Name */}
                  <div className="resp-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                    <div>
                      <label style={labelStyle}>First Name</label>
                      <input type="text" required placeholder="First name" value={form.firstName}
                        style={inputStyle('firstName')}
                        onFocus={() => setFocused('firstName')} onBlur={() => setFocused('')}
                        onChange={e => handleChange('firstName', e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Last Name</label>
                      <input type="text" required placeholder="Last name" value={form.lastName}
                        style={inputStyle('lastName')}
                        onFocus={() => setFocused('lastName')} onBlur={() => setFocused('')}
                        onChange={e => handleChange('lastName', e.target.value)} />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="resp-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                    <div>
                      <label style={labelStyle}>Email Address</label>
                      <input type="email" required placeholder="your@email.com" value={form.email}
                        style={inputStyle('email')}
                        onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                        onChange={e => handleChange('email', e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone Number</label>
                      <input type="tel" required placeholder="(303) 000-0000" value={form.phone}
                        style={inputStyle('phone')}
                        onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                        onChange={e => handleChange('phone', e.target.value)} />
                    </div>
                  </div>

                  {/* Property Address */}
                  <div>
                    <label style={labelStyle}>Property Address</label>
                    <input type="text" required placeholder="123 Main St, Denver, CO" value={form.address}
                      style={inputStyle('address')}
                      onFocus={() => setFocused('address')} onBlur={() => setFocused('')}
                      onChange={e => handleChange('address', e.target.value)} />
                  </div>

                  {/* Beds & Baths */}
                  <div className="resp-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                    <div>
                      <label style={labelStyle}>Bedrooms</label>
                      <select value={form.beds}
                        style={selectStyle('beds')}
                        onFocus={() => setFocused('beds')} onBlur={() => setFocused('')}
                        onChange={e => handleChange('beds', e.target.value)}>
                        <option value="">Select</option>
                        {BEDS_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Bathrooms</label>
                      <select value={form.baths}
                        style={selectStyle('baths')}
                        onFocus={() => setFocused('baths')} onBlur={() => setFocused('')}
                        onChange={e => handleChange('baths', e.target.value)}>
                        <option value="">Select</option>
                        {BATHS_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Estimated Home Value */}
                  <div>
                    <label style={labelStyle}>Estimated Home Value</label>
                    <select value={form.priceRange}
                      style={selectStyle('priceRange')}
                      onFocus={() => setFocused('priceRange')} onBlur={() => setFocused('')}
                      onChange={e => handleChange('priceRange', e.target.value)}>
                      <option value="">Select a range</option>
                      {PRICE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label style={labelStyle}>Additional Notes (Optional)</label>
                    <textarea rows={4} placeholder="Anything else we should know about your property…" value={form.message}
                      style={{ ...inputStyle('message'), resize: 'none', paddingTop: 12 }}
                      onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
                      onChange={e => handleChange('message', e.target.value)} />
                  </div>
                </div>

                <button type="submit" disabled={submitting}
                  style={{
                    width: '100%', padding: '18px',
                    backgroundColor: submitting ? '#333' : C.black,
                    color: C.white, border: 'none', cursor: submitting ? 'default' : 'pointer',
                    fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                    transition: 'background 0.2s', opacity: submitting ? 0.7 : 1,
                  }}
                  onMouseEnter={e => { if (!submitting) e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
                  onMouseLeave={e => { if (!submitting) e.currentTarget.style.backgroundColor = C.black; }}>
                  {submitting ? 'Submitting…' : 'Get My Free Consultation'} {!submitting && <ArrowRight size={15} />}
                </button>

                <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted, marginTop: 16, textAlign: 'center' }}>
                  No obligation. We'll respond within 24 hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeSellers;
