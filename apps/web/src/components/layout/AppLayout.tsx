'use client';

import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { LayoutDashboard, LogIn, Menu, MonitorPlay, Moon, Sun, Library, User, Settings, Home, Upload, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FeedbackModal } from '../feedback/FeedbackModal';
import { useState } from 'react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, toggleSidebar, theme, setTheme } = useUIStore();
  const { user, isAuthenticated, isLoading } = useCurrentUser();
  const pathname = usePathname();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(pathname);

  if (isAuthPage) {
    return <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>{children}</main>;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950">
      
      {/* Sidebar Overlay on Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={toggleSidebar} 
          aria-hidden="true" 
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`glass-panel fixed md:static inset-y-0 left-0 z-50 flex flex-col border-r border-gray-800 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-[250px] translate-x-0' : 'w-[70px] -translate-x-full md:translate-x-0'}`}
      >
        <div className="flex items-center justify-between border-b border-gray-800 p-4">
          {sidebarOpen && <span className="text-xl font-bold tracking-tight text-white">Chessome</span>}
          <button 
            onClick={toggleSidebar} 
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.25rem' }}
          >
            <Menu size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavItem href="/dashboard" icon={<Home size={20} />} label="Dashboard" isOpen={sidebarOpen} isActive={pathname.startsWith('/dashboard')} />
          <NavItem href="/" icon={<MonitorPlay size={20} />} label="Analyze" isOpen={sidebarOpen} isActive={pathname === '/'} />
          <NavItem href="/import" icon={<Upload size={20} />} label="Import" isOpen={sidebarOpen} isActive={pathname.startsWith('/import')} />
          <NavItem href="/library" icon={<Library size={20} />} label="Library" isOpen={sidebarOpen} isActive={pathname.startsWith('/library')} />
          <NavItem href="/sandbox" icon={<LayoutDashboard size={20} />} label="Sandbox" isOpen={sidebarOpen} isActive={pathname.startsWith('/sandbox')} />
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
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
          
          <button 
            onClick={() => setFeedbackOpen(true)}
            aria-label="Send Feedback"
            style={{ 
              display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem',
              background: 'transparent', border: 'none', color: 'var(--text-secondary)',
              cursor: 'pointer', width: '100%', justifyContent: sidebarOpen ? 'flex-start' : 'center',
              borderRadius: 'var(--radius-md)', transition: 'background-color var(--transition-fast)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <MessageSquare size={20} />
            {sidebarOpen && <span>Feedback</span>}
          </button>
          
          {isLoading ? (
            <div className={`flex items-center gap-3 px-4 py-2 ${sidebarOpen ? '' : 'justify-center'}`}>
              <div className="h-5 w-5 animate-pulse rounded-full bg-gray-800"></div>
              {sidebarOpen && <div className="h-4 w-20 animate-pulse rounded bg-gray-800"></div>}
            </div>
          ) : isAuthenticated ? (
            <>
              <NavItem href="/profile" icon={<User size={20} />} label={user?.username || 'Profile'} isOpen={sidebarOpen} isActive={pathname.startsWith('/profile')} />
              <NavItem href="/settings" icon={<Settings size={20} />} label="Settings" isOpen={sidebarOpen} isActive={pathname.startsWith('/settings')} />
            </>
          ) : (
            <NavItem href="/login" icon={<LogIn size={20} />} label="Sign In" isOpen={sidebarOpen} isActive={pathname.startsWith('/login')} />
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative w-full pt-16 md:pt-0">
        {/* Mobile Top Bar (only visible when sidebar is closed on mobile) */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md z-30 flex items-center px-4">
          <button 
            onClick={toggleSidebar} 
            aria-label="Open sidebar"
            className="rounded p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <span className="ml-4 text-lg font-bold text-white">Chessome</span>
        </div>

        {children}
      </main>

      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}

function NavItem({ href, icon, label, isOpen, isActive = false }: { href: string; icon: React.ReactNode; label: string; isOpen: boolean, isActive?: boolean }) {
  return (
    <Link 
      href={href}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.75rem 1rem',
        textDecoration: 'none',
        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
        background: isActive ? 'var(--bg-secondary)' : 'transparent',
        margin: '0 0.5rem',
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--transition-fast)',
        justifyContent: isOpen ? 'flex-start' : 'center',
      }}
      className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
    >
      {icon}
      {isOpen && <span>{label}</span>}
    </Link>
  );
}
