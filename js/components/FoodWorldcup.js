/**
 * FoodWorldcup 컴포넌트
 * - 16강 이상형 월드컵
 * - 토너먼트 방식 음식 대결
 */

import { foods, shuffleArray } from '../data/foods.js';

class FoodWorldcup extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // 게임 상태
        this.candidates = [];
        this.currentRound = [];
        this.nextRound = [];
        this.matchIndex = 0;
        this.roundName = '16강';
        this.totalMatches = 0;
        this.currentMatch = 0;
        this.gamePhase = 'select'; // 'select' | 'playing' | 'result'
        this.selectedRoundSize = null;
    }

    connectedCallback() {
        this.render();
    }

    initGame(roundSize = 16) {
        this.selectedRoundSize = roundSize;
        // 선택한 라운드 수만큼 음식 랜덤 선택
        this.candidates = shuffleArray([...foods]).slice(0, roundSize);
        this.currentRound = [...this.candidates];
        this.nextRound = [];
        this.matchIndex = 0;

        // 라운드 설정 매핑
        const roundConfig = {
            16: { name: '16강', matches: 8 },
            8: { name: '8강', matches: 4 },
            4: { name: '4강', matches: 2 }
        };

        const config = roundConfig[roundSize];
        this.roundName = config.name;
        this.totalMatches = config.matches;
        this.currentMatch = 1;
        this.gamePhase = 'playing';
    }

    render() {
        // 라운드 선택 화면
        if (this.gamePhase === 'select') {
            this.renderRoundSelector();
            return;
        }

        const [foodA, foodB] = this.getCurrentMatch();

        this.shadowRoot.innerHTML = `
            <style>
                ${this.getStyles()}
            </style>
            <div class="worldcup-container">
                <div class="round-info">
                    <span class="round-badge">${this.roundName}</span>
                    <span class="match-count">${this.currentMatch} / ${this.totalMatches}</span>
                </div>

                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(this.currentMatch / this.totalMatches) * 100}%"></div>
                </div>

                <h2 class="vs-title">어떤 음식이 더 끌리나요?</h2>

                <div class="battle-arena">
                    <div class="food-card" data-id="${foodA.id}">
                        <div class="food-image" id="img-${foodA.id}">
                            <div class="image-placeholder">${foodA.emoji}</div>
                        </div>
                        <div class="food-info">
                            <span class="food-category">${foodA.category}</span>
                            <h3 class="food-name">${foodA.name}</h3>
                            <p class="food-desc">${foodA.desc}</p>
                        </div>
                    </div>

                    <div class="vs-badge">VS</div>

                    <div class="food-card" data-id="${foodB.id}">
                        <div class="food-image" id="img-${foodB.id}">
                            <div class="image-placeholder">${foodB.emoji}</div>
                        </div>
                        <div class="food-info">
                            <span class="food-category">${foodB.category}</span>
                            <h3 class="food-name">${foodB.name}</h3>
                            <p class="food-desc">${foodB.desc}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
        this.loadImages(foodA, foodB);
    }

    getCurrentMatch() {
        const idx = this.matchIndex * 2;
        return [this.currentRound[idx], this.currentRound[idx + 1]];
    }

    renderRoundSelector() {
        this.shadowRoot.innerHTML = `
            <style>
                ${this.getStyles()}
            </style>
            <div class="worldcup-container round-selector">
                <div class="selector-header">
                    <span class="selector-icon">🏆</span>
                    <h2 class="selector-title">Food World Cup</h2>
                </div>
                <div class="round-options">
                    <button class="round-btn" data-round="16">
                        <span class="round-num">16</span>
                        <span class="round-matches">8 🎮</span>
                    </button>
                    <button class="round-btn" data-round="8">
                        <span class="round-num">8</span>
                        <span class="round-matches">4 🎮</span>
                    </button>
                    <button class="round-btn" data-round="4">
                        <span class="round-num">4</span>
                        <span class="round-matches">2 🎮</span>
                    </button>
                </div>
            </div>
        `;

        this.bindRoundSelectorEvents();
    }

    bindRoundSelectorEvents() {
        this.shadowRoot.querySelectorAll('.round-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const roundSize = parseInt(btn.dataset.round);
                this.initGame(roundSize);
                this.render();
            });
        });
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

            .worldcup-container {
                background: #FFFFFF;
                border: 1px solid rgba(74, 68, 88, 0.08);
                border-radius: 24px;
                padding: 1.5rem;
                box-shadow: 0 4px 20px rgba(74, 68, 88, 0.08);
            }

            .round-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.75rem;
            }

            .round-badge {
                background: linear-gradient(135deg, #FFB5A7, #FFC8A2);
                color: #FFFFFF;
                padding: 6px 14px;
                border-radius: 9999px;
                font-weight: 600;
                font-size: 0.75rem;
            }

            .match-count {
                color: #7D7A8C;
                font-weight: 500;
                font-size: 0.875rem;
            }

            .progress-bar {
                width: 100%;
                height: 6px;
                background: rgba(74, 68, 88, 0.08);
                border-radius: 3px;
                overflow: hidden;
                margin-bottom: 1.25rem;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(135deg, #FFB5A7, #FFC8A2);
                border-radius: 3px;
                transition: width 0.4s ease;
            }

            .vs-title {
                text-align: center;
                font-size: 1.125rem;
                color: #4A4458;
                margin-bottom: 1.25rem;
                font-weight: 600;
            }

            .battle-arena {
                display: grid;
                grid-template-columns: 1fr auto 1fr;
                gap: 0.75rem;
                align-items: center;
            }

            /* Tablet */
            @media (max-width: 600px) {
                .worldcup-container {
                    padding: 1rem;
                    border-radius: 16px;
                }

                .round-badge {
                    padding: 4px 10px;
                    font-size: 0.625rem;
                }

                .match-count {
                    font-size: 0.75rem;
                }

                .progress-bar {
                    margin-bottom: 0.75rem;
                }

                .vs-title {
                    font-size: 0.875rem;
                    margin-bottom: 0.75rem;
                }

                .battle-arena {
                    grid-template-columns: 1fr 32px 1fr;
                    gap: 0.375rem;
                    align-items: center;
                    justify-items: center;
                }

                .food-image {
                    height: 100px;
                }

                .image-placeholder {
                    font-size: 2rem;
                }

                .food-info {
                    padding: 0.625rem;
                }

                .food-category {
                    padding: 2px 6px;
                    font-size: 0.5rem;
                    margin-bottom: 0.25rem;
                }

                .food-name {
                    font-size: 0.875rem;
                    margin: 0.125rem 0;
                }

                .food-desc {
                    font-size: 0.625rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .vs-badge {
                    width: 32px;
                    height: 32px;
                    font-size: 0.625rem;
                    flex-shrink: 0;
                    z-index: 1;
                }
            }

            /* Mobile - Keep side by side but more compact */
            @media (max-width: 480px) {
                .worldcup-container {
                    padding: 0.75rem;
                }

                .round-info {
                    margin-bottom: 0.5rem;
                }

                .vs-title {
                    font-size: 0.8rem;
                    margin-bottom: 0.5rem;
                }

                .battle-arena {
                    grid-template-columns: 1fr 26px 1fr;
                    gap: 0.25rem;
                }

                .food-card {
                    border-radius: 12px;
                }

                .food-image {
                    height: 90px;
                }

                .image-placeholder {
                    font-size: 1.75rem;
                }

                .food-info {
                    padding: 0.5rem;
                }

                .food-category {
                    display: none;
                }

                .food-name {
                    font-size: 0.8rem;
                }

                .food-desc {
                    display: none;
                }

                .vs-badge {
                    width: 26px;
                    height: 26px;
                    font-size: 0.5rem;
                }
            }

            /* Very small mobile */
            @media (max-width: 360px) {
                .battle-arena {
                    grid-template-columns: 1fr 22px 1fr;
                    gap: 0.125rem;
                }

                .food-image {
                    height: 75px;
                }

                .image-placeholder {
                    font-size: 1.5rem;
                }

                .food-info {
                    padding: 0.375rem;
                }

                .food-name {
                    font-size: 0.7rem;
                }

                .vs-badge {
                    width: 22px;
                    height: 22px;
                    font-size: 0.45rem;
                }
            }

            .food-card {
                background: #FFFFFF;
                border: 2px solid rgba(74, 68, 88, 0.08);
                border-radius: 20px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.25s ease;
                box-shadow: 0 2px 8px rgba(74, 68, 88, 0.06);
            }

            .food-card:hover {
                transform: translateY(-4px);
                border-color: #FFB5A7;
                box-shadow: 0 8px 24px rgba(255, 139, 123, 0.2);
            }

            .food-card:active {
                transform: scale(0.98);
            }

            .food-card.selected {
                border-color: #FF8B7B;
                animation: pulse 0.4s ease;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }

            .food-image {
                width: 100%;
                height: 140px;
                overflow: hidden;
                background: linear-gradient(135deg, #FFDAC1 0%, #FFB5A7 100%);
            }

            .food-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }

            .food-card:hover .food-image img {
                transform: scale(1.05);
            }

            .image-placeholder {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
            }

            .food-info {
                padding: 1rem;
                text-align: center;
            }

            .food-category {
                display: inline-block;
                padding: 4px 10px;
                border-radius: 9999px;
                background: #FFDAC1;
                color: #E07565;
                font-size: 0.625rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
                text-transform: uppercase;
            }

            .food-name {
                font-size: 1.125rem;
                color: #4A4458;
                margin: 0.25rem 0;
                font-weight: 700;
            }

            .food-desc {
                color: #7D7A8C;
                font-size: 0.75rem;
                margin: 0;
            }

            .vs-badge {
                background: #D4C1EC;
                color: #FFFFFF;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 0.875rem;
                flex-shrink: 0;
            }

            /* Winner Screen */
            .winner-container {
                text-align: center;
            }

            .winner-badge {
                font-size: 2.5rem;
                margin-bottom: 0.75rem;
            }

            .winner-title {
                font-size: 1rem;
                color: #7D7A8C;
                margin-bottom: 0.25rem;
            }

            .winner-card {
                background: linear-gradient(135deg, rgba(255, 218, 193, 0.3), rgba(255, 181, 167, 0.2));
                border: 2px solid #FFB5A7;
                border-radius: 20px;
                padding: 1.5rem;
                margin: 1rem 0;
            }

            .winner-image {
                width: 100%;
                max-width: 280px;
                height: 200px;
                margin: 0 auto 1rem;
                border-radius: 16px;
                overflow: hidden;
            }

            .winner-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .winner-name {
                font-size: 1.5rem;
                color: #4A4458;
                font-weight: 700;
                margin: 0.5rem 0;
            }

            .winner-desc {
                color: #7D7A8C;
                font-size: 0.875rem;
            }

            .action-buttons {
                display: flex;
                gap: 0.75rem;
                justify-content: center;
                margin-top: 1.25rem;
                flex-wrap: wrap;
            }

            .action-btn {
                padding: 0.75rem 1.5rem;
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

            .action-btn.secondary {
                background: #FFFFFF;
                color: #4A4458;
                border: 1px solid rgba(74, 68, 88, 0.08);
            }

            .action-btn:hover {
                transform: translateY(-2px);
            }

            /* Winner screen mobile */
            @media (max-width: 480px) {
                .winner-badge {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                }

                .winner-title {
                    font-size: 0.875rem;
                }

                .winner-card {
                    padding: 1rem;
                    margin: 0.75rem 0;
                    border-radius: 16px;
                }

                .winner-image {
                    max-width: 200px;
                    height: 140px;
                    border-radius: 12px;
                    margin-bottom: 0.75rem;
                }

                .winner-name {
                    font-size: 1.125rem;
                }

                .winner-desc {
                    font-size: 0.75rem;
                }

                .action-buttons {
                    gap: 0.5rem;
                    margin-top: 0.75rem;
                }

                .action-btn {
                    padding: 0.625rem 1rem;
                    font-size: 0.75rem;
                    border-radius: 12px;
                }
            }

            /* Round Selector Styles */
            .round-selector {
                text-align: center;
                padding: 2rem 1.5rem;
            }

            .selector-header {
                margin-bottom: 2rem;
            }

            .selector-icon {
                font-size: 3rem;
                display: block;
                margin-bottom: 0.75rem;
            }

            .selector-title {
                font-size: 1.25rem;
                color: #4A4458;
                font-weight: 700;
                margin: 0;
            }

            .round-options {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }

            .round-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100px;
                height: 100px;
                background: #FFFFFF;
                border: 2px solid rgba(74, 68, 88, 0.12);
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.25s ease;
                box-shadow: 0 2px 8px rgba(74, 68, 88, 0.06);
            }

            .round-btn:hover {
                transform: translateY(-4px);
                border-color: #FFB5A7;
                box-shadow: 0 8px 24px rgba(255, 139, 123, 0.2);
            }

            .round-btn:active {
                transform: scale(0.98);
            }

            .round-num {
                font-size: 2rem;
                font-weight: 800;
                color: #4A4458;
                line-height: 1;
            }

            .round-matches {
                font-size: 0.875rem;
                color: #7D7A8C;
                margin-top: 0.25rem;
            }

            @media (max-width: 480px) {
                .round-selector {
                    padding: 1.5rem 1rem;
                }

                .selector-icon {
                    font-size: 2.5rem;
                }

                .selector-title {
                    font-size: 1rem;
                }

                .round-options {
                    gap: 0.75rem;
                }

                .round-btn {
                    width: 85px;
                    height: 85px;
                    border-radius: 16px;
                }

                .round-num {
                    font-size: 1.5rem;
                }

                .round-matches {
                    font-size: 0.75rem;
                }
            }
        `;
    }

    bindEvents() {
        const cards = this.shadowRoot.querySelectorAll('.food-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const foodId = parseInt(card.dataset.id);
                this.selectFood(foodId);
            });
        });
    }

    loadImages(foodA, foodB) {
        [foodA, foodB].forEach(food => {
            const container = this.shadowRoot.getElementById(`img-${food.id}`);
            if (!container) return;

            const img = document.createElement('img');
            img.alt = food.name;

            const timeoutId = setTimeout(() => {
                // 타임아웃 시 이모지 유지
            }, 5000);

            img.onload = () => {
                clearTimeout(timeoutId);
                container.innerHTML = '';
                container.appendChild(img);
            };

            img.onerror = () => {
                clearTimeout(timeoutId);
                // 에러 시 이모지 유지
            };

            img.src = food.image;
        });
    }

    selectFood(foodId) {
        const winner = this.currentRound.find(f => f.id === foodId);
        if (!winner) return;

        // 선택 애니메이션
        const card = this.shadowRoot.querySelector(`[data-id="${foodId}"]`);
        if (card) {
            card.classList.add('selected');
        }

        // 다음 라운드에 추가
        this.nextRound.push(winner);
        this.matchIndex++;
        this.currentMatch++;

        // 현재 라운드 종료 체크
        if (this.matchIndex >= this.currentRound.length / 2) {
            setTimeout(() => this.advanceRound(), 500);
        } else {
            setTimeout(() => this.render(), 500);
        }
    }

    advanceRound() {
        if (this.nextRound.length === 1) {
            // 우승자 결정
            this.showWinner(this.nextRound[0]);
            return;
        }

        // 다음 라운드 설정
        this.currentRound = [...this.nextRound];
        this.nextRound = [];
        this.matchIndex = 0;

        // 라운드 이름 업데이트
        switch (this.currentRound.length) {
            case 8: this.roundName = '8강'; this.totalMatches = 4; break;
            case 4: this.roundName = '4강'; this.totalMatches = 2; break;
            case 2: this.roundName = '결승'; this.totalMatches = 1; break;
        }
        this.currentMatch = 1;

        this.render();
    }

    showWinner(winner) {
        this.shadowRoot.innerHTML = `
            <style>
                ${this.getStyles()}
            </style>
            <div class="worldcup-container winner-container">
                <div class="winner-badge">🏆</div>
                <p class="winner-title">오늘의 우승 메뉴는...</p>

                <div class="winner-card">
                    <div class="winner-image" id="winner-image">
                        <div class="image-placeholder" style="font-size: 5rem;">${winner.emoji}</div>
                    </div>
                    <span class="food-category">${winner.category}</span>
                    <h2 class="winner-name">${winner.name}</h2>
                    <p class="winner-desc">${winner.desc}</p>
                </div>

                <div class="action-buttons">
                    <button class="action-btn primary" id="share-btn">📤 결과 공유하기</button>
                    <button class="action-btn secondary" id="retry-btn">🔄 다시 하기</button>
                </div>
            </div>
        `;

        // 우승 이미지 로드
        this.loadWinnerImage(winner);

        // 버튼 이벤트
        this.shadowRoot.getElementById('retry-btn').addEventListener('click', () => {
            this.gamePhase = 'select';
            this.render();
        });

        this.shadowRoot.getElementById('share-btn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('food-result', {
                detail: { food: winner, mode: 'worldcup' },
                bubbles: true,
                composed: true
            }));
        });
    }

    loadWinnerImage(winner) {
        const container = this.shadowRoot.getElementById('winner-image');
        if (!container) return;

        const img = document.createElement('img');
        img.alt = winner.name;

        img.onload = () => {
            container.innerHTML = '';
            container.appendChild(img);
        };

        img.src = winner.image;
    }
}

customElements.define('food-worldcup', FoodWorldcup);

export default FoodWorldcup;
