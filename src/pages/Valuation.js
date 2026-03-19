import React, { useState, useEffect } from 'react';
import { submitLead, trackBehavior, trackPageView } from '../api';
import { Home, ArrowRight, TrendingUp, Clock, Shield, CheckCircle } from 'lucide-react';

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

const Valuation = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', beds: '', baths: '', priceRange: '', notes: '',
  });
  const [focused, setFocused] = useState('');

  useEffect(() => { trackPageView('Valuation'); }, []);

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
    await submitLead({ name: fullName, email: formData.email, phone: formData.phone, source: 'Home Valuation Page', intent: 'Seller', message: details });
    trackBehavior('FORM_SUBMIT', { type: 'Valuation' });
    setStep(3);
  };

  return (
    <div style={{ fontFamily: C.body, minHeight: '100vh', backgroundColor: C.white, position: 'relative', overflow: 'hidden' }}>

      {/* Split Layout */}
      <div className="resp-hero-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

        {/* Left: Image + Content */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img src="/find your perfect coleredo image.jpg"
            alt="Luxury Home" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.6) 100%)' }} />

          <div className="resp-hero-split-panel" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 72px' }}>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>
              Free Evaluation
            </p>
            <h1 style={{ fontFamily: C.display, fontSize: 'clamp(44px, 5vw, 72px)', fontWeight: 300, color: C.white, lineHeight: 1.1, marginBottom: 28 }}>
              What's Your<br /><em style={{ color: C.gold }}>Home Worth?</em>
            </h1>
            <div style={{ width: 48, height: 1, backgroundColor: 'rgba(255,255,255,0.25)', marginBottom: 32 }} />
            <p style={{ fontFamily: C.body, fontSize: 14, lineHeight: 1.9, color: 'rgba(255,255,255,0.5)', marginBottom: 48, maxWidth: 420 }}>
              Discover the true market value of your property in today's competitive Colorado market. Get a comprehensive analysis from our expert team.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                [TrendingUp, 'Accurate Market Analysis'],
                [Clock, '24-Hour Response Time'],
                [Shield, 'No Obligation Required'],
              ].map(([Icon, text], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 40, height: 40, border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} style={{ color: C.gold }} />
                  </div>
                  <span style={{ fontFamily: C.body, fontSize: 13, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.05em' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="resp-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 56, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              {[['$2B+', 'Career Sales'], ['#1', 'Colorado Team']].map(([val, label], i) => (
                <div key={i}>
                  <p style={{ fontFamily: C.display, fontSize: 40, fontWeight: 300, color: C.white, lineHeight: 1, marginBottom: 6 }}>{val}</p>
                  <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="resp-hero-split-panel" style={{ backgroundColor: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 64px' }}>
          <div style={{ width: '100%', maxWidth: 480 }}>

            {/* Step indicator */}
            {step < 3 && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 48 }}>
                {[1, 2].map(s => (
                  <div key={s} style={{ flex: 1, height: 2, backgroundColor: step >= s ? C.black : C.midCream, transition: 'background 0.4s' }} />
                ))}
              </div>
            )}

            {step === 1 && (
              <div>
                <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.muted, marginBottom: 12 }}>Step 1 of 2</p>
                <h2 style={{ fontFamily: C.display, fontSize: 42, fontWeight: 300, color: C.black, marginBottom: 8, lineHeight: 1.1 }}>
                  Enter Your<br />Property Address
                </h2>
                <div style={{ width: 40, height: 1, backgroundColor: C.black, marginBottom: 36 }} />

                <div style={{ position: 'relative', marginBottom: 20 }}>
                  <Home size={18} style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
                  <input type="text" placeholder="123 Main St, Denver, CO"
                    style={{ width: '100%', paddingLeft: 50, paddingRight: 20, paddingTop: 18, paddingBottom: 18, border: `1px solid ${C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 14, color: C.black, backgroundColor: C.white, boxSizing: 'border-box' }}
                    value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                </div>

                <button onClick={() => setStep(2)}
                  style={{ width: '100%', padding: '18px', backgroundColor: C.black, color: C.white, border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = C.black}>
                  Get Home Value <ArrowRight size={16} />
                </button>

                <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted, textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
                  No obligation — get your comprehensive market report free.
                </p>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit}>
                <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.muted, marginBottom: 12 }}>Step 2 of 2</p>
                <h2 style={{ fontFamily: C.display, fontSize: 42, fontWeight: 300, color: C.black, marginBottom: 8, lineHeight: 1.1 }}>
                  Your Details &<br />Property Info
                </h2>
                <div style={{ width: 40, height: 1, backgroundColor: C.black, marginBottom: 36 }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                  {/* First & Last Name */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <input type="text" placeholder="First Name" required value={formData.firstName}
                      style={{ width: '100%', padding: '16px 18px', border: `1px solid ${focused === 'firstName' ? C.black : C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, backgroundColor: C.white, boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                      onFocus={() => setFocused('firstName')} onBlur={() => setFocused('')}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                    <input type="text" placeholder="Last Name" required value={formData.lastName}
                      style={{ width: '100%', padding: '16px 18px', border: `1px solid ${focused === 'lastName' ? C.black : C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, backgroundColor: C.white, boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                      onFocus={() => setFocused('lastName')} onBlur={() => setFocused('')}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                  </div>

                  {/* Email & Phone */}
                  <input type="email" placeholder="Email Address" required value={formData.email}
                    style={{ width: '100%', padding: '16px 18px', border: `1px solid ${focused === 'email' ? C.black : C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, backgroundColor: C.white, boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                    onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  <input type="tel" placeholder="Phone Number" required value={formData.phone}
                    style={{ width: '100%', padding: '16px 18px', border: `1px solid ${focused === 'phone' ? C.black : C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, backgroundColor: C.white, boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                    onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })} />

                  {/* Beds & Baths */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <select value={formData.beds}
                      style={{ width: '100%', padding: '16px 18px', border: `1px solid ${focused === 'beds' ? C.black : C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 13, color: formData.beds ? C.black : C.muted, backgroundColor: C.white, boxSizing: 'border-box', cursor: 'pointer', transition: 'border-color 0.2s' }}
                      onFocus={() => setFocused('beds')} onBlur={() => setFocused('')}
                      onChange={e => setFormData({ ...formData, beds: e.target.value })}>
                      <option value="">Bedrooms</option>
                      {BEDS_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <select value={formData.baths}
                      style={{ width: '100%', padding: '16px 18px', border: `1px solid ${focused === 'baths' ? C.black : C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 13, color: formData.baths ? C.black : C.muted, backgroundColor: C.white, boxSizing: 'border-box', cursor: 'pointer', transition: 'border-color 0.2s' }}
                      onFocus={() => setFocused('baths')} onBlur={() => setFocused('')}
                      onChange={e => setFormData({ ...formData, baths: e.target.value })}>
                      <option value="">Bathrooms</option>
                      {BATHS_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  {/* Estimated Home Value */}
                  <select value={formData.priceRange}
                    style={{ width: '100%', padding: '16px 18px', border: `1px solid ${focused === 'priceRange' ? C.black : C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 13, color: formData.priceRange ? C.black : C.muted, backgroundColor: C.white, boxSizing: 'border-box', cursor: 'pointer', transition: 'border-color 0.2s' }}
                    onFocus={() => setFocused('priceRange')} onBlur={() => setFocused('')}
                    onChange={e => setFormData({ ...formData, priceRange: e.target.value })}>
                    <option value="">Estimated Home Value</option>
                    {PRICE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>

                  {/* Additional Notes */}
                  <textarea rows={3} placeholder="Additional notes or comments (optional)" value={formData.notes}
                    style={{ width: '100%', padding: '16px 18px', border: `1px solid ${focused === 'notes' ? C.black : C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, backgroundColor: C.white, boxSizing: 'border-box', resize: 'none', transition: 'border-color 0.2s' }}
                    onFocus={() => setFocused('notes')} onBlur={() => setFocused('')}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                </div>

                <button type="submit"
                  style={{ width: '100%', padding: '18px', backgroundColor: C.black, color: C.white, border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 12 }}>
                  Get My Free Valuation
                </button>

                <button type="button" onClick={() => setStep(1)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11, color: C.muted, textDecoration: 'underline' }}>
                  ← Back
                </button>

                <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted, marginTop: 16, lineHeight: 1.6 }}>
                  By submitting, you agree to be contacted by our team regarding your property valuation.
                </p>
              </form>
            )}

            {step === 3 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, backgroundColor: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <CheckCircle size={40} style={{ color: '#22c55e' }} />
                </div>
                <h2 style={{ fontFamily: C.display, fontSize: 48, fontWeight: 300, color: C.black, marginBottom: 12 }}>Thank You!</h2>
                <div style={{ width: 40, height: 1, backgroundColor: C.black, margin: '0 auto 24px' }} />
                <p style={{ fontFamily: C.body, fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 32 }}>
                  Your home valuation request has been received. One of our experts will contact you within 24 hours with a comprehensive market analysis.
                </p>
                <div style={{ backgroundColor: C.white, padding: '20px 24px', border: `1px solid ${C.midCream}`, textAlign: 'left' }}>
                  <p style={{ fontFamily: C.body, fontSize: 12, color: C.black, marginBottom: 4 }}>
                    <strong>Next Step:</strong> Check your email for a confirmation.
                  </p>
                  <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted }}>
                    We've sent a summary of your request to {formData.email || 'your email'}.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Valuation;