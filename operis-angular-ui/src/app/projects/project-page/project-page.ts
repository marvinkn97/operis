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

@Component({
  selector: 'app-project-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#fafafa] pt-24 pb-12 px-6 relative overflow-hidden">
      <div
        class="absolute top-0 right-0 w-96 h-96 bg-blue-50/40 rounded-full blur-[120px] -z-10"
      ></div>

      <div class="max-w-7xl mx-auto space-y-8 relative z-10">
        <div class="flex items-center">
          <a
            routerLink="/projects"
            class="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
          >
            <span class="group-hover:-translate-x-1 transition-transform">←</span> Back to Projects
          </a>
        </div>

        @if (loading()) {
          <div class="space-y-6 animate-pulse">
            <div class="bg-white rounded-2xl border border-slate-100 p-8 space-y-4">
              <div class="h-10 w-1/4 bg-slate-100 rounded-lg"></div>
              <div class="h-4 w-1/2 bg-slate-50 rounded"></div>
              <div class="h-2 w-full bg-slate-50 rounded-full mt-8"></div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="h-64 bg-white rounded-2xl border border-slate-100 p-8"></div>
              <div class="h-64 bg-white rounded-2xl border border-slate-100 p-8"></div>
            </div>
          </div>
        }

        @if (!loading()) {
          <section
            class="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm relative overflow-hidden"
          >
            <div class="relative z-10">
              <div class="flex flex-col md:flex-row justify-between items-start gap-6">
                <div class="space-y-2">
                  <h1 class="text-4xl font-black text-slate-900 tracking-tight">
                    {{ project()?.name }}
                  </h1>
                  <p class="text-slate-500 max-w-2xl leading-relaxed font-medium">
                    {{ project()?.description }}
                  </p>
                </div>

                <div class="flex gap-3">
                  @if (project()?.status !== 'COMPLETED') {
                    <button
                      (click)="markProjectCompleted()"
                      class="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/10"
                    >
                      ✓ Complete Project
                    </button>
                  }
                  @if (project()?.status === 'COMPLETED') {
                    <span
                      class="px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-widest border border-emerald-100"
                    >
                      Project Completed
                    </span>
                  }
                </div>
              </div>

              <div class="mt-10">
                <div class="flex justify-between items-end mb-3">
                  <span
                    class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 font-mono"
                    >Project Completion</span
                  >
                  <span class="text-2xl font-black text-slate-900 tabular-nums">
                    {{ project()?.progressPercentage || 0
                    }}<span class="text-slate-900 ml-0.5">%</span>
                  </span>
                </div>

                <div
                  class="w-full bg-slate-200/50 rounded-full h-2.5 relative overflow-hidden border border-slate-100"
                >
                  <div
                    class="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                    [style.width.%]="project()?.progressPercentage || 0"
                  ></div>
                </div>

                <div class="mt-3 flex items-center justify-between">
                  <p
                    class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      [class]="
                        (project()?.progressPercentage || 0) === 100
                          ? 'bg-emerald-500'
                          : 'bg-slate-300'
                      "
                    ></span>
                    {{
                      (project()?.progressPercentage || 0) === 100
                        ? 'Fully Optimized'
                        : 'Active Workspace'
                    }}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <section class="lg:col-span-4 space-y-4">
              <div class="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm">
                <div class="flex justify-between items-center mb-6">
                  <h2 class="text-sm font-black uppercase tracking-widest text-slate-900">
                    Team <span class="text-slate-400 ml-1">{{ project()?.memberCount }}</span>
                  </h2>
                  <div class="flex items-center gap-1">
                    <button
                      (click)="toggleMembers()"
                      class="p-2 hover:bg-slate-50 rounded-lg transition"
                    >
                      <svg
                        [class.rotate-90]="membersExpanded()"
                        class="w-4 h-4 text-slate-400 transition-transform"
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
                      (click)="showInviteMember.set(true)"
                      class="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/10"
                    >
                      + Invite
                    </button>
                  </div>
                </div>

                @if (loadingMembers()) {
                  <div class="flex justify-center p-4">
                    <div
                      class="w-5 h-5 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"
                    ></div>
                  </div>
                }

                @if (membersExpanded()) {
                  <ul class="space-y-3">
                    @for (member of members(); track member.id) {
                      <li
                        class="group flex justify-between items-center p-3 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm"
                          >
                            {{ member.firstName.charAt(0) }}{{ member.lastName.charAt(0) }}
                          </div>
                          <div>
                            <p class="text-sm font-bold text-slate-900">
                              {{ member.firstName }} {{ member.lastName }}
                            </p>
                            <p class="text-[11px] text-slate-400 font-medium">{{ member.email }}</p>
                          </div>
                        </div>
                        @if (member.id === ownerId()) {
                          <span
                            class="text-[9px] font-black uppercase tracking-tighter bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100"
                            >Owner</span
                          >
                        } @else {
                          <button
                            (click)="removeMember(member.id)"
                            class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition"
                          >
                            <span class="text-xs font-bold">Remove</span>
                          </button>
                        }
                      </li>
                    }
                  </ul>
                  @if (membersHasMore() && !loadingMembers()) {
                    <button
                      (click)="fetchMembers(membersPage())"
                      class="w-full mt-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition uppercase tracking-widest"
                    >
                      Load More
                    </button>
                  }
                }
              </div>
            </section>

            <section class="lg:col-span-8 space-y-4">
              <div class="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm">
                <div class="flex justify-between items-center mb-8">
                  <h2 class="text-sm font-black uppercase tracking-widest text-slate-900">
                    Tasks <span class="text-slate-400 ml-1">{{ project()?.taskCount }}</span>
                  </h2>
                  <div class="flex items-center gap-3">
                    <button
                      (click)="toggleTasks()"
                      class="p-2 hover:bg-slate-50 rounded-lg transition"
                    >
                      <svg
                        [class.rotate-90]="tasksExpanded()"
                        class="w-4 h-4 text-slate-400 transition-transform"
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
                      class="px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/10"
                    >
                      + Add Task
                    </button>
                  </div>
                </div>

                @if (tasksExpanded()) {
                  @if (tasks().length === 0 && !loadingTasks()) {
                    <div
                      class="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl"
                    >
                      <p class="text-slate-400 font-medium text-sm">
                        No tasks assigned to this workspace yet.
                      </p>
                    </div>
                  }

                  <div class="grid grid-cols-1 gap-4">
                    @for (task of tasks(); track task.id) {
                      <div
                        class="group relative bg-white border border-slate-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all"
                      >
                        <div class="flex justify-between items-start gap-4">
                          <div class="space-y-1">
                            <h3 class="text-base font-bold text-slate-900 leading-tight">
                              {{ task.title }}
                            </h3>
                            <p class="text-sm text-slate-500 font-medium line-clamp-1 italic">
                              {{ task.description }}
                            </p>
                            <div class="flex items-center gap-2 pt-2">
                              <span
                                class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border"
                                [class]="
                                  task.isAssigned
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                    : 'bg-amber-50 text-amber-600 border-amber-100'
                                "
                              >
                                {{ task.isAssigned ? 'Assigned' : 'Unassigned' }}
                              </span>
                            </div>
                          </div>
                          <span
                            class="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm"
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
                      class="w-full mt-6 py-3 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition uppercase tracking-widest border border-dashed border-blue-200"
                    >
                      Load More Tasks
                    </button>
                  }
                }
              </div>
            </section>
          </div>
        }
      </div>

      @if (showInviteMember()) {
        <div
          class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-100 p-4"
        >
          <div
            class="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100 animate-in zoom-in-95 duration-200"
          >
            <h2 class="text-2xl font-black text-slate-900 mb-2 tracking-tight">Invite Member</h2>
            <p class="text-slate-500 text-sm mb-6">Expand your team for this project.</p>
            <div class="space-y-4">
              <input
                [(ngModel)]="inviteForm.name"
                placeholder="Full name"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-blue-600 transition outline-none"
              />
              <input
                [(ngModel)]="inviteForm.email"
                placeholder="Email address"
                type="email"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-blue-600 transition outline-none"
              />
            </div>
            <div class="flex gap-3 mt-8">
              <button
                (click)="closeInviteModal()"
                class="flex-1 py-3 text-sm font-bold text-slate-400 hover:bg-slate-50 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                (click)="inviteMember()"
                class="flex-1 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-slate-800 transition"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      }

      @if (showAddTask()) {
        <div
          class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-100 p-4"
        >
          <div
            class="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]"
          >
            <h2 class="text-2xl font-black text-slate-900 mb-2 tracking-tight">Create Task</h2>
            <p class="text-slate-500 text-sm mb-8">Define the objectives for this project phase.</p>

            <div class="space-y-5">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1"
                  >Title</label
                >
                <input
                  [(ngModel)]="newTask.title"
                  placeholder="Task title"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-blue-600 transition outline-none font-bold"
                />
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1"
                  >Description</label
                >
                <textarea
                  [(ngModel)]="newTask.description"
                  placeholder="Task description"
                  rows="3"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-blue-600 transition outline-none font-medium"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1"
                    >Priority</label
                  >
                  <select
                    [(ngModel)]="newTask.priority"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-blue-600 transition outline-none font-bold text-slate-700 appearance-none"
                  >
                    <option value="" disabled>Select</option>
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>

                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1"
                    >Due Date</label
                  >
                  <input
                    type="date"
                    [(ngModel)]="newTask.dueDate"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-blue-600 transition outline-none font-bold text-slate-700"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1"
                  >Assign Member</label
                >
                <select
                  [(ngModel)]="newTask.assigneeId"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-blue-600 transition outline-none font-bold text-slate-700 appearance-none"
                >
                  <option [ngValue]="null" disabled>Select a member</option>
                  @for (member of taskAssignees(); track member.id) {
                    <option [ngValue]="member.id">
                      {{ member.firstName }} {{ member.lastName }}
                    </option>
                  }
                </select>
              </div>
            </div>

            <div class="flex gap-3 mt-10">
              <button
                (click)="closeTaskModal()"
                class="flex-1 py-4 text-sm font-bold text-slate-400 hover:bg-slate-50 rounded-2xl transition"
              >
                Cancel
              </button>
              <button
                (click)="createTask()"
                class="flex-1 py-4 bg-slate-900 text-white text-sm font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      }

      @if (errorMessage()) {
        <div
          class="fixed bottom-8 right-8 z-200 bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold animate-in slide-in-from-right duration-300"
        >
          {{ errorMessage() }}
        </div>
      }

      @if (successMessage()) {
        <div
          class="fixed bottom-8 right-8 z-200 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold animate-in slide-in-from-right duration-300"
        >
          {{ successMessage() }}
        </div>
      }
    </div>
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
      TODO: 'bg-slate-50 text-slate-500 border-slate-200',
      IN_PROGRESS: 'bg-amber-50 text-amber-600 border-amber-100',
      COMPLETED: 'bg-emerald-50 text-emerald-600 border-emerald-100',
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
