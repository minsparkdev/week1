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
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .balance-container {
                background: var(--glass-bg, rgba(255, 255, 255, 0.7));
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.5));
                border-radius: var(--radius, 24px);
                padding: 2rem;
                box-shadow: var(--glass-shadow, 0 8px 32px 0 rgba(31, 38, 135, 0.1));
                text-align: center;
            }

            .progress-info {
                margin-bottom: 2rem;
            }

            .question-count {
                display: inline-block;
                background: linear-gradient(135deg, #ff6b6b, #ffa502);
                color: white;
                padding: 0.4rem 1rem;
                border-radius: 50px;
                font-weight: 700;
                font-size: 0.9rem;
                margin-bottom: 1rem;
            }

            .progress-bar {
                width: 100%;
                height: 8px;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 4px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(135deg, #ff6b6b, #ffa502);
                transition: width 0.5s ease;
            }

            .question-text {
                font-size: 1.8rem;
                color: var(--text-main, #2d3436);
                margin: 0 0 2rem 0;
                font-weight: 800;
                line-height: 1.4;
            }

            .options-row {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1.5rem;
                flex-wrap: wrap;
            }

            .option-btn {
                flex: 1;
                min-width: 150px;
                max-width: 250px;
                padding: 2rem 1.5rem;
                background: var(--glass-bg, rgba(255, 255, 255, 0.8));
                border: 3px solid var(--glass-border, rgba(255, 255, 255, 0.5));
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
            }

            .option-btn:hover {
                transform: translateY(-5px) scale(1.02);
                border-color: #ff6b6b;
                box-shadow: 0 10px 30px rgba(255, 107, 107, 0.2);
            }

            .option-btn:active {
                transform: scale(0.98);
            }

            .option-btn.selected {
                border-color: #ff6b6b;
                background: rgba(255, 107, 107, 0.1);
            }

            .option-btn.not-selected {
                opacity: 0.5;
            }

            .option-emoji {
                font-size: 3rem;
            }

            .option-text {
                font-size: 1.3rem;
                font-weight: 700;
                color: var(--text-main, #2d3436);
            }

            .vs-badge {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 900;
                font-size: 1rem;
                flex-shrink: 0;
            }

            /* 통계 영역 */
            .stats-area {
                margin-top: 2rem;
                animation: fadeIn 0.5s ease-out;
            }

            .stats-area.hidden {
                display: none;
            }

            .stat-bar {
                display: flex;
                width: 100%;
                height: 40px;
                border-radius: 20px;
                overflow: hidden;
                background: #eee;
            }

            .stat-fill {
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                color: white;
                transition: width 0.8s ease;
            }

            .stat-fill.stat-a {
                background: linear-gradient(135deg, #ff6b6b, #ffa502);
            }

            .stat-fill.stat-b {
                background: linear-gradient(135deg, #667eea, #764ba2);
            }

            .stat-labels {
                display: flex;
                justify-content: space-between;
                margin-top: 0.5rem;
                color: var(--text-muted, #636e72);
                font-weight: 600;
            }

            /* 결과 화면 */
            .result-container {
                text-align: center;
            }

            .result-title {
                font-size: 1.5rem;
                color: var(--text-main, #2d3436);
                margin-bottom: 2rem;
            }

            .recommendation {
                background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 165, 2, 0.1));
                border: 2px solid rgba(255, 107, 107, 0.3);
                border-radius: 20px;
                padding: 2rem;
                margin-bottom: 1.5rem;
            }

            .food-image-wrapper {
                width: 180px;
                height: 180px;
                margin: 0 auto 1.5rem;
                border-radius: 50%;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
                border: 4px solid rgba(255, 107, 107, 0.3);
            }

            .food-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .food-name {
                font-size: 2rem;
                font-weight: 800;
                color: var(--text-main, #2d3436);
                margin: 0 0 0.5rem 0;
            }

            .food-desc {
                color: var(--text-muted, #636e72);
                font-size: 1rem;
            }

            .action-buttons {
                display: flex;
                gap: 1rem;
                justify-content: center;
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
                background: linear-gradient(135deg, #ff6b6b, #ffa502);
                color: white;
            }

            .action-btn.secondary {
                background: var(--glass-bg);
                color: var(--text-main);
                border: 2px solid var(--glass-border);
            }

            .action-btn:hover {
                transform: translateY(-2px);
            }

            @media (max-width: 600px) {
                .question-text {
                    font-size: 1.4rem;
                }
                .option-btn {
                    min-width: 120px;
                    padding: 1.5rem 1rem;
                }
                .option-emoji {
                    font-size: 2rem;
                }
                .option-text {
                    font-size: 1.1rem;
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
