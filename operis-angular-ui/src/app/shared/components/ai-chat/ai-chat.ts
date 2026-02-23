import { Component, inject } from '@angular/core';
import { AiChatResource } from './ai-chat.resource';

@Component({
  selector: 'app-ai-chat-overlay',
  standalone: true,
  template: `
    @if (aiChat.isOpen()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/40 z-40"
        (click)="aiChat.close()"
      ></div>

      <!-- Right Slide Panel -->
      <div
        class="fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b">
          <h2 class="font-semibold text-lg">✨ AI Assistant</h2>
          <button
            (click)="aiChat.close()"
            class="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        <!-- Chat Body -->
        <div class="flex-1 p-4 overflow-y-auto">
          <div class="bg-gray-100 p-3 rounded-lg mb-3">
            Hi 👋 I'm your AI assistant.
          </div>
        </div>

        <!-- Input -->
        <div class="p-4 border-t">
          <input
            type="text"
            placeholder="Ask AI anything..."
            class="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>
    }
  `,
  styles: [`
    .animate-slide-in {
      animation: slideIn 0.25s ease-out;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
  `]
})
export class AiChatOverlay {
  aiChat = inject(AiChatResource);
}