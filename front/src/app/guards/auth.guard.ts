import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '@services/user.service';
import { Observable } from 'rxjs';

import Cookies from 'js-cookie';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    const token = Cookies.get('token');
    const isLoginPage = state.url === '/login';

    if (token && isLoginPage) {
      this.router.navigate(['/users']);
      return false;
    }

    if (!token && !isLoginPage) {
      this.router.navigate(['/login']);
      return false;
    }

    if (token && !isLoginPage) {
      if (!this.userService.getCurrentUser()) this.userService.fetchUserData();

      return true;
    }

    return true;
  }
}
