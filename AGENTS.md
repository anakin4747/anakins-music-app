# AGENTS.md

## Project

Anakin's Music App — React Native / Expo music player.

## Dev Environment

All tooling is pinned via Nix. Never install Node, npm, or CLI tools globally.

```sh
nix develop        # enter the dev shell
npm install        # first time setup
```

## Commands

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server; scan QR with Expo Go app |
| `npm test` | Run Jest test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## Architecture

```
app/           expo-router screens and layouts
src/
  components/  reusable UI components
    __tests__/ co-located component tests
assets/        images and fonts
```

- **Routing**: file-based via `expo-router`
- **Styling**: `StyleSheet` (React Native built-in)
- **Testing**: Jest + `jest-expo` preset + `@testing-library/react-native`
- **Language**: TypeScript (strict mode)

## Conventions

- Components live in `src/components/`, screens in `app/`
- Tests are co-located under `__tests__/` next to the file under test
- Use `testID` props for element selection in tests (not text/style queries)
- Path alias `@/` maps to `src/`

## Skills

Always load and follow the TDD skill when writing or modifying code:

- `.skills/tdd/SKILL.md` — test-driven development workflow (Red → Green → Refactor)
- `.skills/atomic-commits/SKILL.md` — atomic git commit workflow and best practices

## Hot Reloading

Expo Go supports fast refresh out of the box. Save any file and the app updates instantly without losing state. Full reload: shake device → **Reload**.
