import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';

export interface UserStats {
  total: number;
  admins: number;
  users: number;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }

  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  search(name: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/search?name=${name}`);
  }

  getStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.baseUrl}/stats`);
  }

  getByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/role/${role}`);
  }
  addProductForUser(userId: number, product: Product): Observable<Product> {
  return this.http.post<Product>(
    `${this.baseUrl}/${userId}/products`, product
  );
}
}