import { Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { DoctorsComponent } from '@pages/doctor/doctors.component';
import { CreateDoctorComponent } from '@pages/doctor/pages/create/create-doctor.component';
import { LayoutComponent } from '@pages/layout.component';
import { LoginComponent } from '@pages/login/login.component';
import { CreateReportComponent } from '@pages/reports/pages/create/create-report.component';
import { ReportsComponent } from '@pages/reports/report.component';
import { CreateTemplateComponent } from '@pages/templates/pages/create/create-template.component';
import { TemplatesComponent } from '@pages/templates/template.component';
import { UserFormComponent } from '@pages/users/pages/create/create-user.component';
import { UsersComponent } from '@pages/users/users.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UsersComponent },
      { path: 'users/new', component: UserFormComponent },
      { path: 'users/edit/:id', component: UserFormComponent },

      { path: 'doctors', component: DoctorsComponent },
      { path: 'doctors/new', component: CreateDoctorComponent },
      { path: 'doctors/edit/:id', component: CreateDoctorComponent },

      { path: 'templates', component: TemplatesComponent },
      { path: 'templates/new', component: CreateTemplateComponent },
      { path: 'templates/edit/:id', component: CreateTemplateComponent },

      { path: 'reports', component: ReportsComponent },
      { path: 'reports/new', component: CreateReportComponent },
      { path: 'reports/edit/:id', component: CreateReportComponent },
    ],
  },
];
