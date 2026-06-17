import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { UserService, UserStats } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  form!: FormGroup;
  productForm!: FormGroup;

  editingId: number | null = null;

  error = '';
  loading = false;
  searchTerm = '';

  stats: UserStats = {
    total: 0,
    admins: 0,
    users: 0
  };

  showProductForm = false;
  selectedUserId: number | null = null;
  selectedUserName = '';
  productSuccess = '';

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initProductForm();
    this.loadUsers();
    this.loadStats();
  }

  initForm(user?: User): void {
    this.form = this.fb.group({
      name: [
        user?.name ?? '',
        [Validators.required, Validators.minLength(2)]
      ],
      email: [
        user?.email ?? '',
        [Validators.required, Validators.email]
      ],
      role: [user?.role ?? 'USER']
    });
  }

  initProductForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: ['GENERAL']
    });
  }

  loadUsers(): void {
    this.loading = true;

    this.userService.getAll().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  loadStats(): void {
    this.userService.getStats().subscribe({
      next: (data: UserStats) => {
        this.stats = data;
      },
      error: (err: Error) => {
        this.error = err.message;
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.loadUsers();
      return;
    }

    this.userService.search(this.searchTerm).subscribe({
      next: (data: User[]) => {
        this.users = data;
      },
      error: (err: Error) => {
        this.error = err.message;
      }
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.loadUsers();
  }

  filterByRole(role: string): void {
    this.userService.getByRole(role).subscribe({
      next: (data: User[]) => {
        this.users = data;
      },
      error: (err: Error) => {
        this.error = err.message;
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const payload: User = this.form.value;

    const action = this.editingId
      ? this.userService.update(this.editingId, payload)
      : this.userService.create(payload);

    action.subscribe({
      next: () => {
        this.resetForm();
        this.loadUsers();
        this.loadStats();
      },
      error: (err: Error) => {
        this.error = err.message;
      }
    });
  }

  openProductForm(user: User): void {
    this.selectedUserId = user.id!;
    this.selectedUserName = user.name;
    this.showProductForm = true;
    this.productSuccess = '';
    this.error = '';
    this.initProductForm();
  }

  submitProduct(): void {
    if (this.productForm.invalid || !this.selectedUserId) {
      return;
    }

    const product: Product = this.productForm.value;

    this.userService
      .addProductForUser(this.selectedUserId, product)
      .subscribe({
        next: (created) => {
          this.productSuccess =
            `Product "${created.name}" added successfully!`;
          this.showProductForm = false;
          this.initProductForm();
        },
        error: (err: Error) => {
          this.error = err.message;
        }
      });
  }

  edit(user: User): void {
    this.editingId = user.id!;
    this.initForm(user);
  }

  delete(id: number): void {
    if (!confirm('Delete this user?')) return;

    this.userService.delete(id).subscribe({
      next: () => {
        this.loadUsers();
        this.loadStats();
      },
      error: (err: Error) => {
        this.error = err.message;
      }
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.error = '';
    this.initForm();
  }
}