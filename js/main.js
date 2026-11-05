'use strict';

(function() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function boot() {
    const bootScreen = document.getElementById('boot-screen');
    const progressBar = document.getElementById('boot-progress-bar');
    const statusEl = document.getElementById('boot-status');

    if (prefersReducedMotion) {
      // Skip animation
      bootScreen.classList.add('hidden');
      setTimeout(() => {
        bootScreen.remove();
        init();
      }, 50);
      return;
    }

    // Animate boot
    const messages = [
      'Loading system components...',
      'Initializing applications...',
      'Starting desktop environment...'
    ];

    progressBar.classList.add('filling');

    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      if (msgIndex < messages.length) {
        statusEl.textContent = messages[msgIndex];
        msgIndex++;
      }
    }, 400);

    setTimeout(() => {
      clearInterval(msgInterval);
      statusEl.textContent = 'Welcome.';

      setTimeout(() => {
        bootScreen.classList.add('hidden');
        setTimeout(() => {
          bootScreen.remove();
        }, 400);
        init();
      }, 300);
    }, 1500);
  }

  function init() {
    const desktopEl = document.querySelector('.desktop');
    const taskbarEl = document.querySelector('.taskbar');
    const iconsEl = document.querySelector('.desktop-icons');

    // Create window manager
    const wm = new VOS.WindowManager(desktopEl);

    // Create desktop
    const desktop = new VOS.Desktop(iconsEl, wm);

    // Create taskbar
    const taskbar = new VOS.Taskbar(taskbarEl, wm);

    // Store globally for debugging
    VOS.wm = wm;
    VOS.desktop = desktop;
    VOS.taskbar = taskbar;
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
