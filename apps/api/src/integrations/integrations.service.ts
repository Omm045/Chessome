import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

export interface ExternalGame {
  id: string;
  url: string;
  pgn: string;
  white: string;
  black: string;
  whiteResult: string;
  blackResult: string;
  endTime: number;
  timeControl: string;
  timeClass: string;
  rules: string;
}

@Injectable()
export class IntegrationsService {
  
  async fetchChesscomGames(username: string, limit: number = 20): Promise<ExternalGame[]> {
    try {
      // 1. Fetch archives list
      const archivesRes = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`);
      if (!archivesRes.ok) {
        if (archivesRes.status === 404) {
          throw new HttpException('Chess.com user not found', HttpStatus.NOT_FOUND);
        }
        throw new HttpException('Failed to fetch from Chess.com', HttpStatus.BAD_GATEWAY);
      }

      const archivesData = await archivesRes.json();
      const archives: string[] = archivesData.archives;

      if (!archives || archives.length === 0) {
        return [];
      }

      // 2. Fetch the most recent archive
      const lastArchiveUrl = archives[archives.length - 1];
      const gamesRes = await fetch(lastArchiveUrl);
      
      if (!gamesRes.ok) {
        throw new HttpException('Failed to fetch games from Chess.com', HttpStatus.BAD_GATEWAY);
      }

      const gamesData = await gamesRes.json();
      const games: any[] = gamesData.games || [];

      // If we don't have enough games and there are previous archives, we could fetch them,
      // but for this MVP, returning the games from the current month is usually enough.
      // If we want exactly `limit` games, we just take the last `limit` games.
      
      // Sort games by end_time desc
      games.sort((a, b) => b.end_time - a.end_time);

      const recentGames = games.slice(0, limit);

      return recentGames.map((g: any) => ({
        id: g.uuid,
        url: g.url,
        pgn: g.pgn,
        white: g.white.username,
        black: g.black.username,
        whiteResult: g.white.result,
        blackResult: g.black.result,
        endTime: g.end_time,
        timeControl: g.time_control,
        timeClass: g.time_class,
        rules: g.rules,
      }));
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async fetchLichessGames(username: string, limit: number = 20): Promise<ExternalGame[]> {
    try {
      const res = await fetch(`https://lichess.org/api/games/user/${username}?max=${limit}&pgnInJson=true`, {
        headers: {
          'Accept': 'application/x-ndjson'
        }
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new HttpException('Lichess user not found', HttpStatus.NOT_FOUND);
        }
        throw new HttpException('Failed to fetch from Lichess', HttpStatus.BAD_GATEWAY);
      }

      const text = await res.text();
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      
      return lines.map(line => {
        const g = JSON.parse(line);
        // Extract basic data
        return {
          id: g.id,
          url: `https://lichess.org/${g.id}`,
          pgn: g.pgn || '', // Note: Lichess by default might not include PGN unless requested, wait, let's request PGNs.
          white: g.players.white.user?.name || 'Anonymous',
          black: g.players.black.user?.name || 'Anonymous',
          whiteResult: g.winner === 'white' ? 'win' : g.winner === 'black' ? 'loss' : 'draw',
          blackResult: g.winner === 'black' ? 'win' : g.winner === 'white' ? 'loss' : 'draw',
          endTime: Math.floor(g.createdAt / 1000), // Lichess uses ms for createdAt/lastMoveAt
          timeControl: g.clock?.initial ? `${g.clock.initial}+${g.clock.increment}` : 'unknown',
          timeClass: g.speed || 'unknown',
          rules: g.variant || 'chess',
        };
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
