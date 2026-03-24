import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Phone, ArrowRight } from 'lucide-react';
import { submitLead, trackBehavior } from '../api';

const C = {
  navy: '#1B2A4A',
  navyLight: '#243B6A',
  accent: '#C4956A',
  accentLight: '#D4A97A',
  white: '#ffffff',
  body: "'Nunito Sans', system-ui, sans-serif",
  display: "'Playfair Display', Georgia, serif",
};

const StickyLeadBar = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const location = useLocation();

  const skip = /^\/admin|^\/login|^\/register/.test(location.pathname);

  useEffect(() => {
    if (skip) return;
    if (sessionStorage.getItem('stickyBarDismissed')) {
      setDismissed(true);
      return;
    }
    const timer = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(timer);
  }, [location.pathname, skip]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem('stickyBarDismissed', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitLead({ ...form, source: 'Sticky Lead Bar', intent: 'Buyer' });
      trackBehavior('FORM_SUBMIT', { source: 'Sticky Lead Bar' });
    } catch {}
    setSubmitted(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('stickyBarDismissed', 'true');
    }, 4000);
  };

  if (!visible || dismissed) return null;

  return (
    <>
      <style>{`
        @keyframes slideBarUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .sticky-bar-input::placeholder { color: rgba(255,255,255,0.45); }
        .sticky-bar-input:focus { outline: none; background: rgba(255,255,255,0.2) !important; }
        .sticky-bar-submit:hover { background: #D4A97A !important; }
      `}</style>

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9990,
        backgroundColor: C.navy,
        borderTop: `3px solid ${C.accent}`,
        padding: '14px 60px 14px 24px',
        display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
        justifyContent: 'center',
        boxShadow: '0 -4px 28px rgba(0,0,0,0.25)',
        animation: 'slideBarUp 0.45s cubic-bezier(.22,1,.36,1)',
      }}>

        {/* Dismiss */}
        <button onClick={handleDismiss} style={{
          position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)',
          background: 'none', border: '1px solid rgba(255,255,255,0.2)',
          width: 28, height: 28, borderRadius: '50%', cursor: 'pointer',
          color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <X size={14} />
        </button>

        {submitted ? (
          <p style={{
            fontFamily: C.body, fontSize: 14, color: C.accentLight,
            fontWeight: 600, margin: 0, padding: '6px 0',
          }}>
            ✓ Got it! Alan will reach out to you shortly.
          </p>
        ) : (
          <>
            {/* Label */}
            <div style={{ flexShrink: 0 }}>
              <p style={{
                fontFamily: C.display, fontSize: 13, fontWeight: 700,
                color: C.white, margin: '0 0 2px', letterSpacing: '0.04em',
              }}>
                🏡 Free Home Valuation &amp; Exclusive Listings
              </p>
              <p style={{
                fontFamily: C.body, fontSize: 11, color: 'rgba(255,255,255,0.55)',
                margin: 0, letterSpacing: '0.02em',
              }}>
                Tell us what you need — Alan responds within hours
              </p>
            </div>

            {/* Inline form */}
            <form onSubmit={handleSubmit} style={{
              display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap',
            }}>
              <input
                className="sticky-bar-input"
                type="text" placeholder="Your Name" required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={{
                  padding: '9px 14px', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 6, fontFamily: C.body, fontSize: 13,
                  backgroundColor: 'rgba(255,255,255,0.1)', color: C.white,
                  width: 140, transition: 'background 0.2s',
                }}
              />
              <input
                className="sticky-bar-input"
                type="tel" placeholder="Phone Number" required
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                style={{
                  padding: '9px 14px', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 6, fontFamily: C.body, fontSize: 13,
                  backgroundColor: 'rgba(255,255,255,0.1)', color: C.white,
                  width: 150, transition: 'background 0.2s',
                }}
              />
              <button
                className="sticky-bar-submit"
                type="submit"
                style={{
                  padding: '9px 20px', backgroundColor: C.accent, color: C.white,
                  border: 'none', borderRadius: 6, fontFamily: C.body, fontSize: 11,
                  fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                  whiteSpace: 'nowrap', transition: 'background 0.2s',
                }}
              >
                Connect Now <ArrowRight size={13} />
              </button>
            </form>

            {/* Phone shortcut */}
            <a
              href="tel:+17738180444"
              style={{
                fontFamily: C.body, fontSize: 12, color: C.accentLight,
                textDecoration: 'none', display: 'flex', alignItems: 'center',
                gap: 6, fontWeight: 500, flexShrink: 0, whiteSpace: 'nowrap',
              }}
            >
              <Phone size={13} /> (773) 818-0444
            </a>
          </>
        )}
      </div>
    </>
  );
};

export default StickyLeadBar;
