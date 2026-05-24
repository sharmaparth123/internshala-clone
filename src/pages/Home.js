import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Home.css';

const CATEGORIES = [
  { icon: '💻', label: 'Technology', count: '12,400+' },
  { icon: '📊', label: 'Marketing', count: '8,200+' },
  { icon: '🎨', label: 'Design', count: '5,600+' },
  { icon: '💰', label: 'Finance', count: '4,100+' },
  { icon: '✍️', label: 'Content', count: '7,300+' },
  { icon: '🧪', label: 'Data Science', count: '3,900+' },
  { icon: '👥', label: 'HR', count: '2,800+' },
  { icon: '🏢', label: 'Operations', count: '3,100+' },
];

const STATS = [
  { value: '21,000+', label: 'Active Internships' },
  { value: '16M+', label: 'Students' },
  { value: '100K+', label: 'Companies' },
  { value: '1M+', label: 'Offers Given' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', college: 'IIT Delhi', text: 'Got my dream internship at Google through Internshala. The platform is incredibly easy to use!', avatar: 'P', company: 'Google' },
  { name: 'Rahul Gupta', college: 'NIT Trichy', text: 'Found a great paid internship within a week. The filter system helped me find exactly what I needed.', avatar: 'R', company: 'Flipkart' },
  { name: 'Anjali Singh', college: 'BITS Pilani', text: 'Internshala helped me build my career. Got selected for 3 internships in a single month!', avatar: 'A', company: 'Zomato' },
];

export default function Home() {
  const { t, INTERNSHIPS } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/internships${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-badge">
            <span>🚀</span> India's #1 Internship Platform
          </div>
          <h1 className="hero-title">{t('welcome')}</h1>
          <p className="hero-subtitle">{t('subtitle')}</p>

          <form className="search-bar" onSubmit={handleSearch}>
            <div className="search-input-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text"
                placeholder="Search internships, companies, or skills..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ border: 'none', boxShadow: 'none', fontSize: 15 }}
              />
            </div>
            <button type="submit" className="btn-primary search-btn">Search</button>
          </form>

          <div className="hero-tags">
            {['React Developer', 'Marketing', 'Data Science', 'UI/UX Design', 'Finance'].map(tag => (
              <button key={tag} className="hero-tag" onClick={() => navigate(`/internships?q=${tag}`)}>{tag}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container stats-grid">
          {STATS.map(s => (
            <div key={s.label} className="stat-item">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-sub">Find internships in your field of interest</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link key={cat.label} to={`/internships?category=${cat.label}`} className="category-card card">
                <div className="cat-icon">{cat.icon}</div>
                <div className="cat-label">{cat.label}</div>
                <div className="cat-count">{cat.count} Internships</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Internships */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Internships</h2>
            <Link to="/internships" className="see-all">View All →</Link>
          </div>
          <div className="internships-grid">
            {INTERNSHIPS.slice(0, 6).map(intern => (
              <Link key={intern.id} to={`/internships/${intern.id}`} className="intern-card card">
                <div className="intern-header">
                  <div className="company-logo">{intern.logo}</div>
                  <div>
                    <div className="intern-title">{intern.title}</div>
                    <div className="intern-company">{intern.company}</div>
                  </div>
                  <span className="badge badge-blue" style={{ marginLeft: 'auto', flexShrink: 0 }}>{intern.category}</span>
                </div>
                <div className="intern-meta">
                  <span>📍 {intern.location}</span>
                  <span>⏱ {intern.duration}</span>
                  <span>💰 {intern.stipend}</span>
                </div>
                <div className="intern-skills">
                  {intern.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                </div>
                <div className="intern-footer">
                  <span className="posted-time">🕐 {intern.posted}</span>
                  <span className="openings">{intern.openings} openings</span>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/internships" className="btn-outline">View All Internships</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Success Stories</h2>
            <p className="section-sub">Students who found their dream internships</p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="testimonial-card card">
                <div className="quote-mark">"</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="avatar">{t.avatar}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-college">{t.college} → {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to start your career?</h2>
            <p>Join 16 million+ students who found their dream internships</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ padding: '12px 32px', fontSize: 16 }}>Get Started Free</Link>
              <Link to="/internships" className="btn-outline" style={{ padding: '12px 32px', fontSize: 16, borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}>Browse Internships</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">🎓 Internshala</div>
              <p className="footer-desc">India's leading platform for internships and fresher jobs.</p>
            </div>
            <div>
              <h4>For Students</h4>
              <ul>
                <li><Link to="/internships">Internships</Link></li>
                <li><Link to="/resume-builder">Resume Builder</Link></li>
                <li><Link to="/subscription">Premium Plans</Link></li>
              </ul>
            </div>
            <div>
              <h4>Community</h4>
              <ul>
                <li><Link to="/public-space">Public Space</Link></li>
                <li><Link to="/login-history">Login History</Link></li>
              </ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Use</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Internshala Clone. Built for educational purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
