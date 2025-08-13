/**
 * Relationship Panel Constants
 * Shared constants and type definitions for relationship management
 */

import type { RelationshipType } from '@/shared/types';
import {
  BarChart3,
  BookOpen,
  FileText,
  FlaskConical,
  Globe,
  Layers,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

export const relationshipTypeOptions: Array<{
  value: RelationshipType;
  label: string;
  description: string;
  icon: any;
}> = [
  {
    value: 'Deterministic',
    label: 'Deterministic',
    description: 'Direct causal relationship with predictable outcomes',
    icon: Zap,
  },
  {
    value: 'Probabilistic',
    label: 'Probabilistic',
    description: 'Statistical correlation with probabilistic outcomes',
    icon: TrendingUp,
  },
  {
    value: 'Causal',
    label: 'Causal',
    description: 'Proven causal influence through experimentation',
    icon: BarChart3,
  },
  {
    value: 'Compositional',
    label: 'Compositional',
    description: 'Part-of or hierarchical relationship',
    icon: Layers,
  },
];

export const evidenceTypeOptions = [
  {
    value: 'Experiment',
    icon: FlaskConical,
    color: 'bg-blue-50 text-blue-700',
  },
  {
    value: 'Analysis',
    icon: FileText,
    color: 'bg-green-50 text-green-700',
  },
  {
    value: 'Notebook',
    icon: BookOpen,
    color: 'bg-purple-50 text-purple-700',
  },
  {
    value: 'External Research',
    icon: Globe,
    color: 'bg-orange-50 text-orange-700',
  },
  {
    value: 'User Interview',
    icon: Users,
    color: 'bg-pink-50 text-pink-700',
  },
];

export const defaultCausalChecklist = [
  {
    id: 'temporal-order',
    question: 'Does the cause precede the effect in time?',
    description: 'Temporal precedence is essential for causality',
    checked: false,
    required: true,
  },
  {
    id: 'covariation',
    question: 'Do the cause and effect covary?',
    description: 'Statistical relationship between variables',
    checked: false,
    required: true,
  },
  {
    id: 'alternative-explanations',
    question: 'Have alternative explanations been ruled out?',
    description: 'Controls for confounding variables',
    checked: false,
    required: true,
  },
  {
    id: 'dose-response',
    question: 'Is there a dose-response relationship?',
    description: 'Stronger cause leads to stronger effect',
    checked: false,
    required: false,
  },
  {
    id: 'replication',
    question: 'Has the relationship been replicated?',
    description: 'Consistent findings across studies',
    checked: false,
    required: false,
  },
  {
    id: 'plausibility',
    question: 'Is the relationship biologically/theoretically plausible?',
    description: 'Consistent with existing knowledge',
    checked: false,
    required: false,
  },
];

// Helper function to get evidence type color
export function getTypeColor(type: string): string {
  const option = evidenceTypeOptions.find((opt) => opt.value === type);
  return option?.color || 'bg-gray-50 text-gray-700';
}

// Helper function to get relationship type icon
export function getRelationshipTypeIcon(type: RelationshipType) {
  const option = relationshipTypeOptions.find((opt) => opt.value === type);
  return option?.icon || Zap;
}

// Helper function to get evidence type icon
export function getEvidenceTypeIcon(type: string) {
  const option = evidenceTypeOptions.find((opt) => opt.value === type);
  return option?.icon || FileText;
}
