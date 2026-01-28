<?php
/**
 * Template Creation Page
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Create Template</title>
  <link rel="stylesheet" href="../assets/css/style.css">
  <link rel="stylesheet" href="creation.css">
</head>
<body class="wtm-app" data-i18n-title="creation.title">
  
  <!-- Header -->
  <header class="wtm-header">
    <div class="wtm-header__logo">
      <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      <span data-i18n="app.title">WhatsApp Template Manager</span>
    </div>
    
    <nav class="wtm-header__nav">
      <a href="../list/index.php" data-i18n="nav.list">Templates</a>
      <a href="index.php" class="active" data-i18n="nav.create">Create</a>
    </nav>
    
    <div class="wtm-header__actions">
      <div id="language-selector"></div>
    </div>
  </header>

  <main class="wtm-container">
    <!-- Alert for duplicate/recreate -->
    <div id="action-alert" class="wtm-alert" style="display: none;"></div>

    <!-- Page Header -->
    <div class="wtm-page-header">
      <h1 class="wtm-page-header__title" data-i18n="creation.title">Create Template</h1>
    </div>

    <div class="wtm-layout-split">
      <!-- Form -->
      <div class="wtm-layout-split__main">
        <form id="template-form">
          <!-- Basic Info -->
          <div class="wtm-card mb-3">
            <div class="wtm-card__header">
              <h2 class="wtm-card__title" data-i18n="creation.basicInfo">Basic Information</h2>
            </div>
            <div class="wtm-card__body">
              <div class="wtm-form-group">
                <label class="wtm-form-group__label" data-i18n="creation.templateName">Template Name</label>
                <input type="text" id="template-name" class="wtm-input" pattern="[a-z0-9_]+" required
                       data-i18n-placeholder="creation.templateNamePlaceholder">
                <p class="wtm-form-group__hint" data-i18n="creation.templateNameHint">Only lowercase letters, numbers, and underscores</p>
              </div>
              
              <div class="wtm-form-group">
                <label class="wtm-form-group__label" data-i18n="view.category">Category</label>
                <select id="template-category" class="wtm-select" required>
                  <option value="" data-i18n="creation.selectCategory">Select category</option>
                  <option value="MARKETING" data-i18n="category.marketing">Marketing</option>
                  <option value="UTILITY" data-i18n="category.utility">Utility</option>
                  <option value="AUTHENTICATION" data-i18n="category.authentication">Authentication</option>
                </select>
              </div>
              
              <div class="wtm-form-group">
                <label class="wtm-form-group__label" data-i18n="creation.languages">Languages</label>
                <div class="wtm-checkbox-group" id="language-checkboxes">
                  <label class="wtm-checkbox">
                    <input type="checkbox" name="languages" value="en" checked> English
                  </label>
                  <label class="wtm-checkbox">
                    <input type="checkbox" name="languages" value="zh_CN"> 简体中文
                  </label>
                  <label class="wtm-checkbox">
                    <input type="checkbox" name="languages" value="zh_HK"> 繁體中文（香港）
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Content Tabs -->
          <div class="wtm-card mb-3">
            <div class="wtm-card__header">
              <h2 class="wtm-card__title" data-i18n="creation.content">Template Content</h2>
            </div>
            <div class="wtm-card__body">
              <!-- Language Tabs -->
              <div class="wtm-tabs" id="lang-tabs">
                <!-- Tabs will be rendered dynamically -->
              </div>
              
              <!-- Tab Content -->
              <div id="lang-contents">
                <!-- Content will be rendered dynamically -->
              </div>
            </div>
          </div>

          <!-- Submit -->
          <div class="wtm-form-actions">
            <button type="button" class="wtm-btn wtm-btn--secondary" onclick="resetForm()" data-i18n="creation.reset">Reset</button>
            <button type="submit" class="wtm-btn wtm-btn--primary wtm-btn--lg" id="submit-btn">
              <span data-i18n="creation.submit">Submit Template</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Preview Sidebar -->
      <div class="wtm-layout-split__sidebar">
        <div class="wtm-card sticky-preview">
          <div class="wtm-card__header">
            <h3 class="wtm-card__title" data-i18n="creation.preview">Preview</h3>
          </div>
          <div class="wtm-card__body">
            <div class="wtm-phone-preview">
              <div class="wtm-phone-preview__header">
                <div class="wtm-phone-preview__avatar">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                </div>
                <span class="wtm-phone-preview__title">Business Name</span>
              </div>
              <div class="wtm-phone-preview__chat" id="preview-chat">
                <div class="wtm-phone-preview__message">
                  <div class="wtm-phone-preview__body" id="preview-body">
                    Your message preview will appear here...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <script src="../assets/js/i18n.js"></script>
  <script src="../assets/js/api.js"></script>
  <script src="../assets/js/utils.js"></script>
  <script src="creation.js"></script>
</body>
</html>
