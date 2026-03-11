import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, DollarSign, Key, FileText, ArrowRight, Users, TrendingUp } from 'lucide-react';
import { trackPageView } from '../api';

const C = {
  black: '#0a0a0a', cream: '#f5f3ef', midCream: '#ede9e3',
  gold: '#c9a96e', muted: '#8a8078', white: '#ffffff',
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Jost', sans-serif",
};

const Services = () => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => { trackPageView('Services'); }, []);

  const services = [
    {
      icon: Home, num: '01',
      title: 'Buyer Representation',
      desc: 'From search to close, we guide you through every step of finding your dream home. Exclusive listings, expert negotiation, and unwavering support.',
      detail: 'Our buyer specialists bring deep neighborhood knowledge, off-market access, and proven negotiation tactics that consistently secure homes below asking price.',
      link: '/first-time-buyers',
      cta: 'Explore Buying',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    },
    {
      icon: DollarSign, num: '02',
      title: 'Seller Representation',
      desc: 'Strategic marketing and expert negotiation to get you the best price for your property — often above asking in today\'s market.',
      detail: 'Professional photography, targeted digital campaigns, and a network of qualified buyers ensure maximum exposure and competitive offers.',
      link: '/valuation',
      cta: 'Get Home Value',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    },
    {
      icon: Key, num: '03',
      title: 'Property Management',
      desc: 'Comprehensive management services for investment property owners — tenant screening, maintenance coordination, and monthly reporting.',
      detail: 'We treat your investment like our own, ensuring reliable income streams, minimal vacancies, and properties maintained to the highest standards.',
      link: '/contact',
      cta: 'Learn More',
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    },
    {
      icon: FileText, num: '04',
      title: 'Market Analysis',
      desc: 'In-depth reports and insights to help you make informed real estate decisions — whether buying, selling, or investing.',
      detail: 'Our data-driven reports draw on proprietary MLS data, neighborhood trends, and macroeconomic signals to give you a complete market picture.',
      link: '/contact',
      cta: 'Request Analysis',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    },
    {
      icon: Users, num: '05',
      title: 'Relocation Services',
      desc: 'Moving to Colorado? We make your transition seamless — from neighborhood tours to school research and local recommendations.',
      detail: 'Whether you\'re relocating for work or lifestyle, our relocation specialists ensure your move to Colorado is smooth, exciting, and stress-free.',
      link: '/contact',
      cta: 'Plan Your Move',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    },
    {
      icon: TrendingUp, num: '06',
      title: 'Investment Advisory',
      desc: 'Portfolio strategy, ROI analysis, and acquisition support for investors seeking long-term wealth through Colorado real estate.',
      detail: 'From single-family rentals to multi-unit developments, our investment advisors identify opportunities that align with your financial goals.',
      link: '/contact',
      cta: 'Invest With Us',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    },
  ];

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.white, color: C.black }}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', height: '65vh', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Services"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(245,243,239,0.1) 0%, rgba(245,243,239,0.85) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 20 }}>What We Do</p>
          <div style={{ width: 48, height: 1, backgroundColor: C.black, marginBottom: 24 }} />
          <h1 style={{ fontFamily: C.display, fontSize: 'clamp(48px, 8vw, 104px)', fontWeight: 300, color: C.black, lineHeight: 1, letterSpacing: '0.03em' }}>
            OUR SERVICES
          </h1>
        </div>
      </section>

      {/* ── Intro ── */}
      <section style={{ padding: '80px 0', backgroundColor: C.white, borderBottom: `1px solid ${C.midCream}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <p style={{ fontFamily: C.display, fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 300, color: C.black, lineHeight: 1.55 }}>
            From first-time buyers to seasoned investors, our comprehensive suite of services is built around one goal — your success in Colorado real estate.
          </p>
        </div>
      </section>

      {/* ── Services Grid (alternating detail panels) ── */}
      <section style={{ backgroundColor: C.cream }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          {services.map((svc, i) => (
            <div key={i}
              className="resp-service-row"
              style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr', minHeight: 480, borderBottom: `1px solid ${C.midCream}` }}
              onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>

              {/* Image */}
              <div style={{ order: i % 2 === 0 ? 0 : 1, overflow: 'hidden', position: 'relative' }}>
                <img src={svc.image} alt={svc.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.7s ease', transform: hoveredIdx === i ? 'scale(1.04)' : 'scale(1)', minHeight: 400 }} />
                <div style={{ position: 'absolute', top: 24, left: 24, backgroundColor: C.black, color: C.white, width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svc.icon size={16} />
                </div>
              </div>

              {/* Content */}
              <div style={{ order: i % 2 === 0 ? 1 : 0, padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: i % 2 !== 0 ? C.cream : C.white }}>
                <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.gold, marginBottom: 16 }}>{svc.num}</p>
                <h2 style={{ fontFamily: C.display, fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 300, color: C.black, marginBottom: 16, lineHeight: 1.15 }}>{svc.title}</h2>
                <div style={{ width: 40, height: 1, backgroundColor: C.black, marginBottom: 20 }} />
                <p style={{ fontFamily: C.body, fontSize: 14, lineHeight: 1.9, color: '#5a5248', marginBottom: 16 }}>{svc.desc}</p>
                <p style={{ fontFamily: C.body, fontSize: 13, lineHeight: 1.8, color: C.muted, marginBottom: 36 }}>{svc.detail}</p>

                <Link to={svc.link}
                  style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.black, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 12, border: `1px solid ${C.black}`, padding: '12px 28px', borderRadius: 40, width: 'fit-content', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.black; e.currentTarget.style.color = C.white; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = C.black; }}>
                  {svc.cta} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Us ── */}
      <section style={{ padding: '96px 0', backgroundColor: C.black }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>Why Choose Us</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300, color: C.white, marginBottom: 20 }}>
              Colorado's Most Trusted Team
            </h2>
            <div style={{ width: 48, height: 1, backgroundColor: 'rgba(255,255,255,0.15)', margin: '0 auto' }} />
          </div>

          <div className="resp-grid-4-dark" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, backgroundColor: 'rgba(255,255,255,0.05)' }}>
            {[
              { val: '$2B+', label: 'Career Sales', desc: 'Proven track record across all price points' },
              { val: '#1', label: 'Colorado Team', desc: 'Ranked top local agent in Denver metro' },
              { val: '500+', label: 'Families Served', desc: 'Trusted by clients across every neighborhood' },
              { val: '98%', label: 'Satisfaction Rate', desc: 'Consistently rated 5 stars by our clients' },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: 'rgba(10,10,10,0.95)', padding: '48px 36px', textAlign: 'center' }}>
                <p style={{ fontFamily: C.display, fontSize: 48, fontWeight: 300, color: C.white, lineHeight: 1, marginBottom: 8 }}>{item.val}</p>
                <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, marginBottom: 12 }}>{item.label}</p>
                <p style={{ fontFamily: C.body, fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '96px 0', backgroundColor: C.white, textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 32px' }}>
          <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 20 }}>Get Started</p>
          <h2 style={{ fontFamily: C.display, fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, color: C.black, lineHeight: 1.15, marginBottom: 20 }}>
            Ready to Take<br />the Next Step?
          </h2>
          <div style={{ width: 48, height: 1, backgroundColor: C.black, margin: '0 auto 32px' }} />
          <p style={{ fontFamily: C.body, fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 40 }}>
            Whether you're buying, selling, or exploring options, our team is here to help. Schedule a consultation and let's discuss your goals.
          </p>
          <div className="resp-cta-buttons" style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <Link to="/contact"
              style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.white, textDecoration: 'none', backgroundColor: C.black, padding: '16px 40px', display: 'inline-block' }}>
              Contact Us
            </Link>
            <Link to="/valuation"
              style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.black, textDecoration: 'none', border: `1px solid ${C.black}`, padding: '16px 40px', display: 'inline-block' }}>
              Get Home Value
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;