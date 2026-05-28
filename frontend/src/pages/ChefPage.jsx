import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import momPhoto from '../assets/mom_photo2.jpeg';

function CountUp({ to, suffix = '', duration = 1500, trigger }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(to); return;
    }
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round(p * to));
      if (p < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, trigger]);
  return <>{val}{suffix}</>;
}

const FLOAT_CARDS = [
  { line1: '20+ Years',  line2: 'of Experience',   cls: 'chef-card-1' },
  { line1: '22 Dishes', line2: 'on Menu',          cls: 'chef-card-2' },
  { line1: '100s',       line2: 'Happy Customers',  cls: 'chef-card-3' },
  { line1: 'Made with',  line2: 'Love',             cls: 'chef-card-4' },
];

const STORY = [
  { title: 'Master of Chinese Cuisine', desc: "Her noodles and fried rice have earned a loyal fanbase that keeps coming back for more." },
  { title: 'Breakfast Expert',           desc: "Her Aloo Parantha and Puri are the reason many customers start their mornings at Kumar's Kitchen." },
  { title: 'Prepared with Care',        desc: "Every dish is personally overseen by Beena to ensure quality, freshness, and love in every bite." },
];

const STATS = [
  { to: 20,  suffix: '+', label: 'Years of Experience' },
  { to: 22,  suffix: '',  label: 'Dishes on Menu' },
  { to: 500, suffix: '+', label: 'Customers Served' },
];

const CONTACT_ROWS = [
  { title: "Kumar's Kitchen", sub: 'K.Mallasandra, Kadugodi, Bengaluru - 560067' },
  { title: 'Hours',           sub: 'Open daily — Breakfast, Lunch & Dinner' },
  { title: null,              sub: 'Walk in or scan the QR code on your table to give feedback' },
];

export default function ChefPage() {
  const navigate   = useNavigate();
  const contactRef = useRef(null);
  const statsRef   = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes chefFloat {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes chefFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .chef-wrap { overflow-x: hidden; }

        .chef-hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          gap: 4rem;
          padding: 2rem 4rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .chef-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
          animation: chefFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }
        .chef-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          animation: chefFadeUp 0.7s 0.22s cubic-bezier(0.22,1,0.36,1) both;
        }

        .chef-circle-wrapper {
          position: relative;
          width: 380px;
          height: 380px;
          flex-shrink: 0;
        }
        .chef-circle-box {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #3d1c0e;
          overflow: hidden;
        }

        .chef-float-card {
          position: absolute;
          background: #ffffff;
          border-radius: 14px;
          padding: 10px 14px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.13);
          display: flex;
          align-items: center;
          gap: 10px;
          white-space: nowrap;
          z-index: 10;
        }
        .chef-card-1 { top: 40px;    left:  -95px; animation: chefFloat 3.2s ease-in-out infinite; }
        .chef-card-2 { top: 40px;    right: -95px; animation: chefFloat 3.2s 0.8s ease-in-out infinite; }
        .chef-card-3 { bottom: 55px; left:  -95px; animation: chefFloat 3.2s 1.6s ease-in-out infinite; }
        .chef-card-4 { bottom: 55px; right: -95px; animation: chefFloat 3.2s 0.4s ease-in-out infinite; }

        .chef-desktop-cards { display: block; }
        .chef-mobile-grid   { display: none; }

        .chef-story-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .chef-story-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        .chef-story-card:hover { transform: translateY(-6px); box-shadow: 0 14px 36px rgba(0,0,0,0.12) !important; }

        .chef-stats-grid {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          justify-content: space-around;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .chef-contact-btn { transition: background 0.2s, transform 0.2s, box-shadow 0.2s; }
        .chef-contact-btn:hover {
          background: #5a2d1a !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(61,28,14,0.28);
        }

        /* Mobile-only hero elements — hidden on desktop */
        .chef-mobile-label   { display: none; }
        .chef-mobile-name    { display: none; }
        .chef-mobile-loc     { display: none; }
        .chef-mobile-divider { display: none; }
        .chef-sprig          { display: none; }

        /* Sprig + circle wrapper — transparent on desktop */
        .chef-sprig-wrap {
          position: relative;
          display: flex;
          justify-content: center;
          width: 100%;
        }

        /* Tablet */
        @media (min-width: 768px) and (max-width: 1024px) {
          .chef-hero { padding: 2rem 2.5rem; gap: 2.5rem; }
          .chef-circle-wrapper { width: 300px; height: 300px; }
          .chef-card-1 { top: 30px;    left:  -80px; }
          .chef-card-2 { top: 30px;    right: -80px; }
          .chef-card-3 { bottom: 40px; left:  -80px; }
          .chef-card-4 { bottom: 40px; right: -80px; }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .chef-hero {
            flex-direction: column;
            min-height: auto;
            padding: 5rem 1.25rem 3rem;
            gap: 2rem;
            overflow-x: hidden;
          }
          .chef-left  { order: 2; text-align: center; align-items: center; }
          .chef-right { order: 1; width: 100%; flex: none; }
          .chef-circle-wrapper { width: 240px; height: 240px; }
          .chef-desktop-cards { display: none; }
          .chef-mobile-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 0;
            width: 100%;
            max-width: 300px;
          }
          .chef-sprig-wrap { overflow: hidden; max-width: 100%; }
          .chef-mobile-label {
            display: block;
            font-size: 11px;
            color: #e74c3c;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 12px;
            text-align: center;
          }
          .chef-mobile-name {
            display: block;
            font-size: 20px;
            font-weight: 700;
            color: #2d2d2d;
            text-align: center;
            margin: 12px 0 2px;
          }
          .chef-mobile-loc {
            display: block;
            font-size: 12px;
            color: #e74c3c;
            letter-spacing: 0.5px;
            text-align: center;
            margin: 0 0 8px;
          }
          .chef-mobile-divider {
            display: flex;
            align-items: center;
            gap: 8px;
            justify-content: center;
            margin-bottom: 16px;
          }
          .chef-sprig {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
          }
          .chef-h1 { font-size: 1.6rem !important; line-height: 1.3 !important; }
          .chef-inline-stats { flex-direction: column !important; align-items: center !important; gap: 4px !important; }
          .chef-stat-dot { display: none; }
          .chef-sub-p { max-width: 100% !important; }
          .chef-story-grid { grid-template-columns: 1fr; }
          .chef-stats-grid { flex-direction: column; align-items: center; }
        }

        @media (prefers-reduced-motion: reduce) {
          .chef-left, .chef-right { animation: none; }
          .chef-float-card { animation: none !important; }
          .chef-story-card { transition: none; }
          .chef-contact-btn { transition: none; }
        }
      `}</style>

      <div
        className="chef-wrap"
        style={{ background: '#fdf6f0', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", color: '#2d2d2d' }}
      >
        {/* Fixed back button */}
        <button
          onClick={() => navigate('/')}
          aria-label="Back to Home"
          style={{
            position: 'fixed', top: 20, left: 20, zIndex: 200,
            width: 44, height: 44, borderRadius: '50%',
            background: '#fff', border: 'none',
            boxShadow: '0 2px 14px rgba(0,0,0,0.14)',
            fontSize: 20, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#2d2d2d',
          }}
        >
          ←
        </button>

        {/* ── Hero ── */}
        <div className="chef-hero">

          {/* Left */}
          <div className="chef-left">
            <span style={{ fontSize: 13, fontWeight: 700, color: '#e74c3c', letterSpacing: 0.4 }}>
              Chef &amp; Owner — Kumar's Kitchen
            </span>

            <h1
              className="chef-h1"
              style={{
                fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.2,
                color: '#3d1c0e', margin: 0,
                fontFamily: "'Georgia', serif", wordBreak: 'break-word',
              }}
            >
              This Is Beena.<br />
              The Heart &amp; Soul<br />
              Behind Kumar's Kitchen
            </h1>

            <p
              className="chef-sub-p"
              style={{ fontSize: 15, color: '#555', lineHeight: 1.85, margin: 0, maxWidth: 460, wordBreak: 'break-word' }}
            >
              With over 20 years of cooking experience, Beena Pradhan has built Kumar's Kitchen
              on one simple belief — food made with love tastes different. Every dish on the
              menu is her personal recipe, crafted fresh every day.
            </p>

            <div>
              <button
                className="chef-contact-btn"
                onClick={() => contactRef.current?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  background: '#3d1c0e', color: '#fff',
                  border: 'none', borderRadius: 10,
                  padding: '0.8rem 2rem', fontSize: 15, fontWeight: 700,
                  cursor: 'pointer', letterSpacing: 0.3, minHeight: 44,
                }}
              >
                Contact
              </button>
            </div>

            <div
              className="chef-inline-stats"
              style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 13, color: '#777', fontWeight: 600 }}
            >
              <span>20+ Years Experience</span>
              <span className="chef-stat-dot" style={{ color: '#d0c8c0' }}>·</span>
              <span>22 Dishes</span>
              <span className="chef-stat-dot" style={{ color: '#d0c8c0' }}>·</span>
              <span>100s of Happy Customers</span>
            </div>
          </div>

          {/* Right */}
          <div className="chef-right">

            {/* Mobile-only: label above photo */}
            <p className="chef-mobile-label">Chef &amp; Owner</p>

            {/* Photo + decorative sprigs wrapper */}
            <div className="chef-sprig-wrap">

              {/* Left sprig — mobile only */}
              <div
                className="chef-sprig"
                style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }}
              >
                <div style={{ width: 8, height: 20, background: '#c0392b', borderRadius: '50% 50% 50% 0', transform: 'rotate(-30deg)', opacity: 0.5 }} />
                <div style={{ width: 8, height: 16, background: '#c0392b', borderRadius: '50% 50% 50% 0', transform: 'rotate(-20deg)', marginLeft: 4, opacity: 0.5 }} />
                <div style={{ width: 6, height: 12, background: '#c0392b', borderRadius: '50% 50% 50% 0', transform: 'rotate(-10deg)', marginLeft: 6, opacity: 0.5 }} />
              </div>

              {/* Circle */}
              <div className="chef-circle-wrapper">
                <div className="chef-circle-box">
                  <img
                    src={momPhoto}
                    alt="Beena Pradhan"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', maxWidth: '100%' }}
                  />
                </div>

                {/* Desktop floating cards */}
                <div className="chef-desktop-cards">
                  {FLOAT_CARDS.map(card => (
                    <div key={card.cls} className={`chef-float-card ${card.cls}`}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#2d2d2d' }}>{card.line1}</div>
                        <div style={{ fontSize: 11, color: '#888', fontWeight: 500 }}>{card.line2}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right sprig — mobile only */}
              <div
                className="chef-sprig"
                style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)' }}
              >
                <div style={{ width: 8, height: 20, background: '#c0392b', borderRadius: '50% 0 50% 50%', transform: 'rotate(30deg)', opacity: 0.5 }} />
                <div style={{ width: 8, height: 16, background: '#c0392b', borderRadius: '50% 0 50% 50%', transform: 'rotate(20deg)', marginRight: 4, opacity: 0.5 }} />
                <div style={{ width: 6, height: 12, background: '#c0392b', borderRadius: '50% 0 50% 50%', transform: 'rotate(10deg)', marginRight: 6, opacity: 0.5 }} />
              </div>
            </div>

            {/* Mobile-only: name + location below photo */}
            <p className="chef-mobile-name">Beena Pradhan</p>
            <p className="chef-mobile-loc">Kumar's Kitchen, Bengaluru</p>

            {/* Mobile-only: dotted divider */}
            <div className="chef-mobile-divider">
              <div style={{ width: 30, height: 1, background: 'rgba(231,76,60,0.3)' }} />
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#e74c3c', opacity: 0.4 }} />
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#e74c3c', opacity: 0.6 }} />
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#e74c3c', opacity: 0.4 }} />
              <div style={{ width: 30, height: 1, background: 'rgba(231,76,60,0.3)' }} />
            </div>

            {/* Mobile 2×2 stat cards */}
            <div className="chef-mobile-grid">
              {FLOAT_CARDS.map(card => (
                <div
                  key={card.cls + '-m'}
                  style={{
                    background: '#fff', borderRadius: 12, padding: '10px 12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    display: 'flex', alignItems: 'center', gap: 8, minHeight: 44,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#2d2d2d' }}>{card.line1}</div>
                    <div style={{ fontSize: 10, color: '#888' }}>{card.line2}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Her Story ── */}
        <section style={{ background: '#ffffff', padding: '5rem 2rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: '#e74c3c', marginBottom: 8 }}>
              Background
            </p>
            <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, color: '#3d1c0e', marginBottom: '3rem', fontFamily: "'Georgia', serif" }}>
              Her Story
            </h2>
            <div className="chef-story-grid">
              {STORY.map(item => (
                <div
                  key={item.title}
                  className="chef-story-card"
                  style={{
                    background: '#fdf6f0', borderRadius: 16, padding: '2rem 1.5rem',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)', borderTop: '3px solid #e74c3c',
                  }}
                >
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#3d1c0e', marginBottom: 10, lineHeight: 1.3 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, margin: 0, wordBreak: 'break-word' }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Animated Stats ── */}
        <section ref={statsRef} style={{ background: '#3d1c0e', padding: '5rem 2rem' }}>
          <div className="chef-stats-grid">
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center', flex: '1 1 180px' }}>
                <p style={{ fontSize: '3.5rem', fontWeight: 800, color: '#e74c3c', margin: 0, lineHeight: 1, fontFamily: "'Georgia', serif" }}>
                  <CountUp to={s.to} suffix={s.suffix} trigger={statsVisible} />
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 10, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 600 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Visit Us / Contact ── */}
        <section ref={contactRef} style={{ background: '#fdf6f0', padding: '5rem 2rem' }}>
          <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: '#e74c3c', marginBottom: 8 }}>
              Location
            </p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#3d1c0e', marginBottom: '2rem', fontFamily: "'Georgia', serif" }}>
              Visit Us
            </h2>

            <div style={{
              background: '#fff', borderRadius: 20, padding: '2rem 1.75rem',
              boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
              marginBottom: '1.75rem', textAlign: 'left',
              display: 'flex', flexDirection: 'column', gap: '1.1rem',
            }}>
              {CONTACT_ROWS.map((row, i, arr) => (
                <div key={row.icon}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div>
                      {row.title && (
                        <p style={{ fontWeight: 700, color: '#2d2d2d', margin: 0, fontSize: 14 }}>{row.title}</p>
                      )}
                      <p style={{ color: '#666', margin: row.title ? '2px 0 0' : 0, fontSize: 14, lineHeight: 1.6 }}>
                        {row.sub}
                      </p>
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ height: 1, background: '#f0ece8', marginTop: '1.1rem' }} />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/')}
              style={{
                background: '#e74c3c', color: '#fff',
                border: 'none', borderRadius: 10,
                padding: '0.85rem 2rem', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', minHeight: 44,
                boxShadow: '0 4px 14px rgba(231,76,60,0.25)',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              Give Feedback →
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
