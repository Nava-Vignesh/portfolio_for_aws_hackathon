'use strict';

window.VOS = window.VOS || {};

VOS.Taskbar = class Taskbar {
  constructor(taskbarEl, windowManager) {
    this.el = taskbarEl;
    this.wm = windowManager;
    this.launcherOpen = false;
    this.openApps = new Map(); // id -> button element

    this._render();
    this._startClock();
    this._listenWindowEvents();
  }

  _render() {
    this.el.innerHTML = `
      <button class="taskbar__start" aria-label="Application launcher" tabindex="0">
        <span class="taskbar__start-logo">V</span>
        <span class="taskbar__start-label">VIGNESH.OS</span>
      </button>
      <div class="taskbar__divider"></div>
      <div class="taskbar__apps" role="tablist" aria-label="Open applications"></div>
      <div class="taskbar__right">
        <div class="taskbar__system">
          <span class="taskbar__system-dot"></span>
          <span>All systems nominal</span>
        </div>
        <div class="taskbar__divider"></div>
        <div class="taskbar__clock">
          <div class="taskbar__clock-time"></div>
          <div class="taskbar__clock-date"></div>
        </div>
      </div>
    `;

    // Launcher
    this._createLauncher();

    // Start button toggles launcher
    this.el.querySelector('.taskbar__start').addEventListener('click', () => this.toggleLauncher());

    // Close launcher on outside click
    document.addEventListener('click', (e) => {
      if (this.launcherOpen && !e.target.closest('.launcher') && !e.target.closest('.taskbar__start')) {
        this.closeLauncher();
      }
    });
  }

  _createLauncher() {
    const launcher = document.createElement('div');
    launcher.className = 'launcher';
    launcher.setAttribute('role', 'menu');
    launcher.innerHTML = `<div class="launcher__title">APPLICATIONS</div>`;

    const apps = [
      { id: 'profile', icon: '👤', label: 'MY PROFILE' },
      { id: 'projects', icon: '📁', label: 'PROJECT EXPLORER' },
      { id: 'toolkit', icon: '🛠️', label: 'TECH TOOLKIT' },
      { id: 'journey', icon: '🗺️', label: 'MY JOURNEY' },
      { id: 'achievements', icon: '🏆', label: 'ACHIEVEMENTS' },
      { id: 'contact', icon: '✉️', label: 'CONTACT' },
      { id: 'journey-run', icon: '🦖', label: 'JOURNEY.RUN' }
    ];

    apps.forEach(app => {
      const item = document.createElement('div');
      item.className = 'launcher__item';
      item.setAttribute('role', 'menuitem');
      item.tabIndex = 0;
      item.innerHTML = `
        <span class="launcher__item-icon">${app.icon}</span>
        <span class="launcher__item-label">${app.label}</span>
      `;
      item.addEventListener('click', () => {
        this.wm.openWindow(app.id);
        this.closeLauncher();
      });
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.wm.openWindow(app.id);
          this.closeLauncher();
        }
      });
      launcher.appendChild(item);
    });

    document.body.appendChild(launcher);
    this.launcherEl = launcher;
  }

  toggleLauncher() {
    this.launcherOpen ? this.closeLauncher() : this.openLauncher();
  }

  openLauncher() {
    this.launcherEl.classList.add('visible');
    this.launcherOpen = true;
  }

  closeLauncher() {
    this.launcherEl.classList.remove('visible');
    this.launcherOpen = false;
  }

  _startClock() {
    const update = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const timeEl = this.el.querySelector('.taskbar__clock-time');
      const dateEl = this.el.querySelector('.taskbar__clock-date');
      if (timeEl) timeEl.textContent = timeStr;
      if (dateEl) dateEl.textContent = dateStr;
    };
    update();
    setInterval(update, 1000);
  }

  _listenWindowEvents() {
    document.addEventListener('vos:window-opened', (e) => this._addAppButton(e.detail));
    document.addEventListener('vos:window-closed', (e) => this._removeAppButton(e.detail.id));
    document.addEventListener('vos:window-minimized', (e) => this._markMinimized(e.detail.id));
    document.addEventListener('vos:window-restored', (e) => this._markActive(e.detail.id));
    document.addEventListener('vos:window-focused', (e) => this._markActive(e.detail.id));
  }

  _addAppButton(detail) {
    if (this.openApps.has(detail.id)) return;

    const btn = document.createElement('button');
    btn.className = 'taskbar__app-btn active';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', detail.title);
    btn.tabIndex = 0;
    btn.innerHTML = `
      <span class="taskbar__app-btn__icon">${detail.icon}</span>
      <span class="taskbar__app-btn__label">${detail.title}</span>
      <span class="taskbar__app-btn__indicator"></span>
    `;

    btn.addEventListener('click', () => {
      const win = this.wm.windows.get(detail.id);
      if (win) {
        if (win.state === 'minimized') {
          this.wm.restoreWindow(detail.id);
        } else if (this.wm.activeWindowId === detail.id) {
          this.wm.minimizeWindow(detail.id);
        } else {
          this.wm.focusWindow(detail.id);
        }
      }
    });

    this.el.querySelector('.taskbar__apps').appendChild(btn);
    this.openApps.set(detail.id, btn);
  }

  _removeAppButton(id) {
    const btn = this.openApps.get(id);
    if (btn) {
      btn.remove();
      this.openApps.delete(id);
    }
  }

  _markMinimized(id) {
    const btn = this.openApps.get(id);
    if (btn) {
      btn.classList.remove('active');
      btn.classList.add('minimized');
    }
  }

  _markActive(id) {
    // Remove active from all
    this.openApps.forEach(btn => btn.classList.remove('active'));
    const btn = this.openApps.get(id);
    if (btn) {
      btn.classList.remove('minimized');
      btn.classList.add('active');
    }
  }
};
