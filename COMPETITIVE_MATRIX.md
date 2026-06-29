# Chessome: Competitive Feature Matrix

## 1. Market Positioning
Chessome is not trying to be a playing server (like Lichess or Chess.com). It is a dedicated **Analysis & Training Platform**. Its true competitors are premium analysis tiers (Chess.com Diamond) and desktop software (ChessBase).

## 2. Feature Comparison

| Feature | Chessome | Lichess | Chess.com | ChessBase |
| :--- | :---: | :---: | :---: | :---: |
| **Open Source** | ✅ (AGPL) | ✅ (AGPL) | ❌ | ❌ |
| **Ad-Free** | ✅ | ✅ | ❌ (Free tier) | ❌ |
| **Deep Cloud Analysis** | ✅ (Unlimited*) | ❌ (Local mainly) | ✅ (Diamond) | ❌ (Local/Paid Cloud) |
| **Game Review UI** | ✅ | ✅ | ✅ | ❌ |
| **Natural Language AI** | ✅ (BYOK) | ❌ | ❌ | ❌ |
| **Multi-Engine Compare** | ✅ | ❌ | ❌ | ✅ |
| **Sync across platforms** | ✅ | ❌ | ❌ | ❌ |
| **Repertoire Trainer** | ✅ | ❌ (Basic Studies) | ✅ | ✅ |
| **Mobile Web Optimized** | ✅ | ✅ | ✅ | ❌ |

*\*Unlimited cloud analysis is subject to fair-use queueing.*

## 3. Differentiation Strategy

### 3.1 The "Bring Your Own Key" (BYOK) AI Coach
- **Description**: Users paste an OpenAI/Anthropic key to get natural language explanations of their blunders (e.g., "Why couldn't I take the pawn here?").
- **Priority**: High (Phase 6).
- **Complexity**: Medium.
- **Differentiation**: Major platforms avoid this due to the massive API costs associated with millions of users. By using BYOK, Chessome offers premium AI coaching for free, shifting the cost to the user's personal API account (which costs fractions of a cent per game).

### 3.2 Platform Agnosticism (The Universal Hub)
- **Description**: Users play on Lichess during the day, Chess.com at night, and OTB (Over The Board) on weekends. Chessome aggregates all PGNs into a single unified database.
- **Priority**: High (Phase 3).
- **Complexity**: Low (API Adapters).
- **Differentiation**: Playing platforms are walled gardens. Chessome is the Switzerland of chess analysis. It is the central hub for a player's entire chess career.

### 3.3 Multi-Engine Visualization
- **Description**: Running Stockfish 16 and Leela Chess Zero side-by-side on the same position and plotting their evaluation divergence on a graph.
- **Priority**: Medium (Phase 4).
- **Complexity**: High (Managing multiple Web Workers concurrently).
- **Differentiation**: Aimed at researchers, correspondence players, and opening theoreticians who need second opinions beyond standard Stockfish.

### 3.4 Personalized Weakness Detection
- **Description**: Statistical analysis of a user's aggregate games. "You lose 60% of endgames when up a pawn."
- **Priority**: Low (Post-v1.0).
- **Complexity**: Extremely High (Big Data/Analytics).
- **Differentiation**: Moves beyond single-game analysis into holistic career coaching.

## 4. Architectural Decision Records (ADR)

### ADR-COMP-001: Abandoning "Play" Features
- **Why it exists**: Building a scalable real-time chess playing server (matchmaking, anti-cheat, bullet latency, Elo ratings) is incredibly difficult and already solved perfectly by Lichess.
- **Decision**: Chessome will NEVER implement a "Play against a human" feature.
- **Alternatives considered**: Attempting to compete with Lichess/Chess.com.
- **Consequences**: We lose casual users who want an all-in-one app. We gain laser focus on building the ultimate analysis tool.
- **Future impact**: The architecture is immensely simplified. No anti-cheat required. No sub-50ms latency guarantees required for bullet chess. No complex Elo math required.
