import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, DollarSign, Shield, Home, FileText, Users } from 'lucide-react';
import { submitLead, trackBehavior, trackPageView } from '../api';

const C = {
  navy: '#1B2A4A', navyDark: '#0F172A', navyLight: '#243B6A',
  accent: '#C4956A', accentLight: '#D4A97A',
  coolWhite: '#F8FAFC', white: '#FFFFFF',
  slateDark: '#1E293B', slateMed: '#475569', slateLight: '#94A3B8',
  border: '#E2E8F0',
  heading: "'Montserrat', sans-serif",
  body: "'Inter', sans-serif",
};

const LOAN_DATA = {
  conventional: {
    title: 'Conventional Loans',
    subtitle: 'Traditional Financing',
    heroImg: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    loanTypeLabel: 'Conventional Loan',
    description: 'A conventional loan is one of the most common mortgage options for homebuyers. These loans are not backed by a government agency and typically require good credit and a stable income. They offer competitive interest rates and flexible terms.',
    benefits: [
      { icon: DollarSign, title: 'Competitive Rates', desc: 'Access some of the most competitive interest rates available in the market.' },
      { icon: Shield, title: 'Flexible Terms', desc: 'Choose from 15, 20, 25, or 30-year loan terms to match your budget.' },
      { icon: FileText, title: 'No Upfront MI', desc: 'With 20% down, avoid private mortgage insurance entirely.' },
      { icon: Home, title: 'Various Property Types', desc: 'Finance primary residences, second homes, or investment properties.' },
    ],
    details: [
      { q: 'Down Payment', a: 'As low as 3% for first-time buyers, or 5% for repeat buyers. 20% down eliminates the need for private mortgage insurance (PMI).' },
      { q: 'Credit Requirements', a: 'Typically requires a credit score of 620 or higher. Better scores qualify for lower interest rates.' },
      { q: 'Loan Limits', a: 'Conforming loan limits vary by county. In most areas of Colorado, the 2024 limit is $766,550 for a single-family home.' },
      { q: 'Best For', a: 'Buyers with good credit, stable income, and the ability to make a reasonable down payment.' },
    ],
  },
  chfa: {
    title: 'CHFA Loans',
    subtitle: 'Colorado Housing Assistance',
    heroImg: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    loanTypeLabel: 'CHFA Loan',
    description: 'The Colorado Housing and Finance Authority (CHFA) offers programs designed to help Colorado residents achieve homeownership. These programs provide down payment assistance and competitive interest rates for qualifying buyers.',
    benefits: [
      { icon: DollarSign, title: 'Down Payment Assistance', desc: 'Access grants and second mortgage options to cover your down payment.' },
      { icon: Shield, title: 'Below-Market Rates', desc: 'CHFA programs often offer interest rates below conventional market rates.' },
      { icon: Users, title: 'Income-Based', desc: 'Programs designed for low to moderate income households in Colorado.' },
      { icon: Home, title: 'Homebuyer Education', desc: 'Free homebuyer education courses to prepare you for the process.' },
    ],
    details: [
      { q: 'Down Payment Assistance', a: 'CHFA offers up to 3% of the first mortgage in the form of a second mortgage or grant to help cover your down payment and closing costs.' },
      { q: 'Eligibility', a: 'Income limits and purchase price limits vary by county. Buyers must complete a homebuyer education course and occupy the home as a primary residence.' },
      { q: 'Loan Types Available', a: 'CHFA partners with lenders to offer FHA, VA, USDA, and conventional loans with their down payment assistance programs.' },
      { q: 'Best For', a: 'First-time and repeat buyers in Colorado who need help with down payment and closing costs. Content with specific CHFA program details coming soon.' },
    ],
  },
  va: {
    title: 'VA Loans',
    subtitle: 'Veterans Benefits',
    heroImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    loanTypeLabel: 'VA Loan',
    description: 'VA loans are a benefit earned by veterans, active-duty service members, and eligible surviving spouses. Backed by the U.S. Department of Veterans Affairs, these loans offer exceptional terms including zero down payment and no PMI.',
    benefits: [
      { icon: DollarSign, title: 'No Down Payment', desc: 'Purchase a home with zero down payment — one of the biggest VA loan benefits.' },
      { icon: Shield, title: 'No PMI Required', desc: 'Save hundreds per month with no private mortgage insurance regardless of down payment.' },
      { icon: FileText, title: 'Competitive Rates', desc: 'VA loans typically offer lower interest rates than conventional loans.' },
      { icon: Users, title: 'Flexible Qualification', desc: 'More lenient credit and income requirements compared to conventional options.' },
    ],
    details: [
      { q: 'Eligibility', a: 'Available to veterans, active-duty military, National Guard and Reserve members, and eligible surviving spouses with a valid Certificate of Eligibility (COE).' },
      { q: 'VA Funding Fee', a: 'A one-time funding fee (typically 1.25%–3.3%) is required but can be rolled into the loan. Disabled veterans may be exempt.' },
      { q: 'Loan Limits', a: 'With full entitlement, there is no loan limit for VA loans. With partial entitlement, county limits apply.' },
      { q: 'Best For', a: 'Veterans and active service members looking for the most favorable loan terms available, especially those without a large down payment.' },
    ],
  },
  'first-time-buyer': {
    title: '1st Time Home Buyer',
    subtitle: 'First-Time Buyer Programs',
    heroImg: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    loanTypeLabel: '1st Time Home Buyer',
    description: 'If you\'re buying your first home, there are special programs and assistance available to help make homeownership more accessible. From down payment assistance to favorable loan terms, we\'ll help you navigate every option.',
    benefits: [
      { icon: DollarSign, title: 'Down Payment Help', desc: 'Access grants, gifts, and assistance programs that reduce your out-of-pocket costs.' },
      { icon: Home, title: 'FHA Options', desc: 'FHA loans allow as little as 3.5% down with flexible credit requirements.' },
      { icon: Users, title: 'Education Programs', desc: 'Free homebuyer education to help you feel confident throughout the process.' },
      { icon: Shield, title: 'Tax Benefits', desc: 'Take advantage of first-time buyer tax credits and deductions available in Colorado.' },
    ],
    details: [
      { q: 'Who Qualifies?', a: 'Generally, anyone who has not owned a home in the past 3 years qualifies as a first-time buyer for most assistance programs.' },
      { q: 'Down Payment Assistance', a: 'Colorado offers several DPA programs, including CHFA, Metro DPA, and lender-specific programs that can cover 3-5% of the purchase price.' },
      { q: 'Loan Options', a: 'First-time buyers have access to FHA (3.5% down), conventional (3% down), CHFA programs, and more. We\'ll match you with the best fit.' },
      { q: 'Best For', a: 'Anyone purchasing their first home who wants to explore all available assistance programs and find the most affordable path to homeownership.' },
    ],
  },
  'credit-repair': {
    title: 'Credit Repair',
    subtitle: 'Build Your Path to Homeownership',
    heroImg: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    loanTypeLabel: 'Credit Repair',
    description: 'Your credit score plays a major role in the mortgage rates and loan programs available to you. If your score needs improvement, don\'t worry — Alan works with trusted credit specialists and lenders who can guide you through the process of repairing your credit so you can qualify for the best possible loan terms.',
    benefits: [
      { icon: Shield, title: 'Personalized Plan', desc: 'Get a customized credit improvement plan based on your specific situation.' },
      { icon: FileText, title: 'Dispute Support', desc: 'We help identify and dispute inaccurate negative items on your credit report.' },
      { icon: DollarSign, title: 'Better Rates', desc: 'Improving your score can save you thousands in interest over the life of your loan.' },
      { icon: Users, title: 'Expert Guidance', desc: 'Work with credit specialists who understand Colorado real estate financing.' },
    ],
    details: [
      { q: 'How Long Does It Take?', a: 'Credit repair timelines vary, but many clients see meaningful improvement within 3–6 months. Alan will connect you with specialists while you continue planning your home purchase.' },
      { q: 'What Score Do I Need?', a: 'FHA loans require a minimum of 580 (3.5% down) or 500 (10% down). Conventional loans typically require 620+. VA and USDA loans are more flexible.' },
      { q: 'Can I Still Buy Now?', a: 'Depending on your score and loan type, you may still qualify today. Alan will review your full financial picture and connect you with the right lender.' },
      { q: 'Best For', a: 'Aspiring homebuyers who want to improve their financial position before purchasing, or anyone who has been told their credit score is too low.' },
    ],
  },
};

const MortgageLoanType = () => {
  const { loanType } = useParams();
  const data = LOAN_DATA[loanType];

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    loanTypeInterest: '', purchasePrice: '',
    downPayment: '', notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (data) {
      trackPageView(`Mortgage_${loanType}`);
      setFormData(prev => ({ ...prev, loanTypeInterest: data.loanTypeLabel }));
    }
  }, [loanType, data]);

  // Scroll to top on loan type change
  useEffect(() => { window.scrollTo(0, 0); }, [loanType]);

  if (!data) {
    return (
      <div style={{ fontFamily: C.body, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: C.coolWhite, paddingTop: 100 }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: C.heading, fontSize: 32, fontWeight: 700, color: C.navy, marginBottom: 16 }}>Loan Type Not Found</h2>
          <Link to="/mortgage-calculator" style={{ color: C.accent, fontWeight: 600 }}>Return to Mortgage Calculator</Link>
        </div>
      </div>
    );
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Loan Type Interest: ${formData.loanTypeInterest} | Purchase Price: ${formData.purchasePrice} | Down Payment: ${formData.downPayment} | Notes: ${formData.notes}`,
        source: `Mortgage - ${data.title}`,
        intent: 'Buyer',
      });
      trackBehavior('FORM_SUBMIT', { source: `Mortgage - ${data.title}`, loanType });
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

  const otherLoans = Object.entries(LOAN_DATA).filter(([key]) => key !== loanType);

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.white, color: C.slateDark }}>

      {/* Hero */}
      <section style={{ position: 'relative', height: '50vh', minHeight: 400, overflow: 'hidden' }}>
        <img src={data.heroImg} alt={data.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.4) 0%, rgba(15,23,42,0.75) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 20, fontWeight: 500 }}>{data.subtitle}</p>
          <div style={{ width: 48, height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: 24 }} />
          <h1 style={{ fontFamily: C.heading, fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, color: C.white, lineHeight: 1.1 }}>
            {data.title}
          </h1>
        </div>
      </section>

      {/* Headline + Benefits */}
      <section style={{ backgroundColor: C.navyDark }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: C.heading, fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: C.accent, marginBottom: 8 }}>
            Talk to a Lender to Start the Process
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 0 }}>Fill out the form below to get connected</p>
        </div>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}
             className="resp-benefits-grid">
          {data.benefits.map((b, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '32px 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none', transition: 'background 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(196,149,106,0.06)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              <b.icon size={24} style={{ color: C.accent, margin: '0 auto 12px' }} />
              <p style={{ fontFamily: C.body, fontSize: 13, fontWeight: 600, color: C.white, marginBottom: 6 }}>{b.title}</p>
              <p style={{ fontFamily: C.body, fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Description + Details + Form */}
      <section style={{ padding: '80px 0', backgroundColor: C.coolWhite }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}
               className="resp-loan-detail-grid">

            {/* Left: Info */}
            <div>
              <p style={{ fontFamily: C.body, fontSize: 15, color: C.slateMed, lineHeight: 1.9, marginBottom: 40 }}>
                {data.description}
              </p>

              <h3 style={{ fontFamily: C.heading, fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 24 }}>Key Details</h3>
              {data.details.map((d, i) => (
                <div key={i} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: i < data.details.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <p style={{ fontFamily: C.heading, fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 6 }}>{d.q}</p>
                  <p style={{ fontFamily: C.body, fontSize: 13, color: C.slateMed, lineHeight: 1.7 }}>{d.a}</p>
                </div>
              ))}

              <Link to="/mortgage-calculator" style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.accent, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                ← Back to Mortgage Calculator
              </Link>
            </div>

            {/* Right: Lead Capture Form */}
            <div>
              {submitted ? (
                <div style={{ backgroundColor: C.white, borderRadius: 16, padding: 48, textAlign: 'center', boxShadow: '0 4px 24px rgba(15,23,42,0.06)', border: `1px solid ${C.border}` }}>
                  <CheckCircle size={56} style={{ color: '#22c55e', margin: '0 auto 20px' }} />
                  <h3 style={{ fontFamily: C.heading, fontSize: 24, fontWeight: 700, color: C.navy, marginBottom: 12 }}>Thank You!</h3>
                  <p style={{ fontFamily: C.body, fontSize: 14, color: C.slateMed, lineHeight: 1.8, marginBottom: 24 }}>
                    Your information has been submitted. A lending specialist will reach out to you shortly to discuss your {data.title.toLowerCase()} options.
                  </p>
                  <Link to="/search" className="chf-btn chf-btn-primary">Browse Properties</Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ backgroundColor: C.white, borderRadius: 16, padding: 40, boxShadow: '0 4px 24px rgba(15,23,42,0.06)', border: `1px solid ${C.border}` }}>
                  <h3 style={{ fontFamily: C.heading, fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
                    Talk to a Lender to Start the Process
                  </h3>
                  <p style={{ fontFamily: C.body, fontSize: 13, color: C.slateMed, marginBottom: 32, lineHeight: 1.6 }}>
                    Fill out the form below and a lending specialist will contact you.
                  </p>

                  {/* Name */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>First & Last Name *</label>
                    <input
                      type="text" required
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="John Doe"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>

                  {/* Email */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Email Address *</label>
                    <input
                      type="email" required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="john@example.com"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>

                  {/* Phone */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Phone Number *</label>
                    <input
                      type="tel" required
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="(303) 555-0100"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>

                  {/* Loan Type Interest (pre-selected) */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Loan Type Interest</label>
                    <select
                      value={formData.loanTypeInterest}
                      onChange={(e) => handleChange('loanTypeInterest', e.target.value)}
                      style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.border}
                    >
                      <option value="Conventional Loan">Conventional Loan</option>
                      <option value="CHFA Loan">CHFA Loan</option>
                      <option value="VA Loan">VA Loan</option>
                      <option value="1st Time Home Buyer">1st Time Home Buyer</option>
                    </select>
                  </div>

                  {/* Purchase Price */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Estimated Purchase Price</label>
                    <input
                      type="text"
                      value={formData.purchasePrice}
                      onChange={(e) => handleChange('purchasePrice', e.target.value)}
                      placeholder="$450,000"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>

                  {/* Down Payment */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Down Payment Amount or Percentage</label>
                    <input
                      type="text"
                      value={formData.downPayment}
                      onChange={(e) => handleChange('downPayment', e.target.value)}
                      placeholder="$90,000 or 20%"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>

                  {/* Notes */}
                  <div style={{ marginBottom: 28 }}>
                    <label style={labelStyle}>Additional Questions / Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      placeholder="Any questions or details about your situation..."
                      rows={4}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>

                  <button
                    type="submit"
                    className="chf-btn chf-btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '16px 0' }}
                  >
                    Connect Me With a Lender <ArrowRight size={16} />
                  </button>

                  <p style={{ fontFamily: C.body, fontSize: 11, color: C.slateLight, textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
                    Your information is secure and will only be shared with a trusted lending partner.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Other Loan Types */}
      <section style={{ padding: '64px 0', backgroundColor: C.white }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <h3 style={{ fontFamily: C.heading, fontSize: 20, fontWeight: 700, color: C.navy, textAlign: 'center', marginBottom: 32 }}>
            Explore Other Loan Programs
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}
               className="resp-other-loans-grid">
            {otherLoans.map(([key, loan]) => (
              <Link
                key={key}
                to={`/mortgage/${key}`}
                style={{
                  display: 'block', textDecoration: 'none', padding: '24px 28px',
                  borderRadius: 12, border: `1px solid ${C.border}`, backgroundColor: C.white,
                  transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(15,23,42,0.08)'; e.currentTarget.style.borderColor = C.accent; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = C.border; }}
              >
                <h4 style={{ fontFamily: C.heading, fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 6 }}>{loan.title}</h4>
                <p style={{ fontFamily: C.body, fontSize: 12, color: C.slateLight, display: 'flex', alignItems: 'center', gap: 4 }}>
                  Learn more <ArrowRight size={12} />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive Styles */}
      <style>{`
        .resp-benefits-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
        .resp-loan-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
        .resp-other-loans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 900px) {
          .resp-benefits-grid { grid-template-columns: 1fr 1fr !important; }
          .resp-loan-detail-grid { grid-template-columns: 1fr !important; }
          .resp-other-loans-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .resp-benefits-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default MortgageLoanType;
