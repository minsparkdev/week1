/**
 * App Initialization Module
 * - Mode routing (SPA style)
 * - Global event management
 */

// Currently active mode
let currentMode = 'hub';

/**
 * Toggle ads visibility
 * - Hide ads in game mode (Google AdSense policy compliance)
 * - Show ads only on hub screen with sufficient content
 * @param {boolean} show - true: show, false: hide
 */
function toggleAds(show) {
    const adContainers = document.querySelectorAll('.ad-container');
    adContainers.forEach(ad => {
        ad.style.display = show ? 'block' : 'none';
    });
}

/**
 * Mode switch function
 * @param {string} mode - 'hub' | 'random' | 'worldcup' | 'tarot' | 'balance' | 'fullcourse'
 */
export function switchMode(mode) {
    const modeHub = document.getElementById('mode-hub');
    const modeContent = document.getElementById('mode-content');

    if (!modeHub || !modeContent) return;

    currentMode = mode;

    if (mode === 'hub') {
        // Return to hub screen
        modeHub.classList.remove('hidden');
        modeContent.classList.add('hidden');
        modeContent.innerHTML = '';
        // Show ads on hub
        toggleAds(true);
    } else {
        // Activate specific mode
        modeHub.classList.add('hidden');
        modeContent.classList.remove('hidden');
        // Hide ads in game mode
        toggleAds(false);

        // Load corresponding mode component
        loadModeComponent(mode, modeContent);
    }
}

/**
 * Load mode component
 */
function loadModeComponent(mode, container) {
    // Add back button
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.innerHTML = '← Back';
    backButton.addEventListener('click', () => switchMode('hub'));

    container.innerHTML = '';
    container.appendChild(backButton);

    // Create component by mode
    let component;
    console.log('[app.js] loadModeComponent called with mode:', mode);
    switch (mode) {
        case 'random':
            component = document.createElement('food-recommender');
            break;
        case 'worldcup':
            component = document.createElement('food-worldcup');
            break;
        case 'tarot':
            component = document.createElement('food-tarot');
            break;
        case 'balance':
            component = document.createElement('food-balance');
            break;
        case 'fullcourse':
            component = document.createElement('food-fullcourse');
            break;
        case 'payment':
            component = document.createElement('payment-game');
            break;
        default:
            component = document.createElement('div');
            component.textContent = 'Coming soon...';
    }

    container.appendChild(component);
}

/**
 * Mode hub event binding
 */
export function initModeHub() {
    const modeCards = document.querySelectorAll('.mode-card');

    modeCards.forEach(card => {
        card.addEventListener('click', () => {
            const mode = card.dataset.mode;
            if (mode) {
                switchMode(mode);
            }
        });
    });
}

/**
 * Result event listener (emitted from components)
 */
export function initResultListener() {
    document.addEventListener('food-result', (e) => {
        const { food, mode } = e.detail;
        console.log(`[${mode}] Result:`, food.name);

        // Show result card
        showResultCard(food, mode);
    });

    // Retry mode event listener
    document.addEventListener('retry-mode', (e) => {
        const { mode } = e.detail;
        console.log(`[${mode}] Restart`);

        // Restart the mode
        switchMode(mode);
    });
}

/**
 * Show result card
 */
function showResultCard(food, mode) {
    const modeContent = document.getElementById('mode-content');
    if (!modeContent) return;

    // Create result card component
    const resultCard = document.createElement('result-card');
    resultCard.setAttribute('food-id', food.id);
    resultCard.setAttribute('mode', mode);

    // Replace existing component with result card
    const existingComponent = modeContent.querySelector('[class*="food-"]') ||
                               modeContent.querySelector('food-recommender') ||
                               modeContent.querySelector('food-worldcup') ||
                               modeContent.querySelector('food-tarot') ||
                               modeContent.querySelector('food-balance');

    if (existingComponent) {
        existingComponent.replaceWith(resultCard);
    } else {
        modeContent.appendChild(resultCard);
    }
}

/**
 * Get current mode
 */
export function getCurrentMode() {
    return currentMode;
}

/**
 * Initialize entire app
 */
export function initApp() {
    initModeHub();
    initResultListener();
}
