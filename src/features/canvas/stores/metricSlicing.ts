import type { CanvasProject, MetricCard, Relationship } from '@/shared/types';
import { generateUUID } from '@/shared/utils/validation';

export type MetricSliceOptions = {
  parentCardId: string;
  dimensions: string[];
  historyOption: 'manual' | 'proportional' | 'forfeit';
  percentages?: number[];
};

export function sliceMetricByDimensions(
  canvas: CanvasProject,
  { parentCardId, dimensions, historyOption, percentages }: MetricSliceOptions
): {
  updatedParentCard: MetricCard;
  newCards: MetricCard[];
  newRelationships: Relationship[];
} {
  const parent = canvas.nodes.find((n) => n.id === parentCardId);
  if (!parent) {
    throw new Error('Parent card not found');
  }

  const newCards: MetricCard[] = [];
  const newRelationships: Relationship[] = [];

  dimensions.forEach((dim, idx) => {
    const id = generateUUID();
    const card: MetricCard = {
      ...parent,
      id,
      title: `${parent.title} (${dim})`,
      tags: [...(parent.tags || []), dim],
      position: {
        x: parent.position.x + (idx - Math.floor(dimensions.length / 2)) * 280,
        y: parent.position.y + 180,
      },
      data:
        historyOption === 'proportional' &&
        Array.isArray(percentages) &&
        parent.data
          ? parent.data.map((d: any) => ({
              ...d,
              value: (d.value * (percentages[idx] || 0)) / 100,
            }))
          : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    newCards.push(card);

    const rel: Relationship = {
      id: generateUUID(),
      sourceId: id,
      targetId: parentCardId,
      type: 'Compositional',
      confidence: 'High',
      weight:
        historyOption === 'proportional' && Array.isArray(percentages)
          ? (percentages[idx] || 0) / 100
          : 1,
      evidence: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    newRelationships.push(rel);
  });

  const updatedParentCard: MetricCard = {
    ...parent,
    sourceType: 'Calculated',
    formula: dimensions.map((_, i) => `[${newCards[i].id}].value`).join(' + '),
    updatedAt: new Date().toISOString(),
  };

  return { updatedParentCard, newCards, newRelationships };
}
