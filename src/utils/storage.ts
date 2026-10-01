import { AppConfig } from '../types';

export async function hashPassword(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const STORAGE_KEY = 'bizim3yilimiz_config_clean_v1';
export const AUTH_SESSION_KEY = 'bizim3yilimiz_authenticated';
export const THEME_STORAGE_KEY = 'bizim3yilimiz_theme';

export const DEFAULT_BACKGROUND_WORDS: string[] = [];

// SHA-256 for "3yilimiz" is "432be145c91c705c363929efe527aa6980abddd618c2a7f3d93916ebc31c730e"
export const DEFAULT_CONFIG: AppConfig = {
  security: {
    urlToken: 'bizim3yilimiz',
    passwordHash: '432be145c91c705c363929efe527aa6980abddd618c2a7f3d93916ebc31c730e',
    passwordHint: '',
    secretDaisyId: 'daisy-5',
  },
  counter: {
    startDate: '',
    title: '',
    subtitle: '',
  },
  welcome: {
    quote: '',
    author: '',
    subQuote: '',
  },
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
  firebase: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  },
  daisySpeed: 'orta',
  backgroundWords: [],
  whispers: [],
  memories: [],
  locations: [],
};

export function loadConfig(): AppConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      security: {
        ...DEFAULT_CONFIG.security,
        ...(parsed.security || {}),
        secretDaisyId: parsed.security?.secretDaisyId || 'daisy-5',
      },
      counter: {
        ...DEFAULT_CONFIG.counter,
        ...(parsed.counter || {}),
      },
      welcome: {
        ...DEFAULT_CONFIG.welcome,
        ...(parsed.welcome || {}),
      },
      letter: {
        ...DEFAULT_CONFIG.letter,
        ...(parsed.letter || {}),
      },
      firebase: {
        ...DEFAULT_CONFIG.firebase,
        ...(parsed.firebase || {}),
      },
      daisySpeed: parsed.daisySpeed || 'orta',
      backgroundWords: Array.isArray(parsed.backgroundWords) ? parsed.backgroundWords : [],
      whispers: Array.isArray(parsed.whispers) ? parsed.whispers : [],
      memories: Array.isArray(parsed.memories) ? parsed.memories : [],
      locations: Array.isArray(parsed.locations) ? parsed.locations : [],
    };
  } catch (e) {
    console.error('Error loading config from localStorage', e);
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: AppConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving config to localStorage', e);
  }
}
