import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Laptop, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | 'other'>('other');

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    } else if (!/mobile|tablet|opera mini/.test(userAgent)) {
      setPlatform('desktop');
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstall(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstall(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstructions(true);
    }
  };

  const getPlatformInstructions = () => {
    switch (platform) {
      case 'ios':
        return (
          <div className="space-y-3">
            <p>To install on iOS:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Tap the Share button <span className="inline-block w-6 h-6">⎙</span></li>
              <li>Scroll down and tap "Add to Home Screen"</li>
              <li>Tap "Add" to confirm</li>
            </ol>
          </div>
        );
      case 'android':
        return (
          <div className="space-y-3">
            <p>To install on Android:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Tap the menu (⋮) in Chrome</li>
              <li>Tap "Install app"</li>
              <li>Tap "Install" to confirm</li>
            </ol>
          </div>
        );
      case 'desktop':
        return (
          <div className="space-y-3">
            <p>To install on Desktop:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Click the install icon in the address bar</li>
              <li>Click "Install" to confirm</li>
              <li>The app will open in a new window</li>
            </ol>
          </div>
        );
      default:
        return (
          <p>Visit this site in Chrome, Edge, or Safari to install the app.</p>
        );
    }
  };

  return (
    <AnimatePresence>
      {(showInstall || showInstructions) && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-sm px-4"
        >
          <motion.div
            className="relative bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-white/10
              shadow-lg shadow-purple-500/10"
          >
            {showInstructions ? (
              <>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
                <div className="space-y-4 text-white/90">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {platform === 'desktop' ? <Laptop className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                    Installation Instructions
                  </h3>
                  {getPlatformInstructions()}
                </div>
              </>
            ) : (
              <motion.button
                onClick={handleInstall}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 
                  bg-gradient-to-r from-green-500/20 to-purple-500/20 hover:from-green-500/30 
                  hover:to-purple-500/30 rounded-lg text-white font-medium transition-all duration-300
                  border border-white/10 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                <span>Install Organix App</span>
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPWA;