export interface Timer {
    id: string;
    name: string;
    duration: number;
    remainingTime: number;
    category: string;
    status: 'idle' | 'running' | 'paused' | 'completed';
    halfwayAlert: boolean;
    halfwayAlertTriggered: boolean;
    createdAt: number;
  }
  
  export interface HistoryItem {
    id: string;
    name: string;
    category: string;
    duration: number;
    completedAt: string;
  }
  
  export interface CategoryGroup {
    [category: string]: Timer[];
  }