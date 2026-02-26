import { Component, HostListener, signal } from '@angular/core';
import { Action, ActionType } from '../../actions/action-center/action.model';
import { ActionCenterService } from '../cta.resource';
import { ProjectInvitationsResource } from '../../projects/project-invitations.resource';
import { TaskResource } from '../../tasks/task.resource';

@Component({
  selector: 'app-action-center',
  standalone: true,
  template: `
    <div class="min-h-screen bg-[#fafafa] pt-24 pb-12 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="mb-10">
          <h1 class="text-4xl font-black text-slate-900 tracking-tight">Action Center</h1>
          <p class="text-slate-500 mt-2 font-medium">
            You have
            <span class="text-slate-900 font-bold underline decoration-emerald-500/30"
              >{{ actions().length }} pending</span
            >
            items requiring authorization.
          </p>
        </div>

        <div
          class="hidden sm:grid grid-cols-[140px_1fr_120px_240px] gap-6 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] mb-4 shadow-xl shadow-slate-900/10"
        >
          <span>Request Type</span>
          <span>Authorization Details</span>
          <span class="text-center">Timestamp</span>
          <span class="text-right">Command</span>
        </div>

        <div class="space-y-3">
          @for (action of actions(); track action.id) {
            <div
              class="group bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div class="flex flex-col gap-4 sm:hidden">
                <div class="flex items-center justify-between">
                  <span
                    class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border"
                    [class]="ActionTypeColors[action.type]"
                  >
                    {{ action.type.replace('_', ' ') }}
                  </span>
                  <span class="text-[10px] font-bold text-slate-400 font-mono">{{
                    action.createdAt
                  }}</span>
                </div>
                <p class="text-slate-700 text-sm font-medium leading-relaxed">
                  {{ action.details }}
                </p>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    (click)="viewAction(action)"
                    class="py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition"
                  >
                    View
                  </button>
                  <button
                    (click)="acceptAction(action)"
                    class="py-2.5 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                  >
                    Accept
                  </button>
                  <button
                    (click)="rejectAction(action)"
                    class="py-2.5 rounded-xl bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest"
                  >
                    Reject
                  </button>
                </div>
              </div>

              <div class="hidden sm:grid grid-cols-[140px_1fr_120px_240px] gap-6 items-center">
                <div class="shrink-0">
                  <span
                    class="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border block text-center"
                    [class]="ActionTypeColors[action.type]"
                  >
                    {{ action.type.replace('_', ' ') }}
                  </span>
                </div>

                <div class="min-w-0">
                  <p class="text-sm font-bold text-slate-800 truncate" [title]="action.details">
                    {{ action.details }}
                  </p>
                </div>

                <div class="text-[11px] font-mono text-slate-400 text-center uppercase">
                  {{ action.createdAt }}
                </div>

                <div class="flex gap-2 justify-end">
                  <button
                    (click)="viewAction(action)"
                    class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition"
                  >
                    Details
                  </button>
                  <button
                    (click)="rejectAction(action)"
                    class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition"
                  >
                    Reject
                  </button>
                  <button
                    (click)="acceptAction(action)"
                    class="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition shadow-lg shadow-slate-900/10"
                  >
                    Authorize
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        @if (!loading() && actions().length === 0) {
          <div class="mt-16 text-center py-20 border-2 border-dashed border-slate-200 rounded-4xl">
            <div
              class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
            >
              ⚡
            </div>
            <p class="text-lg font-black text-slate-900 tracking-tight">
              System Fully Synchronized
            </p>
            <p class="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">
              No pending authorizations
            </p>
          </div>
        }

        @if (successMessage()) {
          <div
            class="fixed bottom-8 right-8 z-200 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold animate-in slide-in-from-right duration-300"
          >
            {{ successMessage() }}
          </div>
        }
        @if (errorMessage()) {
          <div
            class="fixed bottom-8 right-8 z-200 bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold animate-in slide-in-from-right duration-300"
          >
            {{ errorMessage() }}
          </div>
        }
      </div>
    </div>

    @if (showModal() && selectedAction) {
      <div
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-100 p-4"
      >
        <div
          class="bg-white p-8 rounded-4xl shadow-2xl w-full max-w-md border border-slate-100 animate-in zoom-in-95 duration-200"
        >
          <div class="flex justify-between items-start mb-6">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-1">
                Authorization Data
              </p>
              <h2 class="text-2xl font-black text-slate-900 tracking-tight">{{ modalTitle }}</h2>
            </div>
            <span
              class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border"
              [class]="ActionTypeColors[selectedAction.type]"
            >
              {{ selectedAction.type }}
            </span>
          </div>

          <p
            class="text-slate-600 font-medium leading-relaxed mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 italic"
          >
            "{{ selectedAction.details }}"
          </p>

          @if (selectedActionMetadata) {
            <div class="space-y-4">
              @switch (selectedAction.type) {
                @case ('PROJECT_INVITATION') {
                  <div class="space-y-3">
                    <div class="flex justify-between items-center py-2 border-b border-slate-50">
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                        >Workspace</span
                      >
                      <span class="text-sm font-black text-slate-900">{{
                        selectedActionMetadata.projectName
                      }}</span>
                    </div>
                    <p class="text-xs text-slate-500 leading-relaxed">
                      {{ selectedActionMetadata.projectDescription }}
                    </p>
                  </div>
                }
                @case ('TASK_ASSIGNMENT') {
                  <div class="space-y-3">
                    <div class="flex justify-between items-center py-2 border-b border-slate-50">
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                        >Priority</span
                      >
                      <span
                        class="text-xs font-black px-2 py-0.5 rounded-full bg-slate-900 text-white"
                        >{{ selectedActionMetadata.priority }}</span
                      >
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-slate-50">
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                        >Deadline</span
                      >
                      <span class="text-sm font-black text-slate-900">{{
                        selectedActionMetadata.dueDate || 'No Limit'
                      }}</span>
                    </div>
                  </div>
                }
              }
            </div>
          }

          <div class="grid grid-cols-2 gap-3 mt-8">
            <button
              (click)="closeModal()"
              class="py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 rounded-2xl transition"
            >
              Close
            </button>
            <button
              (click)="acceptAction(selectedAction); closeModal()"
              class="py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-emerald-600 transition"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ActionCenter {
  actions = signal<Action[]>([]);
  loading = signal(false);
  hasMore = signal(true);
  showModal = signal(false);
  selectedAction: Action | null = null;

  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

readonly ActionTypeColors: Record<ActionType, string> = {
    [ActionType.PROJECT_INVITATION]: 'bg-blue-50 text-blue-600 border-blue-100',
    [ActionType.TASK_ASSIGNMENT]: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };
  private page = 0;
  private pageSize = 10;

  constructor(
    private actionService: ActionCenterService,
    private projectInvitationsResource: ProjectInvitationsResource,
    private taskResource: TaskResource,
  ) {
    this.loadActions();
  }

  loadActions() {
    if (this.loading() || !this.hasMore()) return;

    this.loading.set(true);

    this.actionService.getActions(this.page, this.pageSize).subscribe({
      next: ({ actions, hasMore }) => {
        this.actions.set([...this.actions(), ...actions]);
        this.hasMore.set(hasMore);
        this.page++;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    const scrollPos = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 300;
    if (scrollPos >= threshold) this.loadActions();
  }

  viewAction(action: Action) {
    this.selectedAction = action;
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedAction = null;
  }

  rejectAction(action: Action) {
    const metadata = this.safeMetadata(action);

    switch (action.type) {
      case ActionType.PROJECT_INVITATION: {
        const invitationId = metadata?.invitationId;
        if (!invitationId) return;

        this.projectInvitationsResource.rejectInvitation(invitationId, action.id).subscribe({
          next: () => {
            this.actions.set(this.actions().filter((a) => a.id !== action.id));
            this.successMessage.set('Invitation rejected');
          },
          error: () => this.errorMessage.set('Failed to reject invitation'),
        });
        break;
      }

      case ActionType.TASK_ASSIGNMENT: {
        const taskId = metadata?.taskId;
        if (!taskId) return;

        // For rejecting a task assignment, only actionId is required
        this.taskResource.rejectTaskAssignment(taskId, action.id).subscribe({
          next: () => {
            this.actions.set(this.actions().filter((a) => a.id !== action.id));
            this.successMessage.set('Task assignment rejected');
          },
          error: () => this.errorMessage.set('Failed to reject task assignment'),
        });
        break;
      }

      default: {
        console.warn('Unhandled action type', action.type);
        this.errorMessage.set('Cannot reject this type of action');
        setTimeout(() => this.errorMessage.set(null), 3000);
      }
    }
  }

  get modalTitle(): string {
    if (!this.selectedAction) return 'Action Details';

    switch (this.selectedAction.type) {
      case ActionType.PROJECT_INVITATION:
        return 'Project Invitation';

      case ActionType.TASK_ASSIGNMENT:
        return 'Task Assignment';

      default:
        return 'Action Details';
    }
  }

  acceptAction(action: Action) {
    const metadata = this.safeMetadata(action);

    switch (action.type) {
      case ActionType.PROJECT_INVITATION: {
        const invitationId = metadata?.invitationId;
        if (!invitationId) return;

        this.projectInvitationsResource.acceptInvitation(invitationId, action.id).subscribe({
          next: () => {
            this.actions.set(this.actions().filter((a) => a.id !== action.id));
            this.successMessage.set('Invitation accepted');
          },
          error: () => this.errorMessage.set('Failed to accept invitation'),
        });
        break;
      }

      case ActionType.TASK_ASSIGNMENT: {
        const taskId = metadata?.taskId;
        if (!taskId) return;

        this.taskResource.acceptTaskAssignment(taskId, action.id).subscribe({
          next: () => {
            this.actions.set(this.actions().filter((a) => a.id !== action.id));
            this.successMessage.set('Task assignment accepted');
          },
          error: () => this.errorMessage.set('Failed to accept task assignment'),
        });
        break;
      }
    }
  }

  safeMetadata(action: Action): any {
    if (!action.metadata) return null;
    try {
      return JSON.parse(action.metadata);
    } catch {
      return null;
    }
  }

  get selectedActionMetadata() {
    return this.selectedAction ? this.safeMetadata(this.selectedAction) : null;
  }
}
