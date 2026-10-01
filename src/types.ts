export interface MemoryItem {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  tag?: string;
}

export interface LocationItem {
  id: string;
  title: string;
  subtitle: string;
  story: string;
  mapQuery: string;
  date: string;
  imageUrl?: string;
}

export interface WhisperItem {
  id: string;
  text: string;
  note: string;
}

export interface FirebaseSettings {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface AppConfig {
  security: {
    urlToken: string;
    passwordHash: string; // SHA-256 hash (lowercase hex)
    passwordHint: string;
    secretDaisyId: string; // e.g. "right-2"
  };
  counter: {
    startDate: string; // ISO string e.g. "2023-09-30T19:00:00"
    title: string;
    subtitle: string;
  };
  welcome: {
    quote: string;
    author: string;
    subQuote?: string;
  };
  letter: {
    title: string;
    subtitle: string;
    body: string;
    poemTitle: string;
    poemSubtitle?: string;
    poemBody: string;
    displayMode?: 'letter' | 'poem';
    defaultTab?: 'letter' | 'poem';
  };
  backgroundWords: string[];
  whispers: WhisperItem[];
  memories: MemoryItem[];
  locations: LocationItem[];
  firebase?: FirebaseSettings;
  daisySpeed?: 'yavas' | 'orta' | 'hizli';
}
