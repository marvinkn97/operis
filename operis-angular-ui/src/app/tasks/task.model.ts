export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

export type TaskRequest = {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;      
  assignedTo: string;
  projectId: string;
};

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;
  status: TaskStatus;
  completedAt?: string;
  projectId: string;
  isAssigned: boolean; // new property
}


export interface PagedTaskResponse {
  _embedded?: {
    taskResponseList: Task[]; // ✅ MUST match backend
  };
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  _links: any;
}
