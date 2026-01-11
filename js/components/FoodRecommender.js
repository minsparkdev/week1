/**
 * FoodRecommender 컴포넌트
 * - 랜덤 음식 추천 (1초컷)
 * - 다른 모드들과 일관된 디자인
 */

import { foods, getRandomFood } from '../data/foods.js';

class FoodRecommender extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isAnimating = false;
        this.hasResult = false;
        this.currentFood = null;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                ${this.getStyles()}
            </style>
            <div class="recommender-container">
                <div class="header">
                    <span class="mode-badge">🎲 1초컷</span>
                    <h2 class="title">${this.hasResult ? '오늘의 메뉴가 결정되었습니다!' : '운명에 맡기고 바로 추천받기'}</h2>
                    <p class="subtitle">${this.hasResult ? '' : '버튼 한 번이면 끝! 고민은 이제 그만'}</p>
                </div>

                <div class="food-display">
                    <div class="food-image-area" id="image-area">
                        <div class="image-placeholder">🍽️</div>
                    </div>
                    <div class="food-info">
                        <span class="food-category" id="category">${this.hasResult && this.currentFood ? this.currentFood.category : ''}</span>
                        <h3 class="food-name" id="food-name">${this.hasResult && this.currentFood ? this.currentFood.name : '?'}</h3>
                        <p class="food-desc" id="food-desc">${this.hasResult && this.currentFood ? this.currentFood.desc : '어떤 음식이 나올까요?'}</p>
                    </div>
                </div>

                <div class="action-buttons">
                    ${this.hasResult ? `
                        <button class="action-btn primary" id="retry-btn">
                            <span class="btn-icon">🎲</span>
                            다른 거 추천받기
                        </button>
                        <button class="action-btn secondary" id="share-btn">
                            <span class="btn-icon">📤</span>
                            결과 공유
                        </button>
                    ` : `
                        <button class="action-btn primary large" id="recommend-btn">
                            <span class="btn-icon">🎲</span>
                            메뉴 추천받기
                        </button>
                    `}
                </div>
            </div>
        `;

        this.bindEvents();

        if (this.hasResult && this.currentFood) {
            this.loadFoodImage(this.currentFood);
        }
    }

    getStyles() {
        return `
            :host {
                display: block;
                width: 100%;
                animation: fadeIn 0.5s ease-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(16px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .recommender-container {
                background: #FFFFFF;
                border: 1px solid rgba(74, 68, 88, 0.08);
                border-radius: 24px;
                padding: 1.5rem;
                box-shadow: 0 4px 20px rgba(74, 68, 88, 0.08);
                text-align: center;
            }

            .header {
                margin-bottom: 1.5rem;
            }

            .mode-badge {
                display: inline-block;
                background: linear-gradient(135deg, #FFB5A7, #FFC8A2);
                color: #FFFFFF;
                padding: 6px 14px;
                border-radius: 9999px;
                font-weight: 600;
                font-size: 0.75rem;
                margin-bottom: 0.75rem;
            }

            .title {
                font-size: 1.25rem;
                color: #4A4458;
                margin: 0 0 0.25rem 0;
                font-weight: 700;
            }

            .subtitle {
                color: #7D7A8C;
                margin: 0;
                font-size: 0.875rem;
            }

            .food-display {
                background: linear-gradient(135deg, rgba(255, 218, 193, 0.2), rgba(255, 181, 167, 0.15));
                border: 1px solid rgba(255, 181, 167, 0.3);
                border-radius: 20px;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }

            .food-image-area {
                width: 160px;
                height: 160px;
                margin: 0 auto 1rem;
                border-radius: 50%;
                overflow: hidden;
                background: linear-gradient(135deg, #FFDAC1 0%, #FFB5A7 100%);
                box-shadow: 0 8px 24px rgba(255, 139, 123, 0.2);
                border: 3px solid rgba(255, 181, 167, 0.4);
            }

            .food-image-area img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .image-placeholder {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 4rem;
            }

            .food-info {
                text-align: center;
            }

            .food-category {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 9999px;
                background: #FFDAC1;
                color: #E07565;
                font-size: 0.7rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
                text-transform: uppercase;
                min-height: 1.5em;
            }

            .food-category:empty {
                display: none;
            }

            .food-name {
                font-size: 1.5rem;
                color: #4A4458;
                margin: 0.5rem 0;
                font-weight: 700;
            }

            .food-desc {
                color: #7D7A8C;
                font-size: 0.875rem;
                margin: 0;
                min-height: 1.4em;
            }

            .action-buttons {
                display: flex;
                gap: 0.75rem;
                justify-content: center;
                flex-wrap: wrap;
            }

            .action-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                padding: 0.875rem 1.5rem;
                border-radius: 16px;
                font-size: 0.875rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.25s ease;
                border: none;
            }

            .action-btn.primary {
                background: linear-gradient(135deg, #FFB5A7, #FFC8A2);
                color: #FFFFFF;
                box-shadow: 0 8px 24px rgba(255, 139, 123, 0.25);
            }

            .action-btn.primary.large {
                padding: 1rem 2.5rem;
                font-size: 1rem;
            }

            .action-btn.secondary {
                background: #FFFFFF;
                color: #4A4458;
                border: 1px solid rgba(74, 68, 88, 0.08);
            }

            .action-btn:hover {
                transform: translateY(-2px);
            }

            .action-btn.primary:hover {
                box-shadow: 0 12px 28px rgba(255, 139, 123, 0.35);
            }

            .action-btn:active {
                transform: translateY(0);
            }

            .action-btn:disabled {
                opacity: 0.6;
                cursor: wait;
                transform: none;
            }

            .btn-icon {
                font-size: 1.1rem;
            }

            /* Shuffle Animation */
            @keyframes shuffle {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }

            .shuffling .food-display {
                animation: shuffle 0.2s ease infinite;
            }

            .shuffling .image-placeholder {
                animation: shuffle 0.15s ease infinite;
            }

            /* Result Animation */
            @keyframes resultPop {
                0% { transform: scale(0.95); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }

            .result-show .food-display {
                animation: resultPop 0.4s ease-out;
            }

            /* Tablet */
            @media (max-width: 600px) {
                .recommender-container {
                    padding: 1rem;
                    border-radius: 16px;
                }

                .header {
                    margin-bottom: 1rem;
                }

                .mode-badge {
                    padding: 4px 10px;
                    font-size: 0.625rem;
                    margin-bottom: 0.5rem;
                }

                .title {
                    font-size: 1rem;
                }

                .subtitle {
                    font-size: 0.75rem;
                }

                .food-display {
                    padding: 1rem;
                    border-radius: 16px;
                    margin-bottom: 1rem;
                }

                .food-image-area {
                    width: 120px;
                    height: 120px;
                    margin-bottom: 0.75rem;
                }

                .image-placeholder {
                    font-size: 3rem;
                }

                .food-category {
                    padding: 3px 10px;
                    font-size: 0.625rem;
                    margin-bottom: 0.375rem;
                }

                .food-name {
                    font-size: 1.125rem;
                    margin: 0.375rem 0;
                }

                .food-desc {
                    font-size: 0.75rem;
                }

                .action-btn {
                    padding: 0.75rem 1.25rem;
                    font-size: 0.8rem;
                    border-radius: 14px;
                }

                .action-btn.primary.large {
                    padding: 0.875rem 2rem;
                    font-size: 0.875rem;
                }
            }

            /* Mobile */
            @media (max-width: 480px) {
                .recommender-container {
                    padding: 0.75rem;
                }

                .title {
                    font-size: 0.875rem;
                }

                .subtitle {
                    font-size: 0.625rem;
                }

                .food-display {
                    padding: 0.75rem;
                    border-radius: 14px;
                }

                .food-image-area {
                    width: 100px;
                    height: 100px;
                }

                .image-placeholder {
                    font-size: 2.5rem;
                }

                .food-name {
                    font-size: 1rem;
                }

                .food-desc {
                    font-size: 0.7rem;
                }

                .action-buttons {
                    gap: 0.5rem;
                }

                .action-btn {
                    padding: 0.625rem 1rem;
                    font-size: 0.75rem;
                    border-radius: 12px;
                    gap: 0.375rem;
                }

                .action-btn.primary.large {
                    padding: 0.75rem 1.5rem;
                    font-size: 0.8rem;
                }

                .btn-icon {
                    font-size: 0.9rem;
                }
            }
        `;
    }

    bindEvents() {
        const recommendBtn = this.shadowRoot.getElementById('recommend-btn');
        const retryBtn = this.shadowRoot.getElementById('retry-btn');
        const shareBtn = this.shadowRoot.getElementById('share-btn');

        if (recommendBtn) {
            recommendBtn.addEventListener('click', () => this.recommendFood());
        }

        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.recommendFood());
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareResult());
        }
    }

    recommendFood() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const container = this.shadowRoot.querySelector('.recommender-container');
        const btn = this.shadowRoot.getElementById('recommend-btn') || this.shadowRoot.getElementById('retry-btn');
        const nameEl = this.shadowRoot.getElementById('food-name');
        const categoryEl = this.shadowRoot.getElementById('category');
        const descEl = this.shadowRoot.getElementById('food-desc');
        const imgArea = this.shadowRoot.getElementById('image-area');

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="btn-icon">🎲</span> 메뉴를 고르는 중...';
        }

        container.classList.add('shuffling');
        container.classList.remove('result-show');

        // 셔플 효과
        let counter = 0;
        const interval = setInterval(() => {
            const randomFood = getRandomFood();
            nameEl.textContent = randomFood.name;
            categoryEl.textContent = randomFood.category;
            descEl.textContent = randomFood.desc;
            imgArea.innerHTML = `<div class="image-placeholder">${randomFood.emoji}</div>`;

            counter++;

            if (counter > 12) {
                clearInterval(interval);
                this.finalizeRecommendation(container);
            }
        }, 80);
    }

    finalizeRecommendation(container) {
        // 최종 음식 선택
        this.currentFood = getRandomFood();
        this.hasResult = true;

        container.classList.remove('shuffling');
        container.classList.add('result-show');

        // 결과로 다시 렌더링
        this.render();
        this.isAnimating = false;

        // 결과 이벤트 발행은 공유 버튼 클릭 시에만
    }

    loadFoodImage(food) {
        const container = this.shadowRoot.getElementById('image-area');
        if (!container || !food) return;

        const img = document.createElement('img');
        img.alt = food.name;

        img.onload = () => {
            container.innerHTML = '';
            container.appendChild(img);
        };

        img.onerror = () => {
            container.innerHTML = `<div class="image-placeholder">${food.emoji}</div>`;
        };

        img.src = food.image;
    }

    shareResult() {
        if (!this.currentFood) return;

        this.dispatchEvent(new CustomEvent('food-result', {
            detail: { food: this.currentFood, mode: 'random' },
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('food-recommender', FoodRecommender);

export default FoodRecommender;
