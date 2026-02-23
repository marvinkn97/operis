import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SubscriptionsResource } from './subscription.resource';

@Component({
  selector: 'app-upgrade',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Container -->
      <div class="max-w-4xl mx-auto px-6 py-12">
        
        <!-- Header (Matches app feel) -->
        <div class="mb-8">
          <h1 class="text-3xl font-semibold text-gray-900 tracking-tight">
            Premium Features
          </h1>
          <p class="text-gray-600 mt-2">
            Unlock advanced productivity tools in OPERIS.
          </p>
        </div>

        <!-- Locked Feature Card -->
        <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          
          <!-- Feature Lock Badge -->
          <div class="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
            🔒 Premium Required
          </div>

          <h2 class="text-2xl font-semibold text-gray-900 mb-3">
            AI Assistant
          </h2>

          <p class="text-gray-600 mb-8 max-w-xl">
            Access the AI assistant to summarize tasks, generate insights,
            and boost your workflow directly inside your projects.
          </p>

          <!-- Features Grid (Subtle, Product-focused) -->
          <div class="grid md:grid-cols-2 gap-6 mb-10">
            <div class="border rounded-xl p-4">
              <h3 class="font-semibold text-gray-900 mb-1">
                ✨ AI Chat Assistant
              </h3>
              <p class="text-sm text-gray-600">
                Ask questions about your tasks and projects instantly.
              </p>
            </div>

            <div class="border rounded-xl p-4">
              <h3 class="font-semibold text-gray-900 mb-1">
                📊 CSV Task Export
              </h3>
              <p class="text-sm text-gray-600">
                Export filtered task data by status and date range.
              </p>
            </div>

            <div class="border rounded-xl p-4">
              <h3 class="font-semibold text-gray-900 mb-1">
                🚀 Priority Features
              </h3>
              <p class="text-sm text-gray-600">
                Early access to advanced productivity tools.
              </p>
            </div>

            <div class="border rounded-xl p-4">
              <h3 class="font-semibold text-gray-900 mb-1">
                🔐 Secure Billing
              </h3>
              <p class="text-sm text-gray-600">
                Managed securely via Stripe subscriptions.
              </p>
            </div>
          </div>

          <!-- Pricing + CTA -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t pt-6">
            
            <div>
              <p class="text-2xl font-bold text-gray-900">
                $5<span class="text-base font-medium text-gray-500">/month</span>
              </p>
              <p class="text-sm text-gray-500">
                Cancel anytime
              </p>
            </div>

            <button
              (click)="startCheckout()"
              [disabled]="loading()"
              class="px-6 py-3 rounded-lg bg-blue-700 text-white font-medium hover:bg-blue-800 transition disabled:opacity-50"
            >
              @if (loading()) {
                Redirecting to secure checkout...
              } @else {
                Upgrade to Premium
              }
            </button>
          </div>
        </div>

        <!-- Back Link -->
        <div class="mt-6">
          <a
            routerLink="/projects"
            class="text-sm text-gray-500 hover:text-gray-800"
          >
            ← Back to workspace
          </a>
        </div>
      </div>
    </div>
  `
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