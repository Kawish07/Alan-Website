/**
 * ListingAlertForm — Daily Listing Email Subscribe Form
 * Drop this anywhere on the site; pass a `source` prop to track where signups come from.
 *
 * Usage:
 *   <ListingAlertForm source="Home Page Alert Strip" />
 *   <ListingAlertForm source="Search Page" compact />
 */
import React, { useState } from 'react';
import { subscribeListingAlert } from '../api';

// ─── Design tokens (same palette used site-wide) ──────────────────────────────
const C = {
    navy:    '#1B2A4A',
    accent:  '#C4956A',
    light:   '#F7F5F2',
    white:   '#FFFFFF',
    text:    '#374151',
    muted:   '#6B7280',
    display: "'Playfair Display', Georgia, serif",
    body:    "'Nunito Sans', system-ui, sans-serif",
};

const BEDS_OPTIONS    = ['Any', '1+', '2+', '3+', '4+'];
const PRICE_OPTIONS   = [
    { label: 'Any Price',     value: '' },
    { label: 'Under $300K',   value: '300000' },
    { label: 'Under $400K',   value: '400000' },
    { label: 'Under $500K',   value: '500000' },
    { label: 'Under $600K',   value: '600000' },
    { label: 'Under $800K',   value: '800000' },
    { label: 'Under $1M',     value: '1000000' },
];
const TYPE_OPTIONS    = ['Any', 'Single Family', 'Townhome', 'Condo'];

// ─── Shared input style ────────────────────────────────────────────────────────
const inputStyle = {
    fontFamily: C.body,
    fontSize: 14,
    padding: '10px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: 8,
    width: '100%',
    outline: 'none',
    background: C.white,
    color: C.text,
    boxSizing: 'border-box',
};

const selectStyle = { ...inputStyle, cursor: 'pointer', appearance: 'none' };

export default function ListingAlertForm({ source = 'Listing Alert Form', compact = false }) {
    const [form, setForm] = useState({
        name: '', email: '', phone: '',
        beds: 'Any', maxPrice: '', propertyType: 'Any',
        zips: '',
    });
    const [status, setStatus] = useState('idle'); // idle | loading | success | error

    const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim()) return;
        setStatus('loading');
        try {
            await subscribeListingAlert({
                name:  form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                source,
                criteria: {
                    beds:         form.beds !== 'Any'         ? form.beds  : '',
                    maxPrice:     form.maxPrice               || '',
                    propertyType: form.propertyType !== 'Any' ? form.propertyType : '',
                    zips:         form.zips.replace(/\s+/g, ''),
                },
            });
            setStatus('success');
        } catch {
            setStatus('error');
        }
    };

    // ── Success state ──────────────────────────────────────────────────────────
    if (status === 'success') {
        return (
            <div style={{
                textAlign: 'center', padding: compact ? '24px 16px' : '36px 24px',
                background: C.navy, borderRadius: 12,
                fontFamily: C.body,
            }}>
                <div style={{ fontSize: compact ? 32 : 48, marginBottom: 8 }}>🏠</div>
                <p style={{ color: C.white, fontWeight: 700, fontSize: compact ? 16 : 20, margin: '0 0 8px', fontFamily: C.display }}>
                    You're subscribed!
                </p>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, margin: 0 }}>
                    Look for your first daily listing email tomorrow at 8 AM. Check your spam folder just in case.
                </p>
            </div>
        );
    }

    // ── Form ───────────────────────────────────────────────────────────────────
    return (
        <div style={{
            background: C.navy, borderRadius: compact ? 12 : 16,
            padding: compact ? '24px 20px' : '36px 32px',
            fontFamily: C.body,
        }}>
            {!compact && (
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <p style={{ color: C.accent, fontFamily: C.display, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 8px', fontStyle: 'italic' }}>
                        Daily Listing Alerts
                    </p>
                    <h3 style={{ color: C.white, fontFamily: C.display, fontSize: 28, fontWeight: 700, margin: '0 0 10px' }}>
                        Get New Listings in Your Inbox
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: 0 }}>
                        Tell us what you're looking for and we'll email you matching homes every morning — no spam, unsubscribe anytime.
                    </p>
                </div>
            )}
            {compact && (
                <p style={{ color: C.accent, fontFamily: C.display, fontStyle: 'italic', fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>
                    Save this search — get daily matching listings
                </p>
            )}

            <form onSubmit={handleSubmit}>
                {/* Row 1: Name + Email */}
                <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <input
                        type="text"
                        placeholder="Your Name *"
                        value={form.name}
                        onChange={set('name')}
                        required
                        style={inputStyle}
                    />
                    <input
                        type="email"
                        placeholder="Email Address *"
                        value={form.email}
                        onChange={set('email')}
                        required
                        style={inputStyle}
                    />
                </div>

                {/* Row 2: Phone + Zips */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <input
                        type="tel"
                        placeholder="Phone (optional)"
                        value={form.phone}
                        onChange={set('phone')}
                        style={inputStyle}
                    />
                    <input
                        type="text"
                        placeholder="Zip codes e.g. 80231, 80014"
                        value={form.zips}
                        onChange={set('zips')}
                        style={inputStyle}
                    />
                </div>

                {/* Row 3: Beds + Max Price + Property Type */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                    <div style={{ position: 'relative' }}>
                        <select value={form.beds} onChange={set('beds')} style={selectStyle}>
                            {BEDS_OPTIONS.map(b => (
                                <option key={b} value={b}>{b === 'Any' ? 'Any Beds' : `${b} Beds`}</option>
                            ))}
                        </select>
                        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: C.muted, fontSize: 12 }}>▾</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <select value={form.maxPrice} onChange={set('maxPrice')} style={selectStyle}>
                            {PRICE_OPTIONS.map(p => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                        </select>
                        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: C.muted, fontSize: 12 }}>▾</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <select value={form.propertyType} onChange={set('propertyType')} style={selectStyle}>
                            {TYPE_OPTIONS.map(t => (
                                <option key={t} value={t}>{t === 'Any' ? 'Any Type' : t}</option>
                            ))}
                        </select>
                        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: C.muted, fontSize: 12 }}>▾</span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                        width: '100%',
                        padding: '14px 24px',
                        background: status === 'loading' ? 'rgba(196,149,106,0.6)' : C.accent,
                        color: C.white,
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 16,
                        fontWeight: 700,
                        fontFamily: C.body,
                        cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                    }}
                >
                    {status === 'loading' ? 'Subscribing…' : '🏠 Send Me Daily Listings'}
                </button>

                {status === 'error' && (
                    <p style={{ color: '#EF4444', fontSize: 13, textAlign: 'center', marginTop: 10, marginBottom: 0 }}>
                        Something went wrong. Please try again or call (773) 818-0444.
                    </p>
                )}

                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, textAlign: 'center', marginTop: 12, marginBottom: 0 }}>
                    No spam · Unsubscribe anytime · Colorado Home Finder LLC
                </p>
            </form>
        </div>
    );
}
