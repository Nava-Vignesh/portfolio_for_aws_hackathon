'use strict';

/**
 * VIGNESH.OS — Contact Application Module
 * 
 * Interactive retro terminal command prompt displaying contact information,
 * clickable external links, clipboard copying, and live command logging.
 */
window.VOS = window.VOS || {};
VOS.apps = VOS.apps || {};

/**
 * Clearly configurable contact details
 */
const CONTACT_DATA = {
  name: 'V Nava Vignesh',
  email: 'navavigneshvemula79@gmail.com',
  phone: '+91 9014509649',
  location: 'Guntur, Andhra Pradesh, India',
  github: 'https://github.com/navavignesh',
  linkedin: 'https://linkedin.com/in/navavigneshvemula79'
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

    // Extract display values (strip protocol for clean terminal display)
    const githubDisplay = CONTACT_DATA.github.replace(/^https?:\/\//, '');
    const linkedinDisplay = CONTACT_DATA.linkedin.replace(/^https?:\/\//, '');

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

          <!-- ASCII Contact Box -->
          <div class="contact-ascii-wrapper">
            <pre class="contact-ascii-box" aria-label="Contact Information Box">
┌────────────────────────────────────────────────────────┐
│  CONTACT INFORMATION                                   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  👤 Name                                               │
│     ${CONTACT_DATA.name}                                        │
│                                                        │
│  📧 Email                                              │
│     <button type="button" class="contact-link contact-link--email" id="contact-btn-email" aria-label="Copy email address ${CONTACT_DATA.email}" title="Click to copy">${CONTACT_DATA.email}</button> <span class="contact-copy-badge" id="contact-copy-badge" role="status" aria-hidden="true">Copied!</span>
│                                                        │
│  📱 Phone                                              │
│     <a href="tel:+919014509649" class="contact-link" id="contact-btn-phone" aria-label="Call ${CONTACT_DATA.phone}">${CONTACT_DATA.phone}</a>                           │
│                                                        │
│  📍 Location                                           │
│     ${CONTACT_DATA.location}               │
│                                                        │
│  🐙 GitHub                                             │
│     <a href="${CONTACT_DATA.github}" target="_blank" rel="noopener noreferrer" class="contact-link contact-link--github" id="contact-btn-github" aria-label="Open GitHub profile in new tab">${githubDisplay}</a>                 │
│                                                        │
│  💼 LinkedIn                                           │
│     <a href="${CONTACT_DATA.linkedin}" target="_blank" rel="noopener noreferrer" class="contact-link contact-link--linkedin" id="contact-btn-linkedin" aria-label="Open LinkedIn profile in new tab">${linkedinDisplay}</a> │
│                                                        │
└────────────────────────────────────────────────────────┘</pre>
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
          <span class="contact-actions-label">// QUICK ACTIONS:</span>
          <button type="button" class="contact-action-btn" id="contact-action-copy">📋 copy email</button>
          <button type="button" class="contact-action-btn" id="contact-action-phone">📞 phone</button>
          <button type="button" class="contact-action-btn" id="contact-action-github">↗ open github</button>
          <button type="button" class="contact-action-btn" id="contact-action-linkedin">↗ open linkedin</button>
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
     * @param {string} command - Command string
     * @param {string} output - Feedback response string
     * @param {string} [type='success'] - 'success' | 'info' | 'error'
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
     * Copy email address with fallback and user feedback
     */
    const handleCopyEmail = () => {
      const email = CONTACT_DATA.email;
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
        // Fallback for older browsers or permission denials
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
        } catch (err) {
          // ignore
        }
        appendLog(`copy ${email}`, `Failed to write to clipboard. Use: ${email}`, 'error');
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(onSuccess).catch(onError);
      } else {
        onError();
      }
    };

    /**
     * Handle link clicks for external profiles
     * @param {string} url - Target URL
     * @param {string} label - Display label
     */
    const handleOpenLink = (url, label) => {
      appendLog(`open ${label}`, 'Opening in new tab...');
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
        handleOpenLink(CONTACT_DATA.github, githubDisplay);
      };
      githubLink.addEventListener('click', githubHandler);
      this._listeners.push({ element: githubLink, type: 'click', handler: githubHandler });
    }

    const linkedinLink = container.querySelector('#contact-btn-linkedin');
    if (linkedinLink) {
      const linkedinHandler = () => {
        handleOpenLink(CONTACT_DATA.linkedin, linkedinDisplay);
      };
      linkedinLink.addEventListener('click', linkedinHandler);
      this._listeners.push({ element: linkedinLink, type: 'click', handler: linkedinHandler });
    }

    const phoneLink = container.querySelector('#contact-btn-phone');
    if (phoneLink) {
      const phoneHandler = () => {
        appendLog(`call ${CONTACT_DATA.phone}`, `Initiating call to ${CONTACT_DATA.phone}`);
      };
      phoneLink.addEventListener('click', phoneHandler);
      this._listeners.push({ element: phoneLink, type: 'click', handler: phoneHandler });
    }

    // Bind quick action footer buttons
    const actionCopy = container.querySelector('#contact-action-copy');
    if (actionCopy) {
      const actionCopyHandler = () => handleCopyEmail();
      actionCopy.addEventListener('click', actionCopyHandler);
      this._listeners.push({ element: actionCopy, type: 'click', handler: actionCopyHandler });
    }

    const actionPhone = container.querySelector('#contact-action-phone');
    if (actionPhone) {
      const actionPhoneHandler = () => {
        appendLog(`call ${CONTACT_DATA.phone}`, `Phone: ${CONTACT_DATA.phone}`);
        window.location.href = `tel:${CONTACT_DATA.phone.replace(/[^+\d]/g, '')}`;
      };
      actionPhone.addEventListener('click', actionPhoneHandler);
      this._listeners.push({ element: actionPhone, type: 'click', handler: actionPhoneHandler });
    }

    const actionGithub = container.querySelector('#contact-action-github');
    if (actionGithub) {
      const actionGithubHandler = () => {
        handleOpenLink(CONTACT_DATA.github, githubDisplay);
        window.open(CONTACT_DATA.github, '_blank', 'noopener,noreferrer');
      };
      actionGithub.addEventListener('click', actionGithubHandler);
      this._listeners.push({ element: actionGithub, type: 'click', handler: actionGithubHandler });
    }

    const actionLinkedin = container.querySelector('#contact-action-linkedin');
    if (actionLinkedin) {
      const actionLinkedinHandler = () => {
        handleOpenLink(CONTACT_DATA.linkedin, linkedinDisplay);
        window.open(CONTACT_DATA.linkedin, '_blank', 'noopener,noreferrer');
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
