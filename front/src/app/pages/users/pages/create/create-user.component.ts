// user-form.component.ts
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
import { UiModule } from '@components/ui.module';

@Component({
  imports: [FormsModule, NgIf, CommonModule, ReactiveFormsModule, UiModule],
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
    private router: Router
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
        [Validators.required, Validators.email, Validators.maxLength(150)],
      ],
      password: ['', [Validators.minLength(6), Validators.maxLength(100)]],
      active: [true],
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

  loadUserData(): void {
    // this.loading = true;
    // this.userService
    //   .getCurrentUser(this.userId!)
    //   .pipe(finalize(() => (this.loading = false)))
    //   .subscribe({
    //     next: (user) => {
    //       this.userForm.patchValue({
    //         username: user.username,
    //         email: user.email,
    //         active: user.active,
    //       });
    //     },
    //     error: () => this.router.navigate(['/users']),
    //   });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.submitting = true;
    const userData = this.prepareData();

    // const operation = this.isEditMode
    //   ? this.userService.updateUser(this.userId!, userData)
    //   : this.userService.createUser(userData);

    // operation.pipe(finalize(() => (this.submitting = false))).subscribe({
    //   next: () => this.router.navigate(['/users']),
    //   error: (error) => {
    //     // Tratar erros específicos aqui
    //     console.error('Error:', error);
    //   },
    // });
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
