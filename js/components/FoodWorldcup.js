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
    }

    connectedCallback() {
        this.initGame();
        this.render();
    }

    initGame() {
        // 16개 음식 랜덤 선택
        this.candidates = shuffleArray([...foods]).slice(0, 16);
        this.currentRound = [...this.candidates];
        this.nextRound = [];
        this.matchIndex = 0;
        this.roundName = '16강';
        this.totalMatches = 8;
        this.currentMatch = 1;
    }

    render() {
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

    getStyles() {
        return `
            :host {
                display: block;
                width: 100%;
                animation: fadeIn 0.5s ease-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .worldcup-container {
                background: var(--glass-bg, rgba(255, 255, 255, 0.7));
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.5));
                border-radius: var(--radius, 24px);
                padding: 2rem;
                box-shadow: var(--glass-shadow, 0 8px 32px 0 rgba(31, 38, 135, 0.1));
            }

            .round-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }

            .round-badge {
                background: linear-gradient(135deg, #ff6b6b, #ffa502);
                color: white;
                padding: 0.5rem 1.2rem;
                border-radius: 50px;
                font-weight: 700;
                font-size: 1rem;
            }

            .match-count {
                color: var(--text-muted, #636e72);
                font-weight: 600;
            }

            .progress-bar {
                width: 100%;
                height: 8px;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 1.5rem;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(135deg, #ff6b6b, #ffa502);
                border-radius: 4px;
                transition: width 0.5s ease;
            }

            .vs-title {
                text-align: center;
                font-size: 1.5rem;
                color: var(--text-main, #2d3436);
                margin-bottom: 2rem;
                font-weight: 700;
            }

            .battle-arena {
                display: grid;
                grid-template-columns: 1fr auto 1fr;
                gap: 1rem;
                align-items: center;
            }

            @media (max-width: 700px) {
                .battle-arena {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                .vs-badge {
                    margin: 0.5rem 0;
                }
            }

            .food-card {
                background: var(--glass-bg, rgba(255, 255, 255, 0.5));
                border: 2px solid transparent;
                border-radius: 20px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            }

            .food-card:hover {
                transform: translateY(-5px) scale(1.02);
                border-color: #ff6b6b;
                box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
            }

            .food-card:active {
                transform: scale(0.98);
            }

            .food-card.selected {
                border-color: #ff6b6b;
                animation: pulse 0.5s ease;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            .food-image {
                width: 100%;
                height: 200px;
                overflow: hidden;
                position: relative;
            }

            .food-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }

            .food-card:hover .food-image img {
                transform: scale(1.1);
            }

            .image-placeholder {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
                font-size: 4rem;
            }

            .food-info {
                padding: 1.5rem;
                text-align: center;
            }

            .food-category {
                display: inline-block;
                padding: 0.3rem 0.8rem;
                border-radius: 50px;
                background: rgba(255, 107, 107, 0.1);
                color: #ff6b6b;
                font-size: 0.8rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
                text-transform: uppercase;
            }

            .food-name {
                font-size: 1.8rem;
                color: var(--text-main, #2d3436);
                margin: 0.5rem 0;
                font-weight: 800;
            }

            .food-desc {
                color: var(--text-muted, #636e72);
                font-size: 0.95rem;
                margin: 0;
            }

            .vs-badge {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 900;
                font-size: 1.2rem;
                box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
                flex-shrink: 0;
            }

            /* 우승 화면 */
            .winner-container {
                text-align: center;
                animation: fadeIn 0.8s ease-out;
            }

            .winner-badge {
                font-size: 3rem;
                margin-bottom: 1rem;
            }

            .winner-title {
                font-size: 1.5rem;
                color: var(--text-muted, #636e72);
                margin-bottom: 0.5rem;
            }

            .winner-card {
                background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 165, 2, 0.1));
                border: 2px solid #ff6b6b;
                border-radius: 24px;
                padding: 2rem;
                margin: 1.5rem 0;
            }

            .winner-image {
                width: 100%;
                max-width: 400px;
                height: 300px;
                margin: 0 auto 1.5rem;
                border-radius: 16px;
                overflow: hidden;
            }

            .winner-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .winner-name {
                font-size: 2.5rem;
                color: var(--text-main, #2d3436);
                font-weight: 800;
                margin: 0.5rem 0;
            }

            .winner-desc {
                color: var(--text-muted, #636e72);
                font-size: 1.1rem;
            }

            .action-buttons {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 2rem;
                flex-wrap: wrap;
            }

            .action-btn {
                padding: 1rem 2rem;
                border-radius: 50px;
                font-size: 1rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                border: none;
            }

            .action-btn.primary {
                background: linear-gradient(135deg, #ff6b6b, #ffa502);
                color: white;
                box-shadow: 0 5px 20px rgba(255, 107, 107, 0.3);
            }

            .action-btn.secondary {
                background: var(--glass-bg, rgba(255, 255, 255, 0.7));
                color: var(--text-main, #2d3436);
                border: 2px solid var(--glass-border, rgba(255, 255, 255, 0.5));
            }

            .action-btn:hover {
                transform: translateY(-2px);
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
            this.initGame();
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
