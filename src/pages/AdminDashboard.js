import React, { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  X, User, Mail, Phone, Bell,
  BarChart3, Users, Home, Settings,
  LogOut, Plus, Edit, Trash2,
  Save, ChevronLeft, ChevronRight,
  Eye,
  FileText, Megaphone, PieChart, ToggleLeft, ToggleRight,
  Globe, Image as ImageIcon, Type, Check, AlertTriangle
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
  <div style={{ backgroundColor: C.white, padding: '28px 32px', border: `1px solid ${C.midCream}`, borderBottomColor: accent, borderBottomWidth: 3 }}>
    <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, marginBottom: 12 }}>{label}</p>
    <p style={{ fontFamily: C.display, fontSize: 44, fontWeight: 300, color: C.black, lineHeight: 1, marginBottom: 6 }}>{value}</p>
    {sub && <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted }}>{sub}</p>}
  </div>
);

const PROPERTY_TYPES = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Land', 'Commercial', 'Investment'];
const STATUS_OPTIONS = ['Active', 'Pending', 'Sold', 'FOR SALE'];

const emptyPropertyForm = {
  mlsId: '', title: '', address: '', city: '', state: 'CO', zip: '',
  price: '', beds: '', baths: '', sqft: '', yearBuilt: '', garageSpaces: '',
  propertyType: 'Single Family', description: '', images: '',
  virtualTourUrl: '', status: 'Active', featured: false,
};

const fieldStyle = {
  width: '100%', padding: '12px 0', border: 'none',
  borderBottom: '1px solid #ede9e3', outline: 'none',
  fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#0a0a0a',
  backgroundColor: 'transparent', boxSizing: 'border-box',
};

const labelStyle = {
  fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.15em',
  textTransform: 'uppercase', color: '#8a8078', display: 'block', marginBottom: 8,
};

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ── Core data ──
  const [leads, setLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLead, setSelectedLead] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [focusedNote, setFocusedNote] = useState(false);
  const [behaviorAnalytics, setBehaviorAnalytics] = useState(null);

  // ── Property CRUD ──
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [propertyForm, setPropertyForm] = useState(emptyPropertyForm);
  const [propSaving, setPropSaving] = useState(false);
  const [propError, setPropError] = useState('');
  const [confirmDeleteProp, setConfirmDeleteProp] = useState(null);

  // ── Lead actions ──
  const [leadFilter, setLeadFilter] = useState('all');
  const [confirmDeleteLead, setConfirmDeleteLead] = useState(null);

  // ── CMS ──
  const [cmsData, setCmsData] = useState({ heroTitle: '', heroSubtitle: '', agentName: 'Alan Ramirez', bioText: '' });
  const [cmsSaving, setCmsSaving] = useState(false);
  const [cmsSaved, setCmsSaved] = useState(false);

  // ── Marketing ──
  const [popupTitle, setPopupTitle] = useState('Get Your Free Home Valuation');
  const [popupSubtitle, setPopupSubtitle] = useState('Find out what your property is worth today');
  const [popupCtaText, setPopupCtaText] = useState('Get My Valuation');
  const [popupCtaLink, setPopupCtaLink] = useState('/valuation');
  const [popupDelay, setPopupDelay] = useState(5);
  const [exitIntentEnabled, setExitIntentEnabled] = useState(true);
  const [timedPopupEnabled, setTimedPopupEnabled] = useState(true);
  const [scrollTriggerEnabled, setScrollTriggerEnabled] = useState(false);
  const [marketingSaving, setMarketingSaving] = useState(false);
  const [marketingSaved, setMarketingSaved] = useState(false);

  // ── Settings ──
  const [settingsProfile, setSettingsProfile] = useState({ name: 'Alan Ramirez', email: 'AmRamz79@gmail.com', phone: '(773) 818-0444', license: 'FA100104608' });
  const [gaId, setGaId] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => { fetchData(); fetchAnalytics(); fetchSettings(); }, []);
  useEffect(() => { if (activeTab === 'analytics') fetchAnalytics(); }, [activeTab]);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get('/behavior/analytics/summary');
      setBehaviorAnalytics(res.data);
    } catch {
      setBehaviorAnalytics(null);
    }
  };

  const fetchData = async () => {
    try {
      const leadsRes = await API.get('/leads');
      setLeads(leadsRes.data);
    } catch { setLeads([]); }
    try {
      const propsRes = await API.get('/properties');
      setProperties(propsRes.data?.properties || propsRes.data || []);
    } catch { setProperties([]); }
  };

  const fetchSettings = async () => {
    try {
      const res = await API.get('/settings');
      const s = res.data;
      setCmsData({
        heroTitle: s.heroTitle || '',
        heroSubtitle: s.heroSubtitle || '',
        agentName: s.agentName || 'Alan Ramirez',
        bioText: s.bioText || '',
      });
      if (s.popupTitle) setPopupTitle(s.popupTitle);
      if (s.popupSubtitle) setPopupSubtitle(s.popupSubtitle);
      if (s.popupCtaText) setPopupCtaText(s.popupCtaText);
      if (s.popupCtaLink) setPopupCtaLink(s.popupCtaLink);
      if (s.popupDelay) setPopupDelay(Number(s.popupDelay));
      if (s.exitIntentEnabled !== undefined) setExitIntentEnabled(s.exitIntentEnabled === 'true' || s.exitIntentEnabled === true);
      if (s.timedPopupEnabled !== undefined) setTimedPopupEnabled(s.timedPopupEnabled === 'true' || s.timedPopupEnabled === true);
      if (s.scrollTriggerEnabled !== undefined) setScrollTriggerEnabled(s.scrollTriggerEnabled === 'true' || s.scrollTriggerEnabled === true);
      if (s.gaId) setGaId(s.gaId);
      if (s.metaDesc) setMetaDesc(s.metaDesc);
      if (s.adminName) setSettingsProfile(prev => ({ ...prev, name: s.adminName }));
      if (s.adminEmail) setSettingsProfile(prev => ({ ...prev, email: s.adminEmail }));
      if (s.adminPhone) setSettingsProfile(prev => ({ ...prev, phone: s.adminPhone }));
      if (s.adminLicense) setSettingsProfile(prev => ({ ...prev, license: s.adminLicense }));
    } catch {}
  };

  // ── Notes ──
  const handleAddNote = async (leadId) => {
    if (!noteText.trim()) return;
    try {
      await API.post(`/leads/note/${leadId}`, { text: noteText });
    } catch {}
    const newNote = { text: noteText, createdAt: new Date().toISOString() };
    setLeads(prev => prev.map(l => l._id === leadId ? { ...l, notes: [...(l.notes || []), newNote] } : l));
    if (selectedLead?._id === leadId) setSelectedLead(prev => ({ ...prev, notes: [...(prev.notes || []), newNote] }));
    setNoteText('');
  };

  // ── Property CRUD ──
  const openAddProperty = () => {
    setEditingProperty(null);
    setPropertyForm(emptyPropertyForm);
    setPropError('');
    setShowPropertyModal(true);
  };

  const openEditProperty = (prop) => {
    setEditingProperty(prop);
    setPropertyForm({
      mlsId: prop.mlsId || '',
      title: prop.title || '',
      address: prop.address || '',
      city: prop.city || '',
      state: prop.state || 'CO',
      zip: prop.zip || '',
      price: prop.price || '',
      beds: prop.beds || '',
      baths: prop.baths || '',
      sqft: prop.sqft || '',
      yearBuilt: prop.yearBuilt || '',
      garageSpaces: prop.garageSpaces || '',
      propertyType: prop.propertyType || 'Single Family',
      description: prop.description || '',
      images: (prop.images || []).join(', '),
      virtualTourUrl: prop.virtualTourUrl || '',
      status: prop.status || 'Active',
      featured: prop.featured || false,
    });
    setPropError('');
    setShowPropertyModal(true);
  };

  const handleSaveProperty = async () => {
    if (!propertyForm.mlsId || !propertyForm.address || !propertyForm.price) {
      setPropError('MLS ID, Address, and Price are required.');
      return;
    }
    setPropSaving(true);
    setPropError('');
    try {
      const payload = {
        ...propertyForm,
        price: Number(propertyForm.price),
        beds: propertyForm.beds !== '' ? Number(propertyForm.beds) : undefined,
        baths: propertyForm.baths !== '' ? Number(propertyForm.baths) : undefined,
        sqft: propertyForm.sqft !== '' ? Number(propertyForm.sqft) : undefined,
        yearBuilt: propertyForm.yearBuilt !== '' ? Number(propertyForm.yearBuilt) : undefined,
        garageSpaces: propertyForm.garageSpaces !== '' ? Number(propertyForm.garageSpaces) : undefined,
        images: propertyForm.images ? propertyForm.images.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      if (editingProperty) {
        const res = await API.put(`/properties/${editingProperty._id}`, payload);
        setProperties(prev => prev.map(p => p._id === editingProperty._id ? res.data : p));
      } else {
        const res = await API.post('/properties', payload);
        setProperties(prev => [res.data, ...prev]);
      }
      setShowPropertyModal(false);
    } catch (err) {
      setPropError(err.response?.data?.msg || err.response?.data?.error || 'Failed to save property.');
    } finally {
      setPropSaving(false);
    }
  };

  const handleDeleteProperty = async (id) => {
    try {
      await API.delete(`/properties/${id}`);
      setProperties(prev => prev.filter(p => p._id !== id));
    } catch {}
    setConfirmDeleteProp(null);
  };

  // ── Lead delete ──
  const handleDeleteLead = async (id) => {
    try {
      await API.delete(`/leads/${id}`);
      setLeads(prev => prev.filter(l => l._id !== id));
      if (selectedLead?._id === id) setSelectedLead(null);
    } catch {}
    setConfirmDeleteLead(null);
  };

  // ── CMS Save ──
  const handleSaveCms = async (section) => {
    setCmsSaving(true);
    setCmsSaved(false);
    try {
      if (section === 'hero') {
        await Promise.all([
          API.put('/settings/heroTitle', { value: cmsData.heroTitle }),
          API.put('/settings/heroSubtitle', { value: cmsData.heroSubtitle }),
        ]);
      } else if (section === 'about') {
        await Promise.all([
          API.put('/settings/agentName', { value: cmsData.agentName }),
          API.put('/settings/bioText', { value: cmsData.bioText }),
        ]);
      }
      setCmsSaved(true);
      setTimeout(() => setCmsSaved(false), 3000);
    } catch {}
    setCmsSaving(false);
  };

  // ── Marketing Save ──
  const handleSaveMarketing = async () => {
    setMarketingSaving(true);
    setMarketingSaved(false);
    try {
      await Promise.all([
        API.put('/settings/popupTitle', { value: popupTitle }),
        API.put('/settings/popupSubtitle', { value: popupSubtitle }),
        API.put('/settings/popupCtaText', { value: popupCtaText }),
        API.put('/settings/popupCtaLink', { value: popupCtaLink }),
        API.put('/settings/popupDelay', { value: String(popupDelay) }),
        API.put('/settings/exitIntentEnabled', { value: String(exitIntentEnabled) }),
        API.put('/settings/timedPopupEnabled', { value: String(timedPopupEnabled) }),
        API.put('/settings/scrollTriggerEnabled', { value: String(scrollTriggerEnabled) }),
      ]);
      setMarketingSaved(true);
      setTimeout(() => setMarketingSaved(false), 3000);
    } catch {}
    setMarketingSaving(false);
  };

  // ── Settings Save ──
  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    setSettingsSaved(false);
    try {
      await Promise.all([
        API.put('/settings/adminName', { value: settingsProfile.name }),
        API.put('/settings/adminEmail', { value: settingsProfile.email }),
        API.put('/settings/adminPhone', { value: settingsProfile.phone }),
        API.put('/settings/adminLicense', { value: settingsProfile.license }),
        API.put('/settings/gaId', { value: gaId }),
        API.put('/settings/metaDesc', { value: metaDesc }),
      ]);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch {}
    setSettingsSaving(false);
  };

  const filteredLeads = leadFilter === 'all' ? leads
    : leadFilter === 'buyer' ? leads.filter(l => l.intent === 'Buyer')
    : leads.filter(l => l.intent === 'Seller');

  const stats = [
    { label: 'Total Leads', value: leads.length, sub: 'All time', accent: C.gold },
    { label: 'Buyer Leads', value: leads.filter(l => l.intent === 'Buyer').length, sub: 'Active prospects', accent: '#3b82f6' },
    { label: 'Seller Leads', value: leads.filter(l => l.intent === 'Seller').length, sub: 'Active prospects', accent: '#10b981' },
    { label: 'Site Visitors', value: behaviorAnalytics?.uniqueSessions?.toLocaleString() || '0', sub: 'Unique sessions', accent: '#8b5cf6' },
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

  const SaveBtn = ({ onClick, saving, saved, label = 'Save', savedLabel = 'Saved!' }) => (
    <button onClick={onClick} disabled={saving}
      style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: saved ? '#10b981' : C.black, color: C.white, border: 'none', padding: '12px 24px', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: saving ? 0.7 : 1, transition: 'background-color 0.3s' }}>
      {saved ? <><Check size={14} /> {savedLabel}</> : <><Save size={14} /> {saving ? 'Saving...' : label}</>}
    </button>
  );

  return (
    <div style={{ fontFamily: C.body, minHeight: '100vh', display: 'flex', backgroundColor: C.cream }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: sidebarOpen ? 260 : 72, backgroundColor: C.sidebar, display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease', flexShrink: 0, position: 'relative', zIndex: 20 }}>
        <div style={{ padding: '28px 20px 24px', borderBottom: `1px solid ${C.sidebarBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 80 }}>
          {sidebarOpen && (
            <Link to="/" style={{ textDecoration: 'none' }}>
              <p style={{ fontFamily: C.display, fontSize: 16, fontWeight: 400, letterSpacing: '0.1em', color: C.white, lineHeight: 1 }}>CHF</p>
              <p style={{ fontFamily: C.body, fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.gold, marginTop: 3 }}>Admin</p>
            </Link>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ width: 32, height: 32, border: `1px solid ${C.sidebarBorder}`, borderRadius: '50%', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', flexShrink: 0, marginLeft: sidebarOpen ? 0 : 'auto', marginRight: sidebarOpen ? 0 : 'auto' }}>
            {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} title={!sidebarOpen ? item.label : undefined}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', marginBottom: 4, justifyContent: sidebarOpen ? 'flex-start' : 'center', transition: 'all 0.15s', backgroundColor: activeTab === item.id ? C.gold : 'transparent', color: activeTab === item.id ? C.white : 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => { if (activeTab !== item.id) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { if (activeTab !== item.id) e.currentTarget.style.backgroundColor = 'transparent'; }}>
              <item.icon size={18} style={{ flexShrink: 0 }} />
              {sidebarOpen && <span style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: '12px', borderTop: `1px solid ${C.sidebarBorder}` }}>
          <button onClick={() => { logout(); navigate('/admin/login'); }} title={!sidebarOpen ? 'Logout' : undefined}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.3)', justifyContent: sidebarOpen ? 'flex-start' : 'center', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#f87171'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}>
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span style={{ fontFamily: C.body, fontSize: 12, letterSpacing: '0.08em' }}>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.midCream}`, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', flexShrink: 0 }}>
          <p style={{ fontFamily: C.display, fontSize: 20, fontWeight: 300, color: C.black, lineHeight: 1 }}>
            {navItems.find(n => n.id === activeTab)?.label}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button style={{ position: 'relative', width: 36, height: 36, border: `1px solid ${C.midCream}`, borderRadius: '50%', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>
              <Bell size={16} />
              {leads.length > 0 && <span style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, backgroundColor: '#ef4444', borderRadius: '50%' }} />}
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 20 }}>
                {stats.map((s, i) => <StatCard key={i} {...s} />)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
                {[
                  { label: 'Page Views', value: behaviorAnalytics?.byEventType?.find(e => e._id === 'PAGE_VIEW')?.count || 0, sub: 'All time', accent: '#06b6d4' },
                  { label: 'Property Views', value: behaviorAnalytics?.byEventType?.find(e => e._id === 'PROPERTY_VIEW')?.count || 0, sub: 'Listing impressions', accent: '#f97316' },
                  { label: 'Form Submissions', value: behaviorAnalytics?.byEventType?.find(e => e._id === 'FORM_SUBMIT')?.count || 0, sub: 'Conversions', accent: '#10b981' },
                  { label: 'Active Listings', value: properties.length, sub: 'Published', accent: '#8b5cf6' },
                ].map((s, i) => <StatCard key={i} {...s} />)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}` }}>
                  <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.midCream}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontFamily: C.display, fontSize: 20, fontWeight: 300, color: C.black }}>Recent Leads</p>
                    <button onClick={() => setActiveTab('leads')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold }}>View All</button>
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
                    {leads.length === 0 && <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, padding: '24px', textAlign: 'center' }}>No leads yet.</p>}
                  </div>
                </div>

                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}` }}>
                  <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.midCream}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontFamily: C.display, fontSize: 20, fontWeight: 300, color: C.black }}>Active Listings</p>
                    <button onClick={() => setActiveTab('properties')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold }}>Manage</button>
                  </div>
                  <div>
                    {properties.slice(0, 4).map((prop, i) => (
                      <div key={prop._id} style={{ padding: '14px 24px', borderBottom: i < 3 ? `1px solid ${C.midCream}` : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <img src={prop.images?.[0] || '/devner metro at its best.jpg'} alt="" style={{ width: 52, height: 40, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: C.body, fontSize: 13, fontWeight: 500, color: C.black, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prop.address}</p>
                          <p style={{ fontFamily: C.display, fontSize: 16, color: C.black }}>${prop.price?.toLocaleString()}</p>
                        </div>
                        <Badge color="seller">{prop.status}</Badge>
                      </div>
                    ))}
                    {properties.length === 0 && (
                      <div style={{ padding: '24px', textAlign: 'center' }}>
                        <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, marginBottom: 12 }}>No listings yet.</p>
                        <button onClick={openAddProperty} style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add First Property</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, marginTop: 24 }}>
                <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.midCream}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontFamily: C.display, fontSize: 20, fontWeight: 300, color: C.black }}>Top Pages This Period</p>
                  <button onClick={() => setActiveTab('analytics')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold }}>Full Analytics</button>
                </div>
                <div style={{ padding: '8px 24px' }}>
                  {behaviorAnalytics?.topPages?.length > 0 ? behaviorAnalytics.topPages.slice(0, 5).map((page, i) => {
                    const maxCount = behaviorAnalytics.topPages[0]?.count || 1;
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < Math.min(behaviorAnalytics.topPages.length, 5) - 1 ? `1px solid ${C.midCream}` : 'none' }}>
                        <span style={{ fontFamily: C.display, fontSize: 18, fontWeight: 300, color: C.muted, width: 24, textAlign: 'center' }}>{i + 1}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: C.body, fontSize: 12, color: C.black, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{page._id || '/'}</p>
                          <div style={{ width: '100%', height: 4, backgroundColor: C.cream, borderRadius: 2 }}>
                            <div style={{ width: `${Math.round((page.count / maxCount) * 100)}%`, height: '100%', backgroundColor: C.gold, borderRadius: 2 }} />
                          </div>
                        </div>
                        <span style={{ fontFamily: C.body, fontSize: 12, fontWeight: 500, color: C.black, minWidth: 40, textAlign: 'right' }}>{page.count}</span>
                      </div>
                    );
                  }) : <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, padding: '20px 0' }}>No visitor data yet.</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── LEADS ── */}
          {activeTab === 'leads' && (
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {[['all', 'All Leads', leads.length], ['buyer', 'Buyers', leads.filter(l => l.intent === 'Buyer').length], ['seller', 'Sellers', leads.filter(l => l.intent === 'Seller').length]].map(([val, label, count]) => (
                  <button key={val} onClick={() => setLeadFilter(val)}
                    style={{ padding: '8px 20px', border: `1px solid ${leadFilter === val ? C.black : C.midCream}`, backgroundColor: leadFilter === val ? C.black : 'transparent', color: leadFilter === val ? C.white : C.muted, cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    {label}
                    <span style={{ backgroundColor: leadFilter === val ? 'rgba(255,255,255,0.18)' : C.cream, color: leadFilter === val ? C.white : C.black, padding: '2px 8px', borderRadius: 20, fontSize: 10 }}>{count}</span>
                  </button>
                ))}
              </div>
              <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.midCream}` }}>
                  <p style={{ fontFamily: C.display, fontSize: 22, fontWeight: 300, color: C.black }}>Lead Inbox</p>
                  <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted, marginTop: 2 }}>{filteredLeads.length} leads</p>
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
                      {filteredLeads.map(lead => (
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
                          <td style={{ padding: '16px 24px' }}><Badge color={lead.intent?.toLowerCase()}>{lead.intent}</Badge></td>
                          <td style={{ padding: '16px 24px' }}><span style={{ fontFamily: C.body, fontSize: 12, color: C.muted }}>{lead.source}</span></td>
                          <td style={{ padding: '16px 24px' }}><span style={{ fontFamily: C.body, fontSize: 12, color: C.muted }}>{new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></td>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <button onClick={() => setSelectedLead(lead)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.black, display: 'inline-flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${C.black}`, paddingBottom: 2 }}>
                                <Eye size={13} /> View
                              </button>
                              <button onClick={() => setConfirmDeleteLead(lead._id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', padding: 4 }}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredLeads.length === 0 && <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, padding: '32px', textAlign: 'center' }}>No leads found.</p>}
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
                <button onClick={openAddProperty}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: C.black, color: C.white, border: 'none', padding: '12px 24px', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  <Plus size={15} /> Add Property
                </button>
              </div>

              {properties.length === 0 ? (
                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: '64px 32px', textAlign: 'center' }}>
                  <Home size={48} style={{ color: C.midCream, margin: '0 auto 16px' }} />
                  <p style={{ fontFamily: C.display, fontSize: 24, fontWeight: 300, color: C.black, marginBottom: 8 }}>No Properties Yet</p>
                  <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, marginBottom: 24 }}>Add your first property listing to get started.</p>
                  <button onClick={openAddProperty}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: C.black, color: C.white, border: 'none', padding: '12px 28px', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    <Plus size={14} /> Add First Property
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                  {properties.map(prop => (
                    <div key={prop._id} style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, overflow: 'hidden' }}>
                      <div style={{ position: 'relative', height: 200 }}>
                        <img src={prop.images?.[0] || '/devner metro at its best.jpg'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <div style={{ position: 'absolute', top: 12, left: 12 }}>
                          <Badge color="seller">{prop.status}</Badge>
                        </div>
                        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
                          <button onClick={() => openEditProperty(prop)}
                            style={{ width: 32, height: 32, backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.black, borderRadius: 4 }}>
                            <Edit size={14} />
                          </button>
                          <button onClick={() => setConfirmDeleteProp(prop._id)}
                            style={{ width: 32, height: 32, backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', borderRadius: 4 }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                        {prop.featured && (
                          <div style={{ position: 'absolute', bottom: 12, left: 12, backgroundColor: C.gold, color: C.white, fontFamily: C.body, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20 }}>Featured</div>
                        )}
                      </div>
                      <div style={{ padding: '20px 24px' }}>
                        <p style={{ fontFamily: C.body, fontSize: 13, fontWeight: 500, color: C.black, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prop.address}</p>
                        <p style={{ fontFamily: C.display, fontSize: 24, fontWeight: 300, color: C.black, marginBottom: 8 }}>${prop.price?.toLocaleString()}</p>
                        <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted }}>{prop.beds} Beds · {prop.baths} Baths · {prop.sqft?.toLocaleString()} Sq.Ft.</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── CMS ── */}
          {activeTab === 'cms' && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: C.display, fontSize: 22, fontWeight: 300, color: C.black }}>Content Management</p>
                <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted, marginTop: 2 }}>Edit homepage content and about page bio</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${C.midCream}` }}>
                    <Globe size={16} style={{ color: C.gold }} />
                    <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black }}>Homepage Hero</p>
                  </div>
                  {[
                    { label: 'Hero Title', key: 'heroTitle', placeholder: 'Find Your Perfect Colorado Home' },
                    { label: 'Hero Subtitle', key: 'heroSubtitle', placeholder: "Denver Metro's Trusted Real Estate Team" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key} style={{ marginBottom: 20 }}>
                      <label style={labelStyle}>{label}</label>
                      <input type="text" value={cmsData[key]} placeholder={placeholder}
                        onChange={e => setCmsData(prev => ({ ...prev, [key]: e.target.value }))}
                        style={fieldStyle} />
                    </div>
                  ))}
                  <SaveBtn onClick={() => handleSaveCms('hero')} saving={cmsSaving} saved={cmsSaved} />
                </div>
                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${C.midCream}` }}>
                    <Type size={16} style={{ color: C.gold }} />
                    <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black }}>About Page</p>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Agent Name</label>
                    <input type="text" value={cmsData.agentName}
                      onChange={e => setCmsData(prev => ({ ...prev, agentName: e.target.value }))}
                      style={fieldStyle} />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Bio Text</label>
                    <textarea rows={7} value={cmsData.bioText} placeholder="Describe Alan's background, experience, and specialties..."
                      onChange={e => setCmsData(prev => ({ ...prev, bioText: e.target.value }))}
                      style={{ ...fieldStyle, resize: 'none' }} />
                  </div>
                  <SaveBtn onClick={() => handleSaveCms('about')} saving={cmsSaving} saved={cmsSaved} />
                </div>
              </div>
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
                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${C.midCream}` }}>
                    <Megaphone size={16} style={{ color: C.gold }} />
                    <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black }}>Popup Settings</p>
                  </div>
                  {[
                    ['Popup Title', popupTitle, setPopupTitle],
                    ['Popup Subtitle', popupSubtitle, setPopupSubtitle],
                    ['CTA Button Text', popupCtaText, setPopupCtaText],
                    ['CTA Link', popupCtaLink, setPopupCtaLink],
                  ].map(([label, value, setter]) => (
                    <div key={label} style={{ marginBottom: 20 }}>
                      <label style={labelStyle}>{label}</label>
                      <input type="text" value={value} onChange={e => setter(e.target.value)} style={fieldStyle} />
                    </div>
                  ))}
                  <div style={{ marginBottom: 24 }}>
                    <label style={labelStyle}>Delay (seconds)</label>
                    <input type="number" value={popupDelay} min={0} max={120}
                      onChange={e => setPopupDelay(Number(e.target.value))}
                      style={{ ...fieldStyle, width: 120 }} />
                  </div>
                  <SaveBtn onClick={handleSaveMarketing} saving={marketingSaving} saved={marketingSaved} label="Save Popup" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: 32 }}>
                    <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black, marginBottom: 24 }}>Triggers</p>
                    {[
                      { label: 'Exit Intent Popup', desc: 'Show when user moves to close/leave', value: exitIntentEnabled, setter: setExitIntentEnabled },
                      { label: 'Timed Popup', desc: 'Show after delay on page load', value: timedPopupEnabled, setter: setTimedPopupEnabled },
                      { label: 'Scroll Trigger', desc: 'Show after 50% page scroll', value: scrollTriggerEnabled, setter: setScrollTriggerEnabled },
                    ].map((toggle, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < 2 ? `1px solid ${C.midCream}` : 'none' }}>
                        <div>
                          <p style={{ fontFamily: C.body, fontSize: 13, color: C.black }}>{toggle.label}</p>
                          <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted, marginTop: 2 }}>{toggle.desc}</p>
                        </div>
                        <button onClick={() => toggle.setter(!toggle.value)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                          {toggle.value ? <ToggleRight size={28} style={{ color: C.gold }} /> : <ToggleLeft size={28} style={{ color: C.muted }} />}
                        </button>
                      </div>
                    ))}
                    <button onClick={handleSaveMarketing} disabled={marketingSaving}
                      style={{ marginTop: 20, width: '100%', padding: '10px', backgroundColor: marketingSaved ? '#10b981' : C.black, color: C.white, border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background-color 0.3s' }}>
                      {marketingSaved ? <><Check size={12} /> Saved!</> : 'Save Triggers'}
                    </button>
                  </div>

                  <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: 32 }}>
                    <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black, marginBottom: 24 }}>Form Routing</p>
                    {[
                      { source: 'Contact Form', dest: 'FUB + Email' },
                      { source: 'Valuation Form', dest: 'FUB + Email' },
                      { source: 'Cash Offer Form', dest: 'FUB + Email' },
                      { source: 'Buyer Form', dest: 'FUB + Email' },
                    ].map((route, i, arr) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.midCream}` : 'none' }}>
                        <span style={{ fontFamily: C.body, fontSize: 12, color: C.black }}>{route.source}</span>
                        <span style={{ fontFamily: C.body, fontSize: 11, color: C.gold, letterSpacing: '0.08em' }}>{route.dest}</span>
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
                <p style={{ fontFamily: C.display, fontSize: 22, fontWeight: 300, color: C.black }}>Analytics & Behavior Tracking</p>
                <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted, marginTop: 2 }}>Real-time visitor behavior, property popularity, and conversion insights</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
                {[
                  { label: 'Total Events', value: behaviorAnalytics?.totalEvents?.toLocaleString() || '—', sub: 'All time tracked', accent: C.gold },
                  { label: 'Last 30 Days', value: behaviorAnalytics?.last30Days?.toLocaleString() || '—', sub: 'Recent events', accent: '#3b82f6' },
                  { label: 'Last 7 Days', value: behaviorAnalytics?.last7Days?.toLocaleString() || '—', sub: 'This week', accent: '#10b981' },
                  { label: 'Unique Sessions', value: behaviorAnalytics?.uniqueSessions?.toLocaleString() || '—', sub: 'Unique visitors', accent: '#8b5cf6' },
                ].map((s, i) => <StatCard key={i} {...s} />)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: 32 }}>
                  <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black, marginBottom: 24 }}>Event Type Breakdown</p>
                  {behaviorAnalytics?.byEventType?.length > 0 ? behaviorAnalytics.byEventType.map((evt, i) => {
                    const total = behaviorAnalytics.totalEvents || 1;
                    const pct = Math.round((evt.count / total) * 100);
                    const colors = ['#3b82f6', C.gold, '#10b981', '#8b5cf6', '#ef4444', '#f97316', '#06b6d4'];
                    return (
                      <div key={i} style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontFamily: C.body, fontSize: 12, color: C.black }}>{evt._id}</span>
                          <span style={{ fontFamily: C.body, fontSize: 12, color: C.muted }}>{evt.count} ({pct}%)</span>
                        </div>
                        <div style={{ width: '100%', height: 6, backgroundColor: C.cream, borderRadius: 3 }}>
                          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: colors[i % colors.length], borderRadius: 3 }} />
                        </div>
                      </div>
                    );
                  }) : <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted }}>No behavior data yet. Events will appear as visitors interact with the site.</p>}
                </div>
                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: 32 }}>
                  <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black, marginBottom: 24 }}>Top Pages Visited</p>
                  {behaviorAnalytics?.topPages?.length > 0 ? behaviorAnalytics.topPages.map((page, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < behaviorAnalytics.topPages.length - 1 ? `1px solid ${C.midCream}` : 'none' }}>
                      <span style={{ fontFamily: C.display, fontSize: 20, fontWeight: 300, color: C.muted, width: 28 }}>{i + 1}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: C.body, fontSize: 12, color: C.black, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{page._id || 'Unknown'}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Eye size={12} style={{ color: C.muted }} />
                        <span style={{ fontFamily: C.body, fontSize: 11, color: C.muted }}>{page.count}</span>
                      </div>
                    </div>
                  )) : <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted }}>No page view data yet.</p>}
                </div>
              </div>
              <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: 32 }}>
                <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black, marginBottom: 24 }}>Most Viewed Properties</p>
                {behaviorAnalytics?.topProperties?.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: C.cream }}>
                        {['#', 'Property ID', 'Views'].map(h => (
                          <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, fontWeight: 500 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {behaviorAnalytics.topProperties.map((prop, i) => (
                        <tr key={i} style={{ borderTop: `1px solid ${C.midCream}` }}>
                          <td style={{ padding: '14px 20px', fontFamily: C.display, fontSize: 18, color: C.muted }}>{i + 1}</td>
                          <td style={{ padding: '14px 20px', fontFamily: C.body, fontSize: 13, color: C.black }}>{prop._id}</td>
                          <td style={{ padding: '14px 20px', fontFamily: C.body, fontSize: 13, fontWeight: 500, color: C.black }}>{prop.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted }}>No property view data yet.</p>}
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeTab === 'settings' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${C.midCream}` }}>
                    <User size={16} style={{ color: C.gold }} />
                    <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black }}>Profile Information</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                    {[
                      { label: 'Full Name', type: 'text', key: 'name' },
                      { label: 'Email', type: 'email', key: 'email' },
                      { label: 'Phone', type: 'tel', key: 'phone' },
                      { label: 'License #', type: 'text', key: 'license' },
                    ].map(({ label, type, key }) => (
                      <div key={key}>
                        <label style={labelStyle}>{label}</label>
                        <input type={type} value={settingsProfile[key]}
                          onChange={e => setSettingsProfile(prev => ({ ...prev, [key]: e.target.value }))}
                          style={fieldStyle} />
                      </div>
                    ))}
                  </div>
                  <SaveBtn onClick={handleSaveSettings} saving={settingsSaving} saved={settingsSaved} label="Save Changes" />
                </div>

                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${C.midCream}` }}>
                    <Settings size={16} style={{ color: C.gold }} />
                    <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black }}>Site Configuration</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 24 }}>
                    <div>
                      <label style={labelStyle}>Google Analytics ID</label>
                      <input type="text" value={gaId} placeholder="G-XXXXXXXXXX"
                        onChange={e => setGaId(e.target.value)} style={fieldStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Meta Description</label>
                      <textarea rows={3} value={metaDesc} placeholder="Alan Ramirez — Colorado Home Finder LLC..."
                        onChange={e => setMetaDesc(e.target.value)}
                        style={{ ...fieldStyle, resize: 'none' }} />
                    </div>
                  </div>
                  <SaveBtn onClick={handleSaveSettings} saving={settingsSaving} saved={settingsSaved} label="Save Changes" />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: '32px' }}>
                  <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black, marginBottom: 24 }}>Branding</p>
                  {[['Primary Color', '#1B2A4A', 'Navy #1B2A4A'], ['Accent Color', C.gold, 'Tan #C4956A']].map(([label, color, hex]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${C.midCream}` }}>
                      <div>
                        <span style={{ fontFamily: C.body, fontSize: 12, color: C.muted }}>{label}</span>
                        <p style={{ fontFamily: C.body, fontSize: 10, color: C.muted, marginTop: 2 }}>{hex}</p>
                      </div>
                      <div style={{ width: 28, height: 28, backgroundColor: color, border: `1px solid ${C.midCream}` }} />
                    </div>
                  ))}
                </div>

                <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', padding: '28px' }}>
                  <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#be123c', marginBottom: 8 }}>Danger Zone</p>
                  <p style={{ fontFamily: C.body, fontSize: 12, color: '#e11d48', lineHeight: 1.6, marginBottom: 20 }}>Clear cache or reset settings. This cannot be undone.</p>
                  <button
                    style={{ width: '100%', padding: '11px', border: '1px solid #f87171', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'all 0.2s' }}
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

      {/* ── Lead Detail Modal ── */}
      {selectedLead && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(10,10,10,0.6)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}
          onClick={() => setSelectedLead(null)}>
          <div style={{ backgroundColor: C.white, width: '100%', maxWidth: 720, maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
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
                <div style={{ marginTop: 16, padding: '16px', backgroundColor: C.cream }}>
                  <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>Source</p>
                  <p style={{ fontFamily: C.body, fontSize: 13, color: C.black }}>{selectedLead.source}</p>
                </div>
                <div style={{ marginTop: 8, padding: '16px', backgroundColor: C.cream }}>
                  <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>Date Added</p>
                  <p style={{ fontFamily: C.body, fontSize: 13, color: C.black }}>{new Date(selectedLead.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                {selectedLead.buyerCriteria && Object.values(selectedLead.buyerCriteria).some(v => v) && (
                  <div style={{ marginTop: 8, padding: '16px', backgroundColor: C.cream }}>
                    <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, marginBottom: 10 }}>Buyer Criteria</p>
                    {[
                      ['Beds', selectedLead.buyerCriteria.beds],
                      ['Baths', selectedLead.buyerCriteria.baths],
                      ['Price Range', selectedLead.buyerCriteria.priceRange],
                      ['Area', selectedLead.buyerCriteria.area],
                      ['Current Address', selectedLead.buyerCriteria.currentAddress],
                    ].filter(([, v]) => v).map(([lbl, val]) => (
                      <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${C.midCream}` }}>
                        <span style={{ fontFamily: C.body, fontSize: 11, color: C.muted }}>{lbl}</span>
                        <span style={{ fontFamily: C.body, fontSize: 12, color: C.black }}>{val}</span>
                      </div>
                    ))}
                  </div>
                )}
                {selectedLead.message && (
                  <div style={{ marginTop: 8, padding: '16px', backgroundColor: C.cream }}>
                    <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>Message</p>
                    <p style={{ fontFamily: C.body, fontSize: 13, color: C.black, lineHeight: 1.6 }}>{selectedLead.message}</p>
                  </div>
                )}
              </div>

              <div>
                <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, marginBottom: 16 }}>Notes</p>
                <div style={{ backgroundColor: C.cream, padding: 16, minHeight: 140, maxHeight: 200, overflowY: 'auto', marginBottom: 12 }}>
                  {selectedLead.notes?.length > 0
                    ? selectedLead.notes.map((n, i) => (
                        <div key={i} style={{ padding: '10px 0', borderBottom: i < selectedLead.notes.length - 1 ? `1px solid ${C.midCream}` : 'none' }}>
                          <p style={{ fontFamily: C.body, fontSize: 13, color: C.black, lineHeight: 1.6 }}>{n.text}</p>
                          {n.createdAt && <p style={{ fontFamily: C.body, fontSize: 10, color: C.muted, marginTop: 4 }}>{new Date(n.createdAt).toLocaleDateString()}</p>}
                        </div>
                      ))
                    : <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, fontStyle: 'italic' }}>No notes yet.</p>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input placeholder="Add a note..."
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddNote(selectedLead._id)}
                    style={{ flex: 1, padding: '10px 14px', border: `1px solid ${focusedNote ? C.black : C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 13, color: C.black, transition: 'border-color 0.2s' }}
                    onFocus={() => setFocusedNote(true)} onBlur={() => setFocusedNote(false)} />
                  <button onClick={() => handleAddNote(selectedLead._id)}
                    style={{ backgroundColor: C.black, color: C.white, border: 'none', padding: '10px 20px', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0 }}>
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Property Add / Edit Modal ── */}
      {showPropertyModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(10,10,10,0.65)', zIndex: 50, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowPropertyModal(false)}>
          <div style={{ backgroundColor: C.white, width: '100%', maxWidth: 800, marginBottom: 40 }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px 32px', borderBottom: `1px solid ${C.midCream}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: C.white, zIndex: 1 }}>
              <p style={{ fontFamily: C.display, fontSize: 22, fontWeight: 300, color: C.black }}>
                {editingProperty ? 'Edit Property' : 'Add New Property'}
              </p>
              <button onClick={() => setShowPropertyModal(false)} style={{ width: 32, height: 32, border: `1px solid ${C.midCream}`, borderRadius: '50%', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>
                <X size={14} />
              </button>
            </div>

            <div style={{ padding: '32px' }}>
              {propError && (
                <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
                  <p style={{ fontFamily: C.body, fontSize: 13, color: '#ef4444' }}>{propError}</p>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 24 }}>
                {[
                  { label: 'MLS ID *', key: 'mlsId', type: 'text' },
                  { label: 'Status', key: 'status', type: 'select', options: STATUS_OPTIONS },
                  { label: 'Property Type', key: 'propertyType', type: 'select', options: PROPERTY_TYPES },
                ].map(({ label, key, type, options }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    {type === 'select' ? (
                      <select value={propertyForm[key]} onChange={e => setPropertyForm(prev => ({ ...prev, [key]: e.target.value }))}
                        style={{ ...fieldStyle, cursor: 'pointer' }}>
                        {options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={type} value={propertyForm[key]} onChange={e => setPropertyForm(prev => ({ ...prev, [key]: e.target.value }))} style={fieldStyle} />
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Street Address *</label>
                <input type="text" value={propertyForm.address} placeholder="123 Main St"
                  onChange={e => setPropertyForm(prev => ({ ...prev, address: e.target.value }))} style={fieldStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 20, marginBottom: 24 }}>
                {[
                  { label: 'City', key: 'city', placeholder: 'Denver' },
                  { label: 'State', key: 'state', placeholder: 'CO' },
                  { label: 'Zip Code', key: 'zip', placeholder: '80203' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input type="text" value={propertyForm[key]} placeholder={placeholder}
                      onChange={e => setPropertyForm(prev => ({ ...prev, [key]: e.target.value }))} style={fieldStyle} />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
                {[
                  { label: 'Price *', key: 'price', placeholder: '450000' },
                  { label: 'Bedrooms', key: 'beds', placeholder: '3' },
                  { label: 'Bathrooms', key: 'baths', placeholder: '2' },
                  { label: 'Sq. Ft.', key: 'sqft', placeholder: '1800' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input type="number" min="0" value={propertyForm[key]} placeholder={placeholder}
                      onChange={e => setPropertyForm(prev => ({ ...prev, [key]: e.target.value }))} style={fieldStyle} />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                {[
                  { label: 'Year Built', key: 'yearBuilt', placeholder: '2005' },
                  { label: 'Garage Spaces', key: 'garageSpaces', placeholder: '2' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input type="number" min="0" value={propertyForm[key]} placeholder={placeholder}
                      onChange={e => setPropertyForm(prev => ({ ...prev, [key]: e.target.value }))} style={fieldStyle} />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Listing Title</label>
                <input type="text" value={propertyForm.title} placeholder="Modern Denver Home with Mountain Views"
                  onChange={e => setPropertyForm(prev => ({ ...prev, title: e.target.value }))} style={fieldStyle} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Description</label>
                <textarea rows={4} value={propertyForm.description} placeholder="Describe the property..."
                  onChange={e => setPropertyForm(prev => ({ ...prev, description: e.target.value }))}
                  style={{ ...fieldStyle, resize: 'vertical' }} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Image URLs (comma-separated)</label>
                <textarea rows={3} value={propertyForm.images} placeholder="https://images.unsplash.com/..., https://..."
                  onChange={e => setPropertyForm(prev => ({ ...prev, images: e.target.value }))}
                  style={{ ...fieldStyle, resize: 'vertical' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, alignItems: 'end', marginBottom: 32 }}>
                <div>
                  <label style={labelStyle}>Virtual Tour URL</label>
                  <input type="url" value={propertyForm.virtualTourUrl} placeholder="https://..."
                    onChange={e => setPropertyForm(prev => ({ ...prev, virtualTourUrl: e.target.value }))} style={fieldStyle} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: '1px solid #ede9e3' }}>
                  <input type="checkbox" id="featured" checked={propertyForm.featured}
                    onChange={e => setPropertyForm(prev => ({ ...prev, featured: e.target.checked }))}
                    style={{ width: 16, height: 16, cursor: 'pointer', accentColor: C.gold }} />
                  <label htmlFor="featured" style={{ fontFamily: C.body, fontSize: 13, color: C.black, cursor: 'pointer' }}>Featured Listing</label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button onClick={() => setShowPropertyModal(false)}
                  style={{ padding: '12px 24px', border: `1px solid ${C.midCream}`, backgroundColor: 'transparent', color: C.muted, cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  Cancel
                </button>
                <button onClick={handleSaveProperty} disabled={propSaving}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: C.black, color: C.white, border: 'none', padding: '12px 28px', cursor: propSaving ? 'not-allowed' : 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: propSaving ? 0.7 : 1 }}>
                  <Save size={14} /> {propSaving ? 'Saving...' : editingProperty ? 'Update Property' : 'Add Property'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Property Confirm ── */}
      {confirmDeleteProp && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(10,10,10,0.6)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}
          onClick={() => setConfirmDeleteProp(null)}>
          <div style={{ backgroundColor: C.white, padding: '40px 32px', maxWidth: 420, width: '100%', textAlign: 'center' }}
            onClick={e => e.stopPropagation()}>
            <AlertTriangle size={36} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
            <p style={{ fontFamily: C.display, fontSize: 22, fontWeight: 300, color: C.black, marginBottom: 8 }}>Delete Property?</p>
            <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 32 }}>This will permanently remove this listing. This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setConfirmDeleteProp(null)}
                style={{ padding: '12px 24px', border: `1px solid ${C.midCream}`, backgroundColor: 'transparent', color: C.muted, cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Cancel
              </button>
              <button onClick={() => handleDeleteProperty(confirmDeleteProp)}
                style={{ padding: '12px 24px', border: 'none', backgroundColor: '#ef4444', color: C.white, cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Lead Confirm ── */}
      {confirmDeleteLead && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(10,10,10,0.6)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}
          onClick={() => setConfirmDeleteLead(null)}>
          <div style={{ backgroundColor: C.white, padding: '40px 32px', maxWidth: 420, width: '100%', textAlign: 'center' }}
            onClick={e => e.stopPropagation()}>
            <AlertTriangle size={36} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
            <p style={{ fontFamily: C.display, fontSize: 22, fontWeight: 300, color: C.black, marginBottom: 8 }}>Delete Lead?</p>
            <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 32 }}>This will permanently delete this lead and all notes. This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setConfirmDeleteLead(null)}
                style={{ padding: '12px 24px', border: `1px solid ${C.midCream}`, backgroundColor: 'transparent', color: C.muted, cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Cancel
              </button>
              <button onClick={() => handleDeleteLead(confirmDeleteLead)}
                style={{ padding: '12px 24px', border: 'none', backgroundColor: '#ef4444', color: C.white, cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Trash2 size={13} /> Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
