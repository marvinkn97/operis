import { Component, signal, HostListener } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router, RouterModule } from '@angular/router';
import { SubscriptionsResource } from '../../subscription/subscription.resource';
import { AiChatResource } from '../ai-chat/ai-chat.resource';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav
      [class]="
        isScrolled()
          ? 'fixed top-0 w-full z-100 px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all duration-300'
          : 'fixed top-0 w-full z-100 px-8 py-6 bg-transparent transition-all duration-300'
      "
    >
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20"
          >
            <span class="font-bold text-lg italic">O</span>
          </div>
          <span class="text-2xl font-bold tracking-tighter text-slate-900 uppercase">Operis</span>
        </div>

        <div class="hidden md:flex items-center gap-8">
          @if (isLoggedIn()) {
            <button
              (click)="onAiClick()"
              class="group relative flex items-center gap-2.5 px-5 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-slate-800 hover:border-violet-500/50 active:scale-95 overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-linear-to-r from-violet-600/0 via-violet-600/10 to-violet-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              ></div>

              <span class="relative flex h-3 w-3">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"
                ></span>
                <span
                  class="relative inline-flex rounded-full h-3 w-3 text-xs items-center justify-center"
                  >✨</span
                >
              </span>

              <span class="relative z-10 tracking-widest">Operis AI</span>

              <svg
                class="relative z-10 w-3 h-3 text-slate-500 group-hover:text-violet-400 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
            <a
              routerLink="/projects"
              routerLinkActive="text-blue-600"
              class="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >Projects</a
            >
            <a
              routerLink="/action-center"
              routerLinkActive="text-blue-600"
              class="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >Action Center</a
            >
            <a
              routerLink="/tasks"
              routerLinkActive="text-blue-600"
              class="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >Tasks</a
            >

            <a
              routerLink="/profile"
              routerLinkActive="text-blue-600"
              class="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >Profile</a
            >

            <button
              (click)="openLogoutModal()"
              class="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors ml-4"
            >
              Logout
            </button>
          }
        </div>

        @if (isLoggedIn()) {
          <button class="md:hidden p-2 text-slate-900" (click)="toggleMenu()">
            <span class="text-2xl font-bold">{{ mobileMenuOpen() ? '✕' : '☰' }}</span>
          </button>
        }
      </div>
    </nav>

    @if (mobileMenuOpen() && isLoggedIn()) {
      <div
        class="fixed inset-0 z-90 bg-white pt-20 px-8 flex flex-col animate-in fade-in duration-200"
      >
        <div class="flex flex-col mt-4">
          <a
            routerLink="/projects"
            (click)="toggleMenu()"
            class="text-base font-semibold text-slate-700 py-3 border-b border-slate-50"
            >Projects</a
          >
          <a
            routerLink="/action-center"
            (click)="toggleMenu()"
            class="text-base font-semibold text-slate-700 py-3 border-b border-slate-50"
            >Action Center</a
          >
          <a
            routerLink="/tasks"
            (click)="toggleMenu()"
            class="text-base font-semibold text-slate-700 py-3 border-b border-slate-50"
            >Tasks</a
          >
          <a
            routerLink="/profile"
            (click)="toggleMenu()"
            class="text-base font-semibold text-slate-700 py-3 border-b border-slate-50"
            >Profile</a
          >

          <button
            (click)="onAiClick(); toggleMenu()"
            class="text-left text-base font-semibold text-slate-700 py-4 flex items-center gap-2"
          >
            <span>✨</span> Operis AI
          </button>
        </div>

        <button
          (click)="openLogoutModal(); toggleMenu()"
          class="mt-auto mb-10 text-left text-xs font-bold text-slate-400 uppercase tracking-widest"
        >
          Logout
        </button>
      </div>
    }

    @if (showLogoutModal()) {
      <div
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-200 p-4"
      >
        <div
          class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm border border-slate-100 animate-in zoom-in-95 duration-200"
        >
          <h2 class="text-2xl font-bold text-slate-900 mb-2">Sign Out?</h2>
          <p class="text-slate-500 mb-8 leading-relaxed">
            You'll need to log back in to access your active projects and team tasks.
          </p>
          <div class="flex gap-3">
            <button
              (click)="closeLogoutModal()"
              class="flex-1 px-4 py-3 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              (click)="logout()"
              class="flex-1 px-4 py-3 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 transition shadow-lg shadow-red-500/20"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class Navbar {
  showLogoutModal = signal(false);
  mobileMenuOpen = signal(false);
  isScrolled = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private subscriptionsResource: SubscriptionsResource,
    private aiChatResource: AiChatResource,
  ) {}

  isLoggedIn() {
    return this.oauthService.hasValidAccessToken();
  }

  toggleMenu() {
    this.mobileMenuOpen.update((v) => !v);
  }

  openLogoutModal() {
    this.showLogoutModal.set(true);
  }

  closeLogoutModal() {
    this.showLogoutModal.set(false);
  }

  logout() {
    this.oauthService.logOut();
    this.showLogoutModal.set(false);
  }

  onAiClick() {
    if (!this.subscriptionsResource.isPremium()) {
      this.router.navigate(['/upgrade']);
      return;
    }
    this.aiChatResource.open();
  }
}
