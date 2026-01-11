/**
 * PaymentGame 컴포넌트
 * - 밥값 결제자 선정 게임
 * - 룰렛 휠 + 사다리타기 탭 전환
 *
 * 설계 원칙:
 * - 상태와 렌더링 분리
 * - 게임 로직 모듈화 (RouletteEngine, LadderEngine)
 * - 설정값 상수화
 * - 확장 가능한 구조 (새 게임 추가 용이)
 */

// ========== 상수 정의 ==========
const CONFIG = {
    // 참가자 설정
    MIN_PARTICIPANTS: 2,
    MAX_PARTICIPANTS: 10,
    MAX_NAME_LENGTH: 10,

    // 룰렛 설정
    ROULETTE: {
        MIN_DURATION: 4000,
        MAX_DURATION: 6000,
        MIN_ROTATIONS: 5,
        MAX_ROTATIONS: 8,
        RADIUS_PADDING: 20,
        CENTER_RADIUS: 20,
    },

    // 사다리 설정
    LADDER: {
        ROWS: 12,
        ANIMATION_DURATION: 2000,
        PADDING: 40,
        HEADER_HEIGHT: 40,
        FOOTER_HEIGHT: 40,
        BRIDGE_PROBABILITY: 0.5,
    },

    // 캔버스 크기
    CANVAS: {
        WIDTH: 320,
        ROULETTE_HEIGHT: 320,
        LADDER_HEIGHT: 384,
    },

    // 색상 팔레트 (기존 테마와 조화)
    COLORS: [
        '#FFB5A7', '#FFC8A2', '#FFDAC1', '#D4C1EC',
        '#B5D8EB', '#C1E7C1', '#FFE5B4', '#E8D5E8',
        '#F0C1C1', '#C1D4F0'
    ],
};

// ========== 유틸리티 함수 ==========
const Utils = {
    degToRad: (degrees) => degrees * (Math.PI / 180),
    radToDeg: (radians) => radians * (180 / Math.PI),
    randomRange: (min, max) => min + Math.random() * (max - min),
    easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
    easeOutQuad: (t) => 1 - (1 - t) * (1 - t),
};

// ========== 룰렛 엔진 ==========
class RouletteEngine {
    constructor(participants, colors) {
        this.participants = participants;
        this.colors = colors;
        this.rotation = 0;
        this.isSpinning = false;
        this.animationId = null;
    }

    draw(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) - CONFIG.ROULETTE.RADIUS_PADDING;
        const sliceAngle = (2 * Math.PI) / this.participants.length;

        ctx.clearRect(0, 0, width, height);

        // 각 섹션 그리기
        this.participants.forEach((name, i) => {
            const startAngle = i * sliceAngle + Utils.degToRad(this.rotation);
            const endAngle = (i + 1) * sliceAngle + Utils.degToRad(this.rotation);

            // 섹션 채우기
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = this.colors[i % this.colors.length];
            ctx.fill();

            // 섹션 테두리
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 이름 텍스트
            this.drawText(ctx, name, centerX, centerY, radius, startAngle + sliceAngle / 2);
        });

        // 중앙 원
        this.drawCenter(ctx, centerX, centerY);
    }

    drawText(ctx, name, centerX, centerY, radius, angle) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#4A4458';
        ctx.font = 'bold 14px Pretendard, sans-serif';
        ctx.fillText(name, radius - 15, 0);
        ctx.restore();
    }

    drawCenter(ctx, centerX, centerY) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, CONFIG.ROULETTE.CENTER_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.strokeStyle = '#FFB5A7';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    spin(onFrame, onComplete) {
        if (this.isSpinning) return;

        this.isSpinning = true;

        const duration = Utils.randomRange(
            CONFIG.ROULETTE.MIN_DURATION,
            CONFIG.ROULETTE.MAX_DURATION
        );
        const rotations = Utils.randomRange(
            CONFIG.ROULETTE.MIN_ROTATIONS,
            CONFIG.ROULETTE.MAX_ROTATIONS
        );
        const endRotation = this.rotation + rotations * 360 + Math.random() * 360;
        const startRotation = this.rotation;
        const startTime = performance.now();

        const animate = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = Utils.easeOutCubic(progress);

            this.rotation = startRotation + (endRotation - startRotation) * eased;
            onFrame();

            if (progress < 1) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                this.isSpinning = false;
                const winner = this.determineWinner();
                onComplete(winner);
            }
        };

        this.animationId = requestAnimationFrame(animate);
    }

    determineWinner() {
        const sliceAngle = 360 / this.participants.length;
        // 포인터는 상단(270도)에 위치
        const normalizedRotation = (360 - (this.rotation % 360) + 270) % 360;
        const winnerIdx = Math.floor(normalizedRotation / sliceAngle);

        return {
            name: this.participants[winnerIdx],
            index: winnerIdx,
        };
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isSpinning = false;
    }

    reset() {
        this.stop();
        this.rotation = 0;
    }
}

// ========== 사다리 엔진 ==========
class LadderEngine {
    constructor(participants, colors) {
        this.participants = participants;
        this.colors = colors;
        this.bridges = [];
        this.paths = [];
        this.animationProgress = 0;
        this.isAnimating = false;
        this.animationId = null;
        this.rows = CONFIG.LADDER.ROWS;
    }

    generateBridges() {
        this.bridges = [];
        const cols = this.participants.length;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < cols - 1; col++) {
                // 인접한 다리가 없고, 확률 조건 충족 시 다리 생성
                const hasLeftBridge = this.bridges.some(
                    b => b.row === row && b.col === col - 1
                );
                if (!hasLeftBridge && Math.random() < CONFIG.LADDER.BRIDGE_PROBABILITY) {
                    this.bridges.push({ row, col });
                }
            }
        }

        // 최소 다리 수 보장
        this.ensureMinimumBridges(cols);
    }

    ensureMinimumBridges(cols) {
        const minBridges = Math.floor(this.rows / 2);
        if (this.bridges.length < minBridges) {
            for (let row = 0; row < this.rows; row += 2) {
                const col = Math.floor(Math.random() * (cols - 1));
                if (!this.bridges.some(b => b.row === row && b.col === col)) {
                    this.bridges.push({ row, col });
                }
            }
        }
    }

    calculatePath(startCol) {
        const path = [];
        let currentCol = startCol;

        for (let row = 0; row <= this.rows; row++) {
            path.push({ row, col: currentCol });

            if (row < this.rows) {
                // 오른쪽 다리 확인
                if (this.hasBridge(row, currentCol)) {
                    currentCol++;
                    path.push({ row: row + 0.5, col: currentCol });
                }
                // 왼쪽 다리 확인
                else if (this.hasBridge(row, currentCol - 1)) {
                    currentCol--;
                    path.push({ row: row + 0.5, col: currentCol });
                }
            }
        }

        return path;
    }

    hasBridge(row, col) {
        return this.bridges.some(b => b.row === row && b.col === col);
    }

    draw(ctx, width, height) {
        const cols = this.participants.length;
        const { PADDING, HEADER_HEIGHT, FOOTER_HEIGHT } = CONFIG.LADDER;

        const drawWidth = width - PADDING * 2;
        const drawHeight = height - HEADER_HEIGHT - FOOTER_HEIGHT;
        const colWidth = cols > 1 ? drawWidth / (cols - 1) : 0;
        const rowHeight = drawHeight / this.rows;

        ctx.clearRect(0, 0, width, height);

        // 참가자 이름 (상단)
        this.drawParticipantNames(ctx, PADDING, colWidth, cols, drawWidth);

        // 세로줄
        this.drawVerticalLines(ctx, PADDING, HEADER_HEIGHT, drawHeight, colWidth, cols, drawWidth);

        // 가로줄 (다리)
        this.drawBridges(ctx, PADDING, HEADER_HEIGHT, colWidth, rowHeight);

        // 애니메이션 경로
        this.drawAnimatedPaths(ctx, PADDING, HEADER_HEIGHT, colWidth, rowHeight, cols, drawWidth);

        // 결과 라벨 (하단)
        if (this.isAnimationComplete()) {
            this.drawResultLabels(ctx, PADDING, colWidth, cols, drawWidth, height);
        }
    }

    drawParticipantNames(ctx, padding, colWidth, cols, drawWidth) {
        ctx.font = 'bold 12px Pretendard, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        this.participants.forEach((name, i) => {
            const x = padding + (cols > 1 ? i * colWidth : drawWidth / 2);

            ctx.beginPath();
            ctx.arc(x, 20, 16, 0, 2 * Math.PI);
            ctx.fillStyle = this.colors[i % this.colors.length];
            ctx.fill();

            ctx.fillStyle = '#4A4458';
            ctx.fillText(name.slice(0, 3), x, 20);
        });
    }

    drawVerticalLines(ctx, padding, headerHeight, drawHeight, colWidth, cols, drawWidth) {
        ctx.strokeStyle = '#D4D2DC';
        ctx.lineWidth = 3;

        this.participants.forEach((_, i) => {
            const x = padding + (cols > 1 ? i * colWidth : drawWidth / 2);
            ctx.beginPath();
            ctx.moveTo(x, headerHeight);
            ctx.lineTo(x, headerHeight + drawHeight);
            ctx.stroke();
        });
    }

    drawBridges(ctx, padding, headerHeight, colWidth, rowHeight) {
        ctx.strokeStyle = '#D4D2DC';
        ctx.lineWidth = 3;

        this.bridges.forEach(bridge => {
            const x1 = padding + bridge.col * colWidth;
            const x2 = padding + (bridge.col + 1) * colWidth;
            const y = headerHeight + (bridge.row + 0.5) * rowHeight;

            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.stroke();
        });
    }

    drawAnimatedPaths(ctx, padding, headerHeight, colWidth, rowHeight, cols, drawWidth) {
        this.paths.forEach((pathData, idx) => {
            if (!pathData.path || pathData.progress <= 0) return;

            ctx.strokeStyle = this.colors[idx % this.colors.length];
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            const pathToDraw = pathData.path.slice(
                0,
                Math.ceil(pathData.progress * pathData.path.length)
            );

            ctx.beginPath();
            pathToDraw.forEach((point, i) => {
                const x = padding + (cols > 1 ? point.col * colWidth : drawWidth / 2);
                const y = headerHeight + point.row * rowHeight;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
        });
    }

    drawResultLabels(ctx, padding, colWidth, cols, drawWidth, canvasHeight) {
        this.participants.forEach((_, i) => {
            const x = padding + (cols > 1 ? i * colWidth : drawWidth / 2);
            const pathData = this.paths[i];
            const lastCol = pathData && pathData.path && pathData.path.length > 0
                ? pathData.path.slice(-1)[0].col
                : undefined;
            const isWinner = lastCol === 0;

            ctx.beginPath();
            ctx.arc(x, canvasHeight - 20, 14, 0, 2 * Math.PI);
            ctx.fillStyle = isWinner ? '#FFB5A7' : '#E0DDE5';
            ctx.fill();

            ctx.fillStyle = isWinner ? '#FFFFFF' : '#7D7A8C';
            ctx.font = 'bold 10px Pretendard, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(isWinner ? '당첨' : '꽝', x, canvasHeight - 20);
        });
    }

    isAnimationComplete() {
        return this.paths.length > 0 && this.paths.every(p => p.progress >= 1);
    }

    start(onFrame, onComplete) {
        if (this.isAnimating) return;

        this.isAnimating = true;

        // 모든 경로 계산
        this.paths = this.participants.map((_, i) => ({
            path: this.calculatePath(i),
            progress: 0,
        }));

        const duration = CONFIG.LADDER.ANIMATION_DURATION;
        const startTime = performance.now();

        const animate = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = Utils.easeOutQuad(progress);

            this.paths.forEach(p => {
                p.progress = eased;
            });

            onFrame();

            if (progress < 1) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                const winner = this.determineWinner();
                onComplete(winner);
            }
        };

        this.animationId = requestAnimationFrame(animate);
    }

    determineWinner() {
        for (let i = 0; i < this.paths.length; i++) {
            const lastPoint = this.paths[i].path.slice(-1)[0];
            if (lastPoint && lastPoint.col === 0) {
                return {
                    name: this.participants[i],
                    index: i,
                };
            }
        }

        // 폴백: 랜덤 선정
        const randomIdx = Math.floor(Math.random() * this.participants.length);
        return {
            name: this.participants[randomIdx],
            index: randomIdx,
        };
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isAnimating = false;
    }

    reset() {
        this.stop();
        this.paths = [];
        this.animationProgress = 0;
    }
}

// ========== 메인 컴포넌트 ==========
class PaymentGame extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // 상태
        this.state = {
            participants: [''],
            currentGame: 'roulette',
            phase: 'input', // 'input' | 'playing' | 'result'
            winner: null,
        };

        // 게임 엔진
        this.rouletteEngine = null;
        this.ladderEngine = null;
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
        this.cleanup();
    }

    cleanup() {
        if (this.rouletteEngine) this.rouletteEngine.stop();
        if (this.ladderEngine) this.ladderEngine.stop();
    }

    // ========== 상태 관리 ==========
    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.render();
    }

    getValidParticipants() {
        return this.state.participants.filter(p => p.trim() !== '');
    }

    canStartGame() {
        return this.getValidParticipants().length >= CONFIG.MIN_PARTICIPANTS;
    }

    // ========== 렌더링 ==========
    render() {
        this.shadowRoot.innerHTML = `
            <style>${this.getStyles()}</style>
            <div class="game-container">
                ${this.renderByPhase()}
            </div>
        `;
        this.bindEvents();

        if (this.state.phase === 'playing') {
            this.initCanvas();
        }
    }

    renderByPhase() {
        switch (this.state.phase) {
            case 'input':
                return this.renderInputScreen();
            case 'playing':
                return this.renderPlayingScreen();
            case 'result':
                return this.renderResultScreen();
            default:
                return '';
        }
    }

    renderInputScreen() {
        const { participants, currentGame } = this.state;
        const canStart = this.canStartGame();

        return `
            <div class="input-screen">
                <header class="header">
                    <span class="header-icon">💰</span>
                    <h2>오늘의 결제왕</h2>
                    <p class="subtitle">누가 밥값을 낼까요?</p>
                </header>

                <nav class="game-tabs" role="tablist">
                    <button class="tab-btn ${currentGame === 'roulette' ? 'active' : ''}"
                            data-game="roulette" role="tab"
                            aria-selected="${currentGame === 'roulette'}">
                        🎰 룰렛
                    </button>
                    <button class="tab-btn ${currentGame === 'ladder' ? 'active' : ''}"
                            data-game="ladder" role="tab"
                            aria-selected="${currentGame === 'ladder'}">
                        🪜 사다리
                    </button>
                </nav>

                <section class="participants-section">
                    <label class="section-label">참가자 이름</label>
                    <div class="participants-list">
                        ${participants.map((name, i) => this.renderParticipantRow(name, i)).join('')}
                    </div>
                    ${participants.length < CONFIG.MAX_PARTICIPANTS ? `
                        <button class="add-btn" id="add-participant">
                            + 참가자 추가
                        </button>
                    ` : ''}
                </section>

                <button class="start-btn" id="start-game" ${!canStart ? 'disabled' : ''}>
                    ${currentGame === 'roulette' ? '🎰 룰렛 돌리기' : '🪜 사다리 시작'}
                </button>

                <p class="hint-text">최소 ${CONFIG.MIN_PARTICIPANTS}명 이상 입력해주세요</p>
            </div>
        `;
    }

    renderParticipantRow(name, index) {
        const canRemove = this.state.participants.length > 1;
        const isLast = index === this.state.participants.length - 1;
        const canAddMore = this.state.participants.length < CONFIG.MAX_PARTICIPANTS;
        // 마지막 입력이고 더 추가할 수 없으면 'done', 그 외에는 'next'
        const enterKeyHint = isLast && !canAddMore ? 'done' : 'next';

        return `
            <div class="participant-row">
                <input type="text"
                       class="participant-input"
                       data-index="${index}"
                       value="${this.escapeHtml(name)}"
                       placeholder="이름 입력"
                       maxlength="${CONFIG.MAX_NAME_LENGTH}"
                       inputmode="text"
                       enterkeyhint="${enterKeyHint}"
                       autocomplete="off"
                       aria-label="참가자 ${index + 1} 이름">
                ${canRemove ? `
                    <button class="remove-btn" data-index="${index}" aria-label="참가자 삭제">
                        ✕
                    </button>
                ` : ''}
            </div>
        `;
    }

    renderPlayingScreen() {
        const { currentGame } = this.state;
        const isAnimating = this.isGameAnimating();

        return `
            <div class="playing-screen">
                <header class="header">
                    <span class="header-icon">${currentGame === 'roulette' ? '🎰' : '🪜'}</span>
                    <h2>${currentGame === 'roulette' ? '룰렛' : '사다리타기'}</h2>
                </header>

                <div class="canvas-container">
                    <canvas id="game-canvas"></canvas>
                    ${currentGame === 'roulette' ? '<div class="pointer" aria-hidden="true">▼</div>' : ''}
                </div>

                <div class="action-buttons">
                    ${!isAnimating ? `
                        <button class="action-btn primary" id="spin-btn">
                            ${currentGame === 'roulette' ? '🎰 돌리기!' : '🪜 시작!'}
                        </button>
                        <button class="action-btn secondary" id="back-btn">
                            ← 다시 설정
                        </button>
                    ` : `
                        <p class="spinning-text" aria-live="polite">
                            ${currentGame === 'roulette' ? '돌아가는 중...' : '내려가는 중...'}
                        </p>
                    `}
                </div>
            </div>
        `;
    }

    renderResultScreen() {
        const { winner } = this.state;

        return `
            <div class="result-screen">
                <div class="result-badge" aria-hidden="true">🎉</div>
                <p class="result-title">당첨!</p>

                <div class="winner-card">
                    <span class="winner-decoration" aria-hidden="true">✨</span>
                    <h2 class="winner-name">${this.escapeHtml((winner && winner.name) || '')}</h2>
                    <span class="winner-decoration" aria-hidden="true">✨</span>
                </div>

                <p class="result-message">오늘의 결제왕입니다!</p>

                <div class="action-buttons">
                    <button class="action-btn primary" id="retry-btn">
                        🔄 다시 하기
                    </button>
                    <button class="action-btn secondary" id="reset-btn">
                        ← 처음부터
                    </button>
                </div>
            </div>
        `;
    }

    // ========== 이벤트 바인딩 ==========
    bindEvents() {
        const shadow = this.shadowRoot;

        // 탭 전환
        shadow.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleTabChange(btn.dataset.game));
        });

        // 참가자 입력
        shadow.querySelectorAll('.participant-input').forEach(input => {
            input.addEventListener('input', (e) => this.handleParticipantInput(e));
            input.addEventListener('keydown', (e) => this.handleParticipantKeydown(e));
        });

        // 참가자 삭제
        shadow.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleRemoveParticipant(btn.dataset.index));
        });

        // 참가자 추가
        const addBtn = shadow.getElementById('add-participant');
        if (addBtn) addBtn.addEventListener('click', () => this.handleAddParticipant());

        // 게임 시작
        const startBtn = shadow.getElementById('start-game');
        if (startBtn) startBtn.addEventListener('click', () => this.handleStartGame());

        // 돌리기/시작
        const spinBtn = shadow.getElementById('spin-btn');
        if (spinBtn) spinBtn.addEventListener('click', () => this.handleSpin());

        // 뒤로가기
        const backBtn = shadow.getElementById('back-btn');
        if (backBtn) backBtn.addEventListener('click', () => this.handleBack());

        // 다시하기
        const retryBtn = shadow.getElementById('retry-btn');
        if (retryBtn) retryBtn.addEventListener('click', () => this.handleRetry());

        // 처음부터
        const resetBtn = shadow.getElementById('reset-btn');
        if (resetBtn) resetBtn.addEventListener('click', () => this.handleReset());
    }

    // ========== 이벤트 핸들러 ==========
    handleTabChange(game) {
        this.setState({ currentGame: game });
    }

    handleParticipantInput(e) {
        const idx = parseInt(e.target.dataset.index);
        const participants = [...this.state.participants];
        participants[idx] = e.target.value;
        this.state.participants = participants; // 직접 업데이트 (재렌더링 없이)
        this.updateStartButton();
    }

    handleParticipantKeydown(e) {
        if (e.key !== 'Enter') return;

        e.preventDefault();

        const idx = parseInt(e.target.dataset.index);
        const currentValue = e.target.value.trim();
        const inputs = this.shadowRoot.querySelectorAll('.participant-input');
        const isLast = idx === inputs.length - 1;
        const canAddMore = this.state.participants.length < CONFIG.MAX_PARTICIPANTS;

        // 현재 입력값이 비어있으면 무시
        if (!currentValue) return;

        if (isLast && canAddMore) {
            // 마지막 입력에서 엔터: 새 참가자 추가
            this.handleAddParticipant();
        } else if (!isLast) {
            // 중간 입력에서 엔터: 다음 입력으로 포커스 이동
            const nextInput = inputs[idx + 1];
            if (nextInput) nextInput.focus();
        } else {
            // 최대 인원 도달 시 게임 시작 버튼으로 포커스
            const startBtn = this.shadowRoot.getElementById('start-game');
            if (startBtn && this.canStartGame()) {
                startBtn.focus();
            }
        }
    }

    handleRemoveParticipant(index) {
        const participants = [...this.state.participants];
        participants.splice(parseInt(index), 1);
        this.setState({ participants });
    }

    handleAddParticipant() {
        if (this.state.participants.length >= CONFIG.MAX_PARTICIPANTS) return;

        const participants = [...this.state.participants, ''];
        this.setState({ participants });

        // 새 입력창에 포커스
        requestAnimationFrame(() => {
            const inputs = this.shadowRoot.querySelectorAll('.participant-input');
            const lastInput = inputs[inputs.length - 1];
            if (lastInput) lastInput.focus();
        });
    }

    handleStartGame() {
        if (!this.canStartGame()) return;
        this.setState({ phase: 'playing' });
    }

    handleSpin() {
        const { currentGame } = this.state;
        if (currentGame === 'roulette') {
            this.startRoulette();
        } else {
            this.startLadder();
        }
    }

    handleBack() {
        this.cleanup();
        this.setState({ phase: 'input', winner: null });
    }

    handleRetry() {
        if (this.rouletteEngine) this.rouletteEngine.reset();
        if (this.ladderEngine) this.ladderEngine.reset();
        this.setState({ phase: 'playing', winner: null });
    }

    handleReset() {
        this.cleanup();
        this.setState({ phase: 'input', winner: null });
    }

    // ========== 게임 로직 ==========
    initCanvas() {
        const canvas = this.shadowRoot.getElementById('game-canvas');
        if (!canvas) return;

        const { currentGame } = this.state;
        const participants = this.getValidParticipants();

        canvas.width = CONFIG.CANVAS.WIDTH;
        canvas.height = currentGame === 'roulette'
            ? CONFIG.CANVAS.ROULETTE_HEIGHT
            : CONFIG.CANVAS.LADDER_HEIGHT;

        if (currentGame === 'roulette') {
            this.rouletteEngine = new RouletteEngine(participants, CONFIG.COLORS);
            this.rouletteEngine.draw(canvas.getContext('2d'), canvas.width, canvas.height);
        } else {
            this.ladderEngine = new LadderEngine(participants, CONFIG.COLORS);
            this.ladderEngine.generateBridges();
            this.ladderEngine.draw(canvas.getContext('2d'), canvas.width, canvas.height);
        }
    }

    startRoulette() {
        if (!this.rouletteEngine || this.rouletteEngine.isSpinning) return;

        // UI 업데이트
        this.render();

        const canvas = this.shadowRoot.getElementById('game-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        this.rouletteEngine.spin(
            // onFrame
            () => this.rouletteEngine.draw(ctx, canvas.width, canvas.height),
            // onComplete
            (winner) => this.handleGameComplete(winner)
        );
    }

    startLadder() {
        if (!this.ladderEngine || this.ladderEngine.isAnimating) return;

        // UI 업데이트
        this.render();

        const canvas = this.shadowRoot.getElementById('game-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        this.ladderEngine.start(
            // onFrame
            () => this.ladderEngine.draw(ctx, canvas.width, canvas.height),
            // onComplete
            (winner) => setTimeout(() => this.handleGameComplete(winner), 500)
        );
    }

    handleGameComplete(winner) {
        setTimeout(() => {
            this.setState({ phase: 'result', winner });
        }, 500);
    }

    isGameAnimating() {
        const rouletteSpinning = this.rouletteEngine && this.rouletteEngine.isSpinning;
        const ladderAnimating = this.ladderEngine && this.ladderEngine.isAnimating;
        return rouletteSpinning || ladderAnimating;
    }

    updateStartButton() {
        const startBtn = this.shadowRoot.getElementById('start-game');
        if (startBtn) {
            startBtn.disabled = !this.canStartGame();
        }
    }

    // ========== 유틸리티 ==========
    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
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

            .game-container {
                background: #FFFFFF;
                border: 1px solid rgba(74, 68, 88, 0.08);
                border-radius: 24px;
                padding: 1.5rem;
                box-shadow: 0 4px 20px rgba(74, 68, 88, 0.08);
            }

            /* Header */
            .header {
                text-align: center;
                margin-bottom: 1.5rem;
            }

            .header-icon {
                font-size: 2.5rem;
                display: block;
                margin-bottom: 0.5rem;
            }

            .header h2 {
                font-size: 1.5rem;
                color: #4A4458;
                margin: 0;
                font-weight: 700;
            }

            .subtitle {
                color: #7D7A8C;
                font-size: 0.875rem;
                margin: 0.25rem 0 0;
            }

            /* Game Tabs */
            .game-tabs {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1.5rem;
                background: rgba(74, 68, 88, 0.04);
                padding: 4px;
                border-radius: 12px;
            }

            .tab-btn {
                flex: 1;
                padding: 0.75rem 1rem;
                border: none;
                background: transparent;
                border-radius: 10px;
                font-size: 0.875rem;
                font-weight: 600;
                color: #7D7A8C;
                cursor: pointer;
                transition: all 0.25s ease;
                font-family: inherit;
            }

            .tab-btn.active {
                background: #FFFFFF;
                color: #4A4458;
                box-shadow: 0 2px 8px rgba(74, 68, 88, 0.1);
            }

            .tab-btn:hover:not(.active) {
                color: #4A4458;
            }

            /* Participants */
            .participants-section {
                margin-bottom: 1.5rem;
            }

            .section-label {
                display: block;
                font-size: 0.875rem;
                font-weight: 600;
                color: #4A4458;
                margin-bottom: 0.75rem;
            }

            .participants-list {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .participant-row {
                display: flex;
                gap: 0.5rem;
                align-items: center;
            }

            .participant-input {
                flex: 1;
                padding: 0.75rem 1rem;
                border: 2px solid rgba(74, 68, 88, 0.1);
                border-radius: 12px;
                font-size: 1rem;
                font-family: inherit;
                transition: border-color 0.2s ease;
            }

            .participant-input:focus {
                outline: none;
                border-color: #FFB5A7;
            }

            .remove-btn {
                width: 36px;
                height: 36px;
                border: none;
                background: rgba(255, 107, 107, 0.1);
                color: #FF6B6B;
                border-radius: 10px;
                cursor: pointer;
                font-size: 0.875rem;
                transition: all 0.2s ease;
            }

            .remove-btn:hover {
                background: rgba(255, 107, 107, 0.2);
            }

            .add-btn {
                width: 100%;
                padding: 0.75rem;
                border: 2px dashed rgba(74, 68, 88, 0.15);
                background: transparent;
                border-radius: 12px;
                color: #7D7A8C;
                font-size: 0.875rem;
                font-weight: 500;
                cursor: pointer;
                margin-top: 0.5rem;
                transition: all 0.2s ease;
                font-family: inherit;
            }

            .add-btn:hover {
                border-color: #FFB5A7;
                color: #FFB5A7;
            }

            /* Start Button */
            .start-btn {
                width: 100%;
                padding: 1rem;
                border: none;
                background: linear-gradient(135deg, #FFB5A7, #FFC8A2);
                color: #FFFFFF;
                border-radius: 16px;
                font-size: 1.125rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.25s ease;
                box-shadow: 0 8px 24px rgba(255, 139, 123, 0.25);
                font-family: inherit;
            }

            .start-btn:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 12px 28px rgba(255, 139, 123, 0.35);
            }

            .start-btn:disabled {
                background: #E0DDE5;
                box-shadow: none;
                cursor: not-allowed;
            }

            .hint-text {
                text-align: center;
                font-size: 0.75rem;
                color: #A09DAB;
                margin-top: 0.75rem;
            }

            /* Canvas Container */
            .canvas-container {
                position: relative;
                width: 100%;
                max-width: 320px;
                margin: 0 auto 1.5rem;
            }

            #game-canvas {
                width: 100%;
                height: auto;
                display: block;
            }

            .pointer {
                position: absolute;
                top: -10px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 1.5rem;
                color: #FF6B6B;
                text-shadow: 0 2px 4px rgba(0,0,0,0.2);
                z-index: 10;
            }

            /* Action Buttons */
            .action-buttons {
                display: flex;
                gap: 0.75rem;
                justify-content: center;
                flex-wrap: wrap;
            }

            .action-btn {
                padding: 0.875rem 1.5rem;
                border-radius: 14px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.25s ease;
                border: none;
                font-family: inherit;
            }

            .action-btn.primary {
                background: linear-gradient(135deg, #FFB5A7, #FFC8A2);
                color: #FFFFFF;
                box-shadow: 0 8px 24px rgba(255, 139, 123, 0.25);
            }

            .action-btn.primary:hover {
                transform: translateY(-2px);
            }

            .action-btn.secondary {
                background: #FFFFFF;
                color: #4A4458;
                border: 1px solid rgba(74, 68, 88, 0.1);
            }

            .action-btn.secondary:hover {
                background: #F8F7FA;
            }

            .spinning-text {
                font-size: 1rem;
                color: #7D7A8C;
                font-weight: 500;
                animation: pulse 1s ease-in-out infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            /* Result Screen */
            .result-screen {
                text-align: center;
                padding: 1rem 0;
            }

            .result-badge {
                font-size: 4rem;
                margin-bottom: 0.5rem;
                animation: bounce 0.6s ease-out;
            }

            @keyframes bounce {
                0% { transform: scale(0); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }

            .result-title {
                font-size: 1.25rem;
                color: #7D7A8C;
                margin: 0 0 1rem;
            }

            .winner-card {
                background: linear-gradient(135deg, rgba(255, 218, 193, 0.3), rgba(255, 181, 167, 0.2));
                border: 2px solid #FFB5A7;
                border-radius: 20px;
                padding: 2rem;
                margin: 1rem 0;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
            }

            .winner-name {
                font-size: 2rem;
                color: #4A4458;
                margin: 0;
                font-weight: 800;
            }

            .winner-decoration {
                font-size: 1.5rem;
                animation: sparkle 1.5s ease-in-out infinite;
            }

            @keyframes sparkle {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(0.8); }
            }

            .result-message {
                color: #7D7A8C;
                font-size: 1rem;
                margin: 1rem 0 1.5rem;
            }

            /* Mobile Responsive */
            @media (max-width: 480px) {
                .game-container {
                    padding: 1rem;
                    border-radius: 16px;
                }

                .header-icon {
                    font-size: 2rem;
                }

                .header h2 {
                    font-size: 1.25rem;
                }

                .tab-btn {
                    padding: 0.625rem 0.75rem;
                    font-size: 0.8rem;
                }

                .participant-input {
                    padding: 0.625rem 0.875rem;
                    font-size: 0.9rem;
                }

                .start-btn {
                    padding: 0.875rem;
                    font-size: 1rem;
                }

                .canvas-container {
                    max-width: 280px;
                }

                .winner-name {
                    font-size: 1.5rem;
                }

                .winner-card {
                    padding: 1.5rem;
                }

                .action-btn {
                    padding: 0.75rem 1.25rem;
                    font-size: 0.9rem;
                }
            }
        `;
    }
}

// 컴포넌트 등록
customElements.define('payment-game', PaymentGame);
console.log('[PaymentGame.js] Component registered: payment-game');

export default PaymentGame;
