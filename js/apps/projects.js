'use strict';

/**
 * VIGNESH.OS — Project Explorer Application Module
 * 
 * An interactive file-explorer dual-pane application displaying highlighted projects,
 * metadata, technical stacks, architecture descriptions, and repository links.
 */
window.VOS = window.VOS || {};
VOS.apps = VOS.apps || {};

VOS.apps['projects'] = {
  id: 'projects',
  title: 'PROJECT EXPLORER',
  icon: '📁',
  defaultWidth: 900,
  defaultHeight: 600,

  /**
   * Internal project catalogue
   */
  projectsData: [
    {
      id: 'aethelmark',
      title: 'Aethelmark',
      subtitle: 'Anti-Deepfake Media Authentication',
      role: 'System Designer & Concept Lead | Image Processing, Watermarking',
      year: '2026',
      status: 'Ideathon 1st Place',
      description: 'Conceived an anti-tamper media authentication system that embeds imperceptible mathematical signatures into generated images to verify provenance. Validated watermark resilience against manipulation using digital image processing concepts, delivering a functional proof-of-concept verification demo.',
      tech: ['Python', 'Digital Image Processing', 'Watermarking', 'OpenCV', 'NumPy', 'Streamlit'],
      github: 'https://github.com/navavignesh/aethelmark',
      icon: '🔐'
    },
    {
      id: 'erp',
      title: 'Institutional Student ERP',
      subtitle: 'Student Record Management & Metrics Dashboard',
      role: 'Developer | Python, Pandas, Streamlit, OOP',
      year: '2025',
      status: 'Completed',
      description: 'Developed a modular student record management system utilizing OOP principles and Pandas for structured institutional data handling. Built an interactive analytical dashboard deployed via Streamlit to monitor academic records and institutional metrics.',
      tech: ['Python', 'Pandas', 'Streamlit', 'OOP', 'Data Analytics'],
      github: 'https://github.com/navavignesh/student-erp',
      icon: '🏫'
    },
    {
      id: 'ticket-booking',
      title: 'CLI Movie Ticket Booking',
      subtitle: 'Terminal Seat Reservation & State Engine',
      role: 'Developer | C, 2D Arrays, State Management',
      year: '2025',
      status: 'Completed',
      description: 'Programmed a terminal-based seat reservation system utilizing 2D arrays for seat mapping. Implemented runtime seat-state verification and input validation to prevent double-booking errors.',
      tech: ['C', '2D Arrays', 'State Management', 'Input Validation', 'Terminal CLI'],
      github: 'https://github.com/navavignesh/cli-movie-ticket-booking',
      icon: '🎟️'
    }
  ],

  _listeners: [],

  /**
   * Render project explorer into the target container.
   * @param {HTMLElement} container - Window content container (.window-body)
   */
  render(container) {
    // Reset window-body default padding to enable edge-to-edge layout
    container.classList.add('projects-window-body');
    container.style.padding = '0';
    container.style.overflow = 'hidden';

    const defaultProject = this.projectsData[0];

    container.innerHTML = `
      <div class="projects-container" role="application" aria-label="Project Explorer">
        <!-- Top Breadcrumb Bar -->
        <header class="projects-topbar">
          <div class="projects-breadcrumb" aria-live="polite">
            <span class="projects-breadcrumb-root">📁 Projects</span>
            <span class="projects-breadcrumb-sep">&gt;</span>
            <span class="projects-breadcrumb-current" id="projects-current-crumb">${this._escapeHTML(defaultProject.title)}</span>
          </div>
          <span class="projects-stats">${this.projectsData.length} items</span>
        </header>

        <!-- Main Body Dual-Pane -->
        <div class="projects-body">
          <!-- Left Tree Sidebar (30%) -->
          <nav class="projects-sidebar" role="tablist" aria-label="Project list">
            <span class="projects-tree-header">EXPLORER: PROJECTS</span>
            ${this.projectsData.map((project, idx) => `
              <button 
                type="button"
                role="tab"
                id="tab-${project.id}"
                aria-controls="panel-${project.id}"
                aria-selected="${idx === 0 ? 'true' : 'false'}"
                tabindex="${idx === 0 ? '0' : '-1'}"
                data-project-id="${project.id}"
                class="projects-tree-item ${idx === 0 ? 'projects-active' : ''}">
                <span class="projects-folder-icon" aria-hidden="true">${idx === 0 ? '📂' : '📁'}</span>
                <span class="projects-item-title">${this._escapeHTML(project.title)}</span>
                <span class="projects-tree-indicator" aria-hidden="true">›</span>
              </button>
            `).join('')}
          </nav>

          <!-- Right Content Pane (70%) -->
          <main class="projects-content" id="projects-content-pane" role="region" aria-label="Project Details">
            ${this._generateDetailHTML(defaultProject)}
          </main>
        </div>
      </div>
    `;

    this._bindEvents(container);
  },

  /**
   * Bind tree item click and keyboard navigation events.
   * @param {HTMLElement} container 
   */
  _bindEvents(container) {
    const treeItems = Array.from(container.querySelectorAll('.projects-tree-item'));
    const contentPane = container.querySelector('#projects-content-pane');
    const crumbEl = container.querySelector('#projects-current-crumb');

    const selectItem = (itemEl) => {
      const projectId = itemEl.getAttribute('data-project-id');
      const project = this.projectsData.find(p => p.id === projectId);
      if (!project) return;

      treeItems.forEach(el => {
        const isActive = el === itemEl;
        el.classList.toggle('projects-active', isActive);
        el.setAttribute('aria-selected', isActive ? 'true' : 'false');
        el.tabIndex = isActive ? 0 : -1;
        const iconEl = el.querySelector('.projects-folder-icon');
        if (iconEl) {
          iconEl.textContent = isActive ? '📂' : '📁';
        }
      });

      if (crumbEl) {
        crumbEl.textContent = project.title;
      }

      if (contentPane) {
        contentPane.innerHTML = this._generateDetailHTML(project);
      }
    };

    treeItems.forEach((btn, index) => {
      const clickHandler = () => selectItem(btn);
      btn.addEventListener('click', clickHandler);
      this._listeners.push({ element: btn, type: 'click', handler: clickHandler });

      const keyHandler = (e) => {
        let nextIndex = null;
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          nextIndex = (index + 1) % treeItems.length;
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          nextIndex = (index - 1 + treeItems.length) % treeItems.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          nextIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          nextIndex = treeItems.length - 1;
        }

        if (nextIndex !== null) {
          treeItems[nextIndex].focus();
          selectItem(treeItems[nextIndex]);
        }
      };

      btn.addEventListener('keydown', keyHandler);
      this._listeners.push({ element: btn, type: 'keydown', handler: keyHandler });
    });
  },

  /**
   * Generates HTML markup for a selected project
   * @param {Object} project
   * @returns {string} HTML markup
   */
  _generateDetailHTML(project) {
    return `
      <article class="projects-detail-card" id="panel-${project.id}" role="tabpanel" aria-labelledby="tab-${project.id}">
        <header class="projects-header-row">
          <div>
            <h2 class="projects-title">${this._escapeHTML(project.title)}</h2>
            ${project.subtitle ? `<div style="font-size: 0.85rem; color: var(--accent-orange); margin-top: 4px; font-family: var(--font-mono);">${this._escapeHTML(project.subtitle)} // ${this._escapeHTML(project.year)}</div>` : ''}
          </div>
          <span class="projects-status-badge">
            <span class="projects-status-dot" aria-hidden="true"></span>
            ${this._escapeHTML(project.status)}
          </span>
        </header>

        <section>
          ${project.role ? `
            <div style="margin-bottom: var(--space-md); padding: 6px 12px; background: var(--bg-hover); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); font-size: 0.82rem; font-family: var(--font-mono); color: var(--text-secondary);">
              <span style="color: var(--accent-green); font-weight: 600;">ROLE:</span> ${this._escapeHTML(project.role)}
            </div>
          ` : ''}
          <span class="projects-section-label">Overview &amp; Implementation</span>
          <p class="projects-description">${this._escapeHTML(project.description)}</p>
        </section>

        <section class="projects-tech-section">
          <span class="projects-section-label">Tech Stack</span>
          <div class="projects-tech-tags" role="list" aria-label="Technologies used">
            ${project.tech.map(t => `<span class="projects-tech-tag" role="listitem">${this._escapeHTML(t)}</span>`).join('')}
          </div>
        </section>

        <footer class="projects-actions">
          <a 
            href="${project.github}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="projects-btn"
            aria-label="View source code for ${this._escapeHTML(project.title)} on GitHub">
            <span aria-hidden="true">📦</span> View on GitHub
          </a>
          <button 
            type="button" 
            class="projects-btn projects-btn-secondary"
            onclick="alert('Project documentation and README preview coming soon!')">
            <span aria-hidden="true">📄</span> Documentation
          </button>
        </footer>
      </article>
    `;
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
   * Teardown listeners and clean up.
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
