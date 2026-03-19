import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

const C = {
  black: '#0a0a0a', cream: '#f5f3ef', midCream: '#ede9e3',
  gold: '#c9a96e', muted: '#8a8078', white: '#ffffff',
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'Jost', sans-serif",
};

const Register = () => {
  const { userRegister, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await userRegister(formData.name, formData.email, formData.password, formData.phone);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: C.body, minHeight: '100vh', display: 'flex', backgroundColor: C.cream }}>

      {/* Left Brand Panel */}
      <div style={{ width: '45%', backgroundColor: C.black, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 64px', position: 'relative', overflow: 'hidden' }}>
        <img src="/devner metro at its best.jpg"
          alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <p style={{ fontFamily: C.display, fontSize: 20, fontWeight: 400, letterSpacing: '0.12em', color: C.white, marginBottom: 4 }}>COLORADO HOME FINDER</p>
            <p style={{ fontFamily: C.body, fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.gold }}>Luxury Real Estate</p>
          </Link>
          <div style={{ width: 48, height: 1, backgroundColor: 'rgba(255,255,255,0.15)', margin: '48px 0' }} />
          <h2 style={{ fontFamily: C.display, fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 300, color: C.white, lineHeight: 1.2, marginBottom: 20 }}>
            Find Your<br />Dream Home
          </h2>
          <p style={{ fontFamily: C.body, fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 360 }}>
            Create a free account to save your favorite homes, set up search alerts, and get personalized recommendations from our team.
          </p>

          <div style={{ marginTop: 48 }}>
            {['Save & favorite properties', 'Get listing alerts for new homes', 'Track your search history', 'Personalized recommendations'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 6, height: 6, backgroundColor: C.gold, borderRadius: '50%', flexShrink: 0 }} />
                <span style={{ fontFamily: C.body, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontFamily: C.display, fontSize: 32, fontWeight: 300, color: C.black, marginBottom: 8 }}>Create Account</h1>
          <p style={{ fontFamily: C.body, fontSize: 13, color: C.muted, marginBottom: 36 }}>
            Already have an account? <Link to="/login" style={{ color: C.black, textDecoration: 'underline', fontWeight: 500 }}>Sign in</Link>
          </p>

          {error && (
            <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', padding: '12px 16px', marginBottom: 20 }}>
              <p style={{ fontFamily: C.body, fontSize: 13, color: '#e11d48' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
                <input type="text" placeholder="John Doe" required value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '14px 16px 14px 44px', border: `1px solid ${C.midCream}`, fontFamily: C.body, fontSize: 13, color: C.black, outline: 'none', boxSizing: 'border-box', backgroundColor: C.white }} />
              </div>
            </div>

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
              <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Phone</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
                <input type="tel" placeholder="(303) 555-0000" value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '14px 16px 14px 44px', border: `1px solid ${C.midCream}`, fontFamily: C.body, fontSize: 13, color: C.black, outline: 'none', boxSizing: 'border-box', backgroundColor: C.white }} />
              </div>
            </div>

            <div>
              <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
                <input type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" required value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  style={{ width: '100%', padding: '14px 48px 14px 44px', border: `1px solid ${C.midCream}`, fontFamily: C.body, fontSize: 13, color: C.black, outline: 'none', boxSizing: 'border-box', backgroundColor: C.white }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontFamily: C.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
                <input type={showPassword ? 'text' : 'password'} placeholder="Repeat your password" required value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  style={{ width: '100%', padding: '14px 16px 14px 44px', border: `1px solid ${C.midCream}`, fontFamily: C.body, fontSize: 13, color: C.black, outline: 'none', boxSizing: 'border-box', backgroundColor: C.white }} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '16px', backgroundColor: C.black, color: C.white, border: 'none', fontFamily: C.body, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: loading ? 0.7 : 1, marginTop: 8, transition: 'all 0.3s' }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.backgroundColor = C.gold; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; } }}
              onMouseLeave={e => { if (!loading) { e.currentTarget.style.backgroundColor = C.black; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; } }}>
              {loading ? 'Creating Account...' : 'Create Account'} {!loading && <ArrowRight size={14} />}
            </button>
          </form>

          <p style={{ fontFamily: C.body, fontSize: 11, color: C.muted, lineHeight: 1.6, marginTop: 24, textAlign: 'center' }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
