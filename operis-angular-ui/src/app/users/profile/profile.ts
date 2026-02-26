import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../user.model';
import { UsersResource } from '../users.resource';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-[#fafafa] pt-24 pb-12 px-6 relative overflow-hidden">
      <div
        class="absolute top-0 right-0 w-96 h-96 bg-emerald-50/30 rounded-full blur-[120px] -z-10"
      ></div>

      <div class="max-w-4xl mx-auto relative z-10">
        <div class="mb-10">
          <h1 class="text-4xl font-black text-slate-900 tracking-tight">Account Settings</h1>
          <p class="text-slate-500 mt-1 font-medium">
            Manage your personal identity and security credentials.
          </p>
        </div>

        @if (updateSuccessMessage()) {
          <div
            class="fixed bottom-8 right-8 z-200 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold animate-in slide-in-from-right duration-300"
          >
            {{ updateSuccessMessage() }}
          </div>
        }
        @if (updateErrorMessage()) {
          <div
            class="fixed bottom-8 right-8 z-200 bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold animate-in slide-in-from-right duration-300"
          >
            {{ updateErrorMessage() }}
          </div>
        }

        @if (loading()) {
          <div class="space-y-6 animate-pulse">
            <div class="bg-white rounded-3xl border border-slate-100 p-8 space-y-6">
              <div class="grid grid-cols-2 gap-6">
                <div class="h-12 bg-slate-50 rounded-xl"></div>
                <div class="h-12 bg-slate-50 rounded-xl"></div>
              </div>
              <div class="h-10 w-32 bg-slate-100 rounded-xl ml-auto"></div>
            </div>
            <div class="h-24 bg-white rounded-3xl border border-slate-100"></div>
          </div>
        }

        @if (!loading()) {
          <div class="space-y-6">
            <form class="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm space-y-8">
              <div class="flex items-center gap-4 mb-2">
                <div
                  class="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
                >
                  {{ profile().firstName.charAt(0) }}{{ profile().lastName.charAt(0) }}
                </div>
                <div>
                  <h2 class="text-lg font-black text-slate-900 leading-tight">
                    Personal Information
                  </h2>
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Profile Identity
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label
                    class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1"
                    >First Name</label
                  >
                  <input
                    type="text"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 transition font-bold text-slate-700 disabled:opacity-60"
                    [readonly]="!editingName()"
                    [(ngModel)]="profile().firstName"
                    name="firstName"
                  />
                </div>

                <div class="space-y-1">
                  <label
                    class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1"
                    >Last Name</label
                  >
                  <input
                    type="text"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 transition font-bold text-slate-700 disabled:opacity-60"
                    [readonly]="!editingName()"
                    [(ngModel)]="profile().lastName"
                    name="lastName"
                  />
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-4">
                @if (!editingName()) {
                  <button
                    type="button"
                    class="px-6 py-2.5 bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-100 transition"
                    (click)="editingName.set(true)"
                  >
                    Edit Profile
                  </button>
                } @else {
                  <button
                    type="button"
                    class="px-6 py-2.5 text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 rounded-xl transition"
                    (click)="cancelName()"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="px-6 py-2.5 bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition"
                    (click)="updateName()"
                  >
                    Save Changes
                  </button>
                }
              </div>
            </form>

            <div class="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="space-y-1">
                  <label
                    class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1"
                    >Verified Email Address</label
                  >
                  <p class="text-lg font-bold text-slate-900 ml-1">{{ profile().email }}</p>
                </div>
                <span
                  class="w-fit px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100 rounded-full"
                >
                  Verified
                </span>
              </div>
            </div>

            <form class="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm space-y-6">
              <div>
                <h2 class="text-lg font-black text-slate-900 leading-tight">Security</h2>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Password Management
                </p>
              </div>

              <div class="space-y-4 max-w-md">
                @if (!editingPassword()) {
                  <div class="relative">
                    <input
                      type="password"
                      value="********"
                      class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-400"
                      readonly
                    />
                  </div>
                } @else {
                  <div class="space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <input
                      type="password"
                      placeholder="New Password"
                      class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-slate-900 transition font-bold"
                      [(ngModel)]="newPassword"
                      name="newPassword"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-slate-900 transition font-bold"
                      [(ngModel)]="confirmPassword"
                      name="confirmPassword"
                    />
                  </div>
                }
              </div>

              <div class="flex justify-end gap-3 pt-4 border-t border-slate-50">
                @if (!editingPassword()) {
                  <button
                    type="button"
                    class="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition"
                    (click)="editingPassword.set(true)"
                  >
                    Change Password
                  </button>
                } @else {
                  <button
                    type="button"
                    class="px-6 py-2.5 text-slate-400 text-xs font-bold uppercase tracking-widest"
                    (click)="cancelPassword()"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition shadow-xl shadow-slate-900/10"
                    (click)="updatePassword()"
                  >
                    Update Security
                  </button>
                }
              </div>
            </form>
          </div>
        }
      </div>
    </div>
  `,
})
export class Profile implements OnInit {
  loading = signal(true);

  profile = signal<User>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
  });

  newPassword = '';
  confirmPassword = '';

  editingName = signal(false);
  editingPassword = signal(false);

  updateSuccessMessage = signal<string | null>(null);
  updateErrorMessage = signal<string | null>(null);

  constructor(
    private usersResource: UsersResource,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading.set(true);

    this.usersResource.getAuthenticatedUser().subscribe({
      next: (user) => {
        this.profile.set(user);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.updateErrorMessage.set('Failed to load profile');
        setTimeout(() => this.updateErrorMessage.set(null), 3000);
      },
    });
  }

  updateName() {
    const { firstName, lastName } = this.profile();

    if (!firstName || !lastName) {
      this.updateErrorMessage.set('First name and last name are required');
      return;
    }

    this.editingName.set(false);

    this.usersResource.updateMyName({ firstName, lastName }).subscribe({
      next: () => {
        this.loadProfile();
        this.updateSuccessMessage.set('Name updated successfully!');
        setTimeout(() => this.updateSuccessMessage.set(null), 3000);
      },
      error: () => {
        this.updateErrorMessage.set('Failed to update name');
        setTimeout(() => this.updateErrorMessage.set(null), 3000);
      },
    });
  }

  cancelName() {
    this.editingName.set(false);
    this.loadProfile();
  }

  updatePassword() {
    if (!this.newPassword || !this.confirmPassword) {
      this.updateErrorMessage.set('Please fill all password fields');
      setTimeout(() => this.updateErrorMessage.set(null), 3000);
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.updateErrorMessage.set('Passwords do not match');
      setTimeout(() => this.updateErrorMessage.set(null), 3000);
      return;
    }

    this.usersResource.updateMyPassword({ newPassword: this.newPassword }).subscribe({
      next: () => {
        this.editingPassword.set(false);
        this.newPassword = '';
        this.confirmPassword = '';
        this.updateSuccessMessage.set('Password updated successfully!');
        setTimeout(() => this.updateSuccessMessage.set(null), 3000);
        this.authService.logout();
      },
      error: () => {
        this.updateErrorMessage.set('Failed to update password');
        setTimeout(() => this.updateErrorMessage.set(null), 3000);
      },
    });
  }

  cancelPassword() {
    this.editingPassword.set(false);
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
