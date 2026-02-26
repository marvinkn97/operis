import { Component, HostListener, signal } from '@angular/core';
import { Task } from './task.model';
import { TaskResource } from './task.resource';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-assigned-tasks',
  imports: [NgClass],
  standalone: true,
  template: `
    <div class="min-h-screen bg-[#fafafa] pt-24 pb-12 px-6">
      <div class="max-w-6xl mx-auto">
        
        <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 class="text-4xl font-black text-slate-900 tracking-tight">Task Ledger</h1>
            <p class="text-slate-500 mt-2 font-medium">
              You are currently managing <span class="text-slate-900 font-bold underline decoration-emerald-500/30">{{ totalTasks() }} assigned</span> objectives.
            </p>
          </div>
          
          <div class="px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-3">
            <span class="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-600">System Ready</span>
          </div>
        </div>

        <div
          class="hidden sm:grid grid-cols-[1fr_2fr_120px_120px_160px] gap-6 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] mb-4 shadow-xl shadow-slate-900/10"
        >
          <span>Objective</span>
          <span>Brief</span>
          <span class="text-center">Deadline</span>
          <span class="text-center">Priority</span>
          <span class="text-right">Command</span>
        </div>

        <div class="space-y-3">
          @for (task of tasks(); track task.id) {
            <div class="bg-white rounded-2xl border border-slate-200/60 p-5 sm:hidden flex flex-col gap-4 shadow-sm">
              <div class="flex justify-between items-start">
                <div class="space-y-1">
                  <span class="text-xs font-black text-slate-900 leading-tight block">{{ task.title }}</span>
                  <span class="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-tighter">Due: {{ task.dueDate || 'N/A' }}</span>
                </div>
                <span class="px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border" [ngClass]="getPriorityClass(task.priority)">
                  {{ task.priority || 'NORMAL' }}
                </span>
              </div>
              <p class="text-slate-600 text-sm leading-relaxed">{{ task.description }}</p>
              <button (click)="completeTask(task)"
                      class="w-full py-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 transition active:scale-95">
                Execute Completion
              </button>
            </div>

            <div class="hidden sm:grid grid-cols-[1fr_2fr_120px_120px_160px] gap-6 items-center bg-white border border-slate-200/60 rounded-2xl px-6 py-4 hover:shadow-md transition-all duration-300 group">
              <div class="text-sm font-black text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors">{{ task.title }}</div>
              <div class="text-sm text-slate-500 font-medium line-clamp-2 italic leading-snug">{{ task.description }}</div>
              <div class="text-[11px] font-mono text-slate-400 text-center uppercase">{{ task.dueDate || 'N/A' }}</div>
              <div class="flex justify-center">
                <span class="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border" [ngClass]="getPriorityClass(task.priority)">
                  {{ task.priority || 'NORMAL' }}
                </span>
              </div>
              <div class="flex justify-end">
                <button (click)="completeTask(task)"
                        class="px-4 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition shadow-lg shadow-slate-900/5 active:scale-95">
                  Complete
                </button>
              </div>
            </div>
          }
        </div>

        <div class="mt-12">
          @if (loading()) {
            <div class="flex justify-center p-8">
               <div class="w-6 h-6 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
            </div>
          }

          @if (!loading() && tasks().length > 0 && tasks().length >= totalTasks()) {
            <p class="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">End of Ledger</p>
          }

          @if (!loading() && tasks().length === 0) {
            <div class="text-center py-20 border-2 border-dashed border-slate-200 rounded-4xl bg-white/50">
              <div class="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
              <p class="text-lg font-black text-slate-900 tracking-tight">Workspace Clear</p>
              <p class="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-widest">All objectives successfully executed</p>
            </div>
          }
        </div>
      </div>

      @if (successMessage()) {
        <div class="fixed bottom-8 right-8 z-200 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold animate-in slide-in-from-right duration-300">
          {{ successMessage() }}
        </div>
      }

      @if (errorMessage()) {
        <div class="fixed bottom-8 right-8 z-200 bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold animate-in slide-in-from-right duration-300">
          {{ errorMessage() }}
        </div>
      }
    </div>
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
      case 'HIGH': return 'bg-red-50 text-red-600 border-red-100';
      case 'MEDIUM': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'LOW': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
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