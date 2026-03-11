import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { submitLead, trackBehavior, trackPageView } from '../api';
import { CheckCircle, Calendar, Clock, MapPin, Phone, ArrowRight } from 'lucide-react';

const C = {
  black: '#0a0a0a', cream: '#f5f3ef', midCream: '#ede9e3',
  gold: '#c9a96e', muted: '#8a8078', white: '#ffffff',
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Jost', sans-serif",
};

const BookShowing = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', propertyAddress: '',
    preferredDate: '', preferredTime: '', alternateDate: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { trackPageView('BookShowing'); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitLead({
        name: formData.name, email: formData.email, phone: formData.phone,
        message: `Property: ${formData.propertyAddress} | Preferred: ${formData.preferredDate} at ${formData.preferredTime} | Alt: ${formData.alternateDate} | Notes: ${formData.message}`,
        source: 'Book a Showing Page', intent: 'Buyer'
      });
      trackBehavior('FORM_SUBMIT', { source: 'Book a Showing' });
    } catch {}
    setSubmitted(true);
  };

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  if (submitted) {
    return (
      <div style={{ fontFamily: C.body, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: C.cream, paddingTop: 80 }}>
        <div style={{ textAlign: 'center', maxWidth: 480, padding: 40 }}>
          <CheckCircle size={64} style={{ color: '#4caf50', margin: '0 auto 24px' }} />
          <h2 style={{ fontFamily: C.display, fontSize: 36, fontWeight: 300, color: C.black, marginBottom: 12 }}>Showing Requested!</h2>
          <p style={{ fontFamily: C.body, fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 32 }}>
            We've received your showing request. Alan will confirm your appointment within a few hours. You'll receive a confirmation email shortly.
          </p>
          <Link to="/search" style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.white, textDecoration: 'none', backgroundColor: C.black, padding: '14px 36px', display: 'inline-block', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.gold; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.black; e.currentTarget.style.transform = 'translateY(0)'; }}>
            Browse More Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.white, color: C.black }}>

      {/* Hero */}
      <section style={{ position: 'relative', height: '50vh', minHeight: 400, overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Showing" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.7) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>Schedule</p>
          <div style={{ width: 48, height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: 24 }} />
          <h1 style={{ fontFamily: C.display, fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 300, color: C.white, lineHeight: 1.1 }}>
            Book a Showing
          </h1>
        </div>
      </section>

      {/* Form Section */}
      <section style={{ padding: '96px 0', backgroundColor: C.cream }}>
        <div className="resp-split" style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>

          {/* Left - Info */}
          <div>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Private Showings</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, color: C.black, lineHeight: 1.2, marginBottom: 24 }}>
              Experience Your <em>Future Home</em> In Person
            </h2>
            <div style={{ width: 48, height: 1, backgroundColor: C.black, marginBottom: 32 }} />
            <p style={{ fontFamily: C.body, fontSize: 14, lineHeight: 1.9, color: '#5a5248', marginBottom: 24 }}>
              Nothing compares to seeing a property in person. Schedule a private showing with our team and get a personalized tour of the home you're interested in.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 40 }}>
              {[
                [Calendar, 'Flexible Scheduling', 'Choose from morning, afternoon, or evening appointments.'],
                [Clock, 'Personalized Tours', 'One-on-one or family tours with your dedicated agent.'],
                [MapPin, 'Any Property', 'We can show you any active listing in Colorado.'],
              ].map(([Icon, title, desc], i) => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '12px', marginLeft: -12, borderRadius: 8, transition: 'background-color 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <div style={{ width: 44, height: 44, backgroundColor: C.black, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} style={{ color: C.white }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: C.body, fontSize: 14, fontWeight: 500, color: C.black, marginBottom: 4 }}>{title}</p>
                    <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 48, padding: '24px 28px', backgroundColor: C.white, border: `1px solid ${C.midCream}` }}>
              <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, marginBottom: 8 }}>Prefer to Call?</p>
              <a href="tel:+17738180444" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: C.body, fontSize: 16, color: C.black, textDecoration: 'none', fontWeight: 500 }}>
                <Phone size={18} style={{ color: C.gold }} /> (773) 818-0444
              </a>
            </div>
          </div>

          {/* Right - Form */}
          <div style={{ backgroundColor: C.white, padding: '48px 40px', border: `1px solid ${C.midCream}` }}>
            <h3 style={{ fontFamily: C.display, fontSize: 28, fontWeight: 300, color: C.black, marginBottom: 8 }}>Request a Showing</h3>
            <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted, marginBottom: 32 }}>Fill out the details below and we'll confirm your appointment.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Property Address</label>
                <input type="text" placeholder="Enter the property address" required value={formData.propertyAddress}
                  onChange={e => setFormData({ ...formData, propertyAddress: e.target.value })}
                  style={{ width: '100%', padding: '14px 16px', border: `1px solid ${C.midCream}`, fontFamily: C.body, fontSize: 13, color: C.black, outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div className="resp-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Preferred Date</label>
                  <input type="date" required value={formData.preferredDate}
                    onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                    style={{ width: '100%', padding: '14px 16px', border: `1px solid ${C.midCream}`, fontFamily: C.body, fontSize: 13, color: C.black, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Preferred Time</label>
                  <select value={formData.preferredTime} onChange={e => setFormData({ ...formData, preferredTime: e.target.value })} required
                    style={{ width: '100%', padding: '14px 16px', border: `1px solid ${C.midCream}`, fontFamily: C.body, fontSize: 13, color: formData.preferredTime ? C.black : C.muted, outline: 'none', boxSizing: 'border-box', backgroundColor: C.white }}>
                    <option value="">Select time</option>
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Alternate Date (Optional)</label>
                <input type="date" value={formData.alternateDate}
                  onChange={e => setFormData({ ...formData, alternateDate: e.target.value })}
                  style={{ width: '100%', padding: '14px 16px', border: `1px solid ${C.midCream}`, fontFamily: C.body, fontSize: 13, color: C.black, outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ height: 1, backgroundColor: C.midCream, margin: '8px 0' }} />

              <div className="resp-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Full Name</label>
                  <input type="text" placeholder="Your name" required value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '14px 16px', border: `1px solid ${C.midCream}`, fontFamily: C.body, fontSize: 13, color: C.black, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Phone</label>
                  <input type="tel" placeholder="(303) 555-0000" required value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '14px 16px', border: `1px solid ${C.midCream}`, fontFamily: C.body, fontSize: 13, color: C.black, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Email</label>
                <input type="email" placeholder="you@email.com" required value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '14px 16px', border: `1px solid ${C.midCream}`, fontFamily: C.body, fontSize: 13, color: C.black, outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Additional Notes</label>
                <textarea rows={3} placeholder="Anything else we should know?" value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: '100%', padding: '14px 16px', border: `1px solid ${C.midCream}`, fontFamily: C.body, fontSize: 13, color: C.black, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
              </div>

              <button type="submit"
                style={{ width: '100%', padding: '16px', backgroundColor: C.black, color: C.white, border: 'none', fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8, transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.gold; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.black; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                Request Showing <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookShowing;
