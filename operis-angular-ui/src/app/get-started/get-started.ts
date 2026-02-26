import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-get-started',
  imports: [],
  template: `
    <div
      class="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] relative overflow-hidden"
    >
      <div
        class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50"
      ></div>
      <div
        class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50"
      ></div>

      <div class="relative z-10 flex flex-col items-center text-center px-6">
        <span
          class="px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full border border-blue-100"
        >
          v2.0 Now Live
        </span>

        <h1
          class="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 max-w-3xl"
        >
          Manage projects with
          <span class="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600"
            >precision.</span
          >
        </h1>

        <p class="text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed">
          The all-in-one workspace for Operis teams to track tasks, sync workflows, and hit
          deadlines—without the friction.
        </p>

        <button
          (click)="goToProjects()"
          class="group relative px-8 py-4 bg-slate-900 text-white font-medium rounded-xl shadow-2xl shadow-blue-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
        >
          Get Started
          <span class="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </button>

        <p class="mt-12 text-sm text-slate-400 font-medium italic">
          Trusted by high-performance teams at Operis.
        </p>
      </div>
    </div>
  `,
})
export class GetStarted {
  constructor(private router: Router) {}

  goToProjects() {
    this.router.navigate(['/projects']);
  }
}
