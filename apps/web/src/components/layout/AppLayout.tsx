'use client';

import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { LayoutDashboard, LogIn, Menu, MonitorPlay, Moon, Sun } from 'lucide-react';
import Link from 'next/link';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, toggleSidebar, theme, setTheme } = useUIStore();

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* Sidebar */}
      <aside 
        className="glass-panel"
        style={{ 
          width: sidebarOpen ? '250px' : '70px',
          transition: 'width var(--transition-normal)',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border-color)',
          borderLeft: 'none',
          borderTop: 'none',
          borderBottom: 'none',
          borderRadius: 0,
          zIndex: 10
        }}
      >
        <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', borderBottom: '1px solid var(--border-color)' }}>
          {sidebarOpen && <span style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.025em' }}>Chessome</span>}
          <button 
            onClick={toggleSidebar} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.25rem' }}
          >
            <Menu size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavItem href="/" icon={<MonitorPlay size={20} />} label="Analysis" isOpen={sidebarOpen} />
          <NavItem href="/sandbox" icon={<LayoutDashboard size={20} />} label="Sandbox" isOpen={sidebarOpen} />
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem',
              background: 'transparent', border: 'none', color: 'var(--text-secondary)',
              cursor: 'pointer', width: '100%', justifyContent: sidebarOpen ? 'flex-start' : 'center',
              borderRadius: 'var(--radius-md)', transition: 'background-color var(--transition-fast)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            {sidebarOpen && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          
          <NavItem href="/login" icon={<LogIn size={20} />} label="Sign In" isOpen={sidebarOpen} />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {children}
      </main>

    </div>
  );
}

function NavItem({ href, icon, label, isOpen }: { href: string; icon: React.ReactNode; label: string; isOpen: boolean }) {
  return (
    <Link 
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.75rem 1rem',
        textDecoration: 'none',
        color: 'var(--text-secondary)',
        margin: '0 0.5rem',
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--transition-fast)',
        justifyContent: isOpen ? 'flex-start' : 'center',
      }}
      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
    >
      {icon}
      {isOpen && <span>{label}</span>}
    </Link>
  );
}
