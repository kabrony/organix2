import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VisitCounterProps {
  count: number;
  toJapanese: (num: number) => string;
}

const VisitCounter: React.FC<VisitCounterProps> = ({ count, toJapanese }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isHovered) {
      timeout = setTimeout(() => setShowTooltip(true), 300);
    } else {
      setShowTooltip(false);
    }
    return () => clearTimeout(timeout);
  }, [isHovered]);

  return (
    <motion.div
      className="fixed top-4 right-4 text-center z-20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative font-bold text-xl md:text-2xl tracking-wider bg-black/20 backdrop-blur-sm p-4 rounded-lg
          hover:bg-black/30 transition-all duration-300 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-6 h-6 text-cyan-500" />
          <div className="text-cyan-500 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
            訪問回数
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <motion.span
            key={count}
            className="text-fuchsia-500 drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {toJapanese(count)}
          </motion.span>
          <span className="text-cyan-500 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
            回
          </span>
        </div>

        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2
                bg-black/80 backdrop-blur-sm rounded-lg text-sm text-white whitespace-nowrap"
            >
              {count.toLocaleString()} total visits
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2
                border-4 border-transparent border-b-black/80" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default VisitCounter;