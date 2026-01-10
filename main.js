
// Food Data
const foodData = [
    { name: "김치찌개", category: "한식", icon: "🥘", desc: "얼큰하고 칼칼한 국물이 땡기는 날" },
    { name: "삼겹살", category: "한식", icon: "🥩", desc: "지글지글 구워지는 고기 소리" },
    { name: "비빔밥", category: "한식", icon: "🥗", desc: "신선한 야채와 고추장의 조화" },
    { name: "초밥", category: "일식", icon: "🍣", desc: "깔끔하고 신선한 한 끼" },
    { name: "라멘", category: "일식", icon: "🍜", desc: "진한 국물과 쫄깃한 면발" },
    { name: "돈까스", category: "일식", icon: "🍱", desc: "바삭바삭한 튀김의 유혹" },
    { name: "짜장면", category: "중식", icon: "🥢", desc: "국민 배달 음식의 정석" },
    { name: "마라탕", category: "중식", icon: "🌶️", desc: "스트레스 풀리는 매운 맛" },
    { name: "탕수육", category: "중식", icon: "🍖", desc: "부먹? 찍먹? 일단 먹자" },
    { name: "피자", category: "양식", icon: "🍕", desc: "치즈가 쭉 늘어나는 행복" },
    { name: "파스타", category: "양식", icon: "🍝", desc: "분위기 있게 즐기는 한 끼" },
    { name: "햄버거", category: "양식", icon: "🍔", desc: "빠르고 든든하게 채우는 맛" },
    { name: "치킨", category: "야식", icon: "🍗", desc: "오늘 밤은 치느님과 함께" },
    { name: "떡볶이", category: "분식", icon: "🥘", desc: "매콤달콤 중독성 있는 맛" },
    { name: "샐러드", category: "다이어트", icon: "🥗", desc: "가볍고 건강하게" }
];

class FoodRecommender extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isAnimating = false;
    }

    connectedCallback() {
        this.render();
        this.addEvents();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                .card {
                    background-color: var(--card-bg, #fff);
                    border-radius: 20px;
                    padding: 3rem 2rem;
                    box-shadow: var(--shadow-md, 0 8px 24px rgba(0,0,0,0.12));
                    text-align: center;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                    border: 1px solid rgba(0,0,0,0.05);
                }
                
                .icon-area {
                    font-size: 5rem;
                    margin-bottom: 1rem;
                    height: 100px;
                    line-height: 100px;
                }

                .category {
                    display: inline-block;
                    padding: 0.4rem 1rem;
                    border-radius: 50px;
                    background-color: rgba(255, 107, 107, 0.1);
                    color: #ff6b6b;
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }

                h2 {
                    margin: 0 0 0.5rem 0;
                    font-size: 2.2rem;
                    color: var(--text-main, #333);
                }

                .desc {
                    color: var(--text-muted, #888);
                    margin-bottom: 2.5rem;
                    font-size: 1.1rem;
                    min-height: 1.5em;
                }

                button {
                    background: linear-gradient(45deg, #ff6b6b, #ff922b);
                    color: white;
                    border: none;
                    padding: 1rem 2.5rem;
                    font-size: 1.1rem;
                    font-weight: bold;
                    border-radius: 50px;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
                    transition: transform 0.2s, box-shadow 0.2s;
                    width: 100%;
                    max-width: 300px;
                }

                button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
                }

                button:active {
                    transform: translateY(1px);
                }

                button:disabled {
                    opacity: 0.7;
                    cursor: wait;
                }

                /* Animation Classes */
                .shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }

                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }

                .result-show {
                    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                @keyframes popIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            </style>

            <div class="card" id="card">
                <div class="category" id="category">READY</div>
                <div class="icon-area" id="icon">🎲</div>
                <h2 id="food-name">무엇을 먹을까요?</h2>
                <p class="desc" id="desc">버튼을 눌러 오늘의 메뉴를 추천받으세요!</p>
                <button id="recommend-btn">메뉴 추천받기</button>
            </div>
        `;
    }

    addEvents() {
        const btn = this.shadowRoot.getElementById('recommend-btn');
        btn.addEventListener('click', () => this.recommendFood());
    }

    recommendFood() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const btn = this.shadowRoot.getElementById('recommend-btn');
        const icon = this.shadowRoot.getElementById('icon');
        const card = this.shadowRoot.getElementById('card');
        const nameEl = this.shadowRoot.getElementById('food-name');
        const categoryEl = this.shadowRoot.getElementById('category');
        const descEl = this.shadowRoot.getElementById('desc');

        btn.disabled = true;
        btn.textContent = "메뉴 고르는 중...";
        
        // Random shuffle effect
        let counter = 0;
        const interval = setInterval(() => {
            const randomFood = foodData[Math.floor(Math.random() * foodData.length)];
            icon.textContent = randomFood.icon;
            counter++;
            
            if (counter > 15) {
                clearInterval(interval);
                this.finalizeRecommendation(card, icon, nameEl, categoryEl, descEl, btn);
            }
        }, 80);
    }

    finalizeRecommendation(card, icon, nameEl, categoryEl, descEl, btn) {
        const pick = foodData[Math.floor(Math.random() * foodData.length)];
        
        // Remove animation class to re-trigger it
        card.classList.remove('result-show');
        void card.offsetWidth; // Trigger reflow
        card.classList.add('result-show');

        icon.textContent = pick.icon;
        nameEl.textContent = pick.name;
        categoryEl.textContent = pick.category;
        descEl.textContent = pick.desc;

        btn.textContent = "다른 거 먹을래요";
        btn.disabled = false;
        this.isAnimating = false;
    }
}

customElements.define('food-recommender', FoodRecommender);

// Global Theme Logic (Preserved)
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        toggleButton.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // Initial Load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDarkScheme.matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    // Toggle Click
    toggleButton.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });
});
