import React, { useEffect, useRef } from 'react';
import { DESTINATIONS } from '../constants';

interface InfoCardsProps {
  onScroll: (progress: number, activeIndex: number) => void;
}

const InfoCards: React.FC<InfoCardsProps> = ({ onScroll }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.body.scrollHeight;
      const totalScrollable = docHeight - windowHeight;
      
      const rawProgress = scrollTop / totalScrollable;
      const progress = Math.min(Math.max(rawProgress, 0), 1);
      
      const sectionHeight = windowHeight;
      const activeIndex = Math.min(
        Math.floor((scrollTop + sectionHeight * 0.5) / sectionHeight),
        DESTINATIONS.length - 1
      );

      onScroll(progress, activeIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [onScroll]);

  return (
    <div ref={containerRef} className="relative z-20 w-full pointer-events-none">
      {DESTINATIONS.map((dest, index) => {
        // Determine alignment based on path position
        // If path is on left (x < 50), content goes right.
        // If path is on right (x >= 50), content goes left.
        const isPathLeft = dest.coordinates.x < 50;
        
        return (
            <div 
                key={dest.id} 
                className="h-screen w-full flex flex-col md:flex-row items-center relative p-6 md:p-12 snap-start overflow-hidden"
            >
              {/* Main Info Card */}
              <div 
                className={`
                    w-full max-w-xl glass-panel p-8 rounded-2xl pointer-events-auto transform transition-all duration-700
                    absolute
                    ${isPathLeft 
                        ? 'md:right-12 lg:right-24' 
                        : 'md:left-12 lg:left-24'
                    }
                    opacity-0 translate-y-10
                `}
                style={{
                    animation: 'fadeSlideUp 0.8s ease-out forwards',
                    animationTimeline: 'view()',
                    animationRange: 'entry 20% cover 40%'
                }}
              >
                <span className="text-nihar-accent text-sm tracking-widest font-bold uppercase mb-2 block">{dest.region}</span>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">{dest.name}</h2>
                <p className="text-gray-200 leading-relaxed mb-6 font-light">{dest.description}</p>
                
                {dest.highlights.length > 0 && (
                    <div>
                        <h3 className="text-nihar-gold font-semibold mb-2 text-sm uppercase tracking-wide">Highlights</h3>
                        <div className="flex flex-wrap gap-2">
                            {dest.highlights.map(h => (
                                <span key={h} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white border border-white/20">
                                    {h}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                
                {index === 0 && (
                    <div className="mt-8 animate-bounce">
                        <p className="text-center text-sm text-gray-400">Scroll to Explore</p>
                        <div className="flex justify-center mt-2">
                            <svg className="w-6 h-6 text-nihar-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                        </div>
                    </div>
                )}
              </div>
            </div>
        );
      })}
      <div className="h-[50vh]"></div>
    </div>
  );
};

export default InfoCards;