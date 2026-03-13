import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calculator, ChevronDown, DollarSign, Percent, Calendar, Home, ArrowRight } from 'lucide-react';
import { trackPageView } from '../api';

const C = {
  navy: '#1B2A4A', navyDark: '#0F172A', navyLight: '#243B6A',
  accent: '#C4956A', accentLight: '#D4A97A',
  coolWhite: '#F8FAFC', white: '#FFFFFF',
  slateDark: '#1E293B', slateMed: '#475569', slateLight: '#94A3B8',
  border: '#E2E8F0',
  heading: "'Montserrat', sans-serif",
  body: "'Inter', sans-serif",
};

const formatCurrency = (num) => {
  if (num == null || isNaN(num)) return '$0';
  return '$' + Math.round(num).toLocaleString('en-US');
};

const MortgageCalculator = () => {
  const navigate = useNavigate();
  const [homePrice, setHomePrice] = useState(450000);
  const [downPayment, setDownPayment] = useState(90000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [isPercentMode, setIsPercentMode] = useState(true);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => { trackPageView('MortgageCalculator'); }, []);

  const calculateMortgage = useCallback(() => {
    const principal = homePrice - downPayment;
    if (principal <= 0) {
      setMonthlyPayment(0);
      setTotalInterest(0);
      setTotalCost(0);
      return;
    }
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      const mp = principal / numPayments;
      setMonthlyPayment(mp);
      setTotalInterest(0);
      setTotalCost(principal);
      return;
    }

    const mp = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
               (Math.pow(1 + monthlyRate, numPayments) - 1);
    const total = mp * numPayments;
    setMonthlyPayment(mp);
    setTotalInterest(total - principal);
    setTotalCost(total);
  }, [homePrice, downPayment, interestRate, loanTerm]);

  useEffect(() => { calculateMortgage(); }, [calculateMortgage]);

  const handleHomePriceChange = (val) => {
    const price = Math.max(0, Number(val) || 0);
    setHomePrice(price);
    if (isPercentMode) {
      setDownPayment(Math.round(price * downPaymentPercent / 100));
    }
  };

  const handleDownPaymentChange = (val) => {
    const dp = Math.max(0, Math.min(Number(val) || 0, homePrice));
    setDownPayment(dp);
    setDownPaymentPercent(homePrice > 0 ? Math.round((dp / homePrice) * 100 * 10) / 10 : 0);
  };

  const handleDownPaymentPercentChange = (val) => {
    const pct = Math.max(0, Math.min(Number(val) || 0, 100));
    setDownPaymentPercent(pct);
    setDownPayment(Math.round(homePrice * pct / 100));
  };

  const loanTypes = [
    { name: 'Conventional Loans', path: '/mortgage/conventional', desc: 'Traditional financing with competitive rates' },
    { name: 'CHFA Loans', path: '/mortgage/chfa', desc: 'Colorado Housing and Finance Authority programs' },
    { name: 'VA Loans', path: '/mortgage/va', desc: 'Benefits for veterans and service members' },
    { name: '1st Time Home Buyer', path: '/mortgage/first-time-buyer', desc: 'Special programs for first-time buyers' },
  ];

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

      {/* Hero */}
      <section style={{ position: 'relative', height: '50vh', minHeight: 400, overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Mortgage Calculator"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.4) 0%, rgba(15,23,42,0.75) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 20, fontWeight: 500 }}>Financing Tools</p>
          <div style={{ width: 48, height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: 24 }} />
          <h1 style={{ fontFamily: C.heading, fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, color: C.white, lineHeight: 1.1 }}>
            Mortgage Calculator
          </h1>
          <p style={{ fontFamily: C.body, fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 560, lineHeight: 1.8, marginTop: 16 }}>
            Estimate your monthly mortgage payment and explore loan options.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section style={{ padding: '80px 0', backgroundColor: C.coolWhite }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.slateLight, marginBottom: 12, fontWeight: 500 }}>Calculator</p>
            <h2 style={{ fontFamily: C.heading, fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, color: C.navy, marginBottom: 16 }}>
              Estimate Your Monthly Payment
            </h2>
            <div style={{ width: 48, height: 2, backgroundColor: C.accent, margin: '0 auto' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}
               className="resp-calc-grid">
            {/* Inputs */}
            <div style={{ backgroundColor: C.white, borderRadius: 16, padding: 40, boxShadow: '0 4px 24px rgba(15,23,42,0.06)', border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${C.navy}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calculator size={20} style={{ color: C.navy }} />
                </div>
                <h3 style={{ fontFamily: C.heading, fontSize: 18, fontWeight: 700, color: C.navy }}>Loan Details</h3>
              </div>

              {/* Home Price */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}><Home size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Home Price</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: C.slateLight, fontFamily: C.body, fontSize: 14 }}>$</span>
                  <input
                    type="number"
                    value={homePrice || ''}
                    onChange={(e) => handleHomePriceChange(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 32 }}
                    onFocus={e => e.target.style.borderColor = C.accent}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>
                <input
                  type="range" min={50000} max={2000000} step={5000} value={homePrice}
                  onChange={(e) => handleHomePriceChange(e.target.value)}
                  style={{ width: '100%', marginTop: 8, accentColor: C.accent }}
                />
              </div>

              {/* Down Payment */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>
                    <DollarSign size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Down Payment
                  </label>
                  <button
                    onClick={() => setIsPercentMode(!isPercentMode)}
                    style={{ fontFamily: C.body, fontSize: 11, color: C.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, letterSpacing: '0.05em' }}
                  >
                    {isPercentMode ? 'Switch to $' : 'Switch to %'}
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: C.slateLight, fontFamily: C.body, fontSize: 14 }}>$</span>
                    <input
                      type="number"
                      value={downPayment || ''}
                      onChange={(e) => handleDownPaymentChange(e.target.value)}
                      style={{ ...inputStyle, paddingLeft: 32 }}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      value={downPaymentPercent || ''}
                      onChange={(e) => handleDownPaymentPercentChange(e.target.value)}
                      style={{ ...inputStyle, paddingRight: 32 }}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                    <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: C.slateLight, fontFamily: C.body, fontSize: 14 }}>%</span>
                  </div>
                </div>
              </div>

              {/* Loan Term */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}><Calendar size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Loan Term</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[15, 20, 25, 30].map(term => (
                    <button
                      key={term}
                      onClick={() => setLoanTerm(term)}
                      style={{
                        flex: 1, padding: '12px 0', borderRadius: 8, border: `1px solid ${loanTerm === term ? C.navy : C.border}`,
                        backgroundColor: loanTerm === term ? C.navy : C.white,
                        color: loanTerm === term ? C.white : C.slateMed,
                        fontFamily: C.body, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.25s',
                      }}
                    >
                      {term} yr
                    </button>
                  ))}
                </div>
              </div>

              {/* Interest Rate */}
              <div style={{ marginBottom: 0 }}>
                <label style={labelStyle}><Percent size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Interest Rate</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate || ''}
                    onChange={(e) => setInterestRate(Math.max(0, Math.min(Number(e.target.value) || 0, 25)))}
                    style={{ ...inputStyle, paddingRight: 32 }}
                    onFocus={e => e.target.style.borderColor = C.accent}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                  <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: C.slateLight, fontFamily: C.body, fontSize: 14 }}>%</span>
                </div>
                <input
                  type="range" min={0} max={15} step={0.1} value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  style={{ width: '100%', marginTop: 8, accentColor: C.accent }}
                />
              </div>
            </div>

            {/* Results */}
            <div>
              <div style={{ backgroundColor: C.navy, borderRadius: 16, padding: 40, color: C.white, marginBottom: 24 }}>
                <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Estimated Monthly Payment</p>
                <p style={{ fontFamily: C.heading, fontSize: 'clamp(40px, 5vw, 56px)', fontWeight: 700, color: C.white, lineHeight: 1 }}>
                  {formatCurrency(monthlyPayment)}
                </p>
                <div style={{ width: 40, height: 2, backgroundColor: C.accent, margin: '24px 0' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 500 }}>Loan Amount</p>
                    <p style={{ fontSize: 18, fontWeight: 600 }}>{formatCurrency(homePrice - downPayment)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 500 }}>Total Interest</p>
                    <p style={{ fontSize: 18, fontWeight: 600 }}>{formatCurrency(totalInterest)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 500 }}>Total Cost</p>
                    <p style={{ fontSize: 18, fontWeight: 600 }}>{formatCurrency(totalCost)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 500 }}>Down Payment</p>
                    <p style={{ fontSize: 18, fontWeight: 600 }}>{formatCurrency(downPayment)} ({downPaymentPercent}%)</p>
                  </div>
                </div>
              </div>

              {/* Visual Breakdown */}
              <div style={{ backgroundColor: C.white, borderRadius: 16, padding: 32, boxShadow: '0 4px 24px rgba(15,23,42,0.06)', border: `1px solid ${C.border}` }}>
                <h4 style={{ fontFamily: C.heading, fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 20, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Payment Breakdown</h4>
                {(() => {
                  const principal = homePrice - downPayment;
                  const total = principal + totalInterest;
                  const principalPct = total > 0 ? (principal / total) * 100 : 0;
                  const interestPct = total > 0 ? (totalInterest / total) * 100 : 0;
                  return (
                    <>
                      <div style={{ height: 12, borderRadius: 6, overflow: 'hidden', display: 'flex', marginBottom: 20 }}>
                        <div style={{ width: `${principalPct}%`, backgroundColor: C.navy, transition: 'width 0.5s ease' }} />
                        <div style={{ width: `${interestPct}%`, backgroundColor: C.accent, transition: 'width 0.5s ease' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: C.navy }} />
                          <span style={{ fontSize: 12, color: C.slateMed }}>Principal ({principalPct.toFixed(1)}%)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: C.accent }} />
                          <span style={{ fontSize: 12, color: C.slateMed }}>Interest ({interestPct.toFixed(1)}%)</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Type Subpages Dropdown + Cards */}
      <section style={{ padding: '80px 0', backgroundColor: C.white }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.slateLight, marginBottom: 12, fontWeight: 500 }}>Loan Programs</p>
            <h2 style={{ fontFamily: C.heading, fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, color: C.navy, marginBottom: 16 }}>
              Explore Your Loan Options
            </h2>
            <div style={{ width: 48, height: 2, backgroundColor: C.accent, margin: '0 auto 24px' }} />
            <p style={{ fontFamily: C.body, fontSize: 15, color: C.slateMed, maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
              Each loan type serves different needs. Select one to learn more and connect with a lender.
            </p>
          </div>

          {/* Dropdown for Quick Navigation */}
          <div style={{ maxWidth: 400, margin: '0 auto 48px', position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                width: '100%', padding: '16px 20px', borderRadius: 10,
                border: `1px solid ${C.border}`, backgroundColor: C.white,
                fontFamily: C.body, fontSize: 14, color: C.slateDark,
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: dropdownOpen ? '0 8px 32px rgba(15,23,42,0.12)' : '0 2px 8px rgba(15,23,42,0.04)',
                transition: 'box-shadow 0.25s',
              }}
            >
              <span style={{ fontWeight: 600 }}>Select a Loan Program</span>
              <ChevronDown size={18} style={{ color: C.slateLight, transition: 'transform 0.25s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
            </button>
            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                backgroundColor: C.white, borderRadius: 10, overflow: 'hidden',
                boxShadow: '0 12px 40px rgba(15,23,42,0.12)', border: `1px solid ${C.border}`,
                zIndex: 10,
              }}>
                {loanTypes.map((loan, i) => (
                  <Link
                    key={i}
                    to={loan.path}
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'block', padding: '14px 20px', textDecoration: 'none',
                      color: C.slateDark, fontFamily: C.body, fontSize: 14, fontWeight: 500,
                      borderBottom: i < loanTypes.length - 1 ? `1px solid ${C.border}` : 'none',
                      transition: 'background 0.2s, color 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.coolWhite; e.currentTarget.style.color = C.accent; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; e.currentTarget.style.color = C.slateDark; }}
                  >
                    {loan.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Loan Type Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}
               className="resp-loan-grid">
            {loanTypes.map((loan, i) => (
              <Link
                key={i}
                to={loan.path}
                style={{
                  display: 'block', textDecoration: 'none', borderRadius: 12,
                  border: `1px solid ${C.border}`, padding: 32, backgroundColor: C.white,
                  transition: 'all 0.35s cubic-bezier(.22,1,.36,1)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(15,23,42,0.1)';
                  e.currentTarget.style.borderColor = C.accent;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = C.border;
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: `${C.navy}08`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <DollarSign size={22} style={{ color: C.navy }} />
                </div>
                <h3 style={{ fontFamily: C.heading, fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{loan.name}</h3>
                <p style={{ fontFamily: C.body, fontSize: 13, color: C.slateMed, lineHeight: 1.7, marginBottom: 16 }}>{loan.desc}</p>
                <span style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.accent, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  Learn More <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', backgroundColor: C.navyDark, textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontFamily: C.heading, fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, color: C.white, marginBottom: 16 }}>
            Ready to Get Pre-Approved?
          </h2>
          <p style={{ fontFamily: C.body, fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: 32 }}>
            Take the first step toward homeownership. Connect with a lender today to start your pre-approval process.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/mortgage/conventional"
              className="chf-btn chf-btn-gold"
            >
              Apply Now <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="chf-btn chf-btn-outline"
              style={{ borderColor: 'rgba(255,255,255,0.3)', color: C.white }}
            >
              Talk to Alan
            </Link>
          </div>
        </div>
      </section>

      {/* Responsive Styles */}
      <style>{`
        .resp-calc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
        }
        .resp-loan-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) {
          .resp-calc-grid {
            grid-template-columns: 1fr !important;
          }
          .resp-loan-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .resp-loan-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MortgageCalculator;
