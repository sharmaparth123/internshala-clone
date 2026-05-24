import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp, LANGUAGES } from '../context/AppContext';
import toast from 'react-hot-toast';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, language, changeLanguage, t } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const langRef = useRef();
  const profileRef = useRef();

  useEffect(() => {
    function handler(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLangChange = (code) => {
    setLangOpen(false);
    changeLanguage(code);
    toast.success('Language changed!');
  };

  const currentLang = LANGUAGES.find(l => l.code === language);
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <div className="nav-inner container">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">Internshala</span>
          </Link>

          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <Link to="/internships" className={`nav-link ${isActive('/internships') ? 'active' : ''}`}>{t('internships')}</Link>
            {user && <Link to="/public-space" className={`nav-link ${isActive('/public-space') ? 'active' : ''}`}>{t('publicSpace')}</Link>}
            {user && <Link to="/subscription" className={`nav-link ${isActive('/subscription') ? 'active' : ''}`}>{t('subscription')}</Link>}
            {user && <Link to="/resume-builder" className={`nav-link ${isActive('/resume-builder') ? 'active' : ''}`}>{t('resumeBuilder')}</Link>}
          </div>

          <div className="nav-actions">
            {/* Language switcher */}
            <div className="lang-picker" ref={langRef}>
              <button className="lang-btn" onClick={() => setLangOpen(!langOpen)}>
                <span>{currentLang?.flag}</span>
                <span className="lang-name">{currentLang?.name}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {langOpen && (
                <div className="lang-dropdown">
                  {LANGUAGES.map(lang => (
                    <button key={lang.code} className={`lang-option ${language === lang.code ? 'selected' : ''}`} onClick={() => handleLangChange(lang.code)}>
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="profile-menu" ref={profileRef}>
                <button className="avatar-btn" onClick={() => setProfileOpen(!profileOpen)}>
                  <div className="avatar">{user.avatar || user.name?.[0]?.toUpperCase()}</div>
                  <span className="user-name">{user.name?.split(' ')[0]}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                {profileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-info">
                      <div className="avatar large">{user.avatar}</div>
                      <div>
                        <div className="profile-name">{user.name}</div>
                        <div className="profile-email">{user.email}</div>
                        <span className={`plan-badge plan-${user.plan}`}>{user.plan?.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/dashboard" className="dropdown-item" onClick={() => setProfileOpen(false)}>📊 {t('dashboard')}</Link>
                    <Link to="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>👤 {t('profile')}</Link>
                    <Link to="/login-history" className="dropdown-item" onClick={() => setProfileOpen(false)}>🔐 Login History</Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout" onClick={() => { logout(); navigate('/'); toast.success('Logged out!'); }}>🚪 Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-btns">
                <Link to="/login" className="btn-outline" style={{ padding: '8px 18px', fontSize: '13px' }}>{t('login')}</Link>
                <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>{t('register')}</Link>
              </div>
            )}

            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
