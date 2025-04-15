import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private toastService: ToastService) {}

  markAllAsTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach((controlName) => {
      form.controls[controlName].markAsTouched();
    });
  }

  getFormErrorMessage(control: AbstractControl | null): string | null {
    if (control?.invalid && control?.touched) {
      if (control.hasError('required')) {
        return 'Este campo é obrigatório.';
      }

      if (control.hasError('maxlength')) {
        return `Este campo não pode ter mais de ${control.errors?.['maxlength']?.['requiredLength']} caracteres.`;
      }

      if (control.hasError('minlength')) {
        return `Este campo deve ter pelo menos ${control.errors?.['minlength']?.['requiredLength']} caracteres.`;
      }

      if (control.hasError('email')) {
        return 'Por favor, insira um email válido.';
      }

      if (control.hasError('pattern')) {
        return 'Formato inválido.';
      }
    }

    return null;
  }
}
