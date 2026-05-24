import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp, generateOTP } from '../context/AppContext';
import OTPModal from '../components/OTPModal';
import toast from 'react-hot-toast';
import './ResumeBuilder.css';

const INITIAL_FORM = {
  name: '', email: '', phone: '', address: '',
  objective: '',
  college: '', degree: '', graduationYear: '', cgpa: '',
  company1: '', role1: '', duration1: '', desc1: '',
  skills: '',
  project1: '', projectDesc1: '',
  linkedin: '', github: '',
  photo: null,
};

export default function ResumeBuilder() {
  const { user, saveResume, updateUser } = useApp();
  const [form, setForm] = useState({
    ...INITIAL_FORM,
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    college: user?.college || '',
    degree: user?.degree || '',
  });
  const [step, setStep] = useState('landing'); // landing | form | payment | otp | preview
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [resumeGenerated, setResumeGenerated] = useState(false);

  const isPremium = user?.plan === 'gold' || user?.plan === 'silver' || user?.plan === 'bronze';

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { toast.error('Name and email are required'); return; }
    setStep('payment');
  };

  const handlePayment = () => {
    const newOtp = generateOTP();
    setOtp(newOtp);
    setShowOTP(true);
    toast.success(`OTP sent to ${user.email}! Demo OTP: ${newOtp}`, { duration: 8000 });
  };

  const handleOTPVerify = (entered) => {
    if (entered !== otp) { toast.error('Invalid OTP'); return false; }
    setShowOTP(false);
    // Simulate Razorpay payment success
    toast.success('Payment of ₹50 successful via Razorpay! 🎉');
    setTimeout(() => {
      const resumeData = { ...form, photoPreview };
      saveResume(resumeData);
      setResumeGenerated(true);
      setStep('preview');
    }, 800);
    return true;
  };

  if (!isPremium && step === 'landing') {
    return (
      <div className="resume-page">
        <div className="container">
          <div className="resume-locked card">
            <div style={{ fontSize: 64 }}>🔒</div>
            <h2>Resume Builder is a Premium Feature</h2>
            <p>Upgrade to Bronze, Silver, or Gold plan to create your professional resume and automatically attach it to your profile.</p>
            <div className="locked-features">
              <div className="locked-feature">✅ Professional resume template</div>
              <div className="locked-feature">✅ Auto-attach to profile</div>
              <div className="locked-feature">✅ One-click apply with resume</div>
              <div className="locked-feature">✅ Download as PDF</div>
            </div>
            <Link to="/subscription" className="btn-primary" style={{ marginTop: 24, padding: '13px 32px', fontSize: 15, justifyContent: 'center' }}>
              Upgrade Plan
            </Link>
            <p style={{ marginTop: 12, fontSize: 13, color: 'var(--gray-500)' }}>Resume creation costs ₹50 per resume (paid via Razorpay)</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-page">
      <div className="container">
        <div className="resume-header">
          <h1>Resume Builder</h1>
          <p>Create a professional resume and auto-attach it to your profile</p>
          <div className="resume-steps">
            {['Fill Details', 'Pay ₹50', 'Get Resume'].map((s, i) => (
              <div key={s} className={`resume-step ${step === ['form','payment','preview'][i] ? 'active' : (i < ['landing','form','payment','preview'].indexOf(step) - 1 ? 'done' : '')}`}>
                <div className="step-num">{i + 1}</div>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {step === 'landing' && (
          <div className="resume-landing card">
            <div style={{ fontSize: 56, marginBottom: 16 }}>📄</div>
            <h2>Build Your Professional Resume</h2>
            <p>Fill in your details and get a beautifully formatted resume for just <strong>₹50</strong>.</p>
            <ul className="landing-list">
              <li>📋 Professional format accepted by top companies</li>
              <li>🔗 Automatically attached to your Internshala profile</li>
              <li>💳 Secure payment via Razorpay (OTP verified)</li>
              <li>📥 Instant download after payment</li>
            </ul>
            <button className="btn-primary" style={{ marginTop: 24, padding: '13px 36px', fontSize: 15 }} onClick={() => setStep('form')}>
              Start Building →
            </button>
          </div>
        )}

        {step === 'form' && (
          <form className="resume-form-container" onSubmit={handleFormSubmit}>
            <div className="form-section card">
              <h3>👤 Personal Information</h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" required />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" required />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="10-digit phone" />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" value={form.address} onChange={e => set('address', e.target.value)} placeholder="City, State" />
                </div>
                <div className="form-group">
                  <label>LinkedIn URL</label>
                  <input type="url" value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="linkedin.com/in/..." />
                </div>
                <div className="form-group">
                  <label>GitHub URL</label>
                  <input type="url" value={form.github} onChange={e => set('github', e.target.value)} placeholder="github.com/..." />
                </div>
              </div>
              <div className="form-group">
                <label>Profile Photo</label>
                <div className="photo-upload-area">
                  {photoPreview ? (
                    <div className="photo-preview-wrap">
                      <img src={photoPreview} alt="Preview" className="photo-preview" />
                      <button type="button" className="btn-outline" style={{ marginTop: 8, fontSize: 12, padding: '5px 14px' }} onClick={() => setPhotoPreview(null)}>Remove</button>
                    </div>
                  ) : (
                    <label className="photo-upload-label">
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                      <span>📸 Click to upload photo</span>
                      <span className="photo-hint">JPG, PNG up to 2MB</span>
                    </label>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Career Objective</label>
                <textarea value={form.objective} onChange={e => set('objective', e.target.value)} placeholder="Briefly describe your career goals..." rows={3} style={{ resize: 'vertical' }} />
              </div>
            </div>

            <div className="form-section card">
              <h3>🎓 Education</h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>College / University</label>
                  <input type="text" value={form.college} onChange={e => set('college', e.target.value)} placeholder="Your college name" />
                </div>
                <div className="form-group">
                  <label>Degree</label>
                  <input type="text" value={form.degree} onChange={e => set('degree', e.target.value)} placeholder="B.Tech, MBA, etc." />
                </div>
                <div className="form-group">
                  <label>Graduation Year</label>
                  <input type="text" value={form.graduationYear} onChange={e => set('graduationYear', e.target.value)} placeholder="2025" />
                </div>
                <div className="form-group">
                  <label>CGPA / Percentage</label>
                  <input type="text" value={form.cgpa} onChange={e => set('cgpa', e.target.value)} placeholder="8.5 / 85%" />
                </div>
              </div>
            </div>

            <div className="form-section card">
              <h3>💼 Experience</h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Company Name</label>
                  <input type="text" value={form.company1} onChange={e => set('company1', e.target.value)} placeholder="Company / Organization" />
                </div>
                <div className="form-group">
                  <label>Role / Position</label>
                  <input type="text" value={form.role1} onChange={e => set('role1', e.target.value)} placeholder="Frontend Developer Intern" />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input type="text" value={form.duration1} onChange={e => set('duration1', e.target.value)} placeholder="Jun 2024 – Aug 2024" />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.desc1} onChange={e => set('desc1', e.target.value)} placeholder="Describe your responsibilities and achievements..." rows={3} style={{ resize: 'vertical' }} />
              </div>
            </div>

            <div className="form-section card">
              <h3>🛠 Skills & Projects</h3>
              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input type="text" value={form.skills} onChange={e => set('skills', e.target.value)} placeholder="React, Python, Figma, SQL..." />
              </div>
              <div className="form-group">
                <label>Project Name</label>
                <input type="text" value={form.project1} onChange={e => set('project1', e.target.value)} placeholder="e.g. E-Commerce Website" />
              </div>
              <div className="form-group">
                <label>Project Description</label>
                <textarea value={form.projectDesc1} onChange={e => set('projectDesc1', e.target.value)} placeholder="Brief description of the project..." rows={2} style={{ resize: 'vertical' }} />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-outline" onClick={() => setStep('landing')}>← Back</button>
              <button type="submit" className="btn-primary" style={{ padding: '12px 32px' }}>Next: Payment →</button>
            </div>
          </form>
        )}

        {step === 'payment' && (
          <div className="payment-container card">
            <div style={{ fontSize: 56, textAlign: 'center', marginBottom: 16 }}>💳</div>
            <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', marginBottom: 8 }}>Complete Payment</h2>
            <p style={{ textAlign: 'center', color: 'var(--gray-500)', marginBottom: 32 }}>Your resume is ready! Complete payment to generate and download it.</p>

            <div className="payment-summary">
              <div className="payment-row">
                <span>Resume Generation</span>
                <span>₹50.00</span>
              </div>
              <div className="payment-row">
                <span>GST (18%)</span>
                <span>₹9.00</span>
              </div>
              <div className="payment-divider" />
              <div className="payment-row total">
                <span>Total</span>
                <span>₹59.00</span>
              </div>
            </div>

            <div className="payment-gateway">
              <div className="gateway-logo">
                <span style={{ fontSize: 24 }}>⚡</span>
                <span style={{ fontWeight: 700, color: '#072654' }}>Razorpay</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>Secure payment powered by Razorpay</p>
            </div>

            <div className="otp-notice">
              <span>🔐</span>
              <span>An OTP will be sent to <strong>{user?.email}</strong> before processing payment</span>
            </div>

            <div className="payment-actions">
              <button className="btn-outline" onClick={() => setStep('form')}>← Edit Details</button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '13px' }} onClick={handlePayment}>
                Pay ₹59 via Razorpay
              </button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="resume-preview-container">
            <div className="preview-actions">
              <span style={{ color: 'var(--green)', fontWeight: 600 }}>✅ Resume generated & saved to your profile!</span>
              <button className="btn-primary" onClick={() => window.print()} style={{ padding: '9px 20px' }}>🖨 Print / Save PDF</button>
            </div>

            <div className="resume-doc" id="resume-preview">
              <div className="resume-top">
                <div className="resume-photo-col">
                  {photoPreview && <img src={photoPreview} alt="Profile" className="resume-photo" />}
                </div>
                <div className="resume-name-col">
                  <h1 className="rv-name">{form.name}</h1>
                  <div className="rv-contact">
                    {form.email && <span>✉ {form.email}</span>}
                    {form.phone && <span>📞 {form.phone}</span>}
                    {form.address && <span>📍 {form.address}</span>}
                  </div>
                  <div className="rv-links">
                    {form.linkedin && <span>🔗 {form.linkedin}</span>}
                    {form.github && <span>💻 {form.github}</span>}
                  </div>
                </div>
              </div>

              {form.objective && (
                <div className="rv-section">
                  <h2>Objective</h2>
                  <p>{form.objective}</p>
                </div>
              )}

              <div className="rv-section">
                <h2>Education</h2>
                <div className="rv-item">
                  <div className="rv-item-title">{form.degree || 'Degree'}</div>
                  <div className="rv-item-sub">{form.college}</div>
                  <div className="rv-item-meta">{form.graduationYear} {form.cgpa && `• CGPA: ${form.cgpa}`}</div>
                </div>
              </div>

              {(form.company1 || form.role1) && (
                <div className="rv-section">
                  <h2>Experience</h2>
                  <div className="rv-item">
                    <div className="rv-item-title">{form.role1}</div>
                    <div className="rv-item-sub">{form.company1}</div>
                    <div className="rv-item-meta">{form.duration1}</div>
                    {form.desc1 && <p className="rv-desc">{form.desc1}</p>}
                  </div>
                </div>
              )}

              {form.skills && (
                <div className="rv-section">
                  <h2>Skills</h2>
                  <div className="rv-skills">
                    {form.skills.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                      <span key={s} className="rv-skill">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {form.project1 && (
                <div className="rv-section">
                  <h2>Projects</h2>
                  <div className="rv-item">
                    <div className="rv-item-title">{form.project1}</div>
                    {form.projectDesc1 && <p className="rv-desc">{form.projectDesc1}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showOTP && (
        <OTPModal
          title="Verify Payment"
          subtitle={`An OTP has been sent to ${user?.email} to verify your payment. (Demo OTP: ${otp})`}
          onVerify={handleOTPVerify}
          onClose={() => setShowOTP(false)}
        />
      )}
    </div>
  );
}
