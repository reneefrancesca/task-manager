export const PRIORITY_TYPE = {
  LOW: "low",
  HIGH: "high",
  MEDIUM: "medium"
} as const;

export type PriorityType = typeof PRIORITY_TYPE[keyof typeof PRIORITY_TYPE];

export type TaskType = {
  id: number;
  title: string;
  completed: boolean;
  priority: PriorityType; 
};

export type TasksTypeProps = {
  tasks: TaskType[]
  onCompleteTask: (id: number) => void,
  onDeleteTask: (id: number) => void,
  getPriorityIndicator: (priority: PriorityType, completed: boolean) => string
}

export const SORTBY_TYPE = {
  PRIORITY: "priority",
  NAME: "name"
} as const;

export type SortByType = typeof SORTBY_TYPE[keyof typeof SORTBY_TYPE];