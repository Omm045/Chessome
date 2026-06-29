'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Link as LinkIcon, Cpu } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';

type ImportMethod = 'paste' | 'upload' | 'chesscom' | 'lichess';

export default function ImportPage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  
  const [method, setMethod] = useState<ImportMethod>('paste');
  const [pgnData, setPgnData] = useState('');
  const [chesscomUsername, setChesscomUsername] = useState('');
  const [chesscomGames, setChesscomGames] = useState<{id: string, white: string, black: string, pgn: string, endTime: number, timeClass: string, whiteResult: string, blackResult: string}[]>([]);
  const [lichessUsername, setLichessUsername] = useState('');
  const [lichessGames, setLichessGames] = useState<{id: string, white: string, black: string, pgn: string, endTime: number, timeClass: string, whiteResult: string, blackResult: string}[]>([]);
  const [isFetchingGames, setIsFetchingGames] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImport = async () => {
    if (!pgnData.trim()) return;
    
    setIsSubmitting(true);
    try {
      // For now, post to our mock analysis endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization will be added by middleware/fetchWithAuth in a real app, 
          // or we can use our supabase token if required by this endpoint
        },
        body: JSON.stringify({
          type: 'pgn',
          data: pgnData,
          depth: user?.preferences?.engineDepth || 18,
          engine: user?.preferences?.preferredEngine || 'stockfish_16.1'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start analysis');
      }

      const data = await response.json();
      router.push(`/analyze/${data.sessionId}`);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleFetchChesscom = async () => {
    if (!chesscomUsername.trim()) return;
    setIsFetchingGames(true);
    setChesscomGames([]);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/integrations/chesscom/games?username=${encodeURIComponent(chesscomUsername.trim())}`);
      if (!response.ok) throw new Error('Failed to fetch games');
      const games = await response.json();
      setChesscomGames(games);
    } catch (error) {
      console.error(error);
      alert('Could not fetch games. Please check the username.');
    } finally {
      setIsFetchingGames(false);
    }
  };

  const handleFetchLichess = async () => {
    if (!lichessUsername.trim()) return;
    setIsFetchingGames(true);
    setLichessGames([]);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/integrations/lichess/games?username=${encodeURIComponent(lichessUsername.trim())}`);
      if (!response.ok) throw new Error('Failed to fetch games');
      const games = await response.json();
      setLichessGames(games);
    } catch (error) {
      console.error(error);
      alert('Could not fetch games. Please check the username.');
    } finally {
      setIsFetchingGames(false);
    }
  };


  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-gray-950 p-6 lg:p-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Import Game</h1>
          <p className="text-gray-400">Bring your games into Chessome for deep analysis.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          
          {/* Sidebar Navigation */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setMethod('paste')}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${method === 'paste' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:bg-gray-900 border border-transparent'}`}
            >
              <FileText size={18} />
              Paste PGN / FEN
            </button>
            <button 
              onClick={() => setMethod('upload')}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${method === 'upload' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:bg-gray-900 border border-transparent'}`}
            >
              <Upload size={18} />
              Upload File
            </button>
            
            <div className="my-4 h-px w-full bg-gray-800"></div>
            <p className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Integrations</p>
            
            <button 
              onClick={() => setMethod('chesscom')}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${method === 'chesscom' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:bg-gray-900 border border-transparent'}`}
            >
              <LinkIcon size={18} />
              Chess.com
            </button>
            <button 
              onClick={() => setMethod('lichess')}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${method === 'lichess' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:bg-gray-900 border border-transparent'}`}
            >
              <LinkIcon size={18} />
              Lichess.org
            </button>
          </div>

          {/* Main Area */}
          <div className="flex flex-col gap-6 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            
            {method === 'paste' && (
              <>
                <div>
                  <h2 className="text-xl font-semibold text-white">Paste PGN or FEN</h2>
                  <p className="text-sm text-gray-400 mt-1">Paste your game record or position data below.</p>
                </div>
                
                <textarea 
                  value={pgnData}
                  onChange={(e) => setPgnData(e.target.value)}
                  placeholder="[Event &quot;FIDE World Cup 2023&quot;]&#10;[Site &quot;Baku AZE&quot;]&#10;[Date &quot;2023.08.24&quot;]&#10;..."
                  className="min-h-[300px] w-full rounded-lg border border-gray-700 bg-gray-950 p-4 text-sm font-mono text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-700 resize-y"
                />
              </>
            )}

            {method === 'upload' && (
              <>
                <div>
                  <h2 className="text-xl font-semibold text-white">Upload PGN File</h2>
                  <p className="text-sm text-gray-400 mt-1">Select a .pgn file from your computer.</p>
                </div>
                
                <div className="flex min-h-[300px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-700 bg-gray-950/50 transition-colors hover:border-gray-500 hover:bg-gray-900/50">
                  <Upload size={48} className="mb-4 text-gray-600" />
                  <p className="text-sm font-medium text-gray-300">Click to upload or drag and drop</p>
                  <p className="mt-1 text-xs text-gray-500">Supports .pgn files up to 5MB</p>
                </div>
              </>
            )}

            {method === 'chesscom' && (
              <>
                <div>
                  <h2 className="text-xl font-semibold text-white">Import from Chess.com</h2>
                  <p className="text-sm text-gray-400 mt-1">Enter your Chess.com username to fetch recent games.</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <input 
                    type="text"
                    value={chesscomUsername}
                    onChange={(e) => setChesscomUsername(e.target.value)}
                    placeholder="Chess.com Username"
                    className="w-full rounded-lg border border-gray-700 bg-gray-950 p-3 text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleFetchChesscom()}
                  />
                  <button 
                    onClick={handleFetchChesscom}
                    disabled={isFetchingGames || !chesscomUsername.trim()}
                    className="whitespace-nowrap rounded-lg bg-gray-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
                  >
                    {isFetchingGames ? 'Fetching...' : 'Fetch Games'}
                  </button>
                </div>

                {chesscomGames.length > 0 && (
                  <div className="mt-4 flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Games</h3>
                    <div className="flex max-h-[300px] flex-col gap-2 overflow-y-auto pr-2">
                      {chesscomGames.map((game, i) => (
                        <div key={game.id || i} className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/40 p-4 transition-all hover:bg-gray-800/80">
                          <div>
                            <p className="font-medium text-gray-200">{game.white} vs {game.black}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(game.endTime * 1000).toLocaleDateString()} • {game.timeClass} • {game.whiteResult}-{game.blackResult}
                            </p>
                          </div>
                          <button 
                            onClick={() => {
                              setPgnData(game.pgn);
                              // We need to trigger submit, but state update is async.
                              // So we just call fetch directly here.
                              setTimeout(() => handleImport(), 0);
                            }}
                            className="rounded bg-blue-600/20 px-4 py-1.5 text-xs font-semibold text-blue-500 transition-colors hover:bg-blue-600 hover:text-white"
                          >
                            Analyze
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {method === 'lichess' && (
              <>
                <div>
                  <h2 className="text-xl font-semibold text-white">Import from Lichess</h2>
                  <p className="text-sm text-gray-400 mt-1">Enter your Lichess username to fetch recent games.</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <input 
                    type="text"
                    value={lichessUsername}
                    onChange={(e) => setLichessUsername(e.target.value)}
                    placeholder="Lichess Username"
                    className="w-full rounded-lg border border-gray-700 bg-gray-950 p-3 text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleFetchLichess()}
                  />
                  <button 
                    onClick={handleFetchLichess}
                    disabled={isFetchingGames || !lichessUsername.trim()}
                    className="whitespace-nowrap rounded-lg bg-gray-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
                  >
                    {isFetchingGames ? 'Fetching...' : 'Fetch Games'}
                  </button>
                </div>

                {lichessGames.length > 0 && (
                  <div className="mt-4 flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Games</h3>
                    <div className="flex max-h-[300px] flex-col gap-2 overflow-y-auto pr-2">
                      {lichessGames.map((game, i) => (
                        <div key={game.id || i} className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/40 p-4 transition-all hover:bg-gray-800/80">
                          <div>
                            <p className="font-medium text-gray-200">{game.white} vs {game.black}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(game.endTime * 1000).toLocaleDateString()} • {game.timeClass} • {game.whiteResult}-{game.blackResult}
                            </p>
                          </div>
                          <button 
                            onClick={() => {
                              setPgnData(game.pgn);
                              setTimeout(() => handleImport(), 0);
                            }}
                            className="rounded bg-blue-600/20 px-4 py-1.5 text-xs font-semibold text-blue-500 transition-colors hover:bg-blue-600 hover:text-white"
                          >
                            Analyze
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Analysis Options & Submit */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-800 pt-6">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5"><Cpu size={16}/> Stockfish 16.1</span>
                <span>•</span>
                <span>Depth: {user?.preferences?.engineDepth || 18}</span>
              </div>
              
              {(method === 'paste' || method === 'upload') && (
                <button 
                  onClick={handleImport}
                  disabled={isSubmitting || (method === 'paste' && !pgnData.trim())}
                  className="w-full sm:w-auto rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950"
                >
                  {isSubmitting ? 'Initializing...' : 'Analyze Game'}
                </button>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
