import React from 'react';
import { Link } from 'react-router-dom';
import { Award, TrendingUp, Shield, Users, Instagram, Linkedin, ArrowRight } from 'lucide-react';

const C = {
  black: '#0a0a0a', cream: '#f5f3ef', midCream: '#ede9e3',
  gold: '#c9a96e', muted: '#8a8078', white: '#ffffff',
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Jost', sans-serif",
};

const About = () => {
  const team = [
    { name: 'Alan Ramirez', role: 'Founder & Lead Agent', bio: 'With over 15 years in Colorado real estate, Alan has built a reputation for delivering exceptional results through market expertise and unwavering client dedication.', image: '/alan.png' },
    { name: 'Sarah Jenkins', role: 'Buyer Specialist', bio: 'Sarah\'s deep knowledge of Colorado\'s neighborhoods and her meticulous approach to buyer representation have made her a trusted guide for hundreds of clients.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'Michael Stone', role: 'Listing Manager', bio: 'Michael combines strategic marketing with sophisticated staging to present properties at their finest, consistently achieving above-asking results.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'Emily Clarke', role: 'Luxury Property Advisor', bio: 'Emily specializes in Colorado\'s ultra-luxury segment, bringing a refined sensibility and extensive network to every transaction she handles.', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'James Whitfield', role: 'Investment Strategist', bio: 'James helps investors navigate the Colorado market with data-driven insights and a portfolio approach that maximizes long-term returns.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'Priya Mehta', role: 'Relocation Specialist', bio: 'Priya\'s warm, attentive approach has helped dozens of families make seamless transitions to Colorado from across the country.', image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  ];

  const stats = [
    { value: '$2B+', label: 'Career Sales Volume' },
    { value: '#1', label: 'Large Team in Colorado' },
    { value: '500+', label: 'Families Served' },
    { value: '15+', label: 'Years of Excellence' },
  ];

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.white, color: C.black }}>

      {/* ── Hero ── */}
      <section className="resp-about-hero" style={{ position: 'relative', height: '85vh', backgroundColor: C.cream, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div className="resp-about-hero-img" style={{ position: 'absolute', top: 0, right: 0, width: '55%', height: '100%', overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1628745277862-bc0822606566?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Luxury Colorado Estate"
            className="chf-img-zoom"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #f5f3ef 0%, rgba(245,243,239,0.3) 25%, transparent 100%)' }} />
        </div>

        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', width: '100%', position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 40, height: 1, backgroundColor: C.gold }} />
              <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.muted, fontWeight: 500 }}>Est. 2010</p>
            </div>
            <h1 style={{ fontFamily: C.display, fontSize: 'clamp(56px, 8vw, 100px)', fontWeight: 300, color: C.black, lineHeight: 0.95, marginBottom: 32 }}>
              The Standard of <em>Excellence</em> in CO.
            </h1>
            <p style={{ fontFamily: C.body, fontSize: 13, color: '#5a5248', lineHeight: 1.9, letterSpacing: '0.02em', maxWidth: 460, marginBottom: 48 }}>
              Dedicated to providing unparalleled real estate expertise across Colorado's most prestigious markets. We don't just find houses; we secure legacies.
            </p>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              <Link to="/contact" className="chf-btn chf-btn-primary">
                Our Services <ArrowRight size={15} style={{ marginLeft: 8 }} />
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${C.midCream}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={16} style={{ color: C.gold }} />
                </div>
                <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted }}>Top 1% Nationwide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative corner element */}
        <div style={{ position: 'absolute', bottom: 40, left: 40, width: 200, height: 1, backgroundColor: 'rgba(9,9,9,0.05)' }} />
        <div style={{ position: 'absolute', bottom: 40, left: 40, width: 1, height: 100, backgroundColor: 'rgba(9,9,9,0.05)' }} />
      </section>

      {/* ── Stats Bar ── */}
      <section style={{ backgroundColor: C.black, position: 'relative', zIndex: 20, marginTop: '-40px', maxWidth: 1200, margin: '-40px auto 0' }}>
        <div className="resp-stats-bar" style={{ padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '48px 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <p style={{ fontFamily: C.display, fontSize: 48, fontWeight: 300, color: C.white, lineHeight: 1, marginBottom: 8 }}>{s.value}</p>
              <p style={{ fontFamily: C.body, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Story ── */}
      <section style={{ padding: '96px 0', backgroundColor: C.cream }}>
        <div className="resp-split" style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

          <div style={{ position: 'relative' }}>
            <img
              src="/alan.png"
              alt="Alan Ramirez"
              style={{ width: '100%', height: 580, objectFit: 'cover', display: 'block' }}
            />
            <div className="resp-about-overlay" style={{ position: 'absolute', right: -32, bottom: -32, backgroundColor: C.black, color: C.white, padding: '32px 40px' }}>
              <p style={{ fontFamily: C.display, fontSize: 52, fontWeight: 300, lineHeight: 1, marginBottom: 6 }}>15+</p>
              <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Years Experience</p>
            </div>
            <div className="resp-hide-tablet" style={{ position: 'absolute', top: -16, left: -16, width: 72, height: 72, border: `1px solid ${C.muted}` }} />
          </div>

          <div>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Our Story</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300, color: C.black, lineHeight: 1.15, marginBottom: 24 }}>
              Dedicated to <em>Excellence</em>
            </h2>
            <div style={{ width: 48, height: 1, backgroundColor: C.black, marginBottom: 32 }} />
            <p style={{ fontFamily: C.body, fontSize: 14, lineHeight: 1.9, color: '#5a5248', marginBottom: 20 }}>
              Colorado Home Finder was founded on the principle that every client deserves an exceptional real estate experience. Led by Alan Ramirez, our team combines deep local market knowledge with cutting-edge technology to deliver results that exceed expectations.
            </p>
            <p style={{ fontFamily: C.body, fontSize: 14, lineHeight: 1.9, color: '#5a5248', marginBottom: 40 }}>
              Whether you are a first-time buyer or a seasoned investor, we provide the guidance, negotiation skills, and personalized service you need to succeed in Colorado's competitive market.
            </p>

            <div className="resp-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
              {[
                [Award, 'Top Producing Team'],
                [TrendingUp, 'Market Experts'],
                [Shield, 'Trusted Advisors'],
                [Users, 'Client Focused'],
              ].map(([Icon, label], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={18} style={{ color: C.gold, flexShrink: 0 }} />
                  <span style={{ fontFamily: C.body, fontSize: 13, color: C.black }}>{label}</span>
                </div>
              ))}
            </div>

            <Link to="/contact"
              style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.white, textDecoration: 'none', backgroundColor: C.black, padding: '14px 36px', display: 'inline-block' }}>
              Work With Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section style={{ padding: '96px 0', backgroundColor: C.white }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', marginBottom: 80 }}>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Our Philosophy</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, color: C.black, lineHeight: 1.2, marginBottom: 24 }}>
              Real estate is not a transaction — it's a relationship built on trust, expertise, and unwavering commitment.
            </h2>
            <div style={{ width: 48, height: 1, backgroundColor: C.black, margin: '0 auto' }} />
          </div>

          <div className="resp-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, backgroundColor: C.midCream }}>
            {[
              { num: '01', title: 'Expertise', desc: 'Deep knowledge of Colorado\'s neighborhoods, market trends, and legal landscape ensures you always have the most accurate picture.' },
              { num: '02', title: 'Transparency', desc: 'We believe in clear, honest communication at every stage. No surprises, no hidden agendas — just straightforward guidance.' },
              { num: '03', title: 'Results', desc: 'Our track record speaks for itself. Over $2 billion in sales and hundreds of satisfied families are a testament to our commitment.' },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: C.white, padding: '56px 48px' }}>
                <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.gold, marginBottom: 20 }}>{item.num}</p>
                <h3 style={{ fontFamily: C.display, fontSize: 32, fontWeight: 300, color: C.black, marginBottom: 16 }}>{item.title}</h3>
                <div style={{ width: 32, height: 1, backgroundColor: C.midCream, marginBottom: 20 }} />
                <p style={{ fontFamily: C.body, fontSize: 13, lineHeight: 1.9, color: '#5a5248' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section style={{ padding: '96px 0', backgroundColor: C.cream }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>The Team</p>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 300, color: C.black, marginBottom: 20 }}>Meet Our Experts</h2>
            <div style={{ width: 60, height: 1, backgroundColor: C.black, margin: '0 auto' }} />
          </div>

          <div className="resp-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {team.map((member, i) => (
              <div key={i} style={{ overflow: 'hidden', backgroundColor: C.white }}>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img src={member.image} alt={member.name}
                    style={{ width: '100%', height: 360, objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'} />

                  {/* Social on hover overlay */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 100%)', opacity: 0, transition: 'opacity 0.3s', display: 'flex', justifyContent: 'center', gap: 10 }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                    {[Linkedin, Instagram].map((Icon, j) => (
                      <a key={j} href="#" style={{ width: 34, height: 34, backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, textDecoration: 'none' }}>
                        <Icon size={14} />
                      </a>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '24px 28px' }}>
                  <h3 style={{ fontFamily: C.display, fontSize: 22, fontWeight: 400, color: C.black, marginBottom: 4 }}>{member.name}</h3>
                  <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gold, marginBottom: 12 }}>{member.role}</p>
                  <p style={{ fontFamily: C.body, fontSize: 13, lineHeight: 1.8, color: '#5a5248' }}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '96px 0', backgroundColor: C.black, textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 32px' }}>
          <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Work With Us</p>
          <h2 style={{ fontFamily: C.display, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, color: C.white, lineHeight: 1.15, marginBottom: 16 }}>
            Ready to Start Your Real Estate Journey?
          </h2>
          <div style={{ width: 48, height: 1, backgroundColor: 'rgba(255,255,255,0.15)', margin: '0 auto 32px' }} />
          <p style={{ fontFamily: C.body, fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: 40 }}>
            Whether buying, selling, or simply exploring your options, our team is ready to guide you every step of the way.
          </p>
          <Link to="/contact"
            style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.black, textDecoration: 'none', backgroundColor: C.white, padding: '16px 40px', display: 'inline-block' }}>
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;