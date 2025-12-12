export interface Action {
  id: string;
  type: ActionType;
  details: string;
  from: string;
  time: string; // e.g., "5 minutes ago"
}

export enum ActionType {
  PROJECT_INVITATION = 'Project Invitation',
  TASK_ASSIGNMENT = 'Task Assignment',
}

