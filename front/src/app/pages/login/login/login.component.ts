import { api } from '@/utils/api';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UiModule } from '@components/ui.module';
import { CookieService } from 'ngx-cookie-service';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    CommonModule,
    UiModule,
    ButtonModule,
    FloatLabelModule,
  ],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(private router: Router, private cookieService: CookieService) {}

  async onSubmit(loginForm: NgForm): Promise<void> {
    const credentials = {
      email: this.email,
      password: this.password,
    };

    try {
      const response = await api.post('/auth/login', credentials);

      const token = response.data.token;

      if (token) {
        this.cookieService.set('token', token);

        this.router.navigate(['/']);
      } else {
      }
    } catch (error: any) {
      console.error('Login error:', error);
    }
    this.loading = false;
  }
  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
