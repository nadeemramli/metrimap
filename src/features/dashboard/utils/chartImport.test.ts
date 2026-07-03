import { describe, expect, it } from 'vitest';
import { chartNodeToWidgetInput } from './chartImport';

const node = {
  id: 'node-1',
  projectId: 'proj-1',
  title: 'Node title',
  data: {
    chartType: 'bar',
    title: 'Revenue mix',
    seriesCardIds: ['c-arr', 'c-mrr'],
    showLegend: false,
  },
};

describe('chartNodeToWidgetInput', () => {
  it('maps chart config onto a card-sourced widget', () => {
    const input = chartNodeToWidgetInput(node, { sortIndex: 3, y: 16 });
    expect(input).toEqual({
      projectId: 'proj-1',
      title: 'Revenue mix',
      widgetType: 'bar',
      config: {
        source: 'card',
        cardIds: ['c-arr', 'c-mrr'],
        display: { showLegend: false },
        importedFromNodeId: 'node-1',
      },
      layout: { x: 0, y: 16, w: 6, h: 8 },
      sortIndex: 3,
    });
  });

  it('falls back to defaults for an unconfigured chart node', () => {
    const input = chartNodeToWidgetInput({
      id: 'node-2',
      projectId: 'proj-1',
      title: null,
      data: {},
    });
    expect(input.title).toBe('Chart');
    expect(input.widgetType).toBe('area');
    expect(input.config.cardIds).toEqual([]);
    expect(input.config.display?.showLegend).toBe(true);
    expect(input.layout.y).toBe(0);
    expect(input.sortIndex).toBe(0);
  });

  it('prefers the chart title over the node title', () => {
    const input = chartNodeToWidgetInput({
      ...node,
      data: { ...(node.data as object), title: undefined },
    });
    expect(input.title).toBe('Node title');
  });
});
