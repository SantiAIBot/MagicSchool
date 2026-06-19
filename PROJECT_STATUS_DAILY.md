# Project Status: School Platform Refactor

## Purpose
Refactor the "Plataforma Mágica" into a modular structure and add a centralized audio system (background music, sound effects, voice greetings).

## High-level Goals
- **Maintain logic semantics**: Math, numbers, reading, minutes, password, and Tic-Tac-Toe CPU must work as before.
- **Modularization**: Split inline JS into `main.js`, `js/games/*.js`, and `js/audio.js`.
- **Audio Integration**: Add additive audio hooks without breaking existing functionality.
- **Code Annotation**: All code must be annotated line by line.

## Progress
- [x] Initial codebase analysis.
- [x] Directory structure setup (`js/`, `js/games/`, `sounds/`).
- [x] Modularization of JavaScript (`main.js`, `audio.js`, `tic_tac_toe.js`).
- [x] Audio engine implementation (Exact spec structure).
- [x] Unicorn-Mario implementation (`unicorn_mario.js`).
- [x] Sound hooks integration across all modules.
- [x] Personalization: Animated "Hola Helena" greeting and talking unicorn in games and activities.
- [x] Isolated game containers and selection menu.
- [x] Initial Welcome Screen ("Hola Helena").
- [x] Activity restructure into "Tareas" menu.
- [x] Points System implementation (10pts math, 5pts numbers, 50pts memory).
- [x] Memory Cards game (Progressive difficulty: 6, 8, 10, 20 cards).
- [x] Unicorn Checkers (Full rules: Captures, Kings, Long-range movement).
- [x] Reading animation: First to last letter sequence.
- [x] Dynamic greeting implementation: Ask for name and update all greetings.

## Today's Tasks
1. ✅ Create directory structure for code and sounds.
2. ✅ Extract Tic-Tac-Toe and main logic following strict spec.
3. ✅ Implement centralized `audio.js` with `sounds` object.
4. ✅ Implement `Unicorn-Mario` runner game (Enlarged and enhanced).
5. ✅ Integrate voice greeting and click sounds.
6. ✅ Add personalized animations and talking unicorn (Helena mode) in games and activities.
7. ✅ Implement game selection menu with isolated screen space for each game.
8. ✅ Add Welcome Screen and restructure activities under "Tareas" tab.
9. ✅ Implement Points system and massive Numbers UI (6rem).
10. ✅ Implement Memory Cards game with difficulty levels.
11. ✅ Implement theme-aware Unicorn Checkers game with advanced rules.
12. ✅ Fix Reading animation to follow letter-by-letter sequence.
13. ✅ Implement dynamic name greeting (Change "Helena" to user input).
14. ✅ Annotate all code line by line.

## Expected Audio Files (sounds/ folder)
- `sounds/ui/click.mp3`
- `sounds/ui/open_tab.mp3`
- `sounds/unicorn/jump.wav`
- `sounds/unicorn/coin.wav`
- `sounds/unicorn/hit.wav`
- `sounds/unicorn/bg_music.mp3`
- `sounds/tic_tac_toe/place.wav`
- `sounds/tic_tac_toe/win.wav`
- `sounds/tic_tac_toe/lose.wav`
- `sounds/voices/greeting1.mp3`

## Known Issues / Notes
- Script order: `audio.js` -> `main.js` -> `tic_tac_toe.js` -> `unicorn_mario.js`.
- Keep IDs and function names same as in `work.html`.
