/**
 * Node Settings Router
 * Routes to the appropriate settings panel based on node type
 */

import { memo } from 'react';
import type { AnyNode, NodeType } from '@/shared/types';
import {
  ValueNodeSettings,
  ActionNodeSettings,
  HypothesisNodeSettings,
  MetricNodeSettings,
} from './node-settings';

interface NodeSettingsRouterProps {
  node: AnyNode | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (nodeId: string, updatedData: Partial<AnyNode>) => void;
}

const NodeSettingsRouter = memo(({ node, isOpen, onClose, onSave }: NodeSettingsRouterProps) => {
  if (!node || !isOpen) return null;

  const handleSave = (updatedData: Partial<AnyNode>) => {
    onSave(node.id, updatedData);
  };

  // Route to appropriate settings panel based on node type
  switch (node.type) {
    case 'valueNode':
      return (
        <ValueNodeSettings
          node={node as any}
          isOpen={isOpen}
          onClose={onClose}
          onSave={handleSave}
        />
      );

    case 'actionNode':
      return (
        <ActionNodeSettings
          node={node as any}
          isOpen={isOpen}
          onClose={onClose}
          onSave={handleSave}
        />
      );

    case 'hypothesisNode':
      return (
        <HypothesisNodeSettings
          node={node as any}
          isOpen={isOpen}
          onClose={onClose}
          onSave={handleSave}
        />
      );

    case 'metricNode':
      return (
        <MetricNodeSettings
          node={node as any}
          isOpen={isOpen}
          onClose={onClose}
          onSave={handleSave}
        />
      );

    // For legacy and other node types, return null for now
    // These can be handled by existing settings panels
    case 'metricCard':
    case 'evidenceNode':
    case 'sourceNode':
    case 'chartNode':
    case 'operatorNode':
    case 'commentNode':
    case 'whiteboardNode':
    case 'groupNode':
    default:
      console.log(`No settings panel available for node type: ${node.type}`);
      return null;
  }
});

NodeSettingsRouter.displayName = 'NodeSettingsRouter';

export default NodeSettingsRouter;
