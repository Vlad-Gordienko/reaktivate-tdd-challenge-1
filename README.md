# Reaktivate TDD Challenge

Take-home challenge: building a fast-test architecture with React + MobX, covered by unit and e2e tests.

**Stack:** React 16, MobX, Tailwind CSS, Create React App, Jest + Testing Library, Playwright.

## Commands
```bash
npm install          # install dependencies
npm run start        # run dev server (rebuilds Tailwind CSS first)
npm run test         # run unit tests
npm run test:e2e     # run Playwright e2e tests
npm run build        # production build
```

## Structure
- `src/Books` — domain logic and components
- `src/Shared`, `src/UiKit` — reusable utilities and UI
- `e2e` — Playwright tests

## Architecture notes
Views branch on already-computed ViewModel state (`isLoading`, `error`, `isEmpty`) to pick
what to render. This is presentational, not business logic — it stays in the View to avoid
the ViewModel depending on JSX.
