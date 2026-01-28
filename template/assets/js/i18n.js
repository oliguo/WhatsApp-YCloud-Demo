/**
 * Internationalization (i18n) Module
 * Handles language loading, switching, and translation
 */

const i18n = {
  currentLocale: 'en',
  translations: {},
  supportedLocales: ['en', 'zh-hk', 'zh-cn'],
  localeNames: {
    'en': 'English',
    'zh-hk': '繁體中文',
    'zh-cn': '简体中文'
  },

  /**
   * Initialize i18n with the specified locale or browser default
   * @param {string} locale - Optional locale override
   */
  async init(locale = null) {
    // Priority: param > localStorage > browser > default
    const savedLocale = localStorage.getItem('preferred_locale');
    const browserLocale = navigator.language.toLowerCase();
    
    let targetLocale = locale || savedLocale;
    
    if (!targetLocale) {
      // Try to match browser locale
      if (browserLocale.startsWith('zh-hk') || browserLocale.startsWith('zh-tw')) {
        targetLocale = 'zh-hk';
      } else if (browserLocale.startsWith('zh')) {
        targetLocale = 'zh-cn';
      } else {
        targetLocale = 'en';
      }
    }

    await this.setLocale(targetLocale);
    this.renderLanguageSelector();
  },

  /**
   * Load and set the current locale
   * @param {string} locale - Locale code (en, zh-hk, zh-cn)
   */
  async setLocale(locale) {
    if (!this.supportedLocales.includes(locale)) {
      console.warn(`Locale "${locale}" not supported, falling back to "en"`);
      locale = 'en';
    }

    try {
      const response = await fetch(`../locales/${locale}.json`);
      if (!response.ok) throw new Error(`Failed to load locale: ${locale}`);
      
      this.translations = await response.json();
      this.currentLocale = locale;
      localStorage.setItem('preferred_locale', locale);
      
      // Update page
      this.translatePage();
      document.documentElement.lang = locale;
      
      // Dispatch event for components that need to react
      window.dispatchEvent(new CustomEvent('localeChanged', { detail: { locale } }));
    } catch (error) {
      console.error('Error loading locale:', error);
      if (locale !== 'en') {
        await this.setLocale('en');
      }
    }
  },

  /**
   * Get a translation by key path
   * @param {string} key - Dot-separated key path (e.g., "app.title")
   * @param {object} params - Optional parameters for interpolation
   * @returns {string} Translated string or key if not found
   */
  t(key, params = {}) {
    const keys = key.split('.');
    let value = this.translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation key "${key}" is not a string`);
      return key;
    }

    // Interpolate parameters {{param}}
    return value.replace(/\{\{(\w+)\}\}/g, (match, paramName) => {
      return params.hasOwnProperty(paramName) ? params[paramName] : match;
    });
  },

  /**
   * Translate all elements with data-i18n attribute
   */
  translatePage() {
    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });

    // Titles/tooltips
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = this.t(key);
    });

    // ARIA labels
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      el.setAttribute('aria-label', this.t(key));
    });

    // Update document title if specified
    const titleKey = document.body.getAttribute('data-i18n-title');
    if (titleKey) {
      document.title = this.t(titleKey);
    }
  },

  /**
   * Render language selector dropdown
   */
  renderLanguageSelector() {
    const container = document.getElementById('language-selector');
    if (!container) return;

    container.innerHTML = `
      <select id="locale-select" class="locale-select">
        ${this.supportedLocales.map(locale => `
          <option value="${locale}" ${locale === this.currentLocale ? 'selected' : ''}>
            ${this.localeNames[locale]}
          </option>
        `).join('')}
      </select>
    `;

    container.querySelector('#locale-select').addEventListener('change', (e) => {
      this.setLocale(e.target.value);
    });
  }
};

// Shorthand function for templates
function t(key, params) {
  return i18n.t(key, params);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { i18n, t };
}
