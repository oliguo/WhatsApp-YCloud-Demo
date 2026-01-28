/**
 * Template View Page Module
 */

// State
let template = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await i18n.init();
  
  // Get template params
  const params = utils.getUrlParams();
  if (!params.name || !params.language) {
    showError('Template name and language are required');
    return;
  }
  
  loadTemplate(params.name, params.language);
});

/**
 * Load template from API
 */
async function loadTemplate(name, language) {
  try {
    template = await api.getTemplate(name, language);
    renderTemplate();
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Show error state
 */
function showError(message) {
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('error-state').style.display = 'block';
  document.getElementById('error-message').textContent = message;
}

/**
 * Render template content
 */
function renderTemplate() {
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('template-content').style.display = 'grid';
  
  // Basic info
  document.getElementById('template-name').textContent = template.name;
  document.getElementById('template-status').innerHTML = utils.formatStatus(template.status);
  document.getElementById('template-language').textContent = utils.getLanguageName(template.language);
  document.getElementById('template-category').textContent = utils.formatCategory(template.category);
  
  // Quality rating
  if (template.qualityScore) {
    const qualityClass = template.qualityScore.score === 'HIGH' ? 'quality-high' 
      : template.qualityScore.score === 'MEDIUM' ? 'quality-medium' : 'quality-low';
    document.getElementById('template-quality').innerHTML = 
      `<span class="${qualityClass}">${template.qualityScore.score}</span>`;
  } else {
    document.getElementById('quality-rating-container').style.display = 'none';
  }
  
  // Rejection reason
  if (template.status === 'REJECTED' && template.reason) {
    document.getElementById('rejection-reason').style.display = 'block';
    document.getElementById('rejection-text').textContent = template.reason;
  }
  
  // Components
  renderComponents();
  
  // Preview
  renderPreview();
  
  // JSON
  document.getElementById('template-json').textContent = JSON.stringify(template, null, 2);
}

/**
 * Render template components
 */
function renderComponents() {
  const container = document.getElementById('components-container');
  const components = utils.parseComponents(template.components);
  let html = '';
  
  // Header
  if (components.header) {
    html += renderHeaderComponent(components.header);
  }
  
  // Body
  if (components.body) {
    html += `
      <div class="wtm-component">
        <div class="wtm-component__type">${t('component.body')}</div>
        <div class="wtm-component__content">${utils.whatsappToHtml(components.body.text)}</div>
      </div>
    `;
  }
  
  // Footer
  if (components.footer) {
    html += `
      <div class="wtm-component">
        <div class="wtm-component__type">${t('component.footer')}</div>
        <div class="wtm-component__content">${utils.escapeHtml(components.footer.text)}</div>
      </div>
    `;
  }
  
  // Buttons
  if (components.buttons.length > 0) {
    html += `
      <div class="wtm-component">
        <div class="wtm-component__type">${t('component.buttons')}</div>
        <div class="wtm-component__buttons">
          ${components.buttons.map(btn => renderButton(btn)).join('')}
        </div>
      </div>
    `;
  }
  
  container.innerHTML = html || '<p class="text-muted">No components</p>';
}

/**
 * Render header component
 */
function renderHeaderComponent(header) {
  let content = '';
  
  switch (header.format) {
    case 'TEXT':
      content = `<div class="wtm-component__content">${utils.whatsappToHtml(header.text)}</div>`;
      break;
    case 'IMAGE':
      content = `<div class="wtm-component__media"><span class="wtm-component__media-icon">🖼️</span> ${t('mediaType.image')}</div>`;
      break;
    case 'VIDEO':
      content = `<div class="wtm-component__media"><span class="wtm-component__media-icon">🎬</span> ${t('mediaType.video')}</div>`;
      break;
    case 'DOCUMENT':
      content = `<div class="wtm-component__media"><span class="wtm-component__media-icon">📄</span> ${t('mediaType.document')}</div>`;
      break;
    case 'LOCATION':
      content = `
        <div class="wtm-component__location">
          <span class="wtm-component__location-icon">📍</span>
          <div class="wtm-component__location-details">
            <div class="wtm-component__location-name">${utils.escapeHtml(header.example?.header_location?.[0]?.name || 'Location')}</div>
            <div class="wtm-component__location-address">${utils.escapeHtml(header.example?.header_location?.[0]?.address || '')}</div>
          </div>
        </div>
      `;
      break;
  }
  
  return `
    <div class="wtm-component">
      <div class="wtm-component__type">${t('component.header')} (${header.format})</div>
      ${content}
    </div>
  `;
}

/**
 * Render button
 */
function renderButton(btn) {
  const typeLabels = {
    'QUICK_REPLY': t('creation.quickReply'),
    'PHONE_NUMBER': t('creation.callPhone'),
    'URL': t('creation.visitWebsite'),
    'COPY_CODE': t('creation.copyCode'),
    'FLOW': t('creation.whatsappFlow')
  };
  
  let value = '';
  if (btn.type === 'PHONE_NUMBER') {
    value = btn.phone_number;
  } else if (btn.type === 'URL') {
    value = btn.url;
  } else if (btn.type === 'COPY_CODE') {
    value = btn.example?.[0] || '';
  } else if (btn.type === 'FLOW') {
    value = `Flow ID: ${btn.flow_id}`;
  }
  
  return `
    <div class="wtm-component__button">
      <span class="wtm-component__button-type">${typeLabels[btn.type] || btn.type}</span>
      <span class="wtm-component__button-text">${utils.escapeHtml(btn.text || 'Copy offer code')}</span>
      ${value ? `<span class="wtm-component__button-value">${utils.escapeHtml(value)}</span>` : ''}
    </div>
  `;
}

/**
 * Render phone preview
 */
function renderPreview() {
  const container = document.getElementById('preview-chat');
  const components = utils.parseComponents(template.components);
  let html = '<div class="wtm-phone-preview__message">';
  
  // Header
  if (components.header) {
    html += renderPreviewHeader(components.header);
  }
  
  // Body
  if (components.body) {
    html += `<div class="wtm-phone-preview__body">${utils.whatsappToHtml(components.body.text)}</div>`;
  }
  
  // Footer
  if (components.footer) {
    html += `<div class="wtm-phone-preview__footer">${utils.escapeHtml(components.footer.text)}</div>`;
  }
  
  // Buttons
  if (components.buttons.length > 0) {
    html += '<div class="wtm-phone-preview__buttons">';
    const displayButtons = components.buttons.slice(0, 3);
    displayButtons.forEach(btn => {
      html += `
        <div class="wtm-phone-preview__button">
          ${getButtonIcon(btn.type)}
          <span>${utils.escapeHtml(btn.text || 'Copy offer code')}</span>
        </div>
      `;
    });
    if (components.buttons.length > 3) {
      html += `<div class="wtm-phone-preview__button wtm-phone-preview__see-all">See all options</div>`;
    }
    html += '</div>';
  }
  
  html += '</div>';
  container.innerHTML = html;
}

/**
 * Render preview header
 */
function renderPreviewHeader(header) {
  switch (header.format) {
    case 'TEXT':
      return `<div class="wtm-phone-preview__header-text">${utils.whatsappToHtml(header.text)}</div>`;
    case 'IMAGE':
      return `
        <div class="wtm-phone-preview__media-placeholder">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
          <span>${t('mediaType.image')}</span>
        </div>
      `;
    case 'VIDEO':
      return `
        <div class="wtm-phone-preview__media-placeholder">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
          <span>${t('mediaType.video')}</span>
        </div>
      `;
    case 'DOCUMENT':
      return `
        <div class="wtm-phone-preview__media-placeholder">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          <span>${t('mediaType.document')}</span>
        </div>
      `;
    case 'LOCATION':
      return `
        <div class="wtm-phone-preview__location">
          <div class="wtm-phone-preview__location-map">
            <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          </div>
          <div class="wtm-phone-preview__location-info">
            <div class="wtm-phone-preview__location-name">${utils.escapeHtml(header.example?.header_location?.[0]?.name || 'Location')}</div>
            <div class="wtm-phone-preview__location-address">${utils.escapeHtml(header.example?.header_location?.[0]?.address || '')}</div>
          </div>
        </div>
      `;
    default:
      return '';
  }
}

/**
 * Get button icon
 */
function getButtonIcon(type) {
  const icons = {
    'QUICK_REPLY': '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg>',
    'PHONE_NUMBER': '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>',
    'URL': '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>',
    'COPY_CODE': '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>',
    'FLOW': '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z"/></svg>'
  };
  return icons[type] || '';
}

/**
 * Toggle JSON display
 */
function toggleJson() {
  const container = document.getElementById('json-container');
  const toggleText = document.getElementById('json-toggle-text');
  
  if (container.style.display === 'none') {
    container.style.display = 'block';
    toggleText.textContent = t('view.hideJson');
  } else {
    container.style.display = 'none';
    toggleText.textContent = t('view.showJson');
  }
}

/**
 * Duplicate template
 */
function duplicateTemplate() {
  utils.storeTemplateData({
    action: 'duplicate',
    template: template
  });
  utils.navigateTo('../creation/index.html');
}

/**
 * Delete and recreate template
 */
async function recreateTemplate() {
  const confirmed = await utils.confirm(
    t('view.recreateConfirm', { name: template.name })
  );
  
  if (!confirmed) return;
  
  try {
    await api.deleteTemplate(template.name, template.language);
    utils.storeTemplateData({
      action: 'recreate',
      template: template
    });
    utils.navigateTo('../creation/index.html');
  } catch (error) {
    utils.showToast(error.message, 'error');
  }
}

/**
 * Delete template
 */
async function deleteTemplate() {
  const confirmed = await utils.confirm(
    t('view.deleteConfirm', { name: template.name })
  );
  
  if (!confirmed) return;
  
  try {
    await api.deleteTemplate(template.name, template.language);
    utils.showToast(t('view.deleteSuccess'), 'success');
    setTimeout(() => {
      utils.navigateTo('../list/index.html');
    }, 1000);
  } catch (error) {
    utils.showToast(error.message, 'error');
  }
}
