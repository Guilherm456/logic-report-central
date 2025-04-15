import { Injectable } from '@angular/core';
import { User } from '@models';
import { api } from '@utils/api';
import Cookies from 'js-cookie';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor() {
    this.initializeUserData();
  }

  private initializeUserData(): void {
    const token = Cookies.get('token');
    if (token) {
      this.fetchUserData().subscribe();
    }
  }

  fetchUserData(): Observable<User | null> {
    return from(api.get<User>('/auth/me')).pipe(
      map((response) => response.data),
      tap({
        next: (user) => this.userSubject.next(user),
        error: () => {
          Cookies.remove('token');
          this.userSubject.next(null);
        },
      }),
      catchError(() => of(null))
    );
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  clearUser(): void {
    sessionStorage.removeItem('token');
    this.userSubject.next(null);
  }
}
