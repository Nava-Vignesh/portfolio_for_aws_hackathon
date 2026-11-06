'use strict';

/**
 * VIGNESH.OS — My Journey Application Module
 * 
 * Interactive chronological timeline detailing educational milestones, 
 * hackathon wins, major project initiatives, and ongoing engineering pursuits.
 */
window.VOS = window.VOS || {};
VOS.apps = VOS.apps || {};

VOS.apps['journey'] = {
  id: 'journey',
  title: 'MY JOURNEY',
  icon: '🗺️',
  defaultWidth: 800,
  defaultHeight: 600,

  /**
   * Chronological milestones (from most recent to earliest)
   */
  timelineData: [
    {
      id: '2026-aws',
      period: '2026 – Present',
      title: 'AWS Student Builder Cloud Leader',
      description: 'Spearheading campus study groups and practical sessions on cloud computing fundamentals within the AWS Student Community, guiding peers through AWS services, core architectures, and deployment workflows.',
      expanded: true
    },
    {
      id: '2026-ideathon',
      period: 'Jan 2026',
      title: '1st Place Winner — University-Wide Ideathon',
      description: 'Secured first place in the university-wide Ideathon organized by IIC & Entrepreneurship Council, VVIT. Designed the winning concept for digital image provenance and anti-deepfake signatures with project Aethelmark.',
      expanded: true
    },
    {
      id: '2025-sac',
      period: '2025 – Present',
      title: 'Council Member — Entrepreneurship Council (SAC)',
      description: 'Serving as core member of the Entrepreneurship Council within the Student Activity Council (SAC), VVITU. Coordinating college hackathons, innovation challenges, and ideation bootcamps while mentoring student teams during problem identification and technical solution scoping.',
      expanded: false
    },
    {
      id: '2025-projects',
      period: '2025',
      title: 'Systems & Interactive Applications',
      description: 'Developed the Institutional Student ERP Platform utilizing OOP, Pandas, and Streamlit for administrative data handling and monitoring, and engineered a terminal-based Movie Ticket Booking Application in C with 2D array state verification.',
      expanded: false
    },
    {
      id: '2025-vvit',
      period: '2025 – 2029',
      title: 'B.Tech in CSE (Artificial Intelligence)',
      description: 'Commenced undergraduate studies in Computer Science and Engineering (Artificial Intelligence) at VVIT University, maintaining an exceptional 9.0 / 10.0 CGPA.',
      expanded: false
    },
    {
      id: '2023-2025',
      period: '2023 – 2025',
      title: 'Intermediate (MPC) — Allen Career Institute',
      description: 'Completed higher secondary education in Mathematics, Physics, and Chemistry at Allen Career Institute, Tirupati, achieving a 92.3% academic distinction.',
      expanded: false
    }
  ],

  _listeners: [],

  /**
   * Render the interactive timeline into the window container.
   * @param {HTMLElement} container - Window content container (.window-body)
   */
  render(container) {
    // Reset window-body default padding to enable edge-to-edge layout
    container.classList.add('journey-window-body');
    container.style.padding = '0';
    container.style.overflow = 'hidden';

    container.innerHTML = `
      <div class="journey-container" role="region" aria-label="Interactive Journey Timeline">
        <!-- Top Toolbar Header -->
        <header class="journey-header">
          <p class="journey-subtitle">
            <span aria-hidden="true">📍 </span>Chronological milestones &amp; technical achievements
          </p>
          <button 
            type="button" 
            class="journey-toolbar-btn" 
            id="journey-toggle-all-btn"
            aria-label="Toggle expand all or collapse all milestones">
            Toggle All
          </button>
        </header>

        <!-- Timeline Wrapper -->
        <div class="journey-timeline-wrapper">
          <ol class="journey-timeline">
            ${this.timelineData.map((item, idx) => {
              const sideClass = idx % 2 === 0 ? 'journey-left' : 'journey-right';
              const expandedClass = item.expanded ? 'journey-expanded' : '';
              return `
                <li class="journey-item ${sideClass} ${expandedClass}" id="journey-item-${item.id}">
                  <!-- Circular clickable node -->
                  <button 
                    type="button" 
                    class="journey-node-btn" 
                    data-id="${item.id}"
                    aria-label="Toggle ${this._escapeHTML(item.period)}: ${this._escapeHTML(item.title)}"
                    aria-expanded="${item.expanded ? 'true' : 'false'}"
                    aria-controls="journey-body-${item.id}">
                  </button>

                  <!-- Milestone Card -->
                  <div class="journey-card">
                    <button 
                      type="button" 
                      class="journey-card-header" 
                      data-id="${item.id}"
                      aria-expanded="${item.expanded ? 'true' : 'false'}"
                      aria-controls="journey-body-${item.id}">
                      <div class="journey-header-main">
                        <span class="journey-period-badge">${this._escapeHTML(item.period)}</span>
                        <h3 class="journey-item-title">${this._escapeHTML(item.title)}</h3>
                      </div>
                      <span class="journey-toggle-icon" aria-hidden="true">▼</span>
                    </button>

                    <div 
                      class="journey-card-body" 
                      id="journey-body-${item.id}"
                      role="region"
                      aria-labelledby="journey-header-${item.id}">
                      <div class="journey-card-content">
                        <p class="journey-desc">${this._escapeHTML(item.description)}</p>
                      </div>
                    </div>
                  </div>
                </li>
              `;
            }).join('')}
          </ol>
        </div>
      </div>
    `;

    this._bindEvents(container);
  },

  /**
   * Bind expand/collapse interactions and keyboard controls.
   * @param {HTMLElement} container 
   */
  _bindEvents(container) {
    const items = Array.from(container.querySelectorAll('.journey-item'));

    const toggleItem = (itemId) => {
      const itemEl = container.querySelector(`#journey-item-${itemId}`);
      if (!itemEl) return;

      const isExpanded = itemEl.classList.contains('journey-expanded');
      const nextExpanded = !isExpanded;

      itemEl.classList.toggle('journey-expanded', nextExpanded);

      const triggers = itemEl.querySelectorAll(`[data-id="${itemId}"]`);
      triggers.forEach(trig => {
        trig.setAttribute('aria-expanded', nextExpanded ? 'true' : 'false');
      });
    };

    // Attach listeners to both the node buttons and card headers
    const triggers = Array.from(container.querySelectorAll('.journey-node-btn, .journey-card-header'));
    triggers.forEach(trigger => {
      const clickHandler = () => {
        const itemId = trigger.getAttribute('data-id');
        toggleItem(itemId);
      };

      trigger.addEventListener('click', clickHandler);
      this._listeners.push({ element: trigger, type: 'click', handler: clickHandler });
    });

    // Toggle All Button
    const toggleAllBtn = container.querySelector('#journey-toggle-all-btn');
    if (toggleAllBtn) {
      const toggleAllHandler = () => {
        const anyCollapsed = items.some(it => !it.classList.contains('journey-expanded'));
        items.forEach(it => {
          it.classList.toggle('journey-expanded', anyCollapsed);
          const trigElements = it.querySelectorAll('.journey-node-btn, .journey-card-header');
          trigElements.forEach(trig => {
            trig.setAttribute('aria-expanded', anyCollapsed ? 'true' : 'false');
          });
        });
      };

      toggleAllBtn.addEventListener('click', toggleAllHandler);
      this._listeners.push({ element: toggleAllBtn, type: 'click', handler: toggleAllHandler });
    }
  },

  /**
   * Escape HTML utility to prevent XSS.
   */
  _escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /**
   * Cleanup event listeners upon window close.
   */
  cleanup() {
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
