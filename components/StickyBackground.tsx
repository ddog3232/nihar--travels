import React from 'react';
import { DESTINATIONS } from '../constants';

interface StickyBackgroundProps {
  activeIndex: number;
}

const StickyBackground: React.FC<StickyBackgroundProps> = ({ activeIndex }) => {
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-nihar-dark">
      {DESTINATIONS.map((dest, index) => (
        <div
          key={dest.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Overlay gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-nihar-dark/60 via-nihar-dark/40 to-nihar-dark/90 z-10" />
          
          <img
            src={dest.image}
            alt={dest.name}
            className="w-full h-full object-cover transform scale-105 transition-transform duration-[10000ms]"
            style={{
                transform: index === activeIndex ? 'scale(1.1)' : 'scale(1.0)',
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default StickyBackground;