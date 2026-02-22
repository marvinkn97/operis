import { Component, HostListener, signal } from '@angular/core';
import { ProjectResource } from '../project.resource';
import { FormsModule } from '@angular/forms';
import { ProjectRequest } from '../project.request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Projects</h1>

      <div class="flex justify-end mb-4">
        <button
          (click)="openAddModal()"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
        >
          + Add Project
        </button>
      </div>

      <!-- Loading Skeleton -->
      @if (store.loading()) {
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 animate-pulse">
          @for (_ of placeholders; track $index) {
            <div class="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
            <div class="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div class="h-full bg-gray-300 w-1/2"></div>
            </div>
            <div class="flex justify-between text-sm text-gray-400">
              <span class="h-3 w-16 bg-gray-200 rounded"></span>
              <span class="h-3 w-16 bg-gray-200 rounded"></span>
            </div>
            <div class="flex justify-end gap-2 mt-4">
              <span class="h-6 w-16 bg-gray-200 rounded"></span>
              <span class="h-6 w-16 bg-gray-200 rounded"></span>
              <span class="h-6 w-16 bg-gray-200 rounded"></span>
            </div>
          }
        </div>
      }

      <!-- Error -->
      @if (store.error()) {
        <p class="text-red-600">{{ store.error() }}</p>
      }

      <!-- Empty state -->
      @if (!store.loading() && store.projects().length === 0) {
        <p class="text-gray-500">No projects found.</p>
      }

      <!-- Projects Grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        @for (project of store.projects(); track project?.id) {
          <div class="border rounded-xl shadow-sm p-5 bg-white hover:shadow-md transition">
            <h2 class="font-semibold text-lg truncate">{{ project.name }}</h2>
            <p class="text-gray-600 mt-1 text-sm line-clamp-2">{{ project.description }}</p>

            <!-- Progress -->
            <div class="mt-4">
              <div class="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span class="font-medium">{{ project.progressPercentage }}%</span>
              </div>
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-blue-600 transition-all"
                  [style.width.%]="project.progressPercentage"
                ></div>
              </div>
            </div>

            <!-- Stats -->
            <div class="flex justify-between mt-4 text-sm text-gray-700">
              <span>📝 {{ project.taskCount }} Tasks</span>
              <span>👥 {{ project.memberCount }} Members</span>
            </div>

            <!-- Actions -->
            <div class="mt-4 flex justify-end gap-2">
              <button
                (click)="openProject(project.id)"
                class="text-sm px-3 py-1 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
              >
                Open
              </button>
              <button
                (click)="openEditModal(project)"
                class="text-sm px-3 py-1 rounded border border-yellow-400 text-yellow-600 hover:bg-yellow-50 transition"
                title="Edit Project"
              >
                Edit
              </button>
              <button
                (click)="openDeleteModal(project)"
                class="text-sm px-3 py-1 rounded border border-red-600 text-red-600 hover:bg-red-50 transition"
                title="Delete Project"
              >
                Delete
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Loading more / no more -->
      @if (store.loading()) {
        <p class="mt-4 text-center text-gray-500">Loading more...</p>
      }
      @if (!store.hasMore() && store.projects().length > 0) {
        <p class="mt-4 text-center text-gray-400">No more projects</p>
      }
    </div>

    <!-- Add Modal -->
    @if (showAddModal()) {
      <div class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div class="bg-white p-6 rounded-xl shadow-xl w-96">
          <h2 class="text-xl font-semibold mb-4">Create Project</h2>
          <div class="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Project name"
              class="border rounded-lg p-2"
              [(ngModel)]="newProject().name"
            />
            <textarea
              placeholder="Project description"
              class="border rounded-lg p-2"
              rows="3"
              [(ngModel)]="newProject().description"
            ></textarea>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button (click)="closeAddModal()" class="px-4 py-2 rounded-lg border hover:bg-gray-100">
              Cancel
            </button>
            <button
              (click)="createProject()"
              class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Edit Modal -->
    @if (showEditModal()) {
      <div class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div class="bg-white p-6 rounded-xl shadow-xl w-96">
          <h2 class="text-xl font-semibold mb-4">Edit Project</h2>
          <div class="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Project name"
              class="border rounded-lg p-2"
              [(ngModel)]="editingProject.name"
            />
            <textarea
              placeholder="Project description"
              class="border rounded-lg p-2"
              rows="3"
              [(ngModel)]="editingProject.description"
            ></textarea>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button
              (click)="closeEditModal()"
              class="px-4 py-2 rounded-lg border hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              (click)="updateProject()"
              class="px-4 py-2 rounded-lg bg-yellow-400 text-white hover:bg-yellow-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Delete Modal -->
    @if (showDeleteModal()) {
      <div class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div class="bg-white p-6 rounded-xl shadow-xl w-96">
          <h2 class="text-xl font-semibold mb-4 text-red-600">Delete Project</h2>
          <p class="text-gray-700">
            Are you sure you want to delete
            <span class="font-semibold">{{ projectToDelete?.name }}</span
            >?
          </p>
          <div class="flex justify-end gap-3 mt-6">
            <button
              (click)="closeDeleteModal()"
              class="px-4 py-2 rounded-lg border hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              (click)="confirmDelete()"
              class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Toasts -->
    @if (updateSuccessMessage()) {
      <div class="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow">
        {{ updateSuccessMessage() }}
      </div>
    }
    @if (updateErrorMessage()) {
      <div class="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-2 rounded shadow">
        {{ updateErrorMessage() }}
      </div>
    }
    @if (createSuccessMessage()) {
      <div class="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow">
        {{ createSuccessMessage() }}
      </div>
    }
    @if (createErrorMessage()) {
      <div class="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-2 rounded shadow">
        {{ createErrorMessage() }}
      </div>
    }
    @if (deleteSuccessMessage()) {
      <div class="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow">
        {{ deleteSuccessMessage() }}
      </div>
    }
    @if (deleteErrorMessage()) {
      <div class="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-2 rounded shadow">
        {{ deleteErrorMessage() }}
      </div>
    }
  `,
})
export class ProjectsPage {
  showAddModal = signal(false);
  newProject = signal({ name: '', description: '' });

  editingProjectId: string | null = null;
  editingProject: ProjectRequest = { name: '', description: '' };
  showEditModal = signal(false);

  showDeleteModal = signal(false);
  projectToDelete: { id: string; name: string } | null = null;

  updateSuccessMessage = signal<string | null>(null);
  updateErrorMessage = signal<string | null>(null);
  createSuccessMessage = signal<string | null>(null);
  createErrorMessage = signal<string | null>(null);
  deleteSuccessMessage = signal<string | null>(null);
  deleteErrorMessage = signal<string | null>(null);

  placeholders = Array(3); // skeleton placeholders

  constructor(
    public store: ProjectResource,
    private router: Router,
  ) {
    this.store.reset();
    this.store.fetchProjects();
  }

  openAddModal() {
    this.showAddModal.set(true);
  }
  closeAddModal() {
    this.showAddModal.set(false);
    this.newProject.set({ name: '', description: '' });
  }
  openEditModal(project: ProjectRequest & { id: string }) {
    this.editingProjectId = project.id;
    this.editingProject = { ...project };
    this.showEditModal.set(true);
  }
  closeEditModal() {
    this.showEditModal.set(false);
    this.editingProjectId = null;
    this.editingProject = { name: '', description: '' };
  }
  openDeleteModal(project: ProjectRequest & { id: string }) {
    this.projectToDelete = { id: project.id, name: project.name };
    this.showDeleteModal.set(true);
  }
  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.projectToDelete = null;
  }

  async createProject() {
    const project = this.newProject();
    if (!project.name.trim()) return;
    this.store.createProject(project).subscribe({
      next: () => {
        this.closeAddModal();
        this.store.reset();
        this.store.fetchProjects();
        this.createSuccessMessage.set('Project created successfully!');
        setTimeout(() => this.createSuccessMessage.set(null), 3000);
      },
      error: (err) => {
        this.createErrorMessage.set(err.message || 'Failed to create project');
        setTimeout(() => this.createErrorMessage.set(null), 3000);
      },
    });
  }

  updateProject() {
    if (!this.editingProjectId || !this.editingProject.name.trim()) return;
    this.store.updateProject(this.editingProjectId, this.editingProject).subscribe({
      next: () => {
        this.store.reset();
        this.store.fetchProjects();
        this.closeEditModal();
        this.updateSuccessMessage.set('Project updated successfully!');
        setTimeout(() => this.updateSuccessMessage.set(null), 3000);
      },
      error: (err) => {
        this.updateErrorMessage.set(err.message || 'Failed to update project');
        setTimeout(() => this.updateErrorMessage.set(null), 3000);
      },
    });
  }

  confirmDelete() {
    if (!this.projectToDelete) return;
    this.store.deleteProject(this.projectToDelete.id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.store.reset();
        this.store.fetchProjects();
        this.deleteSuccessMessage.set('Project deleted successfully!');
        setTimeout(() => this.deleteSuccessMessage.set(null), 3000);
      },
      error: (err: any) => {
        this.deleteErrorMessage.set(err.message || 'Failed to delete project');
        setTimeout(() => this.deleteErrorMessage.set(null), 3000);
      },
    });
  }

  openProject(id: string) {
    this.router.navigate(['/projects', id]);
  }

  @HostListener('window:scroll')
  onScroll() {
    if (this.store.loading() || !this.store.hasMore()) return;
    const scrollPos = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 300;
    if (scrollPos >= threshold) this.store.fetchProjects();
  }
}
