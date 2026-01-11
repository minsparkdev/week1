/**
 * 앱 초기화 모듈
 * - 모드 라우팅 (SPA 방식)
 * - 전역 이벤트 관리
 */

// 현재 활성화된 모드
let currentMode = 'hub';

/**
 * 모드 전환 함수
 * @param {string} mode - 'hub' | 'random' | 'worldcup' | 'tarot' | 'balance' | 'fullcourse'
 */
export function switchMode(mode) {
    const modeHub = document.getElementById('mode-hub');
    const modeContent = document.getElementById('mode-content');

    if (!modeHub || !modeContent) return;

    currentMode = mode;

    if (mode === 'hub') {
        // 허브 화면으로 돌아가기
        modeHub.classList.remove('hidden');
        modeContent.classList.add('hidden');
        modeContent.innerHTML = '';
    } else {
        // 특정 모드 활성화
        modeHub.classList.add('hidden');
        modeContent.classList.remove('hidden');

        // 해당 모드 컴포넌트 로드
        loadModeComponent(mode, modeContent);
    }
}

/**
 * 모드별 컴포넌트 로드
 */
function loadModeComponent(mode, container) {
    // 뒤로가기 버튼 추가
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.innerHTML = '← 돌아가기';
    backButton.addEventListener('click', () => switchMode('hub'));

    container.innerHTML = '';
    container.appendChild(backButton);

    // 모드별 컴포넌트 생성
    let component;
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
        default:
            component = document.createElement('div');
            component.textContent = '준비 중입니다...';
    }

    container.appendChild(component);
}

/**
 * 모드 허브 이벤트 바인딩
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
 * 결과 이벤트 리스너 (컴포넌트에서 발생)
 */
export function initResultListener() {
    document.addEventListener('food-result', (e) => {
        const { food, mode } = e.detail;
        console.log(`[${mode}] 결과:`, food.name);

        // 결과 카드 표시 (추후 구현)
        showResultCard(food, mode);
    });
}

/**
 * 결과 카드 표시
 */
function showResultCard(food, mode) {
    const modeContent = document.getElementById('mode-content');
    if (!modeContent) return;

    // 결과 카드 컴포넌트 생성
    const resultCard = document.createElement('result-card');
    resultCard.setAttribute('food-id', food.id);
    resultCard.setAttribute('mode', mode);

    // 기존 컴포넌트를 결과 카드로 교체
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
 * 현재 모드 반환
 */
export function getCurrentMode() {
    return currentMode;
}

/**
 * 앱 전체 초기화
 */
export function initApp() {
    initModeHub();
    initResultListener();
}
