export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progressPercentage: number;
  taskCount: number;
  memberCount: number;
  memberIds?: string[];
  ownerId: string; 
}
