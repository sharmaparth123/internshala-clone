import React from 'react';
import { useApp } from '../context/AppContext';
import './LoginHistory.css';

const BROWSER_ICONS = { Chrome: '🌐', Firefox: '🦊', Safari: '🧭', Edge: '🔷', Unknown: '❓' };
const OS_ICONS = { Windows: '🪟', macOS: '🍎', Android: '🤖', iOS: '📱', Linux: '🐧', Unknown: '💻' };
const DEVICE_ICONS = { Desktop: '🖥', Laptop: '💻', Mobile: '📱', Tablet: '📟' };

export default function LoginHistory() {
  const { user, loginHistory } = useApp();

  const myHistory = loginHistory.filter(h => h.userId === user?.id);

  const getSecurityNote = (entry) => {
    if (entry.browser === 'Chrome') return { label: 'OTP Verified', color: 'green' };
    if (entry.device === 'Mobile') return { label: 'Time-Restricted', color: 'orange' };
    return { label: 'Standard Login', color: 'blue' };
  };

  return (
    <div className="login-history-page">
      <div className="container">
        <div className="lh-header">
          <div>
            <h1>Login History</h1>
            <p>All login attempts to your account — browser, device, OS and IP recorded</p>
          </div>
          <div className="lh-count">{myHistory.length} login records</div>
        </div>

        <div className="lh-rules card">
          <h3>🔐 Security Access Rules</h3>
          <div className="rules-grid">
            <div className="rule-block">
              <div className="rule-icon">🌐</div>
              <div>
                <div className="rule-title">Chrome Browser</div>
                <div className="rule-desc">Requires OTP verification sent to your registered email before granting access.</div>
              </div>
            </div>
            <div className="rule-block">
              <div className="rule-icon">📱</div>
              <div>
                <div className="rule-title">Mobile Devices</div>
                <div className="rule-desc">Access allowed only between <strong>10:00 AM – 1:00 PM IST</strong>. Blocked outside this window.</div>
              </div>
            </div>
            <div className="rule-block">
              <div className="rule-icon">🖥️</div>
              <div>
                <div className="rule-title">Other Browsers</div>
                <div className="rule-desc">Standard login with email and password. No time restrictions apply.</div>
              </div>
            </div>
          </div>
        </div>

        {myHistory.length === 0 ? (
          <div className="empty-history card">
            <div style={{ fontSize: 56 }}>🔍</div>
            <h3>No login history yet</h3>
            <p>Your login activity will appear here after you log in and out.</p>
          </div>
        ) : (
          <div className="history-list">
            {myHistory.map((entry, i) => {
              const note = getSecurityNote(entry);
              const date = new Date(entry.timestamp);
              const isRecent = (Date.now() - date.getTime()) < 60 * 60 * 1000;
              return (
                <div key={i} className={`history-card card ${i === 0 ? 'latest' : ''}`}>
                  {i === 0 && <div className="latest-badge">Most Recent</div>}

                  <div className="history-main">
                    <div className="history-device-icon">
                      {DEVICE_ICONS[entry.device] || '💻'}
                    </div>

                    <div className="history-details">
                      <div className="history-row-top">
                        <span className="history-browser">
                          {BROWSER_ICONS[entry.browser] || '🌐'} {entry.browser}
                        </span>
                        <span className="history-os">
                          {OS_ICONS[entry.os] || '💻'} {entry.os}
                        </span>
                        <span className="history-device-label">
                          {DEVICE_ICONS[entry.device]} {entry.device}
                        </span>
                      </div>

                      <div className="history-row-bottom">
                        <span className="history-ip">🌍 IP: {entry.ip}</span>
                        <span className="history-time">
                          🕐 {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' '}at{' '}
                          {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          {isRecent && <span className="recent-tag">Just now</span>}
                        </span>
                      </div>
                    </div>

                    <div className="history-security">
                      <span className={`security-badge security-${note.color}`}>
                        {note.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="lh-legend card">
          <h4>Legend</h4>
          <div className="legend-items">
            <span className="security-badge security-green">OTP Verified</span>
            <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>= Chrome browser login with OTP</span>
            <span className="security-badge security-orange">Time-Restricted</span>
            <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>= Mobile login (10AM–1PM only)</span>
            <span className="security-badge security-blue">Standard Login</span>
            <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>= Other browsers, no restrictions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
