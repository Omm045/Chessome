# Chessome: Coding Standards & Bug Prevention

## 1. Philosophy
The cost of fixing a bug in production is 100x higher than fixing it in the IDE. Chessome enforces engineering rules that physically prevent classes of bugs from ever being written.

## 2. Strict TypeScript
TypeScript is only safe if configured strictly.
- `strict: true` (Enables `noImplicitAny`, `strictNullChecks`, etc).
- `noUncheckedIndexedAccess: true` (Forces you to handle `undefined` when accessing arrays or objects).
- `exactOptionalPropertyTypes: true` (Prevents setting optional properties to `undefined` explicitly if they shouldn't exist).

## 3. ESLint: The Enforcer
We use ESLint to enforce architectural boundaries and logical correctness.
- **Rule**: `@typescript-eslint/no-floating-promises`
  - **Why**: Prevents "fire and forget" async calls that swallow errors. Every promise must be `await`ed or explicitly `.catch()`ed.
- **Rule**: `react-hooks/exhaustive-deps`
  - **Why**: Missing dependencies in `useEffect` cause massive state desync bugs in the analysis board. This rule is set to `error`, not `warn`.
- **Rule**: `@nx/enforce-module-boundaries`
  - **Why**: Prevents the UI layer from importing from the Database layer.

## 4. Architectural Decision Records (ADR)

### ADR-CS-001: Zod for all External I/O
- **Why it exists**: TypeScript types are erased at compile time. Data coming from the API, LocalStorage, or external Chess APIs is inherently untrusted (`unknown`).
- **Trade-offs**: Writing Zod schemas in addition to TS Interfaces feels repetitive.
- **Alternative approaches**: Trusting the external API and using type assertions (`as GameData`).
- **Future scalability**: Safely prevents runtime crashes due to malformed payloads.
- **Risks**: Slight performance hit parsing large JSON objects.
- **Engineering justification**: We enforce a rule: **No type assertions (`as`) are allowed for external data.** All data crossing a boundary (HTTP request, Database read, JSON parse) MUST be validated through a Zod schema `Schema.parse()`. We infer the TypeScript types directly from the Zod schemas (`z.infer<typeof Schema>`) to maintain DRY principles.

### ADR-CS-002: Error Boundaries and Result Types
- **Why it exists**: Throwing exceptions (`throw new Error()`) acts like a hidden GOTO statement. It breaks the control flow and is easily missed by the caller.
- **Trade-offs**: Returning Result objects (`{ success: true, data: T } | { success: false, error: Error }`) increases boilerplate.
- **Alternative approaches**: Standard try/catch blocks.
- **Future scalability**: Makes error handling explicit and typed.
- **Risks**: Developers ignoring the error case.
- **Engineering justification**: For domain logic and use cases, we will use a **Result Type Pattern** (similar to Rust). Functions that can expectedly fail (e.g., parsing a PGN, analyzing a move) return a `Result<T, E>`. The caller is forced by the type system to handle the error branch. `throw` is reserved ONLY for true developer errors (e.g., unrecoverable startup misconfigurations).
