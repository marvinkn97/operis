import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectResource } from '../project.resource';
import { Project } from '../project.model';
import { UsersResource } from '../../users/users.resource';
import { User } from '../../users/user.model';
import { ProjectInvitationsResource } from '../project-invitations.resource';
import { TaskResource } from '../../tasks/task.resource';
import { Task, TaskPriority, TaskRequest } from '../../tasks/task.model';
import { Action } from '../../actions/action-center/action.model';

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

      <!-- 🔄 LOADING SKELETON -->
      @if (loading()) {
        <div class="space-y-6 animate-pulse">
          <!-- Header skeleton -->
          <div class="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div class="h-8 w-1/3 bg-gray-200 rounded"></div>
            <div class="h-4 w-2/3 bg-gray-200 rounded"></div>
            <div class="h-4 w-full bg-gray-200 rounded"></div>
          </div>

          <!-- Members skeleton -->
          <div class="bg-white rounded-xl shadow-sm p-6 space-y-3">
            <div class="h-6 w-40 bg-gray-200 rounded"></div>
            <div class="h-12 bg-gray-200 rounded"></div>
            <div class="h-12 bg-gray-200 rounded"></div>
          </div>

          <!-- Tasks skeleton -->
          <div class="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div class="h-6 w-32 bg-gray-200 rounded"></div>
            <div class="h-16 bg-gray-200 rounded"></div>
            <div class="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      }

      @if (!loading()) {
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
                class="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                ✓ Mark as Completed
              </button>
            }
            @if (project()?.status === 'COMPLETED') {
              <span class="text-sm px-3 py-1 rounded-full bg-green-100 text-green-800">
                Completed
              </span>
            }
          </div>
        </section>

        <!-- Members + Tasks -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Members -->
          <section class="bg-white rounded-xl shadow-sm p-6 lg:col-span-full">
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
                  class="text-sm px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
              <ul class="space-y-4 mt-2">
                @for (member of members(); track member.id) {
                  <li
                    class="flex justify-between items-center bg-white border rounded-xl p-2 text-sm"
                  >
                    <div class="flex items-center gap-2">
                      <div
                        class="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-medium"
                      >
                        {{ member.firstName.charAt(0) }}{{ member.lastName.charAt(0) }}
                      </div>
                      <div class="text-gray-700">
                        <p class="font-semibold">{{ member.firstName }} {{ member.lastName }}</p>
                        <p class="text-sm text-gray-500">{{ member.email }}</p>
                      </div>

                      @if (member.id === ownerId()) {
                        <span class="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded ml-2"
                          >Owner</span
                        >
                      }
                    </div>

                    @if (member.id !== ownerId()) {
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
              }
            }
          </section>

          <!-- Tasks -->
          <section class="bg-white rounded-xl shadow-sm p-6 lg:col-span-full">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-base font-semibold">Tasks ({{ project()?.taskCount }})</h2>

              <div class="flex items-center gap-2">
                <!-- Toggle button (same UX as members) -->
                <button
                  (click)="toggleTasks()"
                  class="text-gray-500 hover:text-gray-900"
                  aria-label="Toggle tasks"
                >
                  <svg
                    [class.rotate-90]="tasksExpanded()"
                    class="w-4 h-4 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                  (click)="openTaskModal()"
                  class="text-sm px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  + Add
                </button>
              </div>
            </div>

            @if (loadingTasks()) {
              <p class="text-sm text-gray-500">Loading tasks...</p>
            }

            @if (tasksExpanded()) {
              @if (tasks().length === 0 && !loadingTasks()) {
                <p class="text-sm text-gray-500">No tasks created yet.</p>
              }

              <div class="space-y-4">
                @for (task of tasks(); track task.id) {
                  <div class="border rounded-xl p-4 hover:shadow-sm transition">
                    <div class="flex justify-between items-start gap-4">
                      <div>
                        <h3 class="text-sm font-semibold">{{ task.title }}</h3>
                        <p class="text-sm text-gray-600 mt-1">
                          {{ task.description }}
                        </p>
                        <!-- 🔹 Assigned badge -->
                        <span
                          class="inline-block text-xs px-2 py-0.5 rounded-full mt-1 font-semibold"
                          [class]="
                            task.isAssigned
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          "
                        >
                          {{ task.isAssigned ? 'Assigned' : 'Not Assigned' }}
                        </span>
                      </div>

                      <span
                        class="text-xs px-3 py-1 rounded-full font-medium"
                        [ngClass]="statusClass(task.status)"
                      >
                        {{ task.status }}
                      </span>
                    </div>
                  </div>
                }
              </div>

              @if (tasksHasMore() && !loadingTasks()) {
                <button
                  (click)="fetchTasks(tasksPage())"
                  class="text-sm text-blue-600 hover:underline mt-2"
                >
                  Load more
                </button>
              }
            }
          </section>
        </div>
      }

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
                class="px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
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
              <!-- Title -->
              <input
                [(ngModel)]="newTask.title"
                placeholder="Task title"
                class="border rounded-lg p-2"
              />

              <!-- Description -->
              <textarea
                [(ngModel)]="newTask.description"
                placeholder="Task description"
                rows="3"
                class="border rounded-lg p-2"
              ></textarea>

              <!-- Priority Dropdown -->
              <div>
                <label class="text-sm font-medium mb-1 block">Priority</label>
                <select [(ngModel)]="newTask.priority" class="border rounded-lg p-2 w-full">
                  <option value="" disabled>Select priority</option>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>

              <!-- Due Date -->
              <div>
                <label class="text-sm font-medium mb-1 block">Due Date</label>
                <input
                  type="date"
                  [(ngModel)]="newTask.dueDate"
                  class="border rounded-lg p-2 w-full"
                />
              </div>

              <!-- Single Assignee Dropdown -->
              <div>
                <label class="text-sm font-medium mb-1 block">Assign Member</label>
                <select [(ngModel)]="newTask.assigneeId" class="border rounded-lg p-2 w-full">
                  <option [ngValue]="null" disabled>Select a member</option>
                  @for (member of taskAssignees(); track member.id) {
                    <option [ngValue]="member.id">
                      {{ member.firstName }} {{ member.lastName }}
                    </option>
                  }
                </select>
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
                class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      }
    </div>
    @if (errorMessage()) {
      <div class="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-2 rounded shadow">
        {{ errorMessage() }}
      </div>
    }

    @if (successMessage()) {
      <div class="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow">
        {{ successMessage() }}
      </div>
    }
  `,
})
export class ProjectPage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private projectResource: ProjectResource,
    private userResource: UsersResource,
    private invitationResource: ProjectInvitationsResource,
    private taskResource: TaskResource,
  ) {}

  project = signal<Project | null>(null);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Members
  members = signal<User[]>([]);
  ownerId = signal<string | null>(null);
  membersExpanded = signal(false);
  loadingMembers = signal(false);
  membersPage = signal(0);
  membersPageSize = 10;
  membersHasMore = signal(true);

  // Invite & Add Task
  showInviteMember = signal(false);
  inviteForm = { name: '', email: '' };

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');

    if (!projectId) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true); // start loader

    this.projectResource.getProjectById(projectId).subscribe({
      next: (project) => {
        this.project.set(project);
        this.loading.set(false); // stop loader
      },
      error: (err) => {
        this.loading.set(false); // stop loader even on error
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
      COMPLETED: 'bg-green-100 text-green-800', // ✅ completed is green
    }[status];
  }

  // Actions
  closeInviteModal() {
    this.showInviteMember.set(false);
    this.inviteForm = { name: '', email: '' };
  }

  closeTaskModal() {
    this.showAddTask.set(false);
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
      error: (err) => {
        console.error('Failed to mark project as completed', err);
        this.errorMessage.set(err.error.detail || 'Failed to mark project as completed');
        setTimeout(() => this.errorMessage.set(null), 3000);
      },
    });
  }

  inviteMember() {
    const projectData = this.project();
    if (!projectData) return;

    if (!this.inviteForm.name || !this.inviteForm.email) return;

    this.invitationResource
      .inviteUserToProject({
        projectId: projectData.id,
        recipientName: this.inviteForm.name,
        recipientEmail: this.inviteForm.email,
      })
      .subscribe({
        next: () => {
          // ✅ Success popup
          this.successMessage.set('Invitation sent successfully');
          setTimeout(() => this.successMessage.set(null), 3000);

          // Close modal
          this.closeInviteModal();
        },
        error: (err: any) => {
          console.error('Invite failed', err);
          this.closeInviteModal();

          // ❌ Error popup
          this.errorMessage.set(err?.error?.detail || 'Failed to send invitation');
          setTimeout(() => this.errorMessage.set(null), 3000);
        },
      });
  }

  removeMember(memberId: string) {
    const projectData = this.project();
    if (!projectData) return;

    this.projectResource.removeMember(projectData.id, memberId).subscribe({
      next: () => {
        // ✅ Update UI ONLY after backend success
        this.members.update((m) => m.filter((x) => x.id !== memberId));

        // ✅ Success toast
        this.successMessage.set('Member removed successfully');
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err) => {
        console.error('Failed to remove member', err);

        // ❌ Error toast
        this.errorMessage.set(err?.error?.detail || 'Failed to remove member');
        setTimeout(() => this.errorMessage.set(null), 3000);
      },
    });
  }

  newTask = {
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    assigneeId: null,
  };

  taskAssignees = signal<User[]>([]);
  showAddTask = signal(false);

  openTaskModal() {
    this.showAddTask.set(true);
    this.loadTaskAssignees();
  }

  loadTaskAssignees() {
    const projectData = this.project();
    if (!projectData) return;

    // If already loaded, skip
    if (this.taskAssignees().length > 0) return;

    const memberIds = projectData.memberIds || [];
    if (memberIds.length === 0) return;

    this.userResource.getUsersByIds(memberIds).subscribe({
      next: (data) => {
        const items = data?._embedded?.userResponseList ?? [];
        this.taskAssignees.set(items);
      },
      error: (err) => {
        console.error('Failed to load members for task dropdown', err);
        this.errorMessage.set('Failed to load members');
        setTimeout(() => this.errorMessage.set(null), 3000);
      },
    });
  }

  createTask() {
    const projectId = this.project()?.id;

    if (!projectId || !this.newTask.assigneeId || !this.newTask.title || !this.newTask.priority) {
      this.errorMessage.set('Please fill all required fields');
      setTimeout(() => this.errorMessage.set(null), 3000);
      return;
    }

    const taskRequest: TaskRequest = {
      title: this.newTask.title,
      description: this.newTask.description,
      priority: this.newTask.priority as TaskPriority,
      dueDate: this.newTask.dueDate || undefined,
      assignedTo: this.newTask.assigneeId,
      projectId,
    };

    this.taskResource.createTask(taskRequest).subscribe({
      next: () => {
        this.newTask = {
          title: '',
          description: '',
          priority: '',
          dueDate: '',
          assigneeId: null,
        };

        this.showAddTask.set(false);

        const projectId = this.project()?.id;
        if (projectId) {
          this.loadProjectTasks(projectId);
        }

        this.successMessage.set('Task created successfully');
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err) => {
        console.error('Failed to create task', err);
        this.errorMessage.set(err?.error?.detail || 'Failed to create task');
        setTimeout(() => this.errorMessage.set(null), 3000);
      },
    });
  }

  loading = signal(true);

  loadProjectTasks(projectId: string) {
    this.taskResource.getTasksByProject(projectId).subscribe({
      next: (response) => {
        const items = response?._embedded?.taskResponseList ?? [];
        this.tasks.set(items);
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
        this.errorMessage.set('Failed to load tasks');
        setTimeout(() => this.errorMessage.set(null), 3000);
      },
    });
  }

  // Tasks
  tasks = signal<Task[]>([]);
  tasksExpanded = signal(false);
  loadingTasks = signal(false);
  tasksPage = signal(0);
  tasksPageSize = 10;
  tasksHasMore = signal(true);

  toggleTasks() {
    const projectData = this.project();
    if (!projectData) return;

    this.tasksExpanded.update((v) => !v);

    // Lazy load ONLY first time opened
    if (this.tasksExpanded() && this.tasks().length === 0) {
      this.tasksPage.set(0);
      this.tasksHasMore.set(true);
      this.tasks.set([]);
      this.fetchTasks(0);
    }
  }

  fetchTasks(page: number) {
    const projectData = this.project();
    if (!projectData) return;

    this.loadingTasks.set(true);

    this.taskResource.getTasksByProject(projectData.id, page, this.tasksPageSize).subscribe({
      next: (data) => {
        const items = data?._embedded?.taskResponseList ?? [];

        this.tasks.update((prev) => [...prev, ...items]);

        const totalElements = data.page?.totalElements ?? 0;
        this.tasksHasMore.set(this.tasks().length < totalElements);
        this.tasksPage.set(page + 1);
        this.loadingTasks.set(false);
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
        this.errorMessage.set('Failed to load tasks');
        setTimeout(() => this.errorMessage.set(null), 3000);
        this.loadingTasks.set(false);
      },
    });
  }
}
