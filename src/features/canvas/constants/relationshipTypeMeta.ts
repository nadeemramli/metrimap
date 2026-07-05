/**
 * Canonical metadata for the four relationship types.
 *
 * SINGLE SOURCE OF TRUTH — every place that renders a relationship's icon,
 * label, color, stroke, or help text must read from here. Previously this
 * mapping was duplicated across DynamicEdge / ErasableDynamicEdge /
 * EnhancedEdgeButton / the relationship panel, and the copies drifted (e.g.
 * the panel showed `Zap` for Deterministic while the edge used `Zap` for
 * Causal). Keep it here and only here.
 *
 * The `tooltip` copy is kept in sync with docs/reference/metric-tree-methodology.md
 * (components vs. influences). It powers the in-app `(!)` InfoHint.
 */
import { ArrowRight, Layers, Network, TrendingUp, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ConfidenceLevel, RelationshipType } from '@/shared/types';

export type RelationshipLayer = 'component' | 'influence';

export interface RelationshipTypeMeta {
  value: RelationshipType;
  label: string;
  icon: LucideIcon;
  /** One-line summary (used as title attr / chip subtitle). */
  description: string;
  /** Long-form help shown in the `(!)` tooltip. Methodology-aligned. */
  tooltip: string;
  /** Which methodology layer this type belongs to. */
  layer: RelationshipLayer;
  /** Tailwind text color for the icon. */
  textColor: string;
  /** Chip styling (EnhancedEdgeButton). */
  bgColor: string;
  borderColor: string;
  hoverBg: string;
  /** Base stroke when weight does not drive the color. */
  baseStroke: string;
  /** If true, stroke color is derived from the weight's sign. */
  strokeByWeight: boolean;
  /** xyflow path style hint used by DynamicEdge. */
  lineStyle: 'smoothstep' | 'dotted' | 'solid' | 'dotted-smoothstep';
  /** Whether the mid-edge numeric weight button is shown. */
  showWeightButton: boolean;
  /** Default button label when weight is undefined. */
  defaultWeightLabel: string;
}

const GRAY = '#6b7280';

export const RELATIONSHIP_TYPE_META: Record<
  RelationshipType,
  RelationshipTypeMeta
> = {
  Deterministic: {
    value: 'Deterministic',
    label: 'Deterministic',
    icon: ArrowRight,
    description: 'Formulaic, exact — true by definition',
    tooltip:
      'A component relationship: a mathematical identity that holds by definition (e.g. Revenue = Customers × ASP). Use it for the structural skeleton of the tree where the link is exact and always true.',
    layer: 'component',
    textColor: 'text-gray-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    hoverBg: 'hover:bg-blue-100',
    baseStroke: GRAY,
    strokeByWeight: false,
    lineStyle: 'smoothstep',
    showWeightButton: true,
    defaultWeightLabel: '1.0',
  },
  Probabilistic: {
    value: 'Probabilistic',
    label: 'Probabilistic',
    icon: TrendingUp,
    description: 'Statistical correlation — observed, not guaranteed',
    tooltip:
      'An influence relationship backed by a statistical correlation rather than a definition. The link is empirical and may change over time. Weight encodes the strength/sign of the correlation.',
    layer: 'influence',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    hoverBg: 'hover:bg-orange-100',
    baseStroke: GRAY,
    strokeByWeight: true,
    lineStyle: 'dotted',
    showWeightButton: true,
    defaultWeightLabel: '0.0',
  },
  Causal: {
    value: 'Causal',
    label: 'Causal',
    icon: Zap,
    description: 'Proven causal influence — a validated lever',
    tooltip:
      'An influence relationship promoted to causal: a validated lever (e.g. via experiment) where moving the input is shown to move the output. These are the levers operators pull.',
    layer: 'influence',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    hoverBg: 'hover:bg-purple-100',
    baseStroke: GRAY,
    strokeByWeight: true,
    lineStyle: 'solid',
    showWeightButton: true,
    defaultWeightLabel: '0.0',
  },
  Compositional: {
    value: 'Compositional',
    label: 'Compositional',
    icon: Layers,
    description: 'Part-of / hierarchical decomposition',
    tooltip:
      'A component relationship expressing part-of / hierarchy: this metric composes its parent (a breakdown rather than an arithmetic identity). Structural, so no weight is needed.',
    layer: 'component',
    textColor: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    hoverBg: 'hover:bg-gray-100',
    baseStroke: GRAY,
    strokeByWeight: false,
    lineStyle: 'dotted-smoothstep',
    showWeightButton: false,
    defaultWeightLabel: '1.0',
  },
};

/** Fallback used when a relationship has an unknown/empty type. */
export const UNKNOWN_RELATIONSHIP_META: RelationshipTypeMeta = {
  value: 'Deterministic',
  label: 'Unknown',
  icon: Network,
  description: 'Undefined relationship',
  tooltip: 'This relationship has no recognized type.',
  layer: 'component',
  textColor: 'text-gray-600',
  bgColor: 'bg-gray-50',
  borderColor: 'border-gray-300',
  hoverBg: 'hover:bg-gray-100',
  baseStroke: GRAY,
  strokeByWeight: false,
  lineStyle: 'solid',
  showWeightButton: false,
  defaultWeightLabel: '1.0',
};

/** Ordered list for pickers / legends. */
export const RELATIONSHIP_TYPE_LIST: RelationshipTypeMeta[] = [
  RELATIONSHIP_TYPE_META.Deterministic,
  RELATIONSHIP_TYPE_META.Probabilistic,
  RELATIONSHIP_TYPE_META.Causal,
  RELATIONSHIP_TYPE_META.Compositional,
];

export function getRelationshipTypeMeta(
  type: RelationshipType | string | undefined
): RelationshipTypeMeta {
  if (type && type in RELATIONSHIP_TYPE_META) {
    return RELATIONSHIP_TYPE_META[type as RelationshipType];
  }
  return UNKNOWN_RELATIONSHIP_META;
}

// ---------------------------------------------------------------------------
// Dynamic edge visual intelligence (CVS-165)
// The drawn line encodes relationship QUALITY: signed strength → colour +
// direction, magnitude → width, confidence → opacity + "loose" dash. Negative
// and weak/low-correlation links warn (red / amber) instead of reading like a
// healthy green link; low-confidence links look loose, not validated.
// ---------------------------------------------------------------------------

/** Semantic read of a relationship's drawn line, for badges/legends too. */
export type RelationshipTone =
  | 'positive' // strong, healthy positive influence (green)
  | 'negative' // inverse relationship — warns (red)
  | 'weak' // weak / low correlation — warns (amber)
  | 'neutral' // unknown / exploratory, no strength yet (gray)
  | 'structural'; // deterministic / compositional — definitional (gray)

export interface RelationshipEdgeStyle {
  stroke: string;
  strokeWidth: number;
  /** SVG dasharray, or undefined for a solid line. */
  strokeDasharray: string | undefined;
  opacity: number;
  tone: RelationshipTone;
  /** True when the line should read as loose/exploratory (dashed + dim). */
  loose: boolean;
}

// Semantic edge palette (hex — SVG stroke is inline, not a Tailwind class).
const EDGE_COLORS = {
  positiveStrong: '#16a34a', // green-600
  positive: '#22c55e', // green-500
  negative: '#dc2626', // red-600  — inverse relationships warn
  weak: '#d97706', // amber-600 — weak / low correlation warns
  neutral: '#9ca3af', // gray-400 — exploratory / unknown
  structural: GRAY, // gray-500 — deterministic / compositional
};

/** |weight| below this reads as a weak/uncertain signal; above STRONG_MIN as strong. */
const WEAK_MAX = 20;
const STRONG_MIN = 50;

/**
 * The full drawn-line style for a relationship edge, derived from signed
 * strength + confidence + type. Single source of truth for the canvas edge,
 * the arrowhead colour, and any legend.
 */
export function getRelationshipEdgeStyle(
  type: RelationshipType | string | undefined,
  weight?: number,
  confidence?: ConfidenceLevel | string
): RelationshipEdgeStyle {
  const meta = getRelationshipTypeMeta(type);

  // Structural types are definitional — not coloured by statistical strength.
  if (!meta.strokeByWeight) {
    const dotted =
      meta.lineStyle === 'dotted' || meta.lineStyle === 'dotted-smoothstep';
    return {
      stroke: EDGE_COLORS.structural,
      strokeWidth: 2,
      strokeDasharray: dotted ? '6,4' : undefined,
      opacity: 0.9,
      tone: 'structural',
      loose: false,
    };
  }

  const conf: ConfidenceLevel =
    confidence === 'High' || confidence === 'Low' ? confidence : 'Medium';
  const w = typeof weight === 'number' ? weight : 0;
  const mag = Math.min(Math.abs(w), 100);

  let tone: RelationshipTone;
  let stroke: string;
  if (w === 0) {
    tone = 'neutral';
    stroke = EDGE_COLORS.neutral;
  } else if (w < 0) {
    tone = 'negative';
    stroke = EDGE_COLORS.negative;
  } else if (mag < WEAK_MAX) {
    tone = 'weak';
    stroke = EDGE_COLORS.weak;
  } else {
    tone = 'positive';
    stroke = mag >= STRONG_MIN ? EDGE_COLORS.positiveStrong : EDGE_COLORS.positive;
  }

  // Strength drives width (thicker = stronger); low confidence thins it.
  const base = 1.5 + (mag / 100) * 2; // 1.5 .. 3.5
  const strokeWidth = Number(
    (conf === 'Low' ? Math.max(1.25, base - 0.75) : base).toFixed(2)
  );

  // Loose read: low confidence or unknown strength; observed (dotted) types
  // like Probabilistic correlation are dashed regardless.
  const dottedType =
    meta.lineStyle === 'dotted' || meta.lineStyle === 'dotted-smoothstep';
  const loose = conf === 'Low' || tone === 'neutral';
  const dashed = loose || dottedType;
  const opacity = conf === 'High' ? 1 : conf === 'Low' ? 0.5 : 0.8;

  return {
    stroke,
    strokeWidth,
    strokeDasharray: dashed ? (conf === 'Low' ? '4,4' : '6,4') : undefined,
    opacity,
    tone,
    loose,
  };
}

/** Resolve the stroke color for an edge given its type + weight (+ optional confidence). */
export function getRelationshipStroke(
  type: RelationshipType | string | undefined,
  weight?: number,
  confidence?: ConfidenceLevel | string
): string {
  return getRelationshipEdgeStyle(type, weight, confidence).stroke;
}

/** Resolve the mid-edge weight button label. */
export function getRelationshipWeightLabel(
  type: RelationshipType | string | undefined,
  weight?: number
): string {
  const meta = getRelationshipTypeMeta(type);
  // Truthy check matches prior edge behavior (weight 0 falls back to default).
  return weight ? `${weight}` : meta.defaultWeightLabel;
}
