'use strict';

/**
 * VIGNESH.OS — Achievements Application Module
 * 
 * Card-based achievement display highlighting competition victories
 * and professional certifications with verified credential badges.
 */
window.VOS = window.VOS || {};
VOS.apps = VOS.apps || {};

VOS.apps['achievements'] = {
  id: 'achievements',
  title: 'ACHIEVEMENTS',
  icon: '🏆',
  defaultWidth: 750,
  defaultHeight: 500,

  /**
   * Reference collection for active DOM listeners to allow proper cleanup
   */
  _listeners: [],

  /**
   * Data store for honors, hackathons, and ideathons
   */
  competitionsData: [
    {
      id: 'ideathon-2026',
      icon: '🥇',
      trophyEmoji: '🏆',
      title: 'University-Wide Ideathon — 1st Place Winner',
      subtitle: 'IIC & Entrepreneurship Council, VVIT',
      year: 'Jan 2026',
      badge: '1ST PLACE',
      description: 'Secured first place in the university-wide Ideathon organized by the Institution’s Innovation Council (IIC) & Entrepreneurship Council at VVIT. Designed the winning concept for digital image provenance and anti-deepfake signatures with project Aethelmark.',
      highlights: [
        'Awarded 1st Place overall in University-Wide Ideathon (Jan 2026)',
        'Designed winning concept for digital image provenance and anti-deepfake signatures',
        'Conceived mathematical watermark embeddings resilient to image tampering'
      ],
      tags: ['Aethelmark', 'Anti-Deepfake', 'Digital Image Processing', 'Watermarking', 'VVIT']
    }
  ],

  /**
   * Data store for certifications and verified credentials
   */
  certificationsData: [
    {
      id: 'cert-cloud',
      icon: '☁️',
      title: 'Cloud Computing',
      issuer: 'NPTEL',
      date: 'Verified',
      credentialId: 'ID: NPTEL-CLOUD-COMP',
      badge: 'VERIFIED',
      verified: true,
      description: 'Comprehensive certification covering distributed computing, virtualization, cloud architectural patterns, and storage/networking infrastructure.'
    },
    {
      id: 'cert-c',
      icon: '⚡',
      title: 'C Programming',
      issuer: 'CodeTantra',
      date: 'Verified',
      credentialId: 'ID: CODETANTRA-C-PROG',
      badge: 'VERIFIED',
      verified: true,
      description: 'Accredited hands-on programming assessment in procedural C, pointers, memory management, 2D arrays, and algorithmic problem-solving.'
    },
    {
      id: 'cert-python',
      icon: '🐍',
      title: 'Python',
      issuer: 'Kaggle',
      date: 'Verified',
      credentialId: 'ID: KAGGLE-PYTHON-CERT',
      badge: 'VERIFIED',
      verified: true,
      description: 'Demonstrated mastery of core Python syntax, data structures, functional paradigms, and computational problem-solving scripts.'
    },
    {
      id: 'cert-pandas',
      icon: '🐼',
      title: 'Pandas',
      issuer: 'Kaggle',
      date: 'Verified',
      credentialId: 'ID: KAGGLE-PANDAS-CERT',
      badge: 'VERIFIED',
      verified: true,
      description: 'Advanced data manipulation credential validating series indexing, dataframe transformations, group-by analytics, and structured data handling.'
    }
  ],

  /**
   * HTML escape helper to prevent injection vulnerabilities
   * @param {string} str - Raw string
   * @returns {string} Sanitized string
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
   * Render the achievements view into the window body container.
   * @param {HTMLElement} container - Window content container (.window-body)
   */
  render(container) {
    if (!container) return;

    // Render HTML structure
    container.innerHTML = `
      <div class="achievements-container" role="region" aria-label="Achievements and Certifications Catalog">
        <!-- Top Summary Bar -->
        <header class="achievements-topbar">
          <div class="achievements-topbar-info">
            <span class="achievements-topbar-icon" aria-hidden="true">🎖️</span>
            <div>
              <h2 class="achievements-topbar-title">HONORS &amp; CERTIFICATIONS</h2>
              <p class="achievements-topbar-subtitle">System Record Archive // Verified Milestones</p>
            </div>
          </div>
          <div class="achievements-stats-pills" aria-label="Achievement tally">
            <span class="achievements-stat-pill achievements-stat-pill--award">
              <span class="achievements-stat-dot"></span>
              <strong>1</strong> Competition Victory
            </span>
            <span class="achievements-stat-pill achievements-stat-pill--cert">
              <span class="achievements-stat-dot"></span>
              <strong>4</strong> Certifications
            </span>
          </div>
        </header>

        <!-- Section 1: Competitions -->
        <section class="achievements-section" aria-labelledby="achievements-comp-heading">
          <div class="achievements-section-header">
            <span class="achievements-section-prefix" aria-hidden="true">// 01.</span>
            <h3 id="achievements-comp-heading" class="achievements-section-title">COMPETITIONS</h3>
            <span class="achievements-section-line" aria-hidden="true"></span>
            <span class="achievements-section-count">1 Record</span>
          </div>

          <div class="achievements-comp-list" role="list">
            ${this.competitionsData.map(comp => `
              <article 
                class="achievements-card achievements-card--prominent" 
                role="listitem"
                tabindex="0"
                aria-label="${this._escapeHTML(comp.title)}, Year ${comp.year}">
                
                <!-- Ambient glow layer -->
                <div class="achievements-card-glow" aria-hidden="true"></div>

                <div class="achievements-card-header">
                  <div class="achievements-trophy-badge" aria-hidden="true">
                    <span class="achievements-trophy-icon">${comp.icon}</span>
                  </div>
                  
                  <div class="achievements-card-titles">
                    <div class="achievements-card-meta">
                      <span class="achievements-badge achievements-badge--gold" role="status">
                        ${this._escapeHTML(comp.badge)}
                      </span>
                      <span class="achievements-year-badge">
                        <span class="achievements-cal-icon" aria-hidden="true">📅</span>
                        ${this._escapeHTML(comp.year)}
                      </span>
                    </div>
                    <h4 class="achievements-card-title">${this._escapeHTML(comp.title)}</h4>
                    <span class="achievements-card-subtitle">${this._escapeHTML(comp.subtitle)}</span>
                  </div>
                </div>

                <p class="achievements-card-desc">
                  ${this._escapeHTML(comp.description)}
                </p>

                <!-- Ideathon Winning Photograph -->
                <div class="achievements-photo-wrapper">
                  <div class="achievements-photo-card">
                    <img 
                      src="assets/images/ideathon-winning.jpg" 
                      alt="1st Place Award Ceremony — University Ideathon 2026, VVIT"
                      class="achievements-winning-img"
                      loading="lazy"
                    />
                    <div class="achievements-photo-caption">
                      <span class="achievements-photo-caption-icon" aria-hidden="true">🏆</span>
                      <span>1st Place Award Ceremony — VVIT University Ideathon (Jan 2026)</span>
                    </div>
                  </div>
                </div>

                <!-- Key Highlights -->
                <div class="achievements-highlights-box">
                  <span class="achievements-highlights-label">// HIGHLIGHTS:</span>
                  <ul class="achievements-highlights-list">
                    ${comp.highlights.map(item => `
                      <li><span class="achievements-check-bullet" aria-hidden="true">✔</span> ${this._escapeHTML(item)}</li>
                    `).join('')}
                  </ul>
                </div>

                <!-- Tags / Skills Demonstrated -->
                <div class="achievements-tags-wrap" aria-label="Relevant Domains">
                  ${comp.tags.map(tag => `
                    <span class="achievements-tag">${this._escapeHTML(tag)}</span>
                  `).join('')}
                </div>
              </article>
            `).join('')}
          </div>
        </section>

        <!-- Section 2: Certifications -->
        <section class="achievements-section" aria-labelledby="achievements-certs-heading">
          <div class="achievements-section-header">
            <span class="achievements-section-prefix" aria-hidden="true">// 02.</span>
            <h3 id="achievements-certs-heading" class="achievements-section-title">CERTIFICATIONS</h3>
            <span class="achievements-section-line" aria-hidden="true"></span>
            <span class="achievements-section-count">4 Credentials</span>
          </div>

          <div class="achievements-certs-grid" role="list">
            ${this.certificationsData.map((cert, index) => `
              <article 
                class="achievements-cert-card" 
                role="listitem"
                tabindex="0"
                aria-label="${this._escapeHTML(cert.title)}, Issued by ${this._escapeHTML(cert.issuer)}">
                
                <div class="achievements-cert-top">
                  <div class="achievements-cert-icon-wrap" aria-hidden="true">
                    <span class="achievements-cert-icon">${cert.icon}</span>
                  </div>
                  <div class="achievements-cert-status">
                    <span class="achievements-badge achievements-badge--verified" title="Credential Verified">
                      <span class="achievements-verified-icon" aria-hidden="true">✓</span>
                      ${this._escapeHTML(cert.badge)}
                    </span>
                  </div>
                </div>

                <div class="achievements-cert-body">
                  <h4 class="achievements-cert-title">${this._escapeHTML(cert.title)}</h4>
                  
                  <div class="achievements-cert-meta">
                    <div class="achievements-cert-issuer">
                      <span class="achievements-cert-meta-label">Issuer:</span>
                      <span class="achievements-cert-meta-val">${this._escapeHTML(cert.issuer)}</span>
                    </div>
                    <div class="achievements-cert-date-row">
                      <span class="achievements-cert-meta-label">Issue Date:</span>
                      <span class="achievements-cert-meta-val">${this._escapeHTML(cert.date)}</span>
                    </div>
                    <div class="achievements-cert-id-row">
                      <span class="achievements-cert-meta-label">Credential:</span>
                      <code class="achievements-cert-id">${this._escapeHTML(cert.credentialId)}</code>
                    </div>
                  </div>

                  <p class="achievements-cert-desc">
                    ${this._escapeHTML(cert.description)}
                  </p>
                </div>

                <div class="achievements-cert-footer">
                  <span class="achievements-cert-index">CERT-0${index + 1}</span>
                  <span class="achievements-cert-secure-stamp">AUTHENTICATED</span>
                </div>
              </article>
            `).join('')}
          </div>
        </section>
      </div>
    `;

    // Keyboard support: Allow Enter/Space on focused cards for subtle tactile feedback
    const cards = container.querySelectorAll('.achievements-card, .achievements-cert-card');
    cards.forEach(card => {
      const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.add('achievements-card--active-press');
          setTimeout(() => {
            card.classList.remove('achievements-card--active-press');
          }, 180);
        }
      };

      card.addEventListener('keydown', handleKeyDown);
      this._listeners.push({ element: card, type: 'keydown', handler: handleKeyDown });
    });
  },

  /**
   * Cleanup any active event listeners or references when the window is closed
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
