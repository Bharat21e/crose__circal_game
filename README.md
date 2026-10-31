# Cross Circle Game

A Next.js (App Router, TypeScript) version of the classic cross-and-circle game.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Features
- Two players on one device
- Play the computer: easy (random) or hard (unbeatable minimax)
- Score tracking, alternating starter each round, highlighted winning line
- Keyboard accessible, mobile friendly

## Structure
- `lib/game.ts` – win detection and computer AI
- `components/Game.tsx` – game state and UI
- `components/Marks.tsx` – animated cross and circle SVGs
- `app/` – layout, page and styles
