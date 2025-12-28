import React from 'react';
import { DESTINATIONS } from '../constants';

interface TestimonialsOverlayProps {
  activeIndex: number;
}

const TestimonialsOverlay: React.FC<TestimonialsOverlayProps> = ({ activeIndex }) => {
  return (
    <div className="fixed inset-0 z-20 pointer-events-none overflow-hidden">
      {DESTINATIONS.map((dest, index) => {
        if (!dest.testimonial) return null;

        const isActive = index === activeIndex;
        // Determine alignment
        const isPathLeft = dest.coordinates.x < 50;

        return (
          <div
            key={dest.id}
            className={`
              absolute bottom-12 md:bottom-24 max-w-[85vw] md:max-w-xs 
              transform will-change-transform
              transition-all duration-1000 ease-in-out
              ${isActive ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}
              ${isPathLeft 
                ? 'left-6 md:left-16 lg:left-24' 
                : 'right-6 md:right-16 lg:right-24 items-end text-right'
              }
              ${dest.id === 'ladakh' ? '!bottom-[55vh]' : ''}
              flex flex-col justify-end
            `}
          >
            <div className={`
                relative p-6 rounded-2xl
                bg-gradient-to-br from-gray-900/60 to-gray-800/40
                backdrop-blur-xl border border-white/10 shadow-2xl
                group hover:bg-gray-800/50 transition-colors duration-500
            `}>
                {/* Decorative Quote Icon */}
                <div className={`
                    absolute -top-6 text-6xl font-serif text-nihar-gold opacity-80
                    ${isPathLeft ? '-left-2' : '-right-2'}
                `}>
                    “
                </div>

                <p className="text-gray-100 italic text-sm md:text-base leading-relaxed mb-4 relative z-10 font-light drop-shadow-sm">
                    {dest.testimonial.text}
                </p>

                <div className={`flex items-center gap-3 ${isPathLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nihar-gold to-amber-700 p-[2px] shadow-lg">
                        <div className="w-full h-full rounded-full bg-nihar-dark flex items-center justify-center">
                            <span className="text-nihar-gold font-bold text-sm">
                                {dest.testimonial.author.charAt(0)}
                            </span>
                        </div>
                    </div>
                    <div className={`flex flex-col ${isPathLeft ? 'text-left' : 'text-right'}`}>
                        <span className="text-white font-bold text-sm tracking-wide">{dest.testimonial.author}</span>
                        <span className="text-nihar-gold/80 text-xs uppercase tracking-wider">Verified Traveler</span>
                    </div>
                </div>
                
                {/* Liquid Glass Shine Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TestimonialsOverlay;