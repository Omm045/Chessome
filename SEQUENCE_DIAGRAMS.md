# Chessome: Sequence Diagrams

This document visualizes the core critical paths of the platform using Mermaid.js.

## 1. Cloud Game Review Request
This diagram illustrates the flow when a user requests a full game review, demonstrating the interaction between the API, Scheduler, Cache, and Workers.

```mermaid
sequenceDiagram
    actor Client
    participant API as API Gateway
    participant Cache as Redis Eval Cache
    participant Sched as Engine Scheduler
    participant Worker as Worker Node (Stockfish)
    participant DB as PostgreSQL
    participant WS as WebSocket Gateway

    Client->>API: POST /v1/analysis/review { gameId }
    API->>DB: Fetch PGN
    API->>API: Parse PGN into 40 FENs
    
    loop Every FEN in Game
        API->>Cache: Check FEN at Depth 20
        alt Cache Hit
            Cache-->>API: Returns Evaluation
            API->>WS: Emit 'EvaluationCompleted' (via PubSub)
        else Cache Miss
            API->>Sched: Queue Job (Priority 2)
        end
    end
    
    API-->>Client: 202 Accepted { reviewJobId }
    Client->>WS: Subscribe to { reviewJobId }
    
    Sched->>Worker: Assign FEN Job
    Worker->>Worker: Spawn Stockfish Process
    
    loop Every 500ms
        Worker->>WS: Emit 'EvaluationProduced' (PubSub)
        WS-->>Client: Live Eval Bar Update
    end
    
    Worker->>Worker: Target Depth Reached
    Worker->>DB: Insert Evaluation
    Worker->>WS: Emit 'EvaluationCompleted'
    WS-->>Client: Final Move Classification updated
```

## 2. Bring Your Own Key (BYOK) AI Explanation
This diagram shows how the system prevents the LLM from hallucinating by forcing it to read the Engine's PV (Principal Variation).

```mermaid
sequenceDiagram
    actor Client
    participant API as API Gateway
    participant DB as PostgreSQL (Evals)
    participant AI as OpenAI/Anthropic

    Client->>API: POST /v1/ai/explain { fen, move, apiKey }
    API->>DB: Fetch Engine Eval & PV for FEN
    DB-->>API: Eval: -4.5, BestMove: Nf3, PV: Nf3 Nc6...
    
    API->>API: Construct strict System Prompt injecting PV
    API->>AI: POST /chat/completions (with Client's API Key)
    
    loop Server Sent Events
        AI-->>API: text chunk
        API-->>Client: stream text chunk
    end
    
    API->>API: Drop Client API Key from memory
```

## 3. Automated OAuth Game Sync
How Chessome stays up to date with a user's Lichess account seamlessly in the background.

```mermaid
sequenceDiagram
    participant Cron as Sync CronJob
    participant Q as Redis Sync Queue
    participant Worker as Sync Worker (Plugin)
    participant Lichess as Lichess API
    participant DB as PostgreSQL

    Cron->>Q: Enqueue 'SyncUsers' Job
    Q->>Worker: Pick up Job
    Worker->>DB: Get User Lichess OAuth Token
    Worker->>Lichess: GET /api/games/user?since=lastSync
    Lichess-->>Worker: NDJSON Stream of Games
    
    loop For each Game
        Worker->>DB: Insert Game (if not exists)
        Worker->>Q: Emit 'GameSynced' Event
    end
```
