'use strict';

window.VOS = window.VOS || {};
VOS.apps = VOS.apps || {};

VOS.WindowManager = class WindowManager {
  constructor(desktopEl) {
    this.desktop = desktopEl;
    this.windows = new Map(); // id -> { el, config, state: 'normal'|'minimized'|'maximized' }
    this.zCounter = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--z-window-base')) || 100;
    this.isMobile = window.innerWidth < 768;
    this.activeWindowId = null;

    // Listen for resize to update mobile flag
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });

    // Click on desktop background to deselect
    this.desktop.addEventListener('pointerdown', (e) => {
      if (e.target === this.desktop) this.blurAll();
    });
  }

  openWindow(appId) {
    const app = VOS.apps[appId];
    if (!app) return;

    // If already open, focus it
    if (this.windows.has(appId)) {
      const win = this.windows.get(appId);
      if (win.state === 'minimized') this.restoreWindow(appId);
      this.focusWindow(appId);
      return;
    }

    const el = this._createWindowEl(app);
    const state = { el, config: app, state: 'normal' };
    this.windows.set(appId, state);
    this.desktop.appendChild(el);

    // Position the window
    this._positionWindow(el, app);

    // Focus it
    this.focusWindow(appId);

    // Render app content
    const body = el.querySelector('.window-body');
    if (app.render) app.render(body);

    // Opening animation
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      el.classList.add('opening');
      el.addEventListener('animationend', () => el.classList.remove('opening'), { once: true });
    }

    // Dispatch event for taskbar
    document.dispatchEvent(new CustomEvent('vos:window-opened', { detail: { id: appId, title: app.title, icon: app.icon } }));
  }

  closeWindow(appId) {
    const win = this.windows.get(appId);
    if (!win) return;

    if (win.config.cleanup) win.config.cleanup();
    win.el.remove();
    this.windows.delete(appId);

    if (this.activeWindowId === appId) this.activeWindowId = null;
    document.dispatchEvent(new CustomEvent('vos:window-closed', { detail: { id: appId } }));
  }

  minimizeWindow(appId) {
    const win = this.windows.get(appId);
    if (!win) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      win.el.classList.add('minimizing');
      setTimeout(() => {
        win.el.classList.remove('minimizing');
        win.el.classList.add('minimized');
        win.state = 'minimized';
      }, 250);
    } else {
      win.el.classList.add('minimized');
      win.state = 'minimized';
    }

    if (this.activeWindowId === appId) this.activeWindowId = null;
    document.dispatchEvent(new CustomEvent('vos:window-minimized', { detail: { id: appId } }));
  }

  restoreWindow(appId) {
    const win = this.windows.get(appId);
    if (!win) return;

    win.el.classList.remove('minimized', 'minimizing');
    win.state = 'normal';
    this.focusWindow(appId);
    document.dispatchEvent(new CustomEvent('vos:window-restored', { detail: { id: appId } }));
  }

  maximizeWindow(appId) {
    const win = this.windows.get(appId);
    if (!win) return;

    if (win.state === 'maximized') {
      // Restore
      win.el.classList.remove('maximized');
      win.state = 'normal';
      // Restore saved position
      if (win.savedRect) {
        win.el.style.top = win.savedRect.top;
        win.el.style.left = win.savedRect.left;
        win.el.style.width = win.savedRect.width;
        win.el.style.height = win.savedRect.height;
      }
    } else {
      // Save current position
      win.savedRect = {
        top: win.el.style.top,
        left: win.el.style.left,
        width: win.el.style.width,
        height: win.el.style.height
      };
      win.el.classList.add('maximized');
      win.state = 'maximized';
    }
    document.dispatchEvent(new CustomEvent('vos:window-maximized', { detail: { id: appId, maximized: win.state === 'maximized' } }));
  }

  focusWindow(appId) {
    const win = this.windows.get(appId);
    if (!win) return;

    // Remove focus from all
    this.windows.forEach((w) => w.el.classList.remove('focused'));

    // Focus this one
    this.zCounter++;
    win.el.style.zIndex = this.zCounter;
    win.el.classList.add('focused');
    this.activeWindowId = appId;

    document.dispatchEvent(new CustomEvent('vos:window-focused', { detail: { id: appId } }));
  }

  blurAll() {
    this.windows.forEach((w) => w.el.classList.remove('focused'));
    this.activeWindowId = null;
  }

  isOpen(appId) {
    return this.windows.has(appId);
  }

  _createWindowEl(app) {
    const el = document.createElement('div');
    el.className = 'window';
    el.id = `window-${app.id}`;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', app.title);
    el.tabIndex = -1;

    el.innerHTML = `
      <div class="window-titlebar" data-window-id="${app.id}">
        <span class="window-titlebar__icon">${app.icon}</span>
        <span class="window-titlebar__title">${app.title}</span>
        <div class="window-controls">
          <button class="window-controls__btn window-controls__btn--minimize" aria-label="Minimize" data-action="minimize"></button>
          <button class="window-controls__btn window-controls__btn--maximize" aria-label="Maximize" data-action="maximize"></button>
          <button class="window-controls__btn window-controls__btn--close" aria-label="Close" data-action="close"></button>
        </div>
      </div>
      <div class="window-body"></div>
    `;

    // Window controls
    el.querySelector('[data-action="close"]').addEventListener('click', () => this.closeWindow(app.id));
    el.querySelector('[data-action="minimize"]').addEventListener('click', () => this.minimizeWindow(app.id));
    el.querySelector('[data-action="maximize"]').addEventListener('click', () => this.maximizeWindow(app.id));

    // Focus on click
    el.addEventListener('pointerdown', () => this.focusWindow(app.id));

    // Keyboard: Escape to close
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeWindow(app.id);
    });

    // Dragging (desktop only)
    if (!this.isMobile) {
      this._enableDrag(el, app.id);
    }

    return el;
  }

  _positionWindow(el, app) {
    if (this.isMobile) {
      // Full screen on mobile - CSS handles this
      return;
    }

    const w = Math.min(app.defaultWidth || 700, window.innerWidth - 40);
    const h = Math.min(app.defaultHeight || 500, window.innerHeight - 100);

    // Centre with slight random offset to cascade
    const openCount = this.windows.size;
    const offsetX = (openCount - 1) * 25;
    const offsetY = (openCount - 1) * 25;
    const left = Math.max(20, (window.innerWidth - w) / 2 + offsetX);
    const top = Math.max(20, (window.innerHeight - h - 52) / 2 + offsetY);

    el.style.width = w + 'px';
    el.style.height = h + 'px';
    el.style.left = left + 'px';
    el.style.top = top + 'px';
  }

  _enableDrag(el, appId) {
    const titlebar = el.querySelector('.window-titlebar');
    let isDragging = false;
    let startX, startY, origLeft, origTop;

    const onPointerDown = (e) => {
      // Don't drag from buttons
      if (e.target.closest('.window-controls')) return;

      const win = this.windows.get(appId);
      if (win && win.state === 'maximized') return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origLeft = el.offsetLeft;
      origTop = el.offsetTop;

      titlebar.setPointerCapture(e.pointerId);
      el.style.transition = 'none';
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;

      let newLeft = origLeft + (e.clientX - startX);
      let newTop = origTop + (e.clientY - startY);

      // Clamp to viewport
      newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 100));
      newTop = Math.max(0, Math.min(newTop, window.innerHeight - 100));

      el.style.left = newLeft + 'px';
      el.style.top = newTop + 'px';
    };

    const onPointerUp = () => {
      isDragging = false;
      el.style.transition = '';
    };

    titlebar.addEventListener('pointerdown', onPointerDown);
    titlebar.addEventListener('pointermove', onPointerMove);
    titlebar.addEventListener('pointerup', onPointerUp);
    titlebar.addEventListener('pointercancel', onPointerUp);
  }
};
