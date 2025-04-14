import { Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { LoginComponent } from '@pages/login/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
];
