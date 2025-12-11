import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-get-started',
  imports: [],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">Welcome to Operis Project Management</h1>
      <p class="text-lg text-gray-600 mb-8 text-center max-w-xl">
        Manage your projects efficiently, track tasks, and collaborate seamlessly with your team.
      </p>
      <button
        (click)="goToProjects()"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
      >
        Get Started
      </button>
    </div>
  `
})
export class GetStarted {
  constructor(private router: Router) {}

  goToProjects() {
    this.router.navigate(['/projects']);
  }
}
