import React, { useMemo } from 'react';

interface Particle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  type: 'heart' | 'petal' | 'leaf';
  rotation: number;
  opacity: number;
}

export const FloatingParticles: React.FC = () => {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 14 + 10,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 8,
      type: i % 3 === 0 ? 'heart' : i % 3 === 1 ? 'petal' : 'leaf',
      rotation: Math.random() * 360,
      opacity: Math.random() * 0.4 + 0.25,
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-[-40px]"
          style={{
            left: `${p.left}%`,
            animation: `driftUpward ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        >
          {p.type === 'heart' && (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-rose-400 transform hover:scale-110 transition-transform"
              style={{ transform: `rotate(${p.rotation}deg)` }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}

          {p.type === 'petal' && (
            <svg
              width={p.size * 1.1}
              height={p.size * 1.5}
              viewBox="0 0 20 30"
              fill="currentColor"
              className="text-pink-300"
              style={{ transform: `rotate(${p.rotation}deg)` }}
            >
              <path d="M10 0 C2 10, 0 20, 10 30 C20 20, 18 10, 10 0 Z" />
            </svg>
          )}

          {p.type === 'leaf' && (
            <svg
              width={p.size * 0.9}
              height={p.size * 1.3}
              viewBox="0 0 20 30"
              fill="currentColor"
              className="text-emerald-300"
              style={{ transform: `rotate(${p.rotation}deg)` }}
            >
              <path d="M10 0 C4 8, 2 18, 10 30 C18 18, 16 8, 10 0 Z" />
            </svg>
          )}
        </div>
      ))}

      <style>{`
        @keyframes driftUpward {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          33% {
            transform: translateY(-35vh) translateX(18px) rotate(45deg);
          }
          66% {
            transform: translateY(-70vh) translateX(-18px) rotate(90deg);
          }
          100% {
            transform: translateY(-115vh) translateX(10px) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
};
