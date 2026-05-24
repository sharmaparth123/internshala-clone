import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Internships.css';

const LOCATIONS = ['All', 'Remote', 'Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hybrid', 'Noida', 'Chennai'];
const CATEGORIES = ['All', 'Technology', 'Marketing', 'Design', 'Finance', 'Content', 'Data Science', 'HR', 'Operations'];

export default function Internships() {
  const { INTERNSHIPS } = useApp();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState('All');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [stipendMin, setStipendMin] = useState('');

  const filtered = useMemo(() => {
    return INTERNSHIPS.filter(i => {
      const q = search.toLowerCase();
      const matchSearch = !q || i.title.toLowerCase().includes(q) || i.company.toLowerCase().includes(q) || i.skills.some(s => s.toLowerCase().includes(q));
      const matchLocation = location === 'All' || i.location === location;
      const matchCategory = category === 'All' || i.category === category;
      return matchSearch && matchLocation && matchCategory;
    });
  }, [INTERNSHIPS, search, location, category]);

  return (
    <div className="internships-page">
      <div className="internships-hero">
        <div className="container">
          <h1>Find Your Perfect Internship</h1>
          <p>{filtered.length} internships available</p>
          <div className="intern-search-bar">
            <input
              type="text"
              placeholder="Search by title, company, or skill..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container internships-layout">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <h3 className="filters-title">Filters</h3>

          <div className="filter-section">
            <label>Location</label>
            {LOCATIONS.map(loc => (
              <label key={loc} className="filter-radio">
                <input type="radio" name="location" checked={location === loc} onChange={() => setLocation(loc)} />
                {loc}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <label>Category</label>
            {CATEGORIES.map(cat => (
              <label key={cat} className="filter-radio">
                <input type="radio" name="category" checked={category === cat} onChange={() => setCategory(cat)} />
                {cat}
              </label>
            ))}
          </div>

          <button className="btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            onClick={() => { setSearch(''); setLocation('All'); setCategory('All'); setStipendMin(''); }}>
            Clear Filters
          </button>
        </aside>

        {/* Internship Cards */}
        <main className="internships-list">
          <div className="results-header">
            <span>{filtered.length} internships found</span>
            <select className="sort-select">
              <option>Most Recent</option>
              <option>Highest Stipend</option>
              <option>Most Applied</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 60 }}>🔍</div>
              <h3>No internships found</h3>
              <p>Try adjusting your filters or search query</p>
            </div>
          ) : (
            filtered.map(intern => (
              <Link key={intern.id} to={`/internships/${intern.id}`} className="intern-list-card card">
                <div className="intern-list-header">
                  <div className="company-logo-lg">{intern.logo}</div>
                  <div className="intern-info">
                    <h3 className="intern-list-title">{intern.title}</h3>
                    <div className="intern-list-company">{intern.company}</div>
                    <div className="intern-list-meta">
                      <span>📍 {intern.location}</span>
                      <span>⏱ {intern.duration}</span>
                      <span>💰 {intern.stipend}</span>
                      <span>🕐 {intern.posted}</span>
                    </div>
                  </div>
                  <div className="intern-list-right">
                    <span className="badge badge-blue">{intern.category}</span>
                    <div className="intern-list-openings">{intern.openings} openings</div>
                    <div className="intern-list-applicants">{intern.applicants} applied</div>
                  </div>
                </div>
                <div className="intern-list-skills">
                  {intern.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                </div>
              </Link>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
