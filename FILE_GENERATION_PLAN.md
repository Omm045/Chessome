# Chessome: File Generation Plan

When executing tasks, files must be generated in this exact sequence to ensure strict dependency resolution and prevent "module not found" TypeScript errors during active development.

## Phase A: Foundation
1. `/package.json`
2. `/turbo.json`
3. `/pnpm-workspace.yaml`
4. `/packages/config/tsconfig.base.json`
5. `/packages/config/eslint-preset.js`

## Phase B: The Core Domain
6. `/packages/core/package.json`
7. `/packages/core/src/types/chess.ts`
8. `/packages/core/src/schemas/evaluation.schema.ts`
9. `/packages/core/src/schemas/game.schema.ts`
10. `/packages/core/src/index.ts` (Barrel file)
11. `/packages/core/src/utils/fenParser.ts`
12. `/packages/core/src/utils/pgnParser.ts`

## Phase C: Data Layer
13. `/packages/database/package.json`
14. `/packages/database/schema.prisma`
15. `/packages/database/src/client.ts`
16. `/packages/database/src/repositories/GameRepository.ts`
17. `/packages/database/src/repositories/EvaluationRepository.ts`

## Phase D: Engine Adapters
18. `/packages/engine-adapters/package.json`
19. `/packages/engine-adapters/src/interfaces/IEngineAdapter.ts`
20. `/packages/engine-adapters/src/UciParser.ts`
21. `/packages/engine-adapters/src/StockfishWasmAdapter.ts`
22. `/packages/engine-adapters/src/StockfishProcessAdapter.ts`

## Phase E: API Server (NestJS)
23. `/apps/api/package.json`
24. `/apps/api/src/main.ts`
25. `/apps/api/src/app.module.ts`
26. `/apps/api/src/domain/AnalysisJob.ts`
27. `/apps/api/src/application/AnalyzeGameUseCase.ts`
28. `/apps/api/src/presentation/http/AnalysisController.ts`
29. `/apps/api/src/presentation/gateway/AnalysisGateway.ts`

## Phase F: Worker Nodes
30. `/apps/worker-analysis/package.json`
31. `/apps/worker-analysis/src/main.ts`
32. `/apps/worker-analysis/src/queue/Worker.ts`
33. `/apps/worker-analysis/src/scheduler/JobProcessor.ts`

## Phase G: UI & Frontend
34. `/packages/ui/package.json`
35. `/packages/ui/tailwind.config.js`
36. `/packages/ui/src/components/Chessboard/Board.tsx`
37. `/packages/ui/src/components/EvaluationBar/EvalBar.tsx`
38. `/apps/web/package.json`
39. `/apps/web/src/app/layout.tsx`
40. `/apps/web/src/app/page.tsx`
41. `/apps/web/src/features/analysis/store/useAnalysisStore.ts`
42. `/apps/web/src/features/analysis/components/GameReviewUI.tsx`
