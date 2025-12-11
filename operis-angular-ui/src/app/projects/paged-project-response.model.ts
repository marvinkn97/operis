import { Project } from './project.model';

export interface PagedProjectResponse {
  _embedded?: {
    projectResponseList: Project[];
  };
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  _links: any;
}
