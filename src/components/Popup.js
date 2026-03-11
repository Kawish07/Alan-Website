import React, { useState, useEffect, useCallback } from 'react';
import { X, Home, ArrowRight } from 'lucide-react';
import { submitLead, trackBehavior } from '../api';

const C = {
  black: '#0a0a0a', cream: '#f5f3ef', gold: '#c9a96e', muted: '#8a8078',
  white: '#ffffff',
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Jost', sans-serif",
};

const Popup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [popupType, setPopupType] = useState('timed'); // 'timed' or 'exit'
    const [form, setForm] = useState({ name: '', email: '', phone: '', intent: 'Buyer' });
    const [submitted, setSubmitted] = useState(false);

    // Timed popup: 60 seconds
    useEffect(() => {
        if (localStorage.getItem('popupClosed') && localStorage.getItem('exitPopupClosed')) return;

        const timer = setTimeout(() => {
            if (!localStorage.getItem('popupClosed')) {
                setPopupType('timed');
                setIsOpen(true);
                trackBehavior('POPUP_VIEW', { type: 'timed' });
            }
        }, 60000);

        return () => clearTimeout(timer);
    }, []);

    // Exit intent popup: triggered on mouse leaving viewport (desktop)
    const handleMouseLeave = useCallback((e) => {
        if (e.clientY <= 0 && !localStorage.getItem('exitPopupClosed')) {
            setPopupType('exit');
            setIsOpen(true);
            trackBehavior('POPUP_VIEW', { type: 'exit' });
            document.removeEventListener('mouseleave', handleMouseLeave);
        }
    }, []);

    // Exit intent: back button / popstate (mobile)
    useEffect(() => {
        if (localStorage.getItem('exitPopupClosed')) return;

        document.addEventListener('mouseleave', handleMouseLeave);

        const handlePopState = () => {
            if (!localStorage.getItem('exitPopupClosed')) {
                setPopupType('exit');
                setIsOpen(true);
                // Push state back so user doesn't actually leave
                window.history.pushState(null, '', window.location.href);
            }
        };

        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [handleMouseLeave]);

    const closePopup = () => {
        setIsOpen(false);
        setSubmitted(false);
        if (popupType === 'timed') {
            localStorage.setItem('popupClosed', 'true');
        } else {
            localStorage.setItem('exitPopupClosed', 'true');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const source = popupType === 'timed' ? 'Timed Popup (60s)' : 'Exit Intent Popup';
        await submitLead({ ...form, source, intent: form.intent });
        trackBehavior('FORM_SUBMIT', { source, intent: form.intent });
        setSubmitted(true);
    };

    if (!isOpen) return null;

    const isExit = popupType === 'exit';

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, animation: 'fadeIn 0.3s ease',
        }} onClick={closePopup}>
            <div style={{
                backgroundColor: C.white, maxWidth: 480, width: '100%',
                position: 'relative', overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                animation: 'slideUp 0.4s cubic-bezier(.22,1,.36,1)',
            }} onClick={e => e.stopPropagation()}>

                {/* Gold top accent */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${C.gold}, #e8c88a)` }} />

                {/* Close button */}
                <button onClick={closePopup}
                    style={{
                        position: 'absolute', top: 16, right: 16, zIndex: 10,
                        background: 'none', border: '1px solid rgba(0,0,0,0.1)',
                        width: 36, height: 36, borderRadius: '50%', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: C.muted, transition: 'all 0.2s',
                    }}>
                    <X size={16} />
                </button>

                <div style={{ padding: '40px 36px 36px' }}>
                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: '50%',
                                border: `1px solid ${C.black}`, margin: '0 auto 20px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <span style={{ fontFamily: C.display, fontSize: 24 }}>✓</span>
                            </div>
                            <h3 style={{ fontFamily: C.display, fontSize: 28, fontWeight: 300, color: C.black, marginBottom: 12 }}>
                                Thank You
                            </h3>
                            <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, lineHeight: 1.8 }}>
                                One of our specialists will contact you within 24 hours.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div style={{ textAlign: 'center', marginBottom: 28 }}>
                                <Home size={24} style={{ color: C.gold, margin: '0 auto 16px' }} />
                                <h3 style={{ fontFamily: C.display, fontSize: 28, fontWeight: 300, color: C.black, lineHeight: 1.2, marginBottom: 12 }}>
                                    {isExit
                                        ? "Wait — Don't Miss Out!"
                                        : 'Get Exclusive Market Updates'}
                                </h3>
                                <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
                                    {isExit
                                        ? 'Get a free home valuation or exclusive off-market listings before you go.'
                                        : 'Join our VIP list for off-market deals and early access to new listings.'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                                    <input type="text" placeholder="Full Name" required
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        style={{
                                            width: '100%', padding: '14px 16px', border: `1px solid ${C.cream}`,
                                            outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black,
                                            backgroundColor: C.cream, borderRadius: 0, boxSizing: 'border-box',
                                        }} />
                                    <input type="tel" placeholder="Phone Number" required
                                        value={form.phone}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                        style={{
                                            width: '100%', padding: '14px 16px', border: `1px solid ${C.cream}`,
                                            outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black,
                                            backgroundColor: C.cream, borderRadius: 0, boxSizing: 'border-box',
                                        }} />
                                    <input type="email" placeholder="Email Address" required
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        style={{
                                            width: '100%', padding: '14px 16px', border: `1px solid ${C.cream}`,
                                            outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black,
                                            backgroundColor: C.cream, borderRadius: 0, boxSizing: 'border-box',
                                        }} />

                                    {/* Buyer or Seller */}
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        {['Buyer', 'Seller'].map(opt => (
                                            <button key={opt} type="button"
                                                onClick={() => setForm({ ...form, intent: opt })}
                                                style={{
                                                    flex: 1, padding: '12px', border: `1px solid ${form.intent === opt ? C.black : C.cream}`,
                                                    backgroundColor: form.intent === opt ? C.black : C.cream,
                                                    color: form.intent === opt ? C.white : C.muted,
                                                    fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em',
                                                    textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
                                                }}>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit"
                                    style={{
                                        width: '100%', padding: '16px', backgroundColor: C.black, color: C.white,
                                        border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11,
                                        letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    }}>
                                    {isExit ? 'Get My Free Valuation' : 'Get Updates'} <ArrowRight size={14} />
                                </button>
                            </form>

                            <p style={{
                                fontFamily: C.body, fontSize: 11, color: C.muted,
                                textAlign: 'center', marginTop: 16, lineHeight: 1.6,
                            }}>
                                Your information is secure and never shared.
                            </p>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default Popup;