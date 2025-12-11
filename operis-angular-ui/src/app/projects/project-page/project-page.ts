import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectResource } from '../project.resource';

@Component({
  selector: 'app-project-page',
  standalone: true,
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      @if(project()) {
        <h1 class="text-3xl font-bold">{{ project()?.name }}</h1>
        <p class="text-gray-600 mt-2">{{ project()?.description }}</p>
      } @else {
        <p class="text-gray-500">Loading project...</p>
      }

      @if(errorMessage()) {
        <p class="text-red-600 mt-4">{{ errorMessage() }}</p>
      }
    </div>
  `,
})
export class ProjectPage implements OnInit {
  project = signal<{ id: string; name: string; description: string } | null>(null);
  errorMessage = signal<string | null>(null);

  constructor(private route: ActivatedRoute, private store: ProjectResource) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage.set('Invalid project ID');
      return;
    }

    this.store.getProjectById(id).subscribe({
      next: (p) => this.project.set(p),
      error: (err: any) =>
        this.errorMessage.set(err.message || 'Failed to load project'),
    });
  }
}
