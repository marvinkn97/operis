import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Profile</h1>

      <!-- Success/Error messages -->
      @if(updateSuccessMessage()) {
      <div class="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow">
        {{ updateSuccessMessage() }}
      </div>
      } @if(updateErrorMessage()) {
      <div class="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-2 rounded shadow">
        {{ updateErrorMessage() }}
      </div>
      }

      <!-- Name Section -->
      <form class="bg-white shadow rounded-xl p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-gray-700 font-medium mb-2">First Name</label>
            <input
              type="text"
              class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              [readonly]="!editingName()"
              [(ngModel)]="profile().firstName"
              name="firstName"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Last Name</label>
            <input
              type="text"
              class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              [readonly]="!editingName()"
              [(ngModel)]="profile().lastName"
              name="lastName"
            />
          </div>
        </div>

        <div class="flex justify-end gap-2">
          @if(!editingName()) {
          <button
            type="button"
            class="px-6 py-2 border border-yellow-400 text-yellow-600 rounded-md hover:bg-yellow-50"
            (click)="editingName.set(true)"
          >
            Edit Name
          </button>
          } @else {
          <button
            type="button"
            class="px-6 py-2 border border-yellow-400 text-yellow-600 rounded-md hover:bg-yellow-50"
            (click)="updateName()"
          >
            Save Name
          </button>
          <button
            type="button"
            class="px-6 py-2 border rounded-md hover:bg-gray-100"
            (click)="cancelName()"
          >
            Cancel
          </button>
          }
        </div>
      </form>

      <!-- Email Section (readonly) -->
      <div class="bg-white shadow rounded-xl p-6 mt-6">
        <label class="block text-gray-700 font-medium mb-2">Email</label>
        <input
          type="email"
          class="w-full border border-gray-300 rounded-md p-2 bg-gray-100"
          [value]="profile().email"
          readonly
        />
      </div>

      <!-- Password Section -->
      <form class="bg-white shadow rounded-xl p-6 mt-6 space-y-4">
        <h2 class="text-md font-medium mb-4 text-gray-700">Change Password</h2>

        <div class="space-y-4">
          @if(!editingPassword()) {
          <input
            type="password"
            value="********"
            class="w-full border border-gray-300 rounded-md p-2 bg-gray-100"
            readonly
          />
          } @else {
          <input
            type="password"
            placeholder="New Password"
            class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            [(ngModel)]="newPassword"
            name="newPassword"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            [(ngModel)]="confirmPassword"
            name="confirmPassword"
          />
          }
        </div>

        <div class="flex justify-end gap-2">
          @if(!editingPassword()) {
          <button
            type="button"
            class="px-6 py-2 border border-yellow-400 text-yellow-600 rounded-md hover:bg-yellow-50"
            (click)="editingPassword.set(true)"
          >
            Edit Password
          </button>
          } @else {
          <button
            type="button"
            class="px-6 py-2 border border-yellow-400 text-yellow-600 rounded-md hover:bg-yellow-50"
            (click)="updatePassword()"
          >
            Save Password
          </button>
          <button
            type="button"
            class="px-6 py-2 border rounded-md hover:bg-gray-100"
            (click)="cancelPassword()"
          >
            Cancel
          </button>
          }
        </div>
      </form>
    </div>
  `,
})
export class Profile {
  profile = signal({ firstName: 'John', lastName: 'Doe', email: 'johndoe@example.com' });

  // Separate signals for password fields
  newPassword = '';
  confirmPassword = '';

  editingName = signal(false);
  editingPassword = signal(false);

  updateSuccessMessage = signal<string | null>(null);
  updateErrorMessage = signal<string | null>(null);

  // --- Name methods ---
  updateName() {
    this.editingName.set(false);
    this.updateSuccessMessage.set('Name updated successfully!');
    setTimeout(() => this.updateSuccessMessage.set(null), 3000);
  }

  cancelName() {
    this.editingName.set(false);
  }

  // --- Password methods ---
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

    this.editingPassword.set(false);

    // Reset fields
    this.newPassword = '';
    this.confirmPassword = '';

    this.updateSuccessMessage.set('Password updated successfully!');
    setTimeout(() => this.updateSuccessMessage.set(null), 3000);
  }

  cancelPassword() {
    this.editingPassword.set(false);
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
