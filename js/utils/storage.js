/**
 * Storage 유틸리티 모듈
 * - localStorage 기반 데이터 관리
 * - 결정 히스토리 저장
 * - 음식별 통계 관리
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
 * 히스토리 항목 타입
 * @typedef {Object} HistoryItem
 * @property {number} foodId - 음식 ID
 * @property {string} foodName - 음식 이름
 * @property {string} mode - 결정 모드 (random, worldcup, tarot, balance, fullcourse)
 * @property {string} timestamp - ISO 형식 시간
 */

/**
 * 통계 데이터 타입
 * @typedef {Object} FoodStats
 * @property {number} wins - 우승 횟수
 * @property {number} appearances - 등장 횟수
 * @property {string} lastWin - 마지막 우승 시간
 */

// =====================
// 히스토리 관리
// =====================

/**
 * 히스토리 목록 가져오기
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
 * 히스토리에 항목 추가
 * @param {Object} food - 음식 객체
 * @param {string} mode - 결정 모드
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

        // 최신 항목을 앞에 추가
        history.unshift(newItem);

        // 최대 개수 제한
        if (history.length > MAX_HISTORY_SIZE) {
            history.pop();
        }

        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));

        // 통계 업데이트
        updateStats(food, mode);

        // 이벤트 발생
        dispatchStorageEvent('history-updated', { history });

    } catch (error) {
        console.error('Failed to add to history:', error);
    }
}

/**
 * 히스토리 초기화
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
// 통계 관리
// =====================

/**
 * 전체 통계 가져오기
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
 * 특정 음식의 통계 가져오기
 * @param {number} foodId
 * @returns {FoodStats}
 */
export function getFoodStats(foodId) {
    const stats = getStats();
    return stats[foodId] || { wins: 0, appearances: 0, lastWin: null };
}

/**
 * 통계 업데이트
 * @param {Object} food - 음식 객체
 * @param {string} mode - 결정 모드
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
 * 통계 초기화
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
 * 우승 횟수 기준 상위 음식 가져오기
 * @param {number} limit - 가져올 개수
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
// 설정 관리
// =====================

/**
 * 설정 가져오기
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
 * 설정 저장
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
// 전체 데이터 관리
// =====================

/**
 * 모든 데이터 초기화
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
 * 데이터 내보내기 (백업용)
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
 * 데이터 가져오기 (복원용)
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
// 이벤트 헬퍼
// =====================

/**
 * 스토리지 이벤트 발생
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
 * 스토리지 이벤트 리스너 등록
 * @param {string} eventName
 * @param {Function} callback
 * @returns {Function} 리스너 제거 함수
 */
export function onStorageEvent(eventName, callback) {
    const handler = (e) => callback(e.detail);
    document.addEventListener(`storage:${eventName}`, handler);
    return () => document.removeEventListener(`storage:${eventName}`, handler);
}
