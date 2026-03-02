import React, { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  X, User, Mail, Phone, Bell,
  BarChart3, Users, Home, Settings,
  LogOut, Plus, Edit, Trash2,
  Save, ChevronLeft, ChevronRight,
  TrendingUp, DollarSign, Eye,
  FileText, Megaphone, PieChart, ToggleLeft, ToggleRight,
  Globe, Image as ImageIcon, Type, Clock
} from 'lucide-react';

const C = {
  black: '#0a0a0a', cream: '#f5f3ef', midCream: '#ede9e3',
  gold: '#c9a96e', muted: '#8a8078', white: '#ffffff',
  sidebar: '#0f0f0d',
  sidebarBorder: 'rgba(255,255,255,0.06)',
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Jost', sans-serif",
};

const Badge = ({ children, color = 'default' }) => {
  const colors = {
    buyer: { bg: 'rgba(59,130,246,0.08)', color: '#2563eb' },
    seller: { bg: 'rgba(16,185,129,0.08)', color: '#059669' },
    other: { bg: C.cream, color: C.muted },
    default: { bg: C.cream, color: C.muted },
  };
  const s = colors[color] || colors.default;
  return (
    <span style={{ backgroundColor: s.bg, color: s.color, fontFamily: C.body, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 40, fontWeight: 500 }}>
      {children}
    </span>
  );
};

const StatCard = ({ label, value, sub, accent }) => (
  <div style={{ backgroundColor: C.white, padding: '28px 32px', borderBottom: `3px solid ${accent}`, borderTop: 'none', borderLeft: 'none', borderRight: 'none', border: `1px solid ${C.midCream}`, borderBottomColor: accent }}>
    <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, marginBottom: 12 }}>{label}</p>
    <p style={{ fontFamily: C.display, fontSize: 44, fontWeight: 300, color: C.black, lineHeight: 1, marginBottom: 6 }}>{value}</p>
    {sub && <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted }}>{sub}</p>}
  </div>
);

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLead, setSelectedLead] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [focusedNote, setFocusedNote] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const leadsRes = await API.get('/leads');
      setLeads(leadsRes.data);
      const propsRes = await API.get('/properties');
      setProperties(propsRes.data);
    } catch {
      // Use mock data
      setLeads([
        { _id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '303-555-0101', intent: 'Buyer', source: 'Home Valuation Page', createdAt: new Date().toISOString(), notes: [] },
        { _id: '2', name: 'David Thompson', email: 'david@example.com', phone: '303-555-0102', intent: 'Seller', source: 'Property Inquiry: 5673 W County Highway', createdAt: new Date(Date.now() - 86400000).toISOString(), notes: [{ text: 'Interested in selling by Q2' }] },
        { _id: '3', name: 'Emily Clarke', email: 'emily@example.com', phone: '303-555-0103', intent: 'Buyer', source: 'Cash Offer Page', createdAt: new Date(Date.now() - 172800000).toISOString(), notes: [] },
        { _id: '4', name: 'James Whitfield', email: 'james@example.com', phone: '303-555-0104', intent: 'Seller', source: 'Contact Page', createdAt: new Date(Date.now() - 259200000).toISOString(), notes: [] },
        { _id: '5', name: 'Maria Santos', email: 'maria@example.com', phone: '303-555-0105', intent: 'Buyer', source: 'First Time Buyer Page', createdAt: new Date(Date.now() - 345600000).toISOString(), notes: [] },
      ]);
      setProperties([
        { _id: '1', address: '5673 W County Highway', city: 'Santa Rosa Beach', price: 15950000, beds: 8, baths: 9, sqft: 6944, status: 'FOR SALE', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400'] },
        { _id: '2', address: '3504 E County Hwy 30A', city: 'Santa Rosa Beach', price: 19245000, beds: 9, baths: 10, sqft: 8524, status: 'PENDING', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400'] },
        { _id: '3', address: '123 Mountain Vista Dr', city: 'Denver', price: 2150000, beds: 5, baths: 4, sqft: 4200, status: 'FOR SALE', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'] },
      ]);
    }
  };

  const handleAddNote = async (leadId) => {
    if (!noteText.trim()) return;
    try {
      await API.post(`/leads/note/${leadId}`, { text: noteText });
    } catch {}
    const newNote = { text: noteText };
    setLeads(prev => prev.map(l => l._id === leadId ? { ...l, notes: [...(l.notes || []), newNote] } : l));
    if (selectedLead?._id === leadId) setSelectedLead(prev => ({ ...prev, notes: [...(prev.notes || []), newNote] }));
    setNoteText('');
  };

  const stats = [
    { label: 'Total Leads', value: leads.length, sub: 'All time', accent: C.gold },
    { label: 'Buyer Leads', value: leads.filter(l => l.intent === 'Buyer').length, sub: 'Active prospects', accent: '#3b82f6' },
    { label: 'Seller Leads', value: leads.filter(l => l.intent === 'Seller').length, sub: 'Active prospects', accent: '#10b981' },
    { label: 'Active Listings', value: properties.length, sub: 'Published', accent: '#8b5cf6' },
  ];

  const navItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'leads', icon: Users, label: 'Lead Inbox' },
    { id: 'properties', icon: Home, label: 'Properties' },
    { id: 'cms', icon: FileText, label: 'CMS' },
    { id: 'marketing', icon: Megaphone, label: 'Marketing' },
    { id: 'analytics', icon: PieChart, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div style={{ fontFamily: C.body, minHeight: '100vh', display: 'flex', backgroundColor: C.cream }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: sidebarOpen ? 260 : 72, backgroundColor: C.sidebar, display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease', flexShrink: 0, position: 'relative', zIndex: 20 }}>

        {/* Logo */}
        <div style={{ padding: '28px 20px 24px', borderBottom: `1px solid ${C.sidebarBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 80 }}>
          {sidebarOpen && (
            <Link to="/" style={{ textDecoration: 'none' }}>
              <p style={{ fontFamily: C.display, fontSize: 16, fontWeight: 400, letterSpacing: '0.1em', color: C.white, lineHeight: 1 }}>CHF</p>
              <p style={{ fontFamily: C.body, fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.gold, marginTop: 3 }}>Admin</p>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ width: 32, height: 32, border: `1px solid ${C.sidebarBorder}`, borderRadius: '50%', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', flexShrink: 0, marginLeft: sidebarOpen ? 0 : 'auto', marginRight: sidebarOpen ? 0 : 'auto' }}
          >
            {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={!sidebarOpen ? item.label : undefined}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', marginBottom: 4, justifyContent: sidebarOpen ? 'flex-start' : 'center', transition: 'all 0.15s', backgroundColor: activeTab === item.id ? C.gold : 'transparent', color: activeTab === item.id ? C.white : 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => { if (activeTab !== item.id) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { if (activeTab !== item.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <item.icon size={18} style={{ flexShrink: 0 }} />
              {sidebarOpen && <span style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px', borderTop: `1px solid ${C.sidebarBorder}` }}>
          <button
            onClick={() => { logout(); navigate('/admin/login'); }}
            title={!sidebarOpen ? 'Logout' : undefined}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.3)', justifyContent: sidebarOpen ? 'flex-start' : 'center', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#f87171'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
          >
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.08em' }}>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <header style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.midCream}`, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', flexShrink: 0 }}>
          <div>
            <p style={{ fontFamily: C.display, fontSize: 20, fontWeight: 300, color: C.black, lineHeight: 1 }}>
              {navItems.find(n => n.id === activeTab)?.label}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button style={{ position: 'relative', width: 36, height: 36, border: `1px solid ${C.midCream}`, borderRadius: '50%', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>
              <Bell size={16} />
              <span style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, backgroundColor: '#ef4444', borderRadius: '50%' }} />
            </button>
            <div style={{ height: 32, width: 1, backgroundColor: C.midCream }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, backgroundColor: C.black, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: C.display, fontSize: 16, color: C.white }}>A</span>
              </div>
              <span style={{ fontFamily: C.body, fontSize: 12, color: C.black }}>Admin</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px 40px' }}>

          {/* ── DASHBOARD ── */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
                {stats.map((s, i) => <StatCard key={i} {...s} />)}
              </div>

              {/* Two column */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

                {/* Recent Leads */}
                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}` }}>
                  <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.midCream}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontFamily: C.display, fontSize: 20, fontWeight: 300, color: C.black }}>Recent Leads</p>
                    <button onClick={() => setActiveTab('leads')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold }}>
                      View All
                    </button>
                  </div>
                  <div>
                    {leads.slice(0, 5).map((lead, i) => (
                      <div key={lead._id} style={{ padding: '14px 24px', borderBottom: i < 4 ? `1px solid ${C.midCream}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 34, height: 34, backgroundColor: C.black, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontFamily: C.display, fontSize: 16, color: C.white }}>{lead.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p style={{ fontFamily: C.body, fontSize: 13, fontWeight: 500, color: C.black }}>{lead.name}</p>
                            <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted }}>{lead.email}</p>
                          </div>
                        </div>
                        <Badge color={lead.intent?.toLowerCase()}>{lead.intent}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Listings */}
                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}` }}>
                  <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.midCream}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontFamily: C.display, fontSize: 20, fontWeight: 300, color: C.black }}>Active Listings</p>
                    <button onClick={() => setActiveTab('properties')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold }}>
                      Manage
                    </button>
                  </div>
                  <div>
                    {properties.slice(0, 4).map((prop, i) => (
                      <div key={prop._id} style={{ padding: '14px 24px', borderBottom: i < 3 ? `1px solid ${C.midCream}` : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <img src={prop.images?.[0]} alt="" style={{ width: 52, height: 40, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: C.body, fontSize: 13, fontWeight: 500, color: C.black, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prop.address}</p>
                          <p style={{ fontFamily: C.display, fontSize: 16, color: C.black }}>${prop.price?.toLocaleString()}</p>
                        </div>
                        <Badge color={prop.status === 'FOR SALE' ? 'seller' : 'other'}>{prop.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── LEADS ── */}
          {activeTab === 'leads' && (
            <div>
              <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.midCream}` }}>
                  <p style={{ fontFamily: C.display, fontSize: 22, fontWeight: 300, color: C.black }}>Lead Inbox</p>
                  <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted, marginTop: 2 }}>{leads.length} total leads</p>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: C.cream }}>
                        {['Lead Info', 'Intent', 'Source', 'Date', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, fontWeight: 500 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead, i) => (
                        <tr key={lead._id} style={{ borderTop: `1px solid ${C.midCream}` }}>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ width: 36, height: 36, backgroundColor: C.black, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ fontFamily: C.display, fontSize: 18, color: C.white }}>{lead.name.charAt(0)}</span>
                              </div>
                              <div>
                                <p style={{ fontFamily: C.body, fontSize: 13, fontWeight: 500, color: C.black }}>{lead.name}</p>
                                <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted }}>{lead.email}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <Badge color={lead.intent?.toLowerCase()}>{lead.intent}</Badge>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{ fontFamily: C.body, fontSize: 12, color: C.muted }}>{lead.source}</span>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{ fontFamily: C.body, fontSize: 12, color: C.muted }}>{new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <button
                              onClick={() => setSelectedLead(lead)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.black, display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${C.black}`, paddingBottom: 2 }}
                            >
                              <Eye size={13} /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── PROPERTIES ── */}
          {activeTab === 'properties' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <div>
                  <p style={{ fontFamily: C.display, fontSize: 22, fontWeight: 300, color: C.black }}>Property Management</p>
                  <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted, marginTop: 2 }}>{properties.length} listings</p>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: C.black, color: C.white, border: 'none', padding: '12px 24px', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  <Plus size={15} /> Add Property
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {properties.map(prop => (
                  <div key={prop._id} style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, overflow: 'hidden' }}>
                    <div style={{ position: 'relative', height: 200 }}>
                      <img src={prop.images?.[0] || 'https://via.placeholder.com/400'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <div style={{ position: 'absolute', top: 12, left: 12 }}>
                        <Badge color={prop.status === 'FOR SALE' ? 'seller' : 'other'}>{prop.status}</Badge>
                      </div>
                      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
                        <button style={{ width: 32, height: 32, backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.black }}>
                          <Edit size={14} />
                        </button>
                        <button style={{ width: 32, height: 32, backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div style={{ padding: '20px 24px' }}>
                      <p style={{ fontFamily: C.body, fontSize: 13, fontWeight: 500, color: C.black, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prop.address}</p>
                      <p style={{ fontFamily: C.display, fontSize: 24, fontWeight: 300, color: C.black, marginBottom: 8 }}>${prop.price?.toLocaleString()}</p>
                      <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted, letterSpacing: '0.05em' }}>{prop.beds} Beds · {prop.baths} Baths · {prop.sqft?.toLocaleString()} Sq.Ft.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CMS ── */}
          {activeTab === 'cms' && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: C.display, fontSize: 22, fontWeight: 300, color: C.black }}>Content Management</p>
                <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted, marginTop: 2 }}>Edit homepage content, about page, and manage testimonials</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                {/* Homepage Hero */}
                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${C.midCream}` }}>
                    <Globe size={16} style={{ color: C.gold }} />
                    <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black }}>Homepage Hero</p>
                  </div>
                  {[['Hero Title', 'text', 'For Those Who Seek An Exceptional Life'], ['Hero Subtitle', 'text', "Experience Colorado's Finest Properties"], ['Hero Video URL', 'url', '/videos/hero.mp4']].map(([label, type, val]) => (
                    <div key={label} style={{ marginBottom: 20 }}>
                      <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>{label}</label>
                      <input type={type} defaultValue={val} style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: `1px solid ${C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, backgroundColor: 'transparent', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                  <button style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: C.black, color: C.white, border: 'none', padding: '12px 24px', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    <Save size={14} /> Save
                  </button>
                </div>

                {/* About Page */}
                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${C.midCream}` }}>
                    <Type size={16} style={{ color: C.gold }} />
                    <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black }}>About Page</p>
                  </div>
                  {[['Section Title', 'text', 'An Overachiever In Every Sense'], ['Agent Name', 'text', 'Alan Ramirez']].map(([label, type, val]) => (
                    <div key={label} style={{ marginBottom: 20 }}>
                      <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>{label}</label>
                      <input type={type} defaultValue={val} style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: `1px solid ${C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, backgroundColor: 'transparent', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Bio Text</label>
                    <textarea rows={5} defaultValue="Alan Ramirez leads Colorado Home Finder with dedication and excellence. With over $2 billion in career sales..." style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: `1px solid ${C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, backgroundColor: 'transparent', boxSizing: 'border-box', resize: 'none' }} />
                  </div>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: C.black, color: C.white, border: 'none', padding: '12px 24px', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    <Save size={14} /> Save
                  </button>
                </div>
              </div>

              {/* Testimonials Manager */}
              <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: 32, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${C.midCream}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Users size={16} style={{ color: C.gold }} />
                    <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black }}>Testimonials</p>
                  </div>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: C.black, color: C.white, border: 'none', padding: '10px 20px', cursor: 'pointer', fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    <Plus size={13} /> Add
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { name: 'Sarah & Michael Johnson', location: 'Denver, CO', quote: 'Alan made the home buying process seamless...' },
                    { name: 'David Thompson', location: 'Boulder, CO', quote: 'Professional, responsive, and truly cares...' },
                  ].map((t, i) => (
                    <div key={i} style={{ padding: 20, border: `1px solid ${C.midCream}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontFamily: C.body, fontSize: 13, fontWeight: 500, color: C.black }}>{t.name}</p>
                        <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted, marginTop: 2 }}>{t.location}</p>
                        <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted, marginTop: 8, fontStyle: 'italic' }}>"{t.quote}"</p>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button style={{ width: 28, height: 28, border: `1px solid ${C.midCream}`, backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}><Edit size={12} /></button>
                        <button style={{ width: 28, height: 28, border: `1px solid ${C.midCream}`, backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}><Trash2 size={12} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lead Magnets / File Uploads */}
              <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${C.midCream}` }}>
                  <ImageIcon size={16} style={{ color: C.gold }} />
                  <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black }}>Lead Magnet Files</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {['First-Time Buyer Guide PDF', 'Cash Offer Brochure', 'Market Report PDF'].map((file, i) => (
                    <div key={i} style={{ padding: 20, border: `1px dashed ${C.midCream}`, textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
                      onMouseLeave={e => e.currentTarget.style.borderColor = C.midCream}>
                      <ImageIcon size={24} style={{ color: C.muted, marginBottom: 8 }} />
                      <p style={{ fontFamily: C.body, fontSize: 12, color: C.black, marginBottom: 4 }}>{file}</p>
                      <p style={{ fontFamily: C.body, fontSize: 10, color: C.gold, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Upload / Replace</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── MARKETING ── */}
          {activeTab === 'marketing' && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: C.display, fontSize: 22, fontWeight: 300, color: C.black }}>Marketing & Popups</p>
                <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted, marginTop: 2 }}>Manage popup campaigns, exit-intent triggers, and form routing</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                {/* Popup Builder */}
                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${C.midCream}` }}>
                    <Megaphone size={16} style={{ color: C.gold }} />
                    <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black }}>Popup Settings</p>
                  </div>
                  {[['Popup Title', 'text', 'Get Your Free Home Valuation'], ['Popup Subtitle', 'text', 'Find out what your property is worth today'], ['CTA Button Text', 'text', 'Get My Valuation'], ['CTA Link', 'text', '/valuation']].map(([label, type, val]) => (
                    <div key={label} style={{ marginBottom: 20 }}>
                      <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>{label}</label>
                      <input type={type} defaultValue={val} style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: `1px solid ${C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, backgroundColor: 'transparent', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Delay (seconds)</label>
                    <input type="number" defaultValue={5} style={{ width: 120, padding: '12px 0', border: 'none', borderBottom: `1px solid ${C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, backgroundColor: 'transparent', boxSizing: 'border-box' }} />
                  </div>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: C.black, color: C.white, border: 'none', padding: '12px 24px', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    <Save size={14} /> Save Popup
                  </button>
                </div>

                {/* Toggles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: 32 }}>
                    <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black, marginBottom: 24 }}>Triggers</p>
                    {[
                      { label: 'Exit Intent Popup', desc: 'Show popup when user moves to close/leave', on: true },
                      { label: 'Timed Popup', desc: 'Show after delay on page load', on: true },
                      { label: 'Scroll Trigger', desc: 'Show after 50% page scroll', on: false },
                    ].map((toggle, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < 2 ? `1px solid ${C.midCream}` : 'none' }}>
                        <div>
                          <p style={{ fontFamily: C.body, fontSize: 13, color: C.black }}>{toggle.label}</p>
                          <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted, marginTop: 2 }}>{toggle.desc}</p>
                        </div>
                        {toggle.on ? <ToggleRight size={28} style={{ color: C.gold, cursor: 'pointer' }} /> : <ToggleLeft size={28} style={{ color: C.muted, cursor: 'pointer' }} />}
                      </div>
                    ))}
                  </div>

                  <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: 32 }}>
                    <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black, marginBottom: 24 }}>Form Routing</p>
                    {[
                      { source: 'Contact Form', dest: 'FollowUpBoss + Email' },
                      { source: 'Valuation Form', dest: 'FollowUpBoss' },
                      { source: 'Cash Offer Form', dest: 'FollowUpBoss + SMS' },
                    ].map((route, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 2 ? `1px solid ${C.midCream}` : 'none' }}>
                        <span style={{ fontFamily: C.body, fontSize: 12, color: C.black }}>{route.source}</span>
                        <span style={{ fontFamily: C.body, fontSize: 11, color: C.gold, letterSpacing: '0.1em' }}>{route.dest}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {activeTab === 'analytics' && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: C.display, fontSize: 22, fontWeight: 300, color: C.black }}>Analytics & Reports</p>
                <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted, marginTop: 2 }}>Traffic sources, property popularity, and conversion rates</p>
              </div>

              {/* Quick KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
                {[
                  { label: 'Page Views', value: '12,483', sub: '+18% vs last month', accent: C.gold },
                  { label: 'Unique Visitors', value: '3,216', sub: '+12% vs last month', accent: '#3b82f6' },
                  { label: 'Lead Conversions', value: '89', sub: '2.8% conversion rate', accent: '#10b981' },
                  { label: 'Avg. Session', value: '3m 42s', sub: '+22s vs last month', accent: '#8b5cf6' },
                ].map((s, i) => <StatCard key={i} {...s} />)}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                {/* Traffic Sources */}
                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: 32 }}>
                  <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black, marginBottom: 24 }}>Traffic Sources</p>
                  {[
                    { source: 'Google Organic', pct: 42, color: '#3b82f6' },
                    { source: 'Direct', pct: 28, color: C.gold },
                    { source: 'Social Media', pct: 18, color: '#10b981' },
                    { source: 'Referral', pct: 8, color: '#8b5cf6' },
                    { source: 'Paid Ads', pct: 4, color: '#ef4444' },
                  ].map((s, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontFamily: C.body, fontSize: 12, color: C.black }}>{s.source}</span>
                        <span style={{ fontFamily: C.body, fontSize: 12, color: C.muted }}>{s.pct}%</span>
                      </div>
                      <div style={{ width: '100%', height: 6, backgroundColor: C.cream, borderRadius: 3 }}>
                        <div style={{ width: `${s.pct}%`, height: '100%', backgroundColor: s.color, borderRadius: 3, transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Top Properties */}
                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: 32 }}>
                  <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black, marginBottom: 24 }}>Most Viewed Properties</p>
                  {properties.slice(0, 5).map((prop, i) => (
                    <div key={prop._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < Math.min(properties.length, 5) - 1 ? `1px solid ${C.midCream}` : 'none' }}>
                      <span style={{ fontFamily: C.display, fontSize: 20, fontWeight: 300, color: C.muted, width: 28 }}>{i + 1}</span>
                      <img src={prop.images?.[0]} alt="" style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: C.body, fontSize: 12, color: C.black, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prop.address}</p>
                        <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted }}>${prop.price?.toLocaleString()}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Eye size={12} style={{ color: C.muted }} />
                        <span style={{ fontFamily: C.body, fontSize: 11, color: C.muted }}>{Math.floor(Math.random() * 500 + 100)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversion by Page */}
              <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: 32 }}>
                <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black, marginBottom: 24 }}>Conversion by Landing Page</p>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: C.cream }}>
                        {['Page', 'Visitors', 'Leads', 'Conv. Rate', 'Trend'].map(h => (
                          <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, fontWeight: 500 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { page: 'Home Valuation', visitors: '1,842', leads: '62', rate: '3.4%', trend: '+0.6%' },
                        { page: 'Cash Offer', visitors: '1,205', leads: '48', rate: '4.0%', trend: '+1.2%' },
                        { page: 'First-Time Buyers', visitors: '987', leads: '31', rate: '3.1%', trend: '-0.2%' },
                        { page: 'Contact Page', visitors: '2,341', leads: '28', rate: '1.2%', trend: '+0.1%' },
                        { page: 'Sell Before You Buy', visitors: '654', leads: '19', rate: '2.9%', trend: '+0.8%' },
                      ].map((row, i) => (
                        <tr key={i} style={{ borderTop: `1px solid ${C.midCream}` }}>
                          <td style={{ padding: '14px 20px', fontFamily: C.body, fontSize: 13, color: C.black }}>{row.page}</td>
                          <td style={{ padding: '14px 20px', fontFamily: C.body, fontSize: 13, color: C.muted }}>{row.visitors}</td>
                          <td style={{ padding: '14px 20px', fontFamily: C.body, fontSize: 13, color: C.black, fontWeight: 500 }}>{row.leads}</td>
                          <td style={{ padding: '14px 20px', fontFamily: C.body, fontSize: 13, color: C.black }}>{row.rate}</td>
                          <td style={{ padding: '14px 20px', fontFamily: C.body, fontSize: 13, color: row.trend.startsWith('+') ? '#10b981' : '#ef4444' }}>{row.trend}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeTab === 'settings' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Profile */}
                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${C.midCream}` }}>
                    <User size={16} style={{ color: C.gold }} />
                    <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black }}>Profile Information</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                    {[['Full Name', 'text', 'Alan Ramirez'], ['Email', 'email', 'admin@coloradohomefinder.com'], ['Phone', 'tel', '(303) 555-0123'], ['License #', 'text', 'FA.1234567']].map(([label, type, val]) => (
                      <div key={label}>
                        <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>{label}</label>
                        <input type={type} defaultValue={val}
                          style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: `1px solid ${C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, backgroundColor: 'transparent', boxSizing: 'border-box' }} />
                      </div>
                    ))}
                  </div>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: C.black, color: C.white, border: 'none', padding: '12px 24px', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    <Save size={14} /> Save Changes
                  </button>
                </div>

                {/* Site Config */}
                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${C.midCream}` }}>
                    <Settings size={16} style={{ color: C.gold }} />
                    <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black }}>Site Configuration</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {[['Google Analytics ID', 'text', 'UA-XXXXXXXXX-X']].map(([label, type, placeholder]) => (
                      <div key={label}>
                        <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>{label}</label>
                        <input type={type} placeholder={placeholder}
                          style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: `1px solid ${C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, backgroundColor: 'transparent', boxSizing: 'border-box' }} />
                      </div>
                    ))}
                    <div>
                      <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Meta Description</label>
                      <textarea rows={3} placeholder="Colorado Home Finder - Luxury Real Estate..."
                        style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: `1px solid ${C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, backgroundColor: 'transparent', boxSizing: 'border-box', resize: 'none' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right col */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: '32px' }}>
                  <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black, marginBottom: 24 }}>Branding</p>
                  {[['Primary Color', C.black], ['Accent Color', C.gold]].map(([label, color]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${C.midCream}` }}>
                      <span style={{ fontFamily: C.body, fontSize: 12, color: C.muted }}>{label}</span>
                      <div style={{ width: 28, height: 28, backgroundColor: color, border: `1px solid ${C.midCream}`, cursor: 'pointer' }} />
                    </div>
                  ))}
                </div>

                <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', padding: '28px' }}>
                  <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#be123c', marginBottom: 8 }}>Danger Zone</p>
                  <p style={{ fontFamily: C.body, fontSize: 12, color: '#e11d48', lineHeight: 1.6, marginBottom: 20 }}>Clear cache or reset settings. This cannot be undone.</p>
                  <button style={{ width: '100%', padding: '11px', border: '1px solid #f87171', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = C.white; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}>
                    Clear Cache
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Lead Modal ── */}
      {selectedLead && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(10,10,10,0.6)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}
          onClick={() => setSelectedLead(null)}
        >
          <div
            style={{ backgroundColor: C.white, width: '100%', maxWidth: 720, maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '24px 32px', borderBottom: `1px solid ${C.midCream}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: C.white, zIndex: 1 }}>
              <div>
                <p style={{ fontFamily: C.display, fontSize: 24, fontWeight: 300, color: C.black }}>{selectedLead.name}</p>
                <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted, marginTop: 2 }}>Lead Profile</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Badge color={selectedLead.intent?.toLowerCase()}>{selectedLead.intent}</Badge>
                <button onClick={() => setSelectedLead(null)} style={{ width: 32, height: 32, border: `1px solid ${C.midCream}`, borderRadius: '50%', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>
                  <X size={14} />
                </button>
              </div>
            </div>

            <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              {/* Contact */}
              <div>
                <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Contact Details</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[[User, selectedLead.name], [Mail, selectedLead.email], [Phone, selectedLead.phone]].map(([Icon, val], i) => val && (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, border: `1px solid ${C.midCream}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={13} style={{ color: C.gold }} />
                      </div>
                      <span style={{ fontFamily: C.body, fontSize: 13, color: C.black }}>{val}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 24, padding: '16px', backgroundColor: C.cream }}>
                  <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>Source</p>
                  <p style={{ fontFamily: C.body, fontSize: 13, color: C.black }}>{selectedLead.source}</p>
                </div>
                <div style={{ marginTop: 8, padding: '16px', backgroundColor: C.cream }}>
                  <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>Date Added</p>
                  <p style={{ fontFamily: C.body, fontSize: 13, color: C.black }}>{new Date(selectedLead.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Notes</p>
                <div style={{ backgroundColor: C.cream, padding: 16, minHeight: 140, maxHeight: 180, overflowY: 'auto', marginBottom: 12 }}>
                  {selectedLead.notes?.length > 0
                    ? selectedLead.notes.map((n, i) => (
                        <div key={i} style={{ padding: '10px 0', borderBottom: i < selectedLead.notes.length - 1 ? `1px solid ${C.midCream}` : 'none' }}>
                          <p style={{ fontFamily: C.body, fontSize: 13, color: C.black, lineHeight: 1.6 }}>{n.text}</p>
                        </div>
                      ))
                    : <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, fontStyle: 'italic' }}>No notes yet.</p>
                  }
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    placeholder="Add a note..."
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddNote(selectedLead._id)}
                    style={{ flex: 1, padding: '10px 14px', border: `1px solid ${focusedNote ? C.black : C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, transition: 'border-color 0.2s' }}
                    onFocus={() => setFocusedNote(true)} onBlur={() => setFocusedNote(false)}
                  />
                  <button
                    onClick={() => handleAddNote(selectedLead._id)}
                    style={{ backgroundColor: C.black, color: C.white, border: 'none', padding: '10px 20px', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0 }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;