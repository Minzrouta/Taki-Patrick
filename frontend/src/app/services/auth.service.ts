import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, authState } from '@angular/fire/auth';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly http = inject(HttpClient);

  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    authState(this.auth).subscribe(async (firebaseUser) => {
      if (!firebaseUser) {
        this.currentUserSubject.next(null);
        return;
      }
      try {
        const user = await this.syncWithBackend(firebaseUser.email!, firebaseUser.displayName ?? '');
        this.currentUserSubject.next(user);
      } catch {
        // backend indisponible : on expose a minima les infos Firebase
        const [firstName, ...rest] = (firebaseUser.displayName ?? firebaseUser.email ?? '').split(' ');
        this.currentUserSubject.next({
          id: 0,
          email: firebaseUser.email!,
          firstName: firstName || firebaseUser.email!,
          lastName: rest.join(' '),
          age: null,
          points: 0,
        });
      }
    });
  }

  async signInWithGoogle(): Promise<void> {
    await signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  private async syncWithBackend(email: string, displayName: string): Promise<User> {
    const existing = await firstValueFrom(
      this.http.get<User | null>(`/users/byEmail/${encodeURIComponent(email)}`)
    ).catch(() => null);

    if (existing) return existing;

    const [firstName, ...rest] = displayName.split(' ');
    const lastName = rest.join(' ');

    return firstValueFrom(
      this.http.post<User>('/users', { email, firstName: firstName || email, lastName: lastName || '' })
    );
  }
}
