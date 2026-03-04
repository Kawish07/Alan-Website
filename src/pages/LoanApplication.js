import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitLead, trackBehavior } from '../api';
import { CheckCircle, ArrowRight, DollarSign, Shield, Clock, FileText, Phone } from 'lucide-react';

const C = {
  black: '#0a0a0a', cream: '#f5f3ef', midCream: '#ede9e3',
  gold: '#c9a96e', muted: '#8a8078', white: '#ffffff',
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Jost', sans-serif",
};

const LoanApplication = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    loanType: '', purchasePrice: '', downPayment: '',
    employmentStatus: '', annualIncome: '', creditScore: '',
    propertyAddress: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitLead({
        name: formData.name, email: formData.email, phone: formData.phone,
        message: `Loan Type: ${formData.loanType} | Purchase Price: ${formData.purchasePrice} | Down Payment: ${formData.downPayment} | Employment: ${formData.employmentStatus} | Income: ${formData.annualIncome} | Credit: ${formData.creditScore} | Property: ${formData.propertyAddress} | Notes: ${formData.message}`,
        source: 'Loan Application Page', intent: 'Buyer'
      });
      trackBehavior('FORM_SUBMIT', { source: 'Loan Application' });
    } catch {}
    setSubmitted(true);
  };

  const benefits = [
    { icon: Clock, title: 'Quick Pre-Approval', desc: 'Get pre-approved in as little as 24 hours so you can make competitive offers.' },
    { icon: DollarSign, title: 'Competitive Rates', desc: 'Access to multiple lenders means we find the best rates for your situation.' },
    { icon: Shield, title: 'Expert Guidance', desc: 'Our lending partners walk you through every step of the mortgage process.' },
    { icon: FileText, title: 'All Loan Types', desc: 'Conventional, FHA, VA, Jumbo — we match you with the right program.' },
  ];

  const inputStyle = {
    width: '100%', padding: '14px 16px', border: `1px solid ${C.midCream}`,
    fontFamily: C.body, fontSize: 13, color: C.black, outline: 'none', boxSizing: 'border-box', backgroundColor: C.white
  };

  const labelStyle = {
    fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
    color: C.muted, display: 'block', marginBottom: 8
  };

  if (submitted) {
    return (
      <div style={{ fontFamily: C.body, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: C.cream, paddingTop: 80 }}>
        <div style={{ textAlign: 'center', maxWidth: 480, padding: 40 }}>
          <CheckCircle size={64} style={{ color: '#4caf50', margin: '0 auto 24px' }} />
          <h2 style={{ fontFamily: C.display, fontSize: 36, fontWeight: 300, color: C.black, marginBottom: 12 }}>Application Received!</h2>
          <p style={{ fontFamily: C.body, fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 32 }}>
            Your loan pre-approval application has been submitted. Our lending partner will contact you within 24 hours to discuss your options and next steps.
          </p>
          <Link to="/search" style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.white, textDecoration: 'none', backgroundColor: C.black, padding: '14px 36px', display: 'inline-block', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.gold; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.black; e.currentTarget.style.transform = 'translateY(0)'; }}>
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.white, color: C.black }}>

      {/* Hero */}
      <section style={{ position: 'relative', height: '50vh', minHeight: 400, overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Finance" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.7) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>Financing</p>
          <div style={{ width: 48, height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: 24 }} />
          <h1 style={{ fontFamily: C.display, fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 300, color: C.white, lineHeight: 1.1 }}>
            Mortgage Pre-Approval
          </h1>
          <p style={{ fontFamily: C.body, fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 560, lineHeight: 1.8, marginTop: 16 }}>
            Get pre-approved for your home loan and shop with confidence.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ backgroundColor: C.black }}>
        <div className="resp-grid-4-dark" style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {benefits.map((b, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '40px 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none', transition: 'background-color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.08)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              <b.icon size={24} style={{ color: C.gold, margin: '0 auto 12px' }} />
              <p style={{ fontFamily: C.body, fontSize: 13, fontWeight: 500, color: C.white, marginBottom: 6 }}>{b.title}</p>
              <p style={{ fontFamily: C.body, fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section style={{ padding: '96px 0', backgroundColor: C.cream }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Apply Now</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, color: C.black, marginBottom: 20 }}>Loan Pre-Approval Application</h2>
            <div style={{ width: 48, height: 1, backgroundColor: C.black, margin: '0 auto' }} />
          </div>

          {/* Progress Steps */}
          <div className="resp-progress-steps" style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 48 }}>
            {['Contact Info', 'Loan Details', 'Financial Info'].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: step > i ? C.black : step === i + 1 ? C.gold : C.midCream, color: step >= i + 1 ? C.white : C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: C.body, fontSize: 12, fontWeight: 500, transition: 'all 0.3s' }}>
                  {step > i ? '✓' : i + 1}
                </div>
                <span style={{ fontFamily: C.body, fontSize: 12, color: step === i + 1 ? C.black : C.muted, letterSpacing: '0.05em' }}>{s}</span>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: C.white, padding: '48px 40px', border: `1px solid ${C.midCream}` }}>
            <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }}>

              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <h3 style={{ fontFamily: C.display, fontSize: 24, fontWeight: 300, color: C.black, marginBottom: 8 }}>Contact Information</h3>
                  <div className="resp-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Full Name</label>
                      <input type="text" placeholder="John Doe" required value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone</label>
                      <input type="tel" placeholder="(303) 555-0000" required value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })} style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" placeholder="you@email.com" required value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Property Address (if known)</label>
                    <input type="text" placeholder="Enter address or leave blank" value={formData.propertyAddress}
                      onChange={e => setFormData({ ...formData, propertyAddress: e.target.value })} style={inputStyle} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <h3 style={{ fontFamily: C.display, fontSize: 24, fontWeight: 300, color: C.black, marginBottom: 8 }}>Loan Details</h3>
                  <div>
                    <label style={labelStyle}>Loan Type</label>
                    <select value={formData.loanType} onChange={e => setFormData({ ...formData, loanType: e.target.value })} required
                      style={{ ...inputStyle, color: formData.loanType ? C.black : C.muted }}>
                      <option value="">Select loan type</option>
                      <option value="conventional">Conventional</option>
                      <option value="fha">FHA</option>
                      <option value="va">VA</option>
                      <option value="jumbo">Jumbo</option>
                      <option value="usda">USDA</option>
                      <option value="not-sure">Not Sure</option>
                    </select>
                  </div>
                  <div className="resp-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Purchase Price</label>
                      <input type="text" placeholder="$500,000" required value={formData.purchasePrice}
                        onChange={e => setFormData({ ...formData, purchasePrice: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Down Payment</label>
                      <input type="text" placeholder="$100,000 or 20%" value={formData.downPayment}
                        onChange={e => setFormData({ ...formData, downPayment: e.target.value })} style={inputStyle} />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <h3 style={{ fontFamily: C.display, fontSize: 24, fontWeight: 300, color: C.black, marginBottom: 8 }}>Financial Information</h3>
                  <div className="resp-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Employment Status</label>
                      <select value={formData.employmentStatus} onChange={e => setFormData({ ...formData, employmentStatus: e.target.value })} required
                        style={{ ...inputStyle, color: formData.employmentStatus ? C.black : C.muted }}>
                        <option value="">Select status</option>
                        <option value="employed">Employed</option>
                        <option value="self-employed">Self-Employed</option>
                        <option value="retired">Retired</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Annual Income</label>
                      <input type="text" placeholder="$100,000" required value={formData.annualIncome}
                        onChange={e => setFormData({ ...formData, annualIncome: e.target.value })} style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Credit Score Range</label>
                    <select value={formData.creditScore} onChange={e => setFormData({ ...formData, creditScore: e.target.value })} required
                      style={{ ...inputStyle, color: formData.creditScore ? C.black : C.muted }}>
                      <option value="">Select range</option>
                      <option value="excellent">Excellent (740+)</option>
                      <option value="good">Good (700-739)</option>
                      <option value="fair">Fair (660-699)</option>
                      <option value="below">Below 660</option>
                      <option value="not-sure">Not Sure</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Additional Notes</label>
                    <textarea rows={3} placeholder="Any additional information..." value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      style={{ ...inputStyle, resize: 'none' }} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                {step > 1 && (
                  <button type="button" onClick={() => setStep(step - 1)}
                    style={{ padding: '14px 28px', border: `1px solid ${C.midCream}`, backgroundColor: 'transparent', color: C.black, fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.black; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.midCream; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    Back
                  </button>
                )}
                <button type="submit"
                  style={{ flex: 1, padding: '14px 28px', backgroundColor: C.black, color: C.white, border: 'none', fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.gold; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.black; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  {step < 3 ? 'Continue' : 'Submit Application'} <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
              Questions? Call <a href="tel:3035550123" style={{ color: C.black, textDecoration: 'none', fontWeight: 500, transition: 'color 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.color = C.gold}
                onMouseLeave={e => e.currentTarget.style.color = C.black}>(303) 555-0123</a> or email{' '}
              <a href="mailto:info@coloradohomefinder.com" style={{ color: C.black, textDecoration: 'none', fontWeight: 500, transition: 'color 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.color = C.gold}
                onMouseLeave={e => e.currentTarget.style.color = C.black}>info@coloradohomefinder.com</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoanApplication;
