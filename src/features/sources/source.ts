export interface DataSource {
  id: string;
  metricName: string;
  sourceSystem: string;
  eventName: string;
  actor: string;
  trigger: string;
  status: 'Planned' | 'Instrumented' | 'Needs QA' | 'Live';
  lastSync: string | null;
  dataQuality: number | null;
  recordsToday: number;
  owner: string;
  description: string;
  tags: string[];
  compliance: string[];
}

export interface ApiConnection {
  id: string;
  name: string;
  type: string;
  status: 'Connected' | 'Warning' | 'Disconnected';
  lastPing: string;
  responseTime: number | null;
  uptime: number;
  requestsToday: number;
  errorRate: number;
  version: string;
}

export interface GovernancePolicy {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Under Review' | 'Inactive';
  coverage: number;
  lastReview: string;
  nextReview: string;
  owner: string;
  compliance: string[];
}

export type TabType = 'sources' | 'apis' | 'governance' | 'monitoring';
export type StatusFilter =
  | 'all'
  | 'planned'
  | 'instrumented'
  | 'needs qa'
  | 'live'
  | 'connected'
  | 'warning'
  | 'disconnected'
  | 'active'
  | 'under review'
  | 'inactive';
