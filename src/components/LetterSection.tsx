import React, { useState } from 'react';
import { Heart, Feather, Quote, Check, Copy, BookOpen } from 'lucide-react';
import { WhisperItem } from '../types';

interface LetterSectionProps {
  title: string;
  subtitle: string;
  body: string;
  poemTitle: string;
  poemSubtitle?: string;
  poemBody: string;
  whispers: WhisperItem[];
  displayMode?: 'letter' | 'poem';
  defaultTab?: 'letter' | 'poem';
  isDark?: boolean;
}

export const LetterSection: React.FC<LetterSectionProps> = ({
  title,
  subtitle,
  body,
  poemTitle,
  poemSubtitle,
  poemBody,
  whispers,
  displayMode,
  defaultTab,
  isDark = false,
}) => {
  const currentMode = displayMode || defaultTab || 'letter';
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedWhispers, setLikedWhispers] = useState<Record<string, boolean>>({});

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleLike = (id: string) => {
    setLikedWhispers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-12">
      {/* ═════════════════════════════════════════════════════════════════
          EXCLUSIVE CONTENT CARD (LETTER OR POEM ONLY)
          ═════════════════════════════════════════════════════════════════ */}
      <section
        className={`relative rounded-3xl border p-6 sm:p-10 shadow-xs overflow-hidden transition-colors duration-300 ${
          isDark
            ? 'bg-[#180a13] border-rose-950/80 text-rose-100'
            : 'bg-white border-rose-100 text-stone-900'
        }`}
      >
        {currentMode === 'letter' ? (
          /* YALNIZCA MEKTUP KARTI */
          <div className="relative space-y-6">
            <div className={`flex items-center gap-3 border-b pb-5 ${
              isDark ? 'border-rose-950/60' : 'border-rose-100'
            }`}>
              <span className={`p-2.5 rounded-2xl text-rose-500 shadow-2xs ${isDark ? 'bg-rose-950/50' : 'bg-rose-50'}`}>
                <Feather className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-semibold text-rose-500 uppercase tracking-widest font-sans-clean">
                  Bana Özel Mektubum
                </span>
                <h3 className="font-serif-romantic text-xl sm:text-2xl font-bold">
                  {title || 'Sonsuz Masalımız'}
                </h3>
              </div>
            </div>

            <div className={`font-serif-romantic text-base sm:text-lg leading-relaxed space-y-4 whitespace-pre-line text-justify sm:text-left ${
              isDark ? 'text-rose-200/90' : 'text-stone-700'
            }`}>
              {subtitle && (
                <p className="font-script-love text-3xl sm:text-4xl text-rose-500 mb-2">
                  {subtitle}
                </p>
              )}
              {body ? (
                body
              ) : (
                <p className="italic opacity-50 text-center py-4">
                  Mektubunuzu Ayarlar panelinden ekleyebilirsiniz...
                </p>
              )}
            </div>

            <div className={`pt-6 border-t flex items-center justify-between text-xs font-sans-clean ${
              isDark ? 'border-rose-950/60 text-rose-300/50' : 'border-rose-50 text-stone-400'
            }`}>
              <span>Sonsuz Aşkla & Sadakatle...</span>
              <span className="text-rose-500 font-serif-romantic text-sm">Bizim Masalımız</span>
            </div>
          </div>
        ) : (
          /* YALNIZCA ŞİİR KARTI */
          <div className="relative space-y-6">
            <div className={`flex items-center gap-3 border-b pb-5 ${
              isDark ? 'border-rose-950/60' : 'border-rose-100'
            }`}>
              <span className={`p-2.5 rounded-2xl text-rose-500 shadow-2xs ${isDark ? 'bg-rose-950/50' : 'bg-rose-50'}`}>
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-semibold text-rose-500 uppercase tracking-widest font-sans-clean">
                  Bana Özel Şiir
                </span>
                <h3 className="font-serif-romantic text-xl sm:text-2xl font-bold">
                  {poemTitle || 'Özel Şiir'}
                </h3>
              </div>
            </div>

            {poemSubtitle && (
              <p className="font-script-love text-3xl sm:text-4xl text-rose-500 text-center">
                {poemSubtitle}
              </p>
            )}

            <div className={`font-serif-romantic text-lg sm:text-xl leading-loose italic whitespace-pre-line text-center max-w-lg mx-auto ${
              isDark ? 'text-rose-100' : 'text-stone-800'
            }`}>
              {poemBody ? (
                poemBody
              ) : (
                <p className="opacity-50 py-4 text-center">
                  Özel şiirinizi Ayarlar panelinden ekleyebilirsiniz...
                </p>
              )}
            </div>

            <div className={`pt-6 border-t text-center text-xs opacity-60 font-sans-clean ${
              isDark ? 'border-rose-950/60 text-rose-300/50' : 'border-rose-50 text-stone-400'
            }`}>
              Sadece sana yazılan, seninle nefes alan dizeler...
            </div>
          </div>
        )}
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          KALBİMİN SANA FISILDADIKLARI
          ═════════════════════════════════════════════════════════════════ */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 text-rose-500 text-xs font-semibold uppercase tracking-widest mb-1.5 font-sans-clean">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Sevgi İtirafları</span>
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          </div>
          <h3 className="font-serif-romantic text-2xl sm:text-3xl font-bold">
            Kalbimin Sana Fısıldadıkları
          </h3>
          <p className="text-xs sm:text-sm opacity-70 mt-1 font-serif-romantic">
            Kelime kelime biriktirdiğim, sana her baktığımda içimden geçenler...
          </p>
        </div>

        {whispers.length === 0 ? (
          <div className={`p-8 rounded-2xl border text-center text-xs font-serif-romantic italic ${
            isDark ? 'border-rose-950/40 text-rose-300/40' : 'border-rose-100 text-stone-400'
          }`}>
            Henüz bir fısıltı eklenmedi. Ayarlar panelinden kalbinin fısıltılarını ekleyebilirsin.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whispers.map((item, idx) => {
            const isLiked = likedWhispers[item.id];
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className={`group relative rounded-2xl border p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between ${
                  isDark
                    ? 'bg-[#1a0a14] border-rose-950/70 hover:border-rose-900 text-rose-100'
                    : 'bg-white border-rose-100/90 hover:border-rose-300/80 text-stone-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-rose-400 mb-3">
                    <Quote className="w-5 h-5 text-rose-400 opacity-60" />
                    <span className="text-[11px] font-medium opacity-50 font-sans-clean">
                      Fısıltı #{idx + 1}
                    </span>
                  </div>
                  <p className="font-serif-romantic text-base sm:text-lg italic leading-snug">
                    "{item.text}"
                  </p>
                </div>

                <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${
                  isDark ? 'border-rose-950/50' : 'border-rose-50'
                }`}>
                  <span className="opacity-60 font-sans-clean text-[11px] truncate max-w-[200px]">
                    {item.note}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(item.text, item.id)}
                      className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
                      title="Sözü kopyala"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleLike(item.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isLiked
                          ? 'text-rose-500 bg-rose-500/10'
                          : 'opacity-60 hover:opacity-100 hover:text-rose-500'
                      }`}
                      title="Beğen"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </section>
    </div>
  );
};
