/**
 * Storage Utility Module
 * - localStorage-based data management
 * - Save decision history
 * - Manage food statistics
 *
 * @module utils/storage
 */

const STORAGE_KEYS = {
    HISTORY: 'whattoeat_history',
    STATS: 'whattoeat_stats',
    SETTINGS: 'whattoeat_settings'
};

const MAX_HISTORY_SIZE = 20;

/**
 * History item type
 * @typedef {Object} HistoryItem
 * @property {number} foodId - Food ID
 * @property {string} foodName - Food name
 * @property {string} mode - Decision mode (random, worldcup, tarot, balance, fullcourse)
 * @property {string} timestamp - ISO format timestamp
 */

/**
 * Statistics data type
 * @typedef {Object} FoodStats
 * @property {number} wins - Win count
 * @property {number} appearances - Appearance count
 * @property {string} lastWin - Last win time
 */

// =====================
// History Management
// =====================

/**
 * Get history list
 * @returns {HistoryItem[]}
 */
export function getHistory() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Failed to get history:', error);
        return [];
    }
}

/**
 * Add item to history
 * @param {Object} food - Food object
 * @param {string} mode - Decision mode
 */
export function addToHistory(food, mode) {
    try {
        const history = getHistory();

        const newItem = {
            foodId: food.id,
            foodName: food.name,
            foodEmoji: food.emoji,
            category: food.category,
            mode: mode,
            timestamp: new Date().toISOString()
        };

        // Add newest item at front
        history.unshift(newItem);

        // Limit max size
        if (history.length > MAX_HISTORY_SIZE) {
            history.pop();
        }

        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));

        // Update statistics
        updateStats(food, mode);

        // Dispatch event
        dispatchStorageEvent('history-updated', { history });

    } catch (error) {
        console.error('Failed to add to history:', error);
    }
}

/**
 * Clear history
 */
export function clearHistory() {
    try {
        localStorage.removeItem(STORAGE_KEYS.HISTORY);
        dispatchStorageEvent('history-updated', { history: [] });
    } catch (error) {
        console.error('Failed to clear history:', error);
    }
}

// =====================
// Statistics Management
// =====================

/**
 * Get all statistics
 * @returns {Object.<number, FoodStats>}
 */
export function getStats() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.STATS);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Failed to get stats:', error);
        return {};
    }
}

/**
 * Get statistics for specific food
 * @param {number} foodId
 * @returns {FoodStats}
 */
export function getFoodStats(foodId) {
    const stats = getStats();
    return stats[foodId] || { wins: 0, appearances: 0, lastWin: null };
}

/**
 * Update statistics
 * @param {Object} food - Food object
 * @param {string} mode - Decision mode
 */
function updateStats(food, mode) {
    try {
        const stats = getStats();

        if (!stats[food.id]) {
            stats[food.id] = {
                foodName: food.name,
                foodEmoji: food.emoji,
                wins: 0,
                appearances: 0,
                lastWin: null
            };
        }

        stats[food.id].wins += 1;
        stats[food.id].appearances += 1;
        stats[food.id].lastWin = new Date().toISOString();
        stats[food.id].foodName = food.name;
        stats[food.id].foodEmoji = food.emoji;

        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
        dispatchStorageEvent('stats-updated', { stats });

    } catch (error) {
        console.error('Failed to update stats:', error);
    }
}

/**
 * Clear statistics
 */
export function clearStats() {
    try {
        localStorage.removeItem(STORAGE_KEYS.STATS);
        dispatchStorageEvent('stats-updated', { stats: {} });
    } catch (error) {
        console.error('Failed to clear stats:', error);
    }
}

/**
 * Get top foods by win count
 * @param {number} limit - Number to retrieve
 * @returns {Array<{foodId: number, stats: FoodStats}>}
 */
export function getTopFoods(limit = 5) {
    const stats = getStats();

    return Object.entries(stats)
        .map(([foodId, foodStats]) => ({
            foodId: parseInt(foodId),
            ...foodStats
        }))
        .sort((a, b) => b.wins - a.wins)
        .slice(0, limit);
}

// =====================
// Settings Management
// =====================

/**
 * Get settings
 * @returns {Object}
 */
export function getSettings() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Failed to get settings:', error);
        return {};
    }
}

/**
 * Save settings
 * @param {Object} settings
 */
export function saveSettings(settings) {
    try {
        const current = getSettings();
        const updated = { ...current, ...settings };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (error) {
        console.error('Failed to save settings:', error);
    }
}

// =====================
// All Data Management
// =====================

/**
 * Clear all data
 */
export function clearAllData() {
    try {
        localStorage.removeItem(STORAGE_KEYS.HISTORY);
        localStorage.removeItem(STORAGE_KEYS.STATS);
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
        dispatchStorageEvent('data-cleared', {});
    } catch (error) {
        console.error('Failed to clear all data:', error);
    }
}

/**
 * Export data (for backup)
 * @returns {Object}
 */
export function exportData() {
    return {
        history: getHistory(),
        stats: getStats(),
        settings: getSettings(),
        exportedAt: new Date().toISOString()
    };
}

/**
 * Import data (for restore)
 * @param {Object} data
 */
export function importData(data) {
    try {
        if (data.history) {
            localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(data.history));
        }
        if (data.stats) {
            localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(data.stats));
        }
        if (data.settings) {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
        }
        dispatchStorageEvent('data-imported', data);
    } catch (error) {
        console.error('Failed to import data:', error);
    }
}

// =====================
// Event Helpers
// =====================

/**
 * Dispatch storage event
 * @param {string} eventName
 * @param {Object} detail
 */
function dispatchStorageEvent(eventName, detail) {
    document.dispatchEvent(new CustomEvent(`storage:${eventName}`, {
        detail,
        bubbles: true
    }));
}

/**
 * Register storage event listener
 * @param {string} eventName
 * @param {Function} callback
 * @returns {Function} Listener removal function
 */
export function onStorageEvent(eventName, callback) {
    const handler = (e) => callback(e.detail);
    document.addEventListener(`storage:${eventName}`, handler);
    return () => document.removeEventListener(`storage:${eventName}`, handler);
}
