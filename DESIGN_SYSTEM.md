# Chessome: Design System

## 1. Philosophy
Chessome must feel professional, premium, and instantly recognizable. It should look like an enterprise-grade tool, not a hobby project.
- **Aesthetics**: Modern, clean, high-contrast. Minimal borders, deep shadows, and subtle glassmorphism.
- **Default Theme**: Dark Mode. A bright, glaring white screen is exhausting for hours of deep analysis. Light mode is available but secondary.
- **Accessibility**: 100% WCAG AA compliance. High contrast ratios for text. Screen reader support for chess moves (e.g., `aria-label="Knight to f3, check"`).

## 2. Technology Stack
- **Styling**: **Tailwind CSS**
- **Component Library**: **Radix UI Primitives** (Unstyled, accessible components like Dialogs, Dropdowns, and Popovers) wrapped in our custom Tailwind design tokens (similar to shadcn/ui).
- **Icons**: **Lucide React** (Clean, consistent stroke widths).

## 3. Design Tokens

### 3.1 Colors (Dark Mode)
- **Background Base**: `#09090b` (Deep Zinc)
- **Background Surface**: `#18181b` (Slightly elevated cards/panels)
- **Primary Accent**: `#3b82f6` (Vibrant Blue - for focus states and primary buttons)
- **Success (Brilliant/Great)**: `#22c55e` (Emerald)
- **Warning (Mistake)**: `#eab308` (Yellow)
- **Error (Blunder)**: `#ef4444` (Red)

### 3.2 Typography
- **Primary Font**: **Inter** (Clean, highly legible for UI elements and data tables).
- **Monospace Font**: **JetBrains Mono** (For engine lines, FEN strings, and PGN outputs).

### 3.3 The Chessboard Colors
The board must have customizable themes, but the default must be elegant:
- **Light Squares**: `#ebecd0`
- **Dark Squares**: `#739552` (Classic "Chess.com Green" for familiarity, or a more muted slate blue for a unique identity).

## 4. Component Architecture
All components reside in `packages/ui` to enforce reusability across the monorepo.
Components are built strictly as presentational (dumb) components. They take `props` and emit `events`. They never fetch data.

## 5. Architectural Decision Records (ADR)

### ADR-DS-001: Rejection of CSS-in-JS (Runtime)
- **Why it exists**: Libraries like Styled-Components or Emotion add runtime overhead and block Next.js Server Components from rendering efficiently.
- **Trade-offs**: Tailwind requires learning utility classes and can result in messy HTML if not abstracted into components.
- **Alternative approaches**: CSS Modules, Emotion, Vanilla Extract.
- **Future scalability**: Tailwind is standard in the React ecosystem and produces incredibly small CSS bundles via PurgeCSS.
- **Risks**: Utility class bloat.
- **Engineering justification**: We use Tailwind CSS combined with `cva` (Class Variance Authority) to build highly typed, variant-driven components. This ensures zero runtime CSS overhead and perfect compatibility with React Server Components.

### ADR-DS-002: Keyboard-First Navigation
- **Why it exists**: Power users and professionals navigate with keyboards (arrows for move tree, hotkeys for engine toggle). Mouse reliance is slow.
- **Trade-offs**: Requires complex event listeners and `tabIndex` management.
- **Alternative approaches**: Mouse-only interface.
- **Future scalability**: Essential for accessibility and power-user adoption.
- **Risks**: Hotkey conflicts with browser defaults.
- **Engineering justification**: Every interactive element must be reachable via `Tab`. The chessboard itself will capture arrow keys (Left/Right for move history, Up/Down for variations) when focused. A global hotkey manager (e.g., using `react-hotkeys-hook`) will be implemented to ensure context-aware keyboard shortcuts (e.g., pressing `E` toggles the Engine).
