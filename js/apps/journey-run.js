'use strict';

/**
 * VIGNESH.OS — JOURNEY.RUN Application Module
 * 
 * Retro pixel-art Chrome Dino-style endless runner game telling the story
 * of Vignesh's educational and project milestones.
 * 
 * Features:
 * - Pixel-art runner (running, jumping, ducking animations)
 * - Ground obstacles (cacti clusters) & aerial obstacles (pterodactyls)
 * - Journey milestones at score thresholds
 * - Milestone achievement modal featuring the actual Ideathon winning photo
 * - High score persistence via localStorage
 * - Synth retro sound effects via Web Audio API with mute toggle
 * - Keyboard + mobile touch controls
 */
window.VOS = window.VOS || {};
VOS.apps = VOS.apps || {};

VOS.apps['journey-run'] = {
  id: 'journey-run',
  title: 'JOURNEY.RUN',
  icon: '🦖',
  defaultWidth: 840,
  defaultHeight: 520,
  minWidth: 480,
  minHeight: 380,

  /**
   * Five verified journey milestone stages
   */
  STAGES: [
    {
      threshold: 100,
      id: 'beginning',
      stageNum: '01',
      title: 'THE BEGINNING',
      subtitle: '2025 // B.Tech Genesis',
      desc: 'Started my B.Tech journey in CSE (AI) and began exploring programming fundamentals.'
    },
    {
      threshold: 300,
      id: 'builder',
      stageNum: '02',
      title: 'THE BUILDER',
      subtitle: '2025 // Systems & Code',
      desc: 'Learning Python, C and Java; engineering Student ERP & terminal state applications.'
    },
    {
      threshold: 600,
      id: 'innovator',
      stageNum: '03',
      title: 'THE INNOVATOR',
      subtitle: 'Jan 2026 // Ideathon Champion',
      desc: 'Built the Aethelmark concept and won 1st Place in the University-Wide Ideathon!',
      hasPhotoPopup: true
    },
    {
      threshold: 1000,
      id: 'connector',
      stageNum: '04',
      title: 'THE CONNECTOR',
      subtitle: '2026 // Leadership & Community',
      desc: 'Entrepreneurship Council member (SAC) and AWS Student Builder Cloud Leader.'
    },
    {
      threshold: 1500,
      id: 'explorer',
      stageNum: '05',
      title: 'THE EXPLORER',
      subtitle: 'Present // Frontiers',
      desc: 'Exploring artificial intelligence, data science, deepfake defense & cloud scaling.'
    }
  ],

  _game: null,
  _listeners: [],

  /**
   * Render the application inside the window body
   */
  render(container) {
    container.classList.add('journey-run-window-body');
    container.innerHTML = `
      <div class="journey-run-container" role="application" aria-label="Journey Run Game">
        <!-- Top HUD Bar -->
        <header class="journey-run-hud">
          <div class="journey-run-title-group">
            <span class="journey-run-badge">🦖 JOURNEY.RUN</span>
            <span class="journey-run-tagline">"Every step tells a story."</span>
          </div>

          <div class="journey-run-stage-pill" id="jr-stage-pill">
            STAGE 01: THE BEGINNING
          </div>

          <div class="journey-run-scoreboard">
            <span class="journey-run-hi-score" id="jr-hi-score">HI 00000</span>
            <span class="journey-run-current-score" id="jr-current-score">00000</span>
            <button type="button" class="journey-run-btn-icon" id="jr-mute-btn" title="Toggle Sound" aria-label="Toggle Sound">
              🔊
            </button>
            <button type="button" class="journey-run-btn-icon" id="jr-explore-btn" title="Open My Journey app" aria-label="Explore Full Journey">
              🗺️
            </button>
          </div>
        </header>

        <!-- Main Canvas Area -->
        <div class="journey-run-stage-wrapper">
          <canvas id="jr-canvas" class="journey-run-canvas" width="800" height="300"></canvas>

          <!-- Milestone Toast Popup in-game -->
          <div class="journey-run-milestone-toast" id="jr-milestone-toast" aria-live="polite">
            <span class="journey-run-toast-icon">✨</span>
            <div class="journey-run-toast-content">
              <span class="journey-run-toast-title" id="jr-toast-title">STAGE UNLOCKED</span>
              <span class="journey-run-toast-desc" id="jr-toast-desc">Description</span>
            </div>
          </div>

          <!-- Ideathon Milestone Modal (Stage 3 Popup) -->
          <div class="journey-run-modal-backdrop" id="jr-ideathon-modal" style="display: none;" role="dialog" aria-modal="true" aria-labelledby="jr-modal-title">
            <div class="journey-run-modal-card">
              <div class="journey-run-modal-header">
                <span class="journey-run-modal-badge">🏆 MILESTONE UNLOCKED: STAGE 03</span>
                <span style="font-family: var(--font-pixel); font-size: 9px; color: var(--accent-green);">// VERIFIED WIN</span>
              </div>
              <h3 class="journey-run-modal-title" id="jr-modal-title">First Place — University Ideathon (2026)</h3>
              <div class="journey-run-modal-photo-wrap">
                <img 
                  src="assets/images/ideathon-winning.jpg" 
                  alt="Vignesh receiving 1st place award for Aethelmark at VVIT Ideathon" 
                  class="journey-run-modal-img"
                  loading="eager"
                />
              </div>
              <p class="journey-run-modal-desc">
                <strong>Aethelmark — Anti-Deepfake Media Authentication:</strong> Designed an innovative digital provenance concept embedding imperceptible mathematical signatures into generated images to verify authenticity.
              </p>
              <div class="journey-run-modal-actions">
                <button type="button" class="journey-run-btn-primary" id="jr-modal-continue-btn">
                  CONTINUE RUNNING [SPACE] ›
                </button>
              </div>
            </div>
          </div>

          <!-- Game Over Overlay -->
          <div class="journey-run-gameover-overlay" id="jr-gameover-overlay" style="display: none;" role="region" aria-label="Game Over Screen">
            <div class="journey-run-gameover-title">GAME OVER</div>
            <div class="journey-run-gameover-subtitle" id="jr-gameover-msg">Every step tells a story.</div>
            <div class="journey-run-gameover-stats">
              <div class="journey-run-stat-box">
                <span class="journey-run-stat-label">Distance / Score</span>
                <span class="journey-run-stat-value" id="jr-go-final-score">00000</span>
              </div>
              <div class="journey-run-stat-box">
                <span class="journey-run-stat-label">Best Record</span>
                <span class="journey-run-stat-value" id="jr-go-best-score">00000</span>
              </div>
              <div class="journey-run-stat-box">
                <span class="journey-run-stat-label">Stages Reached</span>
                <span class="journey-run-stat-value" id="jr-go-stages-reached">1 / 5</span>
              </div>
            </div>
            <div class="journey-run-gameover-actions">
              <button type="button" class="journey-run-btn-primary" id="jr-restart-btn">
                ↻ RUN AGAIN [SPACE]
              </button>
              <button type="button" class="journey-run-btn-secondary" id="jr-go-journey-btn">
                🗺️ EXPLORE FULL JOURNEY
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile On-Screen Touch Controls -->
        <footer class="journey-run-touch-controls" aria-label="Touch Controls">
          <button type="button" class="journey-run-touch-btn" id="jr-touch-duck" aria-label="Duck">
            <span>▼</span> DUCK
          </button>
          <button type="button" class="journey-run-touch-btn" id="jr-touch-jump" aria-label="Jump">
            <span>▲</span> JUMP
          </button>
        </footer>
      </div>
    `;

    // Initialize Game Engine
    const canvas = container.querySelector('#jr-canvas');
    this._game = new JourneyRunGame(this, container, canvas);
    this._bindControls(container);
  },

  _bindControls(container) {
    const exploreBtn = container.querySelector('#jr-explore-btn');
    const goJourneyBtn = container.querySelector('#jr-go-journey-btn');

    const openJourney = () => {
      if (VOS.wm && typeof VOS.wm.openWindow === 'function') {
        VOS.wm.openWindow('journey');
      }
    };

    if (exploreBtn) exploreBtn.addEventListener('click', openJourney);
    if (goJourneyBtn) goJourneyBtn.addEventListener('click', openJourney);
  },

  cleanup() {
    if (this._game) {
      this._game.destroy();
      this._game = null;
    }
    if (this._listeners && this._listeners.length > 0) {
      this._listeners.forEach(({ element, type, handler }) => {
        if (element && typeof element.removeEventListener === 'function') {
          element.removeEventListener(type, handler);
        }
      });
      this._listeners = [];
    }
  }
};

/**
 * ============================================================================
 * JOURNEY RUN GAME ENGINE
 * ============================================================================
 */
class JourneyRunGame {
  constructor(appModule, container, canvas) {
    this.app = appModule;
    this.container = container;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // UI Elements
    this.elScore = container.querySelector('#jr-current-score');
    this.elHiScore = container.querySelector('#jr-hi-score');
    this.elStagePill = container.querySelector('#jr-stage-pill');
    this.elToast = container.querySelector('#jr-milestone-toast');
    this.elToastTitle = container.querySelector('#jr-toast-title');
    this.elToastDesc = container.querySelector('#jr-toast-desc');
    this.elModal = container.querySelector('#jr-ideathon-modal');
    this.elModalContinue = container.querySelector('#jr-modal-continue-btn');
    this.elGameOver = container.querySelector('#jr-gameover-overlay');
    this.elGoFinalScore = container.querySelector('#jr-go-final-score');
    this.elGoBestScore = container.querySelector('#jr-go-best-score');
    this.elGoStages = container.querySelector('#jr-go-stages-reached');
    this.elRestartBtn = container.querySelector('#jr-restart-btn');
    this.elMuteBtn = container.querySelector('#jr-mute-btn');

    // Touch Elements
    this.btnTouchJump = container.querySelector('#jr-touch-jump');
    this.btnTouchDuck = container.querySelector('#jr-touch-duck');

    // Audio & Preferences
    this.soundMuted = localStorage.getItem('vos_jr_muted') === 'true';
    this._updateMuteUI();
    this.audioCtx = null;

    // Game Physics & Constants
    this.GROUND_Y = 240;
    this.GRAVITY = 0.65;
    this.JUMP_FORCE = -12.2;
    this.DUCK_GRAVITY = 1.6;

    // High score from localStorage
    this.highScore = parseInt(localStorage.getItem('vos_jr_highscore') || '0', 10);
    this.updateHiScoreDisplay();

    // Game State
    this.state = 'running'; // 'running', 'paused-milestone', 'gameover'
    this.score = 0;
    this.speed = 6.0;
    this.tick = 0;
    this.currentStageIdx = 0;
    this.unlockedStages = new Set([0]);

    // Character State
    this.dino = {
      x: 60,
      y: this.GROUND_Y - 48,
      w: 44,
      h: 48,
      vy: 0,
      isGrounded: true,
      isDucking: false,
      dead: false,
      stepTick: 0
    };

    // Environment & Entities
    this.groundOffset = 0;
    this.obstacles = [];
    this.clouds = [
      { x: 150, y: 50, speed: 0.5 },
      { x: 420, y: 80, speed: 0.7 },
      { x: 680, y: 40, speed: 0.4 }
    ];
    this.nextObstacleDistance = 140;

    // Input States
    this.keys = {
      jump: false,
      duck: false
    };

    // Bind Event Handlers
    this._handleKeyDown = this._onKeyDown.bind(this);
    this._handleKeyUp = this._onKeyUp.bind(this);
    this._handleResize = this._onResize.bind(this);

    window.addEventListener('keydown', this._handleKeyDown, { passive: false });
    window.addEventListener('keyup', this._handleKeyUp, { passive: false });
    window.addEventListener('resize', this._handleResize);

    // Canvas click/touch
    this.canvas.addEventListener('pointerdown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      if (clickY < rect.height * 0.55) {
        this._triggerJump();
      } else {
        this._setDucking(true);
      }
    });

    this.canvas.addEventListener('pointerup', () => {
      this._setDucking(false);
    });

    // Touch Buttons
    if (this.btnTouchJump) {
      this.btnTouchJump.addEventListener('touchstart', (e) => { e.preventDefault(); this._triggerJump(); });
      this.btnTouchJump.addEventListener('mousedown', () => this._triggerJump());
    }
    if (this.btnTouchDuck) {
      this.btnTouchDuck.addEventListener('touchstart', (e) => { e.preventDefault(); this._setDucking(true); });
      this.btnTouchDuck.addEventListener('touchend', () => this._setDucking(false));
      this.btnTouchDuck.addEventListener('mousedown', () => this._setDucking(true));
      this.btnTouchDuck.addEventListener('mouseup', () => this._setDucking(false));
    }

    // Modal Continue button
    if (this.elModalContinue) {
      this.elModalContinue.addEventListener('click', () => this.dismissMilestoneModal());
    }

    // Restart button
    if (this.elRestartBtn) {
      this.elRestartBtn.addEventListener('click', () => this.restart());
    }

    // Mute button
    if (this.elMuteBtn) {
      this.elMuteBtn.addEventListener('click', () => {
        this.soundMuted = !this.soundMuted;
        localStorage.setItem('vos_jr_muted', this.soundMuted);
        this._updateMuteUI();
      });
    }

    // Start Loop
    this._onResize();
    this.rafId = requestAnimationFrame(this._loop.bind(this));
  }

  _updateMuteUI() {
    if (this.elMuteBtn) {
      this.elMuteBtn.textContent = this.soundMuted ? '🔇' : '🔊';
      this.elMuteBtn.setAttribute('aria-label', this.soundMuted ? 'Unmute Sound' : 'Mute Sound');
    }
  }

  _initAudio() {
    if (!this.audioCtx && typeof window.AudioContext !== 'undefined') {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  _playSound(type) {
    if (this.soundMuted) return;
    try {
      this._initAudio();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      if (type === 'jump') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'milestone') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.12, now + idx * 0.08);
          gain.gain.linearRampToValueAtTime(0.001, now + idx * 0.08 + 0.15);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.16);
        });
      } else if (type === 'hit') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.linearRampToValueAtTime(70, now + 0.25);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.26);
      }
    } catch (e) {
      // Audio fallback silent
    }
  }

  _onKeyDown(e) {
    if (this.state === 'paused-milestone') {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        this.dismissMilestoneModal();
      }
      return;
    }

    if (this.state === 'gameover') {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        this.restart();
      }
      return;
    }

    if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      e.preventDefault();
      this._triggerJump();
    } else if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      e.preventDefault();
      this._setDucking(true);
    }
  }

  _onKeyUp(e) {
    if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      this._setDucking(false);
    }
  }

  _triggerJump() {
    if (this.state !== 'running') return;
    if (this.dino.isGrounded) {
      this.dino.vy = this.JUMP_FORCE;
      this.dino.isGrounded = false;
      this._playSound('jump');
    }
  }

  _setDucking(ducking) {
    if (this.state !== 'running') return;
    this.dino.isDucking = ducking;
    if (this.btnTouchDuck) {
      this.btnTouchDuck.classList.toggle('active', ducking);
    }
  }

  _onResize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.resetTransform ? this.ctx.resetTransform() : this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(dpr * (rect.width / 800), dpr * (rect.height / 300));
    }
  }

  _loop() {
    this.tick++;

    if (this.state === 'running') {
      this._update();
    }

    this._draw();

    this.rafId = requestAnimationFrame(this._loop.bind(this));
  }

  _update() {
    // Score & Speed
    this.score += 0.2;
    const currentScoreInt = Math.floor(this.score);
    this.elScore.textContent = String(currentScoreInt).padStart(5, '0');

    // Smooth speed progression
    this.speed = 6.0 + Math.min(6.5, currentScoreInt / 250);

    // Check Journey Milestones
    this._checkMilestones(currentScoreInt);

    // Update Dino physics
    if (!this.dino.isGrounded) {
      const gravity = this.dino.isDucking ? this.GRAVITY * this.DUCK_GRAVITY : this.GRAVITY;
      this.dino.vy += gravity;
      this.dino.y += this.dino.vy;

      const targetGround = this.GROUND_Y - (this.dino.isDucking ? 30 : 48);
      if (this.dino.y >= targetGround) {
        this.dino.y = targetGround;
        this.dino.vy = 0;
        this.dino.isGrounded = true;
      }
    } else {
      this.dino.y = this.GROUND_Y - (this.dino.isDucking ? 30 : 48);
    }

    this.dino.w = this.dino.isDucking ? 56 : 44;
    this.dino.h = this.dino.isDucking ? 30 : 48;
    this.dino.stepTick++;

    // Ground scrolling
    this.groundOffset = (this.groundOffset + this.speed) % 800;

    // Clouds
    this.clouds.forEach(cloud => {
      cloud.x -= cloud.speed;
      if (cloud.x < -100) cloud.x = 850;
    });

    // Spawning Obstacles
    this.nextObstacleDistance -= this.speed;
    if (this.nextObstacleDistance <= 0) {
      this._spawnObstacle();
      // Distance between obstacles decreases slightly as speed increases
      const minDistance = Math.max(140, 220 - this.speed * 8);
      const maxDistance = minDistance + 180;
      this.nextObstacleDistance = minDistance + Math.random() * (maxDistance - minDistance);
    }

    // Update Obstacles & Collision Check
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= this.speed;
      obs.animTick = (obs.animTick || 0) + 1;

      // Check collision
      if (this._checkCollision(this.dino, obs)) {
        this._triggerGameOver();
        return;
      }

      // Remove offscreen
      if (obs.x + obs.w < -50) {
        this.obstacles.splice(i, 1);
      }
    }
  }

  _spawnObstacle() {
    // Stage determines what obstacles can spawn
    // Early game: simple cacti. Mid/late game: taller cacti + flying pterodactyls
    const allowAerial = this.score > 250;
    const typeRoll = Math.random();

    if (allowAerial && typeRoll < 0.35) {
      // Pterodactyl Bird
      // Altitudes: 0 (high: run under), 1 (mid: must duck), 2 (low: must jump)
      const alt = Math.random() < 0.5 ? 1 : (Math.random() < 0.5 ? 0 : 2);
      const yMap = [160, 192, 218];
      this.obstacles.push({
        type: 'bird',
        x: 820,
        y: yMap[alt],
        w: 42,
        h: 30,
        altitude: alt,
        animTick: 0
      });
    } else {
      // Cactus Variants
      const cactusTypes = [
        { w: 16, h: 36, variant: 'single' },
        { w: 32, h: 36, variant: 'double' },
        { w: 25, h: 50, variant: 'tall' },
        { w: 46, h: 42, variant: 'triple' }
      ];
      const selected = cactusTypes[Math.floor(Math.random() * cactusTypes.length)];
      this.obstacles.push({
        type: 'cactus',
        x: 820,
        y: this.GROUND_Y - selected.h,
        w: selected.w,
        h: selected.h,
        variant: selected.variant
      });
    }
  }

  _checkCollision(dino, obs) {
    // Forgiving hitbox margin (4px inset) to ensure fair gameplay
    const pad = 4;
    const dinoBox = {
      x: dino.x + pad,
      y: dino.y + pad,
      w: dino.w - pad * 2,
      h: dino.h - pad * 2
    };

    const obsBox = {
      x: obs.x + pad,
      y: obs.y + pad,
      w: obs.w - pad * 2,
      h: obs.h - pad * 2
    };

    return (
      dinoBox.x < obsBox.x + obsBox.w &&
      dinoBox.x + dinoBox.w > obsBox.x &&
      dinoBox.y < obsBox.y + obsBox.h &&
      dinoBox.y + dinoBox.h > obsBox.y
    );
  }

  _checkMilestones(currentScore) {
    const stages = this.app.STAGES;
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      if (currentScore >= stage.threshold && !this.unlockedStages.has(i)) {
        this.unlockedStages.add(i);
        this.currentStageIdx = i;

        // Update Stage Pill in HUD
        if (this.elStagePill) {
          this.elStagePill.textContent = `STAGE ${stage.stageNum}: ${stage.title}`;
        }

        this._playSound('milestone');

        // Check if this milestone has an achievement popup (Stage 3 Ideathon Winning Photo)
        if (stage.hasPhotoPopup) {
          this._showIdeathonModal(stage);
        } else {
          this._showMilestoneToast(stage);
        }
        break;
      }
    }
  }

  _showMilestoneToast(stage) {
    if (!this.elToast) return;
    this.elToastTitle.textContent = `STAGE ${stage.stageNum}: ${stage.title}`;
    this.elToastDesc.textContent = stage.desc;
    this.elToast.classList.add('visible');

    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this.elToast.classList.remove('visible');
    }, 4500);
  }

  _showIdeathonModal(stage) {
    this.state = 'paused-milestone';
    if (this.elModal) {
      this.elModal.style.display = 'flex';
      if (this.elModalContinue) this.elModalContinue.focus();
    }
  }

  dismissMilestoneModal() {
    if (this.elModal) {
      this.elModal.style.display = 'none';
    }
    this.state = 'running';
  }

  _triggerGameOver() {
    this.state = 'gameover';
    this.dino.dead = true;
    this._playSound('hit');

    const finalScoreInt = Math.floor(this.score);
    if (finalScoreInt > this.highScore) {
      this.highScore = finalScoreInt;
      localStorage.setItem('vos_jr_highscore', this.highScore);
      this.updateHiScoreDisplay();
    }

    if (this.elGameOver) {
      this.elGoFinalScore.textContent = String(finalScoreInt).padStart(5, '0');
      this.elGoBestScore.textContent = String(this.highScore).padStart(5, '0');
      this.elGoStages.textContent = `${this.unlockedStages.size} / ${this.app.STAGES.length}`;
      this.elGameOver.style.display = 'flex';
      if (this.elRestartBtn) this.elRestartBtn.focus();
    }
  }

  updateHiScoreDisplay() {
    if (this.elHiScore) {
      this.elHiScore.textContent = `HI ${String(this.highScore).padStart(5, '0')}`;
    }
  }

  restart() {
    this.state = 'running';
    this.score = 0;
    this.speed = 6.0;
    this.tick = 0;
    this.obstacles = [];
    this.nextObstacleDistance = 140;

    this.dino.x = 60;
    this.dino.y = this.GROUND_Y - 48;
    this.dino.w = 44;
    this.dino.h = 48;
    this.dino.vy = 0;
    this.dino.isGrounded = true;
    this.dino.isDucking = false;
    this.dino.dead = false;

    if (this.elGameOver) this.elGameOver.style.display = 'none';
    if (this.elModal) this.elModal.style.display = 'none';
    if (this.elToast) this.elToast.classList.remove('visible');

    const firstStage = this.app.STAGES[0];
    if (this.elStagePill) {
      this.elStagePill.textContent = `STAGE ${firstStage.stageNum}: ${firstStage.title}`;
    }
  }

  /**
   * Render all canvas layers: sky/twilight, clouds, ground, obstacles, dinosaur
   */
  _draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, 800, 300);

    // 1. Twilight / Cyber Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 300);
    bgGrad.addColorStop(0, '#091024');
    bgGrad.addColorStop(0.65, '#131b38');
    bgGrad.addColorStop(0.85, '#281a38');
    bgGrad.addColorStop(1, '#080d1a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 300);

    // 2. Stars / Digital Specks
    ctx.fillStyle = '#6e7e9e';
    ctx.fillRect(80, 25, 2, 2);
    ctx.fillRect(230, 45, 2, 2);
    ctx.fillRect(390, 20, 2, 2);
    ctx.fillRect(570, 35, 2, 2);
    ctx.fillRect(720, 60, 2, 2);

    // 3. Clouds
    this.clouds.forEach(c => this._drawCloud(ctx, c.x, c.y));

    // 4. Ground Horizon Line & Moving Pixel Debris
    this._drawGround(ctx);

    // 5. Obstacles (Cactus & Birds)
    this.obstacles.forEach(obs => {
      if (obs.type === 'cactus') {
        this._drawCactus(ctx, obs);
      } else if (obs.type === 'bird') {
        this._drawBird(ctx, obs);
      }
    });

    // 6. Pixel Dinosaur Character
    this._drawDino(ctx, this.dino);
  }

  _drawCloud(ctx, x, y) {
    ctx.fillStyle = 'rgba(74, 143, 232, 0.22)';
    ctx.fillRect(x, y + 8, 48, 8);
    ctx.fillRect(x + 10, y + 2, 28, 6);
    ctx.fillRect(x + 18, y, 16, 4);
  }

  _drawGround(ctx) {
    // Horizon ground line
    ctx.fillStyle = '#e8734a';
    ctx.fillRect(0, this.GROUND_Y, 800, 2);

    // Moving pixel dashes along the terrain
    ctx.fillStyle = '#3a4b6b';
    for (let x = -this.groundOffset; x < 800; x += 36) {
      ctx.fillRect(x, this.GROUND_Y + 5, 8, 2);
      ctx.fillRect(x + 16, this.GROUND_Y + 9, 4, 2);
      if (x % 72 === 0) {
        ctx.fillRect(x + 24, this.GROUND_Y + 14, 6, 2);
      }
    }
  }

  _drawCactus(ctx, obs) {
    ctx.fillStyle = '#4ade80'; // Retro green pixel cactus

    if (obs.variant === 'single') {
      // Main stem
      ctx.fillRect(obs.x + 4, obs.y, 8, obs.h);
      // Left arm
      ctx.fillRect(obs.x, obs.y + 10, 4, 12);
      ctx.fillRect(obs.x, obs.y + 10, 8, 4);
      // Right arm
      ctx.fillRect(obs.x + 12, obs.y + 16, 4, 10);
      ctx.fillRect(obs.x + 8, obs.y + 16, 8, 4);
    } else if (obs.variant === 'double') {
      // Stem 1
      ctx.fillRect(obs.x + 2, obs.y + 4, 6, obs.h - 4);
      ctx.fillRect(obs.x, obs.y + 12, 10, 3);
      // Stem 2
      ctx.fillRect(obs.x + 18, obs.y, 8, obs.h);
      ctx.fillRect(obs.x + 14, obs.y + 14, 14, 4);
    } else if (obs.variant === 'tall') {
      // Tall spine
      ctx.fillRect(obs.x + 8, obs.y, 10, obs.h);
      ctx.fillRect(obs.x + 2, obs.y + 14, 6, 16);
      ctx.fillRect(obs.x + 2, obs.y + 14, 12, 4);
      ctx.fillRect(obs.x + 18, obs.y + 22, 6, 14);
      ctx.fillRect(obs.x + 12, obs.y + 22, 12, 4);
    } else {
      // Triple cluster
      ctx.fillRect(obs.x + 4, obs.y + 10, 6, obs.h - 10);
      ctx.fillRect(obs.x + 18, obs.y, 8, obs.h);
      ctx.fillRect(obs.x + 32, obs.y + 8, 6, obs.h - 8);
    }
  }

  _drawBird(ctx, obs) {
    // 2-frame flapping pterodactyl
    const wingUp = Math.floor(obs.animTick / 9) % 2 === 0;
    ctx.fillStyle = '#f87171'; // Aerodynamic crimson bird

    // Body
    ctx.fillRect(obs.x + 10, obs.y + 10, 22, 8);
    // Head & beak
    ctx.fillRect(obs.x + 32, obs.y + 12, 10, 4);
    ctx.fillRect(obs.x + 28, obs.y + 8, 6, 8);
    // Tail
    ctx.fillRect(obs.x, obs.y + 12, 10, 3);

    // Wings
    if (wingUp) {
      ctx.fillRect(obs.x + 14, obs.y - 2, 8, 12);
      ctx.fillRect(obs.x + 18, obs.y - 8, 4, 8);
    } else {
      ctx.fillRect(obs.x + 14, obs.y + 18, 8, 12);
      ctx.fillRect(obs.x + 18, obs.y + 28, 4, 8);
    }
  }

  _drawDino(ctx, dino) {
    const x = dino.x;
    const y = dino.y;
    const isStepA = Math.floor(dino.stepTick / 6) % 2 === 0;

    ctx.fillStyle = '#f0f6fc'; // Crisp pixel runner body

    if (dino.isDucking) {
      // Ducking elongated pose
      // Head & snout
      ctx.fillRect(x + 38, y + 6, 18, 12);
      ctx.fillRect(x + 46, y + 14, 10, 6);
      // Eye
      ctx.fillStyle = '#e8734a';
      ctx.fillRect(x + 44, y + 8, 3, 3);
      ctx.fillStyle = '#f0f6fc';
      // Torso
      ctx.fillRect(x + 14, y + 10, 26, 12);
      // Tail
      ctx.fillRect(x, y + 14, 14, 6);
      ctx.fillRect(x + 2, y + 18, 8, 4);

      // Running legs (ducking)
      if (dino.dead) {
        ctx.fillRect(x + 18, y + 22, 6, 8);
        ctx.fillRect(x + 32, y + 22, 6, 8);
      } else if (isStepA) {
        ctx.fillRect(x + 18, y + 22, 6, 8);
        ctx.fillRect(x + 32, y + 22, 6, 4);
      } else {
        ctx.fillRect(x + 18, y + 22, 6, 4);
        ctx.fillRect(x + 32, y + 22, 6, 8);
      }
    } else {
      // Standing / Running / Jumping pose
      // Head & snout
      ctx.fillRect(x + 24, y, 20, 16);
      ctx.fillRect(x + 32, y + 12, 12, 6);
      // Eye
      ctx.fillStyle = dino.dead ? '#ef4444' : '#e8734a';
      if (dino.dead) {
        // Cross / star eye
        ctx.fillRect(x + 30, y + 4, 4, 2);
        ctx.fillRect(x + 31, y + 3, 2, 4);
      } else {
        ctx.fillRect(x + 30, y + 4, 4, 4);
      }
      ctx.fillStyle = '#f0f6fc';

      // Neck & Chest
      ctx.fillRect(x + 20, y + 16, 16, 8);
      // Arm
      ctx.fillRect(x + 32, y + 20, 6, 3);
      ctx.fillRect(x + 36, y + 23, 2, 4);

      // Body / Torso
      ctx.fillRect(x + 12, y + 20, 18, 16);
      // Tail
      ctx.fillRect(x + 6, y + 24, 8, 8);
      ctx.fillRect(x, y + 28, 8, 6);
      ctx.fillRect(x, y + 34, 4, 4);

      // Legs
      if (!dino.isGrounded) {
        // Jumping legs tucked
        ctx.fillRect(x + 14, y + 36, 6, 8);
        ctx.fillRect(x + 24, y + 36, 6, 8);
        ctx.fillRect(x + 18, y + 44, 4, 2);
        ctx.fillRect(x + 28, y + 44, 4, 2);
      } else if (dino.dead) {
        ctx.fillRect(x + 14, y + 36, 6, 12);
        ctx.fillRect(x + 24, y + 36, 6, 12);
      } else if (isStepA) {
        // Foot 1 down, Foot 2 up
        ctx.fillRect(x + 14, y + 36, 6, 12);
        ctx.fillRect(x + 18, y + 46, 4, 2);
        ctx.fillRect(x + 26, y + 36, 6, 6);
      } else {
        // Foot 1 up, Foot 2 down
        ctx.fillRect(x + 14, y + 36, 6, 6);
        ctx.fillRect(x + 24, y + 36, 6, 12);
        ctx.fillRect(x + 28, y + 46, 4, 2);
      }
    }
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this._toastTimer) {
      clearTimeout(this._toastTimer);
      this._toastTimer = null;
    }
    window.removeEventListener('keydown', this._handleKeyDown);
    window.removeEventListener('keyup', this._handleKeyUp);
    window.removeEventListener('resize', this._handleResize);

    if (this.audioCtx && typeof this.audioCtx.close === 'function') {
      try { this.audioCtx.close(); } catch (e) {}
      this.audioCtx = null;
    }
  }
}

