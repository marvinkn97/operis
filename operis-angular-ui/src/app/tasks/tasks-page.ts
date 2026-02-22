import { Component, HostListener, signal } from '@angular/core';
import { Task } from './task.model';
import { TaskResource } from './task.resource';

@Component({
  selector: 'app-assigned-tasks',
  standalone: true,
  template: `
    <div class="p-4 sm:p-6 max-w-6xl mx-auto">
      <!-- Header -->
      <h1 class="text-2xl sm:text-3xl font-bold mb-2">My Assigned Tasks</h1>
      <p class="text-gray-600 mb-6">You have {{ totalTasks() }} assigned tasks.</p>

      <!-- Desktop Table Header -->
      <div class="hidden sm:grid grid-cols-[1fr_2fr_120px_120px_150px] gap-4 bg-gray-50 px-4 py-3 rounded-xl font-semibold text-gray-600 mb-3">
        <span>Title</span>
        <span>Description</span>
        <span class="text-center">Due Date</span>
        <span class="text-center">Priority</span>
        <span class="text-right">Actions</span>
      </div>

      <!-- Task List -->
      <div class="space-y-3">
        @for (task of tasks(); track task.id) {
          <!-- MOBILE layout -->
          <div class="bg-white rounded-xl shadow hover:shadow-md transition p-4 sm:hidden flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <span class="font-semibold">{{ task.title }}</span>
              <span class="text-gray-500 text-xs">Due: {{ task.dueDate || 'N/A' }}</span>
            </div>
            <p class="text-gray-700 text-sm">{{ task.description }}</p>
            <span class="px-2 py-1 rounded-full text-xs font-semibold" [class]="getPriorityClass(task.priority)">
              {{ task.priority || 'NORMAL' }}
            </span>
            <button (click)="completeTask(task)"
                    class="w-full px-3 py-2 rounded-lg border border-green-500 text-green-600 text-sm font-medium hover:bg-green-50 transition">
              Mark Completed
            </button>
          </div>

          <!-- DESKTOP layout -->
          <div class="hidden sm:grid grid-cols-[1fr_2fr_120px_120px_150px] gap-4 items-center bg-white rounded-xl shadow p-4 hover:shadow-md transition">
            <div class="text-gray-700 font-semibold">{{ task.title }}</div>
            <div class="text-gray-700 text-sm">{{ task.description }}</div>
            <div class="text-gray-500 text-sm text-center">{{ task.dueDate || 'N/A' }}</div>
            <div class="text-center">
              <span class="px-2 py-1 rounded-full text-xs font-semibold" [class]="getPriorityClass(task.priority)">
                {{ task.priority || 'NORMAL' }}
              </span>
            </div>
            <div class="flex justify-end">
              <button (click)="completeTask(task)"
                      class="px-3 py-1.5 rounded-lg border border-green-500 text-green-600 text-sm font-medium hover:bg-green-50 transition">
                Mark Completed
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Loading -->
      @if (loading()) {
        <p class="mt-6 text-center text-gray-500">Loading tasks...</p>
      }

      <!-- No More -->
      @if (!loading() && tasks().length > 0 && tasks().length >= totalTasks()) {
        <p class="mt-6 text-center text-gray-400">No more tasks</p>
      }

      <!-- Empty State -->
      @if (!loading() && tasks().length === 0) {
        <div class="mt-12 text-center text-gray-500">
          <p class="text-lg font-medium">No assigned tasks</p>
          <p class="text-sm mt-1">You're all caught up</p>
        </div>
      }
    </div>

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
export class AssignedTasksPage {
  tasks = signal<Task[]>([]);
  loading = signal(false);
  page = 0;
  pageSize = 10;
  totalTasks = signal(0);

  constructor(private taskResource: TaskResource) {
    this.loadTasks();
  }

  loadTasks() {
    if (this.loading() || (this.totalTasks() && this.tasks().length >= this.totalTasks())) return;

    this.loading.set(true);
    this.taskResource.getAssignedTasks(this.page, this.pageSize).subscribe({
      next: (res) => {
        const newTasks = res._embedded?.taskResponseList || [];
        this.tasks.set([...this.tasks(), ...newTasks]);
        this.totalTasks.set(res.page.totalElements || 0);
        this.page++;
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Failed to load assigned tasks');
      },
    });
  }

  completeTask(task: Task) {
    this.taskResource.completeTask(task.id).subscribe({
      next: () => {
        this.successMessage.set('Task completed successfully');
        this.tasks.set(this.tasks().filter(t => t.id !== task.id));
      },
      error: () => {
        this.errorMessage.set('Failed to complete task');
      },
    });
  }

  getPriorityClass(priority?: string) {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  @HostListener('window:scroll')
  onScroll() {
    const scrollPos = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 300;
    if (scrollPos >= threshold) this.loadTasks();
  }

    successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
}