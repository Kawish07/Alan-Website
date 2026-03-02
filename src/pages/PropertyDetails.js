import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import { trackBehavior, submitLead } from '../api';
import {
  Bed, Bath, Square, MapPin, Heart, Share2, ArrowLeft, ArrowRight,
  ChevronDown, ChevronUp, Phone, Mail, Calendar, CheckCircle
} from 'lucide-react';

const C = {
  black: '#0a0a0a', cream: '#f5f3ef', midCream: '#ede9e3',
  gold: '#c9a96e', muted: '#8a8078', white: '#ffffff',
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Jost', sans-serif",
};

const Accordion = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: `1px solid ${C.midCream}` }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 36, height: 36, backgroundColor: C.black, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={15} style={{ color: C.white }} />
          </div>
          <span style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.black, fontWeight: 500 }}>{title}</span>
        </div>
        {open ? <ChevronUp size={18} style={{ color: C.muted }} /> : <ChevronDown size={18} style={{ color: C.muted }} />}
      </button>
      {open && (
        <div style={{ backgroundColor: C.cream, padding: '8px 0 24px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

const DataRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: `1px solid ${C.midCream}`, backgroundColor: C.white }}>
    <span style={{ fontFamily: C.body, fontSize: 13, color: C.muted }}>{label}</span>
    <span style={{ fontFamily: C.body, fontSize: 13, fontWeight: 500, color: C.black }}>{value}</span>
  </div>
);

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [inquiry, setInquiry] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await API.get(`/properties/${id}`);
        setProperty(res.data);
        trackBehavior('PROPERTY_VIEW', { propertyId: id, address: res.data.address });
      } catch {
        setProperty({
          _id: id, price: 15950000, address: '5673 W County Highway',
          city: 'Santa Rosa Beach', state: 'FL', zipCode: '32459',
          beds: 8, baths: 9, sqft: 6944, status: 'FOR SALE',
          mlsId: '987246', yearBuilt: 2026, propertyType: 'Residential',
          neighborhood: 'Dune Allen Beach', waterFrontage: 'Gulf',
          stories: 3, pool: 'Pool - In-Ground, Pool Type',
          parking: 'Garage', architectureStyle: 'Contemporary',
          description: 'Designed by the acclaimed Geoff Chick & Associates and expertly constructed by Cogent Building Group, this newly completed Gulf-front estate at 5673 W County Highway 30A represents one of the most compelling offerings along Florida\'s iconic 30A corridor.',
          description2: 'Encompassing approximately 6,944 square feet across three thoughtfully curated levels, the residence delivers eight bedrooms and nine bathrooms, pairing architectural sophistication with a lifestyle defined by effortless luxury.',
          description3: 'From the moment you enter, expansive, light-filled living spaces frame uninterrupted Gulf vistas, creating a sense of connection to the coastline that is both immediate and profound.',
          features: ['Elevator', 'Fireplace', 'Washer/Dryer Hookup', 'Central Vacuum', 'Ice Machine', 'Wine Refrigerator', 'Summer Kitchen', 'Balcony'],
          appliances: ['Auto Garage Door Opener', 'Central Vacuum', 'Dishwasher', 'Disposal', 'Dryer', 'Ice Machine', 'Microwave', 'Refrigerator W/Ice Maker', 'Smoke Detector', 'Washer', 'Wine Refrigerator'],
          agent: { name: 'Luke Andrews', phone: '850-978-0545', email: 'luke.andrews@compass.com', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
          images: [
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          ],
        });
      }
    };
    fetchProperty();
  }, [id]);

  const handleInquiry = async (e) => {
    e.preventDefault();
    await submitLead({ ...inquiry, source: `Property Inquiry: ${property.address}`, intent: 'Buyer' });
    setSubmitted(true);
  };

  if (!property) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: C.display, fontSize: 24, color: C.black }}>
      Loading Property...
    </div>
  );

  const tabs = ['Description', 'Overview', 'Features & Amenities'];

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.white }}>

      {/* ── Immersive Hero Section ── */}
      <section style={{ position: 'relative', height: '95vh', minHeight: 700, overflow: 'hidden', backgroundColor: C.black }}>
        {/* Background Slider */}
        <div style={{ position: 'absolute', inset: 0 }}>
          {property.images.map((img, i) => (
            <div key={i} style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: currentSlide === i ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              transform: currentSlide === i ? 'scale(1.05)' : 'scale(1)',
              transitionDelay: '0s, 0.5s',
              transitionProperty: 'opacity, transform',
              duration: '1.5s, 8s'
            }} />
          ))}
          {/* Overlay Gradients */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 100%)' }} />
        </div>

        {/* Content Overlay */}
        <div style={{ position: 'relative', zIndex: 10, height: '100%', maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 60 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ color: C.white }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ backgroundColor: C.gold, color: C.white, padding: '4px 12px', borderRadius: 4, fontFamily: C.body, fontSize: 10, letterSpacing: '0.1em', fontWeight: 600 }}>{property.status}</span>
                <span style={{ color: '#ffffffcc', fontFamily: C.body, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{property.neighborhood}</span>
              </div>
              <h1 style={{ fontFamily: C.display, fontSize: 'clamp(40px, 6vw, 84px)', fontWeight: 300, lineHeight: 0.9, marginBottom: 20, letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
                {property.address}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, paddingLeft: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Bed size={18} strokeWidth={1} />
                  <span style={{ fontSize: 18, fontFamily: C.display }}>{property.beds} <small style={{ fontSize: 11, fontFamily: C.body, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>Beds</small></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Bath size={18} strokeWidth={1} />
                  <span style={{ fontSize: 18, fontFamily: C.display }}>{property.baths} <small style={{ fontSize: 11, fontFamily: C.body, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>Baths</small></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Square size={16} strokeWidth={1} />
                  <span style={{ fontSize: 18, fontFamily: C.display }}>{property.sqft?.toLocaleString()} <small style={{ fontSize: 11, fontFamily: C.body, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>Sq.Ft.</small></span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right', color: C.white, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <p style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 8, opacity: 0.8 }}>Listing Price</p>
              <p style={{ fontFamily: C.display, fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300, lineHeight: 1 }}>
                ${property.price.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Floating Gallery Controls */}
        <div style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)', zIndex: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {property.images.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentSlide(idx)}
              style={{
                width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer',
                backgroundColor: currentSlide === idx ? C.gold : 'rgba(255,255,255,0.3)',
                transition: 'all 0.3s'
              }} />
          ))}
        </div>

        {/* View All Button */}
        <button onClick={() => setShowAllPhotos(true)} style={{
          position: 'absolute', bottom: 40, right: 40, zIndex: 20, background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', color: C.white,
          padding: '12px 24px', borderRadius: 50, fontFamily: C.body, fontSize: 11, letterSpacing: '0.2em',
          textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s'
        }} onMouseEnter={e => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}>
          Enter Gallery
        </button>
      </section>

      {/* ── Key Metrics Section ── */}
      <section style={{ backgroundColor: C.cream, borderBottom: `1px solid ${C.midCream}` }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 40 }}>
            <div>
              <p style={{ fontFamily: C.body, fontSize: 10, color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>MLS ID</p>
              <p style={{ fontFamily: C.display, fontSize: 20, color: C.black }}>#{property.mlsId || '987246'}</p>
            </div>
            <div>
              <p style={{ fontFamily: C.body, fontSize: 10, color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>Built</p>
              <p style={{ fontFamily: C.display, fontSize: 20, color: C.black }}>{property.yearBuilt || '2026'}</p>
            </div>
            <div>
              <p style={{ fontFamily: C.body, fontSize: 10, color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>Type</p>
              <p style={{ fontFamily: C.display, fontSize: 20, color: C.black }}>{property.propertyType || 'Residential'}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', border: `1px solid ${C.midCream}`, background: C.white, cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.1em', borderRadius: 40, transition: 'all 0.2s' }}>
              <Heart size={14} /> Save Property
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', border: `1px solid ${C.midCream}`, background: C.white, cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.1em', borderRadius: 40, transition: 'all 0.2s' }}>
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>
      </section>

      {/* ── Sticky Tab Nav ── */}
      <div style={{ position: 'sticky', top: 60, zIndex: 40, backgroundColor: C.white, borderTop: `1px solid ${C.midCream}`, borderBottom: `1px solid ${C.midCream}` }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex' }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab.toLowerCase().replace(' & ', '-'))}
                style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.1em', textTransform: 'none', color: activeTab === tab.toLowerCase().replace(' & ', '-') ? C.black : C.muted, padding: '18px 28px', background: 'none', border: 'none', cursor: 'pointer', borderBottom: activeTab === tab.toLowerCase().replace(' & ', '-') ? `2px solid ${C.black}` : '2px solid transparent', transition: 'all 0.2s', marginBottom: -1 }}>
                {tab}
              </button>
            ))}
          </div>
          <Link to="/contact"
            style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black, textDecoration: 'none', border: `1px solid ${C.black}`, padding: '10px 28px', borderRadius: 40, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            Contact Us —
          </Link>
        </div>
      </div>

      {/* ── Main Content + Sidebar ── */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, alignItems: 'start', paddingTop: 64, paddingBottom: 80 }}>

        {/* Left Content */}
        <div>
          {/* Description */}
          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 300, color: C.black, letterSpacing: '0.05em', marginBottom: 40, textTransform: 'uppercase' }}>
              Property Description
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
              <p style={{ fontFamily: C.body, fontSize: 13, lineHeight: 2, color: '#5a5248' }}>
                {property.description}
              </p>
              <div>
                <p style={{ fontFamily: C.body, fontSize: 13, lineHeight: 2, color: '#5a5248', marginBottom: 20 }}>
                  {property.description2}
                </p>
                <p style={{ fontFamily: C.body, fontSize: 13, lineHeight: 2, color: '#5a5248' }}>
                  {property.description3}
                </p>
                <button style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.black }}>
                  Read More <ChevronDown size={14} />
                </button>
              </div>
            </div>
          </section>

          {/* Overview */}
          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 300, color: C.black, letterSpacing: '0.05em', marginBottom: 32, textTransform: 'uppercase' }}>
              Overview
            </h2>
            <Accordion title="Basic Information" icon={Square} defaultOpen={true}>
              <div style={{ marginTop: 8 }}>
                <DataRow label="Property Status" value={property.status === 'FOR SALE' ? 'For Sale' : property.status} />
                <DataRow label="MLS ID" value={property.mlsId || '987246'} />
                <DataRow label="Property Type" value={property.propertyType || 'Residential'} />
                <DataRow label="Year Built" value={property.yearBuilt || '2026'} />
              </div>
            </Accordion>
          </section>

          {/* Features & Amenities */}
          <section>
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 300, color: C.black, letterSpacing: '0.05em', marginBottom: 32, textTransform: 'uppercase' }}>
              Features & Amenities
            </h2>

            <Accordion title="Area & Lot" icon={MapPin} defaultOpen={true}>
              <div style={{ marginTop: 8 }}>
                <DataRow label="Total Area" value={`${property.sqft?.toLocaleString()} Sq.Ft.`} />
                <DataRow label="Neighborhood" value={property.neighborhood || 'Dune Allen Beach'} />
                <DataRow label="Architecture Styles" value={property.architectureStyle || 'Contemporary'} />
                <DataRow label="Water Frontage" value={property.waterFrontage || 'Gulf'} />
                <DataRow label="View Description" value="Gulf" />
              </div>
            </Accordion>

            <Accordion title="Interior & Exterior" icon={Bed} defaultOpen={false}>
              <div style={{ marginTop: 8 }}>
                <DataRow label="Stories" value={property.stories || '3'} />
                <DataRow label="Utilities" value="Public Water" />
                <DataRow label="Pool" value={property.pool || 'Pool - In-Ground, Pool Type'} />
                <DataRow label="Parking" value={property.parking || 'Garage'} />
                <DataRow label="Appliances" value={property.appliances ? property.appliances.join(', ') : 'Auto Garage Door Opn, Central Vacuum, Dishwasher'} />
                <DataRow label="Other Interior Features" value={property.features ? property.features.slice(0, 3).join(', ') : 'Elevator, Fireplace, Washer/Dryer Hookup'} />
                <DataRow label="Security Features" value="Fire Alarm/Sprinkler" />
                <DataRow label="Other Exterior Features" value="Balcony, Summer Kitchen" />
              </div>
            </Accordion>
          </section>
        </div>

        {/* ── Sidebar ── */}
        <div style={{ position: 'sticky', top: 120 }}>
          {/* Schedule a Tour */}
          <div style={{ backgroundColor: C.cream, padding: '40px 32px', marginBottom: 16 }}>
            <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, textAlign: 'center', marginBottom: 8 }}>Are you interested?</p>
            <h3 style={{ fontFamily: C.display, fontSize: 36, fontWeight: 300, color: C.black, textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 28 }}>
              Schedule A Tour
            </h3>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle size={48} style={{ color: '#4caf50', margin: '0 auto 16px' }} />
                <p style={{ fontFamily: C.display, fontSize: 22, color: C.black, marginBottom: 8 }}>Thank You!</p>
                <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, lineHeight: 1.7 }}>Your request has been received. We'll be in touch shortly.</p>
              </div>
            ) : (
              <>
                <button
                  style={{ width: '100%', padding: '14px', border: `1px solid ${C.black}`, borderRadius: 40, backgroundColor: 'transparent', fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <Calendar size={14} /> Pick Your Date & Time
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, backgroundColor: C.midCream }} />
                  <span style={{ fontFamily: C.body, fontSize: 11, color: C.muted }}>or</span>
                  <div style={{ flex: 1, height: 1, backgroundColor: C.midCream }} />
                </div>

                <form onSubmit={handleInquiry} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[['text', 'Your Name', 'name'], ['email', 'Email', 'email'], ['tel', 'Phone', 'phone']].map(([type, placeholder, field]) => (
                    <input key={field} type={type} placeholder={placeholder} required
                      style={{ width: '100%', padding: '12px 16px', border: `1px solid ${C.midCream}`, borderRadius: 0, outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, backgroundColor: C.white, boxSizing: 'border-box' }}
                      onChange={e => setInquiry({ ...inquiry, [field]: e.target.value })} />
                  ))}
                  <textarea rows={3} placeholder="I'm interested in this property..."
                    style={{ width: '100%', padding: '12px 16px', border: `1px solid ${C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, backgroundColor: C.white, resize: 'none', boxSizing: 'border-box' }}
                    onChange={e => setInquiry({ ...inquiry, message: e.target.value })} />
                  <button type="submit"
                    style={{ width: '100%', padding: '14px', backgroundColor: C.black, color: C.white, border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: 4 }}>
                    Send Inquiry
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Agent Card */}
          {property.agent && (
            <div style={{ backgroundColor: C.white, padding: '24px 32px', border: `1px solid ${C.midCream}`, textAlign: 'center' }}>
              <img src={property.agent.image} alt={property.agent.name}
                style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px' }} />
              <p style={{ fontFamily: C.display, fontSize: 20, color: C.black, marginBottom: 4 }}>{property.agent.name}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                <a href={`tel:${property.agent.phone}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: C.body, fontSize: 13, color: C.muted, textDecoration: 'none' }}>
                  <Phone size={14} /> {property.agent.phone}
                </a>
                <a href={`mailto:${property.agent.email}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: C.body, fontSize: 12, color: C.muted, textDecoration: 'none' }}>
                  <Mail size={14} /> {property.agent.email}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Back link */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px 40px' }}>
        <Link to="/search" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Back to Search
        </Link>
      </div>
    </div>
  );
};

export default PropertyDetails;