import React, { useMemo, useEffect, useState, useRef } from 'react';
import { DESTINATIONS } from '../constants';

interface CurvedPathProps {
  scrollProgress: number; // 0 to 1
  activeIndex: number;
}

const CurvedPath: React.FC<CurvedPathProps> = ({ scrollProgress, activeIndex }) => {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [pathLength, setPathLength] = useState(5000); 
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pathData = useMemo(() => {
    const w = dimensions.width;
    const h = dimensions.height;

    const getX = (p: number) => (p / 100) * w;
    const getY = (p: number) => (p / 100) * h;

    if (DESTINATIONS.length === 0) return '';

    let d = `M ${getX(DESTINATIONS[0].coordinates.x)} ${getY(DESTINATIONS[0].coordinates.y)}`;
    
    for (let i = 0; i < DESTINATIONS.length - 1; i++) {
      const p1 = DESTINATIONS[i].coordinates;
      const p2 = DESTINATIONS[i + 1].coordinates;
      
      const x1 = getX(p1.x);
      const y1 = getY(p1.y);
      const x2 = getX(p2.x);
      const y2 = getY(p2.y);
      
      const cp1y = y1 + (y2 - y1) / 2;
      const cp2y = y1 + (y2 - y1) / 2;
      
      d += ` C ${x1} ${cp1y}, ${x2} ${cp2y}, ${x2} ${y2}`;
    }
    return d;
  }, [dimensions]);

  useEffect(() => {
    if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        setPathLength(length);
    }
  }, [pathData]);

  const handleDotClick = (index: number) => {
      window.scrollTo({
          top: index * window.innerHeight,
          behavior: 'smooth'
      });
  };

  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center">
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full h-full opacity-90"
        style={{ filter: 'drop-shadow(0px 0px 10px rgba(212, 175, 55, 0.6))' }}
      >
        <path
            ref={pathRef}
            d={pathData}
            fill="none"
            stroke="none"
        />

        {/* Base Path */}
        <path
          d={pathData}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="3"
        />

        {/* Active Progress Path */}
        <path
          d={pathData}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="4"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength * (1 - scrollProgress)}
          strokeLinecap="round"
          className="transition-all duration-100 ease-out"
        />

        {/* Destination Dots */}
        {DESTINATIONS.map((dest, index) => {
            const x = (dest.coordinates.x / 100) * dimensions.width;
            const y = (dest.coordinates.y / 100) * dimensions.height;
            
            const isActive = index <= activeIndex;
            const isCurrent = index === activeIndex;
            
            return (
                <g 
                    key={dest.id} 
                    className="transition-all duration-500 cursor-pointer pointer-events-auto"
                    onClick={() => handleDotClick(index)}
                >
                    {/* Invisible Hit Area for easier clicking */}
                    <circle cx={x} cy={y} r={20} fill="transparent" />
                    
                    {/* Visible Dot */}
                    <circle
                        cx={x}
                        cy={y}
                        r={isCurrent ? 8 : 5}
                        fill={isActive ? "#D4AF37" : "rgba(255,255,255,0.3)"}
                        className={`transition-all duration-500 ${isCurrent ? 'animate-pulse' : ''}`}
                    />
                     <text
                        x={x}
                        y={y}
                        dy={-20}
                        textAnchor="middle"
                        fontSize="14"
                        fill={isActive ? "#FFF" : "transparent"}
                        className={`font-serif font-bold transition-all duration-500 drop-shadow-md tracking-wider select-none ${isCurrent ? 'opacity-100' : 'opacity-0'}`}
                    >
                        {dest.name}
                    </text>
                </g>
            );
        })}
      </svg>
    </div>
  );
};

export default CurvedPath;