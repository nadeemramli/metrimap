import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { 
  ValueNode, 
  ActionNode, 
  HypothesisNode, 
  MetricNode,
  AnyNode 
} from '@/shared/types/nodeTypes';
import { 
  createNewNodeType,
  createValueNode,
  createActionNode,
  createHypothesisNode,
  createMetricNode
} from '@/shared/lib/supabase/services/newNodeTypes';
import { getClientForEnvironment } from '@/shared/utils/authenticatedClient';
import { useAppStore } from '@/shared/stores/useAppStore';

export interface NewNodeTypesStoreState {
  // State
  newNodes: AnyNode[];
  isLoading: boolean;
  error: string | undefined;

  // Actions
  setNewNodes: (nodes: AnyNode[]) => void;
  addNewNode: (node: AnyNode) => void;
  updateNewNode: (nodeId: string, updates: Partial<AnyNode>) => void;
  removeNewNode: (nodeId: string) => void;
  clearNewNodes: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | undefined) => void;

  // Async operations
  createNewNode: (
    nodeType: 'valueNode' | 'actionNode' | 'hypothesisNode' | 'metricNode',
    nodeData: Partial<AnyNode>,
    projectId: string
  ) => Promise<AnyNode>;
  
  // Individual node type creators
  createValueNodeAsync: (nodeData: Partial<ValueNode>, projectId: string) => Promise<ValueNode>;
  createActionNodeAsync: (nodeData: Partial<ActionNode>, projectId: string) => Promise<ActionNode>;
  createHypothesisNodeAsync: (nodeData: Partial<HypothesisNode>, projectId: string) => Promise<HypothesisNode>;
  createMetricNodeAsync: (nodeData: Partial<MetricNode>, projectId: string) => Promise<MetricNode>;
}

export const useNewNodeTypesStore = create<NewNodeTypesStoreState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    newNodes: [],
    isLoading: false,
    error: undefined,

    // Basic state management
    setNewNodes: (nodes) => set({ newNodes: nodes }),
    
    addNewNode: (node) => set((state) => ({ 
      newNodes: [...state.newNodes, node] 
    })),
    
    updateNewNode: (nodeId, updates) => set((state) => ({
      newNodes: state.newNodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    })),
    
    removeNewNode: (nodeId) => set((state) => ({
      newNodes: state.newNodes.filter(node => node.id !== nodeId)
    })),
    
    clearNewNodes: () => set({ newNodes: [] }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    // Unified node creation
    createNewNode: async (nodeType, nodeData, projectId) => {
      set({ isLoading: true, error: undefined });
      
      try {
        const { user } = useAppStore.getState();
        if (!user) throw new Error('User not authenticated');

        const client = getClientForEnvironment();
        
        // Create base node data with required fields
        const baseNodeData = {
          type: nodeType,
          projectId,
          title: nodeData.title || `New ${nodeType}`,
          description: nodeData.description || '',
          position: nodeData.position || { x: Math.random() * 400, y: Math.random() * 400 },
          tags: nodeData.tags || [],
          createdBy: user.id,
          ...nodeData
        } as Omit<AnyNode, 'id' | 'createdAt' | 'updatedAt'>;

        const newNode = await createNewNodeType(nodeType, baseNodeData, client);
        
        // Add to local state
        set(state => ({
          newNodes: [...state.newNodes, newNode],
          isLoading: false
        }));
        
        console.log(`✅ Created ${nodeType}: ${newNode.id} (${newNode.title})`);
        return newNode;
      } catch (error) {
        console.error(`❌ Error creating ${nodeType}:`, error);
        set({ 
          error: error instanceof Error ? error.message : `Failed to create ${nodeType}`,
          isLoading: false 
        });
        throw error;
      }
    },

    // Individual node type creators
    createValueNodeAsync: async (nodeData, projectId) => {
      set({ isLoading: true, error: undefined });
      
      try {
        const { user } = useAppStore.getState();
        if (!user) throw new Error('User not authenticated');

        const client = getClientForEnvironment();
        
        const valueNodeData: Omit<ValueNode, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'valueNode',
          projectId,
          title: nodeData.title || 'New Value Node',
          description: nodeData.description || '',
          valueType: nodeData.valueType || 'Journey Step',
          businessImpact: nodeData.businessImpact || 'Medium',
          stakeholders: nodeData.stakeholders || [],
          tags: nodeData.tags || [],
          position: nodeData.position || { x: Math.random() * 400, y: Math.random() * 400 },
          createdBy: user.id,
        };

        const newNode = await createValueNode(valueNodeData, client);
        
        // Add to local state
        set(state => ({
          newNodes: [...state.newNodes, newNode],
          isLoading: false
        }));
        
        console.log(`✅ Created value node: ${newNode.id} (${newNode.title})`);
        return newNode;
      } catch (error) {
        console.error('❌ Error creating value node:', error);
        set({ 
          error: error instanceof Error ? error.message : 'Failed to create value node',
          isLoading: false 
        });
        throw error;
      }
    },

    createActionNodeAsync: async (nodeData, projectId) => {
      set({ isLoading: true, error: undefined });
      
      try {
        const { user } = useAppStore.getState();
        if (!user) throw new Error('User not authenticated');

        const client = getClientForEnvironment();
        
        const actionNodeData: Omit<ActionNode, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'actionNode',
          projectId,
          title: nodeData.title || 'New Action Node',
          description: nodeData.description || '',
          actionType: nodeData.actionType || 'Initiative',
          status: nodeData.status || 'Planning',
          priority: nodeData.priority || 'Medium',
          assignee: nodeData.assignee,
          dueDate: nodeData.dueDate,
          effort: nodeData.effort || 0,
          tags: nodeData.tags || [],
          position: nodeData.position || { x: Math.random() * 400, y: Math.random() * 400 },
          createdBy: user.id,
        };

        const newNode = await createActionNode(actionNodeData, client);
        
        // Add to local state
        set(state => ({
          newNodes: [...state.newNodes, newNode],
          isLoading: false
        }));
        
        console.log(`✅ Created action node: ${newNode.id} (${newNode.title})`);
        return newNode;
      } catch (error) {
        console.error('❌ Error creating action node:', error);
        set({ 
          error: error instanceof Error ? error.message : 'Failed to create action node',
          isLoading: false 
        });
        throw error;
      }
    },

    createHypothesisNodeAsync: async (nodeData, projectId) => {
      set({ isLoading: true, error: undefined });
      
      try {
        const { user } = useAppStore.getState();
        if (!user) throw new Error('User not authenticated');

        const client = getClientForEnvironment();
        
        const hypothesisNodeData: Omit<HypothesisNode, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'hypothesisNode',
          projectId,
          title: nodeData.title || 'New Hypothesis Node',
          description: nodeData.description || '',
          hypothesisType: nodeData.hypothesisType || 'Factor',
          confidence: nodeData.confidence || 'Medium',
          testable: nodeData.testable || false,
          assumptions: nodeData.assumptions || [],
          successCriteria: nodeData.successCriteria || [],
          tags: nodeData.tags || [],
          position: nodeData.position || { x: Math.random() * 400, y: Math.random() * 400 },
          createdBy: user.id,
        };

        const newNode = await createHypothesisNode(hypothesisNodeData, client);
        
        // Add to local state
        set(state => ({
          newNodes: [...state.newNodes, newNode],
          isLoading: false
        }));
        
        console.log(`✅ Created hypothesis node: ${newNode.id} (${newNode.title})`);
        return newNode;
      } catch (error) {
        console.error('❌ Error creating hypothesis node:', error);
        set({ 
          error: error instanceof Error ? error.message : 'Failed to create hypothesis node',
          isLoading: false 
        });
        throw error;
      }
    },

    createMetricNodeAsync: async (nodeData, projectId) => {
      set({ isLoading: true, error: undefined });
      
      try {
        const { user } = useAppStore.getState();
        if (!user) throw new Error('User not authenticated');

        const client = getClientForEnvironment();
        
        const metricNodeData: Omit<MetricNode, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'metricNode',
          projectId,
          title: nodeData.title || 'New Metric Node',
          description: nodeData.description || '',
          metricType: nodeData.metricType || 'Output Metric',
          sourceNodeId: nodeData.sourceNodeId,
          unit: nodeData.unit || '',
          targetValue: nodeData.targetValue || 0,
          currentValue: nodeData.currentValue || 0,
          values: nodeData.values || [],
          formula: nodeData.formula,
          dimensions: nodeData.dimensions || [],
          segments: nodeData.segments || [],
          tags: nodeData.tags || [],
          position: nodeData.position || { x: Math.random() * 400, y: Math.random() * 400 },
          createdBy: user.id,
        };

        const newNode = await createMetricNode(metricNodeData, client);
        
        // Add to local state
        set(state => ({
          newNodes: [...state.newNodes, newNode],
          isLoading: false
        }));
        
        console.log(`✅ Created metric node: ${newNode.id} (${newNode.title})`);
        return newNode;
      } catch (error) {
        console.error('❌ Error creating metric node:', error);
        set({ 
          error: error instanceof Error ? error.message : 'Failed to create metric node',
          isLoading: false 
        });
        throw error;
      }
    },
  }))
);
