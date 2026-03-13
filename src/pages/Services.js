import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Building2, Building, MapPin, Store, TrendingUp, ArrowRight, CheckCircle, Phone } from 'lucide-react';
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

/* ─────────────────────────────────────────────
   Service areas array — add new entries here
   and the page automatically updates.
   ───────────────────────────────────────────── */
const serviceAreas = [
  {
    icon: Home,
    title: 'Single Family Homes',
    desc: 'Whether you\'re buying or selling a single-family home in the Denver metro area, we offer expert guidance, market analysis, and negotiation support to get you the best outcome.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    highlights: ['Neighborhood expertise', 'Pricing strategy', 'Full-service representation'],
  },
  {
    icon: Building2,
    title: 'Condos',
    desc: 'From high-rise living in downtown Denver to suburban condo communities, we help buyers and sellers navigate HOA requirements, reserves, and unique condo market dynamics.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    highlights: ['HOA review & analysis', 'Building condition assessment', 'Market comparables'],
  },
  {
    icon: Building,
    title: 'Townhomes',
    desc: 'Townhomes offer the perfect balance of space and convenience. We specialize in finding and marketing townhome properties across Colorado\'s most desirable communities.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    highlights: ['Community insights', 'Maintenance-free options', 'Investment potential'],
  },
  {
    icon: MapPin,
    title: 'Land',
    desc: 'Looking to build your dream home or develop a property? We assist clients with finding and evaluating vacant land, zoning research, and connecting you with the right partners.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    highlights: ['Zoning & permits', 'Utility access evaluation', 'Development feasibility'],
  },
  {
    icon: Store,
    title: 'Commercial',
    desc: 'Our commercial real estate services cover retail, office, and mixed-use properties. We help business owners and investors find the right commercial space or sell at peak value.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    highlights: ['Lease negotiation', 'Cap rate analysis', 'Tenant representation'],
  },
  {
    icon: TrendingUp,
    title: 'Investment Property',
    desc: 'Build long-term wealth through real estate. We identify high-yield investment opportunities, analyze ROI, and provide ongoing advisory for portfolio growth in Colorado.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    highlights: ['ROI analysis', 'Property management referrals', 'Portfolio strategy'],
  },
  /* ── Add new service categories below this line ── */
];

const Services = () => {
  useEffect(() => { trackPageView('Services'); }, []);

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.white, color: C.slateDark }}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', height: '50vh', minHeight: 400, overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Services"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.35) 0%, rgba(15,23,42,0.75) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 20, fontWeight: 500 }}>What We Do</p>
          <div style={{ width: 48, height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: 24 }} />
          <h1 style={{ fontFamily: C.heading, fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, color: C.white, lineHeight: 1.1 }}>
            Our Service Areas
          </h1>
          <p style={{ fontFamily: C.body, fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 560, lineHeight: 1.8, marginTop: 16 }}>
            Expert representation across every property type in Colorado.
          </p>
        </div>
      </section>

      {/* ── Intro ── */}
      <section style={{ padding: '72px 0', backgroundColor: C.white }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <p style={{ fontFamily: C.heading, fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 600, color: C.navy, lineHeight: 1.55 }}>
            From single-family homes to commercial properties, we bring deep market knowledge and dedicated service to every transaction in the Denver metro area.
          </p>
        </div>
      </section>

      {/* ── Service Area Cards ── */}
      <section style={{ padding: '0 0 80px', backgroundColor: C.coolWhite }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.slateLight, marginBottom: 12, fontWeight: 500 }}>Property Types</p>
            <h2 style={{ fontFamily: C.heading, fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, color: C.navy, marginBottom: 16 }}>
              Areas We Specialize In
            </h2>
            <div style={{ width: 48, height: 2, backgroundColor: C.accent, margin: '0 auto' }} />
          </div>

          <div className="svc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {serviceAreas.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div
                  key={i}
                  className="chf-card"
                  style={{
                    borderRadius: 14, overflow: 'hidden', backgroundColor: C.white,
                    border: `1px solid ${C.border}`,
                    display: 'flex', flexDirection: 'column',
                  }}
                >
                  {/* Card Image */}
                  <div className="chf-img-zoom" style={{ height: 200, flexShrink: 0 }}>
                    <img src={svc.image} alt={svc.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '28px 28px 32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Icon + Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 10,
                        backgroundColor: `${C.navy}0A`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Icon size={22} style={{ color: C.navy }} />
                      </div>
                      <h3 style={{ fontFamily: C.heading, fontSize: 17, fontWeight: 700, color: C.navy }}>{svc.title}</h3>
                    </div>

                    {/* Description */}
                    <p style={{ fontFamily: C.body, fontSize: 13, color: C.slateMed, lineHeight: 1.75, marginBottom: 20, flex: 1 }}>
                      {svc.desc}
                    </p>

                    {/* Highlights */}
                    <div style={{ marginBottom: 24 }}>
                      {svc.highlights.map((h, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: j < svc.highlights.length - 1 ? 8 : 0 }}>
                          <CheckCircle size={14} style={{ color: C.accent, flexShrink: 0 }} />
                          <span style={{ fontFamily: C.body, fontSize: 12, color: C.slateMed, fontWeight: 500 }}>{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link to="/contact"
                      style={{
                        fontFamily: C.body, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: C.accent, fontWeight: 600, textDecoration: 'none',
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        transition: 'gap 0.25s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.gap = '12px'}
                      onMouseLeave={e => e.currentTarget.style.gap = '8px'}
                    >
                      Get Started <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section style={{ padding: '80px 0', backgroundColor: C.navyDark }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 12, fontWeight: 500 }}>Why Choose Us</p>
            <h2 style={{ fontFamily: C.heading, fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, color: C.white, marginBottom: 16 }}>
              Colorado's Trusted Real Estate Partner
            </h2>
            <div style={{ width: 48, height: 2, backgroundColor: C.accent, margin: '0 auto' }} />
          </div>

          <div className="resp-grid-4-dark" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { val: '500+', label: 'Families Served', desc: 'Trusted by clients across the Denver metro area' },
              { val: '98%', label: 'Client Satisfaction', desc: 'Consistently rated 5 stars by our clients' },
              { val: '3', label: 'Languages', desc: 'English, Filipino, and Japanese' },
              { val: '24hr', label: 'Response Time', desc: 'Quick communication when you need it most' },
            ].map((item, i) => (
              <div key={i} style={{
                textAlign: 'center', padding: '40px 24px',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                transition: 'background 0.3s',
              }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(196,149,106,0.06)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <p style={{ fontFamily: C.heading, fontSize: 40, fontWeight: 700, color: C.white, lineHeight: 1, marginBottom: 8 }}>{item.val}</p>
                <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accent, marginBottom: 10, fontWeight: 600 }}>{item.label}</p>
                <p style={{ fontFamily: C.body, fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 0', backgroundColor: C.white, textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.slateLight, marginBottom: 16, fontWeight: 500 }}>Get Started</p>
          <h2 style={{ fontFamily: C.heading, fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, color: C.navy, lineHeight: 1.2, marginBottom: 16 }}>
            Ready to Take the Next Step?
          </h2>
          <div style={{ width: 48, height: 2, backgroundColor: C.accent, margin: '0 auto 24px' }} />
          <p style={{ fontFamily: C.body, fontSize: 15, color: C.slateMed, lineHeight: 1.8, marginBottom: 36 }}>
            Whether you're buying, selling, or exploring your options, Alan is here to help. Reach out today to discuss your real estate goals.
          </p>
          <div className="resp-cta-buttons" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="chf-btn chf-btn-primary">
              <Phone size={16} /> Contact Alan
            </Link>
            <Link to="/valuation" className="chf-btn chf-btn-outline">
              Get Home Value <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Responsive overrides */}
      <style>{`
        .svc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        @media (max-width: 960px) { .svc-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .svc-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
};

export default Services;