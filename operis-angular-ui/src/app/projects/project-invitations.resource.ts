import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProjectInvitationRequest } from './project-invitation.request';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectInvitationsResource {
  constructor(private http: HttpClient) {}

  private readonly baseUrl = environment.apiUrl + '/api/v1/project-invitations';

  /**
   * Invite a user to a project
   */
  inviteUserToProject(request: ProjectInvitationRequest) {
    return this.http.post<void>(`${this.baseUrl}`, request);
  }

  acceptInvitation(invitationId: string, ctaId: string) {
    // send ctaId in request body
    return this.http.patch<void>(`${this.baseUrl}/${invitationId}/accept`, { ctaId });
  }

  rejectInvitation(invitationId: string, ctaId: string) {
    return this.http.patch<void>(`${this.baseUrl}/${invitationId}/reject`, { ctaId });
  }
}
