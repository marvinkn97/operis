import { Component } from '@angular/core';

@Component({
  selector: 'app-error-page',
  standalone: true,
  template: `
    <div class="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h1 class="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p class="text-lg text-gray-700 mb-6">The page you are looking for does not exist.</p>

      <a
        routerLink="/"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Go Home
      </a>
    </div>
  `
})
export class ErrorPage {}
