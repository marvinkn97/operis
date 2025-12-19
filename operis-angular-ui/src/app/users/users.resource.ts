import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { NameUpdateRequest } from './name-update.request';
import { PasswordUpdateRequest } from './password-update.request';

@Injectable({ providedIn: 'root' })
export class UsersResource {
  private readonly baseUrl = 'http://localhost:33465/api/v1/users';

  constructor(private http: HttpClient) {}

  
  /**
   * GET /api/v1/users/me
   */
  getAuthenticatedUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }

    /** PUT /me/name */
  updateMyName(request: NameUpdateRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/me/name`, request);
  }

  /** PUT /me/password */
  updateMyPassword(request: PasswordUpdateRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/me/password`, request);
  }
}
