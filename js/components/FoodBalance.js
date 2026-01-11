/**
 * FoodBalance 컴포넌트
 * - 음식 밸런스 게임
 * - 취향 분석 기반 추천
 *
 * 로직 흐름:
 * 1. 5개 질문에 대해 A/B 선택
 * 2. 각 선택에 따라 취향 프로파일 업데이트
 * 3. 최종 프로파일 기반으로 최적 음식 추천
 * 4. 취향 분석 결과와 함께 표시
 */

import { balanceQuestions, shuffleArray } from '../data/foods.js';
import {
    createInitialProfile,
    updateProfile,
    analyzeProfile,
    recommendFoods,
    generateRecommendationReason
} from '../utils/tasteAnalyzer.js';

class FoodBalance extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.questions = [];
        this.currentIndex = 0;
        this.answers = [];
        this.totalQuestions = 5;
        this.profile = null;
        this.recommendation = null;
        this.analysis = null;
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
        this.profile = createInitialProfile();
        this.recommendation = null;
        this.analysis = null;
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

            .result-header {
                margin-bottom: 1.5rem;
            }

            .result-badge {
                display: inline-block;
                background: linear-gradient(135deg, #B8E0D2, #D4C1EC);
                color: #FFFFFF;
                padding: 6px 14px;
                border-radius: 9999px;
                font-weight: 600;
                font-size: 0.75rem;
                margin-bottom: 0.75rem;
            }

            .result-title {
                font-size: 1.25rem;
                color: #4A4458;
                font-weight: 700;
                margin: 0 0 0.25rem 0;
            }

            .result-subtitle {
                color: #7D7A8C;
                font-size: 0.875rem;
                margin: 0;
            }

            /* 취향 분석 카드 */
            .analysis-card {
                background: linear-gradient(135deg, rgba(184, 224, 210, 0.15), rgba(212, 193, 236, 0.15));
                border: 1px solid rgba(184, 224, 210, 0.3);
                border-radius: 16px;
                padding: 1rem;
                margin-bottom: 1rem;
            }

            .taste-type {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
            }

            .taste-type-emoji {
                font-size: 1.5rem;
            }

            .taste-type-name {
                font-size: 1rem;
                font-weight: 700;
                color: #4A4458;
            }

            .taste-type-desc {
                color: #7D7A8C;
                font-size: 0.8rem;
                margin: 0;
            }

            /* 취향 게이지 */
            .traits-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.5rem;
                margin-top: 0.75rem;
            }

            .trait-item {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }

            .trait-label {
                font-size: 0.7rem;
                color: #7D7A8C;
                text-align: left;
            }

            .trait-bar {
                height: 6px;
                background: rgba(74, 68, 88, 0.1);
                border-radius: 3px;
                overflow: hidden;
            }

            .trait-fill {
                height: 100%;
                background: linear-gradient(135deg, #B8E0D2, #D4C1EC);
                border-radius: 3px;
                transition: width 0.5s ease;
            }

            /* 추천 음식 카드 */
            .recommendation {
                background: linear-gradient(135deg, rgba(212, 193, 236, 0.15), rgba(184, 224, 210, 0.15));
                border: 1px solid rgba(212, 193, 236, 0.3);
                border-radius: 20px;
                padding: 1.5rem;
                margin-bottom: 1.25rem;
            }

            .match-score {
                display: inline-block;
                background: linear-gradient(135deg, #D4C1EC, #B8E0D2);
                color: #FFFFFF;
                padding: 4px 12px;
                border-radius: 9999px;
                font-weight: 700;
                font-size: 0.7rem;
                margin-bottom: 0.75rem;
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
                margin: 0 0 0.25rem 0;
            }

            .food-category {
                display: inline-block;
                padding: 4px 10px;
                background: #FFDAC1;
                color: #E07565;
                font-size: 0.65rem;
                font-weight: 600;
                border-radius: 9999px;
                margin-bottom: 0.5rem;
            }

            .food-reason {
                color: #7D7A8C;
                font-size: 0.8rem;
                margin: 0;
                line-height: 1.5;
            }

            .image-placeholder {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
                background: linear-gradient(135deg, #D4C1EC 0%, #B8E0D2 100%);
            }

            .action-buttons {
                display: flex;
                gap: 0.75rem;
                justify-content: center;
                flex-wrap: wrap;
                margin-top: 0.5rem;
            }

            .action-btn {
                padding: 0.75rem 1.25rem;
                border-radius: 16px;
                font-size: 0.8rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.25s ease;
                border: none;
                display: flex;
                align-items: center;
                gap: 0.5rem;
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

            .btn-icon {
                font-size: 1rem;
            }

            /* Tablet */
            @media (max-width: 600px) {
                .balance-container {
                    padding: 1rem;
                    border-radius: 16px;
                }

                .progress-info {
                    margin-bottom: 1rem;
                }

                .question-count, .result-badge {
                    padding: 4px 10px;
                    font-size: 0.625rem;
                    margin-bottom: 0.5rem;
                }

                .question-text, .result-title {
                    font-size: 1rem;
                    margin-bottom: 1rem;
                }

                .result-subtitle {
                    font-size: 0.75rem;
                }

                .options-row {
                    gap: 0.5rem;
                }

                .option-btn {
                    min-width: 0;
                    flex: 1;
                    padding: 1rem 0.5rem;
                    gap: 0.5rem;
                    border-radius: 14px;
                }

                .option-emoji {
                    font-size: 2rem;
                }

                .option-text {
                    font-size: 0.8rem;
                }

                .vs-badge {
                    width: 36px;
                    height: 36px;
                    font-size: 0.75rem;
                }

                .stats-area {
                    margin-top: 1rem;
                }

                .stat-bar {
                    height: 30px;
                    border-radius: 15px;
                }

                .stat-fill {
                    font-size: 0.7rem;
                }

                .stat-labels {
                    font-size: 0.7rem;
                }

                .analysis-card {
                    padding: 0.75rem;
                    border-radius: 12px;
                }

                .taste-type-emoji {
                    font-size: 1.25rem;
                }

                .taste-type-name {
                    font-size: 0.875rem;
                }

                .taste-type-desc {
                    font-size: 0.7rem;
                }

                .traits-grid {
                    gap: 0.375rem;
                }

                .trait-label {
                    font-size: 0.625rem;
                }

                .recommendation {
                    padding: 1rem;
                    border-radius: 16px;
                    margin-bottom: 1rem;
                }

                .match-score {
                    padding: 3px 10px;
                    font-size: 0.625rem;
                }

                .food-image-wrapper {
                    width: 120px;
                    height: 120px;
                    margin-bottom: 0.75rem;
                }

                .food-name {
                    font-size: 1.25rem;
                }

                .food-category {
                    font-size: 0.6rem;
                    padding: 3px 8px;
                }

                .food-reason {
                    font-size: 0.75rem;
                }
            }

            /* Mobile */
            @media (max-width: 480px) {
                .balance-container {
                    padding: 0.75rem;
                }

                .question-text, .result-title {
                    font-size: 0.875rem;
                    margin-bottom: 0.75rem;
                }

                .result-subtitle {
                    font-size: 0.7rem;
                }

                .options-row {
                    flex-direction: row;
                    gap: 0.375rem;
                }

                .option-btn {
                    padding: 0.75rem 0.375rem;
                    border-radius: 12px;
                }

                .option-emoji {
                    font-size: 1.5rem;
                }

                .option-text {
                    font-size: 0.7rem;
                }

                .vs-badge {
                    width: 28px;
                    height: 28px;
                    font-size: 0.625rem;
                }

                .analysis-card {
                    padding: 0.625rem;
                    margin-bottom: 0.75rem;
                }

                .taste-type {
                    gap: 0.375rem;
                    margin-bottom: 0.375rem;
                }

                .taste-type-emoji {
                    font-size: 1.125rem;
                }

                .taste-type-name {
                    font-size: 0.8rem;
                }

                .taste-type-desc {
                    font-size: 0.65rem;
                }

                .traits-grid {
                    grid-template-columns: 1fr;
                    gap: 0.25rem;
                    margin-top: 0.5rem;
                }

                .trait-bar {
                    height: 5px;
                }

                .recommendation {
                    padding: 0.75rem;
                    border-radius: 14px;
                    margin-bottom: 0.75rem;
                }

                .food-image-wrapper {
                    width: 100px;
                    height: 100px;
                    margin-bottom: 0.5rem;
                }

                .food-name {
                    font-size: 1.125rem;
                }

                .food-reason {
                    font-size: 0.7rem;
                }

                .action-buttons {
                    gap: 0.5rem;
                }

                .action-btn {
                    padding: 0.625rem 1rem;
                    font-size: 0.7rem;
                    border-radius: 12px;
                    gap: 0.375rem;
                }

                .btn-icon {
                    font-size: 0.9rem;
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

        // 답변 저장
        this.answers.push({
            question: question,
            choice: choice
        });

        // 취향 프로파일 업데이트
        this.profile = updateProfile(this.profile, {
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

        // 약간의 랜덤 변동 추가 (실제 통계처럼 보이게)
        const variance = Math.floor(Math.random() * 6) - 3;
        const percentA = Math.min(95, Math.max(5, question.statsA + variance));
        const percentB = 100 - percentA;

        statA.style.width = `${percentA}%`;
        statA.textContent = `${percentA}%`;
        statB.style.width = `${percentB}%`;
        statB.textContent = `${percentB}%`;
    }

    showResult() {
        // 취향 분석
        this.analysis = analyzeProfile(this.profile);

        // 음식 추천 (상위 1개)
        const recommendations = recommendFoods(this.profile, 1);
        this.recommendation = recommendations[0];

        const { food, score } = this.recommendation;
        const reason = generateRecommendationReason(this.profile, food, score);
        const { type, descriptions } = this.analysis;

        this.shadowRoot.innerHTML = `
            <style>
                ${this.getStyles()}
            </style>
            <div class="balance-container result-container">
                <div class="result-header">
                    <span class="result-badge">분석 완료</span>
                    <h2 class="result-title">당신의 음식 취향을 분석했어요!</h2>
                    <p class="result-subtitle">5개 질문을 바탕으로 분석한 결과입니다</p>
                </div>

                <div class="analysis-card">
                    <div class="taste-type">
                        <span class="taste-type-emoji">${type.emoji}</span>
                        <span class="taste-type-name">${type.name}</span>
                    </div>
                    <p class="taste-type-desc">${type.description}</p>

                    <div class="traits-grid">
                        ${this.renderTraitBars()}
                    </div>
                </div>

                <div class="recommendation">
                    <span class="match-score">적합도 ${score}%</span>
                    <div class="food-image-wrapper" id="food-image-wrapper">
                        <img src="${food.image}" alt="${food.name}" class="food-image" id="food-image">
                    </div>
                    <span class="food-category">${food.category}</span>
                    <h3 class="food-name">${food.name}</h3>
                    <p class="food-reason">${reason}</p>
                </div>

                <div class="action-buttons">
                    <button class="action-btn primary" id="share-btn">
                        <span class="btn-icon">📤</span>
                        결과 공유
                    </button>
                    <button class="action-btn secondary" id="retry-btn">
                        <span class="btn-icon">🔄</span>
                        다시 하기
                    </button>
                </div>
            </div>
        `;

        // 이미지 로드 실패 시 이모지로 대체
        const foodImage = this.shadowRoot.getElementById('food-image');
        const imageWrapper = this.shadowRoot.getElementById('food-image-wrapper');
        if (foodImage && imageWrapper) {
            foodImage.onerror = () => {
                imageWrapper.innerHTML = `<div class="image-placeholder">${food.emoji}</div>`;
            };
        }

        this.shadowRoot.getElementById('retry-btn').addEventListener('click', () => {
            this.initGame();
            this.render();
        });

        this.shadowRoot.getElementById('share-btn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('food-result', {
                detail: { food: food, mode: 'balance' },
                bubbles: true,
                composed: true
            }));
        });
    }

    /**
     * 취향 게이지 바 렌더링
     */
    renderTraitBars() {
        const traitLabels = {
            spicy: '매운맛',
            hearty: '든든함',
            adventurous: '도전',
            social: '함께',
            quick: '속도'
        };

        return Object.entries(this.profile).map(([trait, value]) => {
            const percentage = (value / 5) * 100;
            return `
                <div class="trait-item">
                    <span class="trait-label">${traitLabels[trait] || trait}</span>
                    <div class="trait-bar">
                        <div class="trait-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

customElements.define('food-balance', FoodBalance);

export default FoodBalance;
