import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { submitLead } from '../api';

const C = {
  black: '#0a0a0a', cream: '#f5f3ef', midCream: '#ede9e3',
  gold: '#c9a96e', muted: '#8a8078', white: '#ffffff',
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Jost', sans-serif",
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitLead({ ...formData, source: 'Contact Page', intent: 'Other' });
    setSubmitted(true);
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '16px 0',
    border: 'none', borderBottom: `1px solid ${focused === field ? C.black : C.midCream}`,
    outline: 'none', fontFamily: C.body, fontSize: 14, color: C.black,
    backgroundColor: 'transparent', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  });

  const contactItems = [
    { Icon: Phone, label: 'Phone', value: '(303) 555-0123', href: 'tel:3035550123' },
    { Icon: Mail, label: 'Email', value: 'info@coloradohomefinder.com', href: 'mailto:info@coloradohomefinder.com' },
    { Icon: MapPin, label: 'Office', value: '123 Real Estate Ave, Denver, CO 80000', href: null },
    { Icon: Clock, label: 'Hours', value: 'Mon – Sat: 9:00 AM – 6:00 PM', href: null },
  ];

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.white, color: C.black, minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: '85vh', backgroundColor: C.black, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <img
          src="https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Denver"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(9,9,9,0.9), transparent)' }} />
        
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', width: '100%', position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: 600 }}>
            <div style={{ width: 40, height: 1, backgroundColor: C.gold, marginBottom: 24 }} />
            <h1 style={{ fontFamily: C.display, fontSize: 'clamp(56px, 8vw, 100px)', fontWeight: 300, color: C.white, lineHeight: 0.95, letterSpacing: '0.02em', marginBottom: 32 }}>
              Get In<br /><em style={{ color: C.gold }}>Touch</em>
            </h1>
            <p style={{ fontFamily: C.body, fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.9, letterSpacing: '0.04em', maxWidth: 440, marginBottom: 48 }}>
              Whether you are ready to sell your luxury estate or finding your next home in Colorado, our team is standing by to provide expert guidance.
            </p>
            <div className="resp-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.gold, marginBottom: 16 }}>Call Us</p>
                <p style={{ fontFamily: C.display, fontSize: 24, fontWeight: 300, color: C.white }}>(303) 555-0123</p>
              </div>
              <div>
                <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.gold, marginBottom: 16 }}>Email Us</p>
                <p style={{ fontFamily: C.display, fontSize: 24, fontWeight: 300, color: C.white }}>info@colorado.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative mask box */}
        <div style={{ position: 'absolute', top: '15%', right: '10%', width: '35%', height: '70%', border: '1px solid rgba(255,255,255,0.12)', zIndex: 1 }} />
      </section>

      {/* ── Contact Info Strip ── */}
      <section style={{ backgroundColor: C.white, position: 'relative', zIndex: 20, marginTop: '-60px' }}>
        <div className="resp-contact-strip" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', backgroundColor: C.white, boxShadow: '0 25px 60px -15px rgba(0,0,0,0.1)' }}>
          {contactItems.map(({ Icon, label, value, href }, i) => (
            <div key={i} style={{ padding: '48px 24px', borderRight: i < 3 ? '1px solid #f0ede8' : 'none', textAlign: 'center' }}>
              <Icon size={20} style={{ color: C.gold, margin: '0 auto 16px' }} />
              <p style={{ fontFamily: C.body, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.muted, fontWeight: 600, marginBottom: 12 }}>{label}</p>
              {href ? (
                <a href={href} style={{ fontFamily: C.body, fontSize: 13, color: C.black, textDecoration: 'none', fontWeight: 400 }}>{value}</a>
              ) : (
                <p style={{ fontFamily: C.body, fontSize: 13, color: C.black, lineHeight: 1.5, fontWeight: 400 }}>{value}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Main Content ── */}
      <section style={{ padding: '96px 0', backgroundColor: C.white }}>
        <div className="resp-split" style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, alignItems: 'start' }}>

          {/* Left: Info */}
          <div>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Contact Us</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300, color: C.black, lineHeight: 1.15, marginBottom: 24 }}>
              We're Here<br />to <em>Help You</em>
            </h2>
            <div style={{ width: 48, height: 1, backgroundColor: C.black, marginBottom: 32 }} />
            <p style={{ fontFamily: C.body, fontSize: 14, lineHeight: 1.9, color: '#5a5248', marginBottom: 48 }}>
              Have questions about buying, selling, or the market? Our team of experts is available to provide personalized guidance. Reach out and one of our specialists will respond promptly.
            </p>

            {/* Map placeholder */}
            <div style={{ position: 'relative', height: 300, backgroundColor: C.cream, overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Denver Colorado"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(245,243,239,0.3)' }} />
              <div style={{ position: 'absolute', bottom: 20, left: 20, backgroundColor: C.black, color: C.white, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <MapPin size={14} style={{ color: C.gold }} />
                <span style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.05em' }}>Denver, Colorado</span>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Send a Message</p>
            <h3 style={{ fontFamily: C.display, fontSize: 40, fontWeight: 300, color: C.black, marginBottom: 40, lineHeight: 1.1 }}>
              How Can We<br />Assist You?
            </h3>

            {submitted ? (
              <div style={{ padding: '48px 0', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, border: `1px solid ${C.black}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <span style={{ fontFamily: C.display, fontSize: 28 }}>✓</span>
                </div>
                <h4 style={{ fontFamily: C.display, fontSize: 36, fontWeight: 300, color: C.black, marginBottom: 12 }}>Message Sent</h4>
                <div style={{ width: 40, height: 1, backgroundColor: C.black, margin: '0 auto 20px' }} />
                <p style={{ fontFamily: C.body, fontSize: 14, color: C.muted, lineHeight: 1.8 }}>
                  Thank you for reaching out. One of our experts will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginBottom: 32 }}>
                  <div>
                    <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Full Name</label>
                    <input type="text" required placeholder="Your full name"
                      style={inputStyle('name')}
                      onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                      onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>

                  <div className="resp-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                    <div>
                      <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Email</label>
                      <input type="email" required placeholder="your@email.com"
                        style={inputStyle('email')}
                        onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                        onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Phone</label>
                      <input type="tel" placeholder="(303) 000-0000"
                        style={inputStyle('phone')}
                        onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Message</label>
                    <textarea rows={5} required placeholder="Tell us how we can help..."
                      style={{ ...inputStyle('message'), resize: 'none', paddingTop: 12 }}
                      onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
                      onChange={e => setFormData({ ...formData, message: e.target.value })} />
                  </div>
                </div>

                <button type="submit"
                  style={{ width: '100%', padding: '18px', backgroundColor: C.black, color: C.white, border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = C.black}>
                  Send Message <ArrowRight size={15} />
                </button>

                <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted, marginTop: 16, textAlign: 'center' }}>
                  We respond within 24 hours on business days.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;