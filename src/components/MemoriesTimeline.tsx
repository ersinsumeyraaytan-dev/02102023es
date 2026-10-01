import React, { useState } from 'react';
import { MemoryItem } from '../types';
import { Calendar, X, ZoomIn, Heart } from 'lucide-react';

interface MemoriesTimelineProps {
  memories: MemoryItem[];
  isDark?: boolean;
}

export const MemoriesTimeline: React.FC<MemoriesTimelineProps> = ({
  memories,
  isDark = false,
}) => {
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 text-rose-500 text-xs font-semibold uppercase tracking-widest mb-1.5 font-sans-clean">
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
          <span>Bizim Yolculuğumuz</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
        </div>
        <h2 className="font-serif-romantic text-3xl sm:text-4xl font-bold">
          Unutulmaz Anılarımız
        </h2>
        <p className="text-xs sm:text-sm opacity-70 mt-2 font-serif-romantic">
          İlk günden bugüne, kalbimize kazınan en kıymetli dönüm noktalarımız...
        </p>
      </div>

      {/* Timeline List */}
      {memories.length === 0 ? (
        <div className={`p-10 rounded-3xl border text-center text-xs font-serif-romantic italic max-w-md mx-auto ${
          isDark ? 'border-rose-950/50 bg-[#160810]/50 text-rose-300/50' : 'border-rose-100 bg-white/60 text-stone-400'
        }`}>
          Henüz bir anı eklenmedi. Ayarlar panelinden en özel anılarınızı ve fotoğraflarınızı ekleyebilirsiniz.
        </div>
      ) : (
      <div
        className={`relative max-w-2xl mx-auto before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:w-0.5 before:-translate-x-1/2 ${
          isDark ? 'before:bg-rose-950/80' : 'before:bg-rose-100'
        }`}
      >
        <div className="space-y-8 sm:space-y-12">
          {memories.map((item, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={item.id}
                className="relative flex flex-col sm:flex-row items-start group"
              >
                {/* Timeline Center Node */}
                <div
                  className={`absolute left-4 sm:left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-rose-500 border-4 shadow-xs z-10 flex items-center justify-center text-white ${
                    isDark ? 'border-[#180a13]' : 'border-white'
                  }`}
                >
                  <Heart className="w-3 h-3 fill-white text-white" />
                </div>

                {/* Content Box */}
                <div
                  className={`w-full pl-12 sm:pl-0 sm:w-1/2 ${
                    isEven ? 'sm:pr-10 sm:text-right' : 'sm:pl-10 sm:ml-auto'
                  }`}
                >
                  <div
                    className={`rounded-3xl p-5 sm:p-6 border shadow-xs hover:shadow-md transition-all duration-300 ${
                      isDark
                        ? 'bg-[#180a13] border-rose-950/80 hover:border-rose-900 text-rose-100'
                        : 'bg-white border-rose-100 hover:border-rose-200 text-stone-900'
                    }`}
                  >
                    {/* Date & Tag without static pills */}
                    <div
                      className={`flex items-center gap-2 text-xs text-rose-500 font-medium mb-2 font-sans-clean ${
                        isEven ? 'sm:justify-end' : 'justify-start'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                      {item.tag && (
                        <>
                          <span className="opacity-40">·</span>
                          <span className="opacity-70">{item.tag}</span>
                        </>
                      )}
                    </div>

                    <h3 className="font-serif-romantic text-xl font-bold mb-2">
                      {item.title}
                    </h3>

                    {/* Image if available */}
                    {item.imageUrl && (
                      <div
                        onClick={() =>
                          setSelectedImage({ url: item.imageUrl!, title: item.title })
                        }
                        className={`relative mb-3 rounded-2xl overflow-hidden aspect-4/3 cursor-pointer group/img border ${
                          isDark ? 'bg-black/30 border-rose-950' : 'bg-stone-100 border-stone-100'
                        }`}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                        />
                        <div className="absolute inset-0 bg-stone-950/25 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <ZoomIn className="w-6 h-6 drop-shadow-md" />
                        </div>
                      </div>
                    )}

                    <p className={`font-serif-romantic text-sm leading-relaxed whitespace-pre-line ${
                      isDark ? 'text-rose-200/80' : 'text-stone-600'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl p-2 border ${
              isDark ? 'bg-[#180a13] border-rose-950 text-rose-100' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[75vh] object-contain rounded-2xl"
            />
            <div className="p-4 text-center">
              <h4 className="font-serif-romantic text-lg font-bold">
                {selectedImage.title}
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
