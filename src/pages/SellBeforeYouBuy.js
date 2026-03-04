import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitLead, trackBehavior } from '../api';
import { CheckCircle, ArrowRight, Home, DollarSign, TrendingUp, Shield, Phone } from 'lucide-react';

const C = {
  black: '#0a0a0a', cream: '#f5f3ef', midCream: '#ede9e3',
  gold: '#c9a96e', muted: '#8a8078', white: '#ffffff',
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Jost', sans-serif",
};

const SellBeforeYouBuy = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', estimatedValue: '', timeline: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitLead({ ...formData, source: 'Sell Before You Buy Page', intent: 'Both' });
      trackBehavior('FORM_SUBMIT', { source: 'Sell Before You Buy' });
    } catch {}
    setSubmitted(true);
  };

  const benefits = [
    { icon: Home, title: 'Buy First, Sell Later', desc: 'Move into your new home before selling the old one. No need for temporary housing.' },
    { icon: DollarSign, title: 'Unlock Your Equity', desc: 'Access the equity in your current home to fund the purchase of your next property.' },
    { icon: TrendingUp, title: 'Maximize Sale Price', desc: 'Sell your home on your own timeline without the pressure of a deadline, getting top dollar.' },
    { icon: Shield, title: 'Guaranteed Sale', desc: 'Competitive backup offer ensures your home sells, giving you certainty and peace of mind.' },
  ];

  const steps = [
    { num: '01', title: 'Get Your Home Valued', desc: 'We assess your current home\'s market value and determine how much equity you can access.' },
    { num: '02', title: 'Find Your New Home', desc: 'Shop for your dream home with confidence, knowing your current home\'s sale is handled.' },
    { num: '03', title: 'Move In', desc: 'Close on your new home and move in at your own pace without the stress of coordinating two transactions.' },
    { num: '04', title: 'Sell Your Old Home', desc: 'We list and sell your previous home for top dollar once you\'re settled in your new place.' },
  ];

  if (submitted) {
    return (
      <div style={{ fontFamily: C.body, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: C.cream, paddingTop: 80 }}>
        <div style={{ textAlign: 'center', maxWidth: 480, padding: 40 }}>
          <CheckCircle size={64} style={{ color: '#4caf50', margin: '0 auto 24px' }} />
          <h2 style={{ fontFamily: C.display, fontSize: 36, fontWeight: 300, color: C.black, marginBottom: 12 }}>Thank You!</h2>
          <p style={{ fontFamily: C.body, fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 32 }}>
            We've received your information. Alan Ramirez will review your details and reach out within 24 hours with a personalized equity assessment.
          </p>
          <Link to="/" style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.white, textDecoration: 'none', backgroundColor: C.black, padding: '14px 36px', display: 'inline-block', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.gold; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.black; e.currentTarget.style.transform = 'translateY(0)'; }}>
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.white, color: C.black }}>

      {/* Hero */}
      <section style={{ position: 'relative', height: '70vh', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Luxury Home" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.7) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>Bridge Program</p>
          <div style={{ width: 48, height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: 24 }} />
          <h1 style={{ fontFamily: C.display, fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 300, color: C.white, lineHeight: 1.1, marginBottom: 24 }}>
            Sell Before<br />You Buy
          </h1>
          <p style={{ fontFamily: C.body, fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 560, lineHeight: 1.8 }}>
            Move into your new dream home before selling your current one. Our bridge program makes it seamless.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: '96px 0', backgroundColor: C.cream }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Benefits</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, color: C.black, marginBottom: 20 }}>Why Choose Our Program?</h2>
            <div style={{ width: 48, height: 1, backgroundColor: C.black, margin: '0 auto' }} />
          </div>
          <div className="resp-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {benefits.map((b, i) => (
              <div key={i} className="chf-card" style={{ backgroundColor: C.white, padding: '40px 32px', textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, backgroundColor: C.black, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <b.icon size={22} style={{ color: C.white }} />
                </div>
                <h3 style={{ fontFamily: C.display, fontSize: 22, fontWeight: 400, color: C.black, marginBottom: 12 }}>{b.title}</h3>
                <p style={{ fontFamily: C.body, fontSize: 13, lineHeight: 1.8, color: '#5a5248' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '96px 0', backgroundColor: C.black }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Process</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, color: C.white, marginBottom: 20 }}>How It Works</h2>
            <div style={{ width: 48, height: 1, backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 auto' }} />
          </div>
          <div className="resp-grid-4-dark" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, backgroundColor: 'rgba(255,255,255,0.05)' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ backgroundColor: C.black, padding: '48px 36px', transition: 'background-color 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#161614'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = C.black}>
                <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.gold, marginBottom: 20 }}>{s.num}</p>
                <h3 style={{ fontFamily: C.display, fontSize: 24, fontWeight: 300, color: C.white, marginBottom: 12, lineHeight: 1.3 }}>{s.title}</h3>
                <div style={{ width: 24, height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 16 }} />
                <p style={{ fontFamily: C.body, fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,0.5)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equity Form */}
      <section style={{ padding: '96px 0', backgroundColor: C.cream }}>
        <div className="resp-split" style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Get Started</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, color: C.black, lineHeight: 1.2, marginBottom: 24 }}>
              See How Much <em>Equity</em> You Have
            </h2>
            <div style={{ width: 48, height: 1, backgroundColor: C.black, marginBottom: 32 }} />
            <p style={{ fontFamily: C.body, fontSize: 14, lineHeight: 1.9, color: '#5a5248', marginBottom: 24 }}>
              Fill out the form and Alan will provide a detailed equity assessment of your current home, along with a personalized plan to help you transition to your new property seamlessly.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 32 }}>
              <Phone size={18} style={{ color: C.gold }} />
              <span style={{ fontFamily: C.body, fontSize: 14, color: C.black }}>Questions? Call (303) 555-0123</span>
            </div>
          </div>

          <div style={{ backgroundColor: C.black, padding: '48px 40px' }}>
            <h3 style={{ fontFamily: C.display, fontSize: 28, fontWeight: 300, color: C.white, marginBottom: 8 }}>Your Equity Assessment</h3>
            <p style={{ fontFamily: C.body, fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>Step {step} of 2</p>

            <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); setStep(2); }}>
              {step === 1 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <input type="text" placeholder="Current Home Address" required value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.05)', color: C.white, fontFamily: C.body, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                  <input type="text" placeholder="Estimated Home Value (e.g., $500,000)" value={formData.estimatedValue}
                    onChange={e => setFormData({ ...formData, estimatedValue: e.target.value })}
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.05)', color: C.white, fontFamily: C.body, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                  <select value={formData.timeline} onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.05)', color: formData.timeline ? C.white : 'rgba(255,255,255,0.5)', fontFamily: C.body, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}>
                    <option value="">Purchase Timeline</option>
                    <option value="immediately">Immediately</option>
                    <option value="1-3months">1-3 Months</option>
                    <option value="3-6months">3-6 Months</option>
                    <option value="6+months">6+ Months</option>
                  </select>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <input type="text" placeholder="Full Name" required value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.05)', color: C.white, fontFamily: C.body, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                  <input type="email" placeholder="Email" required value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.05)', color: C.white, fontFamily: C.body, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                  <input type="tel" placeholder="Phone" required value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.05)', color: C.white, fontFamily: C.body, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                {step === 2 && (
                  <button type="button" onClick={() => setStep(1)}
                    style={{ padding: '14px 24px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', color: C.white, fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    Back
                  </button>
                )}
                <button type="submit"
                  style={{ flex: 1, padding: '14px 24px', backgroundColor: C.white, color: C.black, border: 'none', fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.gold; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  {step === 1 ? 'Next Step' : 'Get My Assessment'} <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SellBeforeYouBuy;
