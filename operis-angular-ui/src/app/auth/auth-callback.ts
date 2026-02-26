import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  standalone: true,
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] relative overflow-hidden">
      
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50"></div>

      <div class="relative z-10 flex flex-col items-center">
        <div class="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-900/20 mb-8 animate-pulse">
          <span class="font-bold text-2xl italic">O</span>
        </div>

        <div class="text-center px-6">
          <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Authenticating<span class="text-blue-600">.</span>
          </h2>
          <p class="text-lg text-slate-500 max-w-xs mx-auto leading-relaxed">
            Just a moment while we securely prepare your workspace.
          </p>
        </div>

        <div class="mt-10 flex items-center gap-2">
          <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        </div>

        <p class="mt-16 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          Operis Security Protocol
        </p>
      </div>
    </div>
  `
})
export class AuthCallbackComponent implements OnInit {
  private oauth = inject(OAuthService);
  private router = inject(Router);

  async ngOnInit() {
    try {
      await this.oauth.loadDiscoveryDocumentAndTryLogin();

      if (this.oauth.hasValidAccessToken()) {
        // Short delay to ensure the user sees the smooth transition
        await this.router.navigateByUrl('/projects');
      } else {
        this.oauth.initLoginFlow();
      }
    } catch (e) {
      console.error('Login failed', e);
      this.oauth.initLoginFlow();
    }
  }
}