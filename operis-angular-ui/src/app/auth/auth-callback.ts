// auth-callback.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  standalone: true,
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div class="bg-white p-8 rounded-xl shadow-xl w-96 text-center">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">Signing You In</h2>
        <p class="text-gray-600 mb-6">
          Just a moment while we securely sign you in...
        </p>
        <div class="flex justify-center mb-6">
          <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
        <p class="text-sm text-gray-500">
          If this takes too long, please check your internet connection.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .loader {
      border-top-color: #3b82f6; /* Tailwind blue-500 */
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class AuthCallbackComponent implements OnInit {
  private oauth = inject(OAuthService);
  private router = inject(Router);

  async ngOnInit() {
    await this.oauth.loadDiscoveryDocumentAndTryLogin();

    if (this.oauth.hasValidAccessToken()) {
      await this.router.navigateByUrl('/projects');
    } else {
      this.oauth.initLoginFlow();
    }
  }
}
