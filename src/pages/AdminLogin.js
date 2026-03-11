import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

const C = {
  black: '#0a0a0a', cream: '#f5f3ef', midCream: '#ede9e3',
  gold: '#c9a96e', muted: '#8a8078', white: '#ffffff',
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Jost', sans-serif",
};

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const { adminLogin, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') navigate('/admin');
    if (isAuthenticated && user?.role === 'user') navigate('/dashboard');
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await adminLogin(formData.email, formData.password);
    setLoading(false);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.msg || 'Invalid email or password. Please try again.');
    }
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '16px 0',
    border: 'none',
    borderBottom: `1px solid ${focused === field ? C.black : C.midCream}`,
    outline: 'none', fontFamily: C.body, fontSize: 14, color: C.black,
    backgroundColor: 'transparent', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  });

  return (
    <div style={{ fontFamily: C.body, minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

      {/* Left: Brand panel */}
      <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: C.black }}>
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
        />
        <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 56px' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <p style={{ fontFamily: C.display, fontSize: 20, fontWeight: 400, letterSpacing: '0.12em', color: C.white }}>
              COLORADO HOME FINDER
            </p>
            <p style={{ fontFamily: C.body, fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
              Admin Portal
            </p>
          </Link>

          {/* Center content */}
          <div>
            <div style={{ width: 48, height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 32 }} />
            <h2 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300, color: C.white, lineHeight: 1.15, marginBottom: 20 }}>
              Manage your<br /><em style={{ color: C.gold }}>listings & leads</em><br />with precision.
            </h2>
            <p style={{ fontFamily: C.body, fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: 360 }}>
              The Colorado Home Finder admin portal gives you full control over property listings, lead tracking, and site configuration.
            </p>
          </div>

          {/* Bottom stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 32 }}>
            {[['$2B+', 'Sales'], ['500+', 'Clients'], ['#1', 'CO Team']].map(([val, lbl], i) => (
              <div key={i} style={{ textAlign: 'center', paddingRight: i < 2 ? 24 : 0, borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <p style={{ fontFamily: C.display, fontSize: 28, fontWeight: 300, color: C.white, lineHeight: 1, marginBottom: 4 }}>{val}</p>
                <p style={{ fontFamily: C.body, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div style={{ backgroundColor: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 64px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.muted, marginBottom: 12 }}>
            Secure Access
          </p>
          <h1 style={{ fontFamily: C.display, fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 300, color: C.black, lineHeight: 1.1, marginBottom: 8 }}>
            Admin<br />Sign In
          </h1>
          <div style={{ width: 40, height: 1, backgroundColor: C.black, marginBottom: 48 }} />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            <div>
              <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>
                Email Address
              </label>
              <input
                type="email" required placeholder="admin@coloradohomefinder.com"
                style={inputStyle('email')}
                onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                  style={{ ...inputStyle('password'), paddingRight: 40 }}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 0 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', padding: '12px 16px', fontFamily: C.body, fontSize: 13, color: '#be123c' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ padding: '18px', backgroundColor: loading ? C.muted : C.black, color: C.white, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, transition: 'background 0.2s', marginTop: 8 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = C.black; }}
            >
              {loading ? 'Signing In...' : (<>Sign In <ArrowRight size={15} /></>)}
            </button>
          </form>

          <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted, textAlign: 'center', marginTop: 32 }}>
            <Link to="/" style={{ color: C.black, textDecoration: 'none', borderBottom: `1px solid ${C.midCream}` }}>
              ← Return to Website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;