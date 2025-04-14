import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.cookieService.get('token');
    const isLoginPage = state.url === '/login';

    if (token && isLoginPage) {
      this.router.navigate(['/']);
      return false;
    }

    if (!token && !isLoginPage) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
