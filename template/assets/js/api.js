/**
 * API Module
 * Handles all YCloud WhatsApp API communications
 * Credentials are loaded from server-side config.php
 */

const api = {
  baseUrl: 'https://api.ycloud.com/v2',

  /**
   * Make API request via PHP proxy
   * @param {string} endpoint - API endpoint
   * @param {object} options - Request options
   */
  async request(endpoint, options = {}) {
    const response = await fetch('../api/proxy.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint,
        method: options.method || 'GET',
        data: options.data || null
      })
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'API request failed');
    }

    return result.data;
  },

  /**
   * List all templates
   * @param {object} params - Query parameters (limit, offset, etc.)
   */
  async listTemplates(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/whatsapp/templates?${queryString}`;
    return this.request(endpoint);
  },

  /**
   * Get a single template by name and language
   * Note: YCloud API doesn't support getting single template by name directly.
   * We use list endpoint with name filter instead.
   * @param {string} name - Template name
   * @param {string} language - Template language code
   */
  async getTemplate(name, language) {
    // Use list endpoint with name filter since direct get by name doesn't work
    const endpoint = `/whatsapp/templates?name=${encodeURIComponent(name)}`;
    const response = await this.request(endpoint);
    
    // Find the template with matching language
    const items = response.items || [];
    const template = items.find(t => t.language === language);
    
    if (!template) {
      throw new Error(`Template "${name}" not found for language: ${language}`);
    }
    
    return template;
  },

  /**
   * Create a new template
   * @param {object} templateData - Template data
   */
  async createTemplate(templateData) {
    return this.request('/whatsapp/templates', {
      method: 'POST',
      data: templateData
    });
  },

  /**
   * Delete a template
   * @param {string} name - Template name
   * @param {string} language - Optional language (deletes specific language version)
   */
  async deleteTemplate(name, language = null) {
    let endpoint = `/whatsapp/templates/${name}`;
    if (language) {
      endpoint += `?language=${language}`;
    }
    return this.request(endpoint, { method: 'DELETE' });
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { api };
}
