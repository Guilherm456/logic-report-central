import { api } from '@/utils/api';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UiModule } from '@components/ui.module';
import { ToastService } from '@services/components/toast.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule, UiModule],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private toastService: ToastService
  ) {}

  async onSubmit(loginForm: NgForm): Promise<void> {
    const credentials = {
      email: this.email,
      password: this.password,
    };

    try {
      const response = await api.post('/auth/login', credentials);

      const token = response.data.token;

      this.toastService.showToast({
        message: 'Login realizado com sucesso!',
        type: 'success',
      });

      if (token) {
        this.cookieService.set('token', token);

        this.router.navigate(['/users']);
      }
    } catch (error: any) {
      this.toastService.showToast({
        message: error.response?.data?.message || 'Verifique suas credenciais',
        type: 'error',
      });
    }
    this.loading = false;
  }
}
