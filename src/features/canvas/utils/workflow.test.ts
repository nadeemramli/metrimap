import { describe, expect, it } from 'vitest';
import { extractCardWorkflow, normalizeWorkflowStatus } from './workflow';

describe('normalizeWorkflowStatus', () => {
  it('maps legacy PRD labels onto canonical statuses', () => {
    expect(normalizeWorkflowStatus('Planning')).toBe('planning');
    expect(normalizeWorkflowStatus('In Progress')).toBe('in_progress');
    expect(normalizeWorkflowStatus('Completed')).toBe('done');
    expect(normalizeWorkflowStatus('On Hold')).toBe('on_hold');
  });

  it('accepts canonical values and common variants', () => {
    expect(normalizeWorkflowStatus('in_progress')).toBe('in_progress');
    expect(normalizeWorkflowStatus('  on-hold ')).toBe('on_hold');
    expect(normalizeWorkflowStatus('validated')).toBe('done');
  });

  it('returns null for unknown or empty input', () => {
    expect(normalizeWorkflowStatus(undefined)).toBeNull();
    expect(normalizeWorkflowStatus(null)).toBeNull();
    expect(normalizeWorkflowStatus('')).toBeNull();
    expect(normalizeWorkflowStatus('someday')).toBeNull();
  });
});

describe('extractCardWorkflow', () => {
  it('keeps only workflow attributes, dropping empties', () => {
    const workflow = extractCardWorkflow({
      title: 'ignored',
      priority: 'High',
      dueDate: '2026-07-31',
      effort: 3,
      confidence: 'Medium',
      testable: true,
      assumptions: ['a'],
      successCriteria: [],
      businessImpact: '',
      stakeholders: undefined,
    });
    expect(workflow).toEqual({
      priority: 'High',
      dueDate: '2026-07-31',
      effort: 3,
      confidence: 'Medium',
      testable: true,
      assumptions: ['a'],
      successCriteria: [],
    });
  });

  it('returns an empty object for non-workflow data', () => {
    expect(extractCardWorkflow({ title: 'x', category: 'y' })).toEqual({});
  });
});
