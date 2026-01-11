/**
 * FoodRecommender 컴포넌트
 * - 랜덤 음식 추천
 * - AI 이미지 생성 연동
 */

import { foods, getRandomFood, generateImageUrl } from '../data/foods.js';

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
                    <p class="desc" id="desc">버튼을 눌러 AI가 추천하는 오늘의 메뉴를 확인하세요!</p>
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
                animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
            }
            .card {
                background: var(--glass-bg, rgba(255, 255, 255, 0.7));
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.5));
                border-radius: var(--radius, 24px);
                padding: 0;
                box-shadow: var(--glass-shadow, 0 8px 32px 0 rgba(31, 38, 135, 0.1));
                text-align: center;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .image-area {
                width: 100%;
                height: 350px;
                background-color: rgba(0,0,0,0.03);
                position: relative;
                overflow: hidden;
            }

            .image-area img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }

            .image-placeholder {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
                font-size: 5rem;
            }

            .content {
                padding: 2.5rem 2rem;
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .category {
                display: inline-block;
                padding: 0.5rem 1.2rem;
                border-radius: 50px;
                background: rgba(255, 107, 107, 0.1);
                color: #ff6b6b;
                font-size: 0.95rem;
                font-weight: 700;
                margin-bottom: 1rem;
                letter-spacing: 0.5px;
                text-transform: uppercase;
            }

            h2 {
                margin: 0 0 0.8rem 0;
                font-size: 2.5rem;
                color: var(--text-main, #2d3436);
                font-weight: 800;
                line-height: 1.1;
            }

            .desc {
                color: var(--text-muted, #636e72);
                margin-bottom: 2.5rem;
                font-size: 1.1rem;
                min-height: 1.5em;
                font-weight: 400;
            }

            button {
                background: linear-gradient(135deg, #ff6b6b, #ffa502);
                color: white;
                border: none;
                padding: 1.2rem 3rem;
                font-size: 1.1rem;
                font-weight: 700;
                border-radius: 50px;
                cursor: pointer;
                box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
                transition: all 0.3s ease;
                width: 100%;
                max-width: 320px;
            }

            button:hover {
                transform: translateY(-3px);
                box-shadow: 0 15px 30px rgba(255, 107, 107, 0.4);
            }

            button:disabled {
                opacity: 0.7;
                cursor: wait;
                background: #b2bec3;
                box-shadow: none;
                transform: none;
            }

            .spinner {
                width: 50px;
                height: 50px;
                border: 5px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: #fff;
                animation: spin 1s ease-in-out infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .result-show .image-area img {
                animation: zoomIn 0.8s ease-out;
            }

            @keyframes zoomIn {
                from { transform: scale(1.1); opacity: 0; }
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

        btn.disabled = true;
        btn.textContent = "AI가 메뉴를 고르는 중...";

        // 셔플 효과
        let counter = 0;
        const interval = setInterval(() => {
            const randomFood = getRandomFood();
            nameEl.textContent = randomFood.name;
            categoryEl.textContent = randomFood.category;
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

        // 로딩 상태 표시
        imgArea.innerHTML = '<div class="image-placeholder"><div class="spinner"></div></div>';

        // AI 이미지 URL 생성
        const imageUrl = generateImageUrl(pick);

        // 이미지 생성
        const img = document.createElement('img');
        img.alt = pick.name;

        // 5초 타임아웃
        const timeoutId = setTimeout(() => {
            if (this.isAnimating) {
                console.warn("Image load timed out");
                handleError();
            }
        }, 5000);

        const handleSuccess = () => {
            clearTimeout(timeoutId);
            imgArea.innerHTML = '';
            imgArea.appendChild(img);

            card.classList.remove('result-show');
            void card.offsetWidth;
            card.classList.add('result-show');

            enableButton();

            // 결과 이벤트 발행
            this.dispatchEvent(new CustomEvent('food-result', {
                detail: { food: pick, mode: 'random' },
                bubbles: true,
                composed: true
            }));
        };

        const handleError = () => {
            clearTimeout(timeoutId);
            imgArea.innerHTML = `<div class="image-placeholder" style="font-size: 5rem;">${pick.emoji || '😋'}</div>`;
            enableButton();
        };

        const enableButton = () => {
            btn.textContent = "다른 거 추천받기";
            btn.disabled = false;
            this.isAnimating = false;
        };

        img.onload = handleSuccess;
        img.onerror = handleError;
        img.src = imageUrl;
    }
}

customElements.define('food-recommender', FoodRecommender);

export default FoodRecommender;
