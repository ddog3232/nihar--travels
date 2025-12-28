import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import { DESTINATIONS } from '../constants';

interface CurvedPathProps {
  scrollProgress: number; // 0 to 1
  activeIndex: number;
}

interface PlanePosition {
  x: number;
  y: number;
  angle: number;
}

interface TrailPoint {
  x: number;
  y: number;
}

const CurvedPath: React.FC<CurvedPathProps> = ({ scrollProgress, activeIndex }) => {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [pathLength, setPathLength] = useState(0); 
  const [planePos, setPlanePos] = useState<PlanePosition>({ x: 0, y: 0, angle: 0 });
  const [isPathReady, setIsPathReady] = useState(false);
  const [vaporTrail, setVaporTrail] = useState<TrailPoint[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const trailMaxLength = 10; // Number of points in vapor trail
  const planeYOffset = -35; // Hover above the path/dots

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

  // Update path length when path data changes (including on resize)
  useEffect(() => {
    if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        setPathLength(length);
        setIsPathReady(true);
    }
  }, [pathData]);

  // Calculate plane position and rotation along the path
  const updatePlanePosition = useCallback(() => {
    // Early return if path not yet rendered
    if (!pathRef.current || pathLength === 0 || !isPathReady) {
      return;
    }
    
    const path = pathRef.current;
    
    // Clamp scroll progress to valid range [0, 1]
    const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);
    
    // Calculate current distance along path, clamped to pathLength
    const currentLength = Math.min(clampedProgress * pathLength, pathLength);
    
    // Get current point on path (handles scrollProgress = 0 case - starts at first destination)
    const point = path.getPointAtLength(currentLength);
    
    // Get a point slightly ahead to calculate angle
    const lookAheadDistance = 20;
    const aheadLength = Math.min(currentLength + lookAheadDistance, pathLength);
    const aheadPoint = path.getPointAtLength(aheadLength);
    
    // Calculate angle in degrees
    const dx = aheadPoint.x - point.x;
    const dy = aheadPoint.y - point.y;
    
    // Only update angle if there's meaningful movement (avoid jitter at endpoints)
    let angle = planePos.angle;
    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
      angle = Math.atan2(dy, dx) * (180 / Math.PI);
      // Adjust angle: -25 degrees to point plane nose forward
      angle = angle - 25;
    }
    
    // Update vapor trail with new position
    setVaporTrail(prev => {
      const newTrail = [...prev, { x: point.x, y: point.y + planeYOffset }];
      // Keep only the last N points
      if (newTrail.length > trailMaxLength) {
        return newTrail.slice(-trailMaxLength);
      }
      return newTrail;
    });
    
    setPlanePos({ x: point.x, y: point.y, angle });
  }, [scrollProgress, pathLength, isPathReady, planePos.angle]);

  useEffect(() => {
    updatePlanePosition();
  }, [updatePlanePosition]);

  // Initialize plane position at first destination on mount
  useEffect(() => {
    if (pathRef.current && isPathReady && pathLength > 0) {
      const path = pathRef.current;
      const startPoint = path.getPointAtLength(0);
      // Get initial angle
      const aheadPoint = path.getPointAtLength(20);
      const dx = aheadPoint.x - startPoint.x;
      const dy = aheadPoint.y - startPoint.y;
      const initialAngle = Math.atan2(dy, dx) * (180 / Math.PI) - 25;
      
      setPlanePos({ x: startPoint.x, y: startPoint.y, angle: initialAngle });
      // Initialize vapor trail at start position
      setVaporTrail([{ x: startPoint.x, y: startPoint.y + planeYOffset }]);
    }
  }, [isPathReady, pathLength]);

  const handleDotClick = (index: number) => {
      window.scrollTo({
          top: index * window.innerHeight,
          behavior: 'smooth'
      });
  };

  // Responsive plane size: smaller on mobile
  const isMobile = dimensions.width < 768;
  const planeSize = isMobile ? 45 : 70;

  // Generate vapor trail path
  const vaporTrailPath = useMemo(() => {
    if (vaporTrail.length < 2) return '';
    return vaporTrail.map((point, i) => 
      i === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
    ).join(' ');
  }, [vaporTrail]);

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

        {/* Vapor Trail - fading line behind plane */}
        {isPathReady && vaporTrail.length > 1 && (
          <defs>
            <linearGradient id="vaporGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
            </linearGradient>
          </defs>
        )}
        {isPathReady && vaporTrail.length > 1 && (
          <path
            d={vaporTrailPath}
            fill="none"
            stroke="url(#vaporGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
            style={{
              transition: 'opacity 0.2s ease-out'
            }}
          />
        )}

        {/* Animated Plane - only render when path is ready */}
        {isPathReady && (
          <g
            transform={`translate(${planePos.x}, ${planePos.y + planeYOffset}) rotate(${planePos.angle})`}
            style={{
              transition: 'transform 0.15s ease-out',
              willChange: 'transform'
            }}
          >
            {/* Enhanced shadow for depth */}
            <ellipse
              cx="0"
              cy={planeSize / 2 + 15}
              rx={planeSize / 3}
              ry={planeSize / 8}
              fill="rgba(0,0,0,0.3)"
              style={{
                filter: 'blur(4px)',
                transform: 'translateY(5px)'
              }}
            />
            {/* Plane image with bounce animation */}
            <image
              href="./Images/Plane.png"
              width={planeSize}
              height={planeSize}
              x={-planeSize / 2}
              y={-planeSize / 2}
              className="animate-plane-bounce"
              style={{
                filter: 'drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.5))',
                transform: 'scaleX(-1)'
              }}
            />
          </g>
        )}
      </svg>

      {/* CSS for bounce animation */}
      <style>{`
        @keyframes planeBounce {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .animate-plane-bounce {
          animation: planeBounce 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CurvedPath;