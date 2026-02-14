import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Action, PagedCTAResponse, ActionType } from './action-center/action.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ActionCenterService {
  private readonly http = inject(HttpClient);
    private readonly baseUrl =  environment.apiUrl + '/api/v1/call-to-actions';

  getActions(page: number, size: number): Observable<{ actions: Action[]; hasMore: boolean }> {
    const params = new HttpParams()
      .set('pageNumber', page)
      .set('pageSize', size);

    return this.http.get<PagedCTAResponse>(this.baseUrl, { params }).pipe(
      map((res) => {
        const content = res._embedded?.callToActionResponseList ?? [];

        const actions = content.map((cta) => this.toUiAction(cta));
        const hasMore = (res.page?.number ?? 0) + 1 < (res.page?.totalPages ?? 0);

        return { actions, hasMore };
      })
    );
  }

 private toUiAction(cta: Action): Action {
  const metadata = this.parseMetadata(cta.metadata);

  return {
    ...cta,
    details: this.resolveDetails(cta.type, metadata), // use parsed metadata
    createdAt: this.resolveTime(cta.createdAt), // backend sends createdAt
  };
}


  private parseMetadata(metadata: string): any {
    if (!metadata) return {};
    try {
      return JSON.parse(metadata);
    } catch {
      return {};
    }
  }

  private resolveDetails(type: ActionType, metadata: any): string {
    switch (type) {
      case ActionType.PROJECT_INVITATION:
        return `You were invited to project "${metadata.projectName}"`;
      case ActionType.TASK_ASSIGNMENT:
        return `You were assigned a task by ${metadata.assignedBy}`;
      default:
        return 'You have a new action';
    }
  }

  private resolveTime(createdAt: string | undefined): string {
    if (!createdAt) return 'Recently';

    const date = new Date(createdAt);
    const diffMs = Date.now() - date.getTime();
    const minutes = Math.floor(diffMs / 60000);

    switch (true) {
      case minutes < 1:
        return 'Just now';
      case minutes < 60:
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      case minutes < 1440:
        const hours = Math.floor(minutes / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      default:
        const days = Math.floor(minutes / 1440);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }
}
