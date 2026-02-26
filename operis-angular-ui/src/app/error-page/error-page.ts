import { Component } from '@angular/core';

@Component({
  selector: 'app-error-page',
  standalone: true,
  template: `
    <div
      class="min-h-screen flex flex-col justify-center items-center bg-[#fafafa] px-6 relative overflow-hidden"
    >
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-50/50 rounded-full blur-[120px] -z-10"
      ></div>

      <div class="text-center max-w-md">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/50 mb-8"
        >
          <span class="text-3xl animate-pulse">🛰️</span>
        </div>

        <span class="block text-[10px] font-black uppercase tracking-[0.4em] text-red-500 mb-4"
          >Error Code: 404 // Connection Lost</span
        >

        <h1 class="text-5xl font-black text-slate-900 tracking-tight mb-6">Node Not Found</h1>

        <p class="text-slate-500 font-medium leading-relaxed mb-10">
          The requested resource path does not exist within the Operis workspace. The node may have
          been relocated or purged.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            routerLink="/"
            class="px-8 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
          >
            Re-route to Dashboard
          </a>

          <button
            onclick="history.back()"
            class="px-8 py-4 bg-white border border-slate-200 text-slate-400 text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:text-slate-900 hover:border-slate-900 transition-all active:scale-95"
          >
            Back to Safety
          </button>
        </div>
      </div>

      <div class="absolute bottom-12 left-0 w-full text-center">
        <p class="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
          Operis Recovery Protocol v2.4.0
        </p>
      </div>
    </div>
  `,
})
export class ErrorPage {}
