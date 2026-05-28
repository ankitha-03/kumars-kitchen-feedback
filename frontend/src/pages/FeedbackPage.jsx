import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { getDeviceToken } from '../utils/deviceToken';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const CATEGORIES = ['Hygiene', 'Taste', 'Service', 'Pricing'];
const LANG_MAP = { en: 'en-IN', hi: 'hi-IN', kn: 'kn-IN' };

const RATING_PILLS = [
  null,
  { bg: '#fff0f0', color: '#e74c3c' },
  { bg: '#fff3e0', color: '#e67e22' },
  { bg: '#fffde7', color: '#f39c12' },
  { bg: '#f0fff4', color: '#27ae60' },
  { bg: '#e8f8f0', color: '#1e8449' },
];
const RATING_KEYS = ['', 'veryBad', 'belowAverage', 'okay', 'good', 'excellent'];

/* ── Interactive star rating ── */
function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const [popped,  setPopped]  = useState(0);

  const handleClick = (star) => {
    onChange(star);
    setPopped(star);
    setTimeout(() => setPopped(0), 300);
  };

  const getTransform = (star) => {
    if (popped === star)              return 'scale(1.4)';
    if ((hovered || value) >= star)   return 'scale(1.1)';
    return 'scale(1)';
  };

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '0.5rem 0 1rem' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => handleClick(star)}
          style={{
            fontSize: 40,
            cursor: 'pointer',
            transition: 'transform 0.15s ease, color 0.15s ease',
            transform: getTransform(star),
            color: (hovered || value) >= star ? '#f39c12' : '#ddd',
            userSelect: 'none',
            display: 'inline-block',
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/* ── Voice input button ── */
function VoiceInput({ onAppend, t, lang }) {
  const [listening,   setListening]   = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [supported]   = useState(() => !!(window.SpeechRecognition || window.webkitSpeechRecognition));
  const recRef        = useRef(null);
  const appendRef     = useRef(onAppend);
  const errorTimer    = useRef(null);

  useEffect(() => { appendRef.current = onAppend; }, [onAppend]);

  /* Stop recognition immediately when the language is changed mid-session */
  useEffect(() => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      if (errorTimer.current) clearTimeout(errorTimer.current);
      recRef.current?.stop();
    };
  }, []);

  const showError = useCallback((msg) => {
    setSpeechError(msg);
    if (errorTimer.current) clearTimeout(errorTimer.current);
    errorTimer.current = setTimeout(() => setSpeechError(''), 3000);
  }, []);

  const toggle = useCallback(() => {
    if (!supported) return;

    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }

    try {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SR();
      recognition.lang = LANG_MAP[lang] || 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = e => {
        let final = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) final += e.results[i][0].transcript;
        }
        if (final.trim()) {
          appendRef.current(prev => prev ? prev + ' ' + final.trim() : final.trim());
        }
      };

      recognition.onend   = () => setListening(false);
      recognition.onerror = () => {
        setListening(false);
        showError(t('speechError'));
      };

      recRef.current = recognition;
      recognition.start();
      setListening(true);
    } catch {
      showError(t('speechError'));
    }
  }, [listening, supported, lang, t, showError]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
      <button
        type="button"
        onClick={toggle}
        disabled={!supported}
        title="Best experienced on Chrome mobile"
        className={listening ? 'voice-listening' : ''}
        style={{
          padding: '8px 14px', borderRadius: 10,
          border: listening ? '1.5px solid #e74c3c' : '1.5px solid #ddd',
          background: listening ? '#fff5f5' : '#f8f9fa',
          color: listening ? '#e74c3c' : '#666',
          fontWeight: 600, fontSize: 13,
          display: 'flex', alignItems: 'center', gap: 6,
          transition: 'border-color 0.2s, background 0.2s, color 0.2s',
          opacity: supported ? 1 : 0.5,
          cursor: supported ? 'pointer' : 'not-allowed',
        }}
      >
        <span style={{ fontWeight: 700 }}>{listening ? t('listeningText') : t('speakButton')}</span>
      </button>

      {supported && !speechError && (
        <span style={{ fontSize: 10, color: '#bbb', lineHeight: 1 }}>
          {t('requiresInternet')}
        </span>
      )}

      {!supported && (
        <span style={{ fontSize: 11, color: '#e74c3c', maxWidth: 200, textAlign: 'right', lineHeight: 1.4 }}>
          {t('speechNotSupported')}
        </span>
      )}

      {speechError && (
        <span style={{ fontSize: 11, color: '#e74c3c', textAlign: 'right', lineHeight: 1.4 }}>
          {speechError}
        </span>
      )}
    </div>
  );
}

export default function FeedbackPage() {
  const { tableId, dishId } = useParams();
  const { state }    = useLocation();
  const navigate     = useNavigate();
  const { t, i18n } = useTranslation();
  const dish         = state?.dish;

  const [rating,      setRating]      = useState(0);
  const [category,    setCategory]    = useState('');
  const [comment,     setComment]     = useState('');
  const [image,       setImage]       = useState(null);
  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [shakeBtn,    setShakeBtn]    = useState(false);

  const [poppedCat, setPoppedCat] = useState('');

  const triggerShake = () => {
    setShakeBtn(true);
    setTimeout(() => setShakeBtn(false), 500);
  };

  const handleSubmit = async () => {
    if (!rating)   { triggerShake(); alert(t('pleaseGiveRating'));    return; }
    if (!category) { triggerShake(); alert(t('pleaseSelectCategory')); return; }
    setSubmitting(true);
    setSubmitError('');

    const formData = new FormData();
    formData.append('tableId',  tableId);
    formData.append('dishId',   dishId);
    formData.append('dishName', dish?.name || '');
    formData.append('category', category);
    formData.append('comment',  comment);
    formData.append('rating',      rating);
    formData.append('deviceToken', getDeviceToken());
    if (image) formData.append('image', image);

    try {
      await axios.post(`${API_URL}/api/feedback`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/thankyou', { state: { rating } });
    } catch {
      setSubmitError(t('somethingWrong'));
      setSubmitting(false);
    }
  };

  return (
    <>
    <style>{`
      @keyframes voicePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      .voice-listening { animation: voicePulse 0.9s ease-in-out infinite; }
      @keyframes fbShimmer {
        0%   { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      .fb-shimmer {
        background: linear-gradient(
          90deg,
          #e74c3c 0%, #c0392b 35%,
          rgba(255,255,255,0.18) 50%,
          #c0392b 65%, #e74c3c 100%
        ) !important;
        background-size: 200% auto !important;
        animation: fbShimmer 2.5s linear infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        .voice-listening { animation: none; }
        .fb-shimmer { animation: none; background: linear-gradient(135deg,#e74c3c,#c0392b) !important; }
      }
    `}</style>
    <div className="page-container-narrow" style={{ background: '#f8f9fa' }}>
      <LanguageSwitcher />

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
        padding: '1rem 1.2rem', color: '#fff',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button onClick={() => navigate(-1)}
          style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
            borderRadius: 8, padding: '4px 10px', fontSize: 16, cursor: 'pointer',
          }}>
          ←
        </button>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t('rateYourDish')}</h2>
      </div>

      <div style={{ padding: '1rem 1.2rem' }}>

        {/* Dish card */}
        <div style={{
          background: '#fff', borderRadius: 14, overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <img src={dish?.image} alt={dish?.name}
            style={{ width: 80, height: 80, objectFit: 'cover', flexShrink: 0 }}
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'; }}
          />
          <div style={{ padding: '0 8px' }}>
            <p style={{ fontWeight: 700, fontSize: 15 }}>{dish?.name}</p>
            <p style={{ color: '#e74c3c', fontWeight: 700 }}>₹{dish?.price}</p>
            <p style={{ fontSize: 11, color: '#27ae60', marginTop: 2, fontWeight: 700 }}>{t('anonymous')}</p>
          </div>
        </div>

        {/* Star rating */}
        <div style={{
          background: '#fff', borderRadius: 14, padding: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 14, textAlign: 'center',
        }}>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>{t('howWasItOverall')}</p>
          <div style={{ minHeight: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            {rating > 0 ? (
              <span style={{
                fontSize: 13, fontWeight: 700,
                padding: '4px 16px', borderRadius: 20,
                background: RATING_PILLS[rating].bg,
                color: RATING_PILLS[rating].color,
                transition: 'background 0.2s, color 0.2s',
              }}>
                {t(RATING_KEYS[rating])}
              </span>
            ) : (
              <span style={{ fontSize: 12, color: '#aaa' }}>{t('tapAStar')}</span>
            )}
          </div>
          <StarRating value={rating} onChange={setRating} />
        </div>

        {/* Category selection */}
        <div style={{
          background: '#fff', borderRadius: 14, padding: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 14,
        }}>
          <p style={{ fontWeight: 700, marginBottom: 10 }}>{t('whatIssue')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c);
                  setPoppedCat(c);
                  setTimeout(() => setPoppedCat(''), 200);
                }}
                style={{
                  padding: '0.75rem', borderRadius: 10,
                  border: category === c ? 'none' : '1.5px solid #eee',
                  background: category === c ? '#e74c3c' : '#f8f9fa',
                  color:      category === c ? '#fff' : '#555',
                  fontWeight: category === c ? 700 : 500,
                  fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  transition: 'all 0.2s ease',
                  transform: poppedCat === c ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: category === c ? '0 4px 12px rgba(231,76,60,0.3)' : 'none',
                }}>
                {category === c && <span style={{ fontSize: 11, lineHeight: 1 }}>✓</span>}
                {t(`categories.${c}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Comment + voice input */}
        <div style={{
          background: '#fff', borderRadius: 14, padding: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 14,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <p style={{ fontWeight: 700 }}>{t('tellMore')}</p>
            <VoiceInput onAppend={setComment} t={t} lang={i18n.language} />
          </div>
          <textarea
            rows={3}
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder={t('describeExperience')}
            style={{
              width: '100%', padding: '10px', borderRadius: 10,
              border: '1.5px solid #eee', fontSize: 14,
              resize: 'none', fontFamily: 'inherit', outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#e74c3c'}
            onBlur={e => e.target.style.borderColor = '#eee'}
          />
        </div>

        {/* Image upload */}
        <label style={{ display: 'block', marginBottom: 16, cursor: 'pointer' }}>
          <div style={{
            border: '2px dashed #f0c0b0', borderRadius: 12,
            padding: '0.9rem', textAlign: 'center',
            background: image ? '#fff5f5' : '#fff',
            color: image ? '#e74c3c' : '#aaa',
            transition: 'all 0.2s',
          }}>
            <strong>{image ? image.name : t('uploadPhoto')}</strong>
          </div>
          <input type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => setImage(e.target.files[0])} />
        </label>

        {/* Error message */}
        {submitError && (
          <p style={{ color: '#e74c3c', textAlign: 'center', marginBottom: 12, fontSize: 13, fontWeight: 700 }}>
            {submitError}
          </p>
        )}

        {/* Submit — shake on validation fail, spinner while submitting */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`${shakeBtn ? 'shake' : ''} ${submitting ? '' : 'fb-shimmer'}`}
          style={{
            width: '100%', padding: '1rem',
            background: submitting ? '#ccc' : undefined,
            color: '#fff', border: 'none', borderRadius: 14,
            fontSize: 16, fontWeight: 700,
            boxShadow: submitting ? 'none' : '0 6px 20px rgba(231,76,60,0.35)',
            transition: 'box-shadow 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {submitting
            ? <><span className="spinner" />{t('submitting')}</>
            : t('submit')
          }
        </button>
      </div>
    </div>
    </>
  );
}
