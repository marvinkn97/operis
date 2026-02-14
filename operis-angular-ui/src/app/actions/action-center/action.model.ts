export interface Action {
  id: string;
  type: ActionType;
  details: string;
  createdAt: string;
  metadata: string;
}

export enum ActionType {
  PROJECT_INVITATION = 'PROJECT_INVITATION',
  TASK_ASSIGNMENT = 'TASK_ASSIGNMENT',
}

export interface PagedCTAResponse {
  _embedded?: {
    callToActionResponseList: Action[];
  };
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  _links: any;
}