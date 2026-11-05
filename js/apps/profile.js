'use strict';

/**
 * VIGNESH.OS — My Profile Application Module
 * 
 * Provides an interactive personal summary showcasing biographical details,
 * academic background, interests, and profile photo with automatic initial-fallback.
 */
window.VOS = window.VOS || {};
VOS.apps = VOS.apps || {};

VOS.apps['profile'] = {
  id: 'profile',
  title: 'MY PROFILE',
  icon: '👤',
  defaultWidth: 800,
  defaultHeight: 550,

  /**
   * Reference to active listeners for proper cleanup
   */
  _listeners: [],

  /**
   * Render the profile application into the provided window body container.
   * @param {HTMLElement} container - Window content container (.window-body)
   */
  render(container) {
    // Reset window-body default padding to enable edge-to-edge layout
    container.classList.add('profile-window-body');
    container.style.padding = '0';
    container.style.overflow = 'hidden';

    container.innerHTML = `
      <div class="profile-container" role="region" aria-label="Nava Vignesh Profile Details">
        <!-- Left Sidebar: Identity & Avatar -->
        <aside class="profile-sidebar" aria-label="Personal Overview">
          <div class="profile-avatar-wrap">
            <img 
              class="profile-avatar-img" 
              src="assets/images/profile.jpg" 
              alt="Profile photograph of Nava Vignesh"
              loading="lazy"
              onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';"
            />
            <div class="profile-avatar-fallback" style="display: none;" aria-hidden="true">
              NV
            </div>
          </div>

          <h2 class="profile-name">V Nava Vignesh</h2>
          <p class="profile-tagline">Computer Science Undergrad | AI &amp; Cloud Enthusiast</p>

          <div class="profile-status-badge" role="status" aria-label="System status online">
            <span class="profile-status-dot" aria-hidden="true"></span>
            <span>AWS SBCL &bull; Online &amp; Building</span>
          </div>

          <div class="profile-sidebar-divider" role="separator" aria-hidden="true"></div>

          <div class="profile-quick-meta">
            <div class="profile-meta-item">
              <span class="profile-meta-icon" aria-hidden="true">📍</span>
              <span>Location: <strong class="profile-meta-val">Guntur, AP, India</strong></span>
            </div>
            <div class="profile-meta-item">
              <span class="profile-meta-icon" aria-hidden="true">🎓</span>
              <span>Degree: <strong class="profile-meta-val">B.Tech CSE (AI)</strong></span>
            </div>
            <div class="profile-meta-item">
              <span class="profile-meta-icon" aria-hidden="true">☁️</span>
              <span>Role: <strong class="profile-meta-val">AWS SBCL &amp; SAC Council</strong></span>
            </div>
            <div class="profile-meta-item">
              <span class="profile-meta-icon" aria-hidden="true">💻</span>
              <span>Focus: <strong class="profile-meta-val">AI, Cloud &amp; Python</strong></span>
            </div>
          </div>
        </aside>

        <!-- Right Main Panel: About, Education, and Facts -->
        <main class="profile-main">
          <!-- About Section -->
          <section class="profile-card" aria-labelledby="profile-about-heading">
            <div class="profile-card-header">
              <span class="profile-card-icon" aria-hidden="true">📝</span>
              <h3 id="profile-about-heading" class="profile-card-title">About</h3>
            </div>
            <p class="profile-about-text">
              Computer Science and AI undergraduate maintaining a 9.0 CGPA at VVIT University, combining solid foundations in Python, C, and Data Structures with active campus leadership. AWS Student Builder Cloud Leader (AWS SBCL) and core member of the Entrepreneurship Council within the Student Activity Council (SAC), experienced in driving technical events, collegiate hackathons, and peer mentoring.
            </p>
          </section>

          <!-- Education Section -->
          <section class="profile-card" aria-labelledby="profile-edu-heading">
            <div class="profile-card-header">
              <span class="profile-card-icon" aria-hidden="true">🎓</span>
              <h3 id="profile-edu-heading" class="profile-card-title">Education</h3>
            </div>
            <div class="profile-edu-grid">
              <div class="profile-edu-item">
                <span class="profile-edu-label">Undergraduate (2025 – 2029)</span>
                <span class="profile-edu-value">B.Tech in CSE (Artificial Intelligence)</span>
                <span class="profile-edu-label" style="margin-top:4px;">VVIT University, Guntur</span>
                <span class="profile-edu-cgpa-badge">CGPA: 9.0 / 10.0</span>
              </div>
              <div class="profile-edu-item">
                <span class="profile-edu-label">Intermediate (2023 – 2025)</span>
                <span class="profile-edu-value">MPC (Maths, Physics, Chemistry)</span>
                <span class="profile-edu-label" style="margin-top:4px;">Allen Career Institute, Tirupati</span>
                <span class="profile-edu-cgpa-badge">Score: 92.3%</span>
              </div>
            </div>
          </section>

          <!-- Quick Facts Section -->
          <section class="profile-card" aria-labelledby="profile-facts-heading">
            <div class="profile-card-header">
              <span class="profile-card-icon" aria-hidden="true">💡</span>
              <h3 id="profile-facts-heading" class="profile-card-title">Quick Facts &amp; Leadership</h3>
            </div>
            <ul class="profile-facts-list" role="list">
              <li class="profile-fact-item">
                <span class="profile-fact-emoji" aria-hidden="true">☁️</span>
                <span>AWS Student Builder Cloud Leader spearheading campus cloud workshops and architectures.</span>
              </li>
              <li class="profile-fact-item">
                <span class="profile-fact-emoji" aria-hidden="true">🚀</span>
                <span>Entrepreneurship Council Member (SAC, VVITU), coordinating hackathons and student mentoring.</span>
              </li>
              <li class="profile-fact-item">
                <span class="profile-fact-emoji" aria-hidden="true">🏆</span>
                <span>1st Place Winner at University Ideathon (Jan 2026) with project Aethelmark.</span>
              </li>
              <li class="profile-fact-item">
                <span class="profile-fact-emoji" aria-hidden="true">💻</span>
                <span>Specializing in Digital Image Processing, Watermarking, Python, and Machine Learning.</span>
              </li>
            </ul>
          </section>
        </main>
      </div>
    `;

    // Handle avatar image error fallback
    const avatarImg = container.querySelector('.profile-avatar-img');
    const avatarFallback = container.querySelector('.profile-avatar-fallback');

    if (avatarImg && avatarFallback) {
      const handleImageError = () => {
        avatarImg.style.display = 'none';
        avatarFallback.style.display = 'flex';
      };

      avatarImg.addEventListener('error', handleImageError, { once: true });

      // In case image failed to load before listener or has empty source
      if (avatarImg.complete && avatarImg.naturalWidth === 0) {
        handleImageError();
      }

      this._listeners.push({ element: avatarImg, type: 'error', handler: handleImageError });
    }
  },

  /**
   * Cleanup event listeners or references when the window is closed.
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
