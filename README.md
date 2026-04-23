# Anakin's Music App

React Native music player built with Expo Go.

## Quick Start

```sh
nix develop   # enter pinned dev environment
make          # install dependencies and start Expo dev server
```

Scan the QR code with the [Expo Go](https://expo.dev/go) app on your phone.

## Commands

| Command | Description |
|---|---|
| `make` | Install dependencies (if needed) and start Expo dev server |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## Hot Reloading

Save any file — the app updates instantly in Expo Go without losing state.  
Full reload: shake device → **Reload**.

## Project Structure

```
app/           # screens and layouts (file-based routing)
src/
  components/  # reusable UI components
    __tests__/ # co-located tests
assets/        # images and fonts
```

## Tech Stack

| Tool | Docs |
|---|---|
| React Native | https://reactnative.dev/docs/getting-started |
| Expo | https://docs.expo.dev |
| Expo Router | https://docs.expo.dev/router/introduction |
| TypeScript | https://www.typescriptlang.org/docs |
| Jest | https://jestjs.io/docs/getting-started |
| Testing Library | https://testing-library.com/docs/react-native-testing-library/intro |
| Nix Flakes | https://nixos.wiki/wiki/Flakes |
| GNU Make | https://www.gnu.org/software/make/manual/make.html |
