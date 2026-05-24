import React from 'react';
import { Link } from 'react-router-dom';
import { useApp, PLANS } from '../context/AppContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user, getUserApplications, INTERNSHIPS } = useApp();
  const myApplications = getUserApplications();
  const plan = PLANS.find(p => p.id === user.plan);
  const appliedCount = user.applicationsThisMonth || 0;
  const limit = plan.applications === Infinity ? '∞' : plan.applications;
  const percent = plan.applications === Infinity ? 0 : Math.min((appliedCount / plan.applications) * 100, 100);

  const quickLinks = [
    { icon: '🔍', label: 'Browse Internships', to: '/internships', color: '#e8f1ff', iconBg: 'var(--blue)' },
    { icon: '📄', label: 'Build Resume', to: '/resume-builder', color: '#e6f7ee', iconBg: 'var(--green)' },
    { icon: '💬', label: 'Public Space', to: '/public-space', color: '#fff3ee', iconBg: 'var(--orange)' },
    { icon: '⭐', label: 'Upgrade Plan', to: '/subscription', color: '#fff8e1', iconBg: 'var(--yellow)' },
    { icon: '🔐', label: 'Login History', to: '/login-history', color: '#f3e8ff', iconBg: '#9333ea' },
    { icon: '👤', label: 'Edit Profile', to: '/profile', color: '#fee2e2', iconBg: 'var(--red)' },
  ];

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-avatar">{user.avatar}</div>
          <div>
            <h1>Welcome back, {user.name?.split(' ')[0]}! 👋</h1>
            <p>{user.college} • {user.degree} • Joined {new Date(user.joinedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
          </div>
          <div className={`plan-tag plan-${user.plan}`}>{user.plan?.toUpperCase()} PLAN</div>
        </div>

        {/* Stats Row */}
        <div className="dashboard-stats">
          <div className="stat-card card">
            <div className="stat-icon" style={{ background: 'var(--blue-light)', color: 'var(--blue)' }}>📋</div>
            <div>
              <div className="stat-num">{myApplications.length}</div>
              <div className="stat-lbl">Total Applications</div>
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>✅</div>
            <div>
              <div className="stat-num">{appliedCount}</div>
              <div className="stat-lbl">Applied This Month</div>
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon" style={{ background: '#fff3ee', color: 'var(--orange)' }}>👥</div>
            <div>
              <div className="stat-num">{(user.friends || []).length}</div>
              <div className="stat-lbl">Friends</div>
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon" style={{ background: '#fff8e1', color: 'var(--yellow)' }}>📄</div>
            <div>
              <div className="stat-num">{user.resume ? '1' : '0'}</div>
              <div className="stat-lbl">Resumes</div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Quick Links */}
          <div className="dashboard-card card">
            <h2 className="card-title">Quick Links</h2>
            <div className="quick-links-grid">
              {quickLinks.map(link => (
                <Link key={link.to} to={link.to} className="quick-link" style={{ background: link.color }}>
                  <div className="quick-link-icon" style={{ background: link.iconBg }}>{link.icon}</div>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Plan Usage */}
          <div className="dashboard-card card">
            <h2 className="card-title">Plan Usage</h2>
            <div className="plan-usage">
              <div className="plan-header">
                <div>
                  <span className={`plan-badge plan-${user.plan}`} style={{ fontSize: 13, padding: '4px 12px' }}>{plan.name} Plan</span>
                  <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 6 }}>{plan.desc}</div>
                </div>
                <Link to="/subscription" className="upgrade-link">Upgrade →</Link>
              </div>
              <div className="usage-bar-wrap">
                <div className="usage-bar-track">
                  <div className="usage-bar-fill" style={{ width: `${percent}%`, background: percent >= 90 ? 'var(--red)' : percent >= 70 ? 'var(--orange)' : 'var(--blue)' }} />
                </div>
                <div className="usage-text">{appliedCount} / {limit} applications used this month</div>
              </div>
              <div className="plan-perks">
                {plan.perks.map(p => <div key={p} className="plan-perk">✓ {p}</div>)}
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="dashboard-card card span-full">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 className="card-title" style={{ marginBottom: 0 }}>My Applications</h2>
              <Link to="/internships" className="btn-outline" style={{ padding: '6px 16px', fontSize: 13 }}>Apply More</Link>
            </div>
            {myApplications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--gray-400)' }}>
                <div style={{ fontSize: 48 }}>📭</div>
                <p style={{ marginTop: 12 }}>No applications yet. <Link to="/internships" style={{ color: 'var(--blue)' }}>Browse internships</Link></p>
              </div>
            ) : (
              <div className="applications-list">
                {myApplications.map(app => app.internship && (
                  <div key={app.id} className="application-item">
                    <div className="app-logo">{app.internship.logo}</div>
                    <div className="app-info">
                      <div className="app-title">{app.internship.title}</div>
                      <div className="app-company">{app.internship.company} • {app.internship.location}</div>
                    </div>
                    <div className="app-right">
                      <span className="badge badge-blue">{app.status}</span>
                      <div className="app-date">{new Date(app.appliedAt).toLocaleDateString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
