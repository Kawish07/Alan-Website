import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

const C = {
  black: '#0a0a0a', cream: '#f5f3ef', midCream: '#ede9e3',
  gold: '#c9a96e', muted: '#8a8078', white: '#ffffff',
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Jost', sans-serif",
};

const Login = () => {
  const { userLogin, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user?.role === 'user') navigate('/dashboard');
    if (isAuthenticated && user?.role === 'admin') navigate('/admin');
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await userLogin(formData.email, formData.password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.msg || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{ fontFamily: C.body, minHeight: '100vh', display: 'flex', backgroundColor: C.cream }}>

      {/* Left Brand Panel */}
      <div style={{ width: '45%', backgroundColor: C.black, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 64px', position: 'relative', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <p style={{ fontFamily: C.display, fontSize: 20, fontWeight: 400, letterSpacing: '0.12em', color: C.white, marginBottom: 4 }}>COLORADO HOME FINDER</p>
            <p style={{ fontFamily: C.body, fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.gold }}>Luxury Real Estate</p>
          </Link>
          <div style={{ width: 48, height: 1, backgroundColor: 'rgba(255,255,255,0.15)', margin: '48px 0' }} />
          <h2 style={{ fontFamily: C.display, fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 300, color: C.white, lineHeight: 1.2, marginBottom: 20 }}>
            Welcome<br />Back
          </h2>
          <p style={{ fontFamily: C.body, fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 360 }}>
            Sign in to access your saved homes, search alerts, and personalized property recommendations.
          </p>
          <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
            {[['Save Favorites', '♡'], ['Search Alerts', '🔔'], ['Track History', '📊']].map(([label, icon], i) => (
              <div key={i}>
                <p style={{ fontSize: 20, marginBottom: 4 }}>{icon}</p>
                <p style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontFamily: C.display, fontSize: 32, fontWeight: 300, color: C.black, marginBottom: 8 }}>Sign In</h1>
          <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, marginBottom: 36 }}>
            Don't have an account? <Link to="/register" style={{ color: C.black, textDecoration: 'underline', fontWeight: 500 }}>Create one</Link>
          </p>

          {error && (
            <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', padding: '12px 16px', marginBottom: 20 }}>
              <p style={{ fontFamily: C.body, fontSize: 13, color: '#e11d48' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
                <input type="email" placeholder="you@email.com" required value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '14px 16px 14px 44px', border: `1px solid ${C.midCream}`, fontFamily: C.body, fontSize: 13, color: C.black, outline: 'none', boxSizing: 'border-box', backgroundColor: C.white }} />
              </div>
            </div>

            <div>
              <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
                <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" required value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  style={{ width: '100%', padding: '14px 48px 14px 44px', border: `1px solid ${C.midCream}`, fontFamily: C.body, fontSize: 13, color: C.black, outline: 'none', boxSizing: 'border-box', backgroundColor: C.white }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '16px', backgroundColor: C.black, color: C.white, border: 'none', fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: loading ? 0.7 : 1, marginTop: 8, transition: 'all 0.3s' }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.backgroundColor = C.gold; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; } }}
              onMouseLeave={e => { if (!loading) { e.currentTarget.style.backgroundColor = C.black; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; } }}>
              {loading ? 'Signing In...' : 'Sign In'} {!loading && <ArrowRight size={14} />}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '32px 0' }}>
            <div style={{ flex: 1, height: 1, backgroundColor: C.midCream }} />
            <span style={{ fontFamily: C.body, fontSize: 11, color: C.muted }}>or</span>
            <div style={{ flex: 1, height: 1, backgroundColor: C.midCream }} />
          </div>

          <button style={{ width: '100%', padding: '14px', border: `1px solid ${C.midCream}`, backgroundColor: C.white, fontFamily: C.body, fontSize: 13, color: C.black, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 0, transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.black; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.midCream; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
