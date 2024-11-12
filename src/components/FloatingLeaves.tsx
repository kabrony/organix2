import React, { useMemo } from 'react';

interface FloatingLeavesProps {
  isDarkMode: boolean;
  mousePos: { x: number; y: number };
  isMobile: boolean;
}

const FloatingLeaves: React.FC<FloatingLeavesProps> = ({ isDarkMode, mousePos, isMobile }) => {
  const leafPositions = useMemo(() => {
    const positions = [];
    const baseLeafCount = isMobile ? 10 : 20;
    const screenScale = window.innerWidth / 1920;

    for (let letterIndex = 0; letterIndex < 7; letterIndex++) {
      const numLeaves = Math.floor(baseLeafCount * screenScale);
      for (let i = 0; i < numLeaves; i++) {
        positions.push({
          id: `leaf-${letterIndex}-${i}`,
          letterIndex,
          baseX: 50 + (letterIndex * 50),
          baseY: 75,
          offset: i / numLeaves,
          phase: Math.random() * Math.PI * 2,
          scale: 0.1 + Math.random() * 0.1 * (isMobile ? 0.8 : 1)
        });
      }
    }
    return positions;
  }, [isMobile]);

  return (
    <svg
      viewBox="0 0 400 200"
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <path
          id="cannabisLeaf"
          d="M 0,0 
             C -1,-3 -3,-3 -4,-1 
             C -5,1 -5,4 -4,5 
             C -3,6 -1,6 0,5 
             C 1,6 3,6 4,5 
             C 5,4 5,1 4,-1 
             C 3,-3 1,-3 0,0 
             M 0,0 L 0,2"
          className={`${isDarkMode ? 'fill-green-400' : 'fill-purple-600'} 
            transition-colors duration-500`}
        />
      </defs>

      {leafPositions.map((leaf) => (
        <g
          key={leaf.id}
          style={{
            transform: `translate(
              ${leaf.baseX + Math.cos(leaf.phase + Date.now() / 1000) * 15 + mousePos.x * 10}px,
              ${leaf.baseY + Math.sin(leaf.phase + Date.now() / 1000) * 15 + mousePos.y * 10}px
            ) rotate(${(Date.now() / 20) % 360}deg) scale(${leaf.scale})`,
            opacity: 0.6 + Math.sin(Date.now() / 1000 + leaf.phase) * 0.4,
            transition: 'colors 0.5s',
          }}
        >
          <use
            href="#cannabisLeaf"
            className={`transition-transform duration-300 ease-out
              ${leaf.offset > 0.5 ? 
                (isDarkMode ? 'fill-green-400' : 'fill-purple-600') : 
                (isDarkMode ? 'fill-purple-600' : 'fill-green-400')
              }`}
          />
        </g>
      ))}
    </svg>
  );
};

export default FloatingLeaves;