import { Component, inject } from '@angular/core';
import { AiChatResource } from './ai-chat.resource';

@Component({
  selector: 'app-ai-chat-overlay',
  standalone: true,
  template: `
    @if (aiChat.isOpen()) {
      <div
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-100 transition-opacity duration-300"
        (click)="aiChat.close()"
      ></div>

      <div
        class="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-110 flex flex-col animate-slide-in border-l border-slate-100"
      >
        <div
          class="flex items-center justify-between px-6 py-5 border-b border-slate-50 bg-white/80 backdrop-blur-md sticky top-0 z-10"
        >
          <div class="flex items-center gap-3">
            <div class="relative flex h-3 w-3">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"
              ></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-violet-600"></span>
            </div>
            <div>
              <h2
                class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1"
              >
                Neural Engine
              </h2>
              <p class="text-sm font-black text-slate-900 leading-none">Operis AI Assistant</p>
            </div>
          </div>
          <button
            (click)="aiChat.close()"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="flex-1 p-6 overflow-y-auto space-y-6 bg-[#fafafa]">
          <div class="flex flex-col gap-2 max-w-[85%]">
            <div
              class="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm shadow-slate-200/50"
            >
              <p class="text-sm text-slate-700 leading-relaxed">
                Identity verified. I'm connected to your workspace. How can I optimize your projects
                today?
              </p>
            </div>
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1"
              >Operis Intelligence</span
            >
          </div>
        </div>

        <div class="p-6 bg-white border-t border-slate-100">
          <div class="relative group">
            <input
              type="text"
              placeholder="Enter command or question..."
              class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/5 transition-all pr-14"
            />
            <button
              class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-violet-600 transition-colors shadow-lg"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <div class="mt-4 flex items-center justify-between px-1">
            <span class="text-[9px] font-bold text-slate-300 uppercase tracking-widest"
              >End-to-End Encrypted</span
            >
            <div class="flex gap-2">
              <div class="h-1 w-8 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-violet-500 w-1/3 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .animate-slide-in {
        animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class AiChatOverlay {
  aiChat = inject(AiChatResource);
}
