import React, { useState, useEffect } from 'react';
import { ArrowRight, Home, Search, Shield, CheckCircle } from 'lucide-react';
import { submitLead, trackPageView } from '../api';

const C = {
  black: '#0a0a0a', cream: '#f5f3ef', midCream: '#ede9e3',
  gold: '#c9a96e', muted: '#8a8078', white: '#ffffff',
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Jost', sans-serif",
};

/* Neighborhood labels matching Section 4.3 */
const AREA_OPTIONS = [
  'Aurora, CO',
  'Cherry Creek',
  'Denver Metro',
  'DTC (Denver Tech Center)',
  'DIA / Green Valley Ranch',
  'Glendale',
  'Downtown Denver',
  'Custom Search (All CO)',
];

const BEDS_OPTIONS = ['1', '2', '3', '4', '5+'];
const BATHS_OPTIONS = ['1', '1.5', '2', '3', '4+'];
const PRICE_RANGES = [
  { label: 'Under $200k', value: 'Under $200k' },
  { label: '$200k – $300k', value: '$200k–$300k' },
  { label: '$300k – $500k', value: '$300k–$500k' },
  { label: '$500k – $750k', value: '$500k–$750k' },
  { label: '$750k – $1M', value: '$750k–$1M' },
  { label: '$1M+', value: '$1M+' },
];

const HomeBuyers = () => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    currentAddress: '', beds: '', baths: '', priceRange: '', area: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { trackPageView('Home Buyers'); }, []);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fullName = `${form.firstName} ${form.lastName}`.trim();

      await submitLead({
        name: fullName,
        email: form.email,
        phone: form.phone,
        intent: 'Buyer',
        source: 'Home Buyers Page',
        buyerCriteria: {
          beds: form.beds,
          baths: form.baths,
          priceRange: form.priceRange,
          area: form.area,
          currentAddress: form.currentAddress,
        },
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

  const steps = [
    { icon: Search, title: 'Tell Us What You Want', desc: 'Fill out the form with your home preferences and budget.' },
    { icon: Home, title: 'Get Matched Listings', desc: 'Receive automated alerts for homes matching your criteria.' },
    { icon: Shield, title: 'Expert Guidance', desc: 'Our team helps you navigate every step to closing.' },
  ];

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.white, color: C.black, minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: '70vh', backgroundColor: C.black, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Colorado home"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(9,9,9,0.9), transparent)' }} />

        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', width: '100%', position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: 620 }}>
            <div style={{ width: 40, height: 1, backgroundColor: C.gold, marginBottom: 24 }} />
            <h1 style={{ fontFamily: C.display, fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: 300, color: C.white, lineHeight: 0.95, letterSpacing: '0.02em', marginBottom: 24 }}>
              Find Your<br /><em style={{ color: C.gold }}>Dream Home</em>
            </h1>
            <p style={{ fontFamily: C.body, fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.9, letterSpacing: '0.04em', maxWidth: 460 }}>
              Tell us what you're looking for and we'll send you personalized listing alerts for homes that match your criteria across the Denver metro area.
            </p>
          </div>
        </div>

        <div style={{ position: 'absolute', top: '12%', right: '8%', width: '35%', height: '76%', border: '1px solid rgba(255,255,255,0.1)', zIndex: 1 }} />
      </section>

      {/* ── How It Works ── */}
      <section style={{ backgroundColor: C.cream, padding: '80px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>How It Works</p>
          <h2 style={{ fontFamily: C.display, fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, color: C.black, lineHeight: 1.15, marginBottom: 56 }}>
            Three Simple Steps
          </h2>
          <div className="resp-form-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, border: `1px solid ${C.midCream}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Icon size={22} style={{ color: C.gold }} />
                </div>
                <p style={{ fontFamily: C.body, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.gold, fontWeight: 600, marginBottom: 12 }}>Step {i + 1}</p>
                <h3 style={{ fontFamily: C.display, fontSize: 22, fontWeight: 400, color: C.black, marginBottom: 10 }}>{title}</h3>
                <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lead Capture Form ── */}
      <section style={{ padding: '96px 0', backgroundColor: C.white }}>
        <div className="resp-split" style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, alignItems: 'start' }}>

          {/* Left - Copy */}
          <div>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Home Buyers</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300, color: C.black, lineHeight: 1.15, marginBottom: 24 }}>
              Let Us Find<br />Your <em>Perfect Home</em>
            </h2>
            <div style={{ width: 48, height: 1, backgroundColor: C.black, marginBottom: 32 }} />
            <p style={{ fontFamily: C.body, fontSize: 14, lineHeight: 1.9, color: '#5a5248', marginBottom: 32 }}>
              Complete the form and our team will set you up with personalized listing alerts. You'll receive emails with homes that match your bedrooms, bathrooms, price range, and preferred neighborhoods — as soon as they hit the market.
            </p>
            <div style={{ padding: '24px 28px', backgroundColor: C.cream, marginBottom: 24 }}>
              <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, fontWeight: 600, marginBottom: 12 }}>What You'll Get</p>
              {['Automated MLS listing alerts matching your criteria', 'Early access to new listings before they go public', 'Expert guidance from consultation to closing', 'Free home buyer consultation — no obligation'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < 3 ? 10 : 0 }}>
                  <CheckCircle size={14} style={{ color: C.gold, flexShrink: 0 }} />
                  <p style={{ fontFamily: C.body, fontSize: 13, color: C.black, lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>

            <div style={{ padding: '20px 24px', backgroundColor: C.cream }}>
              <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, fontWeight: 600, marginBottom: 8 }}>Agent</p>
              <p style={{ fontFamily: C.body, fontSize: 13, color: C.black }}>Alan Ramirez — Colorado Home Finder LLC</p>
              <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted }}>License #FA100104608 · +1 (773) 818-0444</p>
            </div>
          </div>

          {/* Right - Form */}
          <div>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Get Started</p>
            <h3 style={{ fontFamily: C.display, fontSize: 40, fontWeight: 300, color: C.black, marginBottom: 40, lineHeight: 1.1 }}>
              Tell Us What<br />You're <em>Looking For</em>
            </h3>

            {submitted ? (
              <div style={{ padding: '48px 0', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, border: `1px solid ${C.black}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <span style={{ fontFamily: C.display, fontSize: 28 }}>✓</span>
                </div>
                <h4 style={{ fontFamily: C.display, fontSize: 36, fontWeight: 300, color: C.black, marginBottom: 12 }}>You're All Set</h4>
                <div style={{ width: 40, height: 1, backgroundColor: C.black, margin: '0 auto 20px' }} />
                <p style={{ fontFamily: C.body, fontSize: 14, color: C.muted, lineHeight: 1.8 }}>
                  We've received your preferences. You'll start receiving listing alerts for homes matching your criteria. One of our agents will also reach out within 24 hours.
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

                  {/* Email */}
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input type="email" required placeholder="your@email.com" value={form.email}
                      style={inputStyle('email')}
                      onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                      onChange={e => handleChange('email', e.target.value)} />
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input type="tel" required placeholder="(303) 000-0000" value={form.phone}
                      style={inputStyle('phone')}
                      onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                      onChange={e => handleChange('phone', e.target.value)} />
                  </div>

                  {/* Current Address */}
                  <div>
                    <label style={labelStyle}>Current Address</label>
                    <input type="text" placeholder="Your current address" value={form.currentAddress}
                      style={inputStyle('currentAddress')}
                      onFocus={() => setFocused('currentAddress')} onBlur={() => setFocused('')}
                      onChange={e => handleChange('currentAddress', e.target.value)} />
                  </div>

                  {/* Beds & Baths */}
                  <div className="resp-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                    <div>
                      <label style={labelStyle}>Bedrooms</label>
                      <select value={form.beds} required
                        style={selectStyle('beds')}
                        onFocus={() => setFocused('beds')} onBlur={() => setFocused('')}
                        onChange={e => handleChange('beds', e.target.value)}>
                        <option value="">Select</option>
                        {BEDS_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Bathrooms</label>
                      <select value={form.baths} required
                        style={selectStyle('baths')}
                        onFocus={() => setFocused('baths')} onBlur={() => setFocused('')}
                        onChange={e => handleChange('baths', e.target.value)}>
                        <option value="">Select</option>
                        {BATHS_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label style={labelStyle}>Price Range</label>
                    <select value={form.priceRange} required
                      style={selectStyle('priceRange')}
                      onFocus={() => setFocused('priceRange')} onBlur={() => setFocused('')}
                      onChange={e => handleChange('priceRange', e.target.value)}>
                      <option value="">Select a range</option>
                      {PRICE_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>

                  {/* Area / City of Interest */}
                  <div>
                    <label style={labelStyle}>Area / City of Interest</label>
                    <select value={form.area} required
                      style={selectStyle('area')}
                      onFocus={() => setFocused('area')} onBlur={() => setFocused('')}
                      onChange={e => handleChange('area', e.target.value)}>
                      <option value="">Select a neighborhood</option>
                      {AREA_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
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
                  {submitting ? 'Submitting…' : 'Get My Listing Alerts'} {!submitting && <ArrowRight size={15} />}
                </button>

                <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted, marginTop: 16, textAlign: 'center' }}>
                  Your information is secure. We'll set up your alerts within 24 hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeBuyers;
