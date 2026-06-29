'use client';

import React from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLibrary } from '@/hooks/useLibrary';
import Link from 'next/link';
import { Play, Upload, Hash, Clock, Cpu, BarChart2, Star, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useCurrentUser();
  const router = useRouter();
  
  // Fetch recent sessions. In a real app we'd fetch order by lastViewedAt for "Continue"
  const { data: recentSessions, isLoading } = useLibrary('recent', '', 1, 4);

  const lastViewedSession = recentSessions?.data?.[0]; // Mocking the first recent as last viewed for now
  const recentList = recentSessions?.data?.slice(1, 4) || [];

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-gray-950 p-6 lg:p-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        
        {/* Header */}
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome back, {user?.displayName || user?.username || 'Player'}
          </h1>
          <p className="text-gray-400">Here's what's happening with your chess analysis.</p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          {/* Main Area: Continue & Recent */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
            
            {/* Continue Last Analysis */}
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Continue Analysis</h2>
              {isLoading ? (
                <div className="h-40 w-full animate-pulse rounded-xl bg-gray-900 border border-gray-800"></div>
              ) : lastViewedSession ? (
                <div 
                  onClick={() => router.push(`/analyze/${lastViewedSession.id}`)}
                  className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-gray-800 bg-gray-900/60 p-6 transition-all hover:border-blue-500/50 hover:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{lastViewedSession.title || 'Untitled Analysis'}</h3>
                      <p className="mt-1 text-sm text-gray-400">
                        {lastViewedSession.white} vs {lastViewedSession.black} • {lastViewedSession.result}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/20 text-blue-500 transition-transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                      <Play fill="currentColor" size={18} className="ml-1" />
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><Clock size={14} /> Viewed recently</span>
                    <span className="flex items-center gap-1.5"><Cpu size={14} /> {lastViewedSession.engineDepth} depth</span>
                  </div>
                </div>
              ) : (
                <div className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed border-gray-800 bg-gray-900/30 text-gray-500">
                  No recent analyses found
                </div>
              )}
            </section>

            {/* Recent Analyses List */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Recent</h2>
                <Link href="/library" className="text-xs font-medium text-blue-500 hover:text-blue-400">View All</Link>
              </div>
              
              <div className="flex flex-col gap-2">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 w-full animate-pulse rounded-lg bg-gray-900 border border-gray-800"></div>
                  ))
                ) : recentList.length > 0 ? (
                  recentList.map(session => (
                    <Link 
                      href={`/analyze/${session.id}`}
                      key={session.id}
                      className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/40 p-4 transition-all hover:bg-gray-800/80"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-800 text-gray-400">
                          <Hash size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-200">{session.title || 'Untitled Analysis'}</p>
                          <p className="text-xs text-gray-500">{session.white} vs {session.black}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{new Date(session.lastViewedAt || session.lastOpened).toLocaleDateString()}</div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 py-4">Your recent analyses will appear here.</p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Area: Actions & Stats */}
          <div className="flex flex-col gap-6">
            
            {/* Quick Actions */}
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/import" className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-900 p-4 text-gray-400 hover:border-gray-600 hover:text-gray-200 transition-colors">
                  <Upload size={24} />
                  <span className="text-xs font-medium">Import PGN</span>
                </Link>
                <Link href="/sandbox" className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-900 p-4 text-gray-400 hover:border-gray-600 hover:text-gray-200 transition-colors">
                  <Plus size={24} />
                  <span className="text-xs font-medium">Empty Board</span>
                </Link>
              </div>
            </section>

            {/* Quick Stats (Mocked) */}
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Your Stats</h2>
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <BarChart2 size={16} />
                      <span className="text-sm">Games Analyzed</span>
                    </div>
                    <span className="font-bold text-gray-200">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={16} />
                      <span className="text-sm">Time Spent</span>
                    </div>
                    <span className="font-bold text-gray-200">5.2h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Star size={16} />
                      <span className="text-sm">Average Accuracy</span>
                    </div>
                    <span className="font-bold text-green-500">84%</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Engine Status */}
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">System</h2>
              <div className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                    <Cpu size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">Stockfish 16.1</p>
                    <p className="text-xs text-gray-500">WASM ready</p>
                  </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
