# Chessome: AI Integration Architecture

## 1. Philosophy: AI is Optional, Engine is Absolute
Chessome uses AI (Large Language Models) **exclusively for natural language explanations and coaching**. 
- The AI is NEVER asked to evaluate a position.
- The AI is NEVER asked to find the best move.
- The platform functions perfectly at 100% capacity if AI is completely disabled.

## 2. Bring Your Own Key (BYOK) Model
Providing free LLM API calls is financially unsustainable for an open-source project. 
Users must provide their own API keys to enable the "AI Coach" feature.

### Supported Providers via Plugins:
- OpenAI (GPT-4o, GPT-4o-mini)
- Anthropic (Claude 3.5 Sonnet, Haiku)
- Google Gemini (Gemini 1.5 Pro, Flash)
- OpenRouter (Aggregator)
- Ollama (Local models like Llama-3, for maximum privacy and zero recurring cost)

## 3. The Prompting Pipeline

To prevent hallucination, the LLM is heavily constrained by injecting the mathematically proven truth (Engine output) directly into the system prompt.

### 3.1 Data Enrichment
When a user asks: "Why was Nc3 a blunder?"
The system builds a contextual payload:
1. **The Game State**: FEN string, previous 5 moves.
2. **The User's Move**: Nc3
3. **The Engine Evaluation of the User's Move**: -4.5 (Black is winning)
4. **The Best Move**: Nf3
5. **The Engine Evaluation of the Best Move**: +0.5 (Equal)
6. **The Engine's Continuation (Principal Variation)**: If Nc3, then Black plays Bxe4, winning a piece.

### 3.2 System Prompt Construction
The system constructs a strict system prompt instructing the LLM to act as a Chess Grandmaster Coach. 
*Rule*: "You must base your explanation ENTIRELY on the provided Engine Continuation. Do not invent tactical themes that are not supported by the Principal Variation."

## 4. Provider Routing & Fallback Strategy

As new models emerge, the backend must intelligently route AI requests based on the user's configured providers and the current status of those APIs.

### 4.1 Cost Estimation & Smart Routing
Before dispatching a prompt, the `AIRouterService`:
1. Calculates the exact token count of the enriched prompt.
2. Looks up the cost-per-1k-tokens for the user's enabled models.
3. Depending on user preference (e.g., "Prefer Cheapest" vs "Prefer Smartest"), it routes the request. For simple tactical blunders, it routes to `gpt-4o-mini`. For complex positional inaccuracies, it routes to `claude-3-5-sonnet`.

### 4.2 Automatic Fallback
If the user provides both an OpenAI and Anthropic key:
1. The router attempts OpenAI.
2. If OpenAI returns a `500 Internal Server Error` or a Rate Limit (`429`), the router intercepts the failure.
3. The router automatically falls back and dispatches the exact same prompt structure to Anthropic.
4. The user experiences no downtime.

## 5. Security & Privacy
- API keys are stored securely. If stored in the database, they must be symmetrically encrypted at rest (e.g., AES-256-GCM) with a master key injected via environment variables.
- Alternatively, keys can be stored locally in the browser's `localStorage` and sent with every request, ensuring the server never permanently stores them.

## 6. Architectural Decision Records (ADR)

### ADR-AI-001: Client-side Key Storage vs Server-side Encryption
- **Why it exists**: Users are rightly paranoid about pasting OpenAI API keys into random websites.
- **Trade-offs**: Storing in `localStorage` means the user has to re-enter it on a new device. Storing encrypted on the server allows cross-device usage but increases our liability.
- **Alternative approaches**: Monetizing the platform by providing our own keys.
- **Future scalability**: Local storage minimizes backend database overhead and compliance requirements (GDPR).
- **Engineering justification**: In Phase 1, we will implement **Client-Side Storage**. API keys are saved in browser state. When requesting an explanation, the client sends the API key in a custom HTTP Header `X-AI-Key`. The backend uses it in memory to proxy the request to OpenAI/Anthropic (to avoid CORS issues) and immediately drops it.

### ADR-AI-002: Prompt Versioning and Management
- **Why it exists**: Prompts change constantly as models evolve. Hardcoding prompts in the codebase requires a redeploy to tweak a sentence.
- **Decision**: Prompts will be managed as YAML files in a `Prompt Registry` (`packages/core/prompts/*.yaml`).
- **Consequences**: This allows version control (`v1.0.0-aggressive-coach`, `v1.2.0-gentle-coach`), pull requests for community improvements, and hot-reloading in the backend without database complexity.
