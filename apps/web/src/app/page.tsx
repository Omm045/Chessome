"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { useRouter } from 'next/navigation';
import { apiClient } from '../lib/api/client';

export default function Home() {
  const router = useRouter();

  const handleRealAnalysis = async () => {
    const pgn = `[Event "FIDE World Cup 2023"]
[Site "Baku AZE"]
[Date "2023.08.09"]
[Round "4.1"]
[White "Carlsen,M"]
[Black "Keymer,Vincent"]
[Result "0-1"]
[WhiteElo "2835"]
[BlackElo "2690"]
[EventDate "2023.07.30"]
[ECO "C65"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. d3 Bc5 5. c3 O-O 6. O-O d6 7. h3 Ne7
8. d4 Bb6 9. Bd3 Ng6 10. Re1 Re8 11. Na3 c6 12. Nc4 Bc7 13. dxe5 dxe5 14. a4 a5
15. Qc2 Nh5 16. Bf1 Qf6 17. Bg5 Qe6 18. Rad1 h6 19. Be3 Qf6 20. Nh2 Nhf4 21. Kh1 b5
22. Nb6 Bxb6 23. Bxb6 Qg5 24. Be3 Qh5 25. Rd6 Be6 26. Rxc6 b4 27. cxb4 axb4
28. b3 Red8 29. Rb6 Rac8 30. Qb2 Nd3 31. Bxd3 Rxd3 32. Rxb4 Nf4 33. Rb5 Rcc3
34. Rxe5 Qxe5 35. Bxf4 Qxf4 0-1`;

    try {
      const res = await apiClient.startAnalysis({ type: 'pgn', data: pgn, options: { depth: 15 } });
      router.push(`/analyze/${res.sessionId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to start real analysis. Is the backend running?');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.025em' }}>
        Welcome to <span style={{ color: 'var(--accent-primary)' }}>Chessome</span>
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '2rem' }}>
        The world's most powerful open-source chess analysis platform. 
        Start exploring engine evaluations, opening repertoires, and insightful analytics.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button size="lg" variant="primary" onClick={handleRealAnalysis}>
          Analyze Game (Real)
        </Button>
        <Link href="/analyze/mock" passHref>
          <Button size="lg" variant="secondary">
            Analyze Game (Mock)
          </Button>
        </Link>
        <Link href="/sandbox" passHref>
          <Button size="lg" variant="secondary">
            View Components
          </Button>
        </Link>
      </div>
    </div>
  );
}
