export interface RoadmapItem {
  id: string;
  name: string;
  description?: string;
  acceptanceCriteria?: string;
  start?: Date;
  end?: Date;
  pd?: string;
  cost?: string;
  goalId?: string; // For Type 2 grouping
}

export interface RoadmapGoal {
  id: string;
  name: string;
  items: RoadmapItem[];
}

export type RoadmapData = {
  goals: RoadmapGoal[]; // For Type 2, goals with items. For Type 1, a single "default" goal or flat list.
  ungroupedItems: RoadmapItem[]; // For Type 1 or items without goals
};

export interface ExcelRowType1 {
  ID: string | number;
  Name: string;
  Description?: string;
  "Acceptance Criteria"?: string;
  Start?: string | number | Date;
  End?: string | number | Date;
  PD?: string | number;
  Cost?: string | number;
}

export interface ExcelRowType2 extends ExcelRowType1 {
  Goal?: string;
}
