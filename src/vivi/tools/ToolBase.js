// ToolBase — Base class for all Vivi tools.
// Each tool is an independent, self-contained unit that TOOR orchestrates.
// To add a new tool: create a file extending ToolBase, register it in ViviTOOR.

export class ToolBase {
  /** @param {{name: string, description: string, category?: string, permissions?: string[], requiresFounder?: boolean}} config */
  constructor(config) {
    this.name = config.name;
    this.description = config.description;
    this.category = config.category || 'general';
    this.permissions = config.permissions || [];
    this.requiresFounder = config.requiresFounder || false;
  }

  /**
   * Execute the tool.
   * @param {object} _params - Tool-specific parameters
   * @param {object} _context - { registry, user, bus }
   * @returns {Promise<{ success: boolean, data: any, error?: string }>}
   */
  async execute(_params, _context) {
    throw new Error(`Tool '${this.name}' must implement execute()`);
  }

  /** Brief description for the LLM tool-selection prompt. */
  getPromptDescription() {
    return `${this.name}: ${this.description}`;
  }
}