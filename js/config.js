'use strict';

/**
 * VIGNESH.OS — Centralized System Configuration
 * 
 * Single source of truth for personal information, validated social URLs,
 * external profiles, and asset pathways.
 */
window.VOS = window.VOS || {};

VOS.config = {
  personal: {
    name: 'V Nava Vignesh',
    headline: 'Computer Science Undergrad | AI & Cloud Enthusiast',
    email: 'navavigneshvemula79@gmail.com',
    phone: '+91 9014509649',
    location: 'Guntur, Andhra Pradesh, India',
    institution: 'VVIT University, Guntur',
    degree: 'B.Tech in CSE (Artificial Intelligence)',
    cgpa: '9.0 / 10.0'
  },

  /**
   * Verified social profile links (Exact URLs specified by user)
   */
  social: {
    github: 'https://github.com/Nava-Vignesh/',
    linkedin: 'https://www.linkedin.com/in/navavigneshvemula/'
  },

  /**
   * Verified photographs in assets/images/
   */
  images: {
    profile: 'assets/images/profile.jpg',
    ideathonWinning: 'assets/images/ideathon-winning.jpg'
  }
};

/**
 * Helper to safely retrieve a social link with validity status.
 * If a link is empty or placeholder, it returns isConfigured: false so the UI
 * can render it as non-clickable.
 * 
 * @param {string} platform - 'github' | 'linkedin'
 * @returns {Object} { url, isConfigured, display, target, rel }
 */
VOS.getSocialLink = function(platform) {
  const rawUrl = VOS.config?.social?.[platform];
  const isValid = Boolean(
    rawUrl &&
    typeof rawUrl === 'string' &&
    rawUrl.trim() !== '' &&
    !rawUrl.includes('placeholder') &&
    rawUrl !== '#'
  );

  if (!isValid) {
    return {
      url: null,
      isConfigured: false,
      display: 'Not Configured',
      target: '_self',
      rel: ''
    };
  }

  const cleanUrl = rawUrl.trim();
  // Clean display string without protocol and trailing slash
  const display = cleanUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return {
    url: cleanUrl,
    isConfigured: true,
    display: display,
    target: '_blank',
    rel: 'noopener noreferrer'
  };
};

/**
 * Recognized vector SVG icons for GitHub & LinkedIn
 */
VOS.icons = {
  github: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`,
  linkedin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`
};

