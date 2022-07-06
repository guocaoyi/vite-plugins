# vite-plugin-inferno

An all in one preset for writing Inferno apps with the vite bundler.

## Features

- 🚀 Hot Module Replacement via prefresh
- 🔨 Devtools bridge during development

## Installing

```bash
λ npm i vite-plugin-inferno --save-dev

# or with pnpm
λ pnpm install vite-plugin-inferno --save-dev

# or with yarn
yarn add vite-plugin-inferno -D
```

## Usage

configurate in `vite.config.ts` or `vite.config.js`

```typescript
import { defineConfig } from 'vite'
import inferno from 'vite-plugin-inferno'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [inferno()],
})
```