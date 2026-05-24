import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Register() {
  const { register, login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', college: '', degree: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone) e.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter valid 10-digit phone';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!form.college.trim()) e.college = 'College name is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const result = register({ name: form.name, email: form.email, phone: form.phone, password: form.password, college: form.college, degree: form.degree, avatar: form.name[0].toUpperCase() });
    setLoading(false);
    if (result.error) { toast.error(result.error); return; }
    
    // Create a demo account too
    const stored = JSON.parse(localStorage.getItem('users') || '[]');
    const hasDemo = stored.find(u => u.email === 'test@test.com');
    if (!hasDemo) {
      const demoUser = { id: 'demo', name: 'Demo User', email: 'test@test.com', phone: '9876543210', password: 'password123', college: 'IIT Delhi', degree: 'B.Tech', plan: 'free', applicationsThisMonth: 0, friends: ['friend1', 'friend2', 'friend3'], resume: null, avatar: 'D', joinedAt: new Date().toISOString(), passwordResetDate: null };
      localStorage.setItem('users', JSON.stringify([...stored, demoUser]));
    }

    toast.success('Account created! Please login.');
    navigate('/login');
  };

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(er => ({ ...er, [key]: '' }));
  };

  return (
    <div className="auth-page">
      <div className="auth-container" style={{ maxWidth: 520 }}>
        <div className="auth-card card">
          <div className="auth-logo">🎓</div>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-sub">Join 16 million+ students on Internshala</p>

          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} />
                {errors.name && <p className="error-msg">{errors.name}</p>}
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" placeholder="10-digit phone" value={form.phone} onChange={e => set('phone', e.target.value)} />
                {errors.phone && <p className="error-msg">{errors.phone}</p>}
              </div>
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
              {errors.email && <p className="error-msg">{errors.email}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div className="form-group">
                <label>College/University *</label>
                <input type="text" placeholder="College name" value={form.college} onChange={e => set('college', e.target.value)} />
                {errors.college && <p className="error-msg">{errors.college}</p>}
              </div>
              <div className="form-group">
                <label>Degree</label>
                <select value={form.degree} onChange={e => set('degree', e.target.value)}>
                  <option value="">Select degree</option>
                  <option>B.Tech</option>
                  <option>B.Sc</option>
                  <option>B.Com</option>
                  <option>BBA</option>
                  <option>MBA</option>
                  <option>M.Tech</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div className="form-group">
                <label>Password *</label>
                <input type="password" placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
                {errors.password && <p className="error-msg">{errors.password}</p>}
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input type="password" placeholder="Repeat password" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
                {errors.confirm && <p className="error-msg">{errors.confirm}</p>}
              </div>
            </div>

            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch" style={{ marginTop: 16 }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
