import { User } from "./user.model";

export interface PagedUserResponse {
  _embedded?: {
    userResponseList: User[];
  };
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  _links: any;
}