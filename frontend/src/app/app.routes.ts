// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { ProductsComponent } from './components/products/products.component';

export const routes: Routes = [
  { path: '',         redirectTo: 'users', pathMatch: 'full' },
  { path: 'users',    component: UsersComponent },
  { path: 'products', component: ProductsComponent }
];