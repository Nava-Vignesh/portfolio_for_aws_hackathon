'use strict';

window.VOS = window.VOS || {};

VOS.Desktop = class Desktop {
  constructor(containerEl, windowManager) {
    this.container = containerEl;
    this.wm = windowManager;
    this.selectedIcon = null;
    this.lastTapTime = 0;

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
      { id: 'superpower', icon: '⚡', label: 'SUPERPOWER\n.EXE' }
    ];
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
      <div class="status-widget__avatar" id="avatar-container">
        <img src="assets/images/profile.jpg" alt="Vignesh" onerror="this.parentElement.innerHTML='NV'; this.remove();">
      </div>
      <div class="status-widget__info">
        <span class="status-widget__name">Nava Vignesh</span>
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
