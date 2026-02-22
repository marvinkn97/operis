import { Component, signal } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <div class="text-2xl font-semibold tracking-widest text-gray-900">O P E R I S</div>

      <!-- Desktop menu -->
      <div class="hidden md:flex items-center gap-6">
        @if (isLoggedIn()) {
        <a routerLink="/projects" class="text-gray-700 hover:text-blue-700 font-medium">
          Projects
        </a>
         <a routerLink="/tasks" class="text-gray-700 hover:text-blue-700 font-medium">
          Tasks
        </a>
        <a routerLink="/action-center" class="text-gray-700 hover:text-blue-700 font-medium">
          Action Center
        </a>
        <a routerLink="/profile" class="text-gray-700 hover:text-blue-700 font-medium"> Profile </a>

        <button
          (click)="openLogoutModal()"
          class="px-4 py-2 rounded-lg border border-blue-700 text-blue-700 hover:bg-blue-50 transition font-medium"
        >
          Logout
        </button>
        }
      </div>

      <!-- Mobile Hamburger -->
      @if (isLoggedIn()) {
      <button class="md:hidden text-gray-600 hover:text-black text-3xl" (click)="toggleMenu()">
        ☰
      </button>
      }
    </nav>

    <!-- Mobile Dropdown Menu -->
    @if (mobileMenuOpen() && isLoggedIn()) {
    <div class="md:hidden bg-white shadow-md px-6 py-4 flex flex-col gap-4">
      <a
        routerLink="/projects"
        (click)="toggleMenu()"
        class="text-gray-800 hover:text-blue-700 font-medium"
      >
        Projects
      </a>
      <a
        routerLink="/action-center"
        (click)="toggleMenu()"
        class="text-gray-800 hover:text-blue-700 font-medium"
      >
        Action Center
      </a>

      <a
        routerLink="/profile"
        (click)="toggleMenu()"
        class="text-gray-800 hover:text-blue-700 font-medium"
      >
        Profile
      </a>

      <button
        (click)="openLogoutModal(); toggleMenu()"
        class="text-left text-gray-800 hover:text-blue-700 font-medium"
      >
        Logout
      </button>
    </div>
    }

    <!-- Logout Modal -->
    @if (showLogoutModal()) {
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-xl shadow-lg p-6 w-80">
        <h2 class="text-lg font-semibold mb-4">Confirm Logout</h2>
        <p class="text-gray-600 mb-6">Are you sure you want to log out?</p>

        <div class="flex justify-end gap-3">
          <button
            (click)="closeLogoutModal()"
            class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            (click)="logout()"
            class="px-4 py-2 rounded-lg border border-blue-700 text-blue-700 hover:bg-blue-50 transition"
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

  constructor(private oauthService: OAuthService) {}

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
}
