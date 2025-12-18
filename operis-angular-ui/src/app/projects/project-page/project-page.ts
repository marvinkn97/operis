import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

type Member = {
  id: string;
  name: string;
  email: string;
};

type Task = {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assignees: Member[];
};

@Component({
  selector: 'app-project-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-8">

      <!-- Back button -->
      <div>
        <a
          routerLink="/projects"
          class="inline-flex items-center gap-1 text-sm px-3 py-1 rounded border text-gray-600 hover:bg-gray-100 transition"
        >
          ← Back to Projects
        </a>
      </div>

      <!-- Project header -->
      <section class="bg-white rounded-xl shadow-sm p-6">
        <h1 class="text-3xl font-bold">{{ project().name }}</h1>
        <p class="text-gray-600 mt-2 max-w-3xl">
          {{ project().description }}
        </p>
      </section>

      <!-- Members + Tasks -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Members -->
        <section class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Members</h2>
            <button
              (click)="showInviteMember.set(true)"
              class="text-sm px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Invite
            </button>
          </div>

          @if (members().length === 0) {
            <p class="text-sm text-gray-500">No members yet.</p>
          }

          <ul class="space-y-3">
            @for(member of members(); track member.id) {
              <li class="flex items-center justify-between border rounded-lg p-3">
                <div class="flex items-center gap-3">
                  <!-- Avatar -->
                  <div
                    class="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm"
                  >
                    {{ member.name.charAt(0) }}
                  </div>

                  <div>
                    <p class="font-medium">{{ member.name }}</p>
                    <p class="text-xs text-gray-500">{{ member.email }}</p>
                  </div>
                </div>

                <button
                  class="text-red-600 text-sm hover:underline"
                  (click)="removeMember(member.id)"
                >
                  Remove
                </button>
              </li>
            }
          </ul>
        </section>

        <!-- Tasks -->
        <section class="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Tasks</h2>
            <button
              (click)="showAddTask.set(true)"
              class="text-sm px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + Add Task
            </button>
          </div>

          @if (tasks().length === 0) {
            <p class="text-sm text-gray-500">No tasks created yet.</p>
          }

          <div class="space-y-4">
            @for(task of tasks(); track task.id) {
              <div class="border rounded-xl p-4 hover:shadow-sm transition">
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <h3 class="font-semibold">{{ task.title }}</h3>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ task.description }}
                    </p>
                  </div>

                  <span
                    class="text-xs px-3 py-1 rounded-full font-medium"
                    [ngClass]="statusClass(task.status)"
                  >
                    {{ task.status }}
                  </span>
                </div>

                <!-- Assignees -->
                <div class="flex gap-2 mt-3 flex-wrap">
                  @for(user of task.assignees; track user.id) {
                    <span
                      class="text-xs bg-gray-100 px-2 py-1 rounded-full"
                    >
                      {{ user.name }}
                    </span>
                  }
                </div>
              </div>
            }
          </div>
        </section>
      </div>

      <!-- Invite Member Modal -->
      @if (showInviteMember()) {
        <div class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div class="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 class="text-xl font-semibold mb-4">Invite Member</h2>

            <div class="flex flex-col gap-4">
              <input
                [(ngModel)]="inviteForm.name"
                placeholder="Full name"
                class="border rounded-lg p-2"
              />

              <input
                [(ngModel)]="inviteForm.email"
                placeholder="Email address"
                type="email"
                class="border rounded-lg p-2"
              />
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button
                (click)="closeInviteModal()"
                class="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                (click)="inviteMember()"
                class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Add Task Modal -->
      @if (showAddTask()) {
        <div class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div class="bg-white p-6 rounded-xl shadow-xl w-md">
            <h2 class="text-xl font-semibold mb-4">Create Task</h2>

            <div class="flex flex-col gap-4">
              <input
                [(ngModel)]="newTask.title"
                placeholder="Task title"
                class="border rounded-lg p-2"
              />

              <textarea
                [(ngModel)]="newTask.description"
                placeholder="Task description"
                rows="3"
                class="border rounded-lg p-2"
              ></textarea>

              <!-- Assign members -->
              <div>
                <p class="text-sm font-medium mb-2">Assign Members</p>
                <div class="flex flex-wrap gap-3">
                  @for(member of members(); track member.id) {
                    <label class="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        (change)="toggleAssignee(member)"
                      />
                      {{ member.name }}
                    </label>
                  }
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button
                (click)="closeTaskModal()"
                class="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                (click)="createTask()"
                class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
})
export class ProjectPage {
  // --- Project ---
  project = signal({
    id: '1',
    name: 'Website Redesign',
    description: 'Redesign the company website with a modern UI and improved UX.',
  });

  // --- Members ---
  members = signal<Member[]>([
    { id: '1', name: 'Alice', email: 'alice@example.com' },
    { id: '2', name: 'Bob', email: 'bob@example.com' },
  ]);

  // --- Tasks ---
  tasks = signal<Task[]>([
    {
      id: 't1',
      title: 'Design landing page',
      description: 'Create hero section and main layout',
      status: 'IN_PROGRESS',
      assignees: [{ id: '1', name: 'Alice', email: 'alice@example.com' }],
    },
  ]);

  // --- Invite member ---
  showInviteMember = signal(false);
  inviteForm = { name: '', email: '' };

  // --- Add task ---
  showAddTask = signal(false);
  newTask = {
    title: '',
    description: '',
    assignees: [] as Member[],
  };

  // --- Helpers ---
  statusClass(status: Task['status']) {
    return {
      TODO: 'bg-gray-200 text-gray-700',
      IN_PROGRESS: 'bg-yellow-200 text-yellow-800',
      DONE: 'bg-green-200 text-green-800',
    }[status];
  }

  // --- Actions ---
  closeInviteModal() {
    this.showInviteMember.set(false);
    this.inviteForm = { name: '', email: '' };
  }

  inviteMember() {
    if (!this.inviteForm.name || !this.inviteForm.email) return;

    this.members.update(m => [
      ...m,
      {
        id: crypto.randomUUID(),
        name: this.inviteForm.name,
        email: this.inviteForm.email,
      },
    ]);

    this.closeInviteModal();
  }

  removeMember(id: string) {
    this.members.update(m => m.filter(x => x.id !== id));
  }

  toggleAssignee(member: Member) {
    const exists = this.newTask.assignees.find(a => a.id === member.id);
    this.newTask.assignees = exists
      ? this.newTask.assignees.filter(a => a.id !== member.id)
      : [...this.newTask.assignees, member];
  }

  closeTaskModal() {
    this.showAddTask.set(false);
    this.newTask = { title: '', description: '', assignees: [] };
  }

  createTask() {
    if (!this.newTask.title) return;

    this.tasks.update(t => [
      ...t,
      {
        id: crypto.randomUUID(),
        title: this.newTask.title,
        description: this.newTask.description,
        status: 'TODO',
        assignees: this.newTask.assignees,
      },
    ]);

    this.closeTaskModal();
  }
}
