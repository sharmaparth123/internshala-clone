import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import OTPModal from '../components/OTPModal';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Login() {
  const { login, verifyLoginOTP } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpInfo, setOtpInfo] = useState(null);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const result = login(form.email, form.password);
    setLoading(false);
    if (result.error) { toast.error(result.error); return; }
    if (result.requireOTP) {
      setOtpInfo(result);
      setShowOTP(true);
      // In production, OTP would be sent via email/SMS
      toast.success(`OTP sent to ${result.email}`, { duration: 5000 });
      return;
    }
    toast.success('Welcome back! 🎉');
    navigate('/dashboard');
  };

  const handleOTPVerify = (entered) => {
    const result = verifyLoginOTP(entered);
    if (result.error) { toast.error(result.error); return false; }
    toast.success('Welcome back! 🎉');
    navigate('/dashboard');
    return true;
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card card">
          <div className="auth-logo">🎓</div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Login to your Internshala account</p>

          <div className="demo-note">
            <strong>Demo account:</strong><br />
            test@test.com / password123
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrap">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }}
                  style={{ paddingLeft: 42 }}
                />
              </div>
              {errors.email && <p className="error-msg">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }}
                  style={{ paddingLeft: 42, paddingRight: 42 }}
                />
                <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="error-msg">{errors.password}</p>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 500 }}>Forgot password?</Link>
            </div>

            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Register now</Link>
          </p>
        </div>
      </div>

      {showOTP && (
        <OTPModal
          title="Verify Your Identity"
          subtitle={`We've sent a verification code to ${otpInfo?.email}. Please check your inbox.`}
          onVerify={handleOTPVerify}
          onClose={() => setShowOTP(false)}
          demoOtp={otpInfo?.otp}
        />
      )}
    </div>
  );
}
