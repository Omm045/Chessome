# Chessome: Code Review Guidelines

Code reviews at Chessome are not just about finding typos. They are the primary defense against architectural degradation. Reviewers must check the following axes before approving any PR.

## 1. Architectural Integrity
- [ ] Does this PR violate Dependency Inversion? (e.g., Does the `Application` layer import the `Database` layer directly instead of using an interface?)
- [ ] Are third-party vendor SDKs (e.g., Stripe, OpenAI) isolated behind an adapter Plugin?
- [ ] Has the business logic been pushed down to `packages/core` where possible, rather than living in a Next.js UI component?

## 2. Security & Boundaries
- [ ] Is every API boundary (HTTP Request body, external API response) validated using Zod schemas?
- [ ] Are raw SQL queries parameterized? (No string concatenation `SELECT * FROM games WHERE id = ${id}`).
- [ ] Are sensitive environment variables (`API_KEY`) prefixed correctly? (Ensure they do NOT have the `NEXT_PUBLIC_` prefix unless intentionally exposed to the browser).

## 3. Performance & Memory
- [ ] Does this PR introduce a loop containing an asynchronous `await` (potential N+1 database issue)?
- [ ] For React changes: Are large arrays or expensive calculations wrapped in `useMemo`?
- [ ] Are event listeners properly cleaned up in `useEffect` to prevent memory leaks?
- [ ] Did the Next.js bundle size increase significantly? Check the automated CI report.

## 4. Testing
- [ ] Is the code coverage maintained or improved?
- [ ] Are unhappy paths (errors, network failures) explicitly tested, or just the "happy path"?
- [ ] Does this fix a reported bug? If so, is there a specific regression test added to ensure it never happens again?

## 5. Open Source & Readability
- [ ] Are variables named clearly? (`evaluatedFen` instead of `eF`).
- [ ] If this PR introduces a complex workaround, is there a comment explaining *WHY* the workaround exists?
- [ ] If the PR changes how a feature works, are the root `/docs` or Architecture Markdowns updated to reflect the new truth?
