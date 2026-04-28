import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UsersApi {
  private readonly httpClient = inject(HttpClient);
  private readonly url = '/users';

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.url);
  }

  getUserById(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.url}/${id}`);
  }
}
