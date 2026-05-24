import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import './InternshipDetail.css';

export default function InternshipDetail() {
  const { id } = useParams();
  const { INTERNSHIPS, user, applyToInternship, applications } = useApp();
  const navigate = useNavigate();
  const [applying, setApplying] = useState(false);

  const intern = INTERNSHIPS.find(i => i.id === parseInt(id));
  if (!intern) return <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}><h2>Internship not found</h2><Link to="/internships">← Back</Link></div>;

  const alreadyApplied = user && applications.find(a => a.userId === user.id && a.internshipId === intern.id);

  const handleApply = () => {
    if (!user) { navigate('/login'); return; }
    setApplying(true);
    setTimeout(() => {
      const result = applyToInternship(intern.id);
      setApplying(false);
      if (result.error) toast.error(result.error);
      else toast.success('Application submitted! 🎉');
    }, 600);
  };

  return (
    <div className="detail-page">
      <div className="container">
        <div className="detail-breadcrumb">
          <Link to="/internships">Internships</Link> › {intern.title}
        </div>

        <div className="detail-layout">
          <main className="detail-main">
            <div className="detail-header card">
              <div className="detail-company-row">
                <div className="detail-logo">{intern.logo}</div>
                <div>
                  <h1 className="detail-title">{intern.title}</h1>
                  <div className="detail-company">{intern.company}</div>
                </div>
                <span className="badge badge-blue" style={{ marginLeft: 'auto' }}>{intern.category}</span>
              </div>

              <div className="detail-meta-grid">
                <div className="detail-meta-item">
                  <span className="meta-icon">📍</span>
                  <div>
                    <div className="meta-label">Location</div>
                    <div className="meta-value">{intern.location}</div>
                  </div>
                </div>
                <div className="detail-meta-item">
                  <span className="meta-icon">💰</span>
                  <div>
                    <div className="meta-label">Stipend</div>
                    <div className="meta-value">{intern.stipend}</div>
                  </div>
                </div>
                <div className="detail-meta-item">
                  <span className="meta-icon">⏱</span>
                  <div>
                    <div className="meta-label">Duration</div>
                    <div className="meta-value">{intern.duration}</div>
                  </div>
                </div>
                <div className="detail-meta-item">
                  <span className="meta-icon">👥</span>
                  <div>
                    <div className="meta-label">Openings</div>
                    <div className="meta-value">{intern.openings} positions</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-section card">
              <h2>About the Internship</h2>
              <p>This is an exciting opportunity to work with {intern.company}, one of the leading companies in the {intern.category} space. As a {intern.title}, you'll gain hands-on experience working on real projects alongside experienced professionals.</p>
              <p style={{ marginTop: 12 }}>You'll be part of a dynamic team and will contribute meaningfully to the company's growth while building your skills and portfolio.</p>
            </div>

            <div className="detail-section card">
              <h2>Key Responsibilities</h2>
              <ul className="detail-list">
                <li>Work on real-world projects and deliver high-quality results</li>
                <li>Collaborate with cross-functional teams and mentors</li>
                <li>Participate in daily standups and weekly reviews</li>
                <li>Apply your {intern.skills[0]} skills to solve meaningful problems</li>
                <li>Create documentation and present your work</li>
              </ul>
            </div>

            <div className="detail-section card">
              <h2>Skills Required</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {intern.skills.map(s => (
                  <span key={s} className="skill-tag" style={{ padding: '6px 14px', fontSize: 14 }}>{s}</span>
                ))}
              </div>
            </div>

            <div className="detail-section card">
              <h2>Who Can Apply</h2>
              <ul className="detail-list">
                <li>Students from any recognized college/university</li>
                <li>Pursuing B.Tech, B.Sc, BCA, MBA or any relevant degree</li>
                <li>Available for {intern.duration} internship</li>
                <li>Strong communication skills</li>
              </ul>
            </div>
          </main>

          <aside className="detail-sidebar">
            <div className="apply-card card">
              <div className="apply-stats">
                <div className="apply-stat">
                  <span className="apply-stat-val">{intern.applicants}</span>
                  <span className="apply-stat-label">Applicants</span>
                </div>
                <div className="apply-stat">
                  <span className="apply-stat-val">{intern.openings}</span>
                  <span className="apply-stat-label">Openings</span>
                </div>
              </div>

              <div className="apply-deadline">
                🕐 Posted {intern.posted}
              </div>

              {alreadyApplied ? (
                <div className="applied-badge">
                  ✅ Application Submitted
                </div>
              ) : (
                <button
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15, borderRadius: 10 }}
                  onClick={handleApply}
                  disabled={applying}
                >
                  {applying ? 'Submitting...' : user ? 'Apply Now' : 'Login to Apply'}
                </button>
              )}

              {!user && <p style={{ fontSize: 12, color: 'var(--gray-500)', textAlign: 'center', marginTop: 10 }}>You need to be logged in to apply</p>}
              {user && !alreadyApplied && (
                <p style={{ fontSize: 12, color: 'var(--gray-500)', textAlign: 'center', marginTop: 10 }}>
                  Your plan allows {user.plan === 'gold' ? 'unlimited' : `${['free','bronze','silver'].includes(user.plan) ? {free:1,bronze:3,silver:5}[user.plan] : 1} applications`}/month
                </p>
              )}
            </div>

            <div className="company-card card">
              <h3>About {intern.company}</h3>
              <div style={{ fontSize: 40, textAlign: 'center', padding: '10px 0' }}>{intern.logo}</div>
              <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6 }}>
                {intern.company} is a leading company in India, known for innovation and excellent work culture. They hire interns round the year.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
