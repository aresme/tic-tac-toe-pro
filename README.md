# ❌⭕ Tic-Tac-Toe Pro

A masterfully crafted, professional-grade Tic-Tac-Toe Progressive Web App (PWA) built with React, Vite, and Firebase. This isn't your standard tutorial app—it features an unbeatable Minimax computational AI, a pristine flat-design UI architecture, and completely serverless, authentication-free global multiplayer.

## ✨ Key Features

- **Extreme Computational AI**: An uncompromised, mathematically invincible opponent. The AI utilizes a fully computed Minimax optimization algorithm with randomized non-deterministic tie-breaking to ensure it behaves ruthlessly and unpredictably. 
- **Serverless Realtime Multiplayer**: Bypass the hassle of creating accounts. Using Firebase Realtime Database transactions and anonymous presence systems, players can immediately generate room codes and play with friends globally with zero friction.
- **Pristine Minimalist UI**: A disciplined, high-contrast Red, White, and Slate Gray aesthetic. Drops shadows and gradients were strictly removed in favor of a crisp, native-feeling flat design system.
- **Offline-Ready PWA**: Fully installable on iOS, Android, and Desktop operating systems. Uses aggressive local caching and `localStorage` to preserve offline match history and cumulative win/loss statistics flawlessly.

## 🛠️ Tech Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling**: Pure Modular CSS (Zero-dependency custom design system)
- **Multiplayer / Infrastructure**: Firebase Realtime Database & Firebase Hosting
- **State Management**: React Hooks + Local Storage Synchronizers

## 🚀 Live Demo

Play the live production version here:
**[https://tic-tier.web.app](https://tic-tier.web.app/)**

## 💻 Local Execution

Clone the repository and run it locally:

```bash
# 1. Clone the repository
git clone https://github.com/aresme/tic-tac-toe-pro.git

# 2. Navigate and install dependencies
cd tic-tac-toe-pro
npm install

# 3. Start the dev server
npm run dev
```

## 🧠 Engine Architecture

The "Extreme" difficulty analyzes the entire game state tree utilizing the **Minimax Algorithm**. The engine evaluates every possible board permutation down to the deepest terminal states seamlessly. Because Tic-Tac-Toe is a mathematically solved zero-sum game, the AI algorithm is mathematically verified to never lose a match—the best a human can definitively achieve against it is a perfect draw.
