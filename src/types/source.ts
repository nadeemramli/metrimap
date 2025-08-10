export interface DataSource {
  id: string;
  name: string;
  system: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  quality: 'high' | 'medium' | 'low';
  recordsToday: number;
  lastSync: string;
  description?: string;
}

export interface ApiConnection {
  id: string;
  name: string;
  endpoint: string;
  status: 'active' | 'inactive' | 'error';
  method: string;
  responseTime: number;
  successRate: number;
  lastCall: string;
  rateLimit?: string;
}

export interface GovernancePolicy {
  id: string;
  name: string;
  type: 'privacy' | 'security' | 'compliance' | 'quality';
  status: 'active' | 'draft' | 'archived';
  lastReview: string;
  owner: string;
  description?: string;
}

export type TabType = 'sources' | 'apis' | 'governance' | 'monitoring';
export type StatusFilter =
  | 'all'
  | 'connected'
  | 'disconnected'
  | 'syncing'
  | 'error'
  | 'active'
  | 'inactive'
  | 'draft'
  | 'archived';
