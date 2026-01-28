/**
 * Template List Page Module
 */

// State
let templates = [];
let filteredTemplates = [];
let currentPage = 1;
const pageSize = 12;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await i18n.init();
  setupEventListeners();
  
  // Auto-load templates on page load
  loadTemplates();
});

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Search with debounce
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', utils.debounce(() => {
    filterTemplates();
  }, 300));
  
  // Filter changes
  document.getElementById('status-filter').addEventListener('change', filterTemplates);
  document.getElementById('category-filter').addEventListener('change', filterTemplates);
  
  // Locale change - retranslate status badges
  window.addEventListener('localeChanged', () => {
    renderTemplates();
  });
}

/**
 * Load templates from API
 */
async function loadTemplates() {
  const container = document.getElementById('templates-container');
  
  // Show loading
  container.innerHTML = `
    <div class="wtm-loading">
      <div class="wtm-spinner"></div>
      <span data-i18n="app.loading">${t('app.loading')}</span>
    </div>
  `;
  
  try {
    const response = await api.listTemplates({ limit: 100 });
    templates = response.items || [];
    filterTemplates();
  } catch (error) {
    container.innerHTML = `
      <div class="wtm-empty">
        <div class="wtm-empty__icon">❌</div>
        <h3 class="wtm-empty__title">${t('app.error')}</h3>
        <p class="wtm-empty__text">${utils.escapeHtml(error.message)}</p>
        <button class="wtm-btn wtm-btn--primary" onclick="loadTemplates()">${t('list.loadTemplates')}</button>
      </div>
    `;
  }
}

/**
 * Filter templates based on search and filters
 */
function filterTemplates() {
  const search = document.getElementById('search-input').value.toLowerCase();
  const status = document.getElementById('status-filter').value;
  const category = document.getElementById('category-filter').value;
  
  filteredTemplates = templates.filter(template => {
    // Search filter
    if (search && !template.name.toLowerCase().includes(search)) {
      return false;
    }
    
    // Status filter
    if (status && template.status !== status) {
      return false;
    }
    
    // Category filter
    if (category && template.category !== category) {
      return false;
    }
    
    return true;
  });
  
  currentPage = 1;
  renderTemplates();
}

/**
 * Render templates grid
 */
function renderTemplates() {
  const container = document.getElementById('templates-container');
  const pagination = document.getElementById('pagination');
  
  if (filteredTemplates.length === 0) {
    container.innerHTML = `
      <div class="wtm-empty">
        <div class="wtm-empty__icon">📭</div>
        <h3 class="wtm-empty__title">${t('list.noTemplates')}</h3>
        <p class="wtm-empty__text">${t('app.noResults')}</p>
      </div>
    `;
    pagination.style.display = 'none';
    return;
  }
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredTemplates.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageTemplates = filteredTemplates.slice(startIndex, endIndex);
  
  // Render grid
  container.innerHTML = `
    <div class="wtm-grid wtm-grid--3">
      ${pageTemplates.map(template => renderTemplateCard(template)).join('')}
    </div>
  `;
  
  // Update pagination
  if (totalPages > 1) {
    pagination.style.display = 'flex';
    document.getElementById('prev-btn').disabled = currentPage === 1;
    document.getElementById('next-btn').disabled = currentPage === totalPages;
    document.getElementById('page-info').textContent = t('list.pageInfo', { 
      current: currentPage, 
      total: totalPages 
    });
  } else {
    pagination.style.display = 'none';
  }
}

/**
 * Render single template card
 */
function renderTemplateCard(template) {
  const components = utils.parseComponents(template.components);
  const bodyPreview = components.body?.text || '';
  
  return `
    <div class="wtm-template-card" onclick="viewTemplate('${template.name}', '${template.language}')">
      <div class="wtm-template-card__header">
        <div class="wtm-template-card__name">${utils.escapeHtml(template.name)}</div>
        ${utils.formatStatus(template.status)}
      </div>
      <div class="wtm-template-card__meta">
        <span class="wtm-template-card__meta-item">
          🏷️ ${utils.formatCategory(template.category)}
        </span>
        <span class="wtm-template-card__meta-item">
          🌐 ${utils.getLanguageName(template.language)}
        </span>
      </div>
      ${bodyPreview ? `
        <div class="wtm-template-card__preview">
          ${utils.whatsappToHtml(bodyPreview.substring(0, 150))}${bodyPreview.length > 150 ? '...' : ''}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Navigate to template view
 */
function viewTemplate(name, language) {
  utils.navigateTo('../view/index.php', { name, language });
}

/**
 * Pagination controls
 */
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderTemplates();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function nextPage() {
  const totalPages = Math.ceil(filteredTemplates.length / pageSize);
  if (currentPage < totalPages) {
    currentPage++;
    renderTemplates();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
