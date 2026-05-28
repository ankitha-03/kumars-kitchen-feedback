import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const langs = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हि' },
    { code: 'kn', label: 'ಕ' },
  ];

  return (
    <div style={{ display:'flex', gap:6, justifyContent:'flex-end', padding:'10px 16px 0' }}>
      {langs.map(l => (
        <button key={l.code} onClick={() => i18n.changeLanguage(l.code)}
          style={{
            padding: '4px 12px',
            borderRadius: 20,
            border: '1.5px solid #e74c3c',
            background: i18n.language === l.code ? '#e74c3c' : '#fff',
            color:  i18n.language === l.code ? '#fff' : '#e74c3c',
            fontWeight: 600, fontSize: 13
          }}>
          {l.label}
        </button>
      ))}
    </div>
  );
}