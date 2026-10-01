import React, { useEffect, useState, useCallback } from 'react';

interface ClickHeart {
  id: number;
  x: number;
  y: number;
  dx: number;
  rot: number;
  color: string;
  size: number;
}

const COLORS = [
  '#f43f5e', // rose-500
  '#fb7185', // rose-400
  '#ec4899', // pink-500
  '#f472b6', // pink-400
  '#e11d48', // rose-600
];

export const TouchHeartEffect: React.FC = () => {
  const [hearts, setHearts] = useState<ClickHeart[]>([]);

  const spawnHearts = useCallback((clientX: number, clientY: number) => {
    // Generate 3-4 small hearts per tap
    const newHearts: ClickHeart[] = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + Math.random() + i,
      x: clientX,
      y: clientY,
      dx: (Math.random() - 0.5) * 50,
      rot: (Math.random() - 0.5) * 45,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 10 + 14,
    }));

    setHearts((prev) => [...prev.slice(-30), ...newHearts]);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't trigger on input typing to keep it clean
      const target = e.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;
      spawnHearts(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const target = e.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;
      spawnHearts(touch.clientX, touch.clientY);
    };

    window.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [spawnHearts]);

  // Clean up hearts after animation duration
  useEffect(() => {
    if (hearts.length === 0) return;
    const timer = setTimeout(() => {
      setHearts((prev) => prev.slice(3));
    }, 1300);
    return () => clearTimeout(timer);
  }, [hearts]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="click-heart absolute"
          style={
            {
              left: `${h.x}px`,
              top: `${h.y}px`,
              '--dx': `${h.dx}px`,
              '--rot': `${h.rot}deg`,
            } as React.CSSProperties
          }
        >
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            fill={h.color}
            style={{ filter: 'drop-shadow(0 2px 4px rgba(244,63,94,0.35))' }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </span>
      ))}
    </div>
  );
};
