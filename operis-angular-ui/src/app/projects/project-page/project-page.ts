import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectResource } from '../project.resource';
import { Project } from '../project.model';
import { UsersResource } from '../../users/users.resource';
import { User } from '../../users/user.model';
import { ErrorModel } from '../../error.model';

type Task = {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assignees: User[];
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
        <h1 class="text-3xl font-bold">{{ project()?.name }}</h1>
        <p class="text-gray-600 mt-2">{{ project()?.description }}</p>

        <div class="mt-4">
          <div class="w-full bg-gray-200 rounded-full h-4">
            <div
              class="bg-blue-600 h-4 rounded-full transition-all"
              [style.width.%]="project()?.progressPercentage || 0"
            ></div>
          </div>
          <p class="text-sm text-gray-500 mt-1">
            Progress: {{ project()?.progressPercentage || 0 }}%
          </p>
        </div>

        <!-- Project actions -->
        <div class="mt-4 flex gap-3">
          @if (project()?.status !== 'COMPLETED') {
          <button
            (click)="markProjectCompleted()"
            class="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            ✓ Mark as Completed
          </button>
          } @if (project()?.status === 'COMPLETED') {
          <span class="text-sm px-3 py-1 rounded-full bg-green-100 text-green-800">
            Completed
          </span>
          }
        </div>
      </section>

      <!-- Members + Tasks -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Members -->
        <section class="bg-gray-50 rounded-lg p-4">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-base font-semibold text-gray-800 flex items-center gap-1">
              Team Members ({{ project()?.memberCount }})
            </h2>
            <div class="flex items-center gap-2">
              <button
                (click)="toggleMembers()"
                class="text-gray-500 hover:text-gray-900"
                aria-label="Toggle members"
              >
                <svg
                  [class.rotate-90]="membersExpanded()"
                  class="w-4 h-4 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
              <button
                (click)="showInviteMember.set(true)"
                class="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                + Invite
              </button>
            </div>
          </div>

          <!-- Loading -->
          @if (loadingMembers()) {
          <p class="text-xs text-gray-500 mt-1">Loading members...</p>
          }

          <!-- Member list -->
          @if (membersExpanded()) {
          <ul class="space-y-1 mt-2">
            @for(member of members(); track member.id) {
            <li class="flex justify-between items-center bg-white border rounded p-2 text-sm">
              <div class="flex items-center gap-2">
                <div
                  class="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-medium"
                >
                  {{ member.firstName.charAt(0) }}{{ member.lastName.charAt(0) }}
                </div>
                <div class="text-gray-700">
                  <p class="font-medium">{{ member.firstName }} {{ member.lastName }}</p>
                  <p class="text-xs text-gray-500">{{ member.email }}</p>
                </div>

                @if(member.id === ownerId()) {
                <span class="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded ml-2"
                  >Owner</span
                >
                }
              </div>

              @if(member.id !== ownerId()) {
              <button
                class="text-red-600 text-xs hover:underline"
                (click)="removeMember(member.id)"
              >
                Remove
              </button>
              }
            </li>
            }
          </ul>

          <!-- Load more -->
          @if (membersHasMore() && !loadingMembers()) {
          <button
            (click)="fetchMembers(membersPage())"
            class="text-sm text-blue-600 hover:underline mt-2"
          >
            Load more
          </button>
          } }
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
                  <p class="text-sm text-gray-600 mt-1">{{ task.description }}</p>
                </div>

                <span
                  class="text-xs px-3 py-1 rounded-full font-medium"
                  [ngClass]="statusClass(task.status)"
                >
                  {{ task.status }}
                </span>
              </div>

              <div class="flex gap-2 mt-3 flex-wrap">
                @for(user of task.assignees; track user.id) {
                <span class="text-xs bg-gray-100 px-2 py-1 rounded-full">{{ user.firstName }}</span>
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

            <div>
              <p class="text-sm font-medium mb-2">Assign Members</p>
              <div class="flex flex-wrap gap-3">
                @for(member of members(); track member.id) {
                <label class="flex items-center gap-2 text-sm">
                  <input type="checkbox" (change)="toggleAssignee(member)" /> {{ member.firstName }}
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
    @if(errorMessage()) {
    <div class="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-2 rounded shadow">
      {{ errorMessage() }}
    </div>
    }
  `,
})
export class ProjectPage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private projectResource: ProjectResource,
    private userResource: UsersResource
  ) {}

  project = signal<Project | null>(null);
  errorMessage = signal<string | null>(null);

  // Members
  members = signal<User[]>([]);
  ownerId = signal<string | null>(null);
  membersExpanded = signal(false);
  loadingMembers = signal(false);
  membersPage = signal(0);
  membersPageSize = 10;
  membersHasMore = signal(true);

  // Tasks
  tasks = signal<Task[]>([]);

  // Invite & Add Task
  showInviteMember = signal(false);
  inviteForm = { name: '', email: '' };
  showAddTask = signal(false);
  newTask = { title: '', description: '', assignees: [] as User[] };

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (!projectId) return;

    this.projectResource.getProjectById(projectId).subscribe({
      next: (project) => this.project.set(project),
      error: (err) => {
        this.errorMessage.set('Failed to load project');
        console.error('Failed to load project', err);
        setTimeout(() => this.errorMessage.set(null), 3000);
      },
    });
  }

  toggleMembers() {
    const projectData = this.project();
    if (!projectData) return;

    this.membersExpanded.update((v) => !v);

    if (this.membersExpanded() && this.members().length === 0) {
      this.membersPage.set(0);
      this.membersHasMore.set(true);
      this.members.set([]);
      this.fetchMembers(0);
    }
  }

  fetchMembers(page: number) {
    const projectData = this.project();
    if (!projectData) return;

    const memberIds = projectData.memberIds || [];
    if (memberIds.length === 0) {
      this.membersHasMore.set(false);
      return;
    }

    this.loadingMembers.set(true);

    const start = page * this.membersPageSize;
    const end = start + this.membersPageSize;
    const pageIds = memberIds.slice(start, end);

    this.userResource.getUsersByIds(pageIds).subscribe({
      next: (data) => {
        const items = data?._embedded?.userResponseList ?? [];
        this.members.update((prev) => [...prev, ...items]);
        this.ownerId.set(projectData.ownerId);

        const totalElements = data.page?.totalElements ?? memberIds.length;
        this.membersHasMore.set(this.members().length < totalElements);
        this.membersPage.set(page + 1);
        this.loadingMembers.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load members');
        console.error('Failed to load members', err);
        setTimeout(() => this.errorMessage.set(null), 3000);
        this.loadingMembers.set(false);
      },
    });
  }

  // Tasks
  statusClass(status: Task['status']) {
    return {
      TODO: 'bg-gray-200 text-gray-700',
      IN_PROGRESS: 'bg-yellow-200 text-yellow-800',
      DONE: 'bg-green-200 text-green-800',
    }[status];
  }

  // Actions
  closeInviteModal() {
    this.showInviteMember.set(false);
    this.inviteForm = { name: '', email: '' };
  }

  inviteMember() {
    if (!this.inviteForm.name || !this.inviteForm.email) return;

    this.members.update((m) => [
      ...m,
      {
        id: crypto.randomUUID(),
        firstName: this.inviteForm.name,
        lastName: this.inviteForm.name,
        email: this.inviteForm.email,
      },
    ]);
    this.closeInviteModal();
  }

  removeMember(id: string) {
    this.members.update((m) => m.filter((x) => x.id !== id));
  }

  toggleAssignee(member: User) {
    const exists = this.newTask.assignees.find((a) => a.id === member.id);
    this.newTask.assignees = exists
      ? this.newTask.assignees.filter((a) => a.id !== member.id)
      : [...this.newTask.assignees, member];
  }

  closeTaskModal() {
    this.showAddTask.set(false);
    this.newTask = { title: '', description: '', assignees: [] };
  }

  createTask() {
    if (!this.newTask.title) return;
    this.tasks.update((t) => [...t, { id: crypto.randomUUID(), ...this.newTask, status: 'TODO' }]);
    this.closeTaskModal();
  }

  markProjectCompleted() {
    const projectData = this.project();
    if (!projectData) return;

    this.projectResource.markProjectCompleted(projectData.id).subscribe({
      next: () => {
        // update UI ONLY after backend success
        this.project.set({
          ...projectData,
          status: 'COMPLETED',
        });
      },
      error: (err: ErrorModel) => {
        this.errorMessage.set(err?.detail ||'Failed to mark project as completed');
        console.error('Failed to mark project as completed', err);
        setTimeout(() => this.errorMessage.set(null), 3000);
      },
    });
  }
}
