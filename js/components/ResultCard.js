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

    getRetryLabel() {
        const labels = {
            random: { icon: '🎲', text: '다시 뽑기' },
            worldcup: { icon: '🏆', text: '다시 도전' },
            tarot: { icon: '🔮', text: '다시 뽑기' },
            balance: { icon: '⚖️', text: '다시 도전' },
            fullcourse: { icon: '🍽️', text: '다시 도전' }
        };
        return labels[this.mode] || { icon: '🔄', text: '다시 하기' };
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

                <div class="bottom-buttons">
                    <button class="retry-btn primary-retry" id="retry-btn">
                        <span class="btn-icon">${this.getRetryLabel().icon}</span>
                        ${this.getRetryLabel().text}
                    </button>
                    <button class="retry-btn" id="home-btn">
                        <span class="btn-icon">🏠</span>
                        처음으로
                    </button>
                </div>
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
                from { opacity: 0; transform: translateY(16px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .result-container {
                background: #FFFFFF;
                border: 1px solid rgba(74, 68, 88, 0.08);
                border-radius: 24px;
                padding: 1.5rem;
                box-shadow: 0 4px 20px rgba(74, 68, 88, 0.08);
                text-align: center;
            }

            .result-header {
                margin-bottom: 1.5rem;
            }

            .mode-badge {
                display: inline-block;
                background: linear-gradient(135deg, #D4C1EC, #B8E0D2);
                color: white;
                padding: 6px 14px;
                border-radius: 9999px;
                font-size: 0.75rem;
                font-weight: 600;
                margin-bottom: 0.75rem;
            }

            .result-header h2 {
                font-size: 1.125rem;
                color: #4A4458;
                margin: 0;
                font-weight: 600;
            }

            .result-card {
                background: white;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 8px 32px rgba(74, 68, 88, 0.12);
                margin: 0 auto 1.5rem;
                max-width: 360px;
                border: 1px solid rgba(74, 68, 88, 0.08);
            }

            .card-inner {
                position: relative;
            }

            .card-image {
                width: 100%;
                height: 220px;
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
                background: linear-gradient(135deg, #FFDAC1 0%, #FFB5A7 100%);
                font-size: 4rem;
            }

            .card-content {
                padding: 1.25rem;
                background: white;
            }

            .food-category {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 9999px;
                background: #FFDAC1;
                color: #E07565;
                font-size: 0.7rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
                text-transform: uppercase;
            }

            .food-name {
                font-size: 1.5rem;
                color: #4A4458;
                margin: 0.5rem 0;
                font-weight: 700;
            }

            .food-desc {
                color: #7D7A8C;
                font-size: 0.875rem;
                margin: 0;
            }

            .card-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.875rem 1.25rem;
                background: linear-gradient(135deg, #FFB5A7, #FFC8A2);
                color: white;
            }

            .app-name {
                font-weight: 600;
                font-size: 0.875rem;
            }

            .date {
                font-size: 0.8rem;
                opacity: 0.9;
            }

            .action-buttons {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                flex-wrap: wrap;
                margin-bottom: 1.25rem;
            }

            .action-btn {
                display: flex;
                align-items: center;
                gap: 0.4rem;
                padding: 0.75rem 1rem;
                border-radius: 16px;
                font-size: 0.8rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.25s ease;
                border: none;
            }

            .action-btn.primary {
                background: linear-gradient(135deg, #FFB5A7, #FFC8A2);
                color: white;
                box-shadow: 0 6px 20px rgba(255, 139, 123, 0.25);
            }

            .action-btn.secondary {
                background: linear-gradient(135deg, #D4C1EC, #B8E0D2);
                color: white;
                box-shadow: 0 6px 20px rgba(212, 193, 236, 0.25);
            }

            .action-btn.tertiary {
                background: #FFFFFF;
                color: #4A4458;
                border: 1px solid rgba(74, 68, 88, 0.08);
            }

            .action-btn:hover {
                transform: translateY(-2px);
            }

            .action-btn:active {
                transform: translateY(0);
            }

            .btn-icon {
                font-size: 1rem;
            }

            .bottom-buttons {
                display: flex;
                gap: 0.75rem;
                justify-content: center;
            }

            .retry-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.4rem;
                background: transparent;
                border: 1px solid rgba(74, 68, 88, 0.2);
                color: #7D7A8C;
                padding: 0.75rem 1.25rem;
                border-radius: 16px;
                font-size: 0.875rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.25s ease;
            }

            .retry-btn:hover {
                border-color: #4A4458;
                color: #4A4458;
                transform: translateY(-2px);
            }

            .retry-btn.primary-retry {
                background: linear-gradient(135deg, #FFB5A7, #FFC8A2);
                border: none;
                color: white;
                font-weight: 600;
                box-shadow: 0 6px 20px rgba(255, 139, 123, 0.25);
            }

            .retry-btn.primary-retry:hover {
                box-shadow: 0 8px 24px rgba(255, 139, 123, 0.35);
                color: white;
            }

            .retry-btn .btn-icon {
                font-size: 1rem;
            }

            /* 토스트 메시지 */
            .toast {
                position: fixed;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: #4A4458;
                color: white;
                padding: 0.875rem 1.5rem;
                border-radius: 16px;
                font-weight: 500;
                font-size: 0.875rem;
                opacity: 0;
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .toast.show {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }

            /* Tablet */
            @media (max-width: 600px) {
                .result-container {
                    padding: 1rem;
                    border-radius: 16px;
                }

                .result-header {
                    margin-bottom: 1rem;
                }

                .mode-badge {
                    padding: 4px 10px;
                    font-size: 0.625rem;
                    margin-bottom: 0.5rem;
                }

                .result-header h2 {
                    font-size: 0.875rem;
                }

                .result-card {
                    max-width: 280px;
                    margin-bottom: 1rem;
                    border-radius: 14px;
                }

                .card-image {
                    height: 160px;
                }

                .image-placeholder {
                    font-size: 3rem;
                }

                .card-content {
                    padding: 0.875rem;
                }

                .food-category {
                    padding: 3px 8px;
                    font-size: 0.5rem;
                    margin-bottom: 0.375rem;
                }

                .food-name {
                    font-size: 1.125rem;
                    margin: 0.25rem 0;
                }

                .food-desc {
                    font-size: 0.75rem;
                }

                .card-footer {
                    padding: 0.625rem 0.875rem;
                }

                .app-name {
                    font-size: 0.75rem;
                }

                .date {
                    font-size: 0.7rem;
                }
            }

            /* Mobile */
            @media (max-width: 480px) {
                .result-container {
                    padding: 0.75rem;
                }

                .result-card {
                    max-width: 240px;
                    border-radius: 12px;
                }

                .card-image {
                    height: 130px;
                }

                .image-placeholder {
                    font-size: 2.5rem;
                }

                .card-content {
                    padding: 0.75rem;
                }

                .food-name {
                    font-size: 1rem;
                }

                .food-desc {
                    font-size: 0.7rem;
                }

                .action-buttons {
                    gap: 0.375rem;
                    margin-bottom: 0.75rem;
                }

                .action-btn {
                    padding: 0.5rem 0.75rem;
                    font-size: 0.7rem;
                    border-radius: 10px;
                    gap: 0.25rem;
                }

                .btn-icon {
                    font-size: 0.875rem;
                }

                .bottom-buttons {
                    gap: 0.5rem;
                }

                .retry-btn {
                    padding: 0.625rem 1rem;
                    font-size: 0.75rem;
                    border-radius: 12px;
                }

                .retry-btn .btn-icon {
                    font-size: 0.875rem;
                }

                .toast {
                    padding: 0.625rem 1rem;
                    font-size: 0.75rem;
                    border-radius: 12px;
                    bottom: 1rem;
                }
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

        // 다시 하기 버튼
        this.shadowRoot.getElementById('retry-btn').addEventListener('click', () => {
            // 현재 모드 다시 시작
            this.dispatchEvent(new CustomEvent('retry-mode', {
                detail: { mode: this.mode },
                bubbles: true,
                composed: true
            }));
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

        // 배경 그라데이션 - Warm Pastel
        const gradient = ctx.createLinearGradient(0, 0, 600, 800);
        gradient.addColorStop(0, '#FFB5A7');
        gradient.addColorStop(0.5, '#FFC8A2');
        gradient.addColorStop(1, '#FFD6BA');
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
            // 이모지 폴백 - Warm Pastel gradient
            const placeholderGradient = ctx.createLinearGradient(70, 120, 530, 420);
            placeholderGradient.addColorStop(0, '#FFDAC1');
            placeholderGradient.addColorStop(1, '#FFB5A7');
            ctx.fillStyle = placeholderGradient;
            this.roundRect(ctx, 70, 120, 460, 300, 20);
            ctx.fill();
            ctx.font = '100px serif';
            ctx.textAlign = 'center';
            ctx.fillText(this.food.emoji, 300, 300);
        }

        // 카테고리
        ctx.fillStyle = '#FFDAC1';
        this.roundRect(ctx, 220, 440, 160, 35, 17);
        ctx.fill();
        ctx.fillStyle = '#E07565';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.food.category.toUpperCase(), 300, 463);

        // 음식 이름
        ctx.fillStyle = '#4A4458';
        ctx.font = 'bold 44px sans-serif';
        ctx.fillText(this.food.name, 300, 525);

        // 설명
        ctx.fillStyle = '#7D7A8C';
        ctx.font = '18px sans-serif';
        ctx.fillText(this.food.desc, 300, 570);

        // 하단 바 - Warm Pastel gradient
        const footerGradient = ctx.createLinearGradient(50, 630, 550, 700);
        footerGradient.addColorStop(0, '#FFB5A7');
        footerGradient.addColorStop(1, '#FFC8A2');
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
