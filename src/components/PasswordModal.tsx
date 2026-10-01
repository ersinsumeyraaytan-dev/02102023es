import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { hashPassword } from '../utils/storage';
import { Lock, Heart, ArrowRight, Eye, EyeOff, Sparkles, X } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  expectedHash: string;
  onSuccess: () => void;
  passwordHint?: string;
  isDark?: boolean;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  expectedHash,
  onSuccess,
  passwordHint,
  isDark = false,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const triggerRomanticConfetti = () => {
    const count = 220;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#fda4af', '#f43f5e', '#fbbf24', '#fecdd3', '#ffffff', '#e11d48'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsVerifying(true);
    setError(false);

    try {
      const computedHash = await hashPassword(password.trim());
      if (computedHash.toLowerCase() === expectedHash.toLowerCase()) {
        triggerRomanticConfetti();
        setTimeout(() => {
          setIsVerifying(false);
          onSuccess();
        }, 650);
      } else {
        setIsVerifying(false);
        setError(true);
        // Trigger subtle horizontal shake exactly once for 0.35s, then stop completely
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 380);
      }
    } catch (err) {
      console.error(err);
      setIsVerifying(false);
      setError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 380);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300 select-none">
      <div
        className={`relative w-full max-w-sm rounded-3xl p-6 sm:p-8 shadow-2xl border backdrop-blur-xl transition-colors duration-200 ${
          isDark
            ? 'bg-[#180a13]/95 border-rose-950 text-rose-100'
            : 'bg-white/95 border-rose-100/80 text-stone-900'
        } ${isShaking ? 'animate-shake-once' : ''}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 opacity-50 hover:opacity-100 rounded-full transition-opacity"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Romantic Lock Icon */}
        <div
          className={`mx-auto w-16 h-16 rounded-2xl border flex items-center justify-center text-rose-500 mb-5 shadow-xs ${
            isDark ? 'bg-rose-950/40 border-rose-900/50' : 'bg-rose-50 border-rose-100'
          }`}
        >
          <Heart className="w-8 h-8 fill-rose-500 stroke-rose-500" />
        </div>

        <div className="text-center mb-6">
          <h3 className="font-serif-romantic text-2xl font-bold tracking-tight">
            Aşkımızın Kapısı
          </h3>
          <p className="text-xs opacity-70 mt-1.5 font-sans-clean">
            Sadece iki kalbin bildiği özel şifreyi gir sevgilim...
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              autoFocus
              placeholder="Şifreyi buraya yaz..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              className={`w-full pl-10 pr-11 py-3 text-sm border rounded-xl outline-none transition-all font-sans-clean ${
                error
                  ? 'border-rose-500 ring-2 ring-rose-200'
                  : isDark
                  ? 'bg-[#12060e] border-rose-900/80 text-rose-100 placeholder:text-rose-900/60 focus:border-rose-500'
                  : 'bg-stone-50/80 border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-100'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center opacity-50 hover:opacity-100"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Static single red error message without bounce */}
          {error && (
            <p className="text-xs text-rose-500 font-medium text-center font-sans-clean select-none">
              Yanlış şifre birtanem, lütfen tekrar dene...
            </p>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full h-11 bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white font-medium text-sm rounded-xl shadow-md shadow-rose-500/25 hover:shadow-lg hover:shadow-rose-500/35 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" /> Doğrulanıyor...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Kalbe Giriş Yap <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        {passwordHint && passwordHint.trim() && (
          <div className="mt-5 text-center px-2">
            <p className={`text-xs italic font-serif-romantic ${
              isDark ? 'text-rose-300/70' : 'text-stone-500'
            }`}>
              💡 <span className="font-sans-clean font-medium not-italic text-[11px] opacity-80">İpucu:</span> {passwordHint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
