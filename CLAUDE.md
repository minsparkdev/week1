# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**What to Eat (뭐 먹지?)** is a bilingual (Korean/English) web application that helps users decide what to eat through five interactive game modes. Built as a framework-less Single Page Application using vanilla JavaScript with Web Components.

**Live URL**: https://whattoeat.pages.dev/ (Korean) | https://whattoeat.pages.dev/en/ (English)

## Development Commands

```bash
# Start local development server (access at http://localhost:8000)
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
/                             # Korean version (default)
├── js/
│   ├── app.js                # App initialization & mode routing (switchMode, loadModeComponent)
│   ├── components/           # Web Components for each game mode
│   ├── data/foods.js         # Food database (16 items), balance questions, utilities
│   └── utils/                # storage.js, tasteAnalyzer.js
├── guide/                    # Static guide pages (SEO landing pages for each mode)
├── blog/                     # Static blog posts for content marketing
└── assets/images/foods/      # Optimized food images (food-1.png through food-16.png)

/en/                          # English version (mirrors Korean structure exactly)
├── js/                       # Localized components with English text
├── guide/                    # English guide pages
└── blog/                     # English blog posts
```

**Important**: When adding features, update BOTH Korean (`/js/`) and English (`/en/js/`) versions to maintain feature parity.

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

Custom events used:
- `food-result` - Component → App (game completed with food selection)
- `retry-mode` - Component → App (restart current game)
- `go-home` - Component → App (return to mode selection hub)

Mode identifiers in app.js: `random`, `worldcup`, `tarot`, `balance`, `payment` (functional), `fullcourse` (not yet implemented)

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

- **Primary color**: Warm Coral (`#FF8B7B`) with gradient variants
- **Accent colors**: Mint (`#B8E0D2`), Lavender (`#D4C1EC`), Peach (`#FFDAC1`)
- **Font**: Pretendard (Google Fonts)
- **Border radius**: 24px containers, 16px buttons
- **All styles in Shadow DOM** - Global `style.css` for layout only, component styles in `getStyles()`

## Adding a New Game Mode

1. Create `js/components/FoodNewMode.js` extending HTMLElement
2. Implement `connectedCallback()`, `render()`, `getStyles()`, emit `food-result` event
3. Import in `index.html` module script
4. Add case in `app.js` `loadModeComponent()` switch statement
5. Add mode card to `.mode-grid` in `index.html`
6. Create guide page at `guide/new-mode.html`
7. **Repeat steps 1-6 for `/en/` directory** with English text

## Adding New Foods

1. Add food image as `assets/images/foods/food-{id}.png` (run `node scripts/optimize-images.js` after)
2. Add food object to `foods` array in `js/data/foods.js` with all required fields (id, name, category, image, desc, tarot, emoji, traits)
3. **Repeat for `/en/js/data/foods.js`** with English translations
