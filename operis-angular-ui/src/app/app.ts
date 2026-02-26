import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./shared/navbar/navbar";
import { AiChatOverlay } from "./shared/ai-chat/ai-chat";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, AiChatOverlay],
  template: `
  <app-navbar></app-navbar>
  <router-outlet></router-outlet>
  <app-ai-chat-overlay></app-ai-chat-overlay>
  `,
  styleUrl: './app.css',
})
export class App {
}
