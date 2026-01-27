// ============================================
// PART 1 of 4: Initialization and Character Counters
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeCounters();
    initializeLanguageTabs();
    initializeLanguageSelectors();
    initializeHeaderSelects();
    initializeToolbar();
    initializeButtons();
    initializePreview();
    initializeFormSubmission();
    initializeVariableTracking();
});

// Character Counter Functionality
function initializeCounters() {
    // Template name counter
    const templateNameInput = document.getElementById('templateName');
    const nameCountSpan = document.getElementById('nameCount');
    
    if (templateNameInput && nameCountSpan) {
        templateNameInput.addEventListener('input', function() {
            nameCountSpan.textContent = this.value.length;
        });
    }
    
    // Body editors counter
    const bodyEditors = document.querySelectorAll('.body-editor');
    bodyEditors.forEach(editor => {
        const wrapper = editor.closest('.editor-wrapper');
        const counter = wrapper.querySelector('.body-count');
        
        if (counter) {
            editor.addEventListener('input', function() {
                counter.textContent = this.value.length;
                updatePreview();
            });
        }
    });
    
    // Footer inputs counter
    const footerInputs = document.querySelectorAll('input[name^="footer_"]');
    footerInputs.forEach(input => {
        const wrapper = input.closest('.input-wrapper');
        const counter = wrapper.querySelector('.footer-count');
        
        if (counter) {
            input.addEventListener('input', function() {
                counter.textContent = this.value.length;
                updatePreview();
            });
        }
    });
}

// Language Tab Functionality
function initializeLanguageTabs() {
    const langTabs = document.querySelectorAll('.lang-tab');
    const langContents = document.querySelectorAll('.lang-content');
    
    langTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetLang = this.getAttribute('data-lang');
            if (this.style.display === 'none') {
                return;
            }
            
            // Remove active class from all tabs and contents
            langTabs.forEach(t => t.classList.remove('active'));
            langContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const targetContent = document.querySelector(`.lang-content[data-lang="${targetLang}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Update preview with current language
            updatePreview();
        });
    });
}

// Language Selector Functionality
function initializeLanguageSelectors() {
    const toggles = document.querySelectorAll('.lang-toggle');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', updateLanguageVisibility);
    });

    updateLanguageVisibility();
}

function updateLanguageVisibility() {
    const toggles = document.querySelectorAll('.lang-toggle');
    const selected = Array.from(toggles)
        .filter(toggle => toggle.checked)
        .map(toggle => toggle.getAttribute('data-lang'));

    const langTabs = document.querySelectorAll('.lang-tab');
    const langContents = document.querySelectorAll('.lang-content');

    langTabs.forEach(tab => {
        const lang = tab.getAttribute('data-lang');
        const isSelected = selected.includes(lang);
        tab.style.display = isSelected ? '' : 'none';
        if (!isSelected) {
            tab.classList.remove('active');
        }
    });

    langContents.forEach(content => {
        const lang = content.getAttribute('data-lang');
        const isSelected = selected.includes(lang);
        content.style.display = isSelected ? '' : 'none';
        if (!isSelected) {
            content.classList.remove('active');
        }

        const bodyEditor = content.querySelector('.body-editor');
        if (bodyEditor) {
            if (isSelected) {
                bodyEditor.setAttribute('required', 'required');
            } else {
                bodyEditor.removeAttribute('required');
            }
        }
    });

    if (selected.length > 0) {
        const activeTab = document.querySelector('.lang-tab.active');
        if (!activeTab || activeTab.style.display === 'none') {
            const nextLang = selected[0];
            const nextTab = document.querySelector(`.lang-tab[data-lang="${nextLang}"]`);
            const nextContent = document.querySelector(`.lang-content[data-lang="${nextLang}"]`);
            if (nextTab) nextTab.classList.add('active');
            if (nextContent) nextContent.classList.add('active');
        }
    }

    updatePreview();
}

// Header Select Functionality
function initializeHeaderSelects() {
    const headerSelects = document.querySelectorAll('.header-select');
    
    headerSelects.forEach(select => {
        updateHeaderContainers(select);
        select.addEventListener('change', function() {
            updateHeaderContainers(this);
            updatePreview();
        });
    });
    
    // Header text inputs
    const headerInputs = document.querySelectorAll('input[name^="header_text_"]');
    headerInputs.forEach(input => {
        input.addEventListener('input', function() {
            updatePreview();
        });
    });

    const mediaInputs = document.querySelectorAll('.header-media-container select, .header-media-container input');
    mediaInputs.forEach(input => {
        input.addEventListener('input', function() {
            updatePreview();
        });
        input.addEventListener('change', function() {
            updatePreview();
        });
    });

    const locationInputs = document.querySelectorAll('.header-location-container input');
    locationInputs.forEach(input => {
        input.addEventListener('input', function() {
            updatePreview();
        });
    });
}

function updateHeaderContainers(select) {
    const group = select.closest('.form-group');
    if (!group) return;

    const textContainer = group.querySelector('.header-text-container');
    const mediaContainer = group.querySelector('.header-media-container');
    const locationContainer = group.querySelector('.header-location-container');

    if (textContainer) {
        textContainer.style.display = select.value === 'text' ? 'flex' : 'none';
    }
    if (mediaContainer) {
        mediaContainer.style.display = select.value === 'media' ? 'flex' : 'none';
    }
    if (locationContainer) {
        locationContainer.style.display = select.value === 'location' ? 'block' : 'none';
    }
}

// END OF PART 1
// ============================================
// PART 2 of 4: Toolbar and WhatsApp Formatting
// ============================================

// Toolbar Functionality
function initializeToolbar() {
    const toolButtons = document.querySelectorAll('.tool-btn');
    
    toolButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.getAttribute('data-format');
            const toolbar = this.closest('.toolbar');
            const formGroup = toolbar.closest('.form-group');
            const textarea = formGroup.querySelector('.body-editor');
            
            if (textarea) {
                insertFormatting(textarea, format);
            }
        });
    });
    
    // Variable buttons
    const varButtons = document.querySelectorAll('.var-btn');
    varButtons.forEach(button => {
        button.addEventListener('click', function() {
            openVariableModal();
        });
    });
}

// Track last focused input for variable insertion
let activeVariableTarget = null;

function initializeVariableTracking() {
    const editors = document.querySelectorAll('.body-editor');
    const headerInputs = document.querySelectorAll('input[name^="header_text_"]');
    const urlInputs = document.querySelectorAll('input[name^="button_url_"]');
    const buttonTextInputs = document.querySelectorAll('input[name^="button_text_"]');

    editors.forEach(editor => {
        editor.addEventListener('focus', function() {
            activeVariableTarget = this;
        });
    });

    headerInputs.forEach(input => {
        input.addEventListener('focus', function() {
            activeVariableTarget = this;
        });
    });

    urlInputs.forEach(input => {
        input.addEventListener('focus', function() {
            activeVariableTarget = this;
        });
    });

    buttonTextInputs.forEach(input => {
        input.addEventListener('focus', function() {
            activeVariableTarget = this;
        });
    });
}

// Insert WhatsApp formatting characters
function insertFormatting(textarea, format) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    let formattedText = '';
    let cursorOffset = 0;
    
    switch(format) {
        case 'bold':
            formattedText = `*${selectedText}*`;
            cursorOffset = selectedText ? 0 : 1;
            break;
        case 'italic':
            formattedText = `_${selectedText}_`;
            cursorOffset = selectedText ? 0 : 1;
            break;
        case 'strike':
            formattedText = `~${selectedText}~`;
            cursorOffset = selectedText ? 0 : 1;
            break;
        case 'code':
            formattedText = `\`\`\`${selectedText}\`\`\``;
            cursorOffset = selectedText ? 0 : 3;
            break;
        default:
            formattedText = selectedText;
    }
    
    textarea.value = beforeText + formattedText + afterText;
    
    // Update cursor position
    if (selectedText) {
        textarea.selectionStart = start;
        textarea.selectionEnd = start + formattedText.length;
    } else {
        const newPosition = start + formattedText.length - cursorOffset;
        textarea.selectionStart = newPosition;
        textarea.selectionEnd = newPosition;
    }
    
    textarea.focus();
    
    // Update character count and preview
    const counter = textarea.closest('.editor-wrapper').querySelector('.body-count');
    if (counter) {
        counter.textContent = textarea.value.length;
    }
    
    updatePreview();
}


// Variable Modal Functions
function openVariableModal() {
    const modal = document.getElementById('variableModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeVariableModal() {
    const modal = document.getElementById('variableModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Clear inputs
    document.getElementById('variableName').value = '';
    document.getElementById('variableSample').value = '';
}

// Initialize modal close handlers
document.addEventListener('DOMContentLoaded', function() {
    const cancelBtn = document.getElementById('cancelVariable');
    const okBtn = document.getElementById('okVariable');
    const modal = document.getElementById('variableModal');
    const overlay = modal ? modal.querySelector('.modal-overlay') : null;
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeVariableModal);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeVariableModal);
    }
    
    if (okBtn) {
        okBtn.addEventListener('click', function() {
            const varName = document.getElementById('variableName').value;
            const varSample = document.getElementById('variableSample').value;
            
            if (varName) {
                // Find active language content
                const activeContent = document.querySelector('.lang-content.active');
                const lang = activeContent ? activeContent.getAttribute('data-lang') : 'en';

                const target = activeVariableTarget || (activeContent ? activeContent.querySelector('.body-editor') : null);

                if (target) {
                    // Insert variable placeholder
                    const variableText = `{{${varName}}}`;
                    const cursorPos = target.selectionStart || 0;
                    const beforeText = target.value.substring(0, cursorPos);
                    const afterText = target.value.substring(cursorPos);
                    
                    target.value = beforeText + variableText + afterText;
                    target.focus();
                    
                    // Update counter and preview for body editor
                    const editorWrapper = target.closest('.editor-wrapper');
                    if (editorWrapper) {
                        const counter = editorWrapper.querySelector('.body-count');
                        if (counter) {
                            counter.textContent = target.value.length;
                        }
                    }
                    
                    updatePreview();
                }

                if (varSample) {
                    updateVariableSamples(lang, varName, varSample);
                }
            }
            
            closeVariableModal();
        });
    }
});

function updateVariableSamples(lang, varName, varSample) {
    const hiddenInput = document.querySelector(`.variable-samples[data-lang="${lang}"]`);
    if (!hiddenInput) return;

    let current = {};
    try {
        current = JSON.parse(hiddenInput.value || '{}');
    } catch (e) {
        current = {};
    }

    current[varName] = varSample;
    hiddenInput.value = JSON.stringify(current);
}

// END OF PART 2
// ============================================
// ============================================
// PART 3 of 4: Buttons Management and Preview (UPDATED with Icons)
// ============================================

let buttonCount = 0;
let buttonTypeCounts = {
    'quick_reply': 0,
    'custom': 0,
    'call_phone': 0,
    'visit_website': 0,
    'copy_offer': 0,
    'whatsapp_flow': 0
};

// Button type limits
const buttonTypeLimits = {
    'quick_reply': 10,
    'custom': 10,
    'call_phone': 1,
    'visit_website': 2,
    'copy_offer': 1,
    'whatsapp_flow': 1
};

// Initialize Button Functionality
function initializeButtons() {
    const addButtonSelect = document.getElementById('addButton');
    
    if (addButtonSelect) {
        addButtonSelect.addEventListener('change', function() {
            const buttonType = this.value;
            
            if (buttonType) {
                addButton(buttonType);
                this.value = ''; // Reset select
                updateButtonCount();
                updateButtonOptions();
            }
        });
    }
}

// Check if button type can be added
function canAddButtonType(type) {
    const currentCount = buttonTypeCounts[type] || 0;
    const limit = buttonTypeLimits[type] || 10;
    return currentCount < limit;
}

// Get remaining count for button type
function getRemainingCount(type) {
    const currentCount = buttonTypeCounts[type] || 0;
    const limit = buttonTypeLimits[type] || 10;
    return limit - currentCount;
}

// Update button dropdown options based on limits
function updateButtonOptions() {
    const addButtonSelect = document.getElementById('addButton');
    if (!addButtonSelect) return;
    
    // Update option availability
    const options = addButtonSelect.querySelectorAll('option');
    options.forEach(option => {
        const type = option.value;
        if (type && buttonTypeLimits[type]) {
            const remaining = getRemainingCount(type);
            if (remaining <= 0) {
                option.disabled = true;
                option.style.color = '#ccc';
            } else {
                option.disabled = false;
                option.style.color = '';
            }
        }
    });
}

// Add Button to Container
function addButton(type) {
    // Check total button limit
    if (buttonCount >= 10) {
        alert('Maximum 10 buttons allowed in total');
        return;
    }
    
    // Check type-specific limit
    if (!canAddButtonType(type)) {
        const limit = buttonTypeLimits[type];
        alert(`Maximum ${limit} ${getButtonTypeLabel(type)} button(s) allowed`);
        return;
    }
    
    const container = document.getElementById('buttonsContainer');
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'button-item';
    buttonDiv.setAttribute('data-button-type', type);
    buttonDiv.setAttribute('data-button-id', buttonCount);
    
    let buttonHTML = `
        <button type="button" class="button-remove" onclick="removeButton(this)">✕</button>
        <h4>${getButtonTypeLabel(type)}</h4>
    `;
    
    // Different fields based on button type
    if (type === 'quick_reply' || type === 'custom') {
        buttonHTML += `
            <label>Button Text</label>
            <input type="text" name="button_text_${buttonCount}" placeholder="Enter button text" maxlength="25" required>
        `;
    } else if (type === 'visit_website') {
        buttonHTML += `
            <label>Button Text</label>
            <input type="text" name="button_text_${buttonCount}" placeholder="Enter button text" maxlength="25" required>
            <label>URL Type</label>
            <select name="url_type_${buttonCount}" class="url-type-select" data-button-id="${buttonCount}">
                <option value="static">Static</option>
                <option value="dynamic">Dynamic</option>
            </select>
            <label>Website URL</label>
            <input type="url" name="button_url_${buttonCount}" placeholder="https://example.com" required>
            <div class="dynamic-url-suffix" id="dynamic_suffix_${buttonCount}" style="display:none;">
                <label>URL Path/Parameter Example <span class="hint">(Sample value to replace the variable, e.g. "abc123")</span></label>
                <input type="text" name="button_url_suffix_${buttonCount}" placeholder="e.g. abc123, promo456 (just the value, no {{1}})">
            </div>
        `;
    } else if (type === 'call_phone') {
        buttonHTML += `
            <label>Button Text</label>
            <input type="text" name="button_text_${buttonCount}" placeholder="Enter button text" maxlength="25" required>
            <label>Phone Number</label>
            <input type="tel" name="button_phone_${buttonCount}" placeholder="+852 1234 5678" required>
        `;
    } else if (type === 'copy_offer') {
        buttonHTML += `
            <label>Button Text</label>
            <input type="text" name="button_text_${buttonCount}" placeholder="Copy offer code" maxlength="25" required>
            <label>Example Offer Code <span class="hint">(Sample code for template approval)</span></label>
            <input type="text" name="button_code_example_${buttonCount}" placeholder="e.g. SAVE20, WELCOME10" required>
        `;
    } else if (type === 'whatsapp_flow') {
        buttonHTML += `
            <label>Button Text</label>
            <input type="text" name="button_text_${buttonCount}" placeholder="Enter button text" maxlength="25" required>
            <label>Flow ID</label>
            <input type="text" name="button_flow_${buttonCount}" placeholder="Enter flow ID" required>
        `;
    }
    
    buttonDiv.innerHTML = buttonHTML;
    container.appendChild(buttonDiv);
    
    // Add event listener for URL type toggle (for website buttons)
    if (type === 'visit_website') {
        const urlTypeSelect = buttonDiv.querySelector('.url-type-select');
        if (urlTypeSelect) {
            urlTypeSelect.addEventListener('change', function() {
                const btnId = this.getAttribute('data-button-id');
                const suffixDiv = document.getElementById(`dynamic_suffix_${btnId}`);
                if (suffixDiv) {
                    suffixDiv.style.display = this.value === 'dynamic' ? 'block' : 'none';
                }
            });
        }
    }
    
    // Update counts
    buttonCount++;
    buttonTypeCounts[type] = (buttonTypeCounts[type] || 0) + 1;
    
    updatePreview();
}

// Remove Button
function removeButton(button) {
    const buttonItem = button.closest('.button-item');
    const buttonType = buttonItem.getAttribute('data-button-type');
    
    buttonItem.remove();
    
    // Update counts
    buttonCount--;
    if (buttonTypeCounts[buttonType] > 0) {
        buttonTypeCounts[buttonType]--;
    }
    
    updateButtonCount();
    updateButtonOptions();
    updatePreview();
}

// Get Button Type Label
function getButtonTypeLabel(type) {
    const labels = {
        'quick_reply': 'Quick Reply',
        'custom': 'Custom Button',
        'visit_website': 'Visit Website',
        'call_phone': 'Call Phone Number',
        'copy_offer': 'Copy Offer Code',
        'whatsapp_flow': 'WhatsApp Flow'
    };
    return labels[type] || type;
}

// Get Button Icon
function getButtonIcon(type) {
    const icons = {
        'quick_reply': '↩️',
        'custom': '⭐',
        'call_phone': '📞',
        'visit_website': '🔗',
        'copy_offer': '📋',
        'whatsapp_flow': '📱'
    };
    return icons[type] || '';
}

// Update Button Count Display
function updateButtonCount() {
    const addButtonSelect = document.getElementById('addButton');
    if (addButtonSelect) {
        const firstOption = addButtonSelect.options[0];
        firstOption.text = `+ Add Button (${buttonCount}/10)`;
    }
}

// Preview Update Functionality
function initializePreview() {
    // Initial preview update
    updatePreview();
    
    // Listen for all input changes
    const form = document.getElementById('templateForm');
    if (form) {
        form.addEventListener('input', updatePreview);
        form.addEventListener('change', updatePreview);
    }
}

// Update WhatsApp Preview (WITH ICONS AND "SEE ALL OPTIONS")
function updatePreview() {
    const activeContent = document.querySelector('.lang-content.active');
    if (!activeContent) return;
    
    // Get current language
    const currentLang = activeContent.getAttribute('data-lang');
    
    // Get header
    const headerSelect = activeContent.querySelector('.header-select');
    const headerText = activeContent.querySelector(`input[name="header_text_${currentLang}"]`);
    const previewHeader = document.getElementById('previewHeader');
    
    if (headerSelect) {
        previewHeader.classList.remove('location-header');
        previewHeader.classList.remove('media-header');
        if (headerSelect.value === 'text' && headerText && headerText.value) {
            previewHeader.textContent = headerText.value;
            previewHeader.style.display = 'block';
        } else if (headerSelect.value === 'media') {
            const mediaType = activeContent.querySelector('select[name^="header_media_type_"]');
            const mediaUrl = activeContent.querySelector('input[name^="header_media_url_"]');
            const typeValue = mediaType ? mediaType.value : 'media';
            const label = typeValue.toUpperCase();
            const urlText = mediaUrl && mediaUrl.value ? escapeHtml(mediaUrl.value) : 'No media URL set';
            const iconMap = {
                image: '🖼️',
                video: '🎬',
                document: '📄',
                media: '📎'
            };
            const icon = iconMap[typeValue] || iconMap.media;

            previewHeader.classList.add('media-header');
            previewHeader.innerHTML = `
                <div class="media-thumb">${icon}</div>
                <div class="media-meta">
                    <span class="media-pill">${label}</span>
                    <span class="media-url">${urlText}</span>
                </div>
            `;
            previewHeader.style.display = 'block';
        } else if (headerSelect.value === 'location') {
            const locName = activeContent.querySelector('input[name^="header_location_name_"]')?.value || '';
            const locAddress = activeContent.querySelector('input[name^="header_location_address_"]')?.value || '';
            const locLat = activeContent.querySelector('input[name^="header_location_lat_"]')?.value || '';
            const locLng = activeContent.querySelector('input[name^="header_location_lng_"]')?.value || '';
            const safeName = locName ? escapeHtml(locName) : '{{Location name}}';
            const safeAddress = locAddress ? escapeHtml(locAddress) : '{{Address}}';
            const coords = locLat && locLng ? `<span class="location-pill">${escapeHtml(locLat)}, ${escapeHtml(locLng)}</span>` : '';

            previewHeader.classList.add('location-header');
            previewHeader.innerHTML = `
                <span class="location-icon">📍</span>
                <span class="location-text">
                    <span class="location-pill">${safeName}</span>
                    <span class="location-pill">${safeAddress}</span>
                    ${coords}
                </span>
            `;
            previewHeader.style.display = 'block';
        } else {
            previewHeader.classList.remove('location-header');
            previewHeader.classList.remove('media-header');
            previewHeader.style.display = 'none';
        }
    } else {
        previewHeader.classList.remove('location-header');
        previewHeader.classList.remove('media-header');
        previewHeader.style.display = 'none';
    }
    
    // Get body
    const bodyTextarea = activeContent.querySelector('.body-editor');
    const previewBody = document.getElementById('previewBody');
    
    if (bodyTextarea && bodyTextarea.value) {
        // Convert WhatsApp formatting to HTML
        let formattedText = bodyTextarea.value;
        
        // Bold *text*
        formattedText = formattedText.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
        
        // Italic _text_
        formattedText = formattedText.replace(/_(.*?)_/g, '<em>$1</em>');
        
        // Strikethrough ~text~
        formattedText = formattedText.replace(/~(.*?)~/g, '<s>$1</s>');
        
        // Code ```text```
        formattedText = formattedText.replace(/```([\s\S]*?)```/g, '<code>$1</code>');
        
        previewBody.innerHTML = formattedText;
        previewBody.style.display = 'block';
    } else {
        previewBody.style.display = 'none';
    }
    
    // Get footer
    const footerInput = activeContent.querySelector(`input[name="footer_${currentLang}"]`);
    const previewFooter = document.getElementById('previewFooter');
    
    if (footerInput && footerInput.value) {
        previewFooter.textContent = footerInput.value;
        previewFooter.style.display = 'block';
    } else {
        previewFooter.style.display = 'none';
    }
    
    // Get buttons - WITH ICONS AND "SEE ALL OPTIONS"
    const previewButtons = document.getElementById('previewButtons');
    previewButtons.innerHTML = '';
    
    const buttonItems = document.querySelectorAll('.button-item');
    const buttonData = [];
    
    // Collect all button data (text and type)
    buttonItems.forEach(item => {
        const textInput = item.querySelector('input[name^="button_text_"]');
        const buttonType = item.getAttribute('data-button-type');
        if (textInput && textInput.value) {
            buttonData.push({
                text: textInput.value,
                type: buttonType
            });
        }
    });
    
    // Display buttons based on count
    if (buttonData.length > 0) {
        // Show first 3 buttons
        const displayCount = Math.min(3, buttonData.length);
        
        for (let i = 0; i < displayCount; i++) {
            const btn = document.createElement('button');
            const icon = getButtonIcon(buttonData[i].type);
            btn.innerHTML = `${icon} ${buttonData[i].text}`;
            btn.type = 'button';
            
            // Style based on button type
            if (buttonData[i].type === 'call_phone' || 
                buttonData[i].type === 'visit_website' || 
                buttonData[i].type === 'copy_offer') {
                btn.style.textAlign = 'center';
            }
            
            previewButtons.appendChild(btn);
        }
        
        // If more than 3 buttons, show "See all options"
        if (buttonData.length > 3) {
            const seeAllBtn = document.createElement('button');
            seeAllBtn.innerHTML = '📋 See all options';
            seeAllBtn.type = 'button';
            seeAllBtn.style.color = '#0088cc';
            seeAllBtn.style.fontWeight = '500';
            seeAllBtn.style.textAlign = 'center';
            previewButtons.appendChild(seeAllBtn);
        }
    }
}

// END OF PART 3 - UPDATED WITH ICONS
// ============================================
// PART 4 of 4: Form Submission and Validation
// ============================================

// Initialize Form Submission
function initializeFormSubmission() {
    const form = document.getElementById('templateForm');
    const cancelBtn = document.querySelector('.btn-cancel');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                // Form is valid, submit it
                this.submit();
            }
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
                window.location.reload();
            }
        });
    }
}

// Form Validation
function validateForm() {
    let isValid = true;
    const errors = [];
    
    // Validate template name
    const templateName = document.getElementById('templateName');
    if (templateName && !templateName.value.trim()) {
        errors.push('Template name is required');
        isValid = false;
    } else if (templateName && !/^[0-9a-z_]+$/.test(templateName.value)) {
        errors.push('Template name can only contain 0-9, a-z, and underscore');
        isValid = false;
    }
    
    // Validate category
    const category = document.getElementById('category');
    if (category && !category.value) {
        errors.push('Category is required');
        isValid = false;
    }

    // Validate header inputs per language
    const langContents = document.querySelectorAll('.lang-content');
    langContents.forEach(content => {
        const lang = content.getAttribute('data-lang') || 'en';
        const headerSelect = content.querySelector('.header-select');
        if (!headerSelect) return;

        if (headerSelect.value === 'media') {
            const mediaType = content.querySelector('select[name^="header_media_type_"]');
            const mediaUrl = content.querySelector('input[name^="header_media_url_"]');
            if (!mediaType || !mediaType.value) {
                errors.push(`Header media type is required for ${lang}`);
                isValid = false;
            }
            if (!mediaUrl || !mediaUrl.value.trim()) {
                errors.push(`Header media URL is required for ${lang}`);
                isValid = false;
            }
            if (mediaType && mediaUrl && mediaUrl.value.trim()) {
                const urlValue = mediaUrl.value.trim().toLowerCase();
                const extMap = {
                    image: ['.jpg', '.jpeg', '.png'],
                    video: ['.mp4'],
                    document: ['.pdf']
                };
                const allowed = extMap[mediaType.value] || [];
                const matches = allowed.some(ext => urlValue.endsWith(ext));
                if (!matches) {
                    errors.push(`Header media URL for ${lang} must end with ${allowed.join(' or ')}`);
                    isValid = false;
                }
            }
        }

        if (headerSelect.value === 'location') {
            const locName = content.querySelector('input[name^="header_location_name_"]');
            const locAddress = content.querySelector('input[name^="header_location_address_"]');
            const locLat = content.querySelector('input[name^="header_location_lat_"]');
            const locLng = content.querySelector('input[name^="header_location_lng_"]');
            if (!locName || !locName.value.trim() || !locAddress || !locAddress.value.trim() || !locLat || !locLat.value.trim() || !locLng || !locLng.value.trim()) {
                errors.push(`All header location fields are required for ${lang}`);
                isValid = false;
            }
        }

        if (headerSelect.value === 'text') {
            const headerValue = content.querySelector('input[name^="header_text_"]')?.value || '';
            if (countVariables(headerValue) > 1) {
                errors.push(`Header text supports at most 1 variable for ${lang}`);
                isValid = false;
            }
        }

        const footerValue = content.querySelector('input[name^="footer_"]')?.value || '';
        if (countVariables(footerValue) > 0) {
            errors.push(`Footer cannot contain variables for ${lang}`);
            isValid = false;
        }
    });
    
    // Validate selected languages
    const toggles = document.querySelectorAll('.lang-toggle');
    const selectedLangs = Array.from(toggles)
        .filter(toggle => toggle.checked)
        .map(toggle => toggle.getAttribute('data-lang'));

    if (selectedLangs.length === 0) {
        errors.push('Select at least one language to submit');
        isValid = false;
    } else {
        let selectedHasContent = false;
        selectedLangs.forEach(lang => {
            const content = document.querySelector(`.lang-content[data-lang="${lang}"]`);
            const editor = content ? content.querySelector('.body-editor') : null;
            if (editor && editor.value.trim()) {
                selectedHasContent = true;
            }
        });

        if (!selectedHasContent) {
            errors.push('At least one selected language must have body content');
            isValid = false;
        }
    }

    // Variable density validation - WhatsApp requires sufficient text per variable
    // Rule: At least 3 words of actual text per variable in the body
    selectedLangs.forEach(lang => {
        const content = document.querySelector(`.lang-content[data-lang="${lang}"]`);
        const editor = content ? content.querySelector('.body-editor') : null;
        if (editor && editor.value.trim()) {
            const bodyText = editor.value.trim();
            const varCount = countVariables(bodyText);
            const wordCount = countWordsExcludingVariables(bodyText);
            
            if (varCount > 0 && wordCount < varCount * 3) {
                const needed = varCount * 3;
                errors.push(
                    `Body text (${lang.toUpperCase()}) needs more content.\n` +
                    `   • You have ${varCount} variable(s) but only ${wordCount} word(s) of text.\n` +
                    `   • WhatsApp requires at least ${needed} words when using ${varCount} variable(s).\n` +
                    `   • Tip: Add more descriptive text around your variables.`
                );
                isValid = false;
            }
        }
    });
    
    // Show validation errors
    if (!isValid) {
        alert('Please fix the following errors:\n\n' + errors.join('\n'));
        
        // Show error messages on body fields
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.style.display = 'none';
        });
        
        if (selectedLangs.length > 0) {
            selectedLangs.forEach(lang => {
                const content = document.querySelector(`.lang-content[data-lang="${lang}"]`);
                const editor = content ? content.querySelector('.body-editor') : null;
                if (editor && !editor.value.trim()) {
                    const errorMsg = editor.closest('.form-group').querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.style.display = 'block';
                    }
                }
            });
        }
    }
    
    return isValid;
}

function countVariables(text) {
    if (!text) return 0;
    const matches = text.match(/\{\{\s*[^}]+\s*\}\}/g);
    return matches ? matches.length : 0;
}

function countWordsExcludingVariables(text) {
    if (!text) return 0;
    const stripped = text.replace(/\{\{\s*[^}]+\s*\}\}/g, ' ');
    const words = stripped.trim().split(/\s+/).filter(Boolean);
    return words.length;
}


// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make removeButton function global
window.removeButton = removeButton;

// Console log for debugging
console.log('WhatsApp Template Form initialized successfully');

// END OF PART 4 - SCRIPT.JS COMPLETE
