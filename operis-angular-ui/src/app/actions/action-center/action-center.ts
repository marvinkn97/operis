import { Component, HostListener, signal } from '@angular/core';
import { Action, ActionType } from '../../actions/action-center/action.model';
import { ActionCenterService } from '../cta.resource';
import { ProjectInvitationsResource } from '../../projects/project-invitations.resource';

@Component({
  selector: 'app-action-center',
  standalone: true,
  template: `
    <div class="p-4 sm:p-6 max-w-6xl mx-auto">
      <!-- Header -->
      <h1 class="text-2xl sm:text-3xl font-bold mb-2">Action Center</h1>
      <p class="text-gray-600 mb-6">
        You have {{ actions().length }} pending actions that require your attention.
      </p>

      <!-- Desktop Header (hidden on mobile) -->
      <div
        class="hidden sm:grid grid-cols-[minmax(100px,120px)_1fr_minmax(80px,120px)_minmax(150px,auto)] gap-4 bg-gray-50 px-4 py-3 rounded-xl font-semibold text-gray-600 mb-3"
      >
        <span>Type</span>
        <span>Details</span>
        <span class="text-center">Time</span>
        <span class="text-right">Actions</span>
      </div>

      <!-- Actions List -->
      <div class="space-y-3">
        @for (action of actions(); track action.id) {
          <div class="bg-white rounded-xl shadow hover:shadow-md transition p-4">
            <!-- MOBILE LAYOUT -->
            <div class="flex flex-col gap-3 sm:hidden">
              <!-- Top Row: Type + Time -->
              <div class="flex items-start justify-between gap-4">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                  [class]="ActionTypeColors[action.type]"
                >
                  {{ action.type }}
                </span>

                <span class="text-xs text-gray-500 whitespace-nowrap">
                  {{ action.createdAt }}
                </span>
              </div>

              <!-- Details -->
              <p class="text-gray-700 text-sm leading-relaxed wrap-break-word">
                {{ action.details }}
              </p>

              <!-- Buttons -->
              <div class="flex flex-col xs:flex-row gap-2">
                <button
                  (click)="viewAction(action)"
                  class="w-full xs:w-auto px-3 py-2 rounded-lg border border-blue-500 text-blue-600 text-sm font-medium hover:bg-blue-50 transition"
                >
                  View
                </button>
                <button
                  (click)="acceptAction(action)"
                  class="w-full xs:w-auto px-3 py-2 rounded-lg border border-green-500 text-green-600 text-sm font-medium hover:bg-green-50 transition"
                >
                  Accept
                </button>
                <button
                  (click)="rejectAction(action)"
                  class="w-full xs:w-auto px-3 py-2 rounded-lg border border-red-500 text-red-600 text-sm font-medium hover:bg-red-50 transition"
                >
                  Reject
                </button>
              </div>
            </div>

            <!-- Desktop layout -->
            <div
              class="hidden sm:grid grid-cols-[150px_1fr_minmax(80px,120px)_minmax(150px,auto)] gap-4 items-start"
            >
              <!-- Type -->
              <div class="shrink-0">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                  [class]="ActionTypeColors[action.type]"
                >
                  {{ action.type }}
                </span>
              </div>

              <!-- Details -->
              <div class="text-gray-700 min-w-0">
                <p
                  class="text-sm leading-relaxed wrap-break-word whitespace-normal"
                  [title]="action.details"
                >
                  {{ action.details }}
                </p>
              </div>

              <!-- Time -->
              <div class="text-gray-500 text-sm text-center whitespace-nowrap">
                {{ action.createdAt }}
              </div>

              <!-- Actions -->
              <div class="flex gap-2 justify-end min-w-0">
                <button
                  (click)="viewAction(action)"
                  class="shrink-0 px-3 py-1.5 rounded-lg border border-blue-500 text-blue-600 text-sm font-medium hover:bg-blue-50 transition whitespace-nowrap"
                >
                  View
                </button>
                <button
                  (click)="acceptAction(action)"
                  class="shrink-0 px-3 py-1.5 rounded-lg border border-green-500 text-green-600 text-sm font-medium hover:bg-green-50 transition whitespace-nowrap"
                >
                  Accept
                </button>
                <button
                  (click)="rejectAction(action)"
                  class="shrink-0 px-3 py-1.5 rounded-lg border border-red-500 text-red-600 text-sm font-medium hover:bg-red-50 transition whitespace-nowrap"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Loading -->
      @if (loading()) {
        <p class="mt-6 text-center text-gray-500">Loading more actions...</p>
      }

      <!-- No More -->
      @if (!hasMore() && actions().length > 0) {
        <p class="mt-6 text-center text-gray-400">No more actions</p>
      }

      <!-- Empty State -->
      @if (!loading() && actions().length === 0) {
        <div class="mt-12 text-center text-gray-500">
          <p class="text-lg font-medium">No pending actions</p>
          <p class="text-sm mt-1">You're all caught up</p>
        </div>
      }

      <!-- Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 class="text-xl font-semibold mb-4">Action Details</h2>

            <div class="space-y-2 text-sm text-gray-700">
              <p><strong>Type:</strong> {{ selectedAction?.type }}</p>
              <p><strong>Details:</strong></p>
              <p class="bg-gray-50 p-3 rounded-lg wrap-break-word">
                {{ selectedAction?.details }}
              </p>
              <p><strong>Time:</strong> {{ selectedAction?.createdAt }}</p>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button
                (click)="closeModal()"
                class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      }
    </div>

    <!-- Modal -->
    @if (showModal()) {
      <div class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
        <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
          <!-- Header -->
          <h2 class="text-xl font-semibold mb-4 text-gray-800">Action Details</h2>

          <!-- Action Info -->
          <div class="space-y-3 text-sm text-gray-700">
            <!-- Type -->
            <p>
              <span
                class="px-2.5 py-1 rounded-full text-xs font-semibold"
                [class]="ActionTypeColors[selectedAction!.type]"
              >
                {{ selectedAction?.type }}
              </span>
            </p>

            <!-- Time -->
            <p><strong>Time:</strong> {{ selectedAction?.createdAt }}</p>

            <!-- Details -->
            <p>
              <strong>Details:</strong>
            </p>

            <!-- Project Info -->
            @if (selectedActionMetadata) {
              <div class="bg-gray-50 p-3 rounded-lg space-y-2">
                <p>
                  <strong>Project Name: </strong>
                  <span class="font-medium">{{ selectedActionMetadata?.projectName }}</span>
                </p>
                <p>
                  <strong>Project Description: </strong>
                  <span>{{ selectedActionMetadata?.projectDescription }}</span>
                </p>
              </div>
            }
          </div>

          <!-- Footer Buttons -->
          <div class="flex justify-end gap-3 mt-6">
            <button (click)="closeModal()" class="px-4 py-2 rounded-lg border hover:bg-gray-100">
              Close
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Accept notifications -->
    @if (successMessage()) {
      <div class="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow">
        {{ successMessage() }}
      </div>
    }

    @if (errorMessage()) {
      <div class="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-2 rounded shadow">
        {{ errorMessage() }}
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
    [ActionType.PROJECT_INVITATION]: 'bg-blue-100 text-blue-800',
    [ActionType.TASK_ASSIGNMENT]: 'bg-green-100 text-green-800',
  };

  private page = 0;
  private pageSize = 10;

  constructor(
    private actionService: ActionCenterService,
    private projectInvitationsResource: ProjectInvitationsResource,
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

  acceptAction(action: Action) {
    const metadata = JSON.parse(action.metadata);
    const invitationId = metadata.invitationId;

    this.projectInvitationsResource.acceptInvitation(invitationId, action.id).subscribe({
      next: () => {
        this.actions.set(this.actions().filter((a) => a.id !== action.id));
        this.successMessage.set('Invitation accepted');
      },
      error: () => this.errorMessage.set('Failed to accept invitation'),
    });
  }

  rejectAction(action: Action) {
    const metadata = JSON.parse(action.metadata);
    const invitationId = metadata.invitationId;

    this.projectInvitationsResource.rejectInvitation(invitationId, action.id).subscribe({
      next: () => {
        this.actions.set(this.actions().filter((a) => a.id !== action.id));
        this.successMessage.set('Invitation rejected');
      },
      error: () => this.errorMessage.set('Failed to reject invitation'),
    });
  }

  get selectedActionMetadata() {
    if (!this.selectedAction?.metadata) return null;
    try {
      return JSON.parse(this.selectedAction.metadata);
    } catch {
      return null;
    }
  }
}
