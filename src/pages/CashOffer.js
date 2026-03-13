import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, Clock, DollarSign, Shield } from 'lucide-react';
import { submitLead, trackBehavior, trackPageView } from '../api';

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

const CashOffer = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', beds: '', baths: '', priceRange: '', notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState('');

  useEffect(() => { trackPageView('CashOffer'); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const details = [
      formData.address && `Property: ${formData.address}`,
      formData.beds && `Beds: ${formData.beds}`,
      formData.baths && `Baths: ${formData.baths}`,
      formData.priceRange && `Est. Value: ${formData.priceRange}`,
      formData.notes,
    ].filter(Boolean).join(' | ');
    await submitLead({ name: fullName, email: formData.email, phone: formData.phone, source: 'Cash Offer Page', intent: 'Seller', message: details });
    trackBehavior('FORM_SUBMIT', { type: 'CashOffer' });
    setSubmitted(true);
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '16px 0',
    border: 'none', borderBottom: `1px solid ${focused === field ? C.black : C.midCream}`,
    outline: 'none', fontFamily: C.body, fontSize: 14, color: C.black,
    backgroundColor: 'transparent', boxSizing: 'border-box', transition: 'border-color 0.2s',
  });

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.white, color: C.black, minHeight: '100vh' }}>

      {/* ── Hero / Split ── */}
      <section className="resp-hero-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

        {/* Left: Dark panel */}
        <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: C.black }}>
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Home"
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, opacity: 0.35 }}
          />
          <div className="resp-hero-split-panel" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 72px' }}>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
              Guaranteed Offer
            </p>
            <h1 style={{ fontFamily: C.display, fontSize: 'clamp(44px, 5vw, 72px)', fontWeight: 300, color: C.white, lineHeight: 1.1, marginBottom: 28 }}>
              Get a Cash<br /><em style={{ color: C.gold }}>Offer Today</em>
            </h1>
            <div style={{ width: 48, height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 32 }} />
            <p style={{ fontFamily: C.body, fontSize: 14, lineHeight: 1.9, color: 'rgba(255,255,255,0.5)', marginBottom: 52, maxWidth: 400 }}>
              Skip the repairs, showings, and uncertainty. Get a guaranteed all-cash offer within 24 hours — no obligations.
            </p>

            {/* Benefits */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                [CheckCircle, 'No Repairs Needed', 'Sell as-is — we handle everything so you don\'t have to.'],
                [Clock, 'Close in 7 Days', 'Our streamlined process means you get paid fast.'],
                [DollarSign, 'No Hidden Fees', 'Transparent pricing with zero commissions deducted.'],
                [Shield, 'Guaranteed Offer', 'Once we make an offer, it\'s yours — no last-minute changes.'],
              ].map(([Icon, title, desc], i) => (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <Icon size={15} style={{ color: C.gold }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: C.body, fontSize: 13, fontWeight: 500, color: C.white, marginBottom: 4 }}>{title}</p>
                    <p style={{ fontFamily: C.body, fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="resp-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, marginTop: 64, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {[['24hrs', 'To Offer'], ['7 days', 'To Close'], ['0%', 'Commission']].map(([val, lbl], i) => (
                <div key={i} style={{ textAlign: 'center', paddingRight: i < 2 ? 24 : 0, borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                  <p style={{ fontFamily: C.display, fontSize: 32, fontWeight: 300, color: C.white, lineHeight: 1, marginBottom: 6 }}>{val}</p>
                  <p style={{ fontFamily: C.body, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="resp-hero-split-panel" style={{ backgroundColor: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 64px' }}>
          <div style={{ width: '100%', maxWidth: 480 }}>
            {submitted ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, border: `1px solid ${C.black}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <CheckCircle size={32} style={{ color: C.black }} />
                </div>
                <h3 style={{ fontFamily: C.display, fontSize: 44, fontWeight: 300, color: C.black, marginBottom: 12 }}>Offer Requested</h3>
                <div style={{ width: 40, height: 1, backgroundColor: C.black, margin: '0 auto 24px' }} />
                <p style={{ fontFamily: C.body, fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 32 }}>
                  We've received your request. A member of our team will reach out within 24 hours with your cash offer.
                </p>
                <div style={{ backgroundColor: C.white, padding: '20px 24px', border: `1px solid ${C.midCream}`, textAlign: 'left' }}>
                  <p style={{ fontFamily: C.body, fontSize: 12, color: C.black, marginBottom: 4 }}><strong>Property:</strong> {formData.address}</p>
                  <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted }}>We'll contact you at {formData.email || formData.phone}</p>
                </div>
              </div>
            ) : (
              <>
                <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.muted, marginBottom: 12 }}>Free — No Obligation</p>
                <h2 style={{ fontFamily: C.display, fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 300, color: C.black, lineHeight: 1.1, marginBottom: 8 }}>
                  Get an Instant<br />Cash Offer Quote
                </h2>
                <div style={{ width: 40, height: 1, backgroundColor: C.black, marginBottom: 40 }} />

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* First & Last Name */}
                  <div className="resp-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <div>
                      <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>First Name</label>
                      <input type="text" required placeholder="First name" value={formData.firstName}
                        style={inputStyle('firstName')}
                        onFocus={() => setFocused('firstName')} onBlur={() => setFocused('')}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Last Name</label>
                      <input type="text" required placeholder="Last name" value={formData.lastName}
                        style={inputStyle('lastName')}
                        onFocus={() => setFocused('lastName')} onBlur={() => setFocused('')}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="resp-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <div>
                      <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Email</label>
                      <input type="email" required placeholder="your@email.com" value={formData.email}
                        style={inputStyle('email')}
                        onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                        onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Phone</label>
                      <input type="tel" required placeholder="(303) 000-0000" value={formData.phone}
                        style={inputStyle('phone')}
                        onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                  </div>

                  {/* Property Address */}
                  <div>
                    <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Property Address</label>
                    <input type="text" required placeholder="123 Main St, Denver, CO" value={formData.address}
                      style={inputStyle('address')}
                      onFocus={() => setFocused('address')} onBlur={() => setFocused('')}
                      onChange={e => setFormData({ ...formData, address: e.target.value })} />
                  </div>

                  {/* Beds & Baths */}
                  <div className="resp-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <div>
                      <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Bedrooms</label>
                      <select value={formData.beds}
                        style={{ ...inputStyle('beds'), cursor: 'pointer', color: formData.beds ? C.black : C.muted }}
                        onFocus={() => setFocused('beds')} onBlur={() => setFocused('')}
                        onChange={e => setFormData({ ...formData, beds: e.target.value })}>
                        <option value="">Select</option>
                        {BEDS_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Bathrooms</label>
                      <select value={formData.baths}
                        style={{ ...inputStyle('baths'), cursor: 'pointer', color: formData.baths ? C.black : C.muted }}
                        onFocus={() => setFocused('baths')} onBlur={() => setFocused('')}
                        onChange={e => setFormData({ ...formData, baths: e.target.value })}>
                        <option value="">Select</option>
                        {BATHS_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Estimated Home Value */}
                  <div>
                    <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Estimated Home Value</label>
                    <select value={formData.priceRange}
                      style={{ ...inputStyle('priceRange'), cursor: 'pointer', color: formData.priceRange ? C.black : C.muted }}
                      onFocus={() => setFocused('priceRange')} onBlur={() => setFocused('')}
                      onChange={e => setFormData({ ...formData, priceRange: e.target.value })}>
                      <option value="">Select a range</option>
                      {PRICE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Additional Notes</label>
                    <textarea rows={3} placeholder="Any details about your property or situation (optional)" value={formData.notes}
                      style={{ ...inputStyle('notes'), resize: 'none', borderBottom: 'none', border: `1px solid ${focused === 'notes' ? C.black : C.midCream}`, padding: '14px 16px' }}
                      onFocus={() => setFocused('notes')} onBlur={() => setFocused('')}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                  </div>

                  <button type="submit"
                    style={{ padding: '18px', backgroundColor: C.black, color: C.white, border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 8, transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = C.black}>
                    Get My Cash Offer <ArrowRight size={15} />
                  </button>

                  <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted, textAlign: 'center', lineHeight: 1.6 }}>
                    No commitment required. We'll reach out within 24 hours.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: '96px 0', backgroundColor: C.white }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Simple Process</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300, color: C.black, marginBottom: 20 }}>How It Works</h2>
            <div style={{ width: 48, height: 1, backgroundColor: C.black, margin: '0 auto' }} />
          </div>

          <div className="resp-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, backgroundColor: C.midCream }}>
            {[
              { step: '01', title: 'Submit Your Address', desc: 'Fill out our simple form with your property details. It takes less than 2 minutes.' },
              { step: '02', title: 'Receive Your Offer', desc: 'Our team reviews your property and sends a competitive all-cash offer within 24 hours.' },
              { step: '03', title: 'Review & Accept', desc: 'Review the offer at your own pace. No pressure, no deadlines. Accept when you\'re ready.' },
              { step: '04', title: 'Close & Get Paid', desc: 'Choose your closing date. We handle all the paperwork and you receive your funds in days.' },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: C.cream, padding: '48px 36px' }}>
                <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.gold, marginBottom: 20 }}>{item.step}</p>
                <h3 style={{ fontFamily: C.display, fontSize: 26, fontWeight: 300, color: C.black, marginBottom: 16, lineHeight: 1.2 }}>{item.title}</h3>
                <div style={{ width: 28, height: 1, backgroundColor: C.midCream, marginBottom: 16 }} />
                <p style={{ fontFamily: C.body, fontSize: 13, lineHeight: 1.8, color: '#5a5248' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CashOffer;