// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" href="#">E-Commerce Admin</a>
        <div class="navbar-nav ms-auto">
          <a class="nav-link" routerLink="/users"    routerLinkActive="active">Users</a>
          <a class="nav-link" routerLink="/products" routerLinkActive="active">Products</a>
        </div>
      </div>
    </nav>
    <main class="py-4">
      <router-outlet />
    </main>
  `
})
export class AppComponent {}