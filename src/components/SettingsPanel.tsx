import React from 'react';
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react';

interface SettingsPanelProps {
  show: boolean;
  brightness: number;
  setBrightness: (value: number) => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  show,
  brightness,
  setBrightness,
  isDarkMode,
  setIsDarkMode
}) => (
  <div 
    className={`fixed bottom-4 left-4 p-6 bg-black/30 backdrop-blur-lg rounded-2xl z-20
      transform transition-all duration-300 ease-in-out
      ${show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
  >
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-white text-sm font-medium">Brightness</label>
        <div className="flex items-center gap-3">
          <VolumeX className="w-4 h-4 text-white opacity-50" />
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={brightness}
            onChange={(e) => setBrightness(parseFloat(e.target.value))}
            className="w-32 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
              [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150
              [&::-webkit-slider-thumb]:hover:scale-110"
          />
          <Volume2 className="w-4 h-4 text-white" />
        </div>
      </div>
      
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white 
          hover:bg-white/20 transition-all duration-150 transform hover:scale-105"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        <span className="text-sm font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    </div>
  </div>
);

export default SettingsPanel;