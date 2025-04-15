import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { createUser } from '@api_methods/users/create';
import { getUser } from '@api_methods/users/get';
import { updateUser } from '@api_methods/users/update';
import { FormCardComponent } from '@components/shared/form-card/form-card.component';
import { UiModule } from '@components/ui.module';
import { FormService } from '@services/components/form.service';
import { ToastService } from '@services/components/toast.service';

@Component({
  imports: [
    FormsModule,
    NgIf,
    CommonModule,
    ReactiveFormsModule,
    UiModule,
    FormCardComponent,
  ],
  selector: 'app-user-form',
  templateUrl: './create-user.component.html',
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  loading = false;
  submitting = false;
  userId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    public formService: FormService
  ) {
    this.userForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(50)],
      ],
      password: ['', [Validators.minLength(6), Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = +params['id'];
        this.loadUserData();
        this.userForm.get('password')?.clearValidators();
      } else {
        this.userForm
          .get('password')
          ?.setValidators([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ]);
      }
      this.userForm.get('password')?.updateValueAndValidity();
    });
  }

  async loadUserData() {
    this.loading = true;

    try {
      const data = await getUser({ id: this.userId! });
      this.userForm.patchValue({
        username: data.username,
        email: data.email,
        active: data.active,
      });
    } catch (error) {
      this.toastService.showToast({
        message: 'Erro ao carregar os dados do usuário',
        type: 'error',
      });
    }
    this.loading = false;
  }

  async onSubmit() {
    if (!this.userForm.valid) {
      this.toastService.showToast({
        message: 'Por favor, preencha todos os campos obrigatórios.',
        type: 'error',
      });
      this.formService.markAllAsTouched(this.userForm);
      return;
    }

    this.submitting = true;
    const userData = this.prepareData();

    try {
      await (this.isEditMode
        ? updateUser({ data: userData, id: this.userId! })
        : createUser({ data: userData }));
      this.toastService.showToast({
        message: this.isEditMode
          ? 'Usuário atualizado com sucesso'
          : 'Usuário criado com sucesso',
        type: 'success',
      });
      this.router.navigate(['/users']);
    } catch (error: any) {
      this.toastService.showToast({
        message: error.response?.data?.message || 'Erro ao salvar os dados',
        type: 'error',
      });
    }
    this.submitting = false;
  }

  private prepareData(): any {
    const data = { ...this.userForm.value };
    if (this.isEditMode && !data.password) {
      delete data.password;
    }
    return data;
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }
}
