import React from 'react';

interface NeonTextProps {
  isDarkMode: boolean;
  mousePos: { x: number; y: number };
}

const NeonText: React.FC<NeonTextProps> = ({ isDarkMode, mousePos }) => {
  const letterPaths = [
    "M 50 75 L 75 75 L 75 125 L 50 125 L 50 75",
    "M 90 75 L 90 125 L 115 125 L 115 100 L 90 100 L 115 75",
    "M 165 75 L 140 75 L 140 125 L 165 125 L 190 100 L 190 87 L 165 87",
    "M 200 125 L 225 75 L 250 125 M 212 100 L 237 100",
    "M 260 125 L 260 75 L 285 125 L 285 75",
    "M 295 75 L 320 75 M 307 75 L 307 125 M 295 125 L 320 125",
    "M 330 75 L 355 125 M 330 125 L 355 75"
  ];

  return (
    <svg
      viewBox="0 0 400 200"
      className="w-full h-auto transform transition-transform duration-300 hover:scale-105"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="neonGlow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {letterPaths.map((d, i) => (
        <path
          key={i}
          d={d}
          className={`fill-none stroke-[3] transition-all duration-500
            ${isDarkMode ? 'stroke-green-400' : 'stroke-purple-600'}`}
          style={{
            filter: 'url(#neonGlow)',
            transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 5}px)`,
            strokeDasharray: '1000',
            strokeDashoffset: '0',
            transition: 'stroke-dashoffset 2s ease-in-out, transform 0.3s ease-out',
          }}
        />
      ))}
    </svg>
  );
};

export default NeonText;