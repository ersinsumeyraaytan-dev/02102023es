import React, { useEffect, useState } from 'react';

interface CssDaisyMeadowProps {
  secretDaisyIndex?: number; // 0 to 7 (default 0 -> flower--1)
  onSecretClick: () => void;
  speed?: 'yavas' | 'orta' | 'hizli';
}

export const CssDaisyMeadow: React.FC<CssDaisyMeadowProps> = ({
  secretDaisyIndex = 0,
  onSecretClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  const flowers = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className={`night ${isLoaded ? '' : 'not-loaded'}`}>
      <div className="flowers">
        {flowers.map((num, idx) => {
          const isSecret = idx === secretDaisyIndex;

          return (
            <div key={num} className={`flower flower--${num}`}>
              {/* Çiçek Başı: z-index: 20 (Sapların KESİNLİKLE önünde durur) */}
              <div className="flower__leafs">
                <div className="flower__leaf flower__leaf--1"></div>
                <div className="flower__leaf flower__leaf--2"></div>
                <div className="flower__leaf flower__leaf--3"></div>
                <div className="flower__leaf flower__leaf--4"></div>
                <div className="flower__leaf flower__leaf--5"></div>
                <div className="flower__leaf flower__leaf--6"></div>
                <div className="flower__leaf flower__leaf--7"></div>
                <div className="flower__leaf flower__leaf--8"></div>
                {/* Sıcak Sarı Çiçek Göbeği - Gizli Buton */}
                <div
                  className="flower__white-circle"
                  onClick={(e) => {
                    if (isSecret) {
                      e.stopPropagation();
                      onSecretClick();
                    }
                  }}
                  title={isSecret ? undefined : undefined}
                ></div>
              </div>

              {/* Sap ve Doğal Yapraklar: z-index: 1 (Çiçek başının arkasında) */}
              <div className="flower__line">
                <div className="flower__line__leaf flower__line__leaf--1"></div>
                <div className="flower__line__leaf flower__line__leaf--2"></div>
                {num % 2 === 1 && (
                  <>
                    <div className="flower__line__leaf flower__line__leaf--3"></div>
                    <div className="flower__line__leaf flower__line__leaf--4"></div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
