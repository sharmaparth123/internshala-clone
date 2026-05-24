import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    college: user?.college || '',
    degree: user?.degree || '',
    skills: user?.skills || '',
    bio: user?.bio || '',
    linkedin: user?.linkedin || '',
    github: user?.github || '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    updateUser(form);
    setEditing(false);
    toast.success('Profile updated!');
  };

  const PLANS_MAP = { free: { label: 'Free', color: '#64748b', bg: '#f1f5f9' }, bronze: { label: 'Bronze', color: '#cd7f32', bg: '#fff0e0' }, silver: { label: 'Silver', color: '#64748b', bg: '#f1f5f9' }, gold: { label: 'Gold', color: '#f59e0b', bg: '#fff8e1' } };
  const planStyle = PLANS_MAP[user?.plan] || PLANS_MAP.free;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">
          {/* Left panel */}
          <aside className="profile-left">
            <div className="profile-card card">
              <div className="profile-avatar-lg">{user?.avatar}</div>
              <h2 className="profile-name">{user?.name}</h2>
              <p className="profile-email">{user?.email}</p>
              <p className="profile-college">{user?.college} {user?.degree && `• ${user?.degree}`}</p>
              <div className="profile-plan-tag" style={{ background: planStyle.bg, color: planStyle.color }}>
                {planStyle.label} Plan
              </div>
              <div className="profile-joined">Joined {new Date(user?.joinedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</div>

              <div className="profile-quick-links">
                <Link to="/resume-builder" className="pql-item">📄 Build Resume</Link>
                <Link to="/subscription" className="pql-item">⭐ Upgrade Plan</Link>
                <Link to="/login-history" className="pql-item">🔐 Login History</Link>
              </div>
            </div>

            {user?.resume && (
              <div className="resume-attached card">
                <h4>📎 Resume Attached</h4>
                <p>{user.resume.name}'s Resume</p>
                <Link to="/resume-builder" className="btn-outline" style={{ fontSize: 12, padding: '6px 14px', marginTop: 8 }}>View / Update</Link>
              </div>
            )}
          </aside>

          {/* Right panel */}
          <main className="profile-main">
            <div className="profile-section card">
              <div className="section-header-row">
                <h3>Personal Information</h3>
                {!editing ? (
                  <button className="btn-outline" style={{ fontSize: 13, padding: '7px 16px' }} onClick={() => setEditing(true)}>✏️ Edit</button>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-outline" style={{ fontSize: 13, padding: '7px 16px' }} onClick={() => setEditing(false)}>Cancel</button>
                    <button className="btn-primary" style={{ fontSize: 13, padding: '7px 16px' }} onClick={handleSave}>Save</button>
                  </div>
                )}
              </div>

              {editing ? (
                <div className="edit-form">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input value={form.name} onChange={e => set('name', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input value={form.phone} onChange={e => set('phone', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>College</label>
                      <input value={form.college} onChange={e => set('college', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Degree</label>
                      <input value={form.degree} onChange={e => set('degree', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>LinkedIn</label>
                      <input value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="linkedin.com/in/..." />
                    </div>
                    <div className="form-group">
                      <label>GitHub</label>
                      <input value={form.github} onChange={e => set('github', e.target.value)} placeholder="github.com/..." />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Skills</label>
                    <input value={form.skills} onChange={e => set('skills', e.target.value)} placeholder="React, Python, SQL..." />
                  </div>
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={3} placeholder="Tell employers about yourself..." style={{ resize: 'vertical' }} />
                  </div>
                </div>
              ) : (
                <div className="info-grid">
                  <div className="info-item"><span className="info-label">Full Name</span><span className="info-value">{user?.name || '—'}</span></div>
                  <div className="info-item"><span className="info-label">Email</span><span className="info-value">{user?.email}</span></div>
                  <div className="info-item"><span className="info-label">Phone</span><span className="info-value">{user?.phone || '—'}</span></div>
                  <div className="info-item"><span className="info-label">College</span><span className="info-value">{user?.college || '—'}</span></div>
                  <div className="info-item"><span className="info-label">Degree</span><span className="info-value">{user?.degree || '—'}</span></div>
                  <div className="info-item"><span className="info-label">LinkedIn</span><span className="info-value">{user?.linkedin || '—'}</span></div>
                  <div className="info-item"><span className="info-label">GitHub</span><span className="info-value">{user?.github || '—'}</span></div>
                  {user?.bio && <div className="info-item full"><span className="info-label">Bio</span><span className="info-value">{user?.bio}</span></div>}
                  {user?.skills && (
                    <div className="info-item full">
                      <span className="info-label">Skills</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                        {user.skills.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                          <span key={s} className="skill-tag" style={{ padding: '4px 12px' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="profile-section card">
              <div className="section-header-row"><h3>Account Settings</h3></div>
              <div className="settings-list">
                <div className="setting-item">
                  <div>
                    <div className="setting-title">Change Password</div>
                    <div className="setting-desc">Use the forgot password flow to reset your password (once per day)</div>
                  </div>
                  <Link to="/forgot-password" className="btn-outline" style={{ fontSize: 13, padding: '7px 14px', flexShrink: 0 }}>Change</Link>
                </div>
                <div className="setting-item">
                  <div>
                    <div className="setting-title">Subscription Plan</div>
                    <div className="setting-desc">Currently on <strong style={{ color: planStyle.color }}>{planStyle.label}</strong> plan. Upgrade for more applications.</div>
                  </div>
                  <Link to="/subscription" className="btn-primary" style={{ fontSize: 13, padding: '7px 14px', flexShrink: 0 }}>Manage</Link>
                </div>
                <div className="setting-item">
                  <div>
                    <div className="setting-title">Login Activity</div>
                    <div className="setting-desc">View all login history with browser, device, OS, and IP details</div>
                  </div>
                  <Link to="/login-history" className="btn-outline" style={{ fontSize: 13, padding: '7px 14px', flexShrink: 0 }}>View</Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
