import React, { useState } from 'react';
import { TravelPackage } from '../types';

interface PackageCardProps {
  pkg: TravelPackage;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="group relative bg-nihar-dark/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-nihar-gold/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <div className="h-48 overflow-hidden relative bg-gray-800">
        
        {/* Skeleton Loader - Visible while image loads */}
        {!isLoaded && !hasError && (
            <div className="absolute inset-0 bg-gray-700 animate-pulse z-0 flex items-center justify-center">
                 <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Loading...</span>
            </div>
        )}

        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
        
        <img 
          src={pkg.image} 
          alt={pkg.title}
          className={`w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
        
        {/* Fallback if load fails */}
        {hasError && (
             <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-0">
                 <span className="text-3xl grayscale opacity-50">✈️</span>
             </div>
        )}
        
        <div className="absolute bottom-3 left-3 z-20 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
            <span className="text-xs font-bold text-white uppercase tracking-wider">{pkg.location}</span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-nihar-gold transition-colors">{pkg.title}</h3>
        <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
            <span>⏱️</span> {pkg.duration}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
            {pkg.features.map(feat => (
                <span key={feat} className="text-xs bg-white/5 text-gray-300 px-2 py-1 rounded border border-white/10">
                    {feat}
                </span>
            ))}
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10">
            <div>
                <span className="text-xs text-gray-400 block">Starting from</span>
                <span className="text-lg font-bold text-nihar-gold">{pkg.price}</span>
            </div>
            <button className="bg-white text-nihar-dark px-4 py-2 rounded-lg font-bold text-sm hover:bg-nihar-gold transition-colors">
                View Details
            </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;