import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import momPhoto from '../assets/mom_photo2.jpeg';

const SERVE_ITEMS = [
  { key: 'Breakfast' },
  { key: 'Lunch' },
  { key: 'Chinese' },
  { key: 'Sides' },
  { key: 'Drinks' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="page-container-narrow" style={{
      background: 'linear-gradient(160deg, #fff8f0 0%, #fff3e0 50%, #ffecd2 100%)',
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <LanguageSwitcher />

      {/* ── Brand header ── */}
      <div style={{ textAlign: 'center', padding: '1.5rem 1.5rem 0' }}>
        {/* Logo with glow pulse */}
        <div
          className="logo-pulse"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
            borderRadius: 16,
            padding: '10px 28px',
            marginBottom: 8,
          }}
        >
          <span style={{
            fontSize: 28, fontWeight: 800, color: '#fff',
            letterSpacing: 1, fontFamily: "'Georgia', serif",
          }}>
            Kumar's Kitchen
          </span>
        </div>
        <p style={{ color: '#e74c3c', fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>
          {t('tasteWithLove')}
        </p>
      </div>

      {/* ── Chef section — clickable, navigates to /chef ── */}
      <div
        className="hover-lift"
        onClick={() => navigate('/chef')}
        style={{
          margin: '1.5rem 1.5rem 0',
          background: '#fff',
          borderRadius: 20,
          padding: '1.25rem',
          boxShadow: '0 2px 20px rgba(0,0,0,0.07)',
          display: 'flex',
          gap: 14,
          alignItems: 'center',
        }}
      >
        <div style={{
          width: 80, height: 80,
          borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
          border: '3px solid #e74c3c',
          boxShadow: '0 2px 12px rgba(231,76,60,0.2)',
        }}>
          <img
            src={momPhoto}
            alt="Beena Pradhan"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, color: '#e74c3c', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>
            {t('chefAndOwner')}
          </p>
          <p style={{ fontSize: 17, fontWeight: 700, color: '#222', marginBottom: 4 }}>
            Beena Pradhan
          </p>
          <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>
            {t('chefWelcomeMsg')}
          </p>
          {/* View Profile hint */}
          <p style={{ fontSize: 12, color: '#e74c3c', fontWeight: 700, marginTop: 8, textAlign: 'right' }}>
            View Profile →
          </p>
        </div>
      </div>

      {/* ── Category showcase with stagger ── */}
      <div style={{ padding: '1.25rem 1.5rem 0' }}>
        <p style={{ fontSize: 12, color: '#999', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
          {t('weServe')}
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SERVE_ITEMS.map((item, idx) => (
            <div
              key={item.key}
              className="pill-stagger"
              style={{
                '--i': idx,
                background: '#fff', border: '1.5px solid #ffe0cc',
                borderRadius: 20, padding: '5px 12px',
                fontSize: 13, color: '#c0392b', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              {t(`dishCategories.${item.key}`)}
            </div>
          ))}
        </div>
      </div>

      {/* ── Anonymous badge ── */}
      <div style={{ padding: '1.25rem 1.5rem 0' }}>
        <div style={{
          background: '#f0fff4', border: '1.5px solid #b2dfdb',
          borderRadius: 12, padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <p style={{ fontSize: 13, color: '#27ae60', fontWeight: 600, margin: 0 }}>
            {t('anonymous')} — {t('noLoginNoData')}
          </p>
        </div>
      </div>

      {/* ── CTA Button with shimmer ── */}
      <div style={{ padding: '1.5rem' }}>
        <button
          className="btn-shimmer"
          onClick={() => navigate('/menu/table-1')}
          style={{
            width: '100%', padding: '1.1rem',
            fontSize: 18, fontWeight: 700,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
            color: '#fff', border: 'none',
            boxShadow: '0 6px 20px rgba(231,76,60,0.35)',
            letterSpacing: 0.5, cursor: 'pointer',
          }}
        >
          {t('giveFeedback')} →
        </button>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#bbb', marginTop: 10 }}>
          {t('takesLessMinute')}
        </p>
      </div>

      {/* ── Footer ── */}
      <div style={{
        textAlign: 'center', padding: '0 1.5rem 2rem',
        borderTop: '1px solid #f5e6d8', marginTop: 8, paddingTop: '1rem',
      }}>
        <p style={{ fontSize: 12, color: '#ccc' }}>
          Kumar's Kitchen © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
