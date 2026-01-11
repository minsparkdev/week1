/**
 * FoodTarot Component
 * - Food tarot card game
 * - Select 1 of 5 cards -> Food fortune
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
        // Randomly select 5 foods
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
                    <h2>Today's Food Fortune</h2>
                    <p>Choose the card that calls to you</p>
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
                from { opacity: 0; transform: translateY(16px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .tarot-container {
                background: #FFFFFF;
                border: 1px solid rgba(74, 68, 88, 0.08);
                border-radius: 24px;
                padding: 1.5rem;
                box-shadow: 0 4px 20px rgba(74, 68, 88, 0.08);
                text-align: center;
            }

            .tarot-header h2 {
                font-size: 1.25rem;
                color: #4A4458;
                margin: 0 0 0.25rem 0;
                font-weight: 700;
            }

            .tarot-header p {
                color: #7D7A8C;
                margin: 0 0 1.5rem 0;
                font-size: 0.875rem;
            }

            .cards-row {
                display: flex;
                justify-content: center;
                gap: 0.75rem;
                flex-wrap: wrap;
                margin-bottom: 1.5rem;
                perspective: 1000px;
            }

            .tarot-card {
                width: 80px;
                height: 120px;
                cursor: pointer;
                transition: transform 0.3s ease;
            }

            .tarot-card:hover:not(.flipped) {
                transform: translateY(-8px);
            }

            .card-inner {
                position: relative;
                width: 100%;
                height: 100%;
                transform-style: preserve-3d;
                transition: transform 0.5s ease;
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
                box-shadow: 0 4px 12px rgba(74, 68, 88, 0.12);
            }

            .card-front {
                background: linear-gradient(135deg, #FFB5A7, #FFC8A2);
            }

            .card-pattern {
                width: 75%;
                height: 75%;
                border: 2px solid rgba(255, 255, 255, 0.4);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .card-symbol {
                font-size: 2rem;
            }

            .card-back {
                background: linear-gradient(135deg, #FFDAC1, #FFB5A7);
                transform: rotateY(180deg);
                overflow: hidden;
            }

            .card-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 12px;
                transform: scale(0.88);
            }

            .tarot-card.selected {
                transform: scale(1.08);
            }

            .tarot-card.not-selected {
                opacity: 0.4;
                pointer-events: none;
            }

            /* Result Area */
            .result-area {
                margin-top: 1rem;
            }

            .result-card {
                background: linear-gradient(135deg, rgba(255, 218, 193, 0.2), rgba(255, 181, 167, 0.15));
                border: 1px solid rgba(255, 181, 167, 0.3);
                border-radius: 20px;
                padding: 1.5rem;
                animation: fadeIn 0.5s ease-out;
            }

            .result-image-wrapper {
                width: 140px;
                height: 140px;
                margin: 0 auto 1rem;
                border-radius: 50%;
                overflow: hidden;
                box-shadow: 0 8px 24px rgba(255, 139, 123, 0.2);
                border: 3px solid rgba(255, 181, 167, 0.4);
            }

            .result-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .result-food {
                margin-bottom: 0.75rem;
            }

            .result-name {
                font-size: 1.25rem;
                font-weight: 700;
                color: #4A4458;
            }

            .result-category {
                display: inline-block;
                padding: 4px 12px;
                background: #FFDAC1;
                color: #E07565;
                border-radius: 9999px;
                font-size: 0.7rem;
                font-weight: 600;
                margin-bottom: 0.75rem;
                text-transform: uppercase;
            }

            .result-tarot {
                font-size: 0.9rem;
                color: #4A4458;
                line-height: 1.5;
                margin-bottom: 1rem;
                font-style: italic;
            }

            .result-desc {
                color: #7D7A8C;
                font-size: 0.8rem;
            }

            .action-buttons {
                display: flex;
                gap: 0.75rem;
                justify-content: center;
                margin-top: 1.25rem;
                flex-wrap: wrap;
            }

            .action-btn {
                padding: 0.75rem 1.25rem;
                border-radius: 16px;
                font-size: 0.8rem;
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

            /* Tablet */
            @media (max-width: 600px) {
                .tarot-container {
                    padding: 1rem;
                    border-radius: 16px;
                }

                .tarot-header h2 {
                    font-size: 1rem;
                }

                .tarot-header p {
                    font-size: 0.75rem;
                    margin-bottom: 1rem;
                }

                .cards-row {
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }

                .tarot-card {
                    width: 56px;
                    height: 84px;
                }

                .card-symbol {
                    font-size: 1.25rem;
                }

                .card-front, .card-back {
                    border-radius: 8px;
                }

                .card-pattern {
                    border-radius: 6px;
                }
            }

            /* Mobile */
            @media (max-width: 480px) {
                .tarot-container {
                    padding: 0.75rem;
                }

                .tarot-header h2 {
                    font-size: 0.875rem;
                }

                .tarot-header p {
                    font-size: 0.625rem;
                    margin-bottom: 0.75rem;
                }

                .cards-row {
                    gap: 0.375rem;
                }

                .tarot-card {
                    width: 48px;
                    height: 72px;
                }

                .card-symbol {
                    font-size: 1rem;
                }

                .result-area {
                    margin-top: 0.75rem;
                }

                .result-card {
                    padding: 1rem;
                    border-radius: 16px;
                }

                .result-image-wrapper {
                    width: 100px;
                    height: 100px;
                    margin-bottom: 0.75rem;
                }

                .result-food {
                    margin-bottom: 0.5rem;
                }

                .result-name {
                    font-size: 1rem;
                }

                .result-category {
                    padding: 3px 10px;
                    font-size: 0.625rem;
                    margin-bottom: 0.5rem;
                }

                .result-tarot {
                    font-size: 0.75rem;
                    margin-bottom: 0.75rem;
                }

                .result-desc {
                    font-size: 0.7rem;
                }

                .action-buttons {
                    gap: 0.5rem;
                    margin-top: 0.75rem;
                }

                .action-btn {
                    padding: 0.625rem 1rem;
                    font-size: 0.7rem;
                    border-radius: 12px;
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
                    <button class="action-btn primary" id="share-btn">📤 Share Result</button>
                    <button class="action-btn secondary" id="retry-btn">🔄 Draw Again</button>
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
