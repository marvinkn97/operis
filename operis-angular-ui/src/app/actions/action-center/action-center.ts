import { Component, HostListener, signal } from '@angular/core';
import { Action, ActionType } from '../../actions/action-center/action.model';

@Component({
  selector: 'app-action-center',
  standalone: true,
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold mb-2">Action Center</h1>
      <p class="text-gray-600 mb-6">
        You have {{ actions().length }} pending actions that require your attention.
      </p>

      <!-- Headers for large screens -->
      <div class="hidden sm:flex justify-between bg-gray-50 p-3 rounded-xl font-semibold text-gray-600 mb-2">
        <span class="sm:w-32">Type</span>
        <span class="flex-1 sm:ml-4">Details</span>
        <span class="sm:w-32 text-center">From</span>
        <span class="sm:w-32 text-center">Time</span>
        <span class="sm:w-48 text-right">Actions</span>
      </div>

      <!-- Pending Actions List -->
      <div class="space-y-4">
        @for(action of actions(); track action.id) {
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-xl shadow hover:shadow-lg transition">

            <!-- Type -->
            <div class="sm:w-32 shrink-0 mb-1 sm:mb-0">
              <span
                class="px-2 py-1 rounded-full text-xs font-semibold"
                [class]="ActionTypeColors[action.type]"
              >
                {{ action.type }}
              </span>
            </div>

            <!-- Details -->
            <div class="flex-1 text-gray-700 truncate mb-1 sm:mb-0 sm:ml-4">
              {{ action.details }}
            </div>

            <!-- From -->
            <div class="sm:w-32 text-gray-500 text-center mb-1 sm:mb-0">
              {{ action.from }}
            </div>

            <!-- Time -->
            <div class="sm:w-32 text-gray-500 text-center mb-1 sm:mb-0">
              {{ action.time }}
            </div>

            <!-- Actions -->
            <div class="flex gap-2 justify-end sm:w-48">
              <button
                (click)="viewAction(action)"
                class="flex items-center gap-1 px-2 py-1 rounded-lg border border-blue-500 text-blue-500 text-sm font-medium hover:bg-blue-50 transition"
              >
                View
              </button>
              <button
                (click)="acceptAction(action.id)"
                class="flex items-center gap-1 px-2 py-1 rounded-lg border border-green-500 text-green-500 text-sm font-medium hover:bg-green-50 transition"
              >
                Accept
              </button>
              <button
                (click)="rejectAction(action.id)"
                class="flex items-center gap-1 px-2 py-1 rounded-lg border border-red-500 text-red-500 text-sm font-medium hover:bg-red-50 transition"
              >
                Reject
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Infinite Scroll Loading -->
      @if(loading()) {
        <p class="mt-4 text-center text-gray-500">Loading more actions...</p>
      }
      @if(!hasMore() && actions().length > 0) {
        <p class="mt-4 text-center text-gray-400">No more actions</p>
      }

      <!-- Action Details Modal -->
      @if(showModal()) {
        <div class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div class="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 class="text-xl font-semibold mb-4">Action Details</h2>
            <p><strong>Type:</strong> {{ selectedAction?.type }}</p>
            <p><strong>Details:</strong> {{ selectedAction?.details }}</p>
            <p><strong>From:</strong> {{ selectedAction?.from }}</p>
            <p><strong>Time:</strong> {{ selectedAction?.time }}</p>

            <div class="flex justify-end gap-3 mt-6">
              <button (click)="closeModal()" class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class ActionCenter {
  actions = signal<Action[]>([]);
  loading = signal(false);
  hasMore = signal(true);
  showModal = signal(false);
  selectedAction: Action | null = null;

  readonly ActionTypeColors: Record<ActionType, string> = {
    [ActionType.PROJECT_INVITATION]: 'bg-blue-100 text-blue-800',
    [ActionType.TASK_ASSIGNMENT]: 'bg-green-100 text-green-800',
  };

  constructor() {
    this.loadActions();
  }

  loadActions() {
    if (this.loading() || !this.hasMore()) return;

    this.loading.set(true);

    setTimeout(() => {
      const types = [ActionType.PROJECT_INVITATION, ActionType.TASK_ASSIGNMENT];
      const newActions: Action[] = Array.from({ length: 20 }).map((_, i) => ({
        id: (this.actions().length + i + 1).toString(),
        type: types[Math.floor(Math.random() * types.length)],
        details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        from: ['Alice', 'Bob', 'Charlie'][Math.floor(Math.random() * 3)],
        time: `${Math.floor(Math.random() * 60)} minutes ago`,
      }));

      this.actions.set([...this.actions(), ...newActions]);
      this.loading.set(false);

      if (this.actions().length >= 100) this.hasMore.set(false);
    }, 1000);
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

  acceptAction(id: string) {
    this.actions.set(this.actions().filter((a) => a.id !== id));
  }

  rejectAction(id: string) {
    this.actions.set(this.actions().filter((a) => a.id !== id));
  }
}
