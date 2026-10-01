import React from 'react';
import { LocationItem } from '../types';
import { MapPin, ExternalLink, Calendar, Compass } from 'lucide-react';

interface LocationsSectionProps {
  locations: LocationItem[];
  isDark?: boolean;
}

export const LocationsSection: React.FC<LocationsSectionProps> = ({
  locations,
  isDark = false,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 text-rose-500 text-xs font-semibold uppercase tracking-widest mb-1.5 font-sans-clean">
          <MapPin className="w-3.5 h-3.5 fill-rose-500 text-white" />
          <span>Bizim Özel Rotalarımız</span>
          <MapPin className="w-3.5 h-3.5 fill-rose-500 text-white" />
        </div>
        <h2 className="font-serif-romantic text-3xl sm:text-4xl font-bold">
          Aşkımızın Şehirdeki İzleri
        </h2>
        <p className="text-xs sm:text-sm opacity-70 mt-2 font-serif-romantic">
          Adımlarımızın birbirine karıştığı, hatıralarımızın nefes aldığı özel yerler...
        </p>
      </div>

      {/* Locations Grid */}
      {locations.length === 0 ? (
        <div className={`p-10 rounded-3xl border text-center text-xs font-serif-romantic italic max-w-md mx-auto ${
          isDark ? 'border-rose-950/50 bg-[#160810]/50 text-rose-300/50' : 'border-rose-100 bg-white/60 text-stone-400'
        }`}>
          Henüz bir konum eklenmedi. Ayarlar panelinden en sevdiğiniz buluşma ve anı mekanlarını ekleyebilirsiniz.
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations.map((loc) => {
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            loc.mapQuery
          )}`;

          return (
            <div
              key={loc.id}
              className={`rounded-3xl border overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
                isDark
                  ? 'bg-[#180a13] border-rose-950/80 text-rose-100'
                  : 'bg-white border-rose-100 text-stone-900'
              }`}
            >
              <div>
                {loc.imageUrl && (
                  <div className={`relative aspect-16/9 overflow-hidden ${isDark ? 'bg-black/30' : 'bg-stone-100'}`}>
                    <img
                      src={loc.imageUrl}
                      alt={loc.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div
                      className={`absolute top-3 right-3 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 font-sans-clean ${
                        isDark
                          ? 'bg-[#180a13]/85 text-rose-300 border-rose-900/60'
                          : 'bg-white/90 text-rose-600 border-rose-100'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>{loc.mapQuery}</span>
                    </div>
                  </div>
                )}

                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-xs opacity-50 mb-1.5 font-sans-clean">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    <span>{loc.date}</span>
                  </div>

                  <h3 className="font-serif-romantic text-xl font-bold mb-1">
                    {loc.title}
                  </h3>
                  <p className="font-script-love text-2xl text-rose-500 mb-3">
                    {loc.subtitle}
                  </p>

                  <p className={`font-serif-romantic text-sm leading-relaxed whitespace-pre-line ${
                    isDark ? 'text-rose-200/80' : 'text-stone-600'
                  }`}>
                    {loc.story}
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 pt-0">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2.5 px-4 rounded-xl border font-medium text-xs font-sans-clean flex items-center justify-center gap-2 transition-colors ${
                    isDark
                      ? 'border-rose-900/50 text-rose-300 hover:bg-rose-950/40'
                      : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Google Haritalar'da Gör</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
