import React, { useState, useEffect, useRef } from 'react';
import StickyBackground from './components/StickyBackground';
import CurvedPath from './components/CurvedPath';
import InfoCards from './components/InfoCards';
import TestimonialsOverlay from './components/TestimonialsOverlay';
import { DomesticView, InternationalView, ServicesView, ContactView } from './components/Views';

type ViewState = 'home' | 'domestic' | 'international' | 'services' | 'contact';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auto-scroll state
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const idleTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const handleScrollUpdate = (progress: number, index: number) => {
    setScrollProgress(progress);
    setActiveIndex(index);
  };

  // Idle detection logic (Only active on Home view)
  useEffect(() => {
    if (currentView !== 'home') return;

    const startIdleTimer = () => {
      if (idleTimeoutRef.current) {
        window.clearTimeout(idleTimeoutRef.current);
      }
      setIsAutoScrolling(false);
      idleTimeoutRef.current = window.setTimeout(() => {
        setIsAutoScrolling(true);
      }, 3000);
    };

    const events = ['wheel', 'touchmove', 'touchstart', 'mousedown', 'keydown', 'mousemove'];
    events.forEach(event => window.addEventListener(event, startIdleTimer));
    startIdleTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, startIdleTimer));
      if (idleTimeoutRef.current) window.clearTimeout(idleTimeoutRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [currentView]);

  // Auto-scroll animation loop
  useEffect(() => {
    if (!isAutoScrolling || currentView !== 'home') {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const autoScroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
        setIsAutoScrolling(false);
        return;
      }
      window.scrollBy({ top: 1, behavior: 'auto' });
      animationFrameRef.current = requestAnimationFrame(autoScroll);
    };
    animationFrameRef.current = requestAnimationFrame(autoScroll);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isAutoScrolling, currentView]);

  const renderContent = () => {
      switch(currentView) {
          case 'domestic': return <DomesticView />;
          case 'international': return <InternationalView />;
          case 'services': return <ServicesView />;
          case 'contact': return <ContactView />;
          default: return (
            <>
               <StickyBackground activeIndex={activeIndex} />
               <CurvedPath scrollProgress={scrollProgress} activeIndex={activeIndex} />
               <TestimonialsOverlay activeIndex={activeIndex} />
               <InfoCards onScroll={handleScrollUpdate} />
            </>
          );
      }
  };

  const handleNavClick = (view: ViewState) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="relative min-h-screen font-sans selection:bg-nihar-gold selection:text-black bg-nihar-dark">
      
      {/* Background for non-home pages */}
      {currentView !== 'home' && (
          <div className="fixed inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-nihar-dark via-gray-900 to-nihar-dark z-10" />
             <img 
                src="https://image.pollinations.ai/prompt/vintage_world_map_dark_gold_lines_elegant?width=1920&height=1080&nologo=true"
                className="w-full h-full object-cover opacity-20"
                alt="Background"
             />
          </div>
      )}

      {/* Navbar Overlay */}
      <nav className="fixed top-0 left-0 w-full z-40 p-6 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent pointer-events-none transition-all duration-300">
        <div 
            className="flex items-center gap-3 pointer-events-auto cursor-pointer group relative z-50"
            onClick={() => handleNavClick('home')}
        >
            <div className="w-14 h-14 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                   <img 
                    src="./Images/Plane.png" 
                    alt="NIHAR Travels Logo" 
                    className="w-full h-full object-contain" 
                  />
            </div>
            <span className="text-2xl font-serif font-bold tracking-wider text-white drop-shadow-md">NIHAR <span className="text-nihar-gold font-light">Travels</span></span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide text-gray-300 pointer-events-auto">
            <button onClick={() => handleNavClick('domestic')} className={`${currentView === 'domestic' ? 'text-nihar-gold' : 'hover:text-nihar-gold'} transition-colors shadow-sm`}>Domestic</button>
            <button onClick={() => handleNavClick('international')} className={`${currentView === 'international' ? 'text-nihar-gold' : 'hover:text-nihar-gold'} transition-colors shadow-sm`}>International</button>
            <button onClick={() => handleNavClick('services')} className={`${currentView === 'services' ? 'text-nihar-gold' : 'hover:text-nihar-gold'} transition-colors shadow-sm`}>Our Services</button>
            <button onClick={() => handleNavClick('contact')} className={`${currentView === 'contact' ? 'text-nihar-gold' : 'hover:text-nihar-gold'} transition-colors shadow-sm`}>Contact</button>
        </div>

        {/* Mobile Menu Button */}
        <button 
            className="md:hidden text-white pointer-events-auto relative z-50 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
            {isMobileMenuOpen ? (
                <svg className="w-8 h-8 text-nihar-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`
        fixed inset-0 z-30 bg-nihar-dark/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 md:hidden transition-all duration-500 ease-in-out
        ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
          <button onClick={() => handleNavClick('domestic')} className="text-2xl font-serif text-white hover:text-nihar-gold transition-colors">Domestic</button>
          <button onClick={() => handleNavClick('international')} className="text-2xl font-serif text-white hover:text-nihar-gold transition-colors">International</button>
          <button onClick={() => handleNavClick('services')} className="text-2xl font-serif text-white hover:text-nihar-gold transition-colors">Our Services</button>
          <button onClick={() => handleNavClick('contact')} className="text-2xl font-serif text-white hover:text-nihar-gold transition-colors">Contact</button>
      </div>

      {/* Content Layer */}
      <main className="relative z-10">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;