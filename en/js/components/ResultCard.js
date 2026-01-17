/**
 * ResultCard Component
 * - Result image generation (Canvas API)
 * - Share functionality (Web Share API)
 * - Image download
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
            random: 'Quick Pick',
            worldcup: 'Food World Cup',
            tarot: 'Food Tarot',
            balance: 'Balance Game',
            fullcourse: 'Full Course'
        };
        return labels[this.mode] || 'Recommendation';
    }

    getRetryLabel() {
        const labels = {
            random: { icon: '🎲', text: 'Pick Again' },
            worldcup: { icon: '🏆', text: 'Try Again' },
            tarot: { icon: '🔮', text: 'Pick Again' },
            balance: { icon: '⚖️', text: 'Try Again' },
            fullcourse: { icon: '🍽️', text: 'Try Again' }
        };
        return labels[this.mode] || { icon: '🔄', text: 'Try Again' };
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
                    <h2>Today's menu has been decided!</h2>
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
                        Share
                    </button>
                    <button class="action-btn secondary" id="download-btn">
                        <span class="btn-icon">💾</span>
                        Save Image
                    </button>
                </div>

                <!-- SNS Share Modal -->
                <div class="share-modal" id="share-modal">
                    <div class="share-modal-backdrop" id="share-backdrop"></div>
                    <div class="share-modal-content">
                        <div class="share-modal-header">
                            <h3>Share</h3>
                            <button class="share-modal-close" id="share-close">✕</button>
                        </div>
                        <div class="share-options">
                            <button class="share-option twitter" id="share-twitter">
                                <span class="share-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                </span>
                                <span class="share-label">X (Twitter)</span>
                            </button>
                            <button class="share-option facebook" id="share-facebook">
                                <span class="share-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                </span>
                                <span class="share-label">Facebook</span>
                            </button>
                            <button class="share-option whatsapp" id="share-whatsapp">
                                <span class="share-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                </span>
                                <span class="share-label">WhatsApp</span>
                            </button>
                            <button class="share-option linkedin" id="share-linkedin">
                                <span class="share-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                </span>
                                <span class="share-label">LinkedIn</span>
                            </button>
                            <button class="share-option copy" id="share-copy">
                                <span class="share-icon">🔗</span>
                                <span class="share-label">Copy Link</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="bottom-buttons">
                    <button class="retry-btn primary-retry" id="retry-btn">
                        <span class="btn-icon">${this.getRetryLabel().icon}</span>
                        ${this.getRetryLabel().text}
                    </button>
                    <button class="retry-btn" id="home-btn">
                        <span class="btn-icon">🏠</span>
                        Home
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

            /* Toast message */
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

            /* SNS Share Modal */
            .share-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1001;
                align-items: center;
                justify-content: center;
            }

            .share-modal.show {
                display: flex;
            }

            .share-modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(74, 68, 88, 0.5);
                backdrop-filter: blur(4px);
                animation: fadeIn 0.2s ease-out;
            }

            .share-modal-content {
                position: relative;
                background: white;
                border-radius: 24px;
                padding: 1.5rem;
                width: 90%;
                max-width: 320px;
                box-shadow: 0 20px 60px rgba(74, 68, 88, 0.3);
                animation: slideUp 0.3s ease-out;
            }

            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .share-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.25rem;
                padding-bottom: 0.75rem;
                border-bottom: 1px solid rgba(74, 68, 88, 0.1);
            }

            .share-modal-header h3 {
                margin: 0;
                font-size: 1.1rem;
                color: #4A4458;
                font-weight: 600;
            }

            .share-modal-close {
                background: none;
                border: none;
                font-size: 1.25rem;
                color: #7D7A8C;
                cursor: pointer;
                padding: 0.25rem;
                line-height: 1;
                transition: color 0.2s;
            }

            .share-modal-close:hover {
                color: #4A4458;
            }

            .share-options {
                display: flex;
                flex-direction: column;
                gap: 0.625rem;
            }

            .share-option {
                display: flex;
                align-items: center;
                gap: 0.875rem;
                padding: 0.875rem 1rem;
                border: none;
                border-radius: 14px;
                background: #F8F7FA;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: left;
            }

            .share-option:hover {
                transform: translateX(4px);
            }

            .share-option:active {
                transform: translateX(2px);
            }

            .share-icon {
                width: 36px;
                height: 36px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
            }

            .share-icon svg {
                width: 20px;
                height: 20px;
            }

            .share-label {
                font-size: 0.9rem;
                font-weight: 500;
                color: #4A4458;
            }

            /* SNS Brand Colors */
            .share-option.twitter .share-icon {
                background: #000000;
                color: white;
            }

            .share-option.facebook .share-icon {
                background: #1877F2;
                color: white;
            }

            .share-option.whatsapp .share-icon {
                background: #25D366;
                color: white;
            }

            .share-option.linkedin .share-icon {
                background: #0A66C2;
                color: white;
            }

            .share-option.copy .share-icon {
                background: linear-gradient(135deg, #FFB5A7, #FFC8A2);
                color: white;
            }

            .share-option.twitter:hover { background: #E8E8E8; }
            .share-option.facebook:hover { background: #E7F0FD; }
            .share-option.whatsapp:hover { background: #D9F5E6; }
            .share-option.linkedin:hover { background: #E1EEF8; }
            .share-option.copy:hover { background: #FFF0ED; }

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
        // Share button - open modal
        this.shadowRoot.getElementById('share-btn').addEventListener('click', () => {
            this.openShareModal();
        });

        // Download button
        this.shadowRoot.getElementById('download-btn').addEventListener('click', () => {
            this.downloadImage();
        });

        // Retry button
        this.shadowRoot.getElementById('retry-btn').addEventListener('click', () => {
            // Restart current mode
            this.dispatchEvent(new CustomEvent('retry-mode', {
                detail: { mode: this.mode },
                bubbles: true,
                composed: true
            }));
        });

        // Home button
        this.shadowRoot.getElementById('home-btn').addEventListener('click', () => {
            // Return to mode hub
            this.dispatchEvent(new CustomEvent('go-home', {
                bubbles: true,
                composed: true
            }));
        });

        // Share modal events
        this.shadowRoot.getElementById('share-backdrop').addEventListener('click', () => {
            this.closeShareModal();
        });
        this.shadowRoot.getElementById('share-close').addEventListener('click', () => {
            this.closeShareModal();
        });

        // SNS share buttons
        this.shadowRoot.getElementById('share-twitter').addEventListener('click', () => {
            this.shareToTwitter();
        });
        this.shadowRoot.getElementById('share-facebook').addEventListener('click', () => {
            this.shareToFacebook();
        });
        this.shadowRoot.getElementById('share-whatsapp').addEventListener('click', () => {
            this.shareToWhatsApp();
        });
        this.shadowRoot.getElementById('share-linkedin').addEventListener('click', () => {
            this.shareToLinkedIn();
        });
        this.shadowRoot.getElementById('share-copy').addEventListener('click', () => {
            this.copyLink();
            this.closeShareModal();
        });
    }

    openShareModal() {
        this.shadowRoot.getElementById('share-modal').classList.add('show');
    }

    closeShareModal() {
        this.shadowRoot.getElementById('share-modal').classList.remove('show');
    }

    async generateShareImage() {
        const canvas = this.shadowRoot.getElementById('share-canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 600;
        canvas.height = 800;

        // Background gradient - Warm Pastel
        const gradient = ctx.createLinearGradient(0, 0, 600, 800);
        gradient.addColorStop(0, '#FFB5A7');
        gradient.addColorStop(0.5, '#FFC8A2');
        gradient.addColorStop(1, '#FFD6BA');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 600, 800);

        // Card area (white)
        ctx.fillStyle = 'white';
        this.roundRect(ctx, 50, 100, 500, 600, 30);
        ctx.fill();

        // Image area
        if (this.foodImage && this.imageLoaded) {
            ctx.save();
            this.roundRect(ctx, 70, 120, 460, 300, 20);
            ctx.clip();
            ctx.drawImage(this.foodImage, 70, 120, 460, 300);
            ctx.restore();
        } else {
            // Emoji fallback - Warm Pastel gradient
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

        // Category
        ctx.fillStyle = '#FFDAC1';
        this.roundRect(ctx, 220, 440, 160, 35, 17);
        ctx.fill();
        ctx.fillStyle = '#E07565';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.food.category.toUpperCase(), 300, 463);

        // Food name
        ctx.fillStyle = '#4A4458';
        ctx.font = 'bold 44px sans-serif';
        ctx.fillText(this.food.name, 300, 525);

        // Description
        ctx.fillStyle = '#7D7A8C';
        ctx.font = '18px sans-serif';
        ctx.fillText(this.food.desc, 300, 570);

        // Footer bar - Warm Pastel gradient
        const footerGradient = ctx.createLinearGradient(50, 630, 550, 700);
        footerGradient.addColorStop(0, '#FFB5A7');
        footerGradient.addColorStop(1, '#FFC8A2');
        ctx.fillStyle = footerGradient;
        this.roundRect(ctx, 50, 630, 500, 70, { tl: 0, tr: 0, bl: 30, br: 30 });
        ctx.fill();

        // App name
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('What to Eat', 80, 672);

        // Date
        ctx.textAlign = 'right';
        ctx.font = '16px sans-serif';
        ctx.fillText(this.getFormattedDate(), 520, 672);

        // Top mode badge
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.getModeLabel()} Result`, 300, 60);

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

    getShareText() {
        return `Today's ${this.getModeLabel()} result is "${this.food.name}"! ${this.food.desc}`;
    }

    getShareUrl() {
        return window.location.href;
    }

    shareToTwitter() {
        const text = encodeURIComponent(this.getShareText());
        const url = encodeURIComponent(this.getShareUrl());
        const hashtags = encodeURIComponent('WhatToEat,FoodPicker');

        const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`;

        window.open(twitterUrl, '_blank', 'width=600,height=400');
        this.closeShareModal();
        this.showToast('Sharing to X (Twitter)');
    }

    shareToFacebook() {
        const url = encodeURIComponent(this.getShareUrl());

        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;

        window.open(facebookUrl, '_blank', 'width=600,height=400');
        this.closeShareModal();
        this.showToast('Sharing to Facebook');
    }

    shareToWhatsApp() {
        const text = encodeURIComponent(this.getShareText() + ' - ' + this.getShareUrl());

        const whatsappUrl = `https://wa.me/?text=${text}`;

        window.open(whatsappUrl, '_blank', 'width=600,height=400');
        this.closeShareModal();
        this.showToast('Sharing to WhatsApp');
    }

    shareToLinkedIn() {
        const url = encodeURIComponent(this.getShareUrl());

        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;

        window.open(linkedInUrl, '_blank', 'width=600,height=400');
        this.closeShareModal();
        this.showToast('Sharing to LinkedIn');
    }

    async shareResult() {
        // Use Web Share API (native sharing on mobile)
        const shareData = {
            title: 'What to Eat - Today\'s Menu',
            text: this.getShareText(),
            url: this.getShareUrl()
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    this.openShareModal();
                }
            }
        } else {
            this.openShareModal();
        }
    }

    async downloadImage() {
        try {
            const imageUrl = await this.generateShareImage();
            const link = document.createElement('a');
            link.download = `what-to-eat-${this.food.name}-${Date.now()}.png`;
            link.href = imageUrl;
            link.click();
            this.showToast('Image saved!');
        } catch (err) {
            console.error('Download failed:', err);
            this.showToast('Save failed');
        }
    }

    async copyLink() {
        try {
            const text = this.getShareText() + '\n' + this.getShareUrl();
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard!');
        } catch (err) {
            console.error('Copy failed:', err);
            this.showToast('Copy failed');
        }
    }

    showToast(message) {
        // Remove existing toast
        const existingToast = this.shadowRoot.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        this.shadowRoot.appendChild(toast);

        // Animation
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
