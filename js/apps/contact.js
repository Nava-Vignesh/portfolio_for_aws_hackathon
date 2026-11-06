'use strict';

/**
 * VIGNESH.OS — Contact Application Module
 * 
 * Interactive retro terminal command session displaying validated contact
 * channels, one-click copying, clickable social links, and live terminal logging.
 */
window.VOS = window.VOS || {};
VOS.apps = VOS.apps || {};

/**
 * Configurable contact details synchronized with VOS.config
 */
const getContactData = () => {
  const personal = VOS.config?.personal || {};
  const gh = VOS.getSocialLink('github');
  const li = VOS.getSocialLink('linkedin');

  return {
    name: personal.name || 'V Nava Vignesh',
    headline: personal.headline || 'Computer Science Undergrad | AI & Cloud Enthusiast',
    email: personal.email || 'navavigneshvemula79@gmail.com',
    location: personal.location || 'Guntur, Andhra Pradesh, India',
    github: gh.url || 'https://github.com/Nava-Vignesh/',
    githubDisplay: gh.display || 'github.com/Nava-Vignesh',
    githubValid: gh.isConfigured,
    linkedin: li.url || 'https://www.linkedin.com/in/navavigneshvemula/',
    linkedinDisplay: li.display || 'linkedin.com/in/navavigneshvemula',
    linkedinValid: li.isConfigured
  };
};

VOS.apps['contact'] = {
  id: 'contact',
  title: 'CONTACT',
  icon: '✉️',
  defaultWidth: 640,
  defaultHeight: 480,

  /**
   * Reference collection for active DOM listeners and timers
   */
  _listeners: [],
  _timeouts: [],

  /**
   * Render the terminal contact card into the window body container.
   * @param {HTMLElement} container - Window content container (.window-body)
   */
  render(container) {
    if (!container) return;

    const data = getContactData();

    container.innerHTML = `
      <div class="contact-terminal-container" role="region" aria-label="Terminal Contact Session">
        <!-- Terminal Titlebar / Status Bar -->
        <div class="contact-terminal-header">
          <div class="contact-terminal-controls" aria-hidden="true">
            <span class="contact-term-btn contact-term-btn--red"></span>
            <span class="contact-term-btn contact-term-btn--yellow"></span>
            <span class="contact-term-btn contact-term-btn--green"></span>
          </div>
          <div class="contact-terminal-title">vignesh@os: ~/contacts (sh)</div>
          <div class="contact-terminal-session">UTF-8</div>
        </div>

        <!-- Terminal Output Scrollable Area -->
        <div class="contact-terminal-screen" id="contact-terminal-screen" tabindex="0" role="log" aria-live="polite">
          <!-- Initial Cat Command -->
          <div class="contact-line">
            <span class="contact-prompt">vignesh@os:~$</span> <span class="contact-command">cat contact.info</span>
          </div>

          <!-- Structured Contact Directory Card -->
          <div class="contact-card">
            <div class="contact-card__header">
              <span class="contact-card__prompt-badge">// USER PROFILE DIRECTORY</span>
              <span class="contact-card__status">● ACTIVE</span>
            </div>

            <div class="contact-card__grid">
              <!-- Name & Headline -->
              <div class="contact-card__row">
                <div class="contact-card__label-wrap">
                  <span class="contact-card__icon" aria-hidden="true">👤</span>
                  <span class="contact-card__label">NAME</span>
                </div>
                <div class="contact-card__val-wrap">
                  <span class="contact-card__val-strong">${this._escapeHTML(data.name)}</span>
                  <span class="contact-card__sub">${this._escapeHTML(data.headline)}</span>
                </div>
              </div>

              <!-- Email -->
              <div class="contact-card__row">
                <div class="contact-card__label-wrap">
                  <span class="contact-card__icon" aria-hidden="true">✉️</span>
                  <span class="contact-card__label">EMAIL</span>
                </div>
                <div class="contact-card__val-wrap contact-card__val-wrap--action">
                  <a href="mailto:${this._escapeHTML(data.email)}" class="contact-card__link" id="contact-link-email">${this._escapeHTML(data.email)}</a>
                  <button type="button" class="contact-mini-btn" id="contact-btn-email" title="Copy email address" aria-label="Copy email address">
                    📋 Copy
                  </button>
                  <span class="contact-copy-badge" id="contact-copy-badge" role="status" aria-hidden="true">Copied!</span>
                </div>
              </div>

              <!-- GitHub Profile -->
              <div class="contact-card__row">
                <div class="contact-card__label-wrap">
                  <span class="contact-card__icon" aria-hidden="true">${VOS.icons?.github || '🐙'}</span>
                  <span class="contact-card__label">GITHUB</span>
                </div>
                <div class="contact-card__val-wrap contact-card__val-wrap--action">
                  <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="contact-card__link" id="contact-btn-github" aria-label="Open GitHub in new tab">
                    ${this._escapeHTML(data.githubDisplay)}
                  </a>
                  <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="contact-mini-btn" aria-label="Visit GitHub Profile">
                    Visit ↗
                  </a>
                </div>
              </div>

              <!-- LinkedIn Profile -->
              <div class="contact-card__row">
                <div class="contact-card__label-wrap">
                  <span class="contact-card__icon" aria-hidden="true">${VOS.icons?.linkedin || '💼'}</span>
                  <span class="contact-card__label">LINKEDIN</span>
                </div>
                <div class="contact-card__val-wrap contact-card__val-wrap--action">
                  <a href="${data.linkedin}" target="_blank" rel="noopener noreferrer" class="contact-card__link" id="contact-btn-linkedin" aria-label="Open LinkedIn in new tab">
                    ${this._escapeHTML(data.linkedinDisplay)}
                  </a>
                  <a href="${data.linkedin}" target="_blank" rel="noopener noreferrer" class="contact-mini-btn" aria-label="Visit LinkedIn Profile">
                    Connect ↗
                  </a>
                </div>
              </div>

              <!-- Location -->
              <div class="contact-card__row">
                <div class="contact-card__label-wrap">
                  <span class="contact-card__icon" aria-hidden="true">📍</span>
                  <span class="contact-card__label">LOCATION</span>
                </div>
                <div class="contact-card__val-wrap">
                  <span class="contact-card__val">${this._escapeHTML(data.location)}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Dynamic Command Log History -->
          <div class="contact-history-log" id="contact-history-log" aria-live="polite"></div>

          <!-- Active Blinking Prompt Line -->
          <div class="contact-active-prompt-row">
            <span class="contact-prompt">vignesh@os:~$</span>
            <span class="contact-cursor" aria-hidden="true">█</span>
          </div>
        </div>

        <!-- Terminal Quick Action Bar -->
        <footer class="contact-terminal-actions" aria-label="Quick terminal commands">
          <span class="contact-actions-label">// ACTIONS:</span>
          <button type="button" class="contact-action-btn" id="contact-action-copy">📋 copy email</button>
          <button type="button" class="contact-action-btn" id="contact-action-github" ${!data.githubValid ? 'disabled' : ''}>↗ open github</button>
          <button type="button" class="contact-action-btn" id="contact-action-linkedin" ${!data.linkedinValid ? 'disabled' : ''}>↗ open linkedin</button>
          <button type="button" class="contact-action-btn contact-action-btn--clear" id="contact-action-clear">↺ clear log</button>
        </footer>
      </div>
    `;

    const screenEl = container.querySelector('#contact-terminal-screen');
    const logEl = container.querySelector('#contact-history-log');
    const copyBadge = container.querySelector('#contact-copy-badge');

    const scrollToBottom = () => {
      if (screenEl) {
        screenEl.scrollTop = screenEl.scrollHeight;
      }
    };

    /**
     * Append a simulated terminal command and result output
     */
    const appendLog = (command, output, type = 'success') => {
      if (!logEl) return;

      const entry = document.createElement('div');
      entry.className = 'contact-log-entry';
      entry.innerHTML = `
        <div class="contact-line">
          <span class="contact-prompt">vignesh@os:~$</span> <span class="contact-command">${this._escapeHTML(command)}</span>
        </div>
        <div class="contact-output contact-output--${type}">
          &gt; ${this._escapeHTML(output)}
        </div>
      `;
      logEl.appendChild(entry);
      scrollToBottom();
    };

    /**
     * Copy email address with feedback
     */
    const handleCopyEmail = () => {
      const email = data.email;
      const onSuccess = () => {
        if (copyBadge) {
          copyBadge.classList.add('contact-copy-badge--visible');
          const timeout = setTimeout(() => {
            copyBadge.classList.remove('contact-copy-badge--visible');
          }, 2000);
          this._timeouts.push(timeout);
        }
        appendLog(`copy ${email}`, `Copied ${email} to clipboard!`);
      };

      const onError = () => {
        try {
          const textarea = document.createElement('textarea');
          textarea.value = email;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          const successful = document.execCommand('copy');
          document.body.removeChild(textarea);
          if (successful) {
            onSuccess();
            return;
          }
        } catch (err) {}
        appendLog(`copy ${email}`, `Use: ${email}`, 'error');
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(onSuccess).catch(onError);
      } else {
        onError();
      }
    };

    const handleOpenLink = (url, label) => {
      appendLog(`open ${label}`, 'Opening profile in new tab...');
    };

    // Bind event listeners
    const emailBtn = container.querySelector('#contact-btn-email');
    if (emailBtn) {
      const emailHandler = (e) => {
        e.preventDefault();
        handleCopyEmail();
      };
      emailBtn.addEventListener('click', emailHandler);
      this._listeners.push({ element: emailBtn, type: 'click', handler: emailHandler });
    }

    const githubLink = container.querySelector('#contact-btn-github');
    if (githubLink) {
      const githubHandler = () => {
        handleOpenLink(data.github, data.githubDisplay);
      };
      githubLink.addEventListener('click', githubHandler);
      this._listeners.push({ element: githubLink, type: 'click', handler: githubHandler });
    }

    const linkedinLink = container.querySelector('#contact-btn-linkedin');
    if (linkedinLink) {
      const linkedinHandler = () => {
        handleOpenLink(data.linkedin, data.linkedinDisplay);
      };
      linkedinLink.addEventListener('click', linkedinHandler);
      this._listeners.push({ element: linkedinLink, type: 'click', handler: linkedinHandler });
    }

    // Quick action footer buttons
    const actionCopy = container.querySelector('#contact-action-copy');
    if (actionCopy) {
      const actionCopyHandler = () => handleCopyEmail();
      actionCopy.addEventListener('click', actionCopyHandler);
      this._listeners.push({ element: actionCopy, type: 'click', handler: actionCopyHandler });
    }

    const actionGithub = container.querySelector('#contact-action-github');
    if (actionGithub) {
      const actionGithubHandler = () => {
        if (!data.githubValid) {
          appendLog('open github', 'GitHub profile not configured.', 'error');
          return;
        }
        handleOpenLink(data.github, data.githubDisplay);
        window.open(data.github, '_blank', 'noopener,noreferrer');
      };
      actionGithub.addEventListener('click', actionGithubHandler);
      this._listeners.push({ element: actionGithub, type: 'click', handler: actionGithubHandler });
    }

    const actionLinkedin = container.querySelector('#contact-action-linkedin');
    if (actionLinkedin) {
      const actionLinkedinHandler = () => {
        if (!data.linkedinValid) {
          appendLog('open linkedin', 'LinkedIn profile not configured.', 'error');
          return;
        }
        handleOpenLink(data.linkedin, data.linkedinDisplay);
        window.open(data.linkedin, '_blank', 'noopener,noreferrer');
      };
      actionLinkedin.addEventListener('click', actionLinkedinHandler);
      this._listeners.push({ element: actionLinkedin, type: 'click', handler: actionLinkedinHandler });
    }

    const actionClear = container.querySelector('#contact-action-clear');
    if (actionClear) {
      const actionClearHandler = () => {
        if (logEl) {
          logEl.innerHTML = '';
          scrollToBottom();
        }
      };
      actionClear.addEventListener('click', actionClearHandler);
      this._listeners.push({ element: actionClear, type: 'click', handler: actionClearHandler });
    }
  },

  /**
   * Helper to escape HTML characters
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
   * Cleanup any active event listeners or timers when the window is closed
   */
  cleanup() {
    if (this._timeouts && this._timeouts.length > 0) {
      this._timeouts.forEach(t => clearTimeout(t));
      this._timeouts = [];
    }

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
