/**
 * Template Creation Page Module
 */

// Constants
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'zh_CN', name: '简体中文' },
  { code: 'zh_HK', name: '繁體中文（香港）' },
  { code: 'zh_TW', name: '繁體中文（台灣）' },
  { code: 'es', name: 'Español' },
  { code: 'pt_BR', name: 'Português (BR)' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' }
];

const BUTTON_TYPES = {
  QUICK_REPLY: { icon: '↩️', maxCount: 10 },
  PHONE_NUMBER: { icon: '📞', maxCount: 1 },
  URL: { icon: '🔗', maxCount: 2 },
  COPY_CODE: { icon: '📋', maxCount: 1 },
  FLOW: { icon: '🔀', maxCount: 1 }
};

// State
let selectedLanguages = ['en'];
let activeLanguage = 'en';
let languageData = {};
let storedTemplateData = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await i18n.init();
  initializeForm();
  setupEventListeners();
  
  // Check for stored template data (duplicate/recreate)
  storedTemplateData = utils.getStoredTemplateData();
  if (storedTemplateData) {
    loadStoredTemplate();
  }
});

/**
 * Initialize form with default values
 */
function initializeForm() {
  // Initialize language data structure
  selectedLanguages.forEach(lang => {
    languageData[lang] = createEmptyLanguageData();
  });
  
  renderLanguageTabs();
  updatePreview();
}

/**
 * Create empty language data structure
 */
function createEmptyLanguageData() {
  return {
    header: {
      type: 'NONE',
      text: '',
      mediaType: 'IMAGE',
      mediaUrl: '',
      location: { name: '', address: '', latitude: '', longitude: '' }
    },
    body: '',
    footer: '',
    buttons: [],
    variables: {}
  };
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Language checkbox changes
  document.getElementById('language-checkboxes').addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      handleLanguageChange();
    }
  });
  
  // Form submission
  document.getElementById('template-form').addEventListener('submit', handleSubmit);
  
  // Update preview on locale change
  window.addEventListener('localeChanged', updatePreview);
}

/**
 * Handle language selection change
 */
function handleLanguageChange() {
  const checkboxes = document.querySelectorAll('input[name="languages"]:checked');
  const newLanguages = Array.from(checkboxes).map(cb => cb.value);
  
  // Must have at least one language
  if (newLanguages.length === 0) {
    document.querySelector(`input[value="${selectedLanguages[0]}"]`).checked = true;
    utils.showToast(t('validation.languageRequired'), 'warning');
    return;
  }
  
  // Add new languages
  newLanguages.forEach(lang => {
    if (!languageData[lang]) {
      languageData[lang] = createEmptyLanguageData();
    }
  });
  
  // Remove deselected languages
  selectedLanguages.forEach(lang => {
    if (!newLanguages.includes(lang)) {
      delete languageData[lang];
    }
  });
  
  selectedLanguages = newLanguages;
  
  // Ensure active language is still selected
  if (!selectedLanguages.includes(activeLanguage)) {
    activeLanguage = selectedLanguages[0];
  }
  
  renderLanguageTabs();
  updatePreview();
}

/**
 * Render language tabs and content
 */
function renderLanguageTabs() {
  const tabsContainer = document.getElementById('lang-tabs');
  const contentContainer = document.getElementById('lang-contents');
  
  // Render tabs
  tabsContainer.innerHTML = selectedLanguages.map(lang => {
    const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === lang) || { name: lang };
    return `
      <button type="button" class="wtm-tabs__tab ${lang === activeLanguage ? 'active' : ''}" 
              onclick="switchLanguage('${lang}')">
        ${langInfo.name}
      </button>
    `;
  }).join('');
  
  // Render content for each language
  contentContainer.innerHTML = selectedLanguages.map(lang => `
    <div class="wtm-lang-content ${lang === activeLanguage ? 'active' : ''}" data-lang="${lang}">
      ${renderLanguageContent(lang)}
    </div>
  `).join('');
  
  // Setup event listeners for the new content
  setupLanguageContentListeners();
}

/**
 * Render content form for a language
 */
function renderLanguageContent(lang) {
  const data = languageData[lang];
  
  return `
    <!-- Header Section -->
    <div class="wtm-form-group">
      <label class="wtm-section-title" data-i18n="creation.header">${t('creation.header')}</label>
      <div class="wtm-header-types">
        ${renderHeaderTypeOption(lang, 'NONE', t('creation.headerNone'), '🚫')}
        ${renderHeaderTypeOption(lang, 'TEXT', t('creation.headerText'), '📝')}
        ${renderHeaderTypeOption(lang, 'MEDIA', t('creation.headerMedia'), '🖼️')}
        ${renderHeaderTypeOption(lang, 'LOCATION', t('creation.headerLocation'), '📍')}
      </div>
      
      <!-- Text Header -->
      <div class="header-text-section" style="display: ${data.header.type === 'TEXT' ? 'block' : 'none'};">
        <input type="text" class="wtm-input header-text-input" 
               value="${utils.escapeHtml(data.header.text)}"
               data-i18n-placeholder="creation.headerTextPlaceholder"
               placeholder="${t('creation.headerTextPlaceholder')}"
               maxlength="60">
        <div class="wtm-char-counter"><span class="header-char-count">${data.header.text.length}</span>/60</div>
      </div>
      
      <!-- Media Header -->
      <div class="header-media-section" style="display: ${data.header.type === 'MEDIA' ? 'block' : 'none'};">
        <div class="wtm-media-types">
          ${renderMediaTypeOption(lang, 'IMAGE', t('mediaType.image'), '🖼️')}
          ${renderMediaTypeOption(lang, 'VIDEO', t('mediaType.video'), '🎬')}
          ${renderMediaTypeOption(lang, 'DOCUMENT', t('mediaType.document'), '📄')}
        </div>
        <input type="url" class="wtm-input media-url-input"
               value="${utils.escapeHtml(data.header.mediaUrl)}"
               placeholder="https://example.com/image.jpg">
        <p class="wtm-form-group__hint media-url-hint">
          ${getMediaUrlHint(data.header.mediaType)}
        </p>
      </div>
      
      <!-- Location Header -->
      <div class="header-location-section" style="display: ${data.header.type === 'LOCATION' ? 'block' : 'none'};">
        <div class="wtm-location-fields">
          <div class="wtm-form-group">
            <label>Name</label>
            <input type="text" class="wtm-input location-name-input" 
                   value="${utils.escapeHtml(data.header.location.name)}"
                   placeholder="Location name">
          </div>
          <div class="wtm-form-group">
            <label>Address</label>
            <input type="text" class="wtm-input location-address-input"
                   value="${utils.escapeHtml(data.header.location.address)}"
                   placeholder="Full address">
          </div>
          <div class="wtm-form-group">
            <label>Latitude</label>
            <input type="number" step="any" class="wtm-input location-lat-input"
                   value="${data.header.location.latitude}"
                   placeholder="e.g., 22.3193">
          </div>
          <div class="wtm-form-group">
            <label>Longitude</label>
            <input type="number" step="any" class="wtm-input location-lng-input"
                   value="${data.header.location.longitude}"
                   placeholder="e.g., 114.1694">
          </div>
        </div>
      </div>
    </div>
    
    <!-- Body Section -->
    <div class="wtm-form-group">
      <label class="wtm-section-title" data-i18n="creation.body">${t('creation.body')}</label>
      <div class="wtm-body-editor">
        <div class="wtm-body-editor__toolbar">
          <button type="button" class="wtm-toolbar-btn" onclick="insertFormat('${lang}', 'bold')" title="${t('toolbar.bold')}"><b>B</b></button>
          <button type="button" class="wtm-toolbar-btn" onclick="insertFormat('${lang}', 'italic')" title="${t('toolbar.italic')}"><i>I</i></button>
          <button type="button" class="wtm-toolbar-btn" onclick="insertFormat('${lang}', 'strike')" title="${t('toolbar.strikethrough')}"><s>S</s></button>
          <button type="button" class="wtm-toolbar-btn" onclick="insertFormat('${lang}', 'code')" title="${t('toolbar.code')}">&lt;/&gt;</button>
          <button type="button" class="wtm-toolbar-btn wtm-toolbar-btn--variable" onclick="insertVariable('${lang}')" title="${t('toolbar.addVariable')}">+ {{var}}</button>
        </div>
        <textarea class="wtm-input wtm-body-editor__textarea body-textarea"
                  data-i18n-placeholder="creation.bodyPlaceholder"
                  placeholder="${t('creation.bodyPlaceholder')}"
                  maxlength="1024">${utils.escapeHtml(data.body)}</textarea>
      </div>
      <div class="wtm-char-counter"><span class="body-char-count">${data.body.length}</span>/1024</div>
      <div class="wtm-variable-list body-variables"></div>
    </div>
    
    <!-- Footer Section -->
    <div class="wtm-form-group">
      <label class="wtm-section-title" data-i18n="creation.footer">${t('creation.footer')}</label>
      <input type="text" class="wtm-input footer-input"
             value="${utils.escapeHtml(data.footer)}"
             data-i18n-placeholder="creation.footerPlaceholder"
             placeholder="${t('creation.footerPlaceholder')}"
             maxlength="60">
      <div class="wtm-char-counter"><span class="footer-char-count">${data.footer.length}</span>/60</div>
    </div>
    
    <!-- Buttons Section -->
    <div class="wtm-buttons-section">
      <label class="wtm-section-title" data-i18n="creation.buttons">${t('creation.buttons')}</label>
      <div class="wtm-buttons-list buttons-container">
        ${data.buttons.map((btn, idx) => renderButton(lang, btn, idx)).join('')}
      </div>
      <div class="wtm-add-button-wrapper mt-2">
        <button type="button" class="wtm-add-button" onclick="toggleButtonMenu('${lang}')">
          + ${t('creation.addButton')}
        </button>
        <div class="wtm-button-menu" id="button-menu-${lang}">
          ${Object.entries(BUTTON_TYPES).map(([type, config]) => `
            <div class="wtm-button-menu__item" onclick="addButton('${lang}', '${type}')">
              <span>${config.icon}</span>
              <span>${getButtonTypeName(type)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

/**
 * Render header type option
 */
function renderHeaderTypeOption(lang, type, label, icon) {
  const data = languageData[lang];
  const isActive = data.header.type === type;
  return `
    <label class="wtm-header-type ${isActive ? 'active' : ''}" data-header-type="${type}">
      <input type="radio" name="header-type-${lang}" value="${type}" ${isActive ? 'checked' : ''}>
      <span>${icon}</span>
      <span>${label}</span>
    </label>
  `;
}

/**
 * Render media type option
 */
function renderMediaTypeOption(lang, type, label, icon) {
  const data = languageData[lang];
  const isActive = data.header.mediaType === type;
  return `
    <label class="wtm-media-type ${isActive ? 'active' : ''}" data-media-type="${type}">
      <input type="radio" name="media-type-${lang}" value="${type}" ${isActive ? 'checked' : ''}>
      <div class="wtm-media-type__icon">${icon}</div>
      <div>${label}</div>
    </label>
  `;
}

/**
 * Get media URL hint based on type
 */
function getMediaUrlHint(type) {
  const hints = {
    IMAGE: 'Supported: .jpg, .jpeg, .png',
    VIDEO: 'Supported: .mp4, .3gp',
    DOCUMENT: 'Supported: .pdf'
  };
  return hints[type] || '';
}

/**
 * Render a single button
 */
function renderButton(lang, btn, idx) {
  return `
    <div class="wtm-button-item" data-button-index="${idx}">
      <div class="wtm-button-item__header">
        <div class="wtm-button-item__title">
          <span>${BUTTON_TYPES[btn.type]?.icon || '📱'}</span>
          <span>${getButtonTypeName(btn.type)}</span>
        </div>
        <button type="button" class="wtm-button-item__remove" onclick="removeButton('${lang}', ${idx})">×</button>
      </div>
      <div class="wtm-button-item__fields">
        ${renderButtonFields(lang, btn, idx)}
      </div>
    </div>
  `;
}

/**
 * Render button-specific fields
 */
function renderButtonFields(lang, btn, idx) {
  switch (btn.type) {
    case 'QUICK_REPLY':
      return `
        <div class="wtm-button-item__field">
          <label>${t('creation.buttonText')}</label>
          <input type="text" class="wtm-input btn-text-input" 
                 value="${utils.escapeHtml(btn.text || '')}"
                 maxlength="25" required>
        </div>
      `;
    
    case 'PHONE_NUMBER':
      return `
        <div class="wtm-button-item__field">
          <label>${t('creation.buttonText')}</label>
          <input type="text" class="wtm-input btn-text-input"
                 value="${utils.escapeHtml(btn.text || '')}"
                 maxlength="25" required>
        </div>
        <div class="wtm-button-item__field">
          <label>${t('creation.phoneNumber')}</label>
          <input type="text" class="wtm-input btn-phone-input"
                 value="${utils.escapeHtml(btn.phone_number || '')}"
                 placeholder="85291234567" required>
          <small class="text-muted">${t('creation.phoneHint')}</small>
        </div>
      `;
    
    case 'URL':
      const isDynamic = btn.url_type === 'DYNAMIC';
      return `
        <div class="wtm-button-item__field">
          <label>${t('creation.buttonText')}</label>
          <input type="text" class="wtm-input btn-text-input"
                 value="${utils.escapeHtml(btn.text || '')}"
                 maxlength="25" required>
        </div>
        <div class="wtm-button-item__field">
          <label>${t('creation.urlType')}</label>
          <select class="wtm-select btn-url-type-select">
            <option value="STATIC" ${!isDynamic ? 'selected' : ''}>${t('creation.urlStatic')}</option>
            <option value="DYNAMIC" ${isDynamic ? 'selected' : ''}>${t('creation.urlDynamic')}</option>
          </select>
        </div>
        <div class="wtm-button-item__field">
          <label>${t('creation.websiteUrl')}</label>
          <input type="url" class="wtm-input btn-url-input"
                 value="${utils.escapeHtml(btn.url || '')}"
                 placeholder="${isDynamic ? 'https://example.com/{{1}}' : 'https://example.com'}" required>
        </div>
        <div class="wtm-button-item__field btn-url-suffix-field" style="display: ${isDynamic ? 'block' : 'none'};">
          <label>${t('creation.urlSuffixExample')}</label>
          <input type="text" class="wtm-input btn-url-suffix-input"
                 value="${utils.escapeHtml(btn.url_suffix_example || '')}"
                 placeholder="product-123">
          <small class="text-muted">${t('creation.urlSuffixHint')}</small>
        </div>
      `;
    
    case 'COPY_CODE':
      return `
        <div class="wtm-button-item__field">
          <div class="wtm-fixed-text-notice">
            ℹ️ ${t('creation.copyCodeFixed')}
          </div>
        </div>
        <div class="wtm-button-item__field">
          <label>${t('creation.offerCodeExample')}</label>
          <input type="text" class="wtm-input btn-example-input"
                 value="${utils.escapeHtml(btn.example || '')}"
                 placeholder="SAVE20" required>
          <small class="text-muted">${t('creation.offerCodeHint')}</small>
        </div>
      `;
    
    case 'FLOW':
      return `
        <div class="wtm-button-item__field">
          <label>${t('creation.buttonText')}</label>
          <input type="text" class="wtm-input btn-text-input"
                 value="${utils.escapeHtml(btn.text || '')}"
                 maxlength="25" required>
        </div>
        <div class="wtm-button-item__field">
          <label>${t('creation.flowId')}</label>
          <input type="text" class="wtm-input btn-flow-id-input"
                 value="${utils.escapeHtml(btn.flow_id || '')}"
                 required>
        </div>
      `;
    
    default:
      return '';
  }
}

/**
 * Get button type display name
 */
function getButtonTypeName(type) {
  const names = {
    QUICK_REPLY: t('creation.quickReply'),
    PHONE_NUMBER: t('creation.callPhone'),
    URL: t('creation.visitWebsite'),
    COPY_CODE: t('creation.copyCode'),
    FLOW: t('creation.whatsappFlow')
  };
  return names[type] || type;
}

/**
 * Setup event listeners for language content
 */
function setupLanguageContentListeners() {
  selectedLanguages.forEach(lang => {
    const container = document.querySelector(`.wtm-lang-content[data-lang="${lang}"]`);
    if (!container) return;
    
    // Header type change
    container.querySelectorAll(`input[name="header-type-${lang}"]`).forEach(radio => {
      radio.addEventListener('change', (e) => {
        languageData[lang].header.type = e.target.value;
        updateHeaderTypeUI(container, e.target.value);
        updatePreview();
      });
    });
    
    // Media type change
    container.querySelectorAll(`input[name="media-type-${lang}"]`).forEach(radio => {
      radio.addEventListener('change', (e) => {
        languageData[lang].header.mediaType = e.target.value;
        updateMediaTypeUI(container, e.target.value);
        updatePreview();
      });
    });
    
    // Text inputs
    const headerTextInput = container.querySelector('.header-text-input');
    if (headerTextInput) {
      headerTextInput.addEventListener('input', (e) => {
        languageData[lang].header.text = e.target.value;
        container.querySelector('.header-char-count').textContent = e.target.value.length;
        updatePreview();
      });
    }
    
    const mediaUrlInput = container.querySelector('.media-url-input');
    if (mediaUrlInput) {
      mediaUrlInput.addEventListener('input', (e) => {
        languageData[lang].header.mediaUrl = e.target.value;
        updatePreview();
      });
    }
    
    // Location inputs
    ['name', 'address', 'lat', 'lng'].forEach(field => {
      const input = container.querySelector(`.location-${field}-input`);
      if (input) {
        input.addEventListener('input', (e) => {
          const key = field === 'lat' ? 'latitude' : field === 'lng' ? 'longitude' : field;
          languageData[lang].header.location[key] = e.target.value;
          updatePreview();
        });
      }
    });
    
    // Body textarea
    const bodyTextarea = container.querySelector('.body-textarea');
    if (bodyTextarea) {
      bodyTextarea.addEventListener('input', (e) => {
        languageData[lang].body = e.target.value;
        container.querySelector('.body-char-count').textContent = e.target.value.length;
        updateVariables(lang);
        updatePreview();
      });
    }
    
    // Footer input
    const footerInput = container.querySelector('.footer-input');
    if (footerInput) {
      footerInput.addEventListener('input', (e) => {
        languageData[lang].footer = e.target.value;
        container.querySelector('.footer-char-count').textContent = e.target.value.length;
        updatePreview();
      });
    }
    
    // Setup button field listeners
    setupButtonListeners(lang, container);
  });
}

/**
 * Setup button field listeners
 */
function setupButtonListeners(lang, container) {
  container.querySelectorAll('.wtm-button-item').forEach((item, idx) => {
    const btn = languageData[lang].buttons[idx];
    if (!btn) return;
    
    // Text input
    const textInput = item.querySelector('.btn-text-input');
    if (textInput) {
      textInput.addEventListener('input', (e) => {
        btn.text = e.target.value;
        updatePreview();
      });
    }
    
    // Phone input
    const phoneInput = item.querySelector('.btn-phone-input');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        btn.phone_number = e.target.value;
      });
    }
    
    // URL type select
    const urlTypeSelect = item.querySelector('.btn-url-type-select');
    if (urlTypeSelect) {
      urlTypeSelect.addEventListener('change', (e) => {
        btn.url_type = e.target.value;
        const suffixField = item.querySelector('.btn-url-suffix-field');
        const urlInput = item.querySelector('.btn-url-input');
        if (suffixField) {
          suffixField.style.display = e.target.value === 'DYNAMIC' ? 'block' : 'none';
          urlInput.placeholder = e.target.value === 'DYNAMIC' ? 'https://example.com/{{1}}' : 'https://example.com';
        }
      });
    }
    
    // URL input
    const urlInput = item.querySelector('.btn-url-input');
    if (urlInput) {
      urlInput.addEventListener('input', (e) => {
        btn.url = e.target.value;
      });
    }
    
    // URL suffix input
    const suffixInput = item.querySelector('.btn-url-suffix-input');
    if (suffixInput) {
      suffixInput.addEventListener('input', (e) => {
        btn.url_suffix_example = e.target.value;
      });
    }
    
    // Example input (for COPY_CODE)
    const exampleInput = item.querySelector('.btn-example-input');
    if (exampleInput) {
      exampleInput.addEventListener('input', (e) => {
        btn.example = e.target.value;
      });
    }
    
    // Flow ID input
    const flowInput = item.querySelector('.btn-flow-id-input');
    if (flowInput) {
      flowInput.addEventListener('input', (e) => {
        btn.flow_id = e.target.value;
      });
    }
  });
}

/**
 * Update header type UI
 */
function updateHeaderTypeUI(container, type) {
  // Update active state
  container.querySelectorAll('.wtm-header-type').forEach(el => {
    el.classList.toggle('active', el.dataset.headerType === type);
  });
  
  // Show/hide sections
  container.querySelector('.header-text-section').style.display = type === 'TEXT' ? 'block' : 'none';
  container.querySelector('.header-media-section').style.display = type === 'MEDIA' ? 'block' : 'none';
  container.querySelector('.header-location-section').style.display = type === 'LOCATION' ? 'block' : 'none';
}

/**
 * Update media type UI
 */
function updateMediaTypeUI(container, type) {
  container.querySelectorAll('.wtm-media-type').forEach(el => {
    el.classList.toggle('active', el.dataset.mediaType === type);
  });
  container.querySelector('.media-url-hint').textContent = getMediaUrlHint(type);
}

/**
 * Switch active language tab
 */
function switchLanguage(lang) {
  activeLanguage = lang;
  
  // Update tab states
  document.querySelectorAll('.wtm-tabs__tab').forEach(tab => {
    tab.classList.toggle('active', tab.textContent.trim() === (SUPPORTED_LANGUAGES.find(l => l.code === lang)?.name || lang));
  });
  
  // Update content visibility
  document.querySelectorAll('.wtm-lang-content').forEach(content => {
    content.classList.toggle('active', content.dataset.lang === lang);
  });
  
  updatePreview();
}

/**
 * Insert formatting into body
 */
function insertFormat(lang, type) {
  const container = document.querySelector(`.wtm-lang-content[data-lang="${lang}"]`);
  const textarea = container.querySelector('.body-textarea');
  
  const formats = {
    bold: ['*', '*'],
    italic: ['_', '_'],
    strike: ['~', '~'],
    code: ['```', '```']
  };
  
  const [start, end] = formats[type];
  const selStart = textarea.selectionStart;
  const selEnd = textarea.selectionEnd;
  const text = textarea.value;
  const selectedText = text.substring(selStart, selEnd);
  
  const newText = text.substring(0, selStart) + start + selectedText + end + text.substring(selEnd);
  textarea.value = newText;
  languageData[lang].body = newText;
  
  // Update cursor position
  textarea.focus();
  if (selectedText) {
    textarea.setSelectionRange(selStart + start.length, selEnd + start.length);
  } else {
    textarea.setSelectionRange(selStart + start.length, selStart + start.length);
  }
  
  container.querySelector('.body-char-count').textContent = newText.length;
  updatePreview();
}

/**
 * Insert variable into body
 */
function insertVariable(lang) {
  const container = document.querySelector(`.wtm-lang-content[data-lang="${lang}"]`);
  const textarea = container.querySelector('.body-textarea');
  
  // Find next variable number
  const existingVars = (textarea.value.match(/\{\{(\d+)\}\}/g) || []);
  const maxNum = existingVars.length > 0 
    ? Math.max(...existingVars.map(v => parseInt(v.match(/\d+/)[0])))
    : 0;
  const newVarNum = maxNum + 1;
  
  const varText = `{{${newVarNum}}}`;
  const selStart = textarea.selectionStart;
  const text = textarea.value;
  
  const newText = text.substring(0, selStart) + varText + text.substring(selStart);
  textarea.value = newText;
  languageData[lang].body = newText;
  
  textarea.focus();
  textarea.setSelectionRange(selStart + varText.length, selStart + varText.length);
  
  container.querySelector('.body-char-count').textContent = newText.length;
  updateVariables(lang);
  updatePreview();
}

/**
 * Update variable list display
 */
function updateVariables(lang) {
  const container = document.querySelector(`.wtm-lang-content[data-lang="${lang}"]`);
  const variablesContainer = container.querySelector('.body-variables');
  const body = languageData[lang].body;
  
  // Extract variables
  const vars = [...body.matchAll(/\{\{(\d+)\}\}/g)].map(m => m[1]);
  const uniqueVars = [...new Set(vars)].sort((a, b) => parseInt(a) - parseInt(b));
  
  if (uniqueVars.length === 0) {
    variablesContainer.innerHTML = '';
    return;
  }
  
  variablesContainer.innerHTML = uniqueVars.map(varNum => `
    <div class="wtm-variable-tag">
      <span>{{${varNum}}}</span>
      <input type="text" placeholder="Example value" 
             value="${utils.escapeHtml(languageData[lang].variables[varNum] || '')}"
             onchange="updateVariableExample('${lang}', '${varNum}', this.value)">
    </div>
  `).join('');
}

/**
 * Update variable example value
 */
function updateVariableExample(lang, varNum, value) {
  languageData[lang].variables[varNum] = value;
}

/**
 * Toggle button menu
 */
function toggleButtonMenu(lang) {
  const menu = document.getElementById(`button-menu-${lang}`);
  menu.classList.toggle('show');
  
  // Update disabled state based on button limits
  const buttons = languageData[lang].buttons;
  menu.querySelectorAll('.wtm-button-menu__item').forEach(item => {
    const type = item.querySelector('span:last-child').textContent;
    // Map display name back to type
    const typeKey = Object.keys(BUTTON_TYPES).find(k => getButtonTypeName(k) === type);
    if (typeKey) {
      const count = buttons.filter(b => b.type === typeKey).length;
      const max = BUTTON_TYPES[typeKey].maxCount;
      item.classList.toggle('disabled', count >= max);
    }
  });
  
  // Close menu when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function closeMenu(e) {
      if (!menu.contains(e.target)) {
        menu.classList.remove('show');
        document.removeEventListener('click', closeMenu);
      }
    });
  }, 0);
}

/**
 * Add a new button
 */
function addButton(lang, type) {
  const menu = document.getElementById(`button-menu-${lang}`);
  menu.classList.remove('show');
  
  // Check limit
  const buttons = languageData[lang].buttons;
  const count = buttons.filter(b => b.type === type).length;
  if (count >= BUTTON_TYPES[type].maxCount) {
    utils.showToast(`Maximum ${BUTTON_TYPES[type].maxCount} ${getButtonTypeName(type)} button(s) allowed`, 'warning');
    return;
  }
  
  // Check total button limit
  if (buttons.length >= 10) {
    utils.showToast('Maximum 10 buttons allowed', 'warning');
    return;
  }
  
  // Add button
  const newButton = { type };
  if (type === 'URL') {
    newButton.url_type = 'STATIC';
  }
  buttons.push(newButton);
  
  // Re-render
  renderLanguageTabs();
  updatePreview();
}

/**
 * Remove a button
 */
function removeButton(lang, idx) {
  languageData[lang].buttons.splice(idx, 1);
  renderLanguageTabs();
  updatePreview();
}

/**
 * Update preview
 */
function updatePreview() {
  const data = languageData[activeLanguage];
  if (!data) return;
  
  const chat = document.getElementById('preview-chat');
  let html = '<div class="wtm-phone-preview__message">';
  
  // Header
  if (data.header.type === 'TEXT' && data.header.text) {
    html += `<div class="wtm-phone-preview__header-text">${utils.whatsappToHtml(data.header.text)}</div>`;
  } else if (data.header.type === 'MEDIA') {
    html += `
      <div class="wtm-phone-preview__media-placeholder">
        <span style="font-size: 2rem;">${data.header.mediaType === 'IMAGE' ? '🖼️' : data.header.mediaType === 'VIDEO' ? '🎬' : '📄'}</span>
        <span>${t('mediaType.' + data.header.mediaType.toLowerCase())}</span>
      </div>
    `;
  } else if (data.header.type === 'LOCATION') {
    html += `
      <div class="wtm-phone-preview__location">
        <div class="wtm-phone-preview__location-map">
          <svg viewBox="0 0 24 24" fill="var(--color-primary)"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        </div>
        <div class="wtm-phone-preview__location-info">
          <div class="wtm-phone-preview__location-name">${utils.escapeHtml(data.header.location.name || 'Location')}</div>
          <div class="wtm-phone-preview__location-address">${utils.escapeHtml(data.header.location.address || '')}</div>
        </div>
      </div>
    `;
  }
  
  // Body
  if (data.body) {
    html += `<div class="wtm-phone-preview__body">${utils.whatsappToHtml(data.body)}</div>`;
  } else {
    html += `<div class="wtm-phone-preview__body" style="color: var(--color-text-muted);">Your message preview...</div>`;
  }
  
  // Footer
  if (data.footer) {
    html += `<div class="wtm-phone-preview__footer">${utils.escapeHtml(data.footer)}</div>`;
  }
  
  // Buttons
  if (data.buttons.length > 0) {
    html += '<div class="wtm-phone-preview__buttons">';
    const displayButtons = data.buttons.slice(0, 3);
    displayButtons.forEach(btn => {
      const icon = getButtonIcon(btn.type);
      const text = btn.type === 'COPY_CODE' ? 'Copy offer code' : (btn.text || getButtonTypeName(btn.type));
      html += `
        <div class="wtm-phone-preview__button">
          ${icon}
          <span>${utils.escapeHtml(text)}</span>
        </div>
      `;
    });
    if (data.buttons.length > 3) {
      html += `<div class="wtm-phone-preview__button wtm-phone-preview__see-all">See all options</div>`;
    }
    html += '</div>';
  }
  
  html += '</div>';
  chat.innerHTML = html;
}

/**
 * Get button icon SVG
 */
function getButtonIcon(type) {
  const icons = {
    QUICK_REPLY: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg>',
    PHONE_NUMBER: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>',
    URL: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>',
    COPY_CODE: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>',
    FLOW: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z"/></svg>'
  };
  return icons[type] || '';
}

/**
 * Reset form
 */
function resetForm() {
  document.getElementById('template-name').value = '';
  document.getElementById('template-category').value = '';
  
  // Reset language data
  selectedLanguages.forEach(lang => {
    languageData[lang] = createEmptyLanguageData();
  });
  
  renderLanguageTabs();
  updatePreview();
}

/**
 * Load stored template (for duplicate/recreate)
 */
function loadStoredTemplate() {
  const { action, template } = storedTemplateData;
  const alertEl = document.getElementById('action-alert');
  
  // Show alert
  if (action === 'duplicate') {
    alertEl.className = 'wtm-alert wtm-alert--info';
    alertEl.innerHTML = `ℹ️ ${t('creation.duplicateLoaded')}`;
  } else if (action === 'recreate') {
    alertEl.className = 'wtm-alert wtm-alert--warning';
    alertEl.innerHTML = `⚠️ ${t('creation.recreateLoaded')}`;
  }
  alertEl.style.display = 'flex';
  
  // Set basic info
  if (action === 'duplicate') {
    document.getElementById('template-name').value = template.name + '_copy';
  } else {
    document.getElementById('template-name').value = template.name;
  }
  document.getElementById('template-category').value = template.category;
  
  // Set language
  const lang = template.language;
  if (!selectedLanguages.includes(lang)) {
    selectedLanguages.push(lang);
    const checkbox = document.querySelector(`input[value="${lang}"]`);
    if (checkbox) checkbox.checked = true;
  }
  activeLanguage = lang;
  
  // Parse components
  const components = utils.parseComponents(template.components);
  
  // Initialize language data
  languageData[lang] = createEmptyLanguageData();
  
  // Set header
  if (components.header) {
    const header = components.header;
    if (header.format === 'TEXT') {
      languageData[lang].header.type = 'TEXT';
      languageData[lang].header.text = header.text || '';
    } else if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(header.format)) {
      languageData[lang].header.type = 'MEDIA';
      languageData[lang].header.mediaType = header.format;
      languageData[lang].header.mediaUrl = header.example?.header_handle?.[0] || '';
    } else if (header.format === 'LOCATION') {
      languageData[lang].header.type = 'LOCATION';
      const loc = header.example?.header_location?.[0] || {};
      languageData[lang].header.location = {
        name: loc.name || '',
        address: loc.address || '',
        latitude: loc.latitude || '',
        longitude: loc.longitude || ''
      };
    }
  }
  
  // Set body
  if (components.body) {
    languageData[lang].body = components.body.text || '';
    // Extract variable examples
    const examples = components.body.example?.body_text?.[0] || [];
    examples.forEach((ex, idx) => {
      languageData[lang].variables[idx + 1] = ex;
    });
  }
  
  // Set footer
  if (components.footer) {
    languageData[lang].footer = components.footer.text || '';
  }
  
  // Set buttons
  if (components.buttons.length > 0) {
    languageData[lang].buttons = components.buttons.map(btn => {
      const buttonData = { type: btn.type };
      if (btn.text) buttonData.text = btn.text;
      if (btn.phone_number) buttonData.phone_number = btn.phone_number;
      if (btn.url) {
        buttonData.url = btn.url;
        buttonData.url_type = btn.url.includes('{{') ? 'DYNAMIC' : 'STATIC';
        if (btn.example?.[0]) buttonData.url_suffix_example = btn.example[0];
      }
      if (btn.example && btn.type === 'COPY_CODE') buttonData.example = btn.example[0];
      if (btn.flow_id) buttonData.flow_id = btn.flow_id;
      return buttonData;
    });
  }
  
  renderLanguageTabs();
  updatePreview();
}

/**
 * Validate form
 */
function validateForm() {
  const errors = [];
  
  // Template name
  const name = document.getElementById('template-name').value.trim();
  if (!name) {
    errors.push(t('validation.templateNameRequired'));
  } else if (!/^[a-z0-9_]+$/.test(name)) {
    errors.push(t('validation.templateNameInvalid'));
  }
  
  // Category
  if (!document.getElementById('template-category').value) {
    errors.push(t('validation.categoryRequired'));
  }
  
  // Languages
  if (selectedLanguages.length === 0) {
    errors.push(t('validation.languageRequired'));
  }
  
  // Validate each language
  let hasBody = false;
  selectedLanguages.forEach(lang => {
    const data = languageData[lang];
    
    if (data.body) {
      hasBody = true;
      
      // Check body doesn't start or end with variable
      if (/^\{\{/.test(data.body.trim())) {
        errors.push(t('validation.bodyStartsWithVar'));
      }
      if (/\}\}$/.test(data.body.trim())) {
        errors.push(t('validation.bodyEndsWithVar'));
      }
      
      // Check variable density
      const varCount = (data.body.match(/\{\{\d+\}\}/g) || []).length;
      const wordCount = data.body.split(/\s+/).filter(w => w.length > 0).length;
      if (varCount > 0 && wordCount < varCount * 3) {
        errors.push(t('validation.bodyNeedsMoreContent', { varCount, wordCount, needed: varCount * 3 }));
      }
    }
    
    // Header validation
    if (data.header.type === 'TEXT') {
      const headerVars = (data.header.text.match(/\{\{/g) || []).length;
      if (headerVars > 1) {
        errors.push(t('validation.headerMaxOneVar'));
      }
    }
    
    if (data.header.type === 'MEDIA' && !data.header.mediaUrl) {
      errors.push(t('validation.mediaUrlRequired'));
    }
    
    if (data.header.type === 'LOCATION') {
      const loc = data.header.location;
      if (!loc.name || !loc.address || !loc.latitude || !loc.longitude) {
        errors.push(t('validation.locationFieldsRequired'));
      }
    }
    
    // Footer validation - no variables
    if (data.footer && /\{\{/.test(data.footer)) {
      errors.push(t('validation.footerNoVars'));
    }
  });
  
  if (!hasBody) {
    errors.push(t('validation.bodyRequired'));
  }
  
  return errors;
}

/**
 * Build API payload
 */
function buildPayload() {
  const name = document.getElementById('template-name').value.trim();
  const category = document.getElementById('template-category').value;
  
  const templates = selectedLanguages.map(lang => {
    const data = languageData[lang];
    const components = [];
    
    // Header
    if (data.header.type === 'TEXT' && data.header.text) {
      const headerComp = { type: 'HEADER', format: 'TEXT', text: data.header.text };
      // Add example if has variables
      if (/\{\{/.test(data.header.text)) {
        headerComp.example = { header_text: [data.variables['1'] || 'example'] };
      }
      components.push(headerComp);
    } else if (data.header.type === 'MEDIA') {
      components.push({
        type: 'HEADER',
        format: data.header.mediaType,
        example: { header_handle: [data.header.mediaUrl] }
      });
    } else if (data.header.type === 'LOCATION') {
      components.push({
        type: 'HEADER',
        format: 'LOCATION',
        example: {
          header_location: [{
            name: data.header.location.name,
            address: data.header.location.address,
            latitude: parseFloat(data.header.location.latitude),
            longitude: parseFloat(data.header.location.longitude)
          }]
        }
      });
    }
    
    // Body
    if (data.body) {
      const bodyComp = { type: 'BODY', text: data.body };
      // Add examples for variables
      const vars = [...data.body.matchAll(/\{\{(\d+)\}\}/g)].map(m => m[1]);
      const uniqueVars = [...new Set(vars)].sort((a, b) => parseInt(a) - parseInt(b));
      if (uniqueVars.length > 0) {
        bodyComp.example = {
          body_text: [uniqueVars.map(v => data.variables[v] || `value${v}`)]
        };
      }
      components.push(bodyComp);
    }
    
    // Footer
    if (data.footer) {
      components.push({ type: 'FOOTER', text: data.footer });
    }
    
    // Buttons
    if (data.buttons.length > 0) {
      const buttons = data.buttons.map(btn => {
        const buttonObj = { type: btn.type };
        
        if (btn.type !== 'COPY_CODE' && btn.text) {
          buttonObj.text = btn.text;
        }
        
        if (btn.type === 'PHONE_NUMBER') {
          buttonObj.phone_number = btn.phone_number.replace(/[^0-9]/g, '');
        }
        
        if (btn.type === 'URL') {
          buttonObj.url = btn.url;
          if (btn.url_type === 'DYNAMIC' && btn.url_suffix_example) {
            buttonObj.example = [btn.url_suffix_example];
          }
        }
        
        if (btn.type === 'COPY_CODE' && btn.example) {
          buttonObj.example = [btn.example];
        }
        
        if (btn.type === 'FLOW' && btn.flow_id) {
          buttonObj.flow_id = btn.flow_id;
          buttonObj.flow_action = 'navigate';
        }
        
        return buttonObj;
      });
      
      // Sort: QUICK_REPLY first
      buttons.sort((a, b) => {
        const aIsQR = a.type === 'QUICK_REPLY' ? 0 : 1;
        const bIsQR = b.type === 'QUICK_REPLY' ? 0 : 1;
        return aIsQR - bIsQR;
      });
      
      components.push({ type: 'BUTTONS', buttons });
    }
    
    return {
      name,
      language: lang,
      category,
      components
    };
  });
  
  return templates;
}

/**
 * Handle form submission
 */
async function handleSubmit(e) {
  e.preventDefault();
  
  // Check credentials
  if (!api.hasCredentials()) {
    utils.showToast(t('auth.credentialsRequired'), 'error');
    document.getElementById('credentials-panel').classList.remove('collapsed');
    return;
  }
  
  // Validate
  const errors = validateForm();
  if (errors.length > 0) {
    utils.showToast(t('validation.fixErrors') + '\n' + errors.join('\n'), 'error', 5000);
    return;
  }
  
  // Build payloads
  const templates = buildPayload();
  
  // Submit
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span>${t('creation.submitting')}</span>`;
  
  try {
    // Submit each language version
    for (const template of templates) {
      await api.createTemplate(template);
    }
    
    utils.showToast(t('app.success') + '!', 'success');
    
    // Redirect to list after delay
    setTimeout(() => {
      utils.navigateTo('../list/index.html');
    }, 1500);
  } catch (error) {
    utils.showToast(error.message, 'error', 5000);
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span>${t('creation.submit')}</span>`;
  }
}
