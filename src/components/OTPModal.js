import React, { useState, useRef, useEffect } from 'react';

export default function OTPModal({ title, subtitle, onVerify, onClose, onResend, demoOtp }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  useEffect(() => { inputs.current[0]?.focus(); }, []);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    setError('');
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handleSubmit = async () => {
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the complete 6-digit OTP'); return; }
    setLoading(true);
    const result = onVerify(code);
    setLoading(false);
    if (result === false) { setError('Invalid OTP. Please try again.'); setOtp(['','','','','','']); inputs.current[0]?.focus(); }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputs.current[5]?.focus();
    }
  };

  // Fill the demo OTP automatically for convenience
  const handleFillDemo = () => {
    if (!demoOtp) return;
    setOtp(demoOtp.split(''));
    inputs.current[5]?.focus();
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📧</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8, color: 'var(--gray-900)' }}>{title}</h2>
        <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 28, lineHeight: 1.6 }}>{subtitle}</p>

        {/* Demo helper — remove this block once backend email/SMS is wired up */}
        {demoOtp && (
          <div style={{ background: 'var(--blue-light)', borderRadius: 8, padding: '8px 12px', marginBottom: 20, fontSize: 12, color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Demo mode — OTP: <strong style={{ fontFamily: 'monospace' }}>{demoOtp}</strong></span>
            <button onClick={handleFillDemo} style={{ background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 6, padding: '3px 10px', fontSize: 11, cursor: 'pointer' }}>Fill</button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => inputs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              onPaste={handlePaste}
              style={{
                width: 48, height: 54, textAlign: 'center', fontSize: 22, fontWeight: 700,
                borderRadius: 10, border: `2px solid ${digit ? 'var(--blue)' : 'var(--gray-200)'}`,
                transition: 'border-color 0.15s', outline: 'none', padding: 0,
                background: digit ? 'var(--blue-light)' : 'var(--white)',
                color: 'var(--gray-900)'
              }}
            />
          ))}
        </div>

        {error && <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 16 }}>{error}</p>}

        <button
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        {onResend && (
          <button onClick={onResend} style={{ marginTop: 14, background: 'none', color: 'var(--blue)', fontSize: 13, fontWeight: 500, textDecoration: 'underline' }}>
            Resend OTP
          </button>
        )}

        <button onClick={onClose} style={{ marginTop: 10, background: 'none', color: 'var(--gray-400)', fontSize: 13, display: 'block', width: '100%', textAlign: 'center' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
