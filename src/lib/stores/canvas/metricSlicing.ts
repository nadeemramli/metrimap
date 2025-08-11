import type { MetricCard, Relationship } from '../../types';
import { generateUUID } from '../../utils/validation';

export interface MetricSliceOptions {
  parentCardId: string;
  dimensions: string[];
  historyOption: 'manual' | 'proportional' | 'forfeit';
  percentages?: number[];
}

export interface SliceResult {
  newCards: MetricCard[];
  newRelationships: Relationship[];
  updatedParentCard: MetricCard;
}

/**
 * Slice a metric card by dimensions, creating new cards for each dimension
 */
export async function sliceMetricByDimensions(
  canvas: any,
  options: MetricSliceOptions
): Promise<SliceResult> {
  const { parentCardId, dimensions, historyOption, percentages } = options;

  if (!canvas) {
    throw new Error('No canvas provided');
  }

  const parentCard = canvas.nodes.find(
    (node: MetricCard) => node.id === parentCardId
  );
  if (!parentCard) {
    throw new Error('Parent card not found');
  }

  // Validate percentages for proportional split
  if (historyOption === 'proportional') {
    if (!percentages || percentages.length !== dimensions.length) {
      throw new Error(
        'Percentages array must match dimensions array length for proportional split'
      );
    }
    const total = percentages.reduce((sum, p) => sum + p, 0);
    if (Math.abs(total - 100) > 0.001) {
      // Allow for floating point precision
      throw new Error('Percentages must sum to exactly 100%');
    }
  }

  // Helper function to calculate proportional data
  const calculateProportionalData = (parentData: any[], percentage: number) => {
    if (!parentData || parentData.length === 0) return [];

    return parentData.map((dataPoint) => ({
      ...dataPoint,
      value: (dataPoint.value * percentage) / 100,
      // Recalculate change_percent based on new values
      change_percent: dataPoint.change_percent, // Keep original for now, could be recalculated
    }));
  };

  // Create new dimension cards
  const newCards: MetricCard[] = [];
  const newRelationships: Relationship[] = [];

  dimensions.forEach((dimension, index) => {
    const newCardId = generateUUID();

    // Calculate data based on history option
    let cardData: any[] = [];
    if (historyOption === 'manual') {
      cardData = []; // Empty for manual entry
    } else if (
      historyOption === 'proportional' &&
      percentages &&
      parentCard.data
    ) {
      cardData = calculateProportionalData(parentCard.data, percentages[index]);
    } else if (historyOption === 'forfeit') {
      cardData = []; // Start fresh
    }

    const newCard: MetricCard = {
      id: newCardId,
      title: `${parentCard.title} (${dimension})`,
      description: `${dimension} component of ${parentCard.title}${
        historyOption === 'proportional' && percentages
          ? ` (${percentages[index]}% of original data)`
          : ''
      }`,
      category: 'Data/Metric',
      subCategory: parentCard.subCategory || 'Input Metric',
      tags: [...parentCard.tags, dimension],
      causalFactors: [],
      dimensions: parentCard.dimensions,
      position: {
        x:
          parentCard.position.x +
          (index - Math.floor(dimensions.length / 2)) * 350,
        y: parentCard.position.y + 200,
      },
      sourceType: historyOption === 'proportional' ? 'Manual' : 'Manual', // All start as manual, can be changed later
      data: cardData,
      assignees: parentCard.assignees,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    newCards.push(newCard);

    // Create relationship from dimension card to parent
    const relationshipId = generateUUID();
    const evidenceSummary =
      historyOption === 'proportional' && percentages
        ? `Created through dimension slice operation with proportional split (${percentages[index]}%). ${dimension} is a component of ${parentCard.title}.`
        : `Created through dimension slice operation. ${dimension} is a component of ${parentCard.title}.`;

    const newRelationship: Relationship = {
      id: relationshipId,
      sourceId: newCardId,
      targetId: parentCardId,
      type: 'Compositional', // As specified in PRD
      confidence: 'High',
      weight:
        historyOption === 'proportional' && percentages
          ? percentages[index] / 100
          : 1,
      evidence: [
        {
          id: generateUUID(),
          title: 'Automatic Dimension Decomposition',
          type: 'Analysis',
          date: new Date().toISOString(),
          owner: 'system',
          summary: evidenceSummary,
          impactOnConfidence:
            'This relationship was automatically generated during metric decomposition.',
          createdAt: new Date().toISOString(),
          createdBy: 'system',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    newRelationships.push(newRelationship);
  });

  // Generate formula for parent card
  const formulaReferences = newCards
    .map((card) => `[${card.id}].value`)
    .join(' + ');

  // Update parent card data based on history option
  let parentCardData = parentCard.data;
  let parentDescription = `${parentCard.description} (Calculated from: ${dimensions.join(', ')})`;

  if (historyOption === 'forfeit') {
    parentCardData = []; // Archive data, start fresh
    parentDescription += ' - Historical data archived';
  } else if (historyOption === 'proportional') {
    // Keep original data as the parent maintains its complete dataset
    parentDescription += ` - Data distributed proportionally: ${dimensions
      .map((d, i) => `${d}(${percentages?.[i] || 0}%)`)
      .join(', ')}`;
  } else {
    // Manual - keep original data
    parentDescription += ' - Original data maintained';
  }

  const updatedParentCard: MetricCard = {
    ...parentCard,
    sourceType: 'Calculated',
    formula: formulaReferences,
    description: parentDescription,
    data: parentCardData,
    updatedAt: new Date().toISOString(),
  };

  return {
    newCards,
    newRelationships,
    updatedParentCard,
  };
}
