import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./shared/components/navbar/navbar";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  template: `
  <app-navbar></app-navbar>
  <router-outlet></router-outlet>
  `,
  styleUrl: './app.css',
})
export class App {
}
