/**
 * FoodRecommender 컴포넌트
 * - 랜덤 음식 추천
 * - 로컬 이미지 사용
 */

import { foods, getRandomFood } from '../data/foods.js';

class FoodRecommender extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isAnimating = false;
    }

    connectedCallback() {
        this.render();
        this.bindEvents();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                ${this.getStyles()}
            </style>
            <div class="card" id="card">
                <div class="image-area" id="image-area">
                    <div class="image-placeholder">🍽️</div>
                </div>
                <div class="content">
                    <div class="category" id="category">READY</div>
                    <h2 id="food-name">무엇을 먹을까요?</h2>
                    <p class="desc" id="desc">버튼을 눌러 오늘의 메뉴를 추천받으세요!</p>
                    <button id="recommend-btn">메뉴 추천받기</button>
                </div>
            </div>
        `;
    }

    getStyles() {
        return `
            :host {
                display: block;
                width: 100%;
                animation: fadeInUp 0.5s ease-out;
            }

            .card {
                background: #FFFFFF;
                border: 1px solid rgba(74, 68, 88, 0.08);
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(74, 68, 88, 0.08);
            }

            .image-area {
                width: 100%;
                height: 280px;
                background: linear-gradient(135deg, #FFDAC1 0%, #FFB5A7 100%);
                position: relative;
                overflow: hidden;
            }

            .image-area img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.4s ease;
            }

            .card:hover .image-area img {
                transform: scale(1.03);
            }

            .image-placeholder {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 4rem;
            }

            .content {
                padding: 1.5rem;
                text-align: center;
            }

            .category {
                display: inline-block;
                padding: 6px 14px;
                border-radius: 9999px;
                background: #FFDAC1;
                color: #E07565;
                font-size: 0.75rem;
                font-weight: 600;
                margin-bottom: 0.75rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            h2 {
                margin: 0 0 0.5rem 0;
                font-size: 1.5rem;
                color: #4A4458;
                font-weight: 700;
                line-height: 1.2;
            }

            .desc {
                color: #7D7A8C;
                margin-bottom: 1.5rem;
                font-size: 0.875rem;
                min-height: 1.2em;
            }

            button {
                background: linear-gradient(135deg, #FFB5A7 0%, #FFC8A2 50%, #FFD6BA 100%);
                color: #FFFFFF;
                border: none;
                padding: 0.875rem 2rem;
                font-size: 0.875rem;
                font-weight: 600;
                border-radius: 16px;
                cursor: pointer;
                box-shadow: 0 8px 24px rgba(255, 139, 123, 0.25);
                transition: all 0.25s ease;
                width: 100%;
            }

            button:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 28px rgba(255, 139, 123, 0.35);
            }

            button:disabled {
                opacity: 0.6;
                cursor: wait;
                background: #A9A6B5;
                box-shadow: none;
                transform: none;
            }

            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(16px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .result-show .image-area img {
                animation: zoomIn 0.5s ease-out;
            }

            @keyframes zoomIn {
                from { transform: scale(1.05); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `;
    }

    bindEvents() {
        const btn = this.shadowRoot.getElementById('recommend-btn');
        btn.addEventListener('click', () => this.recommendFood());
    }

    recommendFood() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const btn = this.shadowRoot.getElementById('recommend-btn');
        const nameEl = this.shadowRoot.getElementById('food-name');
        const categoryEl = this.shadowRoot.getElementById('category');
        const imgArea = this.shadowRoot.getElementById('image-area');

        btn.disabled = true;
        btn.textContent = "메뉴를 고르는 중...";

        // 셔플 효과 - 이미지도 함께 변경
        let counter = 0;
        const interval = setInterval(() => {
            const randomFood = getRandomFood();
            nameEl.textContent = randomFood.name;
            categoryEl.textContent = randomFood.category;

            // 셔플 중에도 이미지 미리보기
            imgArea.innerHTML = `<img src="${randomFood.image}" alt="${randomFood.name}" style="opacity: 0.7;">`;

            counter++;

            if (counter > 10) {
                clearInterval(interval);
                this.finalizeRecommendation();
            }
        }, 100);
    }

    finalizeRecommendation() {
        const btn = this.shadowRoot.getElementById('recommend-btn');
        const card = this.shadowRoot.getElementById('card');
        const imgArea = this.shadowRoot.getElementById('image-area');
        const nameEl = this.shadowRoot.getElementById('food-name');
        const categoryEl = this.shadowRoot.getElementById('category');
        const descEl = this.shadowRoot.getElementById('desc');

        // 음식 선택
        const pick = getRandomFood();

        // 텍스트 업데이트
        nameEl.textContent = pick.name;
        categoryEl.textContent = pick.category;
        descEl.textContent = pick.desc;

        // 로컬 이미지 로드
        const img = document.createElement('img');
        img.alt = pick.name;
        img.src = pick.image;

        img.onload = () => {
            imgArea.innerHTML = '';
            imgArea.appendChild(img);

            card.classList.remove('result-show');
            void card.offsetWidth;
            card.classList.add('result-show');

            btn.textContent = "다른 거 추천받기";
            btn.disabled = false;
            this.isAnimating = false;

            // 결과 이벤트 발행
            this.dispatchEvent(new CustomEvent('food-result', {
                detail: { food: pick, mode: 'random' },
                bubbles: true,
                composed: true
            }));
        };

        img.onerror = () => {
            // 이미지 로드 실패 시 이모지 표시
            imgArea.innerHTML = `<div class="image-placeholder" style="font-size: 5rem;">${pick.emoji}</div>`;
            btn.textContent = "다른 거 추천받기";
            btn.disabled = false;
            this.isAnimating = false;
        };
    }
}

customElements.define('food-recommender', FoodRecommender);

export default FoodRecommender;
