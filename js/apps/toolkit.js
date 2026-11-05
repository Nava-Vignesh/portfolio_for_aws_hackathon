'use strict';

/**
 * VIGNESH.OS — Tech Toolkit Application Module
 * 
 * Interactive tabbed technical inventory grouping programming languages,
 * developer tools, core computing foundations, and ongoing areas of study.
 */
window.VOS = window.VOS || {};
VOS.apps = VOS.apps || {};

VOS.apps['toolkit'] = {
  id: 'toolkit',
  title: 'TECH TOOLKIT',
  icon: '🛠️',
  defaultWidth: 750,
  defaultHeight: 550,

  /**
   * Technical skills inventory data organized by category
   */
  categories: [
    {
      id: 'languages',
      label: 'Languages',
      icon: '💻',
      intro: 'Core programming languages leveraged across applications, system algorithms, and automation workflows.',
      items: [
        { name: 'Python', icon: '🐍', sub: 'Backend, AI & Scripting' },
        { name: 'C', icon: '⚡', sub: 'Systems & Memory Logic' },
        { name: 'Java', icon: '☕', sub: 'Object-Oriented Systems' },
        { name: 'HTML', icon: '🌐', sub: 'Semantic Structure & Web' }
      ]
    },
    {
      id: 'tools',
      label: 'Platforms & Utilities',
      icon: '🛠️',
      intro: 'Cloud infrastructure, workflow automation platforms, version control, and data libraries.',
      items: [
        { name: 'AWS Cloud Services', icon: '☁️', sub: 'Cloud Core & Architectures' },
        { name: 'Git', icon: '🔀', sub: 'Distributed Version Control' },
        { name: 'GitHub', icon: '🐙', sub: 'Repositories & Collaboration' },
        { name: 'n8n Automation', icon: '⚡', sub: 'Workflow & API Orchestration' },
        { name: 'Streamlit', icon: '🎈', sub: 'Interactive Dashboards & Demos' },
        { name: 'Pandas', icon: '🐼', sub: 'Structured Data Manipulation' },
        { name: 'OpenCV', icon: '👁️', sub: 'Computer Vision & Images' }
      ]
    },
    {
      id: 'competencies',
      label: 'Core Competencies',
      icon: '🧠',
      intro: 'Foundational computer science theoretical principles, mathematical modeling, and domain specializations.',
      items: [
        { name: 'Digital Image Processing', icon: '🖼️', sub: 'Spatial Domain & Filters' },
        { name: 'Invisible Watermarking', icon: '🔐', sub: 'Signatures & Media Provenance' },
        { name: 'Machine Learning', icon: '🤖', sub: 'Core Fundamentals & Models' },
        { name: 'Data Structures', icon: '🌲', sub: 'Arrays, Lists & Optimization' },
        { name: 'Object-Oriented Design', icon: '🧱', sub: 'Modularity & Encapsulation' },
        { name: 'State Management', icon: '⚙️', sub: '2D Arrays & System States' }
      ]
    },
    {
      id: 'leadership',
      label: 'Leadership & Soft Skills',
      icon: '🤝',
      intro: 'Technical leadership, collegiate mentorship, event planning, and cross-functional team coordination.',
      items: [
        { name: 'Technical Mentoring', icon: '👥', sub: 'AWS SBCL Study Groups' },
        { name: 'Event Organization', icon: '🎪', sub: 'Hackathons & Bootcamps' },
        { name: 'Cross-Functional Teams', icon: '🤝', sub: 'Student Activity Council' },
        { name: 'Solution Scoping', icon: '💡', sub: 'Problem Ideation & Pitching' }
      ]
    }
  ],

  _listeners: [],

  /**
   * Render the Tech Toolkit UI into the container.
   * @param {HTMLElement} container - Window content container (.window-body)
   */
  render(container) {
    // Reset window-body default padding to enable edge-to-edge layout
    container.classList.add('toolkit-window-body');
    container.style.padding = '0';
    container.style.overflow = 'hidden';

    container.innerHTML = `
      <div class="toolkit-container" role="application" aria-label="Tech Toolkit">
        <!-- Top Tabs Navigation -->
        <nav class="toolkit-tabs-wrapper" aria-label="Skill categories">
          <div class="toolkit-tabs" role="tablist">
            ${this.categories.map((cat, idx) => `
              <button 
                type="button" 
                role="tab"
                id="toolkit-tab-${cat.id}"
                aria-controls="toolkit-panel-${cat.id}"
                aria-selected="${idx === 0 ? 'true' : 'false'}"
                tabindex="${idx === 0 ? '0' : '-1'}"
                data-target="${cat.id}"
                class="toolkit-tab ${idx === 0 ? 'toolkit-active' : ''}">
                <span class="toolkit-tab-icon" aria-hidden="true">${cat.icon}</span>
                <span>${this._escapeHTML(cat.label)}</span>
                <span class="toolkit-tab-badge" aria-label="${cat.items.length} skills">${cat.items.length}</span>
              </button>
            `).join('')}
          </div>
        </nav>

        <!-- Panels Content -->
        <div class="toolkit-content">
          ${this.categories.map((cat, idx) => `
            <section 
              id="toolkit-panel-${cat.id}"
              role="tabpanel"
              aria-labelledby="toolkit-tab-${cat.id}"
              class="toolkit-panel ${idx === 0 ? 'toolkit-active' : ''}"
              tabindex="0"
              ${idx !== 0 ? 'hidden' : ''}>
              
              <p class="toolkit-panel-intro">
                <span aria-hidden="true">💡 </span>${this._escapeHTML(cat.intro)}
              </p>

              <div class="toolkit-grid" role="list" aria-label="${cat.label} list">
                ${cat.items.map(item => `
                  <div class="toolkit-chip" role="listitem">
                    <span class="toolkit-chip-icon" aria-hidden="true">${item.icon}</span>
                    <div class="toolkit-chip-info">
                      <span class="toolkit-chip-label">${this._escapeHTML(item.name)}</span>
                      <span class="toolkit-chip-category">${this._escapeHTML(item.sub)}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          `).join('')}
        </div>
      </div>
    `;

    this._bindEvents(container);
  },

  /**
   * Bind tab selection and accessibility keyboard interactions.
   * @param {HTMLElement} container 
   */
  _bindEvents(container) {
    const tabs = Array.from(container.querySelectorAll('.toolkit-tab'));
    const panels = Array.from(container.querySelectorAll('.toolkit-panel'));

    const activateTab = (tabEl) => {
      const targetId = tabEl.getAttribute('data-target');

      tabs.forEach(t => {
        const isActive = t === tabEl;
        t.classList.toggle('toolkit-active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        t.tabIndex = isActive ? 0 : -1;
      });

      panels.forEach(p => {
        const matches = p.id === `toolkit-panel-${targetId}`;
        p.classList.toggle('toolkit-active', matches);
        if (matches) {
          p.removeAttribute('hidden');
        } else {
          p.setAttribute('hidden', '');
        }
      });
    };

    tabs.forEach((tab, index) => {
      const clickHandler = () => activateTab(tab);
      tab.addEventListener('click', clickHandler);
      this._listeners.push({ element: tab, type: 'click', handler: clickHandler });

      const keyHandler = (e) => {
        let targetIndex = null;
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          targetIndex = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          targetIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          targetIndex = tabs.length - 1;
        }

        if (targetIndex !== null) {
          tabs[targetIndex].focus();
          activateTab(tabs[targetIndex]);
        }
      };

      tab.addEventListener('keydown', keyHandler);
      this._listeners.push({ element: tab, type: 'keydown', handler: keyHandler });
    });
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
   * Cleanup event listeners on window close.
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
