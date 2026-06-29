# Chessome: Internationalization (i18n)

## 1. Philosophy
Chess is a universal game. The platform must be built from day one to support localization. **No business logic or UI should ever depend on hardcoded English text.**

## 2. Technology Stack
- **Library**: `next-intl` (Integrates perfectly with Next.js App Router and Server Components).
- **Format**: Standard ICU MessageFormat (allows for complex pluralization and variable injection).

## 3. Implementation Strategy

### 3.1 Text Externalization
- All English text is stored in `messages/en.json`.
- Developers must use the `useTranslations` hook in Client Components, and the `getTranslations` function in Server Components.

```tsx
// ❌ WRONG
<button>Analyze Game</button>

// ✅ RIGHT
const t = useTranslations('AnalysisUI');
<button>{t('analyzeGame')}</button>
```

### 3.2 Chess Specific i18n
- **Move Notation**: English Algebraic Notation (SAN) uses K, Q, R, B, N. Different languages use different letters (e.g., French uses C for Cavalier/Knight).
- **Decision**: PGNs are always stored in standard English SAN in the database. The frontend UI translates the letters at render time if the user has selected a local piece notation preference.

### 3.3 Pluralization & Numbers
- "1 mistake", "2 mistakes".
- These are handled natively by `next-intl` to account for languages with complex plural rules (like Arabic or Russian).
- Numbers and decimals (e.g., Engine Evaluation `+1.23` vs `+1,23` in Europe) are formatted using the native JS `Intl.NumberFormat` API based on the user's locale.

### 3.4 Dates and Timezones
- **Database**: All dates are stored in PostgreSQL as `TIMESTAMPTZ` (UTC).
- **API**: All JSON dates are transmitted in ISO 8601 UTC format (`2024-01-01T12:00:00Z`).
- **Frontend**: Dates are converted to the user's local timezone at the absolute last moment before rendering using `Intl.DateTimeFormat` or `date-fns`.

### 3.5 Right-to-Left (RTL) Support
- The Tailwind setup natively uses logical properties (e.g., `ps-4` for padding-start instead of `pl-4` for padding-left).
- When the locale is Arabic or Hebrew, the `<html>` tag receives `dir="rtl"`. The entire UI layout flips automatically.
- **Exception**: The Chessboard itself ALWAYS remains LTR (A1 is bottom left for White), as the geometry of chess does not change in RTL languages.

## 4. Translation Workflow
- English (`en.json`) is the source of truth.
- Community contributors can submit PRs adding or updating other language JSON files.
- We will integrate an open-source translation management tool (e.g., Weblate or Crowdin free open-source tier) to allow non-technical translators to contribute via a web UI.
