import React, { useState, useEffect } from 'react';
import { Settings, ChevronUp } from 'lucide-react';
import ShaderBackground from './components/ShaderBackground';
import SettingsPanel from './components/SettingsPanel';
import NeonText from './components/NeonText';
import FloatingLeaves from './components/FloatingLeaves';
import VisitCounter from './components/VisitCounter';
import InstallPWA from './components/InstallPWA';

const App = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [visitCount, setVisitCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [brightness, setBrightness] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const toJapanese = (num: number) => {
    const digits: { [key: string]: string } = {
      '0': '零', '1': '一', '2': '二', '3': '三', '4': '四',
      '5': '五', '6': '六', '7': '七', '8': '八', '9': '九'
    };
    return num.toString().split('').map(d => digits[d]).join('');
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Initialize visit count from localStorage
    const storedCount = parseInt(localStorage.getItem('visitCount') || '0');
    setVisitCount(storedCount + 1);
    localStorage.setItem('visitCount', (storedCount + 1).toString());

    // Update document title with visit count
    document.title = `Organix (${storedCount + 1} visits) - Neon Japanese Experience`;

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      <ShaderBackground brightness={brightness} mousePos={mousePos} />

      <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-4 z-10">
        <VisitCounter count={visitCount} toJapanese={toJapanese} />
        <InstallPWA />

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="fixed top-4 left-4 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white 
            hover:bg-black/40 transition-all transform hover:scale-110 z-20"
          aria-label="Toggle Settings"
        >
          <Settings className="w-6 h-6" />
        </button>

        <div className="relative w-full max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
          <NeonText isDarkMode={isDarkMode} mousePos={mousePos} />
          <FloatingLeaves isDarkMode={isDarkMode} mousePos={mousePos} isMobile={isMobile} />
        </div>

        <SettingsPanel
          show={showSettings}
          brightness={brightness}
          setBrightness={setBrightness}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        <button
          onClick={scrollToTop}
          className={`fixed bottom-4 right-4 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white 
            hover:bg-black/40 transition-all transform hover:scale-110 z-20
            ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default App;