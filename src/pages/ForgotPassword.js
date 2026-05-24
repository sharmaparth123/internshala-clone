import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp, generatePassword } from '../context/AppContext';
import OTPModal from '../components/OTPModal';
import toast from 'react-hot-toast';
import './Auth.css';

export default function ForgotPassword() {
  const { resetPassword } = useApp();
  const [step, setStep] = useState(1);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [generatedPass, setGeneratedPass] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [demoOTP] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());
  const [error, setError] = useState('');

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) { setError('Enter your email or phone number'); return; }
    setShowOTP(true);
    // In production, OTP would be delivered via email/SMS
    toast.success('OTP sent! Check your inbox.', { duration: 5000 });
  };

  const handleOTPVerify = (entered) => {
    if (entered !== demoOTP) { toast.error('Invalid OTP'); return false; }
    setShowOTP(false);
    setStep(2);
    return true;
  };

  const handleGeneratePassword = () => {
    const pwd = generatePassword(10);
    setGeneratedPass(pwd);
    setNewPassword(pwd);
    setConfirmPassword(pwd);
    toast.success('Strong password generated!');
  };

  const handleReset = (e) => {
    e.preventDefault();
    setError('');
    if (!newPassword) { setError('Please enter a new password'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    const result = resetPassword(emailOrPhone, newPassword);
    if (result.error) { toast.error(result.error); return; }
    toast.success('Password reset successfully! Please login with your new password.');
    setStep(3);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card card">
          <div className="auth-logo">{step === 3 ? '✅' : '🔑'}</div>

          {step === 1 && (
            <>
              <h1 className="auth-title">Forgot Password?</h1>
              <p className="auth-sub">Enter your email or phone to reset your password</p>
              <form onSubmit={handleStep1}>
                <div className="form-group">
                  <label>Email or Phone Number</label>
                  <input
                    type="text"
                    placeholder="email@example.com or 9876543210"
                    value={emailOrPhone}
                    onChange={e => { setEmailOrPhone(e.target.value); setError(''); }}
                  />
                  {error && <p className="error-msg">{error}</p>}
                </div>
                <button type="submit" className="btn-primary auth-submit">Send OTP</button>
              </form>
              <p className="auth-switch" style={{ marginTop: 16 }}>
                Remember your password? <Link to="/login">Login</Link>
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="auth-title">Set New Password</h1>
              <p className="auth-sub">Create a new password for your account</p>

              <div style={{ background: 'var(--green-light)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: 'var(--green)' }}>
                ✅ Identity verified! Now set your new password.
              </div>

              <form onSubmit={handleReset}>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setError(''); }}
                  />
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                  />
                  {error && <p className="error-msg">{error}</p>}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <button type="button" onClick={handleGeneratePassword} className="btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '11px' }}>
                    🎲 Generate Strong Password
                  </button>
                  {generatedPass && (
                    <div style={{ marginTop: 8, background: 'var(--gray-50)', borderRadius: 8, padding: '8px 12px', fontSize: 13, textAlign: 'center' }}>
                      Generated: <strong style={{ color: 'var(--blue)', fontFamily: 'monospace', letterSpacing: 1 }}>{generatedPass}</strong>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-primary auth-submit">Reset Password</button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="auth-title">Password Reset!</h1>
              <p className="auth-sub">Your password has been updated successfully</p>
              <div style={{ background: 'var(--green-light)', borderRadius: 10, padding: 20, textAlign: 'center', marginBottom: 24 }}>
                <p style={{ color: 'var(--green)', fontSize: 14 }}>You can now login with your new password.</p>
              </div>
              <Link to="/login" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', padding: '13px', fontSize: 15, borderRadius: 10 }}>
                Go to Login
              </Link>
            </>
          )}
        </div>
      </div>

      {showOTP && (
        <OTPModal
          title="Verify Your Identity"
          subtitle={`We've sent a verification code to ${emailOrPhone}. Enter it below to continue.`}
          onVerify={handleOTPVerify}
          onClose={() => setShowOTP(false)}
          demoOtp={demoOTP}
        />
      )}
    </div>
  );
}
