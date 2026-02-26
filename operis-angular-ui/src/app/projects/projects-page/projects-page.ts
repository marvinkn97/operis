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
    <div class="min-h-screen bg-[#fafafa] pt-24 pb-12 px-6">
      <div class="max-w-6xl mx-auto">
        
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 class="text-4xl font-black text-slate-900 tracking-tight">Projects</h1>
          </div>
          <button
            (click)="openAddModal()"
            class="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition active:scale-95"
          >
            + Add Project
          </button>
        </div>

        @if (store.loading()) {
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 animate-pulse">
            @for (_ of placeholders; track $index) {
              <div class="bg-white border border-slate-100 rounded-2xl p-6">
                <div class="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div class="h-4 bg-slate-100 rounded w-full mb-2"></div>
                <div class="h-4 bg-slate-100 rounded w-5/6 mb-6"></div>
                <div class="h-2 bg-slate-100 rounded-full mb-4"></div>
                <div class="flex justify-between"><div class="h-3 w-16 bg-slate-100 rounded"></div><div class="h-3 w-16 bg-slate-100 rounded"></div></div>
              </div>
            }
          </div>
        }

        @if (store.error()) {
          <div class="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl font-medium">
            {{ store.error() }}
          </div>
        }

        @if (!store.loading() && store.projects().length === 0) {
          <div class="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
            <p class="text-slate-400 font-medium">No projects found.</p>
          </div>
        }

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          @for (project of store.projects(); track project?.id) {
            <div class="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 group">
              <h2 class="font-bold text-xl text-slate-900 truncate tracking-tight">{{ project.name }}</h2>
              <p class="text-slate-500 mt-2 text-sm line-clamp-2 leading-relaxed h-10">{{ project.description }}</p>

              <div class="mt-6">
                <div class="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Progress</span>
                  <span class="text-slate-900">{{ project.progressPercentage }}%</span>
                </div>
                <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-emerald-600 transition-all duration-700"
                    [style.width.%]="project.progressPercentage"
                  ></div>
                </div>
              </div>

              <div class="flex justify-between mt-6 pt-6 border-t border-slate-50 text-xs font-bold text-slate-600">
                <span class="bg-slate-50 px-2 py-1 rounded">📝 {{ project.taskCount }} Tasks</span>
                <span class="bg-slate-50 px-2 py-1 rounded">👥 {{ project.memberCount }} Members</span>
              </div>

              <div class="mt-6 flex justify-end gap-2">
                <button (click)="openProject(project.id)" class="text-xs font-bold px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition uppercase tracking-widest">
                  Open
                </button>
                <button (click)="openEditModal(project)" class="text-xs font-bold px-4 py-2 rounded-lg border border-amber-200 text-amber-600 hover:bg-amber-50 transition" title="Edit Project">
                  Edit
                </button>
                <button (click)="openDeleteModal(project)" class="text-xs font-bold px-4 py-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition" title="Delete Project">
                  Delete
                </button>
              </div>
            </div>
          }
        </div>

        @if (store.loading()) {
          <p class="mt-8 text-center text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Loading more...</p>
        }
        @if (!store.hasMore() && store.projects().length > 0) {
          <p class="mt-8 text-center text-slate-300 text-xs font-medium">End of workspace</p>
        }
      </div>
    </div>

    @if (showAddModal()) {
      <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div class="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
          <h2 class="text-2xl font-black text-slate-900 mb-2">Create Project</h2>
          <p class="text-slate-500 text-sm mb-6">Enter the details for your new workspace.</p>
          <div class="flex flex-col gap-4">
            <input type="text" placeholder="Project name" class="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition" [(ngModel)]="newProject().name" />
            <textarea placeholder="Project description" class="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition" rows="3" [(ngModel)]="newProject().description"></textarea>
          </div>
          <div class="flex justify-end gap-3 mt-8">
            <button (click)="closeAddModal()" class="px-6 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition">Cancel</button>
            <button (click)="createProject()" class="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold shadow-lg hover:bg-slate-800 transition">Create</button>
          </div>
        </div>
      </div>
    }

    @if (showEditModal()) {
      <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div class="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
          <h2 class="text-2xl font-black text-slate-900 mb-6 italic">Edit Project</h2>
          <div class="flex flex-col gap-4">
            <input type="text" class="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-amber-500 transition" [(ngModel)]="editingProject.name" />
            <textarea class="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-amber-500 transition" rows="3" [(ngModel)]="editingProject.description"></textarea>
          </div>
          <div class="flex justify-end gap-3 mt-8">
            <button (click)="closeEditModal()" class="px-6 py-3 font-bold text-slate-400">Cancel</button>
            <button (click)="updateProject()" class="px-6 py-3 rounded-xl bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition">Save Changes</button>
          </div>
        </div>
      </div>
    }

    @if (showDeleteModal()) {
      <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 text-center">
        <div class="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
          <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">!</div>
          <h2 class="text-2xl font-black text-slate-900 mb-2">Delete Project</h2>
          <p class="text-slate-500 mb-8">Are you sure you want to delete <span class="text-slate-900 font-bold">{{ projectToDelete?.name }}</span>? This cannot be undone.</p>
          <div class="flex justify-end gap-3">
            <button (click)="closeDeleteModal()" class="flex-1 py-3 font-bold text-slate-400">Cancel</button>
            <button (click)="confirmDelete()" class="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-700 transition">Delete</button>
          </div>
        </div>
      </div>
    }

    @if (updateSuccessMessage()) {
      <div class="fixed bottom-6 right-6 z-200 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl font-bold animate-in slide-in-from-right duration-300">
        {{ updateSuccessMessage() }}
      </div>
    }
    @if (updateErrorMessage()) {
      <div class="fixed bottom-6 right-6 z-200 bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl font-bold animate-in slide-in-from-right duration-300">
        {{ updateErrorMessage() }}
      </div>
    }
    @if (createSuccessMessage()) {
      <div class="fixed bottom-6 right-6 z-200 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl font-bold animate-in slide-in-from-right duration-300">
        {{ createSuccessMessage() }}
      </div>
    }
    @if (createErrorMessage()) {
      <div class="fixed bottom-6 right-6 z-200 bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl font-bold animate-in slide-in-from-right duration-300">
        {{ createErrorMessage() }}
      </div>
    }
    @if (deleteSuccessMessage()) {
      <div class="fixed bottom-6 right-6 z-200 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl font-bold animate-in slide-in-from-right duration-300">
        {{ deleteSuccessMessage() }}
      </div>
    }
    @if (deleteErrorMessage()) {
      <div class="fixed bottom-6 right-6 z-200 bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl font-bold animate-in slide-in-from-right duration-300">
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
