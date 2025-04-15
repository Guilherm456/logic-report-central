import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@models';
import { api } from '@utils/api';
import Cookies from 'js-cookie';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private route: Router) {
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

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  logout(): void {
    Cookies.remove('token');

    this.userSubject.next(null);
    this.route.navigate(['/login']);
  }

  clearUser(): void {
    sessionStorage.removeItem('token');
    this.userSubject.next(null);
  }
}
