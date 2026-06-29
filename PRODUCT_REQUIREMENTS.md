# Chessome: Product Requirements Document (PRD)

## 1. Product Vision & Positioning

### 1.1 Vision
**Chessome is an Open Source Chess Analysis Platform.**
Its purpose is to become the best free chess analysis platform available while remaining open-source, privacy-first, ad-free, and community-driven. It provides professional-quality analysis comparable to premium chess analysis tools without requiring a recurring subscription. The platform is designed to support users ranging from beginners to grandmasters. 

### 1.2 Positioning
Chessome is NOT a chess website to play games, NOT another chess engine GUI, NOT an AI chatbot, and NOT a game. 
Chessome focuses on:
- Open Source (AGPLv3 core, MIT plugins)
- Privacy (No trackers, no data selling)
- Transparency (Open algorithms and analysis queues)
- Extensibility (Plugin-first architecture)
- Developer friendliness (API-first, well-documented)
- Bring Your Own AI (BYOK - API Key based)
- Community (Self-hosting and contributions encouraged)
- Professional Analysis (Deep multi-engine evaluations)

### 1.3 Target Audience
- **Professionals & Grandmasters**: Tournament preparation, deep opening analysis, and engine correlation.
- **Coaches**: Student progress tracking, mistake analysis, and repertoire building.
- **Students**: Mistake trainers, understandable natural language explanations.
- **Researchers**: Statistical game analysis, opening novelties, and engine comparisons.
- **Developers**: Extending the platform via plugins, data mining, and building custom analysis pipelines.

## 2. Core Features

### 2.1 Game Synchronization & Input
- **Chess.com Integration**: OAuth-based automatic synchronization of recent games.
- **Lichess Integration**: OAuth-based automatic synchronization.
- **Manual Synchronization**: On-demand fetching via username or game ID.
- **PGN Upload**: Bulk import and parsing of PGN files with support for nested variations.
- **FEN Analysis**: Start analysis from any custom FEN position.

### 2.2 Analysis Engine
- **Unlimited Analysis**: No hard paywalls or depth limits (subject to hardware availability in cloud or local WebAssembly limits).
- **Game Review**: Step-by-step game walkthrough highlighting blunders, mistakes, and brilliant moves.
- **Move Classification**: Standardized categorization (Brilliant, Great, Best, Excellent, Good, Inaccuracy, Mistake, Blunder, Miss).
- **Accuracy Report**: CAPS (Computer Aggregated Precision Score) equivalent based on engine centipawn loss.
- **Opening Detection**: ECO (Encyclopedia of Chess Openings) classification with transposition tracking.

### 2.3 Knowledge Base
- **Opening Explorer**: Move trees based on master databases and user databases.
- **Master Games**: Integrated search of high-level games reaching the current position.
- **Endgame Analysis**: Syzygy tablebase integration for 7-piece (and future 8-piece) perfect play resolutions.

### 2.4 Multi-Engine & Execution
- **Multiple Engine Support**: Interchangeable adapters for Stockfish, Berserk, Ethereal, Koivisto, RubiChess, PlentyChess, Alexandria, etc.
- **Cloud Analysis**: Distributed worker nodes running native engine binaries for deep depth.
- **Local Analysis**: WebAssembly (WASM) compiled engines running in the user's browser via Web Workers for zero-latency, private analysis.
- **Engine Comparison**: Side-by-side evaluation of the same position using different engines.

### 2.5 Training & Improvement
- **Repertoire Builder**: Create, maintain, and export opening repertoires.
- **Opening Trainer**: Spaced-repetition training against user-defined repertoires.
- **Puzzle Generation**: Automatically extract tactical sequences from the user's own games (e.g., missed tactics).
- **Mistake Trainer**: Drill previous blunders to ensure understanding of the correction.
- **Weakness Detector**: Statistical analysis of games to find recurring issues (e.g., "Often blunders in time trouble", "Poor endgame conversion").

### 2.6 User Experience & Management
- **Study Mode**: Interactive chapters, arrows, highlights, and annotations (similar to Lichess Studies).
- **Collections & Bookmarks**: Organize games into tagged folders.
- **Export/Import**: Full data portability.
- **Dark Mode**: Built-in, high-contrast, professional dark theme as the default.
- **Accessibility**: Screen reader support, keyboard navigation for the entire chessboard and UI.

## 3. Optional AI Integration (BYOK)
- **Role**: Natural language explanations of engine lines (e.g., "Why is Nc3 a blunder here?").
- **Constraints**: AI is NEVER responsible for engine evaluation. The platform must work perfectly if AI is disabled.
- **Providers**: OpenAI, Anthropic, Google Gemini, OpenRouter, Ollama, Local Models.
- **Mechanism**: Users provide their own API keys stored securely (or locally).

## 4. Long-Term Goals & Success Metrics
- **Scale**: Architected to support millions of users horizontally.
- **Availability**: 99.9% uptime for core analysis pipelines.
- **Ad-free & Open**: No advertisements, forever open-source.
- **Self-Hosting**: 1-click Docker deployments for private instances.

## 5. Architectural Decision Records (ADR)

### ADR-PRD-001: Separation of Engine Evaluation and AI Explanation
- **Why it exists**: LLMs hallucinate chess moves and evaluations. Chess engines (Stockfish) are deterministic and mathematically superior.
- **Trade-offs**: Requires running both a heavy compute engine (Stockfish) and an AI API call, increasing latency for the final combined explanation.
- **Alternative approaches**: Training a multimodal model to evaluate and explain. (Rejected due to cost, accuracy, and vendor lock-in).
- **Future scalability**: New engines and new LLMs can be swapped independently as plugins.
- **Risks**: Users might exhaust their own API keys quickly if explanations are triggered on every move.
- **Engineering justification**: By strictly isolating the truth-source (Engine) from the presentation-source (LLM), we guarantee accurate chess analysis while still providing human-readable coaching.
