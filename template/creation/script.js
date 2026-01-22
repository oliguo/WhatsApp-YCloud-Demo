// ============================================
// PART 1 of 4: Initialization and Character Counters
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeCounters();
    initializeLanguageTabs();
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

// Header Select Functionality
function initializeHeaderSelects() {
    const headerSelects = document.querySelectorAll('.header-select');
    
    headerSelects.forEach(select => {
        select.addEventListener('change', function() {
            const container = this.parentElement.querySelector('.header-text-container');
            
            if (this.value === 'text') {
                container.style.display = 'flex';
            } else {
                container.style.display = 'none';
            }
            
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
            <select name="url_type_${buttonCount}">
                <option value="static">Static</option>
                <option value="dynamic">Dynamic</option>
            </select>
            <label>Website URL</label>
            <input type="url" name="button_url_${buttonCount}" placeholder="https://example.com" required>
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
            <input type="text" name="button_text_${buttonCount}" placeholder="Enter button text" maxlength="25" required>
            <label>Offer Code</label>
            <input type="text" name="button_code_${buttonCount}" placeholder="Enter offer code" required>
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
    
    if (headerSelect && headerSelect.value === 'text' && headerText && headerText.value) {
        previewHeader.textContent = headerText.value;
        previewHeader.style.display = 'block';
    } else {
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
    
    // Validate at least one language has body content
    const bodyEditors = document.querySelectorAll('.body-editor');
    let hasContent = false;
    
    bodyEditors.forEach(editor => {
        if (editor.value.trim()) {
            hasContent = true;
        }
    });
    
    if (!hasContent) {
        errors.push('At least one language must have body content');
        isValid = false;
    }
    
    // Show validation errors
    if (!isValid) {
        alert('Please fix the following errors:\n\n' + errors.join('\n'));
        
        // Show error messages on body fields
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.style.display = 'none';
        });
        
        bodyEditors.forEach(editor => {
            if (!editor.value.trim()) {
                const errorMsg = editor.closest('.form-group').querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.style.display = 'block';
                }
            }
        });
    }
    
    return isValid;
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// AI Translation Button (Placeholder)
document.addEventListener('DOMContentLoaded', function() {
    const aiBtn = document.querySelector('.ai-translate-btn');
    if (aiBtn) {
        aiBtn.addEventListener('click', function() {
            alert('AI Translation feature coming soon!\n\nThis would automatically translate your content to all selected languages.');
        });
    }
});

// Make removeButton function global
window.removeButton = removeButton;

// Console log for debugging
console.log('WhatsApp Template Form initialized successfully');

// END OF PART 4 - SCRIPT.JS COMPLETE
