'use strict';

/**
 * VIGNESH.OS — SUPERPOWER.EXE Application Module
 * 
 * Signature interactive Superpower Vending Machine application.
 * Allows users to pick an archetype, watch the retro dispensing animation,
 * and collect a randomized, collectible superpower card.
 */
window.VOS = window.VOS || {};
VOS.apps = VOS.apps || {};

VOS.apps['superpower'] = {
  id: 'superpower',
  title: 'SUPERPOWER.EXE',
  icon: '⚡',
  defaultWidth: 700,
  defaultHeight: 600,

  /**
   * Reference collection for active DOM listeners and active timeouts
   */
  _listeners: [],
  _timeouts: [],

  /**
   * Categories and superpower catalog
   */
  catalog: {
    builder: {
      id: 'builder',
      name: 'The Builder',
      emoji: '🔨',
      subtitle: 'Craft & Create',
      powers: [
        {
          name: 'Code Alchemy',
          desc: 'Transform raw logic into elegant, living software. Your code doesn\'t just work — it inspires.',
          badge: 'LEGENDARY',
          stats: 'CRAFT +100 // LOGIC +95'
        },
        {
          name: 'Architecture Vision',
          desc: 'See the perfect system design before writing a single line. Complexity bows to your clarity.',
          badge: 'MYTHIC',
          stats: 'DESIGN +99 // CLARITY +90'
        },
        {
          name: 'Debug Intuition',
          desc: 'Sense bugs before they manifest. Your sixth sense for errors saves hours of debugging.',
          badge: 'EPIC',
          stats: 'PERCEPTION +95 // BUGKILL +100'
        }
      ]
    },
    innovator: {
      id: 'innovator',
      name: 'The Innovator',
      emoji: '💡',
      subtitle: 'Think & Disrupt',
      powers: [
        {
          name: 'Idea Cascade',
          desc: 'One idea triggers ten more. Your mind is a perpetual innovation engine that never runs dry.',
          badge: 'LEGENDARY',
          stats: 'IDEAS +100 // MOMENTUM +90'
        },
        {
          name: 'Pattern Disruption',
          desc: 'See solutions where others see walls. You break conventional thinking like it\'s made of glass.',
          badge: 'MYTHIC',
          stats: 'DISRUPTION +98 // VISION +95'
        },
        {
          name: 'Future Sight',
          desc: 'Predict technology trends before they emerge. You\'re always three steps ahead of the curve.',
          badge: 'EPIC',
          stats: 'FORESIGHT +96 // AGILITY +92'
        }
      ]
    },
    connector: {
      id: 'connector',
      name: 'The Connector',
      emoji: '🤝',
      subtitle: 'Link & Inspire',
      powers: [
        {
          name: 'Team Synergy',
          desc: 'Your presence amplifies everyone\'s abilities. Teams you join become unstoppable forces.',
          badge: 'MYTHIC',
          stats: 'SYNERGY +100 // MORALE +95'
        },
        {
          name: 'Bridge Building',
          desc: 'Connect ideas, people and systems that others never thought could work together.',
          badge: 'LEGENDARY',
          stats: 'INTEGRATION +95 // HARMONY +90'
        },
        {
          name: 'Empathy Engine',
          desc: 'Understand user needs before they express them. Your products feel like they read minds.',
          badge: 'EPIC',
          stats: 'EMPATHY +99 // UX +95'
        }
      ]
    },
    explorer: {
      id: 'explorer',
      name: 'The Explorer',
      emoji: '🧭',
      subtitle: 'Discover & Venture',
      powers: [
        {
          name: 'Rapid Learning',
          desc: 'Master any new technology in record time. Documentation fears you.',
          badge: 'MYTHIC',
          stats: 'ABSORPTION +100 // VELOCITY +95'
        },
        {
          name: 'Curiosity Compass',
          desc: 'Always find the most interesting problem in any domain. Boredom is not in your vocabulary.',
          badge: 'LEGENDARY',
          stats: 'DISCOVERY +98 // PASSION +92'
        },
        {
          name: 'Boundary Breaker',
          desc: 'Push past the edges of what\'s known. You thrive in uncharted technical territory.',
          badge: 'EPIC',
          stats: 'GRIT +95 // ADAPTABILITY +98'
        }
      ]
    },
    wildcard: {
      id: 'wildcard',
      name: 'The Wild Card',
      emoji: '🎲',
      subtitle: 'Expect the Unexpected',
      powers: [
        {
          name: 'Rubber Duck Mastery',
          desc: 'Explain any problem to a rubber duck and the solution appears. Debugging\'s greatest superpower.',
          badge: 'LEGENDARY',
          stats: 'MONOLOGUE +100 // INSIGHT +99'
        },
        {
          name: 'Coffee Transmutation',
          desc: 'Convert caffeine directly into production-ready code with zero bugs. Scientists are baffled.',
          badge: 'MYTHIC',
          stats: 'CAFFEINE +100 // SPEED +95'
        },
        {
          name: 'Meeting Escape',
          desc: 'Politely exit any unnecessary meeting while leaving a perfect holographic clone behind.',
          badge: 'EPIC',
          stats: 'STEALTH +100 // FOCUS +95'
        }
      ]
    }
  },

  /**
   * Current app state container
   */
  _container: null,

  /**
   * Helper to escape HTML characters
   * @param {string} str - Raw input string
   * @returns {string} Escaped string
   */
  _escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /**
   * Primary render entrypoint
   * @param {HTMLElement} container - Window content container (.window-body)
   */
  render(container) {
    if (!container) return;
    this._container = container;
    this._showSelectionScreen();
  },

  /**
   * Screen 1: Category Selection
   */
  _showSelectionScreen() {
    this._clearActiveTimers();
    const container = this._container;
    if (!container) return;

    const categories = Object.values(this.catalog);

    container.innerHTML = `
      <div class="superpower-container superpower-container--select" role="region" aria-label="Superpower Vending Machine Category Selector">
        <!-- Machine Header -->
        <header class="superpower-header">
          <div class="superpower-marquee" aria-hidden="true">
            <span class="superpower-led-dot"></span>
            <span>SYSTEM ACTIVE // INSERT COIN</span>
            <span class="superpower-led-dot"></span>
          </div>
          <h2 class="superpower-pixel-title">⚡ SUPERPOWER VENDING MACHINE</h2>
          <p class="superpower-subtitle">Select your superpower category</p>
        </header>

        <!-- Category Grid -->
        <main class="superpower-grid" role="group" aria-label="Superpower Categories">
          ${categories.map((cat, idx) => `
            <button 
              type="button" 
              class="superpower-cat-btn" 
              data-category="${cat.id}"
              id="superpower-btn-${cat.id}"
              tabindex="0"
              aria-label="Category: ${this._escapeHTML(cat.name)}, ${this._escapeHTML(cat.subtitle)}">
              <span class="superpower-cat-slot-no" aria-hidden="true">0${idx + 1}</span>
              <div class="superpower-cat-emoji" aria-hidden="true">${cat.emoji}</div>
              <div class="superpower-cat-info">
                <span class="superpower-cat-name">${this._escapeHTML(cat.name)}</span>
                <span class="superpower-cat-sub">${this._escapeHTML(cat.subtitle)}</span>
              </div>
              <span class="superpower-cat-arrow" aria-hidden="true">›</span>
            </button>
          `).join('')}
        </main>

        <!-- Machine Footer Status -->
        <footer class="superpower-footer">
          <span class="superpower-status-text">⚡ VOS-VM-9000 // READY FOR SELECTION</span>
          <span class="superpower-coins-label">COINS: ∞</span>
        </footer>
      </div>
    `;

    // Bind category button clicks & keyboard activation
    const buttons = container.querySelectorAll('.superpower-cat-btn');
    buttons.forEach((btn, index) => {
      const clickHandler = () => {
        const catId = btn.getAttribute('data-category');
        this._startDispensing(catId);
      };

      btn.addEventListener('click', clickHandler);
      this._listeners.push({ element: btn, type: 'click', handler: clickHandler });

      // Auto-focus first button for seamless keyboard navigation
      if (index === 0) {
        requestAnimationFrame(() => btn.focus());
      }
    });
  },

  /**
   * Screen 2: Dispensing Animation
   * @param {string} categoryId - Selected category identifier
   */
  _startDispensing(categoryId) {
    this._clearActiveTimers();
    const container = this._container;
    if (!container) return;

    const category = this.catalog[categoryId] || this.catalog.builder;
    
    // Pick random superpower from the chosen category
    const powers = category.powers;
    const randomIndex = Math.floor(Math.random() * powers.length);
    const chosenPower = powers[randomIndex];

    // Check prefers-reduced-motion preference
    const prefersReducedMotion = window.matchMedia && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Render Screen 2 HTML
    container.innerHTML = `
      <div class="superpower-container superpower-container--dispensing" role="region" aria-label="Dispensing Superpower Animation">
        <header class="superpower-header">
          <div class="superpower-marquee superpower-marquee--active" aria-hidden="true">
            <span class="superpower-led-dot superpower-led-dot--blink"></span>
            <span>VENDING MACHINE PROCESSING...</span>
            <span class="superpower-led-dot superpower-led-dot--blink"></span>
          </div>
          <h2 class="superpower-pixel-title">⚡ DISPENSING...</h2>
          <p class="superpower-subtitle">Category: ${this._escapeHTML(category.name)}</p>
        </header>

        <main class="superpower-dispenser-stage">
          <!-- Retro Vending Machine Cabinet Art -->
          <div class="superpower-machine-chassis">
            <div class="superpower-machine-top-bar">
              <span class="superpower-brand-badge">V-DISPENSE 3000</span>
              <div class="superpower-signal-dots" aria-hidden="true">
                <span></span><span></span><span></span>
              </div>
            </div>

            <!-- Glass viewing window where capsule drops -->
            <div class="superpower-machine-window">
              <div class="superpower-window-grid-lines" aria-hidden="true"></div>
              
              <!-- Dropping item -->
              <div class="superpower-drop-item" id="superpower-drop-item">
                <div class="superpower-capsule">
                  <span class="superpower-capsule-emoji">${category.emoji}</span>
                  <span class="superpower-capsule-glow"></span>
                </div>
              </div>
            </div>

            <!-- Machine bottom dispenser tray -->
            <div class="superpower-machine-tray">
              <div class="superpower-tray-slot">
                <span class="superpower-tray-flap" id="superpower-tray-flap"></span>
                <span class="superpower-tray-label">COLLECT SLOT ▼</span>
              </div>
            </div>
          </div>

          <!-- Status label -->
          <div class="superpower-dispense-status" role="status" aria-live="polite">
            <span class="superpower-spinner-icon" aria-hidden="true">⚙</span>
            <span class="superpower-dispense-label">Dispensing superpower...</span>
          </div>

          <!-- Skip button for convenience or reduced motion -->
          <button type="button" class="superpower-skip-btn" id="superpower-skip-btn">
            Skip animation ›
          </button>
        </main>
      </div>
    `;

    const skipBtn = container.querySelector('#superpower-skip-btn');
    if (skipBtn) {
      const skipHandler = () => {
        this._showRevealScreen(category, chosenPower);
      };
      skipBtn.addEventListener('click', skipHandler);
      this._listeners.push({ element: skipBtn, type: 'click', handler: skipHandler });
    }

    // If user prefers reduced motion, transition immediately or with minimum delay
    if (prefersReducedMotion) {
      const t = setTimeout(() => {
        this._showRevealScreen(category, chosenPower);
      }, 80);
      this._timeouts.push(t);
    } else {
      // 2 seconds animation as specified in prompt
      const t = setTimeout(() => {
        this._showRevealScreen(category, chosenPower);
      }, 2000);
      this._timeouts.push(t);
    }
  },

  /**
   * Screen 3: Collectible Card Reveal
   * @param {Object} category - The category object
   * @param {Object} power - The randomly selected superpower object
   */
  _showRevealScreen(category, power) {
    this._clearActiveTimers();
    const container = this._container;
    if (!container) return;

    container.innerHTML = `
      <div class="superpower-container superpower-container--reveal" role="region" aria-label="Unlocked Superpower Card">
        <header class="superpower-header">
          <div class="superpower-marquee superpower-marquee--success" aria-hidden="true">
            <span class="superpower-led-dot"></span>
            <span>SUPERPOWER DISPENSED SUCCESSFULLY!</span>
            <span class="superpower-led-dot"></span>
          </div>
          <h2 class="superpower-pixel-title">⚡ CARD UNLOCKED!</h2>
          <p class="superpower-subtitle">A rare developer ability has been granted</p>
        </header>

        <main class="superpower-card-stage">
          <!-- Collectible Card Frame -->
          <article class="superpower-collectible-card" tabindex="0" role="region" aria-label="Collectible card: ${this._escapeHTML(power.name)}">
            <!-- Holographic / metallic edge effect -->
            <div class="superpower-card-holo-shine" aria-hidden="true"></div>
            
            <!-- Card Header -->
            <div class="superpower-card-header">
              <span class="superpower-card-category-tag">
                <span class="superpower-tag-bullet" aria-hidden="true">${category.emoji}</span>
                ${this._escapeHTML(category.name.toUpperCase())}
              </span>
              <span class="superpower-card-rarity-badge">${this._escapeHTML(power.badge)}</span>
            </div>

            <!-- Card Emoji Art / Medallion -->
            <div class="superpower-card-art-wrap">
              <div class="superpower-art-orb" aria-hidden="true">
                <span class="superpower-art-emoji">${category.emoji}</span>
              </div>
              <div class="superpower-art-ring" aria-hidden="true"></div>
            </div>

            <!-- Card Titles & Description -->
            <div class="superpower-card-body">
              <h3 class="superpower-card-name">${this._escapeHTML(power.name)}</h3>
              <div class="superpower-card-divider" aria-hidden="true"></div>
              <blockquote class="superpower-card-quote">
                "${this._escapeHTML(power.desc)}"
              </blockquote>
            </div>

            <!-- Card Stats & Authentication Code -->
            <div class="superpower-card-stats-bar">
              <span class="superpower-stats-code">${this._escapeHTML(power.stats)}</span>
              <span class="superpower-serial-no">VOS-CARD #0${Math.floor(Math.random() * 899 + 100)}</span>
            </div>
          </article>

          <!-- Action Button to Collect Another -->
          <div class="superpower-card-actions">
            <button 
              type="button" 
              class="superpower-collect-btn" 
              id="superpower-btn-again"
              tabindex="0"
              aria-label="Collect another superpower">
              <span class="superpower-btn-glow" aria-hidden="true"></span>
              <span class="superpower-btn-text">⚡ COLLECT ANOTHER</span>
            </button>
          </div>
        </main>
      </div>
    `;

    // Bind Reset to Screen 1
    const againBtn = container.querySelector('#superpower-btn-again');
    if (againBtn) {
      const resetHandler = (e) => {
        e.preventDefault();
        this._showSelectionScreen();
      };
      againBtn.addEventListener('click', resetHandler);
      this._listeners.push({ element: againBtn, type: 'click', handler: resetHandler });

      // Automatically focus button for immediate keyboard accessibility
      requestAnimationFrame(() => againBtn.focus());
    }
  },

  /**
   * Internal helper to cancel all queued timeouts
   */
  _clearActiveTimers() {
    if (this._timeouts && this._timeouts.length > 0) {
      this._timeouts.forEach(t => clearTimeout(t));
      this._timeouts = [];
    }
  },

  /**
   * Cleanup any active event listeners or timers when the window is closed
   */
  cleanup() {
    this._clearActiveTimers();

    if (this._listeners && this._listeners.length > 0) {
      this._listeners.forEach(({ element, type, handler }) => {
        if (element && typeof element.removeEventListener === 'function') {
          element.removeEventListener(type, handler);
        }
      });
      this._listeners = [];
    }

    this._container = null;
  }
};
