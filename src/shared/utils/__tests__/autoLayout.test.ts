import { describe, it, expect, beforeEach } from 'vitest';
import type { Node, Edge } from '@xyflow/react';
import { 
  applyAutoLayout, 
  applyAutoLayoutWithValidation, 
  validateLayoutResult,
  type LayoutDirection 
} from '../autoLayout';

describe('autoLayout', () => {
  let mockNodes: Node[];
  let mockEdges: Edge[];

  beforeEach(() => {
    mockNodes = [
      {
        id: '1',
        type: 'metricCard',
        position: { x: 0, y: 0 },
        data: { label: 'Node 1' }
      },
      {
        id: '2',
        type: 'metricCard',
        position: { x: 100, y: 100 },
        data: { label: 'Node 2' }
      },
      {
        id: '3',
        type: 'metricCard',
        position: { x: 200, y: 200 },
        data: { label: 'Node 3' }
      }
    ];

    mockEdges = [
      {
        id: 'e1-2',
        source: '1',
        target: '2'
      },
      {
        id: 'e2-3',
        source: '2',
        target: '3'
      }
    ];
  });

  describe('applyAutoLayout', () => {
    it('should return empty array for empty nodes', () => {
      const result = applyAutoLayout([], []);
      expect(result).toEqual([]);
    });

    it('should return original nodes for invalid input', () => {
      const result = applyAutoLayout(null as any, null as any);
      expect(result).toEqual(null);
    });

    it('should apply layout for valid nodes and edges', () => {
      const result = applyAutoLayout(mockNodes, mockEdges);
      
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
      expect(result[2].id).toBe('3');
      
      // Positions should be different from original
      expect(result[0].position).not.toEqual(mockNodes[0].position);
      expect(result[1].position).not.toEqual(mockNodes[1].position);
      expect(result[2].position).not.toEqual(mockNodes[2].position);
      
      // Positions should be valid numbers
      result.forEach(node => {
        expect(typeof node.position.x).toBe('number');
        expect(typeof node.position.y).toBe('number');
        expect(isNaN(node.position.x)).toBe(false);
        expect(isNaN(node.position.y)).toBe(false);
      });
    });

    it('should handle different layout directions', () => {
      const directions: LayoutDirection[] = ['TB', 'BT', 'LR', 'RL'];
      
      directions.forEach(direction => {
        const result = applyAutoLayout(mockNodes, mockEdges, { direction });
        expect(result).toHaveLength(3);
        
        result.forEach(node => {
          expect(isNaN(node.position.x)).toBe(false);
          expect(isNaN(node.position.y)).toBe(false);
        });
      });
    });

    it('should handle nodes without edges', () => {
      const result = applyAutoLayout(mockNodes, []);
      expect(result).toHaveLength(3);
      
      result.forEach(node => {
        expect(isNaN(node.position.x)).toBe(false);
        expect(isNaN(node.position.y)).toBe(false);
      });
    });

    it('should handle edges with missing nodes gracefully', () => {
      const invalidEdges = [
        { id: 'e1-missing', source: '1', target: 'missing' },
        { id: 'e-missing-2', source: 'missing', target: '2' }
      ];
      
      const result = applyAutoLayout(mockNodes, invalidEdges);
      expect(result).toHaveLength(3);
    });
  });

  describe('validateLayoutResult', () => {
    it('should validate successful layout', () => {
      const layoutedNodes = applyAutoLayout(mockNodes, mockEdges);
      const validation = validateLayoutResult(mockNodes, layoutedNodes);
      
      expect(validation.isValid).toBe(true);
      expect(validation.issues).toHaveLength(0);
    });

    it('should detect missing nodes', () => {
      const incompleteNodes = mockNodes.slice(0, 2); // Missing one node
      const validation = validateLayoutResult(mockNodes, incompleteNodes);
      
      expect(validation.isValid).toBe(false);
      expect(validation.issues.some(issue => issue.includes('Node count mismatch'))).toBe(true);
    });

    it('should detect invalid positions', () => {
      const invalidNodes = mockNodes.map(node => ({
        ...node,
        position: { x: NaN, y: NaN }
      }));
      
      const validation = validateLayoutResult(mockNodes, invalidNodes);
      
      expect(validation.isValid).toBe(false);
      expect(validation.issues.some(issue => issue.includes('Invalid position'))).toBe(true);
    });
  });

  describe('applyAutoLayoutWithValidation', () => {
    it('should return both nodes and validation', () => {
      const result = applyAutoLayoutWithValidation(mockNodes, mockEdges);
      
      expect(result.nodes).toHaveLength(3);
      expect(result.validation).toBeDefined();
      expect(result.validation.isValid).toBe(true);
    });

    it('should handle errors gracefully', () => {
      const result = applyAutoLayoutWithValidation(null as any, null as any);
      
      expect(result.nodes).toBe(null);
      expect(result.validation).toBeDefined();
    });
  });
});
