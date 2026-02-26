import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SubscriptionsResource } from './subscription.resource';

@Component({
  selector: 'app-upgrade',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="min-h-screen bg-[#fafafa] pt-24 pb-12 px-6 relative overflow-hidden">
      <div
        class="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-100/40 rounded-full blur-[120px] -z-10"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-[120px] -z-10"
      ></div>

      <div class="max-w-4xl mx-auto relative z-10">
        <div class="mb-12">
          <span
            class="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2 block"
            >System Expansion</span
          >
          <h1 class="text-4xl font-black text-slate-900 tracking-tight">Level Up Your Workflow</h1>
          <p class="text-slate-500 mt-2 font-medium">
            Unlock the full neural potential of the Operis workspace.
          </p>
        </div>

        <div
          class="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
        >
          <div class="p-8 md:p-12">
            <div class="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
              <div class="space-y-4">
                <div
                  class="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                >
                  <span class="text-violet-400">✨</span> Premium Module
                </div>
                <h2 class="text-3xl font-black text-slate-900 leading-tight">
                  Operis Intelligence <br />& Advanced Tools
                </h2>
              </div>

              <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center min-w-40">
                <p class="text-3xl font-black text-slate-900">$5</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Per Month
                </p>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4 mb-12">
              <div
                class="group p-5 rounded-2xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all duration-300"
              >
                <div
                  class="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                >
                  <span class="text-xl">✨</span>
                </div>
                <h3 class="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">
                  Operis AI Assistant
                </h3>
                <p class="text-xs text-slate-500 leading-relaxed font-medium">
                  Full access to our neural engine for task summarization and insight generation.
                </p>
              </div>

              <div
                class="group p-5 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300"
              >
                <div
                  class="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                >
                  <span class="text-xl">📊</span>
                </div>
                <h3 class="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">
                  Master Data Export
                </h3>
                <p class="text-xs text-slate-500 leading-relaxed font-medium">
                  Comprehensive CSV exports with custom date ranges and status filtering.
                </p>
              </div>

              <div
                class="group p-5 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all duration-300"
              >
                <div
                  class="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center mb-4"
                >
                  <span class="text-xl">🚀</span>
                </div>
                <h3 class="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">
                  Beta Priority
                </h3>
                <p class="text-xs text-slate-500 leading-relaxed font-medium">
                  Automatic enrollment in early access for all upcoming productivity modules.
                </p>
              </div>

              <div
                class="group p-5 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all duration-300"
              >
                <div
                  class="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center mb-4"
                >
                  <span class="text-xl">🔐</span>
                </div>
                <h3 class="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">
                  Enterprise Security
                </h3>
                <p class="text-xs text-slate-500 leading-relaxed font-medium">
                  Encrypted billing cycles and secure subscription management via Stripe.
                </p>
              </div>
            </div>

            <div class="flex flex-col items-center gap-4">
              <button
                (click)="startCheckout()"
                [disabled]="loading()"
                class="w-full py-5 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-900/20 active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-3"
              >
                @if (loading()) {
                  <div
                    class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  ></div>
                  Initializing Secure Checkout...
                } @else {
                  Authorize Premium Access
                }
              </button>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Billed monthly • Cancel anytime with one click
              </p>
            </div>
          </div>
        </div>

        <div class="mt-10 flex justify-center">
          <a
            routerLink="/projects"
            class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition flex items-center gap-2"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Return to Workspace
          </a>
        </div>
      </div>
    </div>
  `,
})
export class Subscription {
  private subscriptions = inject(SubscriptionsResource);
  loading = signal(false);

  async startCheckout() {
    try {
      this.loading.set(true);
      const res = await this.subscriptions.createCheckoutSession();

      console.log('Backend Response:', res); // <--- Check your browser console!

      // Check for common Stripe response variations
      const targetUrl = res.checkoutUrl || (res as any).url;

      if (targetUrl) {
        window.location.href = targetUrl;
      } else {
        console.error('No URL found in response', res);
        this.loading.set(false);
      }
    } catch (e) {
      console.error('Checkout failed', e);
      this.loading.set(false);
    }
  }
}
