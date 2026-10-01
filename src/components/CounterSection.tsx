import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface CounterSectionProps {
  startDate: string;
  title: string;
  subtitle: string;
  isDark?: boolean;
}

export const CounterSection: React.FC<CounterSectionProps> = ({
  startDate,
  title,
  subtitle,
  isDark = false,
}) => {
  const [elapsed, setElapsed] = useState(() => calculateElapsed(startDate));

  function calculateElapsed(startDateStr: string) {
    if (!startDateStr || !startDateStr.trim() || isNaN(new Date(startDateStr).getTime())) {
      return {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalDays: 0,
        totalHours: 0,
        isPast: true,
        hasValidDate: false,
      };
    }
    const start = new Date(startDateStr);
    const now = new Date();

    const isPast = now.getTime() >= start.getTime();
    const d1 = isPast ? new Date(start) : new Date(now);
    const d2 = isPast ? new Date(now) : new Date(start);

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();
    let hours = d2.getHours() - d1.getHours();
    let minutes = d2.getMinutes() - d1.getMinutes();
    let seconds = d2.getSeconds() - d1.getSeconds();

    if (seconds < 0) {
      seconds += 60;
      minutes--;
    }
    if (minutes < 0) {
      minutes += 60;
      hours--;
    }
    if (hours < 0) {
      hours += 24;
      days--;
    }
    if (days < 0) {
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    if (months < 0) {
      months += 12;
      years--;
    }

    const diffMs = Math.abs(now.getTime() - start.getTime());
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

    return {
      years: Math.max(0, years),
      months: Math.max(0, months),
      days: Math.max(0, days),
      hours: Math.max(0, hours),
      minutes: Math.max(0, minutes),
      seconds: Math.max(0, seconds),
      totalDays,
      totalHours,
      isPast,
    };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(calculateElapsed(startDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  const units = [
    { label: 'Yıl', value: elapsed.years },
    { label: 'Ay', value: elapsed.months },
    { label: 'Gün', value: elapsed.days },
    { label: 'Saat', value: elapsed.hours },
    { label: 'Dakika', value: elapsed.minutes },
    { label: 'Saniye', value: elapsed.seconds },
  ];

  return (
    <section
      className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-sm transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-[#1c0c16] via-[#160810] to-[#250e1d] border-rose-950/80 text-rose-100'
          : 'bg-gradient-to-br from-white via-rose-50/50 to-pink-50/70 border-rose-100 text-stone-900'
      }`}
    >
      {/* Decorative romantic watermarks */}
      <div
        className={`absolute top-2 right-4 pointer-events-none select-none font-script-love text-7xl sm:text-8xl transition-colors ${
          isDark ? 'text-rose-900/25' : 'text-rose-100/60'
        }`}
      >
        3 Yıl
      </div>

      <div className="relative z-10 text-center max-w-xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 text-rose-500 text-xs font-semibold uppercase tracking-widest mb-2 font-sans-clean">
          <Heart className="w-3.5 h-3.5 fill-rose-500 animate-pulse" />
          <span>Bizim Aşk Takvimimiz</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 animate-pulse" />
        </div>
        <h2 className="font-serif-romantic text-2xl sm:text-3xl font-bold tracking-tight">
          {title}
        </h2>
        <p className={`text-xs sm:text-sm mt-2 font-serif-romantic italic ${isDark ? 'text-rose-200/70' : 'text-stone-600'}`}>
          "{subtitle}"
        </p>
      </div>

      {/* Grid of counter units */}
      <div className="relative z-10 grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3 max-w-2xl mx-auto">
        {units.map((unit) => (
          <div
            key={unit.label}
            className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border shadow-xs backdrop-blur-xs transition-transform hover:-translate-y-0.5 ${
              isDark
                ? 'bg-[#200e19]/80 border-rose-900/50 text-rose-100'
                : 'bg-white/80 border-rose-100/90 text-stone-900'
            }`}
          >
            <span className="font-serif-romantic text-2xl sm:text-3xl font-bold tabular-nums">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className={`text-[11px] font-medium mt-1 uppercase tracking-wider font-sans-clean ${isDark ? 'text-rose-300/60' : 'text-stone-500'}`}>
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      {/* Romantic Milestone Proof Row */}
      <div className={`relative z-10 mt-6 pt-5 border-t flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-sans-clean ${
        isDark ? 'border-rose-900/40 text-rose-200/70' : 'border-rose-100/80 text-stone-600'
      }`}>
        <div className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>Toplam <strong className={`font-semibold tabular-nums ${isDark ? 'text-rose-100' : 'text-stone-900'}`}>{elapsed.totalDays.toLocaleString('tr-TR')}</strong> gündür birlikteyiz</span>
        </div>
        <div className="hidden sm:inline-block text-stone-300 opacity-40">·</div>
        <div className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span><strong className={`font-semibold tabular-nums ${isDark ? 'text-rose-100' : 'text-stone-900'}`}>{elapsed.totalHours.toLocaleString('tr-TR')}</strong> saatlik sonsuz sevgi</span>
        </div>
      </div>
    </section>
  );
};
