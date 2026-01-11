/**
 * ResultCard 컴포넌트
 * - 결과 이미지 생성 (Canvas API)
 * - 공유 기능 (Web Share API)
 * - 이미지 다운로드
 */

import { foods } from '../data/foods.js';

class ResultCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.food = null;
        this.mode = 'random';
        this.imageLoaded = false;
        this.foodImage = null;
    }

    static get observedAttributes() {
        return ['food-id', 'mode'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'food-id' && newValue) {
            this.food = foods.find(f => f.id === parseInt(newValue));
        }
        if (name === 'mode') {
            this.mode = newValue;
        }
        if (this.food) {
            this.render();
        }
    }

    connectedCallback() {
        if (this.food) {
            this.render();
        }
    }

    getModeLabel() {
        const labels = {
            random: '랜덤 추천',
            worldcup: '이상형 월드컵',
            tarot: '음식 타로',
            balance: '밸런스 게임',
            fullcourse: '풀코스'
        };
        return labels[this.mode] || '추천';
    }

    render() {
        if (!this.food) return;

        this.shadowRoot.innerHTML = `
            <style>
                ${this.getStyles()}
            </style>
            <div class="result-container">
                <div class="result-header">
                    <span class="mode-badge">${this.getModeLabel()}</span>
                    <h2>오늘의 메뉴가 결정되었습니다!</h2>
                </div>

                <div class="result-card" id="result-card">
                    <div class="card-inner">
                        <div class="card-image" id="card-image">
                            <div class="image-placeholder">${this.food.emoji}</div>
                        </div>
                        <div class="card-content">
                            <span class="food-category">${this.food.category}</span>
                            <h3 class="food-name">${this.food.name}</h3>
                            <p class="food-desc">${this.food.desc}</p>
                        </div>
                        <div class="card-footer">
                            <span class="app-name">What to Eat</span>
                            <span class="date">${this.getFormattedDate()}</span>
                        </div>
                    </div>
                </div>

                <div class="action-buttons">
                    <button class="action-btn primary" id="share-btn">
                        <span class="btn-icon">📤</span>
                        공유하기
                    </button>
                    <button class="action-btn secondary" id="download-btn">
                        <span class="btn-icon">💾</span>
                        이미지 저장
                    </button>
                    <button class="action-btn tertiary" id="copy-btn">
                        <span class="btn-icon">📋</span>
                        링크 복사
                    </button>
                </div>

                <button class="retry-btn" id="home-btn">🏠 처음으로 돌아가기</button>
            </div>

            <canvas id="share-canvas" style="display: none;"></canvas>
        `;

        this.loadFoodImage();
        this.bindEvents();
    }

    getFormattedDate() {
        const now = new Date();
        return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
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

            .result-container {
                background: var(--glass-bg, rgba(255, 255, 255, 0.7));
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.5));
                border-radius: var(--radius, 24px);
                padding: 2rem;
                box-shadow: var(--glass-shadow, 0 8px 32px 0 rgba(31, 38, 135, 0.1));
                text-align: center;
            }

            .result-header {
                margin-bottom: 2rem;
            }

            .mode-badge {
                display: inline-block;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 0.4rem 1rem;
                border-radius: 50px;
                font-size: 0.85rem;
                font-weight: 700;
                margin-bottom: 1rem;
            }

            .result-header h2 {
                font-size: 1.5rem;
                color: var(--text-main, #2d3436);
                margin: 0;
            }

            .result-card {
                background: white;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                margin: 0 auto 2rem;
                max-width: 400px;
            }

            .card-inner {
                position: relative;
            }

            .card-image {
                width: 100%;
                height: 250px;
                overflow: hidden;
            }

            .card-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
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

            .card-content {
                padding: 1.5rem;
                background: white;
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
            }

            .food-name {
                font-size: 2rem;
                color: #2d3436;
                margin: 0.5rem 0;
                font-weight: 800;
            }

            .food-desc {
                color: #636e72;
                font-size: 1rem;
                margin: 0;
            }

            .card-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 1.5rem;
                background: linear-gradient(135deg, #ff6b6b, #ffa502);
                color: white;
            }

            .app-name {
                font-weight: 700;
            }

            .date {
                font-size: 0.9rem;
                opacity: 0.9;
            }

            .action-buttons {
                display: flex;
                gap: 0.8rem;
                justify-content: center;
                flex-wrap: wrap;
                margin-bottom: 1.5rem;
            }

            .action-btn {
                display: flex;
                align-items: center;
                gap: 0.5rem;
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
                box-shadow: 0 5px 20px rgba(255, 107, 107, 0.3);
            }

            .action-btn.secondary {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
            }

            .action-btn.tertiary {
                background: var(--glass-bg, rgba(255, 255, 255, 0.9));
                color: var(--text-main, #2d3436);
                border: 2px solid var(--glass-border, rgba(0, 0, 0, 0.1));
            }

            .action-btn:hover {
                transform: translateY(-2px);
            }

            .action-btn:active {
                transform: translateY(0);
            }

            .btn-icon {
                font-size: 1.1rem;
            }

            .retry-btn {
                background: transparent;
                border: 2px solid var(--text-muted, #636e72);
                color: var(--text-muted, #636e72);
                padding: 0.8rem 2rem;
                border-radius: 50px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .retry-btn:hover {
                border-color: var(--text-main, #2d3436);
                color: var(--text-main, #2d3436);
            }

            /* 토스트 메시지 */
            .toast {
                position: fixed;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: #2d3436;
                color: white;
                padding: 1rem 2rem;
                border-radius: 50px;
                font-weight: 600;
                opacity: 0;
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .toast.show {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        `;
    }

    loadFoodImage() {
        const container = this.shadowRoot.getElementById('card-image');
        if (!container || !this.food) return;

        const img = document.createElement('img');
        img.alt = this.food.name;

        img.onload = () => {
            this.foodImage = img;
            this.imageLoaded = true;
            container.innerHTML = '';
            container.appendChild(img);
        };

        img.src = this.food.image;
    }

    bindEvents() {
        // 공유 버튼
        this.shadowRoot.getElementById('share-btn').addEventListener('click', () => {
            this.shareResult();
        });

        // 다운로드 버튼
        this.shadowRoot.getElementById('download-btn').addEventListener('click', () => {
            this.downloadImage();
        });

        // 링크 복사 버튼
        this.shadowRoot.getElementById('copy-btn').addEventListener('click', () => {
            this.copyLink();
        });

        // 홈 버튼
        this.shadowRoot.getElementById('home-btn').addEventListener('click', () => {
            // 모드 허브로 돌아가기
            this.dispatchEvent(new CustomEvent('go-home', {
                bubbles: true,
                composed: true
            }));
        });
    }

    async generateShareImage() {
        const canvas = this.shadowRoot.getElementById('share-canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 600;
        canvas.height = 800;

        // 배경 그라데이션
        const gradient = ctx.createLinearGradient(0, 0, 600, 800);
        gradient.addColorStop(0, '#ff6b6b');
        gradient.addColorStop(1, '#ffa502');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 600, 800);

        // 카드 영역 (흰색)
        ctx.fillStyle = 'white';
        this.roundRect(ctx, 50, 100, 500, 600, 30);
        ctx.fill();

        // 이미지 영역
        if (this.foodImage && this.imageLoaded) {
            ctx.save();
            this.roundRect(ctx, 70, 120, 460, 300, 20);
            ctx.clip();
            ctx.drawImage(this.foodImage, 70, 120, 460, 300);
            ctx.restore();
        } else {
            // 이모지 폴백
            ctx.fillStyle = '#f6d365';
            this.roundRect(ctx, 70, 120, 460, 300, 20);
            ctx.fill();
            ctx.font = '100px serif';
            ctx.textAlign = 'center';
            ctx.fillText(this.food.emoji, 300, 300);
        }

        // 카테고리
        ctx.fillStyle = 'rgba(255, 107, 107, 0.1)';
        this.roundRect(ctx, 220, 440, 160, 35, 17);
        ctx.fill();
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.food.category, 300, 463);

        // 음식 이름
        ctx.fillStyle = '#2d3436';
        ctx.font = 'bold 48px sans-serif';
        ctx.fillText(this.food.name, 300, 530);

        // 설명
        ctx.fillStyle = '#636e72';
        ctx.font = '20px sans-serif';
        ctx.fillText(this.food.desc, 300, 575);

        // 하단 바
        const footerGradient = ctx.createLinearGradient(50, 630, 550, 700);
        footerGradient.addColorStop(0, '#ff6b6b');
        footerGradient.addColorStop(1, '#ffa502');
        ctx.fillStyle = footerGradient;
        this.roundRect(ctx, 50, 630, 500, 70, { tl: 0, tr: 0, bl: 30, br: 30 });
        ctx.fill();

        // 앱 이름
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('What to Eat', 80, 672);

        // 날짜
        ctx.textAlign = 'right';
        ctx.font = '16px sans-serif';
        ctx.fillText(this.getFormattedDate(), 520, 672);

        // 상단 모드 배지
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.getModeLabel()} 결과`, 300, 60);

        return canvas.toDataURL('image/png');
    }

    roundRect(ctx, x, y, w, h, r) {
        if (typeof r === 'number') {
            r = { tl: r, tr: r, br: r, bl: r };
        }
        ctx.beginPath();
        ctx.moveTo(x + r.tl, y);
        ctx.lineTo(x + w - r.tr, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
        ctx.lineTo(x + w, y + h - r.br);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
        ctx.lineTo(x + r.bl, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
        ctx.lineTo(x, y + r.tl);
        ctx.quadraticCurveTo(x, y, x + r.tl, y);
        ctx.closePath();
    }

    async shareResult() {
        const shareData = {
            title: 'What to Eat - 오늘의 메뉴',
            text: `오늘 ${this.getModeLabel()}으로 결정된 메뉴는 "${this.food.name}"! ${this.food.desc}`,
            url: window.location.href
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    this.copyLink();
                }
            }
        } else {
            this.copyLink();
        }
    }

    async downloadImage() {
        try {
            const imageUrl = await this.generateShareImage();
            const link = document.createElement('a');
            link.download = `what-to-eat-${this.food.name}-${Date.now()}.png`;
            link.href = imageUrl;
            link.click();
            this.showToast('이미지가 저장되었습니다!');
        } catch (err) {
            console.error('Download failed:', err);
            this.showToast('저장에 실패했습니다');
        }
    }

    async copyLink() {
        try {
            const text = `오늘 ${this.getModeLabel()}으로 결정된 메뉴는 "${this.food.name}"! ${this.food.desc} - What to Eat`;
            await navigator.clipboard.writeText(text);
            this.showToast('클립보드에 복사되었습니다!');
        } catch (err) {
            console.error('Copy failed:', err);
            this.showToast('복사에 실패했습니다');
        }
    }

    showToast(message) {
        // 기존 토스트 제거
        const existingToast = this.shadowRoot.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        this.shadowRoot.appendChild(toast);

        // 애니메이션
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}

customElements.define('result-card', ResultCard);

export default ResultCard;
