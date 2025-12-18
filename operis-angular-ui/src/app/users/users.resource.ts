import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UsersResource {
  private readonly baseUrl = 'http://localhost:32967/api/v1/users';

  constructor(private http: HttpClient) {}

  
  /**
   * GET /api/v1/users/me
   */
  getAuthenticatedUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }
}
