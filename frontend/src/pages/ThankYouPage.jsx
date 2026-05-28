import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';

const COUPONS = ['THANKYOU10', 'KUMARS15', 'BEENA10', 'LOVE20', 'YUMMY10'];
const DISCOUNTS = { THANKYOU10: 10, KUMARS15: 15, BEENA10: 10, LOVE20: 20, YUMMY10: 10 };

export default function ThankYouPage() {
  const navigate      = useNavigate();
  const { state }     = useLocation();
  const { t }         = useTranslation();
  const rating        = state?.rating ?? 0;
  const isNegative    = rating > 0 && rating <= 2;
  const coupon        = useMemo(() => COUPONS[Math.floor(Math.random() * COUPONS.length)], []);
  const discount      = DISCOUNTS[coupon] || 10;

  /* ── Confetti burst on load ── */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#e74c3c', '#c0392b', '#fff', '#f39c12'],
    });
  }, []);

  return (
    <div className="page-container-narrow" style={{
      background: 'linear-gradient(160deg, #fff8f0, #fff3e0)',
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <style>{`
        @keyframes tyBounceIn {
          0%   { transform: scale(0.3); opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          80%  { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes tyFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tyShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .ty-bounce {
          animation: tyBounceIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        .ty-fade-up {
          animation: tyFadeUp 0.6s 0.25s ease both;
        }
        .ty-shimmer {
          background: linear-gradient(
            90deg,
            #e74c3c 0%, #c0392b 35%,
            rgba(255,255,255,0.22) 50%,
            #c0392b 65%, #e74c3c 100%
          );
          background-size: 200% auto;
          animation: tyShimmer 2.5s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ty-bounce, .ty-fade-up, .ty-shimmer { animation: none; }
        }
      `}</style>

      {/* Success hero */}
      <div style={{ textAlign: 'center', padding: '3rem 2rem 1.5rem' }}>
        {/* 🎉 with bounce-in */}
        <div
          className="ty-bounce"
          style={{
            width: 70, height: 70,
            background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 6px 20px rgba(39,174,96,0.3)',
          }}
        >
          <span style={{ color: '#fff', fontSize: 36, lineHeight: 1, fontWeight: 700 }}>✓</span>
        </div>
        <h2 className="ty-fade-up" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 6 }}>
          {t('thankYou')}
        </h2>
        <p style={{ color: '#888', fontSize: 14, lineHeight: 1.6 }}>
          {t('recorded')}
          <br />{t('feedbackHelps')}
        </p>
      </div>

      {/* Coupon card — only for negative feedback (1–2 stars) */}
      {isNegative && (
        <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
          <div style={{
            borderRadius: 16, padding: '1.25rem',
            boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
            border: '2px dashed #e74c3c', textAlign: 'center',
            overflow: 'hidden',
          }}>
            <p style={{ fontSize: 12, color: '#999', marginBottom: 6, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
              {t('yourReward')}
            </p>
            <p style={{ fontSize: 15, color: '#444', marginBottom: 10, lineHeight: 1.5 }}>
              {t('get')} <strong style={{ color: '#e74c3c' }}>{discount}%</strong> {t('offNextVisit')}
            </p>
            <div
              className="coupon-shine"
              style={{
                border: '1.5px solid #ffd0c0',
                borderRadius: 10, padding: '10px 16px',
                display: 'inline-block', marginBottom: 8,
              }}
            >
              <span style={{
                fontFamily: 'monospace', fontSize: 22,
                fontWeight: 800, letterSpacing: 3, color: '#e74c3c',
              }}>
                {coupon}
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#bbb' }}>{t('showAtCounter')}</p>
          </div>
        </div>
      )}

      {/* Chef message */}
      <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{
          background: '#fff', borderRadius: 16, padding: '1rem 1.25rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          borderLeft: '4px solid #e74c3c',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5, margin: 0 }}>
            <strong style={{ color: '#222' }}>Beena Pradhan</strong> {t('beenaSays')}<br />
            {t('beenaThankYouMsg')}
          </p>
        </div>
      </div>

      {/* Back button */}
      <div style={{ padding: '0 1.5rem 3rem' }}>
        <button
          onClick={() => navigate('/')}
          className="ty-shimmer"
          style={{
            width: '100%', padding: '1rem',
            color: '#fff', border: 'none', borderRadius: 14,
            fontSize: 16, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(231,76,60,0.3)',
          }}
        >
          {t('backHome')}
        </button>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#bbb', marginTop: 10 }}>
          We appreciate your time
        </p>
      </div>
    </div>
  );
}
