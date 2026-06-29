# Chessome: Contributor Experience

## 1. Philosophy
An open-source project lives or dies by its community. If it takes a week to set up the repository, developers will leave. Chessome is designed to be the most developer-friendly chess project in the world.

## 2. Onboarding Workflow
The goal is "Time to First Pull Request" < 1 hour.
1. `git clone`
2. `pnpm install`
3. `docker-compose up -d` (Spins up Postgres and Redis)
4. `pnpm db:setup` (Migrates schema and seeds local data)
5. `pnpm dev` (Runs Web, API, and Worker locally with hot-reloading)

## 3. Repository Structure (Turborepo)
The monorepo structure makes boundaries explicit. Contributors don't need to understand the backend to fix a CSS bug in the frontend.
- `apps/web`: Next.js Frontend.
- `apps/api`: NestJS Backend.
- `packages/core`: Pure TypeScript chess logic.
- `packages/ui`: Shared React components.

## 4. Git & Branching Strategy
We use a streamlined **GitHub Flow** (Trunk-based development).
1. Create a branch off `main` (e.g., `feat/opening-tree`, `fix/board-arrows`).
2. Commit frequently using **Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`). This is enforced by `commitlint` on a pre-commit hook.
3. Open a Pull Request against `main`.

## 5. Pull Request (PR) Workflow
1. **Automated Checks**: The PR triggers GitHub Actions. It must pass Prettier, ESLint, TypeScript compilation, Unit Tests, and E2E tests.
2. **Review Environment**: Using Vercel or similar, a temporary preview URL is generated for UI changes.
3. **Peer Review**: A maintainer must approve the PR. Code is reviewed for:
   - Architectural compliance (Does this belong in `core` or `web`?).
   - Performance (Does this cause unnecessary React re-renders?).
   - Security (Is the input validated with Zod?).
4. **Merge**: PRs are "Squash and Merged" to keep the `main` history clean. The PR title becomes the commit message.

## 6. Issue Templates
To prevent vague bug reports ("It doesn't work"), GitHub Issue Templates are enforced.
- **Bug Report Template**: Requires OS, Browser, steps to reproduce, and expected vs actual behavior.
- **Feature Request Template**: Requires the problem statement (What are you trying to solve?) and proposed solution.
- **Good First Issue**: Maintainers actively tag simple tasks (e.g., CSS fixes, translation updates) with `good first issue` to welcome newcomers.

## 7. Documentation Standards
- **Code Comments**: "What" the code does should be obvious from the variable names. Comments are strictly for "Why" the code does it.
- **Architecture**: Any major change MUST be accompanied by an update to the relevant `.md` files in the root architecture directory (e.g., an ADR).
- **API Docs**: All API changes must update the OpenAPI/Swagger decorators in NestJS, ensuring `swagger.json` is always accurate.

## 8. Release Workflow (Semantic Release)
When a PR is merged to `main`, an automated GitHub Action (Semantic Release) analyzes the commit messages.
- `fix:` triggers a patch release (`v1.0.1`).
- `feat:` triggers a minor release (`v1.1.0`).
- `BREAKING CHANGE:` triggers a major release (`v2.0.0`).
The action automatically tags the release, generates a changelog, and pushes the new Docker images to the registry. Nobody manually creates tags.
