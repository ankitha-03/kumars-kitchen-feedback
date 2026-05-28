import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import {
  Chart as ChartJS, ArcElement, BarElement, LineElement,
  CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(
  ArcElement, BarElement, LineElement,
  CategoryScale, LinearScale, PointElement,
  Tooltip, Legend, Filler
);

const API_URL        = process.env.REACT_APP_API_URL  || 'http://localhost:5000';
const BASE_URL       = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';
const TABLES         = ['table-1', 'table-2', 'table-3', 'table-4', 'table-5', 'table-6'];
const ADMIN_PASSWORD = 'kumars2024'; // TODO: move to environment variable before production

/* ── CSV Export ── */
function exportToCSV(data) {
  const headers = ['Dish', 'Category', 'Rating', 'Sentiment', 'Status', 'Comment', 'Table', 'Date'];
  const rows = data.map(f => [
    `"${f.dishName || ''}"`,
    `"${f.category || ''}"`,
    f.rating || '',
    `"${f.sentiment || ''}"`,
    `"${f.status || 'Open'}"`,
    `"${(f.comment || '').replace(/"/g, "'")}"`,
    `"${f.tableId || ''}"`,
    `"${new Date(f.createdAt).toLocaleDateString('en-IN')}"`,
  ].join(','));
  const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `kumars_kitchen_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
}

/* ── Stars display ── */
function Stars({ count }) {
  if (!count) return null;
  return <span style={{ color: '#f39c12', fontSize: 12 }}>{'★'.repeat(count)}{'☆'.repeat(5 - count)}</span>;
}

/* ── Rating colour badge ── */
function RatingBadge({ avg }) {
  if (!avg) return <span style={{ color: '#bbb', fontSize: 12 }}>—</span>;
  const num   = parseFloat(avg);
  const color = num >= 4 ? '#27ae60' : num >= 3 ? '#f39c12' : '#e74c3c';
  const bg    = num >= 4 ? '#f0fff4' : num >= 3 ? '#fff8e1' : '#fff5f5';
  return (
    <span style={{ background: bg, color, fontWeight: 800, fontSize: 13, padding: '2px 10px', borderRadius: 20 }}>
      {avg}
    </span>
  );
}

/* ── Skeleton row ── */
function SkeletonRow() {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '0.9rem', marginBottom: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
      <div className="skeleton" style={{ height: 14, borderRadius: 6, marginBottom: 8, width: '55%' }} />
      <div className="skeleton" style={{ height: 10, borderRadius: 6, width: '80%' }} />
    </div>
  );
}

/* ── Animated number counter ── */
function CountUp({ to, duration = 1100 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!to || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(to); return;
    }
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round(p * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to, duration]);
  return <>{val}</>;
}

const STATUS_COLORS = {
  'Open':         { bg: '#fff5f5', color: '#e74c3c' },
  'Under Review': { bg: '#fff8e1', color: '#f39c12' },
  'Resolved':     { bg: '#f0fff4', color: '#27ae60' },
};

const TAB_ICONS = {
  dashboard: 'ti-layout-dashboard',
  trends:    'ti-trending-up',
  qr:        'ti-qrcode',
  feedback:  'ti-messages',
};

/* ══════════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const { t } = useTranslation();

  /* ── Auth state ── */
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [loginError,  setLoginError]  = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  /* ── Dashboard state ── */
  const [analytics,      setAnalytics]      = useState(null);
  const [allFeedback,    setAllFeedback]    = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [fetchError,     setFetchError]     = useState('');
  const [tab,            setTab]            = useState('dashboard');
  const [alertMsg,       setAlertMsg]       = useState(null);
  const [lastCount,      setLastCount]      = useState(0);
  const [filterSent,     setFilterSent]     = useState('All');
  const [filterCat,      setFilterCat]      = useState('All');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [updatingId,     setUpdatingId]     = useState(null);
  const [wonBack,        setWonBack]        = useState([]);
  const [showAllWonBack, setShowAllWonBack] = useState(false);

  /* ── Load Tabler icons once ── */
  useEffect(() => {
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css';
    document.head.appendChild(link);
  }, []);

  /* ── Data fetch ── */
  const fetchData = useCallback(async () => {
    try {
      const [aRes, fRes, wRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/analytics`),
        axios.get(`${API_URL}/api/feedback`),
        axios.get(`${API_URL}/api/wonback`),
      ]);
      setAnalytics(aRes.data);
      setFetchError('');
      const newCount = fRes.data.length;
      if (lastCount > 0 && newCount > lastCount) {
        const newest = fRes.data[0];
        if (newest?.sentiment === 'Negative') {
          setAlertMsg(`${t('admin.newComplaintFor')} "${newest.dishName}" — ${newest.category}`);
          setTimeout(() => setAlertMsg(null), 8000);
        }
      }
      setLastCount(newCount);
      setAllFeedback(fRes.data);
      setWonBack(wRes.data);
    } catch {
      setFetchError(t('somethingWrong'));
    } finally {
      setLoading(false);
    }
  }, [lastCount, t]);

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 15000);
    return () => clearInterval(iv);
  }, [fetchData]);

  /* ── Status update ── */
  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await axios.patch(`${API_URL}/api/feedback/${id}/status`, { status });
      setAllFeedback(prev => prev.map(f => f._id === id ? { ...f, status } : f));
    } catch {
      alert('Could not update. Check backend.');
    }
    setUpdatingId(null);
  };

  /* ── Auth handlers ── */
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError('Incorrect password. Please try again.');
        setPassword('');
      }
      setIsLoggingIn(false);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  /* ── Trend data ── */
  const trendData = useMemo(() => {
    const days = [], pos = new Array(7).fill(0), neg = new Array(7).fill(0), neu = new Array(7).fill(0);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      days.push(d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }));
    }
    allFeedback.forEach(f => {
      const diff = Math.floor((Date.now() - new Date(f.createdAt)) / 86400000);
      if (diff < 7) {
        if (f.sentiment === 'Positive') pos[6 - diff]++;
        if (f.sentiment === 'Negative') neg[6 - diff]++;
        if (f.sentiment === 'Neutral')  neu[6 - diff]++;
      }
    });
    return { days, pos, neg, neu };
  }, [allFeedback]);

  /* ── Best & worst dish this week ── */
  const weeklyDishes = useMemo(() => {
    const map = {}, weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    allFeedback.filter(f => new Date(f.createdAt) >= weekAgo).forEach(f => {
      if (!f.dishName) return;
      if (!map[f.dishName]) map[f.dishName] = { pos: 0, neg: 0, total: 0, rs: 0, rc: 0 };
      map[f.dishName].total++;
      if (f.sentiment === 'Positive') map[f.dishName].pos++;
      if (f.sentiment === 'Negative') map[f.dishName].neg++;
      if (f.rating) { map[f.dishName].rs += f.rating; map[f.dishName].rc++; }
    });
    const arr = Object.entries(map).map(([name, v]) => ({
      name, ...v,
      score: v.total > 0 ? (v.pos - v.neg) / v.total : 0,
      avgRating: v.rc > 0 ? (v.rs / v.rc).toFixed(1) : null,
    })).sort((a, b) => b.score - a.score);
    return { best: arr[0], worst: arr[arr.length - 1] };
  }, [allFeedback]);

  /* ── Leaderboard ── */
  const leaderboard = useMemo(() => {
    const map = {};
    allFeedback.forEach(f => {
      if (!f.dishName) return;
      if (!map[f.dishName]) map[f.dishName] = { total: 0, ratingSum: 0, ratingCount: 0 };
      map[f.dishName].total++;
      if (f.rating) { map[f.dishName].ratingSum += f.rating; map[f.dishName].ratingCount++; }
    });
    return Object.entries(map)
      .map(([name, v]) => ({
        name,
        total: v.total,
        avgRating: v.ratingCount > 0 ? (v.ratingSum / v.ratingCount).toFixed(1) : null,
      }))
      .sort((a, b) => (parseFloat(b.avgRating) || 0) - (parseFloat(a.avgRating) || 0));
  }, [allFeedback]);

  /* ── Filtered feedback ── */
  const filteredFeedback = useMemo(() => allFeedback.filter(f =>
    (filterSent === 'All' || f.sentiment === filterSent) &&
    (filterCat  === 'All' || f.category  === filterCat) &&
    (!searchQuery ||
      f.dishName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.comment?.toLowerCase().includes(searchQuery.toLowerCase()))
  ), [allFeedback, filterSent, filterCat, searchQuery]);

  const totalFeedback = analytics?.sentimentStats.reduce((a, s) => a + s.count, 0) || 0;
  const ratingArr     = allFeedback.filter(f => f.rating);
  const avgRating     = ratingArr.length
    ? (ratingArr.reduce((a, f) => a + f.rating, 0) / ratingArr.length).toFixed(1) : '—';

  const TABS = [
    { key: 'dashboard', label: t('admin.tabOverview') },
    { key: 'trends',    label: t('admin.tabTrends') },
    { key: 'qr',        label: t('admin.tabQR') },
    { key: 'feedback',  label: t('admin.tabFeedback') },
  ];

  /* ── Login screen ── */
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #fff8f0, #ffecd2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Segoe UI', sans-serif", padding: '1rem',
      }}>
        <div style={{
          background: '#fff', borderRadius: 20,
          padding: '2.5rem 2rem', width: '100%', maxWidth: 380,
          boxShadow: '0 8px 40px rgba(0,0,0,0.1)', textAlign: 'center',
        }}>
          <div style={{
            width: 64, height: 64,
            background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
            borderRadius: 16, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <i className="ti ti-tools-kitchen-2" style={{ fontSize: 30, color: '#fff' }} />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#222', marginBottom: 4 }}>
            Kumar's Kitchen
          </h2>
          <p style={{ fontSize: 13, color: '#888', marginBottom: '2rem' }}>
            Admin Dashboard — Owner Access Only
          </p>

          <div style={{ position: 'relative', marginBottom: 12 }}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Enter admin password"
              value={password}
              onChange={e => { setPassword(e.target.value); setLoginError(''); }}
              onKeyDown={handleKeyDown}
              style={{
                width: '100%', padding: '12px 44px 12px 16px',
                borderRadius: 10, fontSize: 15, boxSizing: 'border-box',
                border: loginError ? '1.5px solid #e74c3c' : '1.5px solid #eee',
                outline: 'none',
              }}
            />
            <button
              onClick={() => setShowPass(p => !p)}
              style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)', background: 'none',
                border: 'none', cursor: 'pointer', color: '#aaa',
              }}
            >
              <i className={`ti ${showPass ? 'ti-eye-off' : 'ti-eye'}`} style={{ fontSize: 18 }} />
            </button>
          </div>

          {loginError && (
            <p style={{ color: '#e74c3c', fontSize: 13, marginBottom: 12, textAlign: 'left' }}>
              <i className="ti ti-alert-circle" style={{ fontSize: 14, marginRight: 4 }} />
              {loginError}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoggingIn || !password}
            style={{
              width: '100%', padding: '13px',
              background: isLoggingIn || !password
                ? '#ccc' : 'linear-gradient(135deg, #e74c3c, #c0392b)',
              color: '#fff', border: 'none', borderRadius: 10,
              fontSize: 15, fontWeight: 700, marginBottom: '1.5rem',
              cursor: isLoggingIn || !password ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {isLoggingIn
              ? <><i className="ti ti-loader" style={{ fontSize: 16 }} />Verifying...</>
              : <><i className="ti ti-login" style={{ fontSize: 16 }} />Login to Dashboard</>
            }
          </button>

          <p style={{ fontSize: 12, color: '#bbb' }}>
            <i className="ti ti-lock" style={{ fontSize: 13, marginRight: 4 }} />
            Restricted to restaurant owners only
          </p>
        </div>
      </div>
    );
  }

  /* ── Loading state ── */
  if (loading) return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', fontFamily: "'Segoe UI',sans-serif" }}>
      <div style={{ background: 'linear-gradient(135deg,#e74c3c,#c0392b)', padding: '1rem 1.2rem', color: '#fff' }}>
        <h2 style={{ fontWeight: 800 }}>{t('admin.title')}</h2>
      </div>
      <div className="admin-content">
        {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
      </div>
    </div>
  );

  /* ── Error state ── */
  if (fetchError && !analytics) return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h3 style={{ marginBottom: 8 }}>{fetchError}</h3>
        <button onClick={fetchData} style={{
          padding: '0.8rem 2rem', background: '#e74c3c', color: '#fff',
          border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer',
        }}>
          {t('retry')}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', fontFamily: "'Segoe UI',sans-serif" }}>

      {/* ── Header ── */}
      <div className="no-print" style={{
        background: 'linear-gradient(135deg,#e74c3c,#c0392b)',
        padding: '1rem 1.2rem', color: '#fff',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8,
      }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 2 }}>{t('admin.title')}</h2>
          <p style={{ fontSize: 11, opacity: 0.8 }}>{t('admin.liveRefresh')}</p>
        </div>
        <div className="admin-header-actions">
          <LanguageSwitcher />
          <button
            onClick={() => exportToCSV(allFeedback)}
            style={{
              background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.5)',
              color: '#fff', borderRadius: 10, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <i className="ti ti-download" style={{ fontSize: 14 }} />
            <span className="admin-btn-label">{t('admin.exportCSV')}</span>
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.4)',
              color: '#fff', borderRadius: 10, padding: '6px 14px', fontSize: 12,
              fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <i className="ti ti-logout" style={{ fontSize: 14 }} />
            <span className="admin-btn-label">Logout</span>
          </button>
        </div>
      </div>

      {/* ── Alert banner ── */}
      {alertMsg && (
        <div className="no-print slide-down" style={{
          background: '#fff3cd', borderLeft: '4px solid #e74c3c',
          padding: '10px 16px', fontSize: 14, fontWeight: 600, color: '#856404',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: '#e74c3c' }} />
            {alertMsg}
          </span>
          <button onClick={() => setAlertMsg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#856404' }}>
            <i className="ti ti-x" style={{ fontSize: 18 }} />
          </button>
        </div>
      )}

      {/* ── Tab bar ── */}
      <div className="tab-bar no-print">
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            style={{
              flex: '0 0 auto', padding: '12px 16px', border: 'none', background: 'transparent',
              borderBottom: tab === key ? '2.5px solid #e74c3c' : '2.5px solid transparent',
              color:  tab === key ? '#e74c3c' : '#888',
              fontWeight: tab === key ? 700 : 500,
              fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
            <i className={`ti ${TAB_ICONS[key]}`} style={{ fontSize: 15 }} />
            {label}
          </button>
        ))}
      </div>

      <div className="admin-content no-print">

        {/* ════ OVERVIEW ════ */}
        {tab === 'dashboard' && analytics && (<>

          {/* Won-back highlight banner */}
          {wonBack.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #f0fff4, #e8f8f0)',
              borderRadius: 12, padding: '0.9rem',
              textAlign: 'center', border: '1.5px solid #b2dfdb',
              marginBottom: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            }}>
              <i className="ti ti-heart-handshake" style={{ fontSize: 28, color: '#27ae60' }} />
              <div>
                <p style={{ fontSize: 22, fontWeight: 800, color: '#27ae60' }}>{wonBack.length}</p>
                <p style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>Customers Won Back</p>
              </div>
              <p style={{ fontSize: 12, color: '#888', maxWidth: 180, textAlign: 'left', lineHeight: 1.5 }}>
                Previously unhappy customers who returned and gave positive feedback
              </p>
            </div>
          )}

          {/* Stat cards */}
          <div className="stat-grid">
            {[
              { label: t('admin.totalFeedback'), value: totalFeedback,  color: '#3498db', bg: '#eaf4ff', icon: 'ti-clipboard-data' },
              { label: t('admin.avgRating'),     value: avgRating,       color: '#f39c12', bg: '#fff8e1', icon: 'ti-star' },
              { label: t('admin.positive'), value: analytics.sentimentStats.find(s => s._id === 'Positive')?.count || 0, color: '#27ae60', bg: '#f0fff4', icon: 'ti-mood-happy' },
              { label: t('admin.negative'), value: analytics.sentimentStats.find(s => s._id === 'Negative')?.count || 0, color: '#e74c3c', bg: '#fff5f5', icon: 'ti-mood-sad' },
            ].map(c => (
              <div key={c.label} style={{ background: c.bg, borderRadius: 12, padding: '0.9rem', textAlign: 'center' }}>
                <i className={`ti ${c.icon}`} style={{ fontSize: 20, color: c.color, display: 'block', marginBottom: 4 }} />
                <p style={{ fontSize: 11, color: '#888', marginBottom: 3, fontWeight: 600 }}>{c.label}</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: c.color }}>
                  {typeof c.value === 'number' ? <CountUp to={c.value} /> : c.value}
                </p>
              </div>
            ))}
          </div>

          {/* Best & worst */}
          {(weeklyDishes.best || weeklyDishes.worst) && (
            <div className="best-worst-grid">
              {weeklyDishes.best && (
                <div style={{ background: '#f0fff4', borderRadius: 12, padding: '0.9rem', border: '1.5px solid #b2dfdb' }}>
                  <p style={{ fontSize: 11, color: '#27ae60', fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i className="ti ti-trophy" style={{ fontSize: 14 }} />
                    {t('admin.bestThisWeek')}
                  </p>
                  <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{weeklyDishes.best.name}</p>
                  {weeklyDishes.best.avgRating && (
                    <p style={{ fontSize: 12, color: '#555' }}>{weeklyDishes.best.avgRating} {t('admin.avgLabel')}</p>
                  )}
                </div>
              )}
              {weeklyDishes.worst && weeklyDishes.worst.name !== weeklyDishes.best?.name && (
                <div style={{ background: '#fff5f5', borderRadius: 12, padding: '0.9rem', border: '1.5px solid #ffd0c0' }}>
                  <p style={{ fontSize: 11, color: '#e74c3c', fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i className="ti ti-alert-triangle" style={{ fontSize: 14 }} />
                    {t('admin.needsAttention')}
                  </p>
                  <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{weeklyDishes.worst.name}</p>
                  <p style={{ fontSize: 12, color: '#888' }}>{weeklyDishes.worst.neg} {t('admin.complaintsWeek')}</p>
                </div>
              )}
            </div>
          )}

          {/* Charts */}
          <div className="charts-grid">
            <div style={{ background: '#fff', borderRadius: 14, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <p style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>{t('admin.sentimentChart')}</p>
              <Doughnut data={{
                labels: [t('sentiment.Positive'), t('sentiment.Neutral'), t('sentiment.Negative')],
                datasets: [{ data: [
                  analytics.sentimentStats.find(s => s._id === 'Positive')?.count || 0,
                  analytics.sentimentStats.find(s => s._id === 'Neutral')?.count || 0,
                  analytics.sentimentStats.find(s => s._id === 'Negative')?.count || 0,
                ], backgroundColor: ['#27ae60', '#f39c12', '#e74c3c'], borderWidth: 0 }],
              }} options={{ plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } }, responsive: true }} />
            </div>
            <div style={{ background: '#fff', borderRadius: 14, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <p style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>{t('admin.categoryChart')}</p>
              <Bar data={{
                labels: analytics.categoryStats.map(c => t(`categories.${c._id}`, c._id)),
                datasets: [{ data: analytics.categoryStats.map(c => c.count), backgroundColor: ['#3498db', '#e74c3c', '#27ae60', '#f39c12'], borderRadius: 6 }],
              }} options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }, responsive: true }} />
            </div>
          </div>

          {/* Most reviewed dishes */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 14 }}>
            <p style={{ fontWeight: 700, marginBottom: 12 }}>{t('admin.mostReviewed')}</p>
            {analytics.dishStats.map(dish => (
              <div key={dish._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
                <span style={{ fontWeight: 500, fontSize: 13 }}>{dish._id}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ background: '#eaf4ff', color: '#3498db', padding: '2px 8px', borderRadius: 20, fontSize: 11 }}>{dish.count} {t('admin.total')}</span>
                  {dish.negativeCount > 0 && (
                    <span style={{ background: '#fff5f5', color: '#e74c3c', padding: '2px 8px', borderRadius: 20, fontSize: 11 }}>{dish.negativeCount} {t('admin.negativeAlert')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Dish rating leaderboard */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 14 }}>
            <p style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>{t('admin.leaderboard')}</p>
            {leaderboard.length === 0 ? (
              <p style={{ color: '#bbb', textAlign: 'center', padding: '1rem' }}>{t('admin.noFeedback')}</p>
            ) : (
              leaderboard.map((dish, idx) => (
                <div key={dish.name} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '9px 0', borderBottom: '1px solid #f5f5f5',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontWeight: 800, fontSize: 14, color: idx === 0 ? '#f39c12' : idx === 1 ? '#888' : idx === 2 ? '#cd7f32' : '#ccc',
                      width: 22, textAlign: 'center', flexShrink: 0,
                    }}>
                      {`${idx + 1}.`}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dish.name}</p>
                      <p style={{ fontSize: 11, color: '#aaa' }}>{dish.total} {t('admin.reviews')}</p>
                    </div>
                  </div>
                  <RatingBadge avg={dish.avgRating} />
                </div>
              ))
            )}
          </div>

          {/* ── Won-Back Customers Section ── */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '1rem', marginTop: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <p style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="ti ti-heart-handshake" style={{ fontSize: 18, color: '#27ae60' }} />
                Customers Won Back
              </p>
              {wonBack.length > 0 && (
                <span style={{ background: '#f0fff4', color: '#27ae60', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  {wonBack.length} total
                </span>
              )}
            </div>

            {wonBack.length === 0 && (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <i className="ti ti-handshake" style={{ fontSize: 40, color: '#ddd', display: 'block', marginBottom: 8 }} />
                <p style={{ color: '#bbb', fontSize: 13 }}>No won-back events yet.</p>
                <p style={{ color: '#ddd', fontSize: 12, marginTop: 4 }}>
                  When a customer who complained comes back and rates positively, it will appear here.
                </p>
              </div>
            )}

            {(showAllWonBack ? wonBack : wonBack.slice(0, 3)).map((event, i) => (
              <div key={i} style={{
                borderLeft: '4px solid #27ae60',
                background: 'linear-gradient(135deg, #f0fff4, #fff)',
                borderRadius: 10, padding: '12px 14px', marginBottom: 10,
                boxShadow: '0 1px 4px rgba(39,174,96,0.1)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#27ae60', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="ti ti-star" style={{ fontSize: 14 }} />
                    Customer Won Back
                  </span>
                  <span style={{ fontSize: 11, color: '#aaa' }}>
                    {new Date(event.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, padding: '6px 10px', background: '#fff5f5', borderRadius: 8 }}>
                  <i className="ti ti-mood-sad" style={{ fontSize: 20, color: '#e74c3c', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 11, color: '#999', marginBottom: 1 }}>Previously complained about</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>
                      {event.previousDish}
                      <span style={{ color: '#f39c12', marginLeft: 6 }}>{'★'.repeat(event.previousRating || 1)}</span>
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'center', margin: '2px 0' }}>
                  <i className="ti ti-arrow-narrow-down" style={{ fontSize: 20, color: '#aaa' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: '#f0fff4', borderRadius: 8 }}>
                  <i className="ti ti-mood-happy" style={{ fontSize: 20, color: '#27ae60', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 11, color: '#999', marginBottom: 1 }}>Came back and rated</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>
                      {event.returnDish}
                      <span style={{ color: '#f39c12', marginLeft: 6 }}>{'★'.repeat(event.returnRating || 5)}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {wonBack.length > 3 && (
              <button
                onClick={() => setShowAllWonBack(prev => !prev)}
                style={{
                  width: '100%', padding: '8px', marginTop: 6,
                  background: 'transparent', border: '1.5px solid #27ae60',
                  borderRadius: 8, color: '#27ae60', fontWeight: 700,
                  fontSize: 13, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                {showAllWonBack
                  ? <><i className="ti ti-chevron-up" style={{ fontSize: 14 }} />Show Less</>
                  : <><i className="ti ti-chevron-down" style={{ fontSize: 14 }} />View All {wonBack.length} Events</>
                }
              </button>
            )}
          </div>
        </>)}

        {/* ════ TRENDS ════ */}
        {tab === 'trends' && (
          <div style={{ background: '#fff', borderRadius: 14, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{t('admin.last7Days')}</p>
            <p style={{ fontSize: 12, color: '#aaa', marginBottom: 20 }}>{t('admin.spotPatterns')}</p>
            <Line data={{
              labels: trendData.days,
              datasets: [
                { label: t('sentiment.Positive'), data: trendData.pos, borderColor: '#27ae60', backgroundColor: 'rgba(39,174,96,0.08)', tension: 0.4, fill: true, pointRadius: 5, pointBackgroundColor: '#27ae60' },
                { label: t('sentiment.Negative'), data: trendData.neg, borderColor: '#e74c3c', backgroundColor: 'rgba(231,76,60,0.08)', tension: 0.4, fill: true, pointRadius: 5, pointBackgroundColor: '#e74c3c' },
                { label: t('sentiment.Neutral'),  data: trendData.neu, borderColor: '#f39c12', backgroundColor: 'rgba(243,156,18,0.08)', tension: 0.4, fill: true, pointRadius: 5, pointBackgroundColor: '#f39c12' },
              ],
            }} options={{ plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }, responsive: true }} />
          </div>
        )}

        {/* ════ QR CODES ════ */}
        {tab === 'qr' && (<>
          <p style={{ color: '#888', marginBottom: 14, fontSize: 14, lineHeight: 1.6, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <i className="ti ti-info-circle" style={{ fontSize: 14, color: '#aaa', flexShrink: 0, marginTop: 2 }} />
            {t('admin.printInstructions')}
          </p>
          <button
            onClick={() => window.print()}
            style={{
              marginBottom: 16, padding: '10px 22px',
              background: 'linear-gradient(135deg,#e74c3c,#c0392b)',
              color: '#fff', border: 'none', borderRadius: 12,
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(231,76,60,0.3)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
            <i className="ti ti-printer" style={{ fontSize: 16 }} />
            {t('admin.printAll')}
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
            {TABLES.map(tableId => (
              <div key={tableId} style={{
                textAlign: 'center', background: '#fff', borderRadius: 14,
                padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                border: '1.5px solid #f0f0f0',
              }}>
                <div style={{ background: '#fff', padding: 8, borderRadius: 10, display: 'inline-block', border: '1px solid #eee' }}>
                  <QRCodeSVG value={`${BASE_URL}/menu/${tableId}`} size={120} />
                </div>
                <p style={{ marginTop: 10, fontWeight: 800, fontSize: 15, textTransform: 'capitalize', color: '#222' }}>
                  {tableId.replace('-', ' ').replace('table', 'Table')}
                </p>
                <p style={{ fontSize: 10, color: '#bbb', marginTop: 2 }}>{BASE_URL}/menu/{tableId}</p>
                <p style={{ fontSize: 12, marginTop: 6, color: '#e74c3c', fontWeight: 700 }}>Kumar's Kitchen</p>
              </div>
            ))}
          </div>
        </>)}

        {/* ════ ALL FEEDBACK ════ */}
        {tab === 'feedback' && (<>
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('admin.searchPlaceholder')}
              style={{
                flex: '1 1 180px', padding: '6px 12px',
                borderRadius: 8, border: '1.5px solid #eee',
                fontSize: 13, background: '#fff', outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#e74c3c'}
              onBlur={e => e.target.style.borderColor = '#eee'}
            />
            <select value={filterSent} onChange={e => setFilterSent(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid #eee', fontSize: 13, background: '#fff', cursor: 'pointer' }}>
              <option value="All">{t('admin.allSentiment')}</option>
              <option value="Positive">{t('sentiment.Positive')}</option>
              <option value="Neutral">{t('sentiment.Neutral')}</option>
              <option value="Negative">{t('sentiment.Negative')}</option>
            </select>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid #eee', fontSize: 13, background: '#fff', cursor: 'pointer' }}>
              <option value="All">{t('admin.allCategories')}</option>
              <option value="Hygiene">{t('categories.Hygiene')}</option>
              <option value="Taste">{t('categories.Taste')}</option>
              <option value="Service">{t('categories.Service')}</option>
              <option value="Pricing">{t('categories.Pricing')}</option>
            </select>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: '#aaa', whiteSpace: 'nowrap' }}>
              {filteredFeedback.length} {t('admin.entries')}
            </span>
            <button
              onClick={() => exportToCSV(filteredFeedback)}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                background: '#e74c3c', color: '#fff', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
              <i className="ti ti-download" style={{ fontSize: 13 }} />
              {t('admin.export')}
            </button>
          </div>

          {filteredFeedback.length === 0 && (
            <p style={{ textAlign: 'center', color: '#bbb', padding: '2rem' }}>{t('admin.noFeedback')}</p>
          )}

          {filteredFeedback.map((f, index) => {
            const sc       = STATUS_COLORS[f.status || 'Open'];
            const sentColor = f.sentiment === 'Positive' ? '#27ae60' : f.sentiment === 'Negative' ? '#e74c3c' : '#f39c12';
            const sentBg    = f.sentiment === 'Positive' ? '#f0fff4' : f.sentiment === 'Negative' ? '#fff5f5' : '#fff8e1';
            const sentIcon  = f.sentiment === 'Positive' ? 'ti-mood-happy' : f.sentiment === 'Negative' ? 'ti-mood-sad' : 'ti-mood-neutral';
            return (
              <div key={f._id}
                className="feedback-card-anim"
                style={{
                  '--i': Math.min(index, 12),
                  background: '#fff', borderRadius: 12, padding: '0.9rem',
                  marginBottom: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  borderLeft: `4px solid ${sentColor}`,
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{f.dishName || t('admin.unknown')}</span>
                  <span style={{ fontSize: 11, color: '#aaa' }}>
                    {new Date(f.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: f.comment ? 8 : 0 }}>
                  <span style={{ background: sentBg, color: sentColor, padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i className={`ti ${sentIcon}`} style={{ fontSize: 12 }} />
                    {t(`sentiment.${f.sentiment}`, f.sentiment)}
                  </span>
                  {f.category && (
                    <span style={{ background: '#f5f5f5', color: '#555', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>
                      {t(`categories.${f.category}`, f.category)}
                    </span>
                  )}
                  {f.rating && <span style={{ background: '#fff8e1', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}><Stars count={f.rating} /></span>}
                  <span style={{ background: '#f0f0f0', color: '#888', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>{f.tableId}</span>
                </div>

                {f.comment && <p style={{ fontSize: 13, color: '#555', fontStyle: 'italic', margin: '8px 0', lineHeight: 1.5 }}>"{f.comment}"</p>}

                {f.imageUrl && (
                  <img src={`${API_URL}${f.imageUrl}`} alt="proof"
                    style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 8, borderTop: '1px solid #f5f5f5', flexWrap: 'wrap' }}>
                  <span style={{ background: sc.bg, color: sc.color, padding: '3px 10px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>
                    {t(`status.${f.status || 'Open'}`, f.status || 'Open')}
                  </span>
                  {(f.status || 'Open') !== 'Resolved' && (<>
                    {(f.status || 'Open') !== 'Under Review' && (
                      <button disabled={updatingId === f._id} onClick={() => updateStatus(f._id, 'Under Review')}
                        style={{ padding: '3px 10px', borderRadius: 8, border: '1.5px solid #f39c12', background: '#fff8e1', color: '#f39c12', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <i className="ti ti-search" style={{ fontSize: 12 }} />
                        {t('admin.reviewing')}
                      </button>
                    )}
                    <button disabled={updatingId === f._id} onClick={() => updateStatus(f._id, 'Resolved')}
                      style={{ padding: '3px 10px', borderRadius: 8, border: '1.5px solid #27ae60', background: '#f0fff4', color: '#27ae60', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <i className="ti ti-circle-check" style={{ fontSize: 12 }} />
                      {t('admin.resolvedBtn')}
                    </button>
                  </>)}
                  {f.status === 'Resolved' && (
                    <button onClick={() => updateStatus(f._id, 'Open')}
                      style={{ padding: '3px 10px', borderRadius: 8, border: '1.5px solid #aaa', background: '#f5f5f5', color: '#888', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <i className="ti ti-arrow-back" style={{ fontSize: 12 }} />
                      {t('admin.reopenBtn')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </>)}
      </div>

      {/* ── Print-only QR layout ── */}
      <div className="print-only">
        <div className="print-qr-header">
          <h1>Kumar's Kitchen</h1>
          <p>Table QR Codes — Scan to leave feedback</p>
        </div>
        <div className="print-qr-grid">
          {TABLES.map(tableId => (
            <div key={tableId} className="print-qr-card">
              <QRCodeSVG value={`${BASE_URL}/menu/${tableId}`} size={150} />
              <div className="qr-table-name">{tableId.replace('-', ' ').replace('table', 'Table')}</div>
              <div className="qr-restaurant">Kumar's Kitchen</div>
              <div className="qr-url">{BASE_URL}/menu/{tableId}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
