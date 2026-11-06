'use strict';

window.VOS = window.VOS || {};

VOS.Desktop = class Desktop {
  constructor(containerEl, windowManager) {
    this.container = containerEl;
    this.wm = windowManager;
    this.selectedIcon = null;
    this.lastTapTime = 0;

    this._renderWallpaper();
    this._renderIcons();
    this._renderStatusWidget();
    this._showWelcome();

    // Click desktop background to deselect icons
    document.querySelector('.desktop').addEventListener('click', (e) => {
      if (e.target.closest('.desktop-icon') || e.target.closest('.status-widget')) return;
      this._deselectAll();
    });
  }

  _getApps() {
    return [
      { id: 'profile', icon: '👤', label: 'MY PROFILE' },
      { id: 'projects', icon: '📁', label: 'PROJECT\nEXPLORER' },
      { id: 'toolkit', icon: '🛠️', label: 'TECH\nTOOLKIT' },
      { id: 'journey', icon: '🗺️', label: 'MY JOURNEY' },
      { id: 'achievements', icon: '🏆', label: 'ACHIEVEMENTS' },
      { id: 'contact', icon: '✉️', label: 'CONTACT' },
      { id: 'journey-run', icon: '🦖', label: 'JOURNEY\n.RUN' }
    ];
  }

  _renderWallpaper() {
    const desktopEl = document.querySelector('.desktop');
    if (!desktopEl) return;

    const wallpaper = document.createElement('div');
    wallpaper.className = 'desktop-wallpaper';
    wallpaper.setAttribute('aria-hidden', 'true');

    wallpaper.innerHTML = `
      <!-- Layer 1: Stars in upper sky -->
      <svg class="wallpaper-stars wallpaper-layer" data-depth="0.02" viewBox="0 0 1000 600" preserveAspectRatio="none">
        <rect x="80" y="40" width="3" height="3" fill="#ffffff" class="star-blink" />
        <rect x="190" y="90" width="2" height="2" fill="#74b9ff" />
        <rect x="310" y="35" width="3" height="3" fill="#ffeaa7" class="star-blink-delayed" />
        <rect x="420" y="110" width="2" height="2" fill="#ffffff" />
        <rect x="530" y="55" width="3" height="3" fill="#ffffff" class="star-blink" />
        <rect x="640" y="120" width="2" height="2" fill="#74b9ff" />
        <rect x="760" y="45" width="3" height="3" fill="#ffeaa7" class="star-blink-delayed" />
        <rect x="880" y="85" width="2" height="2" fill="#ffffff" />
        <rect x="940" y="30" width="3" height="3" fill="#ffffff" class="star-blink" />
        <rect x="140" y="160" width="2" height="2" fill="#ffffff" />
        <rect x="270" y="210" width="2" height="2" fill="#ffeaa7" />
        <rect x="490" y="180" width="2" height="2" fill="#74b9ff" />
        <rect x="710" y="195" width="2" height="2" fill="#ffffff" />
        <rect x="840" y="170" width="2" height="2" fill="#ffffff" />
      </svg>

      <!-- Horizon Sunset Warm Glow -->
      <div class="wallpaper-sunset-glow"></div>

      <!-- Layer 2: Distant mountain peaks (Dusky Purple) -->
      <svg class="wallpaper-svg wallpaper-layer" data-depth="0.04" viewBox="0 0 1200 600" preserveAspectRatio="none">
        <!-- Far mountain silhouette -->
        <path d="M0,450 L50,420 L90,440 L160,370 L230,410 L310,340 L380,380 L460,310 L520,350 L600,280 L670,330 L760,290 L840,360 L920,310 L990,370 L1070,330 L1140,380 L1200,340 L1200,600 L0,600 Z" 
              fill="#261c38" />
        <!-- Highlight edge on far peaks -->
        <path d="M0,450 L50,420 L90,440 L160,370 L230,410 L310,340 L380,380 L460,310 L520,350 L600,280 L670,330 L760,290 L840,360 L920,310 L990,370 L1070,330 L1140,380 L1200,340" 
              stroke="#542e4e" stroke-width="2" fill="none" opacity="0.6" />
      </svg>

      <!-- Layer 3: Mid mountain ridges (Midnight Slate) -->
      <svg class="wallpaper-svg wallpaper-layer" data-depth="0.08" viewBox="0 0 1200 600" preserveAspectRatio="none">
        <!-- Mid mountain silhouette -->
        <path d="M0,490 L70,460 L130,480 L200,430 L280,470 L360,400 L430,450 L510,390 L580,440 L660,370 L740,430 L820,380 L900,440 L970,390 L1050,450 L1120,410 L1200,460 L1200,600 L0,600 Z" 
              fill="#12162a" />
        <!-- Highlight ridge edge -->
        <path d="M0,490 L70,460 L130,480 L200,430 L280,470 L360,400 L430,450 L510,390 L580,440 L660,370 L740,430 L820,380 L900,440 L970,390 L1050,450 L1120,410 L1200,460" 
              stroke="#2e2b4d" stroke-width="2" fill="none" opacity="0.7" />
      </svg>

      <!-- Layer 4: Near foothills and pixel pine trees (Deep Midnight) -->
      <svg class="wallpaper-svg wallpaper-layer" data-depth="0.14" viewBox="0 0 1200 600" preserveAspectRatio="none">
        <path d="M0,535 L40,530 L60,520 L65,510 L70,520 L90,530 L130,520 L150,505 L155,495 L160,505 L180,525 L230,515 L250,495 L255,485 L260,495 L280,520 L340,510 L370,480 L375,470 L380,480 L410,520 L470,505 L520,485 L525,475 L530,485 L560,515 L620,500 L650,475 L655,465 L660,475 L690,510 L760,495 L800,475 L805,465 L810,475 L840,515 L910,500 L950,480 L955,470 L960,480 L990,520 L1060,510 L1120,490 L1125,480 L1130,490 L1160,525 L1200,520 L1200,600 L0,600 Z" 
              fill="#060912" />
      </svg>

      <!-- Retro Foreground Digital Grid -->
      <div class="wallpaper-grid"></div>

      <!-- Contrast & Readability Overlay -->
      <div class="wallpaper-readability-overlay"></div>
    `;

    desktopEl.insertBefore(wallpaper, desktopEl.firstChild);

    // Subtle Parallax setup (disabled if reduced motion requested)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      let rafId = null;
      const layers = wallpaper.querySelectorAll('.wallpaper-layer');

      const onMouseMove = (e) => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          const normX = (e.clientX / window.innerWidth - 0.5) * 2;
          const normY = (e.clientY / window.innerHeight - 0.5) * 2;

          layers.forEach(layer => {
            const depth = parseFloat(layer.getAttribute('data-depth') || '0.05');
            const moveX = (normX * depth * 25).toFixed(2);
            const moveY = (normY * depth * 12).toFixed(2);
            layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
          });
          rafId = null;
        });
      };

      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }
  }

  _renderIcons() {
    const apps = this._getApps();
    apps.forEach(app => {
      const icon = document.createElement('div');
      icon.className = 'desktop-icon';
      icon.setAttribute('role', 'button');
      icon.setAttribute('aria-label', `Open ${app.label.replace('\n', ' ')}`);
      icon.tabIndex = 0;
      icon.dataset.appId = app.id;

      icon.innerHTML = `
        <div class="desktop-icon__glyph">${app.icon}</div>
        <span class="desktop-icon__label">${app.label.replace('\n', '<br>')}</span>
      `;

      // Single click: select. Double click: open.
      icon.addEventListener('click', (e) => this._onIconClick(e, app.id));
      icon.addEventListener('dblclick', (e) => {
        e.preventDefault();
        this.wm.openWindow(app.id);
      });

      // Touch: single tap opens (mobile-friendly)
      icon.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - this.lastTapTime < 300) {
          // Double tap
          e.preventDefault();
          this.wm.openWindow(app.id);
        } else {
          this._selectIcon(app.id);
        }
        this.lastTapTime = now;
      });

      // Keyboard: Enter to open
      icon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.wm.openWindow(app.id);
        }
      });

      this.container.appendChild(icon);
    });
  }

  _onIconClick(e, appId) {
    // On mobile, single click should open
    if (window.innerWidth < 768) {
      this.wm.openWindow(appId);
      return;
    }
    this._selectIcon(appId);
  }

  _selectIcon(appId) {
    this._deselectAll();
    const icon = this.container.querySelector(`[data-app-id="${appId}"]`);
    if (icon) {
      icon.classList.add('selected');
      this.selectedIcon = appId;
    }
  }

  _deselectAll() {
    this.container.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
    this.selectedIcon = null;
  }

  _renderStatusWidget() {
    const widget = document.createElement('div');
    widget.className = 'status-widget';
    widget.innerHTML = `
      <div class="status-widget__avatar" id="avatar-container" aria-hidden="true">
        <span class="status-widget__monogram">NV</span>
      </div>
      <div class="status-widget__info">
        <span class="status-widget__name">V Nava Vignesh</span>
        <span class="status-widget__tagline">● System Active</span>
      </div>
    `;
    document.querySelector('.desktop').appendChild(widget);
  }

  _showWelcome() {
    const toast = document.createElement('div');
    toast.className = 'welcome-toast';
    toast.innerHTML = 'Welcome to <span class="highlight">Vignesh.OS</span>. Double-click an application to explore.';
    document.querySelector('.desktop').appendChild(toast);

    // Show after boot
    setTimeout(() => toast.classList.add('visible'), 2000);
    // Auto-hide
    setTimeout(() => toast.classList.remove('visible'), 8000);
  }
};
