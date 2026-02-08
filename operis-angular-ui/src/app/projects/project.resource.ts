import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Project } from './project.model';
import { PagedProjectResponse } from './paged-project-response.model';
import { ProjectRequest } from './project.request';
import { ProjectUpdateRequest } from './project-update.request';
import { ProjectInvitationRequest } from './project-invitation.request';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectResource {
  constructor(private http: HttpClient) {}

  private readonly baseUrl =  environment.apiUrl + '/api/v1/projects';

  projects = signal<Project[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  hasMore = signal(true); // to track if more pages exist

  private currentPage = 0;
  private pageSize = 10;

  fetchProjects(pageNumber?: number, pageSize?: number) {
    if (this.loading()) return; // prevent multiple requests
    this.loading.set(true);
    this.error.set(null);

    const page = pageNumber ?? this.currentPage;
    const size = pageSize ?? this.pageSize;

    const params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', size.toString());

    this.http.get<PagedProjectResponse>(this.baseUrl, { params }).subscribe({
      next: (data) => {
        const items = data?._embedded?.projectResponseList ?? [];

        if (items.length < size) this.hasMore.set(false); // no more pages
        this.projects.set([...this.projects(), ...items]); // append new data
        this.currentPage = page + 1; // increment for next fetch
        this.loading.set(false);
      },
      error: (err) => {
        console.log('Error loading projects', err);
        this.error.set(err.message || 'Error loading projects');
        this.loading.set(false);
      },
    });
  }

  reset() {
    this.projects.set([]);
    this.currentPage = 0;
    this.hasMore.set(true);
  }

  createProject(project: ProjectRequest) {
    return this.http.post<void>(this.baseUrl, project);
  }

  updateProject(id: string, project: ProjectUpdateRequest) {
    return this.http.put<void>(`${this.baseUrl}/${id}`, project);
  }

  deleteProject(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getProjectById(id: string) {
    return this.http.get<Project>(`${this.baseUrl}/${id}`);
  }

  markProjectCompleted(id: string) {
    return this.http.patch<void>(`${this.baseUrl}/${id}/close`, {});
  }

  /**
   * Invite a user to a project
   */
  inviteUserToProject(projectId: string, request: ProjectInvitationRequest) {
    return this.http.post<void>(`${this.baseUrl}/${projectId}/invitations`, request);
  }
}
