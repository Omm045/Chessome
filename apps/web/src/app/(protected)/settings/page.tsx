'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Theme, BoardTheme } from '@chessome/core';
import { Palette, LayoutGrid, Cpu, Accessibility, Keyboard, Globe, Link as LinkIcon, Activity } from 'lucide-react';
import { DiagnosticsPanel } from './DiagnosticsPanel';

type SettingsSection = 'appearance' | 'board' | 'engine' | 'accessibility' | 'keyboard' | 'language' | 'accounts' | 'diagnostics';

export default function SettingsPage() {
  const { user, updatePreferences } = useAuthStore();
  const [activeSection, setActiveSection] = useState<SettingsSection>('appearance');

  if (!user || !user.preferences) return null;

  const sections = [
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
    { id: 'board', label: 'Board', icon: <LayoutGrid size={18} /> },
    { id: 'engine', label: 'Engine', icon: <Cpu size={18} /> },
    { id: 'accessibility', label: 'Accessibility', icon: <Accessibility size={18} /> },
    { id: 'keyboard', label: 'Keyboard', icon: <Keyboard size={18} /> },
    { id: 'language', label: 'Language', icon: <Globe size={18} /> },
    { id: 'accounts', label: 'Connected Accounts', icon: <LinkIcon size={18} /> },
    { id: 'diagnostics', label: 'Diagnostics', icon: <Activity size={18} /> },
  ];

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10 text-gray-200">
      <div className="mb-8 border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="mt-2 text-sm text-gray-400">Customize your Chessome experience.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as SettingsSection)}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                }`}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 rounded-xl border border-gray-800 bg-gray-900/50 p-6 md:p-8">
          
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Appearance</h2>
                <p className="text-sm text-gray-400 mb-6">Manage how Chessome looks to you.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-200">Theme</h3>
                    <p className="text-xs text-gray-500">Select your preferred color theme.</p>
                  </div>
                  <select 
                    value={user.preferences.theme}
                    onChange={(e) => updatePreferences({ theme: e.target.value as Theme })}
                    className="rounded-md border border-gray-700 bg-gray-950 px-3 py-1.5 text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="SYSTEM">System</option>
                    <option value="DARK">Dark</option>
                    <option value="LIGHT">Light</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'board' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Board Preferences</h2>
                <p className="text-sm text-gray-400 mb-6">Customize the chessboard and pieces.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-200">Board Theme</h3>
                    <p className="text-xs text-gray-500">Colors for the light and dark squares.</p>
                  </div>
                  <select 
                    value={user.preferences.boardTheme}
                    onChange={(e) => updatePreferences({ boardTheme: e.target.value as BoardTheme })}
                    className="rounded-md border border-gray-700 bg-gray-950 px-3 py-1.5 text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="DEFAULT">Default</option>
                    <option value="GREEN">Classic Green</option>
                    <option value="WOOD">Wood Grain</option>
                  </select>
                </div>

                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-200">Piece Set</h3>
                    <p className="text-xs text-gray-500">Style of the chess pieces.</p>
                  </div>
                  <select 
                    value={user.preferences.pieceTheme}
                    onChange={(e) => updatePreferences({ pieceTheme: e.target.value })}
                    className="rounded-md border border-gray-700 bg-gray-950 px-3 py-1.5 text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="default">Default</option>
                    <option value="neo">Neo</option>
                    <option value="retro">Retro</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Diagnostics Section */}
          {activeSection === 'diagnostics' && (
            <DiagnosticsPanel />
          )}

          {/* Placeholders for other sections */}
          {(['engine', 'accessibility', 'keyboard', 'language', 'accounts'].includes(activeSection)) && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1 capitalize">{activeSection.replace('-', ' ')}</h2>
                <p className="text-sm text-gray-400 mb-6">These settings are coming soon.</p>
              </div>
              <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-800 py-16 text-gray-500">
                Placeholder for {activeSection} settings.
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
