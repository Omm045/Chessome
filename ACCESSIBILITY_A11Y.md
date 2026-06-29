# Chessome: Accessibility (a11y) Strategy

## 1. Compliance Target
Chessome targets strict **WCAG 2.2 AA Compliance**. Chess must be accessible to everyone, regardless of visual or motor impairments.

## 2. Core Accessibility Pillars

### 2.1 Screen Reader Support (Semantic HTML & ARIA)
- The chessboard is not just a visual canvas. It must have an invisible semantic DOM layer.
- **Implementation**: The board generates a visually hidden `<table>` or a grid of `<button>` elements with strict `aria-labels`.
- **Move Announcements**: When a piece is moved (by the user or the opponent), a visually hidden `aria-live="polite"` region must announce the move: "Knight to f3. Check."
- **Engine Announcements**: "Evaluation: Plus one point two. Best move: Pawn to e4."

### 2.2 Keyboard Navigation
- The entire interface must be fully navigable without a mouse.
- **Focus Management**: Focus states must be highly visible (a thick, high-contrast outline). `outline: none` is strictly forbidden unless replaced by a custom visible focus ring (via Tailwind's `focus-visible:ring`).
- **Chessboard Navigation**:
  - `Tab` moves focus onto the board.
  - Arrow keys (`Up/Down/Left/Right`) navigate the 64 squares.
  - `Enter` or `Space` selects a piece.
  - Arrow keys move to a target square.
  - `Enter` confirms the move.
- **Move Tree Navigation**: Left/Right arrows traverse move history. Up/Down navigate variations.

### 2.3 Visual Accessibility
- **Color Contrast**: All text and critical UI elements (like the evaluation bar text) must meet a minimum contrast ratio of 4.5:1 against their background.
- **Color Blindness**: The move classifications (Blunder = Red, Brilliant = Green) must NOT rely on color alone. Every classification badge must include a distinct icon (e.g., `!` for good, `??` for blunder) or text label.
- **High Contrast Theme**: An alternative board theme specifically optimized for high contrast (Black and White solid squares) must be provided.

### 2.4 Reduced Motion
- Users with vestibular disorders may experience nausea from smooth CSS animations.
- **Implementation**: We respect the OS-level `prefers-reduced-motion` media query.
- When `prefers-reduced-motion: reduce` is active:
  - Piece sliding animations snap instantly to the new square.
  - UI popovers open instantly without fading or scaling.

## 3. Automated Testing
- `eslint-plugin-jsx-a11y` is active in the Next.js project and set to `error`.
- Playwright E2E tests utilize `@axe-core/playwright` to run accessibility audits on the rendered DOM during CI. Any Axe violation fails the build.
