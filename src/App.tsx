/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppConfig, MemoryItem, LocationItem, WhisperItem, FirebaseSettings } from './types';
import { hashPassword, THEME_STORAGE_KEY } from './utils/storage';
import { isFirebaseConfigured, listenToFirebaseData, pushToFirebase, EMPTY_FIREBASE_CONFIG } from './utils/firebaseSync';

import { NotFoundPage } from './components/NotFoundPage';
import { FloatingParticles } from './components/FloatingParticles';
import { CssDaisyMeadow } from './components/CssDaisyMeadow';
import { PasswordModal } from './components/PasswordModal';
import { TouchHeartEffect } from './components/TouchHeartEffect';
import { HeaderNav, NavTab } from './components/HeaderNav';
import { CounterSection } from './components/CounterSection';
import { LetterSection } from './components/LetterSection';
import { MemoriesTimeline } from './components/MemoriesTimeline';
import { LocationsSection } from './components/LocationsSection';
import { AdminModal } from './components/AdminModal';
import { Settings, Heart, Sun, Moon } from 'lucide-react';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🔥 FIREBASE REALTIME DATABASE CONFIGURATION (firebaseConfig)
 * Buraya Firebase konsolundan aldığınız config bilgilerini ekleyebilirsiniz.
 * Eğer bu config boş kalırsa sistem otomatik olarak localStorage üzerinden
 * hiçbir hata vermeden kesintisiz çalışmaya devam eder.
 * ════════════════════════════════════════════════════════════════════════════
 */
export const firebaseConfig: FirebaseSettings = {
  apiKey: 'AIzaSyAZqVoDs3x_x4U5oHIJuXG6KkBGAnpU74Y',
  authDomain: 'gen-lang-client-0947376084.firebaseapp.com',
  databaseURL: '',
  projectId: 'gen-lang-client-0947376084',
  storageBucket: 'gen-lang-client-0947376084.firebasestorage.app',
  messagingSenderId: '139263933187',
  appId: '1:139263933187:web:78be10254d2774a0f2c736',
};

export const DEFAULT_FIREBASE_CONFIG: FirebaseSettings = firebaseConfig;

/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🌸 BİZİM 3. YILIMIZ - BAŞLANGIÇ VE MERKEZİ AYARLAR (INITIAL_CONFIG)
 * Tüm sahte veriler sıfırlanmıştır. Bilgileri Ayarlar Panelinden girebilirsiniz.
 * ════════════════════════════════════════════════════════════════════════════
 */
export const INITIAL_CONFIG: AppConfig = {
  // 🛡️ 1. GÜVENLİK VE GİRİŞ AYARLARI
  security: {
    urlToken: 'bizim3yilimiz',
    passwordHash: '432be145c91c705c363929efe527aa6980abddd618c2a7f3d93916ebc31c730e', // 3yilimiz
    passwordHint: '',
    secretDaisyId: 'daisy-5',
  },

  // ⏳ 2. BİRLİKTE GEÇİRİLEN SÜRE SAYACI
  counter: {
    startDate: '',
    title: '',
    subtitle: '',
  },

  // 🌸 3. AÇILIŞ EKRANI KARŞILAMA SÖZLERİ
  welcome: {
    quote: '',
    subQuote: '',
    author: '',
  },

  // 💌 4. BANA ÖZEL MEKTUP VE ŞİİR
  letter: {
    title: '',
    subtitle: '',
    body: '',
    poemTitle: '',
    poemSubtitle: '',
    poemBody: '',
    displayMode: 'letter',
    defaultTab: 'letter',
  },

  // 💬 5. ARKA PLANDA SÜZÜLEN ROMANTİK HİTAPLAR
  backgroundWords: [],

  // 💖 6. KALBİMİN SANA FISILDADIKLARI
  whispers: [],

  // 📸 7. UNUTULMAZ ANILARIMIZ (TIMELINE)
  memories: [],

  // 📍 8. ÖZEL BULUŞMA VE HATIRA MEKANLARIMIZ
  locations: [],

  // 🔥 9. FIREBASE GERÇEK ZAMANLI VERİTABANI
  firebase: DEFAULT_FIREBASE_CONFIG,

  // 🌸 10. PAPATYA AÇILIŞ ANİMASYON HIZI: 'yavas' | 'orta' | 'hizli'
  daisySpeed: 'orta',
};

const LOCAL_STORAGE_KEY = 'bizim3yilimiz_config_clean_v4';

function getInitialMergedConfig(): AppConfig {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return INITIAL_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_CONFIG,
      ...parsed,
      security: {
        ...INITIAL_CONFIG.security,
        ...(parsed.security || {}),
        secretDaisyId: parsed.security?.secretDaisyId || 'right-2',
      },
      counter: {
        ...INITIAL_CONFIG.counter,
        ...(parsed.counter || {}),
      },
      welcome: {
        ...INITIAL_CONFIG.welcome,
        ...(parsed.welcome || {}),
      },
      letter: {
        ...INITIAL_CONFIG.letter,
        ...(parsed.letter || {}),
      },
      firebase: {
        ...DEFAULT_FIREBASE_CONFIG,
        ...(parsed.firebase || {}),
      },
      daisySpeed: parsed.daisySpeed || 'orta',
      backgroundWords: Array.isArray(parsed.backgroundWords) ? parsed.backgroundWords : [],
      whispers: Array.isArray(parsed.whispers) ? parsed.whispers : [],
      memories: Array.isArray(parsed.memories) ? parsed.memories : [],
      locations: Array.isArray(parsed.locations) ? parsed.locations : [],
    };
  } catch {
    return INITIAL_CONFIG;
  }
}

export default function App() {
  const [config, setConfig] = useState<AppConfig>(() => getInitialMergedConfig());
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Theme state (Light / Dark) saved to localStorage
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) === 'dark';
    } catch {
      return false;
    }
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // 1. Security Check: URL token (?token=bizim3yilimiz)
  const [hasValidToken, setHasValidToken] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenInUrl = params.get('token');
    return tokenInUrl === config.security.urlToken;
  });

  // 2. Mandatory Flow: Always start on the Opening Screen!
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // 3. F12 and Right-Click Protection
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Listen to popstate in case token is set
  useEffect(() => {
    const checkToken = () => {
      const params = new URLSearchParams(window.location.search);
      setHasValidToken(params.get('token') === config.security.urlToken);
    };
    window.addEventListener('popstate', checkToken);
    return () => window.removeEventListener('popstate', checkToken);
  }, [config.security.urlToken]);

  // 🔥 FIREBASE REALTIME DATABASE LISTENER
  useEffect(() => {
    const fb = config.firebase || DEFAULT_FIREBASE_CONFIG;
    if (!isFirebaseConfigured(fb)) return;

    const unsubscribe = listenToFirebaseData(fb, (remoteData) => {
      if (remoteData && typeof remoteData === 'object') {
        setConfig((prev) => {
          const merged: AppConfig = {
            ...prev,
            ...remoteData,
            security: { ...prev.security, ...(remoteData.security || {}) },
            counter: { ...prev.counter, ...(remoteData.counter || {}) },
            welcome: { ...prev.welcome, ...(remoteData.welcome || {}) },
            letter: { ...prev.letter, ...(remoteData.letter || {}) },
            backgroundWords: remoteData.backgroundWords || prev.backgroundWords,
            whispers: remoteData.whispers || prev.whispers,
            memories: remoteData.memories || prev.memories,
            locations: remoteData.locations || prev.locations,
            firebase: { ...(prev.firebase || DEFAULT_FIREBASE_CONFIG), ...(remoteData.firebase || {}) },
          };
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {
            console.error(e);
          }
          return merged;
        });
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [config.firebase?.databaseURL, config.firebase?.projectId, config.firebase?.apiKey]);

  const handleSaveConfig = async (newConfig: AppConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.error(e);
    }
    const fb = newConfig.firebase || DEFAULT_FIREBASE_CONFIG;
    if (isFirebaseConfigured(fb)) {
      await pushToFirebase(fb, newConfig);
    }
    const params = new URLSearchParams(window.location.search);
    setHasValidToken(params.get('token') === newConfig.security.urlToken);
  };

  const handlePasswordSuccess = () => {
    setIsAuthenticated(true);
    setShowPasswordModal(false);
  };

  // 🛡️ Security: F12 and Right-Click ContextMenu Protection
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const daisyIds = ['daisy-1', 'daisy-2', 'daisy-3', 'daisy-4', 'daisy-5', 'daisy-6', 'daisy-7', 'daisy-8'];
  const secretDaisyIndex = daisyIds.indexOf(config.security.secretDaisyId) !== -1
    ? daisyIds.indexOf(config.security.secretDaisyId)
    : 4;

  // If token is missing/wrong: Render standard realistic 404 page!
  if (!hasValidToken) {
    return (
      <NotFoundPage
        expectedToken={config.security.urlToken}
        onTokenEntered={() => setHasValidToken(true)}
      />
    );
  }

  return (
    <div className="pc-outer-stage selection:bg-rose-500 selection:text-white">
      {/* 📱 STRICT 430px MOBILE CONTAINER (CENTERED ON PC, 100% ON PHONE) */}
      <div
        className={`mobile-app-container font-sans-clean flex flex-col justify-between transition-colors duration-300 ${
          isDark ? 'bg-[#0f060c] text-rose-100' : 'bg-rose-50/20 text-stone-800'
        }`}
        style={{
          maxWidth: '430px',
          margin: '0 auto',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        {/* Floating particles background inside mobile canvas */}
        <FloatingParticles />

        {/* Touch/Click heart particle effect */}
        <TouchHeartEffect />

        {/* STAGE A: WELCOME / SECRET DAISY OPENING SCREEN */}
        {!isAuthenticated ? (
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 min-h-screen w-full overflow-hidden">
            {/* Top corner Theme Toggle on Welcome Screen */}
            <div className="absolute top-4 right-4 z-30">
              <button
                onClick={toggleTheme}
                aria-label={isDark ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
                className={`p-2.5 rounded-full border transition-all ${
                  isDark
                    ? 'bg-[#1e0e18] border-rose-900/60 text-amber-300 shadow-sm'
                    : 'bg-white/90 border-rose-200 text-rose-600 shadow-xs'
                }`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {/* MAIN OPENING CARD - CENTERED WITHIN 430px MOBILE FRAME */}
            <div className="w-full max-w-[360px] mx-auto flex flex-col items-center text-center z-20 mb-36 sm:mb-44">
              {/* Soft decorative badge */}
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-[11px] font-semibold mb-5 shadow-2xs font-sans-clean transition-colors ${
                  isDark
                    ? 'bg-[#180a13]/85 border-rose-900/50 text-rose-300'
                    : 'bg-white/80 border-rose-100 text-rose-500'
                }`}
              >
                <span>❤️</span>
                <span>Sonsuz Masalımız</span>
                <span>❤️</span>
              </div>

              {/* Central Romantic Quote Card */}
              <div
                className={`w-full rounded-3xl p-6 sm:p-8 border shadow-lg backdrop-blur-md transition-colors ${
                  isDark
                    ? 'bg-[#1c0c16]/90 border-rose-950/80 text-rose-100'
                    : 'bg-white/90 border-rose-100/90 text-stone-900'
                }`}
              >
                <p className="font-serif-romantic text-xl sm:text-2xl font-bold leading-snug tracking-tight text-center">
                  "{config.welcome.quote || 'Bizim 3. Yılımız'}"
                </p>

                {config.welcome.subQuote && (
                  <p className="font-script-love text-3xl sm:text-4xl text-rose-500 mt-3 text-center">
                    {config.welcome.subQuote}
                  </p>
                )}

                {config.welcome.author ? (
                  <div
                    className={`mt-5 pt-4 border-t text-xs font-serif-romantic italic text-center ${
                      isDark ? 'border-rose-950 text-rose-300/60' : 'border-rose-100/80 text-stone-500'
                    }`}
                  >
                    — {config.welcome.author}
                  </div>
                ) : null}
              </div>

              {/* Quiet poetic prompt */}
              <p
                className={`text-[11px] mt-4 font-serif-romantic italic select-none text-center px-4 ${
                  isDark ? 'text-rose-300/40' : 'text-stone-400'
                }`}
              >
                Sevgiyle yeşeren her çiçek, kalbimin sana açan bir yaprağıdır...
              </p>
            </div>

            {/* 🌸 PURE CSS DAISY FLOWER ANIMATION (8 HEADS, BOTTOM-0 ANCHORED) */}
            <CssDaisyMeadow
              secretDaisyIndex={secretDaisyIndex}
              onSecretClick={() => setShowPasswordModal(true)}
              speed={config.daisySpeed || 'orta'}
            />

            {/* Password Modal */}
            <PasswordModal
              isOpen={showPasswordModal}
              onClose={() => setShowPasswordModal(false)}
              expectedHash={config.security.passwordHash}
              onSuccess={handlePasswordSuccess}
              passwordHint={config.security.passwordHint}
              isDark={isDark}
            />
          </div>
        ) : (
          /* STAGE B: MAIN LOGGED-IN ROMANTIC SPA */
          <div className="page-transition-enter relative z-10 flex-1 flex flex-col justify-between w-full overflow-x-hidden">
            {/* Subtle Romantic Words Watermark Background */}
            <div
              className={`absolute inset-0 pointer-events-none select-none z-0 overflow-hidden flex flex-wrap gap-6 p-6 font-serif-romantic text-2xl font-bold transition-opacity ${
                isDark ? 'opacity-[0.04] text-rose-300' : 'opacity-[0.035] text-stone-900'
              }`}
            >
              {config.backgroundWords.map((word, idx) => (
                <span key={`${word}-${idx}`}>{word}</span>
              ))}
            </div>

            <div className="w-full overflow-x-hidden">
              {/* Header Navigation with Strictly "E ❤️ S" & Theme Toggle */}
              <HeaderNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isDark={isDark}
                onToggleTheme={toggleTheme}
              />

              {/* Main Content Area with Smooth Page/Tab Transitions */}
              <main className="px-3.5 py-6 w-full">
                <div key={activeTab} className="page-transition-enter space-y-8 w-full">
                  {/* TAB 1: ANA SAYFA */}
                  {activeTab === 'home' && (
                    <div className="space-y-8">
                      {/* Live Anniversary Counter */}
                      <CounterSection
                        startDate={config.counter.startDate}
                        title={config.counter.title}
                        subtitle={config.counter.subtitle}
                        isDark={isDark}
                      />

                      {/* Letter or Poem Section (Exclusive Single View) */}
                      <LetterSection
                        title={config.letter.title}
                        subtitle={config.letter.subtitle}
                        body={config.letter.body}
                        poemTitle={config.letter.poemTitle}
                        poemSubtitle={config.letter.poemSubtitle}
                        poemBody={config.letter.poemBody}
                        whispers={config.whispers}
                        displayMode={config.letter.displayMode || config.letter.defaultTab || 'letter'}
                        isDark={isDark}
                      />
                    </div>
                  )}

                  {/* TAB 2: ANILAR (TIMELINE) */}
                  {activeTab === 'memories' && (
                    <MemoriesTimeline memories={config.memories} isDark={isDark} />
                  )}

                  {/* TAB 3: KONUMLAR */}
                  {activeTab === 'locations' && (
                    <LocationsSection locations={config.locations} isDark={isDark} />
                  )}
                </div>
              </main>
            </div>

            {/* Footer & Discreet Settings Button */}
            <footer
              className={`mt-10 border-t py-6 px-4 text-center transition-colors w-full ${
                isDark ? 'border-rose-950/60' : 'border-rose-100/60'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <p
                  className={`font-serif-romantic text-xs ${
                    isDark ? 'text-rose-300/50' : 'text-stone-500'
                  }`}
                >
                  Sonsuz sevgi ve sadakatle hazırlandı · E ❤️ S
                </p>

                {/* Discreet Settings Link */}
                <button
                  type="button"
                  onClick={() => setShowAdminModal(true)}
                  className={`text-xs cursor-pointer transition-all py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 font-sans-clean font-medium ${
                    isDark
                      ? 'text-rose-300/70 hover:text-rose-200 hover:bg-rose-950/60 active:scale-95'
                      : 'text-stone-500 hover:text-rose-600 hover:bg-rose-50 active:scale-95'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Ayarlar</span>
                </button>
              </div>
            </footer>
          </div>
        )}
      </div>

      {/* Full Screen Admin Modal */}
      <AdminModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        config={config}
        onSave={handleSaveConfig}
        isDark={isDark}
      />
    </div>
  );
}
