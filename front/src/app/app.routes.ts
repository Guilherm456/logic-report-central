import { Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { LoginComponent } from '@pages/login/login.component';
import { UserFormComponent } from '@pages/users/pages/create/create-user.component';
import { UsersComponent } from '@pages/users/users.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: UsersComponent },
      { path: 'login', component: LoginComponent },

      { path: 'users/new', component: UserFormComponent },
      { path: 'users/:id/edit', component: UserFormComponent },
    ],
  },
];
