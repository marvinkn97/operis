import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedTaskResponse, Task, TaskRequest } from './task.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskResource {
  private readonly baseUrl = environment.apiUrl + '/api/v1/tasks';

  constructor(private http: HttpClient) {}

  // Create a task
  createTask(task: TaskRequest): Observable<void> {
    return this.http.post<void>(this.baseUrl, task);
  }

  // Get tasks for a project
  getTasksByProject(projectId: string, page = 0, size = 10): Observable<PagedTaskResponse> {
    return this.http.get<PagedTaskResponse>(
      `${this.baseUrl}/projects/${projectId}?pageNumber=${page}&pageSize=${size}`,
    );
  }

  // Accept task assignment
  acceptTaskAssignment(taskId: string, actionId: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${taskId}/assignment/accept`, {
      actionId,
    });
  }

  // Reject task assignment
  rejectTaskAssignment(taskId: string, actionId: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${taskId}/assignment/reject`, {
      actionId,
    });
  }

  // task.resource.ts
getAssignedTasks(page = 0, size = 10): Observable<PagedTaskResponse> {
  return this.http.get<PagedTaskResponse>(
    `${this.baseUrl}/assigned?pageNumber=${page}&pageSize=${size}`
  );
}

// Mark task as completed
completeTask(taskId: string): Observable<void> {
  return this.http.patch<void>(`${this.baseUrl}/${taskId}/complete`, {});
}
}
