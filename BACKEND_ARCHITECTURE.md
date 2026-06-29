# Chessome: Backend Architecture

## 1. Core Framework
The backend is built using **NestJS**, a progressive Node.js framework that fully supports TypeScript and heavily utilizes Dependency Injection (DI) and Decorators.

## 2. Hexagonal Architecture (Ports and Adapters)
The backend strictly adheres to Hexagonal Architecture. The system is divided into layers where dependencies point INWARD toward the Domain.

```text
apps/api/src/
├── domain/                  # The Core. Zero dependencies. Entities, Enums, and Interfaces (Ports).
│   ├── entities/
│   │   └── Game.ts
│   └── ports/
│       ├── IGameRepository.ts
│       └── IEngineAdapter.ts
├── application/             # Use Cases. Coordinates domain logic. Depends on Domain.
│   └── use-cases/
│       └── AnalyzeGameUseCase.ts
├── infrastructure/          # Adapters. Implementation details. Depends on Application/Domain.
│   ├── database/
│   │   └── PrismaGameRepository.ts  # Implements IGameRepository
│   └── engines/
│       └── StockfishCloudAdapter.ts # Implements IEngineAdapter
└── presentation/            # Entry points. Controllers, WebSockets, GraphQL Resolvers.
    ├── http/
    │   └── GameController.ts
    └── gateway/
        └── AnalysisGateway.ts       # WebSockets
```

## 3. Dependency Inversion
The Application layer (e.g., `AnalyzeGameUseCase`) never imports `PrismaClient` or `Axios`. It only imports `IGameRepository`. At runtime, NestJS injects the `PrismaGameRepository` into the Use Case. This makes unit testing trivial by injecting a `MockGameRepository`.

## 4. Communication Protocols
- **RESTful API**: Standard CRUD operations (User profiles, fetching game history, managing collections).
- **WebSockets (Socket.io or pure ws)**: Real-time bi-directional communication required for live engine evaluation streaming.
- **Redis Pub/Sub**: Used internally to broadcast messages from worker nodes to the API servers, which then push them to clients via WebSockets.

## 5. Architectural Decision Records (ADR)

### ADR-BE-001: NestJS over Express/Fastify raw
- **Why it exists**: Raw Express leads to spaghetti code in large teams. NestJS enforces a scalable architecture.
- **Trade-offs**: NestJS has a steeper learning curve and a heavier runtime overhead.
- **Alternative approaches**: Go (Fiber), Rust (Actix), Node (Express).
- **Future scalability**: The strict module system in NestJS allows teams to work on separate features (e.g., Openings vs Endgames) without merge conflicts.
- **Risks**: Cold start times in serverless environments (though we use long-lived containers, so this is mitigated).
- **Engineering justification**: The need for strict interfaces and Dependency Injection (for the Plugin System) makes NestJS the absolute best fit for this project in the Node.js ecosystem.

### ADR-BE-002: CQRS (Command Query Responsibility Segregation) for Game Data
- **Why it exists**: Reading a game with its massive tree of moves is highly complex and cacheable. Writing a game (syncing from Lichess) is write-heavy and transactional.
- **Trade-offs**: Increases boilerplate (separate Command and Query handlers).
- **Alternative approaches**: Standard CRUD services.
- **Future scalability**: Allows us to route Queries to PostgreSQL Read Replicas and Commands to the Master database.
- **Risks**: Eventual consistency issues if read replicas lag.
- **Engineering justification**: The `AnalyzeGameUseCase` is a Command. The `GetGameReviewUseCase` is a Query. We will use the `@nestjs/cqrs` module to strictly separate these paths. This guarantees that complex database reads do not block the transactional logic of inserting new engine evaluations.
