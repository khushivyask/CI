// src/app/components/users/users.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators,FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  users: User[]      = [];
  form!: FormGroup;
  editingId: number | null = null;
  error = '';
  loading = false;

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  initForm(user?: User): void {
    this.form = this.fb.group({
      name:  [user?.name  ?? '', [Validators.required, Validators.minLength(2)]],
      email: [user?.email ?? '', [Validators.required, Validators.email]],
      role:  [user?.role  ?? 'USER']
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (data) => { this.users = data; this.loading = false; },
      error: (err) => { this.error = err.message; this.loading = false; }
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    const payload: User = this.form.value;
    const action = this.editingId
      ? this.userService.update(this.editingId, payload)
      : this.userService.create(payload);

    action.subscribe({
      next: () => { this.resetForm(); this.loadUsers(); },
      error: (err) => { this.error = err.error?.message ?? err.message; }
    });
  }

  edit(user: User): void {
    this.editingId = user.id!;
    this.initForm(user);
  }

  delete(id: number): void {
    if (!confirm('Delete this user?')) return;
    this.userService.delete(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => { this.error = err.message; }
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.error     = '';
    this.initForm();
  }

  searchTerm = '';

onSearch(): void {
  if (!this.searchTerm.trim()) {
    this.loadUsers();
    return;
  }
  this.userService.search(this.searchTerm).subscribe({
    next: (data) => { this.users = data; },
    error: (err)  => { this.error = err.message; }
  });
}
}