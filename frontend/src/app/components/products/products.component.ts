// src/app/components/products/products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  form!: FormGroup;
  editingId: number | null = null;
  error   = '';
  loading = false;

  constructor(private productService: ProductService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
  }

  initForm(p?: Product): void {
    this.form = this.fb.group({
      name:        [p?.name        ?? '', [Validators.required]],
      description: [p?.description ?? ''],
      price:       [p?.price       ?? 0,  [Validators.required, Validators.min(0)]],
      stock:       [p?.stock       ?? 0,  [Validators.required, Validators.min(0)]],
      category:    [p?.category    ?? 'GENERAL']
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (data) => { this.products = data; this.loading = false; },
      error: (err) => { this.error = err.message; this.loading = false; }
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    const payload: Product = this.form.value;
    const action = this.editingId
      ? this.productService.update(this.editingId, payload)
      : this.productService.create(payload);

    action.subscribe({
      next: () => { this.resetForm(); this.loadProducts(); },
      error: (err) => { this.error = err.error?.message ?? err.message; }
    });
  }

  edit(product: Product): void {
    this.editingId = product.id!;
    this.initForm(product);
  }

  delete(id: number): void {
    if (!confirm('Delete this product?')) return;
    this.productService.delete(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => { this.error = err.message; }
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.error     = '';
    this.initForm();
  }
}