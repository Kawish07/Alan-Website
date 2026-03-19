import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, Home, DollarSign, Key, FileText } from 'lucide-react';
import { submitLead, trackBehavior, trackPageView } from '../api';

const C = {
  black: '#0a0a0a', cream: '#f5f3ef', midCream: '#ede9e3',
  gold: '#c9a96e', muted: '#8a8078', white: '#ffffff',
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Jost', sans-serif",
};

const FirstTimeBuyer = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState('');

  useEffect(() => { trackPageView('FirstTimeBuyer'); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitLead({ ...formData, source: 'First Time Buyer Page', intent: 'Buyer' });
    trackBehavior('FORM_SUBMIT', { type: 'FirstTimeBuyer' });
    setSubmitted(true);
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '16px 0',
    border: 'none', borderBottom: `1px solid ${focused === field ? C.white : 'rgba(255,255,255,0.2)'}`,
    outline: 'none', fontFamily: C.body, fontSize: 14, color: C.white,
    backgroundColor: 'transparent', boxSizing: 'border-box', transition: 'border-color 0.2s',
  });

  const steps = [
    { icon: DollarSign, num: '01', title: 'Get Pre-Approved', desc: 'We connect you with trusted local lenders who specialize in first-time buyers and down payment assistance programs.' },
    { icon: Home, num: '02', title: 'Find Your Home', desc: 'Gain exclusive access to listings before they hit the market. We search based on your exact criteria and lifestyle.' },
    { icon: FileText, num: '03', title: 'Make an Offer', desc: 'Our experienced negotiators craft compelling offers that win in competitive situations without overpaying.' },
    { icon: Key, num: '04', title: 'Close with Confidence', desc: 'We guide you through every document, inspection, and closing step so you feel informed and empowered.' },
  ];

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.white, color: C.black, minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', height: '65vh', overflow: 'hidden' }}>
        <img
          src="/devner metro at its best.jpg"
          alt="Home"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.06) 0%, rgba(10,10,10,0.18) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Buyer's Guide</p>
          <div style={{ width: 48, height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: 24 }} />
          <h1 style={{ fontFamily: C.display, fontSize: 'clamp(48px, 7vw, 96px)', fontWeight: 300, color: C.white, lineHeight: 1.05 }}>
            First-Time<br /><em style={{ color: C.gold }}>Home Buyer</em>
          </h1>
        </div>
      </section>

      {/* ── Benefits Bar ── */}
      <section style={{ backgroundColor: C.black }}>
        <div className="resp-grid-4-dark" style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            ['Down Payment Assistance', 'Programs available for qualifying buyers'],
            ['Pre-Approval Help', 'Connect with trusted local lenders'],
            ['Exclusive Access', 'See listings before they go public'],
            ['Negotiation Support', 'Win in competitive situations'],
          ].map(([title, sub], i) => (
            <div key={i} style={{ padding: '32px 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <CheckCircle size={16} style={{ color: C.gold, flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontFamily: C.body, fontSize: 12, fontWeight: 500, color: C.white, marginBottom: 4 }}>{title}</p>
                <p style={{ fontFamily: C.body, fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Intro + Form ── */}
      <section style={{ padding: '96px 0', backgroundColor: C.cream }}>
        <div className="resp-split" style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

          {/* Left */}
          <div>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Your Journey Starts Here</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300, color: C.black, lineHeight: 1.15, marginBottom: 24 }}>
              Navigate Colorado's<br />Market with <em>Confidence</em>
            </h2>
            <div style={{ width: 48, height: 1, backgroundColor: C.black, marginBottom: 32 }} />
            <p style={{ fontFamily: C.body, fontSize: 14, lineHeight: 1.9, color: '#5a5248', marginBottom: 20 }}>
              Buying your first home is one of the most significant financial decisions you'll ever make. Our exclusive guide breaks down every step of the Colorado home-buying process in plain language.
            </p>
            <p style={{ fontFamily: C.body, fontSize: 14, lineHeight: 1.9, color: '#5a5248', marginBottom: 40 }}>
              From securing financing to closing day, we walk alongside you every step of the way — ensuring you feel informed, empowered, and never alone in the process.
            </p>

            <div className="resp-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: '32px', backgroundColor: C.white }}>
              {[
                ['Avg. Savings', '$18,400'],
                ['Days to Close', '28'],
                ['Clients Helped', '500+'],
                ['Satisfaction', '98%'],
              ].map(([lbl, val], i) => (
                <div key={i} style={{ textAlign: 'center', padding: '20px 0', borderBottom: i < 2 ? `1px solid ${C.midCream}` : 'none' }}>
                  <p style={{ fontFamily: C.display, fontSize: 36, fontWeight: 300, color: C.black, lineHeight: 1, marginBottom: 6 }}>{val}</p>
                  <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted }}>{lbl}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form on dark background */}
          <div style={{ backgroundColor: C.black, padding: '56px 48px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ width: 64, height: 64, border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <CheckCircle size={28} style={{ color: C.gold }} />
                </div>
                <h3 style={{ fontFamily: C.display, fontSize: 40, fontWeight: 300, color: C.white, marginBottom: 12 }}>Guide Sent!</h3>
                <div style={{ width: 40, height: 1, backgroundColor: 'rgba(255,255,255,0.15)', margin: '0 auto 20px' }} />
                <p style={{ fontFamily: C.body, fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
                  Check your inbox for your free First-Time Buyer's Guide. A specialist will reach out shortly.
                </p>
              </div>
            ) : (
              <>
                <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>Free Download</p>
                <h3 style={{ fontFamily: C.display, fontSize: 36, fontWeight: 300, color: C.white, lineHeight: 1.1, marginBottom: 8 }}>
                  Download<br />The Guide
                </h3>
                <div style={{ width: 36, height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: 36 }} />

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                  {[
                    ['name', 'Your Name', 'text', 'Full name'],
                    ['email', 'Email', 'email', 'your@email.com'],
                    ['phone', 'Phone', 'tel', '(303) 000-0000'],
                  ].map(([field, label, type, placeholder]) => (
                    <div key={field}>
                      <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: 8 }}>{label}</label>
                      <input type={type} required placeholder={placeholder}
                        style={inputStyle(field)}
                        onFocus={() => setFocused(field)} onBlur={() => setFocused('')}
                        onChange={e => setFormData({ ...formData, [field]: e.target.value })} />
                    </div>
                  ))}

                  <button type="submit"
                    style={{ padding: '16px', backgroundColor: C.white, color: C.black, border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 8, transition: 'background 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.gold; e.currentTarget.style.color = C.white; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; e.currentTarget.style.color = C.black; }}>
                    Get Free Guide <ArrowRight size={15} />
                  </button>

                  <p style={{ fontFamily: C.body, fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center', lineHeight: 1.6 }}>
                    No spam. Unsubscribe anytime.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Step-by-step process ── */}
      <section style={{ padding: '96px 0', backgroundColor: C.white }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>The Process</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300, color: C.black, marginBottom: 20 }}>Your Buying Journey</h2>
            <div style={{ width: 48, height: 1, backgroundColor: C.black, margin: '0 auto' }} />
          </div>

          <div className="resp-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, backgroundColor: C.midCream }}>
            {steps.map((item, i) => (
              <div key={i} style={{ backgroundColor: i % 2 === 0 ? C.white : C.cream, padding: '48px 36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 36, height: 36, backgroundColor: C.black, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.icon size={15} style={{ color: C.white }} />
                  </div>
                  <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.gold }}>{item.num}</p>
                </div>
                <h3 style={{ fontFamily: C.display, fontSize: 26, fontWeight: 300, color: C.black, marginBottom: 16, lineHeight: 1.2 }}>{item.title}</h3>
                <div style={{ width: 28, height: 1, backgroundColor: C.midCream, marginBottom: 16 }} />
                <p style={{ fontFamily: C.body, fontSize: 13, lineHeight: 1.8, color: '#5a5248' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial pull-quote ── */}
      <section style={{ padding: '80px 0', backgroundColor: C.cream }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <p style={{ fontFamily: C.display, fontSize: 'clamp(22px, 3vw, 36px)', fontStyle: 'italic', color: C.black, lineHeight: 1.5, marginBottom: 32 }}>
            "As a first-time buyer, I was nervous about every step. The Colorado Home Finder team made the entire experience seamless — I never felt like I was navigating it alone."
          </p>
          <div style={{ width: 40, height: 1, backgroundColor: C.black, margin: '0 auto 20px' }} />
          <p style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted }}>Jessica M. — Denver, CO</p>
        </div>
      </section>
    </div>
  );
};

export default FirstTimeBuyer;