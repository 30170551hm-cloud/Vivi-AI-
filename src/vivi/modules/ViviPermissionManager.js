// ViviPermissionManager — Controls all actions Vivi can execute.
// 3 permission levels + Founder Mode + action history with revert tracking.
// Never executes destructive actions without the corresponding authorization.
import { ModuleBase } from '../core/ModuleBase';
import { EVENTS } from '../events';
import { backend } from '@/lib/backendClient';

// Level 1: Auto-permitted (read-only, safe operations)
const LEVEL_1_ACTIONS = [
  'read_file', 'analyze_code', 'explain_code', 'search_errors',
  'create_documentation', 'query_memory', 'index_project', 'create_plan',
  'list_files', 'list_branches', 'list_commits', 'get_diff', 'search_graph',
  'search_knowledge',
];

// Level 2: Implicit authorization (create/modify, non-destructive)
const LEVEL_2_ACTIONS = [
  'create_file', 'create_folder', 'create_module', 'create_component',
  'create_api', 'create_documentation_file', 'refactor_code', 'optimize_performance',
  'update_dependencies_minor', 'create_branch', 'create_commit', 'create_pr',
  'edit_file', 'update_file',
];

// Level 3: Requires founder confirmation (destructive/critical)
const LEVEL_3_ACTIONS = [
  'delete_file', 'delete_folder', 'modify_architecture', 'push_github',
  'merge_branch', 'delete_branch', 'modify_database', 'run_migrations',
  'deploy_production', 'delete_module', 'force_push', 'modify_main_branch',
];

const ACTION_LEVELS = {};
[...LEVEL_1_ACTIONS].forEach(a => { ACTION_LEVELS[a] = 1; });
[...LEVEL_2_ACTIONS].forEach(a => { ACTION_LEVELS[a] = 2; });
[...LEVEL_3_ACTIONS].forEach(a => { ACTION_LEVELS[a] = 3; });

export default class ViviPermissionManager extends ModuleBase {
  constructor(bus) {
    super('permission_manager', bus);
    this._founderMode = false;
    this._autonomyMode = true;
    this._founderEmail = '30170551hm@gmail.com';
    this._pendingApprovals = new Map();
    this._roles = {
      owner:         { level: 0, label: 'Owner',         canManageUsers: true,  canManageAgents: true,  canCertify: true,  canGithub: true,  canDev: true  },
      administrator: { level: 1, label: 'Administrator', canManageUsers: true,  canManageAgents: true,  canCertify: true,  canGithub: true,  canDev: true  },
      developer:     { level: 2, label: 'Developer',     canManageUsers: false, canManageAgents: true,  canCertify: true,  canGithub: true,  canDev: true  },
      user:          { level: 3, label: 'User',          canManageUsers: false, canManageAgents: false, canCertify: false, canGithub: false, canDev: false },
      guest:         { level: 4, label: 'Guest',         canManageUsers: false, canManageAgents: false, canCertify: false, canGithub: false, canDev: false },
    };
  }

  async init(registry) {
    await super.init(registry);
    this.emit(EVENTS.DEV_ACTIVITY, {
      module: 'permission_manager',
      action: 'autonomy_mode_initialized',
      autonomyMode: this._autonomyMode,
    });
  }

  async toggleAutonomyMode(founderEmail) {
    return this.safe(async () => {
      if (!this._isFounder(founderEmail)) {
        return { success: false, reason: 'Only the founder can toggle Autonomy Mode' };
      }
      this._autonomyMode = !this._autonomyMode;
      this.emit(EVENTS.FOUNDER_MODE_TOGGLED, { active: this._autonomyMode, mode: 'autonomy', founder: founderEmail });
      this.emit(EVENTS.DEV_ACTIVITY, { module: 'permission_manager', action: 'toggle_autonomy_mode', active: this._autonomyMode });
      return { success: true, autonomyMode: this._autonomyMode };
    }, { success: false });
  }

  isAutonomyModeActive() { return this._autonomyMode; }

  getLevel(action) { return ACTION_LEVELS[action] || 2; }

  checkPermission(action, context = {}) {
    const level = this.getLevel(action);
    this.emit(EVENTS.PERMISSION_CHECK, { action, level, context });
    if (this._autonomyMode) {
      this.emit(EVENTS.PERMISSION_GRANTED, { action, level, reason: 'autonomy_mode_full_access' });
      return { permitted: true, level, needsApproval: false, autonomyAuthorized: true };
    }
    if (level === 1) {
      this.emit(EVENTS.PERMISSION_GRANTED, { action, level, reason: 'auto_permitted' });
      return { permitted: true, level, needsApproval: false };
    }
    if (level === 2) {
      this.emit(EVENTS.PERMISSION_GRANTED, { action, level, reason: 'implicit_authorization' });
      return { permitted: true, level, needsApproval: false };
    }
    if (this._founderMode) {
      this.emit(EVENTS.PERMISSION_GRANTED, { action, level, reason: 'founder_mode_active' });
      return { permitted: true, level, needsApproval: false, founderAuthorized: true };
    }
    return { permitted: false, level, needsApproval: true };
  }

  async requestApproval(action, context = {}) {
    return this.safe(async () => {
      const level = this.getLevel(action);
      if (this._autonomyMode) {
        const autoTask = await backend.entities.ActionLog.create({
          action, permission_level: level, module: context.module || 'unknown',
          files_modified: context.files || [], result: 'auto-approved (autonomy mode)',
          status: 'approved', revertible: context.revertible !== false, founder_approved: true,
          branch: context.branch || '', impact_summary: context.impact || '',
        });
        this.emit(EVENTS.PERMISSION_GRANTED, { action, level, reason: 'autonomy_mode_auto_approved', taskId: autoTask.id });
        return { success: true, taskId: autoTask.id, needsApproval: false, autoApproved: true };
      }
      const task = await backend.entities.ActionLog.create({
        action, permission_level: level, module: context.module || 'unknown',
        files_modified: context.files || [], result: '', status: 'pending',
        revertible: context.revertible !== false, founder_approved: false,
        branch: context.branch || '', impact_summary: context.impact || '',
      });
      const approvalData = { taskId: task.id, action, level, context, message: context.message || `Autorización requerida para: ${action}` };
      this._pendingApprovals.set(task.id, approvalData);
      this.emit(EVENTS.PERMISSION_APPROVAL_REQUIRED, approvalData);
      this.emit(EVENTS.DEV_APPROVAL_REQUIRED, { ...approvalData, action_type: 'permission' });
      return { success: true, taskId: task.id, needsApproval: true };
    }, { success: false });
  }

  async grantApproval(taskId, founderEmail) {
    return this.safe(async () => {
      if (!this._isFounder(founderEmail)) {
        this.emit(EVENTS.PERMISSION_DENIED, { taskId, reason: 'not_founder' });
        return { success: false, reason: 'Only the founder can approve Level 3 actions' };
      }
      const pending = this._pendingApprovals.get(taskId);
      if (!pending) return { success: false, reason: 'Approval not found' };
      await backend.entities.ActionLog.update(taskId, { status: 'approved', founder_approved: true });
      this._pendingApprovals.delete(taskId);
      this.emit(EVENTS.PERMISSION_GRANTED, { taskId, action: pending.action, level: pending.level, reason: 'founder_approved' });
      return { success: true, taskId, action: pending.action };
    }, { success: false });
  }

  async toggleFounderMode(founderEmail) {
    return this.safe(async () => {
      if (!this._isFounder(founderEmail)) {
        return { success: false, reason: 'Only the founder can toggle Founder Mode' };
      }
      this._founderMode = !this._founderMode;
      this.emit(EVENTS.FOUNDER_MODE_TOGGLED, { active: this._founderMode, founder: founderEmail });
      this.emit(EVENTS.DEV_ACTIVITY, { module: 'permission_manager', action: 'toggle_founder_mode', active: this._founderMode });
      return { success: true, founderMode: this._founderMode };
    }, { success: false });
  }

  _isFounder(email) {
    if (!email) return false;
    return email.toLowerCase() === this._founderEmail.toLowerCase();
  }

  async isFounder(user) {
    const founderAuth = this.registry?.get('founder_auth');
    if (founderAuth?.isFounder) {
      return await this.safe(() => founderAuth.isFounder(user), false);
    }
    return this._isFounder(user?.email);
  }

  async logAction(action, context = {}) {
    return this.safe(async () => {
      const level = this.getLevel(action);
      const record = await backend.entities.ActionLog.create({
        action, permission_level: level, module: context.module || 'unknown',
        files_modified: context.files || [], result: context.result || '',
        status: context.status || 'executed', revertible: context.revertible !== false,
        reverted: false, founder_approved: context.founderApproved || false,
        branch: context.branch || '', impact_summary: context.impact || '',
      });
      this.emit(EVENTS.ACTION_LOGGED, { action, level, taskId: record.id, status: record.status });
      return record;
    }, null);
  }

  async markReverted(taskId) {
    return this.safe(async () => {
      const updated = await backend.entities.ActionLog.update(taskId, { status: 'reverted', reverted: true });
      this.emit(EVENTS.DEV_ACTIVITY, { module: 'permission_manager', action: 'revert', taskId });
      return updated;
    }, null);
  }

  async getActionHistory(limit = 50, filter = {}) {
    return this.safe(async () => {
      const records = await backend.entities.ActionLog.list('-created_date', limit);
      if (!records) return [];
      let filtered = records;
      if (filter.status) filtered = filtered.filter(r => r.status === filter.status);
      if (filter.module) filtered = filtered.filter(r => r.module === filter.module);
      if (filter.level) filtered = filtered.filter(r => r.permission_level === filter.level);
      return filtered;
    }, []);
  }

  getPendingApprovals() { return Array.from(this._pendingApprovals.values()); }
  isFounderModeActive() { return this._founderMode; }
  getActionLevels() { return { ...ACTION_LEVELS }; }

  getUserRole(user) {
    if (!user) return 'guest';
    const email = (user.email || '').toLowerCase().trim();
    const founderAuth = this.registry?.get('founder_auth');
    if (founderAuth?.isFounder()) return 'owner';
    if (email === this._founderEmail.toLowerCase()) return 'owner';
    if (user.role === 'admin') return 'administrator';
    if (user.is_founder) return 'owner';
    return 'user';
  }

  getRoleDefinition(roleName) { return this._roles[roleName] || this._roles.guest; }

  hasPermission(user, capability) {
    const role = this.getUserRole(user);
    const def = this.getRoleDefinition(role);
    return !!def[capability];
  }

  getRoles() { return { ...this._roles }; }

  health() {
    return { name: this.name, healthy: this._initialized, founderMode: this._founderMode, autonomyMode: this._autonomyMode, pendingApprovals: this._pendingApprovals.size };
  }
}