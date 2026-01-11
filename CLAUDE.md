# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**What to Eat (뭐 먹지?)** is a Korean-language web application that helps users decide what to eat through four interactive game modes. Built as a framework-less Single Page Application using vanilla JavaScript with Web Components.

**Live URL**: https://whattoeat.pages.dev/

## Development Commands

```bash
# Start local development server
python3 -m http.server 8000

# Optimize images (requires npm install first)
npm install
node scripts/optimize-images.js
```

## Architecture

### Technology Stack
- **No frameworks** - Pure HTML5, CSS3, JavaScript ES Modules
- **Web Components** with Shadow DOM for encapsulated UI components
- **LocalStorage** for data persistence (history, stats, settings)
- **Canvas API** for generating shareable result images
- **Sharp** (dev dependency) for image optimization

### Project Structure

```
js/
├── app.js                    # App initialization & mode routing (switchMode, loadModeComponent)
├── components/
│   ├── FoodRecommender.js    # 1초컷 (Quick random recommendation)
│   ├── FoodWorldcup.js       # 이상형 월드컵 (Tournament bracket)
│   ├── FoodTarot.js          # 음식 타로 (Card selection)
│   ├── FoodBalance.js        # 밸런스 게임 (A/B questions with taste analysis)
│   └── ResultCard.js         # Shared result display with image generation/sharing
├── data/
│   └── foods.js              # Food database (16 items), balance questions, utilities
└── utils/
    ├── storage.js            # LocalStorage CRUD (getHistory, addToHistory, getStats, updateStats)
    └── tasteAnalyzer.js      # Taste profile algorithm for Balance Game recommendations

assets/images/
├── foods/                    # Optimized food images (use these)
└── foods_original/           # Source images for optimization
```

### Component Pattern

All game components follow this Web Component pattern:

```javascript
class GameComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() { this.render(); }
  render() { this.shadowRoot.innerHTML = `<style>${this.getStyles()}</style>...`; }
  getStyles() { return `/* CSS */`; }
}
customElements.define('game-component', GameComponent);
```

### Event Flow

1. User clicks mode card → `switchMode(mode)` in app.js
2. `loadModeComponent()` inserts the appropriate `<food-*>` component
3. Component emits `food-result` custom event when complete
4. app.js catches event, creates `<result-card>` with food-id attribute
5. ResultCard handles sharing (Web Share API) and image download (Canvas)

### Data Model

Food objects in `foods.js`:
```javascript
{
  id, name, category, image, emoji, desc, tarot,
  traits: { spicy, hearty, adventurous, social, quick }  // 0-5 scale for Balance Game
}
```

Balance questions modify user's taste profile which is matched against food traits via Euclidean distance.

### Storage Keys
- `whattoeat_history` - Array of recent recommendations (max 20)
- `whattoeat_stats` - Object tracking food selection counts
- `whattoeat_settings` - User preferences

## Design System

- **Primary colors**: Coral/peach gradient (`#FFB5A7` to `#FFC8A2`)
- **Font**: Pretendard (Google Fonts)
- **Border radius**: 24px containers, 16px buttons
- **All styles in Shadow DOM** - Global `style.css` for layout only, component styles in `getStyles()`

## Adding a New Game Mode

1. Create `js/components/FoodNewMode.js` extending HTMLElement
2. Implement `connectedCallback()`, `render()`, `getStyles()`, emit `food-result` event
3. Import in index.html module script
4. Add case in `app.js` `loadModeComponent()` switch statement
5. Add mode card to `.mode-grid` in index.html
