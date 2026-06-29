import { describe, it, expect } from 'vitest';
import { MliebeltPgnAdapter } from '../adapter';

describe('Official PGN Certification', () => {
  it('should parse a standard PGN file', () => {
    const pgn = `[Event "FIDE World Cup 2017"]
[Site "Tbilisi GEO"]
[Date "2017.09.09"]
[Round "4.1"]
[White "Carlsen,M"]
[Black "Bu Xiangzhi"]
[Result "0-1"]
[WhiteElo "2827"]
[BlackElo "2710"]
[EventDate "2017.09.03"]
[ECO "C55"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. d3 h6 5. O-O d6 6. c3 g6 7. Re1 Bg7 
8. h3 O-O 9. Nbd2 Kh7 10. Nf1 Ng8 11. d4 exd4 12. cxd4 f5 13. e5 dxe5 
14. dxe5 Qxd1 15. Rxd1 Nxe5 16. Nxe5 Bxe5 17. Re1 Bd6 18. Bd2 Bd7 19. Bc3 Rae8 
20. Ne3 Be6 21. Rad1 Bxc4 22. Nxc4 Rxe1+ 23. Bxe1 Rd8 24. Kf1 Be7 25. Rxd8 Bxd8 
26. Na5 b6 27. Nc6 Bf6 28. Nxa7 Bxb2 29. Nb5 c6 30. Na7 Ne7 31. a4 Kg7 
32. Ke2 Kf6 33. Kd3 Ke6 34. Bd2 h5 35. Bg5 Bf6 36. Bf4 Kd7 0-1`;
    
    const game = MliebeltPgnAdapter.parseGame(pgn);
    expect(game.type).toBe('Game');
    expect(game.tags.length).toBe(11);
    expect(game.result?.result).toBe('0-1');
  });
});
