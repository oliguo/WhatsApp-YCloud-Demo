/**
 * Common Utilities Module
 * Shared helper functions across all pages
 */

const utils = {
  /**
   * Format date to localized string
   * @param {string} dateString - ISO date string
   * @param {string} locale - Locale code
   */
  formatDate(dateString, locale = i18n.currentLocale) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const localeMap = {
      'en': 'en-US',
      'zh-hk': 'zh-HK',
      'zh-cn': 'zh-CN'
    };
    return date.toLocaleDateString(localeMap[locale] || 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  /**
   * Format template status with badge HTML
   * @param {string} status - Template status
   */
  formatStatus(status) {
    const statusMap = {
      'APPROVED': { class: 'status-approved', key: 'status.approved' },
      'PENDING': { class: 'status-pending', key: 'status.pending' },
      'REJECTED': { class: 'status-rejected', key: 'status.rejected' },
      'DISABLED': { class: 'status-disabled', key: 'status.disabled' }
    };
    const config = statusMap[status] || { class: 'status-unknown', key: 'status.unknown' };
    return `<span class="status-badge ${config.class}">${t(config.key)}</span>`;
  },

  /**
   * Format category with translation
   * @param {string} category - Template category
   */
  formatCategory(category) {
    const categoryMap = {
      'MARKETING': 'category.marketing',
      'UTILITY': 'category.utility',
      'AUTHENTICATION': 'category.authentication'
    };
    return t(categoryMap[category] || category);
  },

  /**
   * Get language display name
   * @param {string} code - Language code
   */
  getLanguageName(code) {
    const languages = {
      'en': 'English',
      'en_US': 'English (US)',
      'en_GB': 'English (UK)',
      'zh_CN': '简体中文',
      'zh_HK': '繁體中文（香港）',
      'es': 'Español',
      'pt_BR': 'Português (BR)',
      'fr': 'Français',
      'de': 'Deutsch',
      'it': 'Italiano',
      'ja': '日本語',
      'ko': '한국어',
      'ar': 'العربية',
      'hi': 'हिंदी'
    };
    return languages[code] || code;
  },

  /**
   * Show toast notification
   * @param {string} message - Toast message
   * @param {string} type - Type: success, error, warning, info
   * @param {number} duration - Duration in ms
   */
  showToast(message, type = 'info', duration = 3000) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${this.getToastIcon(type)}</span>
      <span class="toast-message">${message}</span>
    `;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('show'));

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /**
   * Get icon for toast type
   */
  getToastIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  },

  /**
   * Show confirmation dialog
   * @param {string} message - Confirmation message
   * @returns {Promise<boolean>}
   */
  confirm(message) {
    return new Promise((resolve) => {
      // Create modal backdrop
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      
      const modal = document.createElement('div');
      modal.className = 'confirm-modal';
      modal.innerHTML = `
        <div class="confirm-content">
          <p class="confirm-message">${message}</p>
          <div class="confirm-actions">
            <button class="btn btn-secondary" data-action="cancel">${t('app.cancel')}</button>
            <button class="btn btn-danger" data-action="confirm">${t('app.confirm')}</button>
          </div>
        </div>
      `;

      backdrop.appendChild(modal);
      document.body.appendChild(backdrop);

      // Handle clicks
      backdrop.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        if (action === 'confirm') {
          resolve(true);
        } else if (action === 'cancel' || e.target === backdrop) {
          resolve(false);
        }
        backdrop.remove();
      });

      // Focus confirm button
      modal.querySelector('[data-action="confirm"]').focus();
    });
  },

  /**
   * Debounce function
   * @param {Function} fn - Function to debounce
   * @param {number} delay - Delay in ms
   */
  debounce(fn, delay = 300) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  /**
   * Escape HTML to prevent XSS
   * @param {string} str - String to escape
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Convert WhatsApp formatting to HTML
   * @param {string} text - Text with WhatsApp formatting
   */
  whatsappToHtml(text) {
    if (!text) return '';
    return this.escapeHtml(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<strong>$1</strong>')
      .replace(/_(.+?)_/g, '<em>$1</em>')
      .replace(/~(.+?)~/g, '<del>$1</del>')
      .replace(/```(.+?)```/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  },

  /**
   * Parse template components into structured format
   * @param {Array} components - Template components array
   */
  parseComponents(components) {
    const result = {
      header: null,
      body: null,
      footer: null,
      buttons: []
    };

    if (!components) return result;

    for (const comp of components) {
      switch (comp.type) {
        case 'HEADER':
          result.header = comp;
          break;
        case 'BODY':
          result.body = comp;
          break;
        case 'FOOTER':
          result.footer = comp;
          break;
        case 'BUTTONS':
          result.buttons = comp.buttons || [];
          break;
      }
    }

    return result;
  },

  /**
   * Get URL parameters as object
   */
  getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  },

  /**
   * Update URL parameters without reload
   * @param {object} params - Parameters to update
   */
  updateUrlParams(params) {
    const url = new URL(window.location);
    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === '') {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value);
      }
    }
    window.history.replaceState({}, '', url);
  },

  /**
   * Navigate to URL with optional parameters
   * @param {string} path - Path to navigate to (relative or absolute)
   * @param {object} params - Optional query parameters
   */
  navigateTo(path, params = {}) {
    // Build query string
    const queryString = Object.entries(params)
      .filter(([, value]) => value !== null && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    // Combine path with query string
    const separator = path.includes('?') ? '&' : '?';
    const fullPath = queryString ? `${path}${separator}${queryString}` : path;
    
    window.location.href = fullPath;
  },

  /**
   * Store template data for duplication/recreation
   * @param {object} data - Template data to store
   */
  storeTemplateData(data) {
    sessionStorage.setItem('template_data', JSON.stringify(data));
  },

  /**
   * Retrieve stored template data
   * @returns {object|null}
   */
  getStoredTemplateData() {
    const data = sessionStorage.getItem('template_data');
    if (data) {
      sessionStorage.removeItem('template_data');
      return JSON.parse(data);
    }
    return null;
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { utils };
}
