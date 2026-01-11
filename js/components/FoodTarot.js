/**
 * FoodTarot 컴포넌트
 * - 음식 타로 카드 게임
 * - 5장 중 1장 선택 → 음식 운세
 */

import { foods, shuffleArray } from '../data/foods.js';

class FoodTarot extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.cards = [];
        this.selectedCard = null;
        this.revealed = false;
    }

    connectedCallback() {
        this.initGame();
        this.render();
    }

    initGame() {
        // 5개 음식 랜덤 선택
        this.cards = shuffleArray([...foods]).slice(0, 5);
        this.selectedCard = null;
        this.revealed = false;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                ${this.getStyles()}
            </style>
            <div class="tarot-container">
                <div class="tarot-header">
                    <h2>오늘의 음식 운세</h2>
                    <p>마음이 끌리는 카드를 선택하세요</p>
                </div>

                <div class="cards-row">
                    ${this.cards.map((_, idx) => `
                        <div class="tarot-card" data-index="${idx}">
                            <div class="card-inner">
                                <div class="card-front">
                                    <div class="card-pattern">
                                        <span class="card-symbol">🔮</span>
                                    </div>
                                </div>
                                <div class="card-back">
                                    <img src="${this.cards[idx].image}" alt="${this.cards[idx].name}" class="card-image">
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="result-area" id="result-area"></div>
            </div>
        `;

        this.bindEvents();
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

            .tarot-container {
                background: var(--glass-bg, rgba(255, 255, 255, 0.7));
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.5));
                border-radius: var(--radius, 24px);
                padding: 2rem;
                box-shadow: var(--glass-shadow, 0 8px 32px 0 rgba(31, 38, 135, 0.1));
                text-align: center;
            }

            .tarot-header h2 {
                font-size: 1.8rem;
                color: var(--text-main, #2d3436);
                margin: 0 0 0.5rem 0;
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .tarot-header p {
                color: var(--text-muted, #636e72);
                margin: 0 0 2rem 0;
            }

            .cards-row {
                display: flex;
                justify-content: center;
                gap: 1rem;
                flex-wrap: wrap;
                margin-bottom: 2rem;
                perspective: 1000px;
            }

            .tarot-card {
                width: 100px;
                height: 150px;
                cursor: pointer;
                transition: transform 0.3s ease;
            }

            .tarot-card:hover:not(.flipped) {
                transform: translateY(-10px);
            }

            .card-inner {
                position: relative;
                width: 100%;
                height: 100%;
                transform-style: preserve-3d;
                transition: transform 0.6s ease;
            }

            .tarot-card.flipped .card-inner {
                transform: rotateY(180deg);
            }

            .card-front, .card-back {
                position: absolute;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            }

            .card-front {
                background: linear-gradient(135deg, #667eea, #764ba2);
            }

            .card-pattern {
                width: 80%;
                height: 80%;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .card-symbol {
                font-size: 2.5rem;
            }

            .card-back {
                background: linear-gradient(135deg, #f6d365, #fda085);
                transform: rotateY(180deg);
                overflow: hidden;
            }

            .card-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 12px;
                transform: scale(0.85);
            }

            .tarot-card.selected {
                transform: scale(1.1);
            }

            .tarot-card.not-selected {
                opacity: 0.5;
                pointer-events: none;
            }

            /* 결과 영역 */
            .result-area {
                margin-top: 1rem;
            }

            .result-card {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
                border: 2px solid rgba(102, 126, 234, 0.3);
                border-radius: 20px;
                padding: 2rem;
                animation: fadeIn 0.5s ease-out;
            }

            .result-image-wrapper {
                width: 200px;
                height: 200px;
                margin: 0 auto 1.5rem;
                border-radius: 50%;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
                border: 4px solid rgba(102, 126, 234, 0.3);
            }

            .result-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .result-food {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                margin-bottom: 1rem;
            }

            .result-name {
                font-size: 2rem;
                font-weight: 800;
                color: var(--text-main, #2d3436);
            }

            .result-category {
                display: inline-block;
                padding: 0.3rem 1rem;
                background: rgba(255, 107, 107, 0.1);
                color: #ff6b6b;
                border-radius: 50px;
                font-size: 0.9rem;
                font-weight: 700;
                margin-bottom: 1rem;
            }

            .result-tarot {
                font-size: 1.2rem;
                color: var(--text-main, #2d3436);
                line-height: 1.6;
                margin-bottom: 1.5rem;
                font-style: italic;
            }

            .result-desc {
                color: var(--text-muted, #636e72);
                font-size: 1rem;
            }

            .action-buttons {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 1.5rem;
                flex-wrap: wrap;
            }

            .action-btn {
                padding: 0.8rem 1.5rem;
                border-radius: 50px;
                font-size: 0.95rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                border: none;
            }

            .action-btn.primary {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
            }

            .action-btn.secondary {
                background: var(--glass-bg, rgba(255, 255, 255, 0.7));
                color: var(--text-main, #2d3436);
                border: 2px solid var(--glass-border);
            }

            .action-btn:hover {
                transform: translateY(-2px);
            }

            @media (max-width: 600px) {
                .tarot-card {
                    width: 60px;
                    height: 90px;
                }
                .card-symbol {
                    font-size: 1.5rem;
                }
                .card-emoji {
                    font-size: 2rem;
                }
            }
        `;
    }

    bindEvents() {
        const cards = this.shadowRoot.querySelectorAll('.tarot-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                if (this.revealed) return;
                const index = parseInt(card.dataset.index);
                this.selectCard(index);
            });
        });
    }

    selectCard(index) {
        this.selectedCard = this.cards[index];
        this.revealed = true;

        const cards = this.shadowRoot.querySelectorAll('.tarot-card');
        cards.forEach((card, idx) => {
            if (idx === index) {
                card.classList.add('flipped', 'selected');
            } else {
                card.classList.add('not-selected');
            }
        });

        setTimeout(() => {
            this.showResult();
        }, 800);
    }

    showResult() {
        const resultArea = this.shadowRoot.getElementById('result-area');
        const food = this.selectedCard;

        resultArea.innerHTML = `
            <div class="result-card">
                <div class="result-image-wrapper">
                    <img src="${food.image}" alt="${food.name}" class="result-image">
                </div>
                <div class="result-food">
                    <span class="result-name">${food.name}</span>
                </div>
                <span class="result-category">${food.category}</span>
                <p class="result-tarot">"${food.tarot}"</p>
                <p class="result-desc">${food.desc}</p>

                <div class="action-buttons">
                    <button class="action-btn primary" id="share-btn">📤 결과 공유</button>
                    <button class="action-btn secondary" id="retry-btn">🔄 다시 뽑기</button>
                </div>
            </div>
        `;

        resultArea.querySelector('#retry-btn').addEventListener('click', () => {
            this.initGame();
            this.render();
        });

        resultArea.querySelector('#share-btn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('food-result', {
                detail: { food, mode: 'tarot' },
                bubbles: true,
                composed: true
            }));
        });
    }
}

customElements.define('food-tarot', FoodTarot);

export default FoodTarot;
