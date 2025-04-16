import { api } from '@/utils/api';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UiModule } from '@components/ui.module';
import { FormService } from '@services/components/form.service';
import { ToastService } from '@services/components/toast.service';
import Cookies from 'js-cookie';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule, UiModule, ReactiveFormsModule],
})
export class LoginComponent {
  loading = false;
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService,
    public formService: FormService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.toastService.showToast({
        message: 'Preencha todos os campos corretamente',
        type: 'error',
      });
      this.formService.markAllAsTouched(this.loginForm);
      return;
    }

    this.loading = true;
    const credentials = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    try {
      const response = await api.post('/auth/login', credentials);

      const token = response.data.token;

      this.toastService.showToast({
        message: 'Login realizado com sucesso!',
        type: 'success',
      });

      if (token) {
        Cookies.set('token', token);

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
