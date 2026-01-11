/**
 * FoodBalance 컴포넌트
 * - 음식 밸런스 게임
 * - 극한의 2지선다
 */

import { balanceQuestions, foods, shuffleArray, getRandomFood } from '../data/foods.js';

class FoodBalance extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.questions = [];
        this.currentIndex = 0;
        this.answers = [];
        this.totalQuestions = 5;
    }

    connectedCallback() {
        this.initGame();
        this.render();
    }

    initGame() {
        // 5개 질문 랜덤 선택
        this.questions = shuffleArray([...balanceQuestions]).slice(0, this.totalQuestions);
        this.currentIndex = 0;
        this.answers = [];
    }

    render() {
        if (this.currentIndex >= this.totalQuestions) {
            this.showResult();
            return;
        }

        const question = this.questions[this.currentIndex];

        this.shadowRoot.innerHTML = `
            <style>
                ${this.getStyles()}
            </style>
            <div class="balance-container">
                <div class="progress-info">
                    <span class="question-count">${this.currentIndex + 1} / ${this.totalQuestions}</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((this.currentIndex + 1) / this.totalQuestions) * 100}%"></div>
                    </div>
                </div>

                <h2 class="question-text">${question.question}</h2>

                <div class="options-row">
                    <button class="option-btn" data-choice="A">
                        <span class="option-emoji">${question.optionA.emoji}</span>
                        <span class="option-text">${question.optionA.text}</span>
                    </button>

                    <div class="vs-badge">VS</div>

                    <button class="option-btn" data-choice="B">
                        <span class="option-emoji">${question.optionB.emoji}</span>
                        <span class="option-text">${question.optionB.text}</span>
                    </button>
                </div>

                <div class="stats-area hidden" id="stats-area">
                    <div class="stat-bar">
                        <div class="stat-fill stat-a" id="stat-a"></div>
                        <div class="stat-fill stat-b" id="stat-b"></div>
                    </div>
                    <div class="stat-labels">
                        <span id="label-a">${question.optionA.text}</span>
                        <span id="label-b">${question.optionB.text}</span>
                    </div>
                </div>
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

            .balance-container {
                background: #FFFFFF;
                border: 1px solid rgba(74, 68, 88, 0.08);
                border-radius: 24px;
                padding: 1.5rem;
                box-shadow: 0 4px 20px rgba(74, 68, 88, 0.08);
                text-align: center;
            }

            .progress-info {
                margin-bottom: 1.5rem;
            }

            .question-count {
                display: inline-block;
                background: linear-gradient(135deg, #B8E0D2, #D4C1EC);
                color: #FFFFFF;
                padding: 6px 14px;
                border-radius: 9999px;
                font-weight: 600;
                font-size: 0.75rem;
                margin-bottom: 0.75rem;
            }

            .progress-bar {
                width: 100%;
                height: 6px;
                background: rgba(74, 68, 88, 0.08);
                border-radius: 3px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(135deg, #B8E0D2, #D4C1EC);
                border-radius: 3px;
                transition: width 0.4s ease;
            }

            .question-text {
                font-size: 1.25rem;
                color: #4A4458;
                margin: 0 0 1.5rem 0;
                font-weight: 700;
                line-height: 1.4;
            }

            .options-row {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                flex-wrap: wrap;
            }

            .option-btn {
                flex: 1;
                min-width: 130px;
                max-width: 200px;
                padding: 1.5rem 1rem;
                background: #FFFFFF;
                border: 2px solid rgba(74, 68, 88, 0.08);
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.25s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.75rem;
                box-shadow: 0 2px 8px rgba(74, 68, 88, 0.06);
            }

            .option-btn:hover {
                transform: translateY(-4px);
                border-color: #FFB5A7;
                box-shadow: 0 8px 24px rgba(255, 139, 123, 0.2);
            }

            .option-btn:active {
                transform: scale(0.98);
            }

            .option-btn.selected {
                border-color: #FF8B7B;
                background: rgba(255, 181, 167, 0.1);
            }

            .option-btn.not-selected {
                opacity: 0.4;
            }

            .option-emoji {
                font-size: 2.5rem;
            }

            .option-text {
                font-size: 1rem;
                font-weight: 600;
                color: #4A4458;
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

            /* 통계 영역 */
            .stats-area {
                margin-top: 1.5rem;
                animation: fadeIn 0.5s ease-out;
            }

            .stats-area.hidden {
                display: none;
            }

            .stat-bar {
                display: flex;
                width: 100%;
                height: 36px;
                border-radius: 18px;
                overflow: hidden;
                background: rgba(74, 68, 88, 0.08);
            }

            .stat-fill {
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 0.8rem;
                color: white;
                transition: width 0.8s ease;
            }

            .stat-fill.stat-a {
                background: linear-gradient(135deg, #FFB5A7, #FFC8A2);
            }

            .stat-fill.stat-b {
                background: linear-gradient(135deg, #D4C1EC, #B8E0D2);
            }

            .stat-labels {
                display: flex;
                justify-content: space-between;
                margin-top: 0.5rem;
                color: #7D7A8C;
                font-weight: 500;
                font-size: 0.8rem;
            }

            /* 결과 화면 */
            .result-container {
                text-align: center;
            }

            .result-title {
                font-size: 1.25rem;
                color: #4A4458;
                font-weight: 700;
                margin-bottom: 1.5rem;
            }

            .recommendation {
                background: linear-gradient(135deg, rgba(212, 193, 236, 0.15), rgba(184, 224, 210, 0.15));
                border: 1px solid rgba(212, 193, 236, 0.3);
                border-radius: 20px;
                padding: 1.5rem;
                margin-bottom: 1.25rem;
            }

            .food-image-wrapper {
                width: 140px;
                height: 140px;
                margin: 0 auto 1rem;
                border-radius: 50%;
                overflow: hidden;
                box-shadow: 0 8px 24px rgba(212, 193, 236, 0.3);
                border: 3px solid rgba(212, 193, 236, 0.4);
            }

            .food-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .food-name {
                font-size: 1.5rem;
                font-weight: 700;
                color: #4A4458;
                margin: 0 0 0.5rem 0;
            }

            .food-desc {
                color: #7D7A8C;
                font-size: 0.875rem;
            }

            .action-buttons {
                display: flex;
                gap: 0.75rem;
                justify-content: center;
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
                background: linear-gradient(135deg, #D4C1EC, #B8E0D2);
                color: #FFFFFF;
                box-shadow: 0 6px 20px rgba(212, 193, 236, 0.3);
            }

            .action-btn.secondary {
                background: #FFFFFF;
                color: #4A4458;
                border: 1px solid rgba(74, 68, 88, 0.08);
            }

            .action-btn:hover {
                transform: translateY(-2px);
            }

            @media (max-width: 600px) {
                .balance-container {
                    padding: 1.25rem;
                }
                .question-text {
                    font-size: 1.125rem;
                }
                .option-btn {
                    min-width: 110px;
                    padding: 1.25rem 0.75rem;
                }
                .option-emoji {
                    font-size: 2rem;
                }
                .option-text {
                    font-size: 0.875rem;
                }
            }
        `;
    }

    bindEvents() {
        const buttons = this.shadowRoot.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const choice = btn.dataset.choice;
                this.selectOption(choice);
            });
        });
    }

    selectOption(choice) {
        const question = this.questions[this.currentIndex];
        this.answers.push({
            question: question,
            choice: choice
        });

        // 버튼 상태 변경
        const buttons = this.shadowRoot.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            if (btn.dataset.choice === choice) {
                btn.classList.add('selected');
            } else {
                btn.classList.add('not-selected');
            }
            btn.disabled = true;
        });

        // 통계 표시
        this.showStats(question, choice);

        // 다음 질문으로
        setTimeout(() => {
            this.currentIndex++;
            this.render();
        }, 1500);
    }

    showStats(question, choice) {
        const statsArea = this.shadowRoot.getElementById('stats-area');
        const statA = this.shadowRoot.getElementById('stat-a');
        const statB = this.shadowRoot.getElementById('stat-b');

        statsArea.classList.remove('hidden');

        // 약간의 랜덤 변동 추가
        const variance = Math.floor(Math.random() * 6) - 3;
        const percentA = Math.min(95, Math.max(5, question.statsA + variance));
        const percentB = 100 - percentA;

        statA.style.width = `${percentA}%`;
        statA.textContent = `${percentA}%`;
        statB.style.width = `${percentB}%`;
        statB.textContent = `${percentB}%`;
    }

    showResult() {
        // 답변 기반으로 음식 추천 (간단한 로직)
        const recommendedFood = getRandomFood();

        this.shadowRoot.innerHTML = `
            <style>
                ${this.getStyles()}
            </style>
            <div class="balance-container result-container">
                <h2 class="result-title">밸런스 게임 완료!</h2>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">
                    당신의 선택을 분석한 결과...
                </p>

                <div class="recommendation">
                    <div class="food-image-wrapper">
                        <img src="${recommendedFood.image}" alt="${recommendedFood.name}" class="food-image">
                    </div>
                    <h3 class="food-name">${recommendedFood.name}</h3>
                    <p class="food-desc">${recommendedFood.desc}</p>
                </div>

                <div class="action-buttons">
                    <button class="action-btn primary" id="share-btn">📤 결과 공유</button>
                    <button class="action-btn secondary" id="retry-btn">🔄 다시 하기</button>
                </div>
            </div>
        `;

        this.shadowRoot.getElementById('retry-btn').addEventListener('click', () => {
            this.initGame();
            this.render();
        });

        this.shadowRoot.getElementById('share-btn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('food-result', {
                detail: { food: recommendedFood, mode: 'balance' },
                bubbles: true,
                composed: true
            }));
        });
    }
}

customElements.define('food-balance', FoodBalance);

export default FoodBalance;
