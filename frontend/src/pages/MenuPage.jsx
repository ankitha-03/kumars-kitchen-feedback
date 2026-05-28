import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import LanguageSwitcher from '../components/LanguageSwitcher';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';


/* ── Skeleton card while loading ── */
function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
      <div className="skeleton" style={{ height: 100 }} />
      <div style={{ padding: '8px 10px 10px' }}>
        <div className="skeleton" style={{ height: 12, borderRadius: 6, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 10, borderRadius: 6, width: '55%' }} />
      </div>
    </div>
  );
}

/* ── Error screen with retry ── */
function ErrorScreen({ message, onRetry, t }) {
  return (
    <div style={{
      minHeight: '100vh', background: '#f8f9fa',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center', padding: '2rem 1.5rem', maxWidth: 340 }}>
        <h3 style={{ marginBottom: 8, color: '#222' }}>{t('errorLoadMenu')}</h3>
        <p style={{ color: '#888', marginBottom: 24, lineHeight: 1.6, fontSize: 14 }}>{message}</p>
        <button
          onClick={onRetry}
          style={{
            padding: '0.8rem 2rem',
            background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
            color: '#fff', border: 'none', borderRadius: 12,
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(231,76,60,0.35)',
          }}
        >
          {t('retry')}
        </button>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const { tableId } = useParams();
  const navigate    = useNavigate();
  const { t } = useTranslation();

  const [dishes,    setDishes]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const loadDishes = useCallback(() => {
    setLoading(true);
    setError('');
    axios.get(`${API_URL}/api/menu`)
      .then(res => {
        if (Array.isArray(res.data)) setDishes(res.data);
        else setError(t('errorLoadMenu'));
      })
      .catch(() => setError(t('errorBackend')))
      .finally(() => setLoading(false));
  }, [t]);

  useEffect(() => { loadDishes(); }, [loadDishes]);

  const categories = ['All', ...new Set(dishes.map(d => d.category))];
  const filtered   = activeTab === 'All' ? dishes : dishes.filter(d => d.category === activeTab);

  if (loading) return (
    <div className="page-container-narrow" style={{ background: '#f8f9fa' }}>
      <LanguageSwitcher />
      <div style={{
        background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
        padding: '1rem 1.2rem 1.5rem', color: '#fff',
      }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>{t('selectDish')}</h2>
        <p style={{ fontSize: 12, opacity: 0.85 }}>{t('loading')}</p>
      </div>
      <div className="dish-grid">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );

  if (error) return <ErrorScreen message={error} onRetry={loadDishes} t={t} />;

  return (
    <div className="page-container-narrow" style={{ background: '#f8f9fa' }}>
      <LanguageSwitcher />

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
        padding: '1rem 1.2rem 1.5rem', color: '#fff',
      }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>
          {t('selectDish')}
        </h2>
        <p style={{ fontSize: 12, opacity: 0.85 }}>
          {t('tableLabel')}: {tableId.replace('-', ' ')} &nbsp;·&nbsp; {dishes.length} {t('itemsAvailable')}
        </p>
      </div>

      {/* Category tabs */}
      <div style={{
        display: 'flex', gap: 8, padding: '0.75rem 1rem',
        overflowX: 'auto', background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
      }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveTab(cat)}
            className="tab-btn"
            style={{
              whiteSpace: 'nowrap',
              padding: '6px 14px', borderRadius: 20, border: 'none',
              background: activeTab === cat ? '#e74c3c' : '#f0f0f0',
              color:      activeTab === cat ? '#fff' : '#555',
              fontWeight: 600, fontSize: 13, cursor: 'pointer', flexShrink: 0,
            }}>
            {t(`dishCategories.${cat}`, cat)}
          </button>
        ))}
      </div>

      {/* Dish grid — each card staggered in */}
      <div className="dish-grid">
        {filtered.map((dish, index) => (
          <div key={dish._id}
            className="dish-card-anim"
            onClick={() => navigate(`/feedback/${tableId}/${dish._id}`, { state: { dish } })}
            style={{
              '--i': index,
              background: '#fff', borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)', cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.13)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)'; }}
            onTouchStart={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ position: 'relative' }}>
              <img src={dish.image} alt={dish.name}
                style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'; }}
              />
              <span style={{
                position: 'absolute', top: 6, left: 6,
                background: 'rgba(0,0,0,0.55)', color: '#fff',
                fontSize: 10, padding: '2px 7px', borderRadius: 10, fontWeight: 600,
              }}>
                {t(`dishCategories.${dish.category}`, dish.category)}
              </span>
            </div>
            <div style={{ padding: '8px 10px 10px' }}>
              <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, lineHeight: 1.3 }}>
                {dish.name}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#e74c3c', fontWeight: 700, fontSize: 14 }}>₹{dish.price}</span>
                <span style={{ fontSize: 11, color: '#aaa' }}>{t('tapToReview')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, color: '#ccc', padding: '1rem' }}>
        {t('allFeedbackAnonymous')}
      </p>
    </div>
  );
}
