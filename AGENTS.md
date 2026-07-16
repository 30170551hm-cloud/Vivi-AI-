# AGENTS.md

## Project Context

This is a Firebase-backed Vivi AI application. Treat it as user-owned application code, keep changes focused on the user's request, and preserve existing project conventions.

Start with `README.md` for local setup, environment variables, and publish workflow.

## Key Files

- `src/`: frontend application source.
- `src/lib/backendClient.js`: unified Firebase runtime facade.
- `vite.config.js`: Vite configuration.
- `.env.local`: local-only environment values; never commit secrets.

## Working Notes

- Use `npm run dev` for frontend development against Firebase.
- Use Firebase emulators when local backend services are needed.
- Reuse `src/lib/backendClient.js` and the existing Firebase adapters before adding new integration paths.
- Run the relevant checks from `package.json` before finishing code changes.
