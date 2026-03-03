import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import {
  Heart, Search, User, Settings, LogOut, Bed, Bath, Square, Trash2,
  Bell, ArrowRight, Edit, Save
} from 'lucide-react';

const C = {
  black: '#0a0a0a', cream: '#f5f3ef', midCream: '#ede9e3',
  gold: '#c9a96e', muted: '#8a8078', white: '#ffffff',
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Jost', sans-serif",
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('favorites');
  const [userData, setUserData] = useState(null);
  const [savedHomes, setSavedHomes] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const data = localStorage.getItem('userData');
    if (!token) { navigate('/login'); return; }
    if (data) {
      const parsed = JSON.parse(data);
      setUserData(parsed);
      setProfile({ name: parsed.name || '', email: parsed.email || '', phone: parsed.phone || '' });
    }
    fetchSavedData();
  }, [navigate]);

  const fetchSavedData = async () => {
    try {
      const res = await API.get('/auth/user-data');
      setSavedHomes(res.data.savedHomes || []);
      setSavedSearches(res.data.savedSearches || []);
    } catch {
      // Mock data
      setSavedHomes([
        { _id: '1', address: '5673 W County Highway', city: 'Santa Rosa Beach', price: 15950000, beds: 8, baths: 9, sqft: 6944, images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400'] },
        { _id: '2', address: '123 Mountain Vista Dr', city: 'Denver', price: 2150000, beds: 5, baths: 4, sqft: 4200, images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400'] },
        { _id: '3', address: '4845 W County Hwy 30A', city: 'Boulder', price: 1595000, beds: 6, baths: 5, sqft: 4500, images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'] },
      ]);
      setSavedSearches([
        { id: 1, name: 'Denver Homes Under $1M', filters: { city: 'Denver', maxPrice: 1000000, beds: 3 }, newListings: 4, createdAt: '2026-01-15' },
        { id: 2, name: 'Boulder Luxury', filters: { city: 'Boulder', minPrice: 1500000, beds: 4 }, newListings: 2, createdAt: '2026-02-20' },
      ]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    delete API.defaults.headers.common['x-auth-token'];
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    try {
      await API.put('/auth/user-profile', profile);
      localStorage.setItem('userData', JSON.stringify({ ...userData, ...profile }));
    } catch {}
    setEditingProfile(false);
  };

  const handleRemoveFavorite = (id) => {
    setSavedHomes(prev => prev.filter(h => h._id !== id));
  };

  const tabs = [
    { id: 'favorites', icon: Heart, label: 'Saved Homes' },
    { id: 'searches', icon: Search, label: 'Saved Searches' },
    { id: 'settings', icon: Settings, label: 'Profile Settings' },
  ];

  return (
    <div style={{ fontFamily: C.body, backgroundColor: C.cream, minHeight: '100vh', paddingTop: 72 }}>

      {/* Header */}
      <div style={{ backgroundColor: C.black, padding: '48px 0' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 56, height: 56, backgroundColor: C.gold, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: C.display, fontSize: 28, color: C.white }}>{(profile.name || 'U').charAt(0)}</span>
            </div>
            <div>
              <h1 style={{ fontFamily: C.display, fontSize: 28, fontWeight: 300, color: C.white, marginBottom: 4 }}>Welcome, {profile.name?.split(' ')[0] || 'User'}</h1>
              <p style={{ fontFamily: C.body, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{profile.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.7)', fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 40 }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.midCream}` }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px', display: 'flex', gap: 0 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 28px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 12, letterSpacing: '0.08em', color: activeTab === tab.id ? C.black : C.muted, borderBottom: activeTab === tab.id ? `2px solid ${C.black}` : '2px solid transparent', marginBottom: -1, transition: 'all 0.2s' }}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '48px 32px' }}>

        {/* SAVED HOMES */}
        {activeTab === 'favorites' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <div>
                <h2 style={{ fontFamily: C.display, fontSize: 28, fontWeight: 300, color: C.black, marginBottom: 4 }}>Saved Homes</h2>
                <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted }}>{savedHomes.length} properties saved</p>
              </div>
              <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.white, textDecoration: 'none', backgroundColor: C.black, padding: '12px 24px' }}>
                <Search size={14} /> Browse More
              </Link>
            </div>

            {savedHomes.length === 0 ? (
              <div style={{ backgroundColor: C.white, padding: '64px 32px', textAlign: 'center', border: `1px solid ${C.midCream}` }}>
                <Heart size={48} style={{ color: C.midCream, margin: '0 auto 16px' }} />
                <h3 style={{ fontFamily: C.display, fontSize: 24, fontWeight: 300, color: C.black, marginBottom: 8 }}>No Saved Homes Yet</h3>
                <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, marginBottom: 24 }}>Start browsing properties and click the heart icon to save your favorites.</p>
                <Link to="/search" style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.white, textDecoration: 'none', backgroundColor: C.black, padding: '12px 28px', display: 'inline-block' }}>
                  Start Searching
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                {savedHomes.map(home => (
                  <div key={home._id} style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, overflow: 'hidden' }}>
                    <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                      <Link to={`/property/${home._id}`}>
                        <img src={home.images?.[0]} alt={home.address}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                          onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                          onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                      </Link>
                      <button onClick={() => handleRemoveFavorite(home._id)}
                        style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div style={{ padding: '20px 24px' }}>
                      <p style={{ fontFamily: C.display, fontSize: 24, fontWeight: 300, color: C.black, marginBottom: 4 }}>${home.price?.toLocaleString()}</p>
                      <p style={{ fontFamily: C.body, fontSize: 13, color: C.black, marginBottom: 2 }}>{home.address}</p>
                      <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted, marginBottom: 14 }}>{home.city}, Colorado</p>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {[[Bed, `${home.beds}`], [Bath, `${home.baths}`], [Square, `${home.sqft?.toLocaleString()}`]].map(([Icon, val], j) => (
                          <span key={j} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: C.cream, fontFamily: C.body, fontSize: 11, padding: '4px 10px', color: C.black }}>
                            <Icon size={12} /> {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SAVED SEARCHES */}
        {activeTab === 'searches' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <div>
                <h2 style={{ fontFamily: C.display, fontSize: 28, fontWeight: 300, color: C.black, marginBottom: 4 }}>Saved Searches</h2>
                <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted }}>{savedSearches.length} active search alerts</p>
              </div>
            </div>

            {savedSearches.length === 0 ? (
              <div style={{ backgroundColor: C.white, padding: '64px 32px', textAlign: 'center', border: `1px solid ${C.midCream}` }}>
                <Bell size={48} style={{ color: C.midCream, margin: '0 auto 16px' }} />
                <h3 style={{ fontFamily: C.display, fontSize: 24, fontWeight: 300, color: C.black, marginBottom: 8 }}>No Saved Searches</h3>
                <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, marginBottom: 24 }}>Set up search alerts to get notified when new listings match your criteria.</p>
                <Link to="/search" style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.white, textDecoration: 'none', backgroundColor: C.black, padding: '12px 28px', display: 'inline-block' }}>
                  Create a Search
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {savedSearches.map(search => (
                  <div key={search.id} style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 44, height: 44, backgroundColor: C.cream, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Search size={18} style={{ color: C.black }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: C.body, fontSize: 14, fontWeight: 500, color: C.black, marginBottom: 4 }}>{search.name}</p>
                        <p style={{ fontFamily: C.body, fontSize: 12, color: C.muted }}>
                          {search.filters.city && `${search.filters.city} · `}
                          {search.filters.minPrice && `$${(search.filters.minPrice/1000).toFixed(0)}K+ · `}
                          {search.filters.maxPrice && `$${(search.filters.maxPrice/1000).toFixed(0)}K max · `}
                          {search.filters.beds && `${search.filters.beds}+ beds`}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      {search.newListings > 0 && (
                        <span style={{ backgroundColor: C.gold, color: C.white, fontFamily: C.body, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 40 }}>
                          {search.newListings} new
                        </span>
                      )}
                      <Link to={`/search?city=${search.filters.city || ''}&minPrice=${search.filters.minPrice || ''}&beds=${search.filters.beds || ''}`}
                        style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.black, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${C.black}`, paddingBottom: 2 }}>
                        View <ArrowRight size={12} />
                      </Link>
                      <button onClick={() => setSavedSearches(prev => prev.filter(s => s.id !== search.id))}
                        style={{ width: 32, height: 32, border: `1px solid ${C.midCream}`, background: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE SETTINGS */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: 640 }}>
            <h2 style={{ fontFamily: C.display, fontSize: 28, fontWeight: 300, color: C.black, marginBottom: 32 }}>Profile Settings</h2>

            <div style={{ backgroundColor: C.white, border: `1px solid ${C.midCream}`, padding: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, paddingBottom: 20, borderBottom: `1px solid ${C.midCream}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <User size={16} style={{ color: C.gold }} />
                  <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black }}>Personal Information</p>
                </div>
                <button onClick={() => editingProfile ? handleSaveProfile() : setEditingProfile(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold }}>
                  {editingProfile ? <><Save size={13} /> Save</> : <><Edit size={13} /> Edit</>}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[['Full Name', 'text', 'name'], ['Email', 'email', 'email'], ['Phone', 'tel', 'phone']].map(([label, type, field]) => (
                  <div key={field}>
                    <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>{label}</label>
                    <input type={type} value={profile[field]}
                      disabled={!editingProfile}
                      onChange={e => setProfile({ ...profile, [field]: e.target.value })}
                      style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: `1px solid ${editingProfile ? C.black : C.midCream}`, outline: 'none', fontFamily: C.body, fontSize: 14, color: C.black, backgroundColor: 'transparent', boxSizing: 'border-box', opacity: editingProfile ? 1 : 0.7 }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', padding: '28px', marginTop: 24 }}>
              <p style={{ fontFamily: C.body, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#be123c', marginBottom: 8 }}>Account</p>
              <p style={{ fontFamily: C.body, fontSize: 12, color: '#e11d48', lineHeight: 1.6, marginBottom: 16 }}>Delete your account and all associated data. This action cannot be undone.</p>
              <button style={{ padding: '10px 20px', border: '1px solid #f87171', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
