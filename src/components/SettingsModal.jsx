import React from 'react';
import {
  Moon,
  Sun,
  Sparkles,
  RotateCcw,
  EyeOff,
  Trash2,
  X,
  Laptop,
} from 'lucide-react';
import { THEME_CONFIGS } from '../constants';
import { TiltButton } from './TiltButton';

export const SettingsModal = ({
  settings,
  updateSettings,
  onClose,
  onResetData,
  themeConfig,
}) => {
  const { darkMode, starsEnabled, starDensity, cloakPreset, batterySaver } = settings;

  const handleCloakChange = (preset) => {
    updateSettings({ cloakPreset: preset });
  };

  const handleResetToNormal = () => {
    updateSettings({ cloakPreset: 'protis' });
  };

  const themeAccent = themeConfig?.accent || '#06b6d4';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div
        className={`w-full max-w-lg rounded-3xl p-6 md:p-8 glass-panel shadow-2xl relative overflow-hidden transition-all duration-200 ${
          darkMode ? 'border-white/10' : 'border-slate-300'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <h2
              className={`text-xl font-bold tracking-tight ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Settings
            </h2>
          </div>

          <TiltButton
            onClick={onClose}
            className={`w-8 h-8 rounded-xl ${
              darkMode
                ? 'bg-slate-800 text-slate-400 hover:text-white'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
            title="Close"
            ariaLabel="Close"
            scale={1.1}
          >
            <X size={16} />
          </TiltButton>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          {/* Section 1: Dark Mode Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl glass-card">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-amber-100 text-amber-600'
                }`}
                style={darkMode ? { backgroundColor: `${themeAccent}25`, color: themeAccent } : {}}
              >
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <div
                  className={`text-sm font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Dark Mode
                </div>
                <div
                  className={`text-xs ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {darkMode
                    ? 'Cosmic obsidian glass with luminous stars'
                    : 'Frosted crystal glass aesthetic'}
                </div>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => updateSettings({ darkMode: !darkMode })}
              className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                darkMode ? 'bg-cyan-500' : 'bg-slate-300'
              }`}
              style={darkMode ? { backgroundColor: themeAccent } : {}}
              title="Toggle Dark Mode"
              aria-label="Toggle Dark Mode"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Section 2: Tab Cloaker & Background Color Themes */}
          <div className="p-4 rounded-2xl glass-card space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: themeAccent }}
                >
                  <EyeOff size={20} />
                </div>
                <div>
                  <div
                    className={`text-sm font-bold ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Stealth Themes & Background Colors
                  </div>
                  <div
                    className={`text-xs ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Changes tab title, favicon, and website background color
                  </div>
                </div>
              </div>

              {/* 3D Model Cursor-Tracking "Reset to Normal" Button */}
              <TiltButton
                onClick={handleResetToNormal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                  boxShadow: '0 4px 14px rgba(14, 165, 233, 0.35)',
                }}
                title="Reset background color and tab disguise back to normal"
                scale={1.12}
                maxTilt={28}
              >
                <RotateCcw size={13} />
                <span>reset to normal</span>
              </TiltButton>
            </div>

            {/* Theme & Background Color Options */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {[
                {
                  id: 'classroom',
                  label: 'Google Classroom',
                  badgeColor: '#137333',
                  desc: 'Emerald chalkboard background',
                },
                {
                  id: 'drive',
                  label: 'Google Drive',
                  badgeColor: '#1a73e8',
                  desc: 'Drive blue background',
                },
                {
                  id: 'canvas',
                  label: 'Canvas LMS',
                  badgeColor: '#e02424',
                  desc: 'Ruby crimson background',
                },
                {
                  id: 'desmos',
                  label: 'Desmos Calculator',
                  badgeColor: '#2572b4',
                  desc: 'Graph navy background',
                },
              ].map((theme) => {
                const isSelected = cloakPreset === theme.id;
                return (
                  <TiltButton
                    key={theme.id}
                    onClick={() => handleCloakChange(theme.id)}
                    className={`p-3 rounded-2xl text-left flex flex-col justify-between transition-all duration-200 border ${
                      isSelected
                        ? 'text-white font-bold shadow-lg'
                        : darkMode
                        ? 'bg-slate-800/70 text-slate-300 hover:text-white border-white/5'
                        : 'bg-white/80 text-slate-700 hover:text-slate-900 border-slate-200'
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: theme.badgeColor,
                            borderColor: theme.badgeColor,
                            boxShadow: `0 6px 20px ${theme.badgeColor}50`,
                          }
                        : {}
                    }
                    scale={1.08}
                    maxTilt={22}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold truncate">{theme.label}</span>
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: theme.badgeColor }}
                      />
                    </div>
                    <span
                      className={`text-[10px] ${
                        isSelected ? 'text-white/80' : 'text-slate-400'
                      }`}
                    >
                      {theme.desc}
                    </span>
                  </TiltButton>
                );
              })}
            </div>

            {/* Current Active Theme Status */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span>
                Active theme:{' '}
                <b className={darkMode ? 'text-white' : 'text-slate-800'}>
                  {THEME_CONFIGS[cloakPreset]?.name || 'Default (protis)'}
                </b>
              </span>
              {cloakPreset !== 'protis' && (
                <button
                  type="button"
                  onClick={handleResetToNormal}
                  className="text-cyan-400 hover:underline cursor-pointer"
                >
                  Clear disguise
                </button>
              )}
            </div>
          </div>

          {/* Section 3: Stars & Shooting Stars Background */}
          <div className="p-4 rounded-2xl glass-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
                  }`}
                >
                  <Sparkles size={20} />
                </div>
                <div>
                  <div
                    className={`text-sm font-bold ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Cosmic Starfield & Shooting Stars
                  </div>
                  <div
                    className={`text-xs ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Background twinkle stars & shooting stars
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => updateSettings({ starsEnabled: !starsEnabled })}
                className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                  starsEnabled ? 'bg-purple-600' : 'bg-slate-300'
                }`}
                title="Toggle Stars"
                aria-label="Toggle Stars"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm ${
                    starsEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Shooting Stars Specific Toggle */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <div>
                <span
                  className={`text-xs font-medium block ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Shooting Stars
                </span>
                <span className="text-[10px] text-slate-400">
                  Tiny white dot with greyish tail
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateSettings({
                    shootingStarsEnabled:
                      settings.shootingStarsEnabled === undefined
                        ? false
                        : !settings.shootingStarsEnabled,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                  settings.shootingStarsEnabled !== false ? 'bg-cyan-500' : 'bg-slate-300'
                }`}
                title="Toggle Shooting Stars"
                aria-label="Toggle Shooting Stars"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm ${
                    settings.shootingStarsEnabled !== false ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {starsEnabled && (
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span
                  className={`text-xs font-medium ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Star Density
                </span>
                <div className="flex items-center gap-1.5">
                  {['low', 'medium', 'high'].map((d) => (
                    <TiltButton
                      key={d}
                      onClick={() => updateSettings({ starDensity: d })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${
                        starDensity === d
                          ? 'bg-purple-600 text-white shadow-xs'
                          : darkMode
                          ? 'bg-slate-800 text-slate-400 hover:text-white'
                          : 'bg-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                      scale={1.1}
                    >
                      {d}
                    </TiltButton>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Chromebook Battery Saver Mode */}
          <div className="flex items-center justify-between p-4 rounded-2xl glass-card">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                }`}
              >
                <Laptop size={20} />
              </div>
              <div>
                <div
                  className={`text-sm font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Chromebook Battery Saver
                </div>
                <div
                  className={`text-xs ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Optimizes star count and CPU usage for all-day battery
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => updateSettings({ batterySaver: !batterySaver })}
              className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                batterySaver ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
              title="Toggle Battery Saver"
              aria-label="Toggle Battery Saver"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm ${
                  batterySaver ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Section 5: Reset Data */}
          <div className="flex items-center justify-between p-4 rounded-2xl glass-card">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-600'
                }`}
              >
                <Trash2 size={20} />
              </div>
              <div>
                <div
                  className={`text-sm font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Clear Saved Data
                </div>
                <div
                  className={`text-xs ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Reset favorites and stored game best scores
                </div>
              </div>
            </div>

            <TiltButton
              onClick={onResetData}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs"
              scale={1.1}
            >
              Reset
            </TiltButton>
          </div>
        </div>
      </div>
    </div>
  );
};
