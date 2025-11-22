# Copilot Instructions for PortfolioSite

## Project Overview
- **Framework:** React (with Vite for build/dev)
- **Entry Point:** `src/main.jsx` bootstraps the app, rendering `App.jsx`.
- **Styling:** Uses `index.css` for global styles. Tailwind CSS may be present (check `package.json` for dependencies).
- **Public Assets:** Static files are served from `public/`.
- **Build Tool:** Vite (`vite.config.js` for config)

## Developer Workflows
- **Start Dev Server:** `npm run dev` (hot module reload enabled)
- **Build for Production:** `npm run build`
- **Preview Production Build:** `npm run preview`
- **Linting:** `npm run lint` (uses ESLint, config in `eslint.config.js`)
- **No test setup detected** (add if needed)

## Key Conventions & Patterns
- **Component Structure:** Main components in `src/`, typically functional React components.
- **Global Styles:** Defined in `src/index.css`.
- **Routing:** No router detected; single-page app unless otherwise added.
- **External Dependencies:**
  - Vite plugins for React (see `package.json`)
  - Tailwind CSS if present (check for `tailwindcss` in dependencies)
- **Config Files:**
  - `vite.config.js` for build/dev config
  - `eslint.config.js` for linting rules

## Integration Points
- **Static Assets:** Place images/fonts in `public/` for direct access.
- **Environment Variables:** Use `.env` files for Vite (not present by default).

## Example Patterns
- **App Entry:**
  ```js
  // src/main.jsx
  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import App from './App';
  import './index.css';

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  ```
- **Component:**
  ```js
  // src/App.jsx
  export default function App() {
    return <div>Hello World</div>;
  }
  ```

## Tips for AI Agents
- Always update `vite.config.js` for build-related changes.
- Place new components in `src/` and import them in `App.jsx`.
- Use `public/` for static assets, not `src/`.
- Follow ESLint rules as defined in `eslint.config.js`.

---
_If any conventions or workflows are unclear or missing, please ask for clarification or provide feedback to improve these instructions._
