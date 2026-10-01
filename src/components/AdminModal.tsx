import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AppConfig, MemoryItem, LocationItem, WhisperItem } from '../types';
import { hashPassword } from '../utils/storage';
import {
  X,
  Shield,
  Clock,
  FileText,
  Image,
  MapPin,
  Save,
  Plus,
  Trash2,
  Edit2,
  Check,
  Heart,
  Camera,
  Upload,
  RotateCcw,
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSave: (newConfig: AppConfig) => void;
  isDark?: boolean;
}

type AdminTab = 'security' | 'counter' | 'words' | 'content' | 'memories' | 'locations';

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  isDark = false,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('security');
  const [formData, setFormData] = useState<AppConfig>(() => JSON.parse(JSON.stringify(config)));
  const [newPassword, setNewPassword] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setFormData(JSON.parse(JSON.stringify(config)));
      setSaveSuccess(false);
    }
  }, [isOpen, config]);

  // New word / whisper state
  const [newWordInput, setNewWordInput] = useState('');
  const [newWhisperText, setNewWhisperText] = useState('');
  const [newWhisperNote, setNewWhisperNote] = useState('');

  // Editing items
  const [editingMemory, setEditingMemory] = useState<MemoryItem | null>(null);
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);

  if (!isOpen) return null;

  // Direct device image picker to Base64 converter
  const handleDeviceImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional canvas downscale to keep localStorage fast & lean
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
          onComplete(compressedBase64);
        } else {
          onComplete(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleGlobalSave = async () => {
    let updatedConfig = { ...formData };

    if (newPassword.trim()) {
      const hash = await hashPassword(newPassword.trim());
      updatedConfig.security.passwordHash = hash;
    }
    updatedConfig.security.passwordHint = formData.security.passwordHint || '';

    onSave(updatedConfig);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResetAllData = () => {
    const confirmed = window.confirm(
      'DİKKAT: Tüm metinler, anılar, konumlar ve hitaplar tamamen sıfırlanıp boşaltılacak. Devam etmek istiyor musunuz?'
    );
    if (!confirmed) return;

    const clearedConfig: AppConfig = {
      ...formData,
      counter: {
        startDate: '',
        title: '',
        subtitle: '',
      },
      welcome: {
        quote: '',
        subQuote: '',
        author: '',
      },
      letter: {
        title: '',
        subtitle: '',
        body: '',
        poemTitle: '',
        poemBody: '',
        defaultTab: 'letter',
      },
      backgroundWords: [],
      whispers: [],
      memories: [],
      locations: [],
    };

    setFormData(clearedConfig);
    onSave(clearedConfig);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const getDatetimeLocalValue = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return '';
    }
  };

  const daisyOptions = [
    { id: 'daisy-1', label: '1. Papatya (Sol kenar)' },
    { id: 'daisy-2', label: '2. Papatya (Sol narin)' },
    { id: 'daisy-3', label: '3. Papatya (Sol yüksek)' },
    { id: 'daisy-4', label: '4. Papatya (Sol-orta zarif)' },
    { id: 'daisy-5', label: '5. Papatya (Orta ana papatya - Önerilen)' },
    { id: 'daisy-6', label: '6. Papatya (Sağ-orta)' },
    { id: 'daisy-7', label: '7. Papatya (Sağ yüksek)' },
    { id: 'daisy-8', label: '8. Papatya (Sağ kenar)' },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[99999] w-screen h-screen flex flex-col overflow-hidden animate-in fade-in select-none">
      <div
        className={`w-full h-full flex flex-col overflow-hidden transition-colors ${
          isDark ? 'bg-[#140810] text-rose-100' : 'bg-white text-stone-900'
        }`}
      >
        {/* Fullscreen Mobile-First Top Header */}
        <div
          className={`px-4 sm:px-6 py-3.5 border-b shrink-0 flex items-center justify-between ${
            isDark ? 'bg-[#1b0b16] border-rose-950' : 'bg-stone-50 border-stone-200'
          }`}
        >
          <div>
            <h2 className="font-serif-romantic text-lg sm:text-xl font-bold leading-tight">
              Yönetim Paneli
            </h2>
            <p className="text-[11px] opacity-60 font-sans-clean">
              Tüm değişiklikler anında kaydedilir.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetAllData}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-semibold rounded-xl transition-colors"
              title="Tüm sahte verileri temizle / sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Verileri Sıfırla</span>
            </button>
            <button
              type="button"
              onClick={handleGlobalSave}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-transform active:scale-95"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" /> Kaydedildi!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Kaydet
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 opacity-60 hover:opacity-100 rounded-xl transition-colors"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Scrollable horizontally without scrollbar) */}
        <div
          className={`flex border-b overflow-x-auto px-4 sm:px-6 gap-2 text-xs font-medium font-sans-clean shrink-0 ${
            isDark ? 'border-rose-950 bg-[#11050d]' : 'border-stone-200 bg-white'
          }`}
        >
          {[
            { id: 'security', label: 'Güvenlik', icon: <Shield className="w-3.5 h-3.5" /> },
            { id: 'counter', label: 'Sayaç', icon: <Clock className="w-3.5 h-3.5" /> },
            { id: 'words', label: 'Hitaplar', icon: <Heart className="w-3.5 h-3.5" /> },
            { id: 'content', label: 'Mektup & Şiir', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'memories', label: 'Anılar', icon: <Image className="w-3.5 h-3.5" /> },
            { id: 'locations', label: 'Konumlar', icon: <MapPin className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-1.5 py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-rose-500 text-rose-500 font-semibold'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 font-sans-clean text-sm w-full max-w-3xl mx-auto">
          {/* TAB 1: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#1b0b16] border-rose-950' : 'bg-rose-50/40 border-rose-100'}`}>
                <h4 className="font-semibold text-sm mb-1">1. URL Erişim Parametresi (Token)</h4>
                <p className="text-xs opacity-70 mb-3">
                  Siteye giriş için URL'de olması gereken parametre (Örn: ?token=bizim3yilimiz).
                </p>
                <input
                  type="text"
                  value={formData.security.urlToken}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      security: { ...formData.security, urlToken: e.target.value.trim() },
                    })
                  }
                  className={`w-full px-3 py-2 text-sm border rounded-xl ${
                    isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
                  }`}
                  placeholder="bizim3yilimiz"
                />
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#1b0b16] border-rose-950' : 'bg-rose-50/40 border-rose-100'}`}>
                <h4 className="font-semibold text-sm mb-1">2. Giriş Şifresi (Kriptografik SHA-256)</h4>
                <p className="text-xs opacity-70 mb-3">
                  Şifreyi güncellemek için buraya yazınız (SHA-256 ile şifrelenir).
                </p>
                <input
                  type="text"
                  placeholder="Yeni şifre belirle (boşsa mevcut şifre kalır)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-xl ${
                    isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
                  }`}
                />
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#1b0b16] border-rose-950' : 'bg-rose-50/40 border-rose-100'}`}>
                <h4 className="font-semibold text-sm mb-1">3. Şifre İpucu (Örn: İlk buluştuğumuz tarih)</h4>
                <p className="text-xs opacity-70 mb-3">
                  Şifre ekranında (PIN penceresinde) en alt kısımda zarif bir şekilde gösterilir. Boş bırakılırsa şifre ekranında ipucu görünmez.
                </p>
                <input
                  type="text"
                  placeholder="Şifre İpucu (Örn: İlk buluştuğumuz tarih)"
                  value={formData.security.passwordHint || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      security: { ...formData.security, passwordHint: e.target.value },
                    })
                  }
                  className={`w-full px-3 py-2 text-sm border rounded-xl ${
                    isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
                  }`}
                />
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#1b0b16] border-rose-950' : 'bg-rose-50/40 border-rose-100'}`}>
                <h4 className="font-semibold text-sm mb-1">4. Şifre Ekranını Açan Gizli Papatya</h4>
                <p className="text-xs opacity-70 mb-3">
                  Açılış ekranındaki 10 papatyadan hangisinin şifre ekranını tetikleyeceğini seçin:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {daisyOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          security: { ...formData.security, secretDaisyId: opt.id },
                        })
                      }
                      className={`py-2 px-3 rounded-xl border text-xs text-left transition-all ${
                        formData.security.secretDaisyId === opt.id
                          ? 'bg-rose-500 text-white border-rose-500 font-semibold shadow-xs'
                          : isDark
                          ? 'bg-[#140810] border-rose-900/60 text-rose-200'
                          : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#1b0b16] border-rose-950' : 'bg-rose-50/40 border-rose-100'}`}>
                <h4 className="font-semibold text-sm mb-1">4. Papatya Filizlenme & Açılma Animasyon Hızı</h4>
                <p className="text-xs opacity-70 mb-3">
                  Açılış ekranındaki papatyaların sap uzama ve çiçek açma sürelerini belirleyin:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'yavas', label: '🐢 Yavaş', desc: 'Romantik & Narin' },
                    { id: 'orta', label: '🌸 Orta', desc: 'Dengeli & Doğal' },
                    { id: 'hizli', label: '⚡ Hızlı', desc: 'Canlı & Çabuk' },
                  ].map((spd) => (
                    <button
                      key={spd.id}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          daisySpeed: spd.id as 'yavas' | 'orta' | 'hizli',
                        })
                      }
                      className={`py-2.5 px-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                        (formData.daisySpeed || 'orta') === spd.id
                          ? 'bg-rose-500 text-white border-rose-500 font-semibold shadow-xs'
                          : isDark
                          ? 'bg-[#140810] border-rose-900/60 text-rose-200'
                          : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      <span className="text-xs font-bold">{spd.label}</span>
                      <span className="text-[10px] opacity-80 mt-0.5">{spd.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COUNTER */}
          {activeTab === 'counter' && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Birlikte Geçirilen Sürenin Başlangıç Tarihi ve Saati
                </label>
                <input
                  type="datetime-local"
                  value={getDatetimeLocalValue(formData.counter.startDate)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      counter: {
                        ...formData.counter,
                        startDate: new Date(e.target.value).toISOString(),
                      },
                    })
                  }
                  className={`w-full px-3 py-2 text-sm border rounded-xl ${
                    isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
                  }`}
                />
                <p className="text-[11px] opacity-60 mt-1">
                  Bu tarih baz alınarak Yıl, Ay, Gün, Saat, Dakika ve Saniye canlı akar.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Sayaç Başlığı
                </label>
                <input
                  type="text"
                  value={formData.counter.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      counter: { ...formData.counter, title: e.target.value },
                    })
                  }
                  className={`w-full px-3 py-2 text-sm border rounded-xl ${
                    isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Sayaç Alt Romantik Sözü
                </label>
                <input
                  type="text"
                  value={formData.counter.subtitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      counter: { ...formData.counter, subtitle: e.target.value },
                    })
                  }
                  className={`w-full px-3 py-2 text-sm border rounded-xl ${
                    isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
                  }`}
                />
              </div>
            </div>
          )}

          {/* TAB 3: BACKGROUND WORDS (ARKA PLAN HİTAPLARI) */}
          {activeTab === 'words' && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div>
                <h4 className="font-semibold text-base mb-1">Arka Planda Süzülen Romantik Hitaplar</h4>
                <p className="text-xs opacity-70 mb-4">
                  Ana sayfanın zemininde hafif saydam doku olarak görünen hitap kelimelerini düzenleyebilirsiniz.
                </p>
              </div>

              {/* Add word form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Yeni hitap yaz (Örn: Papatyam)..."
                  value={newWordInput}
                  onChange={(e) => setNewWordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (!newWordInput.trim()) return;
                      if (!formData.backgroundWords.includes(newWordInput.trim())) {
                        setFormData({
                          ...formData,
                          backgroundWords: [...formData.backgroundWords, newWordInput.trim()],
                        });
                      }
                      setNewWordInput('');
                    }
                  }}
                  className={`flex-1 px-3 py-2 text-sm border rounded-xl ${
                    isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newWordInput.trim()) return;
                    if (!formData.backgroundWords.includes(newWordInput.trim())) {
                      setFormData({
                        ...formData,
                        backgroundWords: [...formData.backgroundWords, newWordInput.trim()],
                      });
                    }
                    setNewWordInput('');
                  }}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Ekle
                </button>
              </div>

              {/* List of current words */}
              <div className="pt-2">
                <p className="text-xs opacity-60 mb-2">Mevcut Hitaplar ({formData.backgroundWords.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {formData.backgroundWords.map((word) => (
                    <span
                      key={word}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                        isDark
                          ? 'bg-[#1b0b16] border-rose-900/60 text-rose-200'
                          : 'bg-rose-50 border-rose-200 text-stone-800'
                      }`}
                    >
                      <span>{word}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            backgroundWords: formData.backgroundWords.filter((w) => w !== word),
                          })
                        }
                        className="text-stone-400 hover:text-red-500 transition-colors ml-0.5"
                        title="Sil"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONTENT & LETTER & WHISPERS */}
          {activeTab === 'content' && (
            <div className="space-y-6 max-w-xl mx-auto">
              {/* Welcome Quote */}
              <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-[#1b0b16] border-rose-950' : 'bg-stone-50 border-stone-200'}`}>
                <h4 className="font-semibold text-sm">Açılış Karşılama Sözü</h4>
                <div>
                  <label className="block text-xs opacity-70 mb-1">Karşılama Cümlesi</label>
                  <input
                    type="text"
                    value={formData.welcome.quote}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        welcome: { ...formData.welcome, quote: e.target.value },
                      })
                    }
                    className={`w-full px-3 py-2 text-sm border rounded-xl ${
                      isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs opacity-70 mb-1">İmza / Yazar</label>
                  <input
                    type="text"
                    value={formData.welcome.author}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        welcome: { ...formData.welcome, author: e.target.value },
                      })
                    }
                    className={`w-full px-3 py-2 text-sm border rounded-xl ${
                      isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  />
                </div>
              </div>

              {/* Love Letter */}
              <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-[#1b0b16] border-rose-950' : 'bg-stone-50 border-stone-200'}`}>
                <h4 className="font-semibold text-sm">Bana Özel Mektup & Şiir Ayarları</h4>

                {/* Görünüm Tercihi: [Mektup Göster] / [Şiir Göster] */}
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Görünüm Tercihi
                  </label>
                  <p className="text-[11px] opacity-70 mb-2">
                    Ana sayfada hangi içerik tek başına gösterilsin? (Seçilmeyen tamamen gizlenir)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          letter: {
                            ...formData.letter,
                            displayMode: 'letter',
                            defaultTab: 'letter',
                          },
                        })
                      }
                      className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        (formData.letter.displayMode || formData.letter.defaultTab || 'letter') === 'letter'
                          ? 'bg-rose-500 text-white border-rose-500 font-semibold shadow-xs'
                          : isDark
                          ? 'bg-[#140810] border-rose-900/60 text-rose-200'
                          : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      <span>💌</span>
                      <span>Mektup Göster</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          letter: {
                            ...formData.letter,
                            displayMode: 'poem',
                            defaultTab: 'poem',
                          },
                        })
                      }
                      className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        (formData.letter.displayMode || formData.letter.defaultTab) === 'poem'
                          ? 'bg-rose-500 text-white border-rose-500 font-semibold shadow-xs'
                          : isDark
                          ? 'bg-[#140810] border-rose-900/60 text-rose-200'
                          : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      <span>📜</span>
                      <span>Şiir Göster</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs opacity-70 mb-1">Mektup Başlığı</label>
                    <input
                      type="text"
                      value={formData.letter.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          letter: { ...formData.letter, title: e.target.value },
                        })
                      }
                      className={`w-full px-3 py-2 text-sm border rounded-xl ${
                        isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs opacity-70 mb-1">Hitap (Örn: Ruhumun Aynası...)</label>
                    <input
                      type="text"
                      value={formData.letter.subtitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          letter: { ...formData.letter, subtitle: e.target.value },
                        })
                      }
                      className={`w-full px-3 py-2 text-sm border rounded-xl ${
                        isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs opacity-70 mb-1">Mektup Metni</label>
                  <textarea
                    rows={6}
                    value={formData.letter.body}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        letter: { ...formData.letter, body: e.target.value },
                      })
                    }
                    className={`w-full px-3 py-2 text-sm border rounded-xl ${
                      isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  />
                </div>
              </div>

              {/* Romantic Poem */}
              <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-[#1b0b16] border-rose-950' : 'bg-stone-50 border-stone-200'}`}>
                <h4 className="font-semibold text-sm">Özel Şiir Alanı</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs opacity-70 mb-1">Şiir Başlığı</label>
                    <input
                      type="text"
                      value={formData.letter.poemTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          letter: { ...formData.letter, poemTitle: e.target.value },
                        })
                      }
                      className={`w-full px-3 py-2 text-sm border rounded-xl ${
                        isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs opacity-70 mb-1">Şiir Hitap / Alt Başlık (Opsiyonel)</label>
                    <input
                      type="text"
                      placeholder="Örn: Ruhumun Sesi..."
                      value={formData.letter.poemSubtitle || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          letter: { ...formData.letter, poemSubtitle: e.target.value },
                        })
                      }
                      className={`w-full px-3 py-2 text-sm border rounded-xl ${
                        isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs opacity-70 mb-1">Şiir Dizeleri</label>
                  <textarea
                    rows={6}
                    value={formData.letter.poemBody}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        letter: { ...formData.letter, poemBody: e.target.value },
                      })
                    }
                    className={`w-full px-3 py-2 text-sm border rounded-xl ${
                      isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  />
                </div>
              </div>

              {/* Whispers */}
              <div className={`p-4 rounded-2xl border space-y-4 ${isDark ? 'bg-[#1b0b16] border-rose-950' : 'bg-stone-50 border-stone-200'}`}>
                <h4 className="font-semibold text-sm">
                  Kalbimin Sana Fısıldadıkları ({formData.whispers.length})
                </h4>

                <div className={`p-3 rounded-xl border space-y-2 ${isDark ? 'bg-[#140810] border-rose-900/50' : 'bg-white border-stone-200'}`}>
                  <input
                    type="text"
                    placeholder="Yeni fısıltı sözü ekle..."
                    value={newWhisperText}
                    onChange={(e) => setNewWhisperText(e.target.value)}
                    className={`w-full px-3 py-1.5 text-xs border rounded-lg ${
                      isDark ? 'bg-[#0f040b] border-rose-900 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Küçük not (Örn: Her sabah aklıma ilk gelen...)"
                    value={newWhisperNote}
                    onChange={(e) => setNewWhisperNote(e.target.value)}
                    className={`w-full px-3 py-1.5 text-xs border rounded-lg ${
                      isDark ? 'bg-[#0f040b] border-rose-900 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newWhisperText.trim()) return;
                      const item: WhisperItem = {
                        id: `w-${Date.now()}`,
                        text: newWhisperText.trim(),
                        note: newWhisperNote.trim() || 'Sonsuz sevgiyle...',
                      };
                      setFormData({
                        ...formData,
                        whispers: [...formData.whispers, item],
                      });
                      setNewWhisperText('');
                      setNewWhisperNote('');
                    }}
                    className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Fısıltıyı Ekle
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {formData.whispers.map((w) => (
                    <div
                      key={w.id}
                      className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                        isDark ? 'bg-[#140810] border-rose-900/50' : 'bg-white border-stone-200'
                      }`}
                    >
                      <div>
                        <p className="font-medium">"{w.text}"</p>
                        <p className="opacity-60 text-[11px] mt-0.5">{w.note}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            whispers: formData.whispers.filter((item) => item.id !== w.id),
                          })
                        }
                        className="opacity-60 hover:opacity-100 text-red-500 p-1"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MEMORIES */}
          {activeTab === 'memories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs opacity-70">
                  Zaman çizelgesi anılarını ve doğrudan cihazınızdan seçtiğiniz fotoğrafları yönetin.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setEditingMemory({
                      id: `m-${Date.now()}`,
                      title: '',
                      date: new Date().toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }),
                      tag: 'Özel Anı',
                      description: '',
                      imageUrl: '',
                    })
                  }
                  className="px-3 py-1.5 bg-rose-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 hover:bg-rose-600"
                >
                  <Plus className="w-4 h-4" /> Yeni Anı Ekle
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.memories.map((m) => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between ${
                      isDark ? 'bg-[#1b0b16] border-rose-950' : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div>
                      {m.imageUrl && (
                        <img
                          src={m.imageUrl}
                          alt={m.title}
                          className="w-full h-32 object-cover rounded-xl mb-3"
                        />
                      )}
                      <div className="text-xs text-rose-500 font-medium mb-1">
                        {m.date} {m.tag && `· ${m.tag}`}
                      </div>
                      <h4 className="font-semibold mb-1">{m.title}</h4>
                      <p className="text-xs opacity-70 line-clamp-3">{m.description}</p>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-rose-100/20">
                      <button
                        type="button"
                        onClick={() => setEditingMemory(m)}
                        className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1 border ${
                          isDark
                            ? 'bg-[#11050d] border-rose-900 text-rose-200'
                            : 'bg-white border-stone-200 text-stone-700'
                        }`}
                      >
                        <Edit2 className="w-3 h-3" /> Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            memories: formData.memories.filter((item) => item.id !== m.id),
                          })
                        }
                        className="px-2.5 py-1 text-xs text-red-500 hover:text-red-600 rounded-lg flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: LOCATIONS */}
          {activeTab === 'locations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs opacity-70">
                  Özel buluşma mekanlarını ve anılarını düzenleyin.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setEditingLocation({
                      id: `loc-${Date.now()}`,
                      title: '',
                      subtitle: '',
                      date: new Date().toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }),
                      story: '',
                      mapQuery: 'İstanbul',
                      imageUrl: '',
                    })
                  }
                  className="px-3 py-1.5 bg-rose-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 hover:bg-rose-600"
                >
                  <Plus className="w-4 h-4" /> Yeni Konum Ekle
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.locations.map((loc) => (
                  <div
                    key={loc.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between ${
                      isDark ? 'bg-[#1b0b16] border-rose-950' : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div>
                      {loc.imageUrl && (
                        <img
                          src={loc.imageUrl}
                          alt={loc.title}
                          className="w-full h-32 object-cover rounded-xl mb-3"
                        />
                      )}
                      <span className="text-[11px] opacity-60">{loc.date}</span>
                      <h4 className="font-semibold">{loc.title}</h4>
                      <p className="text-xs text-rose-500 font-medium mb-1">{loc.subtitle}</p>
                      <p className="text-xs opacity-70 line-clamp-2">{loc.story}</p>
                      <p className="text-[11px] opacity-60 mt-2">📍 {loc.mapQuery}</p>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-rose-100/20">
                      <button
                        type="button"
                        onClick={() => setEditingLocation(loc)}
                        className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1 border ${
                          isDark
                            ? 'bg-[#11050d] border-rose-900 text-rose-200'
                            : 'bg-white border-stone-200 text-stone-700'
                        }`}
                      >
                        <Edit2 className="w-3 h-3" /> Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            locations: formData.locations.filter((item) => item.id !== loc.id),
                          })
                        }
                        className="px-2.5 py-1 text-xs text-red-500 hover:text-red-600 rounded-lg flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Memory Modal - ZERO CODE PATH BOXES, PURE FILE PICKER */}
      {editingMemory && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-3 font-sans-clean text-sm border shadow-2xl ${
              isDark ? 'bg-[#1b0b16] border-rose-950 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            <h3 className="font-bold text-base">Anıyı Düzenle</h3>
            <div>
              <label className="text-xs opacity-70 block mb-1">Başlık</label>
              <input
                type="text"
                value={editingMemory.title}
                onChange={(e) =>
                  setEditingMemory({ ...editingMemory, title: e.target.value })
                }
                className={`w-full px-3 py-1.5 text-xs border rounded-lg ${
                  isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200'
                }`}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs opacity-70 block mb-1">Tarih</label>
                <input
                  type="text"
                  value={editingMemory.date}
                  onChange={(e) =>
                    setEditingMemory({ ...editingMemory, date: e.target.value })
                  }
                  className={`w-full px-3 py-1.5 text-xs border rounded-lg ${
                    isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200'
                  }`}
                />
              </div>
              <div>
                <label className="text-xs opacity-70 block mb-1">Etiket</label>
                <input
                  type="text"
                  value={editingMemory.tag || ''}
                  onChange={(e) =>
                    setEditingMemory({ ...editingMemory, tag: e.target.value })
                  }
                  className={`w-full px-3 py-1.5 text-xs border rounded-lg ${
                    isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200'
                  }`}
                />
              </div>
            </div>

            {/* DIRECT PHOTO SELECTION - NO TEXT PATH INPUT */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs opacity-70 block font-medium">Fotoğraf</label>
              {editingMemory.imageUrl ? (
                <div className="relative rounded-2xl overflow-hidden border aspect-video max-h-40 bg-stone-100">
                  <img
                    src={editingMemory.imageUrl}
                    alt="Anı Önizleme"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                    <label className="px-3 py-1.5 bg-white text-stone-900 text-xs font-semibold rounded-xl cursor-pointer hover:bg-stone-100 shadow-md">
                      Değiştir
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleDeviceImageUpload(e, (base64) =>
                            setEditingMemory({ ...editingMemory, imageUrl: base64 })
                          )
                        }
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditingMemory({ ...editingMemory, imageUrl: '' })}
                      className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-xl hover:bg-red-600 shadow-md"
                    >
                      Kaldır
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  className={`flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
                    isDark
                      ? 'border-rose-900/60 hover:border-rose-500 bg-[#11050d]'
                      : 'border-rose-200 hover:border-rose-400 bg-rose-50/30'
                  }`}
                >
                  <Camera className="w-6 h-6 text-rose-400 mb-1" />
                  <span className="text-xs font-semibold text-rose-500">Cihazdan Fotoğraf Seç</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleDeviceImageUpload(e, (base64) =>
                        setEditingMemory({ ...editingMemory, imageUrl: base64 })
                      )
                    }
                  />
                </label>
              )}
            </div>

            <div>
              <label className="text-xs opacity-70 block mb-1">Açıklama / Hikaye</label>
              <textarea
                rows={3}
                value={editingMemory.description}
                onChange={(e) =>
                  setEditingMemory({ ...editingMemory, description: e.target.value })
                }
                className={`w-full px-3 py-1.5 text-xs border rounded-lg ${
                  isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200'
                }`}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingMemory(null)}
                className="px-3 py-1.5 text-xs opacity-60 hover:opacity-100"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => {
                  const exists = formData.memories.some((m) => m.id === editingMemory.id);
                  const updated = exists
                    ? formData.memories.map((m) =>
                        m.id === editingMemory.id ? editingMemory : m
                      )
                    : [...formData.memories, editingMemory];
                  setFormData({ ...formData, memories: updated });
                  setEditingMemory(null);
                }}
                className="px-4 py-1.5 bg-rose-500 text-white rounded-xl text-xs font-semibold"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Location Modal - ZERO CODE PATH BOXES, PURE FILE PICKER */}
      {editingLocation && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-3 font-sans-clean text-sm border shadow-2xl ${
              isDark ? 'bg-[#1b0b16] border-rose-950 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            <h3 className="font-bold text-base">Konumu Düzenle</h3>
            <div>
              <label className="text-xs opacity-70 block mb-1">Konum Başlığı</label>
              <input
                type="text"
                value={editingLocation.title}
                onChange={(e) =>
                  setEditingLocation({ ...editingLocation, title: e.target.value })
                }
                className={`w-full px-3 py-1.5 text-xs border rounded-lg ${
                  isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200'
                }`}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs opacity-70 block mb-1">Alt Başlık</label>
                <input
                  type="text"
                  value={editingLocation.subtitle}
                  onChange={(e) =>
                    setEditingLocation({ ...editingLocation, subtitle: e.target.value })
                  }
                  className={`w-full px-3 py-1.5 text-xs border rounded-lg ${
                    isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200'
                  }`}
                />
              </div>
              <div>
                <label className="text-xs opacity-70 block mb-1">Tarih</label>
                <input
                  type="text"
                  value={editingLocation.date}
                  onChange={(e) =>
                    setEditingLocation({ ...editingLocation, date: e.target.value })
                  }
                  className={`w-full px-3 py-1.5 text-xs border rounded-lg ${
                    isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200'
                  }`}
                />
              </div>
            </div>
            <div>
              <label className="text-xs opacity-70 block mb-1">Google Haritalar Arama Adresi</label>
              <input
                type="text"
                value={editingLocation.mapQuery}
                onChange={(e) =>
                  setEditingLocation({ ...editingLocation, mapQuery: e.target.value })
                }
                className={`w-full px-3 py-1.5 text-xs border rounded-lg ${
                  isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200'
                }`}
              />
            </div>

            {/* DIRECT PHOTO SELECTION - NO TEXT PATH INPUT */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs opacity-70 block font-medium">Mekan Fotoğrafı</label>
              {editingLocation.imageUrl ? (
                <div className="relative rounded-2xl overflow-hidden border aspect-video max-h-40 bg-stone-100">
                  <img
                    src={editingLocation.imageUrl}
                    alt="Konum Önizleme"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                    <label className="px-3 py-1.5 bg-white text-stone-900 text-xs font-semibold rounded-xl cursor-pointer hover:bg-stone-100 shadow-md">
                      Değiştir
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleDeviceImageUpload(e, (base64) =>
                            setEditingLocation({ ...editingLocation, imageUrl: base64 })
                          )
                        }
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditingLocation({ ...editingLocation, imageUrl: '' })}
                      className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-xl hover:bg-red-600 shadow-md"
                    >
                      Kaldır
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  className={`flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
                    isDark
                      ? 'border-rose-900/60 hover:border-rose-500 bg-[#11050d]'
                      : 'border-rose-200 hover:border-rose-400 bg-rose-50/30'
                  }`}
                >
                  <Camera className="w-6 h-6 text-rose-400 mb-1" />
                  <span className="text-xs font-semibold text-rose-500">Cihazdan Fotoğraf Seç</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleDeviceImageUpload(e, (base64) =>
                        setEditingLocation({ ...editingLocation, imageUrl: base64 })
                      )
                    }
                  />
                </label>
              )}
            </div>

            <div>
              <label className="text-xs opacity-70 block mb-1">Hikayesi / Anısı</label>
              <textarea
                rows={3}
                value={editingLocation.story}
                onChange={(e) =>
                  setEditingLocation({ ...editingLocation, story: e.target.value })
                }
                className={`w-full px-3 py-1.5 text-xs border rounded-lg ${
                  isDark ? 'bg-[#11050d] border-rose-900 text-rose-100' : 'bg-white border-stone-200'
                }`}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingLocation(null)}
                className="px-3 py-1.5 text-xs opacity-60 hover:opacity-100"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => {
                  const exists = formData.locations.some((l) => l.id === editingLocation.id);
                  const updated = exists
                    ? formData.locations.map((l) =>
                        l.id === editingLocation.id ? editingLocation : l
                      )
                    : [...formData.locations, editingLocation];
                  setFormData({ ...formData, locations: updated });
                  setEditingLocation(null);
                }}
                className="px-4 py-1.5 bg-rose-500 text-white rounded-xl text-xs font-semibold"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};
