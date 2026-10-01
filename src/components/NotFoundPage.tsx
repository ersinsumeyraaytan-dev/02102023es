import React, { useState } from 'react';

interface NotFoundPageProps {
  expectedToken: string;
  onTokenEntered: (token: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ expectedToken, onTokenEntered }) => {
  const [clickCount, setClickCount] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSecretClick = () => {
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= 3) {
      setShowPrompt(true);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() === expectedToken.trim()) {
      // Set token in URL
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('token', inputVal.trim());
      window.history.replaceState({}, '', currentUrl.toString());
      onTokenEntered(inputVal.trim());
    } else {
      setErrorMsg('Geçersiz erişim anahtarı');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] bg-white text-black font-mono select-none flex flex-col justify-start items-start p-6 text-left"
      style={{ backgroundColor: '#ffffff', color: '#000000' }}
    >
      <div className="max-w-2xl w-full">
        <h1
          className="text-2xl font-bold tracking-tight mb-2 cursor-default"
          onClick={handleSecretClick}
          title=""
        >
          404 Not Found
        </h1>
        <p
          className="text-base text-stone-900 cursor-default"
          onClick={handleSecretClick}
        >
          The requested URL was not found on this server.
        </p>
        <hr className="my-4 border-stone-300 w-full" />
        <p className="text-xs text-stone-600">
          Apache/2.4.52 (Ubuntu) Server at ais-pre-applet Port 80
        </p>
      </div>

      {/* Secret Quick Unlock Dialog (Opened by 3 clicks on text or secret key) */}
      {showPrompt && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-[100000]">
          <div className="bg-white text-stone-900 p-6 rounded-xl shadow-2xl max-w-sm w-full border border-stone-200 font-sans">
            <h3 className="font-semibold text-base mb-1 text-stone-900">Özel Giriş Anahtarı</h3>
            <p className="text-xs text-stone-500 mb-4">
              Siteye erişebilmek için URL'de <code className="bg-stone-100 px-1 py-0.5 rounded text-rose-600">?token={expectedToken}</code> olmalıdır veya aşağıya anahtarı giriniz:
            </p>
            <form onSubmit={handleUnlock} className="space-y-3">
              <input
                type="text"
                autoFocus
                placeholder="Örn: bizim3yilimiz"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-stone-500"
              />
              {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowPrompt(false)}
                  className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-700"
                >
                  Kapat
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputVal(expectedToken);
                    // auto unlock
                    const currentUrl = new URL(window.location.href);
                    currentUrl.searchParams.set('token', expectedToken);
                    window.history.replaceState({}, '', currentUrl.toString());
                    onTokenEntered(expectedToken);
                  }}
                  className="px-3 py-1.5 text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md font-medium"
                >
                  Otomatik Doldur
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-stone-900 text-white rounded-md font-medium hover:bg-stone-800"
                >
                  Giriş Yap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
