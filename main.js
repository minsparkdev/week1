// Food Data with English keywords for AI Image Generation
const foodData = [
    { name: "김치찌개", category: "한식", keyword: "Kimchi stew korean food delicious", desc: "얼큰하고 칼칼한 국물이 땡기는 날" },
    { name: "삼겹살", category: "한식", keyword: "Grilled Pork Belly korean bbq", desc: "지글지글 구워지는 고기 소리" },
    { name: "비빔밥", category: "한식", keyword: "Bibimbap colorful korean food", desc: "신선한 야채와 고추장의 조화" },
    { name: "초밥", category: "일식", keyword: "Sushi platter fresh", desc: "깔끔하고 신선한 한 끼" },
    { name: "라멘", category: "일식", keyword: "Japanese Ramen noodles rich broth", desc: "진한 국물과 쫄깃한 면발" },
    { name: "돈까스", category: "일식", keyword: "Tonkatsu pork cutlet crispy", desc: "바삭바삭한 튀김의 유혹" },
    { name: "짜장면", category: "중식", keyword: "Jajangmyeon black bean noodles", desc: "국민 배달 음식의 정석" },
    { name: "마라탕", category: "중식", keyword: "Malatang spicy hot pot", desc: "스트레스 풀리는 매운 맛" },
    { name: "탕수육", category: "중식", keyword: "Sweet and sour pork chinese", desc: "부먹? 찍먹? 일단 먹자" },
    { name: "피자", category: "양식", keyword: "Pepperoni Pizza cheesy", desc: "치즈가 쭉 늘어나는 행복" },
    { name: "파스타", category: "양식", keyword: "Creamy Pasta plating", desc: "분위기 있게 즐기는 한 끼" },
    { name: "햄버거", category: "양식", keyword: "Juicy Burger with fries", desc: "빠르고 든든하게 채우는 맛" },
    { name: "치킨", category: "야식", keyword: "Fried Chicken crispy", desc: "오늘 밤은 치느님과 함께" },
    { name: "떡볶이", category: "분식", keyword: "Tteokbokki spicy rice cake", desc: "매콤달콤 중독성 있는 맛" },
    { name: "샐러드", category: "다이어트", keyword: "Fresh Salad bowl healthy", desc: "가볍고 건강하게" }
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
                    border-radius: 24px;
                    padding: 0;
                    box-shadow: var(--shadow-md, 0 8px 24px rgba(0,0,0,0.12));
                    text-align: center;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                    border: 1px solid rgba(0,0,0,0.05);
                    display: flex;
                    flex-direction: column;
                }
                
                .image-area {
                    width: 100%;
                    height: 300px;
                    background-color: #eee;
                    position: relative;
                    overflow: hidden;
                }

                .image-area img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                
                /* Placeholder pattern */
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
                    padding: 2rem;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
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
                    margin-bottom: 2rem;
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

                button:disabled {
                    opacity: 0.7;
                    cursor: wait;
                    background: #adb5bd;
                    box-shadow: none;
                }

                /* Animation Classes */
                .result-show .image-area img {
                    animation: zoomIn 0.5s ease-out;
                }

                @keyframes zoomIn {
                    from { transform: scale(1.1); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
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

    addEvents() {
        const btn = this.shadowRoot.getElementById('recommend-btn');
        btn.addEventListener('click', () => this.recommendFood());
    }

    recommendFood() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const btn = this.shadowRoot.getElementById('recommend-btn');
        const imgArea = this.shadowRoot.getElementById('image-area');
        const nameEl = this.shadowRoot.getElementById('food-name');
        const categoryEl = this.shadowRoot.getElementById('category');
        
        btn.disabled = true;
        btn.textContent = "AI가 메뉴를 고르는 중...";
        
        // Shuffle effect
        let counter = 0;
        const interval = setInterval(() => {
            const randomFood = foodData[Math.floor(Math.random() * foodData.length)];
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

        // Pick a food
        const pick = foodData[Math.floor(Math.random() * foodData.length)];
        
        // Update Text
        nameEl.textContent = pick.name;
        categoryEl.textContent = pick.category;
        descEl.textContent = pick.desc;

        // Generate AI Image URL (Pollinations.ai)
        // Using random seed to avoid caching same image for same food if requested again, 
        // or removing seed to get consistent best match. Let's use a random seed for variety.
        const seed = Math.floor(Math.random() * 1000);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(pick.keyword)}%20high%20quality%20food%20photography%204k?width=800&height=600&nologo=true&seed=${seed}`;

        // Create and load image
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = pick.name;
        
        img.onload = () => {
            imgArea.innerHTML = '';
            imgArea.appendChild(img);
            
            card.classList.remove('result-show');
            void card.offsetWidth; 
            card.classList.add('result-show');
            
            btn.textContent = "다른 거 추천받기";
            btn.disabled = false;
            this.isAnimating = false;
        };

        img.onerror = () => {
            imgArea.innerHTML = '<div class="image-placeholder">😋</div>';
            btn.textContent = "다른 거 추천받기";
            btn.disabled = false;
            this.isAnimating = false;
        };
    }
}

customElements.define('food-recommender', FoodRecommender);

// Global Theme Logic
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        toggleButton.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDarkScheme.matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    toggleButton.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });
});