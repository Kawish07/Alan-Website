import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Calendar, Phone } from 'lucide-react';
import { submitLead, trackPageView } from '../api';

const C = {
  black: '#0a0a0a', cream: '#f5f3ef', midCream: '#ede9e3',
  gold: '#c9a96e', muted: '#8a8078', white: '#ffffff',
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Jost', sans-serif",
};

const AREA_OPTIONS = [
  'Aurora, CO', 'Cherry Creek', 'Denver Metro', 'DTC (Denver Tech Center)',
  'DIA / Green Valley Ranch', 'Glendale', 'Downtown Denver', 'Custom Search (All CO)',
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
      await submitLead({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email, phone: form.phone,
        intent: 'Buyer', source: 'Home Buyers Page',
        buyerCriteria: {
          beds: form.beds, baths: form.baths,
          priceRange: form.priceRange, area: form.area,
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

  const inp = (field) => ({
    width: '100%', padding: '13px 14px',
    border: `1.5px solid ${focused === field ? C.black : C.midCream}`,
    outline: 'none', fontFamily: C.body, fontSize: 14, color: C.black,
    backgroundColor: C.white, boxSizing: 'border-box', transition: 'border-color 0.2s',
  });

  const sel = (field) => ({
    ...inp(field),
    appearance: 'none', WebkitAppearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%238a8078\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
    cursor: 'pointer', paddingRight: 32,
  });

  const lbl = {
    fontFamily: C.body, fontSize: 11, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: C.black, fontWeight: 600,
    display: 'block', marginBottom: 6,
  };

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.white, color: C.black, minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: '55vh', backgroundColor: C.black, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Colorado home"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.8) 100%)' }} />
        <div style={{ maxWidth: 920, margin: '0 auto', padding: '100px 32px 72px', position: 'relative', zIndex: 10, textAlign: 'center', width: '100%' }}>
          <h1 style={{ fontFamily: C.display, fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 300, color: C.white, lineHeight: 1.05, marginBottom: 20 }}>
            Find Your Colorado Home
          </h1>
          <p style={{ fontFamily: C.body, fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 36px' }}>
            Get matched with listings that fit your budget and must-haves — or schedule a showing today. Alan responds personally, 24 hours a day.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14 }}>
            <a href="#get-alerts"
              style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, color: C.black, textDecoration: 'none', backgroundColor: C.gold, padding: '15px 36px', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#d4b47e'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.gold; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <ArrowRight size={14} /> Get Listing Alerts
            </a>
            <Link to="/book-showing"
              style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, color: C.white, textDecoration: 'none', backgroundColor: 'transparent', border: '2px solid rgba(255,255,255,0.6)', padding: '15px 36px', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.color = C.white; }}>
              <Calendar size={14} /> Schedule a Showing
            </Link>
          </div>
          {/* Phone strip */}
          <p style={{ fontFamily: C.body, fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 28 }}>
            Or call/text Alan directly:&nbsp;
            <a href="tel:+17738180444" style={{ color: C.gold, textDecoration: 'none', fontWeight: 600 }}>(773) 818-0444</a>
            &nbsp;— Available 24/7
          </p>
        </div>
      </section>

      {/* ── 3-stat trust bar ── */}
      <section style={{ backgroundColor: C.black, borderTop: `3px solid ${C.gold}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { num: '500+', label: 'Families Helped' },
            { num: '24/7', label: 'Always Available' },
            { num: '10+ Yrs', label: 'Colorado Experience' },
          ].map(({ num, label }, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '28px 16px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              <p style={{ fontFamily: C.display, fontSize: 34, fontWeight: 400, color: C.gold, margin: 0 }}>{num}</p>
              <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', margin: '4px 0 0' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Lead Capture Form ── */}
      <section id="get-alerts" style={{ padding: '72px 0', backgroundColor: C.cream }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 32px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 300, color: C.black, marginBottom: 12 }}>
              Start Your Home Search
            </h2>
            <p style={{ fontFamily: C.body, fontSize: 14, color: C.muted, lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
              Fill out the form below. Alan will personally set up automated listing alerts matching your criteria — straight to your inbox the moment homes hit the market.
            </p>
          </div>

          {/* Form card */}
          <div style={{ backgroundColor: C.white, padding: '40px 40px 32px', border: `1px solid ${C.midCream}` }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <CheckCircle size={56} style={{ color: '#4caf50', margin: '0 auto 20px', display: 'block' }} />
                <h3 style={{ fontFamily: C.display, fontSize: 36, fontWeight: 300, color: C.black, marginBottom: 10 }}>You're All Set!</h3>
                <p style={{ fontFamily: C.body, fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 28 }}>
                  Alan has your preferences. Expect listing alerts in your inbox shortly — and a personal follow-up call or text within 24 hours.
                </p>
                <Link to="/book-showing"
                  style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, color: C.white, textDecoration: 'none', backgroundColor: C.black, padding: '14px 32px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Calendar size={14} /> Schedule a Showing Now
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gap: 20 }}>

                  {/* Name row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={lbl}>First Name *</label>
                      <input type="text" required placeholder="First name" value={form.firstName}
                        style={inp('firstName')} onFocus={() => setFocused('firstName')} onBlur={() => setFocused('')}
                        onChange={e => handleChange('firstName', e.target.value)} />
                    </div>
                    <div>
                      <label style={lbl}>Last Name *</label>
                      <input type="text" required placeholder="Last name" value={form.lastName}
                        style={inp('lastName')} onFocus={() => setFocused('lastName')} onBlur={() => setFocused('')}
                        onChange={e => handleChange('lastName', e.target.value)} />
                    </div>
                  </div>

                  {/* Contact row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={lbl}>Email Address *</label>
                      <input type="email" required placeholder="you@email.com" value={form.email}
                        style={inp('email')} onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                        onChange={e => handleChange('email', e.target.value)} />
                    </div>
                    <div>
                      <label style={lbl}>Phone Number *</label>
                      <input type="tel" required placeholder="(303) 000-0000" value={form.phone}
                        style={inp('phone')} onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                        onChange={e => handleChange('phone', e.target.value)} />
                    </div>
                  </div>

                  {/* Beds & Baths */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={lbl}>Bedrooms *</label>
                      <select required value={form.beds} style={sel('beds')}
                        onFocus={() => setFocused('beds')} onBlur={() => setFocused('')}
                        onChange={e => handleChange('beds', e.target.value)}>
                        <option value="">Select</option>
                        {BEDS_OPTIONS.map(b => <option key={b} value={b}>{b} bed{b !== '1' ? 's' : ''}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>Bathrooms *</label>
                      <select required value={form.baths} style={sel('baths')}
                        onFocus={() => setFocused('baths')} onBlur={() => setFocused('')}
                        onChange={e => handleChange('baths', e.target.value)}>
                        <option value="">Select</option>
                        {BATHS_OPTIONS.map(b => <option key={b} value={b}>{b} bath{b !== '1' ? 's' : ''}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Price & Area */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={lbl}>Price Range *</label>
                      <select required value={form.priceRange} style={sel('priceRange')}
                        onFocus={() => setFocused('priceRange')} onBlur={() => setFocused('')}
                        onChange={e => handleChange('priceRange', e.target.value)}>
                        <option value="">Select range</option>
                        {PRICE_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>Area / Neighborhood *</label>
                      <select required value={form.area} style={sel('area')}
                        onFocus={() => setFocused('area')} onBlur={() => setFocused('')}
                        onChange={e => handleChange('area', e.target.value)}>
                        <option value="">Select area</option>
                        {AREA_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Current Address */}
                  <div>
                    <label style={lbl}>Current Address (optional)</label>
                    <input type="text" placeholder="Your current address" value={form.currentAddress}
                      style={inp('currentAddress')} onFocus={() => setFocused('currentAddress')} onBlur={() => setFocused('')}
                      onChange={e => handleChange('currentAddress', e.target.value)} />
                  </div>

                </div>

                {/* Submit */}
                <button type="submit" disabled={submitting}
                  style={{
                    width: '100%', marginTop: 28, padding: '17px',
                    backgroundColor: submitting ? '#555' : C.black,
                    color: C.white, border: 'none', cursor: submitting ? 'default' : 'pointer',
                    fontFamily: C.body, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { if (!submitting) e.currentTarget.style.backgroundColor = C.gold; }}
                  onMouseLeave={e => { if (!submitting) e.currentTarget.style.backgroundColor = C.black; }}>
                  {submitting ? 'Sending…' : <><ArrowRight size={15} /> Send Me Matching Listings</>}
                </button>

                <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted, marginTop: 12, textAlign: 'center' }}>
                  100% free — no obligation. Alan will follow up personally.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Schedule a Showing — full CTA band ── */}
      <section style={{ backgroundColor: C.black, padding: '64px 0' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
            {/* Left copy */}
            <div style={{ flex: '1 1 340px' }}>
              <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, fontWeight: 600, marginBottom: 10 }}>Ready to See It In Person?</p>
              <h2 style={{ fontFamily: C.display, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, color: C.white, lineHeight: 1.15, marginBottom: 12 }}>
                Schedule a Showing Today
              </h2>
              <p style={{ fontFamily: C.body, fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                Found a home you love? Alan will walk you through it — any day, any time. No pressure, just a private tour.
              </p>
            </div>
            {/* Right buttons */}
            <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 12, minWidth: 220 }}>
              <Link to="/book-showing"
                style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, color: C.black, textDecoration: 'none', backgroundColor: C.gold, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#d4b47e'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.gold; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <Calendar size={14} /> Book a Showing
              </Link>
              <a href="tel:+17738180444"
                style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, color: C.white, textDecoration: 'none', backgroundColor: 'transparent', border: '2px solid rgba(255,255,255,0.4)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = C.white; }}>
                <Phone size={14} /> (773) 818-0444
              </a>
              <p style={{ fontFamily: C.body, fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>Call or text — available 24/7</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomeBuyers;
