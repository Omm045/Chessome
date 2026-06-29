'use client';

import { useState } from 'react';
import { 
  Library, Upload, Plus, Clock, Star, Folder, 
  Share2, Archive, Trash2, MoreVertical, SearchIcon 
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLibrary, useUpdateSession, useTrashSession } from '@/hooks/useLibrary';

type FolderType = 'recent' | 'favorites' | 'archived' | 'trash';

const FOLDERS = [
  { id: 'recent', label: 'Recent', icon: Clock },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'archived', label: 'Archived', icon: Archive },
  { id: 'trash', label: 'Trash', icon: Trash2 },
];

export default function LibraryPage() {
  const { user } = useCurrentUser();
  const [activeFolder, setActiveFolder] = useState<FolderType>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useLibrary(activeFolder, searchQuery);
  const { mutate: updateSession } = useUpdateSession();
  const { mutate: trashSession } = useTrashSession();

  if (!user) return null;

  return (
    <div className="flex h-full w-full bg-[#0B0D13]">
      {/* LEFT SIDEBAR: Library Navigation */}
      <div className="w-64 border-r border-gray-800 bg-[#0E1118] p-4 flex flex-col gap-6">
        <div>
          <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Library</h2>
          <div className="flex flex-col gap-1">
            {FOLDERS.map(f => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFolder(f.id as FolderType)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    activeFolder === f.id 
                      ? 'bg-blue-600/10 text-blue-500' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  }`}
                >
                  <Icon size={16} />
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center justify-between">
            Collections
            <button className="text-gray-400 hover:text-white"><Plus size={14} /></button>
          </h2>
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-200">
              <Folder size={16} /> Opening Prep
            </button>
            <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-200">
              <Folder size={16} /> Tournament
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT: Sessions List */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-16 border-b border-gray-800 px-6 flex items-center justify-between bg-[#0E1118]">
          <div className="relative w-96">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={16} className="text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border-0 bg-gray-900/50 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-500 focus:bg-gray-900 focus:ring-1 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              placeholder="Search by player, opening, or notes..."
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white">
              <Upload size={16} />
              Import PGN
            </button>
            <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500">
              <Plus size={16} />
              Analyze Game
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Loading library...
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <div className="grid gap-4">
              {data.data.map(session => (
                <div key={session.id} className="group relative flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900/40 p-4 transition-all hover:bg-gray-800/60">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => updateSession({ id: session.id, updates: { isFavorite: !session.isFavorite } })}
                      className={`text-gray-500 hover:text-yellow-500 transition-colors ${session.isFavorite ? 'text-yellow-500' : ''}`}
                    >
                      <Star size={18} fill={session.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {session.title || `${session.white} vs ${session.black}`}
                      </h3>
                      <div className="mt-1 flex items-center gap-3 text-sm text-gray-400">
                        <span>{session.result || '*'}</span>
                        <span>•</span>
                        <span>{session.opening || 'Unknown Opening'}</span>
                        <span>•</span>
                        <span>{new Date(session.date).toLocaleDateString()}</span>
                        {session.accuracy && (
                          <>
                            <span>•</span>
                            <span className="text-green-500 font-medium">{session.accuracy}% acc</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-700"><Share2 size={16} /></button>
                    <button 
                      onClick={() => trashSession(session.id)}
                      className="p-2 text-gray-400 hover:text-red-400 rounded-md hover:bg-gray-700"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-700"><MoreVertical size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-800 bg-gray-900/20 p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800/50 text-gray-500">
                <Library size={32} />
              </div>
              <h2 className="mb-2 text-xl font-bold text-white">No analyses found</h2>
              <p className="mb-8 max-w-sm text-sm text-gray-400">
                {searchQuery 
                  ? "We couldn't find any sessions matching your search."
                  : "Import a PGN or start your first analysis to build your library."}
              </p>
              {!searchQuery && (
                <div className="flex gap-4">
                  <button className="rounded-md bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700">
                    Import PGN
                  </button>
                  <button className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500">
                    Analyze Game
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
