import React, { useMemo, useEffect, useState, useRef } from 'react';
import { DESTINATIONS } from '../data/destinationsImport';
import { Keyframe } from '../types';
import { generatePathData, getPositionAtProgress } from '../utils/pathCalculations';

interface PathCanvasProps {
  currentFrame: Keyframe;
  onPathReady?: (pathElement: SVGPathElement) => void;
  onProgressChange?: (progress: number) => void;
}

const PathCanvas: React.FC<PathCanvasProps> = ({ currentFrame, onPathReady, onProgressChange }) => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update dimensions based on container
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Generate path data
  const pathData = useMemo(() => {
    return generatePathData(DESTINATIONS, dimensions.width, dimensions.height);
  }, [dimensions]);

  // Notify parent when path is ready
  useEffect(() => {
    if (pathRef.current && onPathReady) {
      onPathReady(pathRef.current);
    }
  }, [pathData, onPathReady]);

  // Get plane position based on current frame
  const planePosition = useMemo(() => {
    return getPositionAtProgress(pathRef.current, currentFrame.pathProgress);
  }, [currentFrame.pathProgress, pathData]);

  const planeSize = 70; // Match main site plane size
  const planeYOffset = -35; // Hover above the path/dots (same as main site)

  return (
    <div ref={containerRef} className="w-full h-full bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative">
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full h-full"
        style={{
          filter: 'drop-shadow(0px 0px 10px rgba(212, 175, 55, 0.3))',
          pointerEvents: 'none',
        }}
      >
        {/* Invisible reference path for calculations */}
        <path
          ref={pathRef}
          d={pathData}
          fill="none"
          stroke="none"
        />

        {/* Visible base path */}
        <path
          d={pathData}
          fill="none"
          stroke="rgba(212, 175, 55, 0.3)"
          strokeWidth="4"
        />

        {/* Active progress path overlay */}
        <path
          d={pathData}
          fill="none"
          stroke="rgba(212, 175, 55, 0.8)"
          strokeWidth="4"
          strokeDasharray={pathRef.current?.getTotalLength() || 0}
          strokeDashoffset={(pathRef.current?.getTotalLength() || 0) * (1 - currentFrame.pathProgress)}
          strokeLinecap="round"
        />

        {/* Destination dots */}
        {DESTINATIONS.map((dest, index) => {
          const x = (dest.coordinates.x / 100) * dimensions.width;
          const y = (dest.coordinates.y / 100) * dimensions.height;
          const isPassed = currentFrame.pathProgress >= (index / (DESTINATIONS.length - 1));
          const destProgress = index / (DESTINATIONS.length - 1);

          const handleDotClick = () => {
            if (onProgressChange) {
              onProgressChange(destProgress);
            }
          };

          return (
            <g
              key={dest.id}
              onClick={handleDotClick}
              className="cursor-pointer transition-all hover:opacity-80"
              style={{ pointerEvents: 'all' }}
            >
              {/* Invisible larger hit area for easier clicking */}
              <circle
                cx={x}
                cy={y}
                r={20}
                fill="transparent"
              />
              <circle
                cx={x}
                cy={y}
                r={6}
                fill={isPassed ? "#D4AF37" : "rgba(255,255,255,0.3)"}
                stroke={isPassed ? "#D4AF37" : "rgba(255,255,255,0.5)"}
                strokeWidth="2"
              />
              <text
                x={x}
                y={y - 15}
                textAnchor="middle"
                fontSize="12"
                fill="rgba(212, 175, 55, 0.9)"
                className="font-serif select-none font-semibold"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
              >
                {dest.name}
              </text>
            </g>
          );
        })}

        {/* Animated plane with all transforms */}
        <g
          style={{
            transform: `translate(${planePosition.x}px, ${planePosition.y + planeYOffset}px)`,
          }}
        >
          <g
            style={{
              transform: `
                rotateZ(${currentFrame.rotationZ}deg)
                rotateX(${currentFrame.rotationX}deg)
                rotateY(${currentFrame.rotationY}deg)
                scale(${currentFrame.scaleX * currentFrame.scale}, ${currentFrame.scaleY * currentFrame.scale})
              `,
              transformOrigin: '0 0',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Shadow for depth */}
            <ellipse
              cx="0"
              cy={planeSize / 2 + 15}
              rx={planeSize / 3}
              ry={planeSize / 8}
              fill="rgba(0,0,0,0.3)"
              style={{
                filter: 'blur(4px)',
                transform: 'translateY(5px)',
              }}
            />

            {/* Actual plane image from main site */}
            <image
              href="/Images/plane small.png"
              width={planeSize}
              height={planeSize}
              x={-planeSize / 2}
              y={-planeSize / 2}
              style={{
                filter: 'drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.5))',
              }}
            />
          </g>
        </g>

        {/* Position indicator */}
        <circle
          cx={planePosition.x}
          cy={planePosition.y}
          r={3}
          fill="red"
          opacity={0.5}
        />
      </svg>

      {/* Info overlay */}
      <div className="absolute top-4 left-4 bg-black/50 text-white text-xs p-2 rounded font-mono">
        <div>Progress: {(currentFrame.pathProgress * 100).toFixed(1)}%</div>
        <div>Position: ({planePosition.x.toFixed(0)}, {planePosition.y.toFixed(0)})</div>
        <div>Rotation Z: {currentFrame.rotationZ.toFixed(1)}°</div>
        <div>Rotation X: {currentFrame.rotationX.toFixed(1)}°</div>
        <div>Rotation Y: {currentFrame.rotationY.toFixed(1)}°</div>
        <div>Scale: {currentFrame.scale.toFixed(2)}x</div>
      </div>
    </div>
  );
};

export default PathCanvas;
