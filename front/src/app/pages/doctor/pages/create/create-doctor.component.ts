import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { listCouncils } from '@api_methods/council/list';
import { listStates } from '@api_methods/council/listStates';
import { createDoctor } from '@api_methods/doctors/create';
import { getDoctor } from '@api_methods/doctors/get';
import { updateDoctor } from '@api_methods/doctors/update';
import { listUsers } from '@api_methods/users/list';
import { AutocompleteComponent } from '@components/UI/autocomplete.component';
import { FormCardComponent } from '@components/shared/form-card/form-card.component';
import { UiModule } from '@components/ui.module';
import { Council, DoctorDTO, PaginationResponse, State, User } from '@models';
import { FormService } from '@services/components/form.service';
import { ToastService } from '@services/components/toast.service';
import { UserService } from '@services/user.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

interface DoctorTypeOption {
  name: string;
  value: string;
}

@Component({
  selector: 'app-create-doctor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiModule,
    FormCardComponent,
    AutocompleteComponent,
    NgIf,
  ],
  templateUrl: './create-doctor.component.html',
})
export class CreateDoctorComponent implements OnInit {
  doctorForm: FormGroup;
  isEditMode = false;
  loading = false;
  submitting = false;
  doctorId?: number;

  states: State[] = [];
  councils: Council[] = [];
  users: User[] = [];
  doctorTypeOptions: DoctorTypeOption[] = [
    { name: 'Solicitante', value: 'S' },
    { name: 'Executante', value: 'E' },
  ];

  loadingStates = false;
  loadingCouncils = false;
  loadingUsers = false;

  private searchCouncilTerm: string = '';
  private searchUserTerm: string = '';
  private councilPage: number = 0;
  private userPage: number = 0;
  hasMoreCouncils: boolean = false;
  hasMoreUsers: boolean = false;

  displayUserOption = (user: User): string =>
    user ? `${user.username} (${user.email})` : '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    public formService: FormService
  ) {
    this.doctorForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      council_number: ['', [Validators.required, Validators.maxLength(20)]],
      council: [null, Validators.required],
      state: [null, Validators.required],
      user: [null, Validators.required],
      doctor_type: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadInitialData();

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.doctorId = +params['id'];
        this.loadDoctorData();
      }
    });

    this.doctorForm
      .get('user')
      ?.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value) => {
          this.searchUserTerm = typeof value === 'string' ? value : '';
          this.userPage = 0;
          this.users = [];
          return this.searchUsers(this.searchUserTerm, this.userPage);
        })
      )
      .subscribe((response) => {
        this.users = response.items;
        this.hasMoreUsers = response.hasNext;
        this.cdr.markForCheck();
      });
  }

  async loadInitialData() {
    this.loadingStates = true;
    this.loadingCouncils = true;
    this.cdr.markForCheck();
    try {
      const [statesData, councilsData, usersData] = await Promise.all([
        this.loadStates(),
        this.searchCouncils('', 0),
        this.searchUsers('', 0),
      ]);
      this.states = statesData;
      this.councils = councilsData.items;
      this.users = usersData.items;
      this.hasMoreUsers = usersData.hasNext;
      this.hasMoreCouncils = councilsData.hasNext;
    } catch (error) {
      this.toastService.showToast({
        message: 'Erro ao carregar dados iniciais',
        type: 'error',
      });
    } finally {
      this.loadingStates = false;
      this.loadingCouncils = false;
      this.cdr.markForCheck();
    }
  }

  async loadDoctorData() {
    if (!this.doctorId) return;
    this.loading = true;
    this.cdr.markForCheck();
    try {
      const doctor = await getDoctor({ id: this.doctorId });
      const doctorType = this.doctorTypeOptions.find(
        (opt) => opt.value === doctor.type
      );
      this.doctorForm.patchValue({
        name: doctor.name,
        council_number: doctor.councilNumber,
        council: doctor.council,
        state: doctor.state,
        doctor_type: doctorType,
        user: doctor.user,
      });
    } catch (error) {
      this.toastService.showToast({
        message: 'Erro ao carregar dados do médico',
        type: 'error',
      });
      this.router.navigate(['/doctors']);
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  async loadStates(): Promise<State[]> {
    this.loadingStates = true;
    this.cdr.markForCheck();
    try {
      return await listStates();
    } catch (error) {
      this.toastService.showToast({
        message: 'Erro ao carregar estados',
        type: 'error',
      });
      return [];
    } finally {
      this.loadingStates = false;
      this.cdr.markForCheck();
    }
  }

  async searchCouncils(
    query: string = '',
    page: number = 0
  ): Promise<PaginationResponse<Council>> {
    this.loadingCouncils = true;
    this.searchCouncilTerm = query;
    this.councilPage = page;
    this.cdr.markForCheck();
    try {
      const response = await listCouncils({
        search: query,
        page: page,
        size: 20,
      });
      if (page === 0) {
        this.councils = response.items;
      } else {
        this.councils = [...this.councils, ...response.items];
      }
      this.hasMoreCouncils = response.hasNext;
      return response;
    } catch (error) {
      this.toastService.showToast({
        message: 'Erro ao buscar conselhos',
        type: 'error',
      });
      return {
        items: [],
        totalItems: 0,
        page: 0,
        size: 0,
        hasNext: false,
        hasPrevious: false,
      };
    } finally {
      this.loadingCouncils = false;
      this.cdr.markForCheck();
    }
  }

  async searchUsers(
    query: string = '',
    page: number = 0
  ): Promise<PaginationResponse<User>> {
    this.loadingUsers = true;
    this.searchUserTerm = query;
    this.userPage = page;
    this.cdr.markForCheck();
    try {
      const response = await listUsers({
        search: query,
        doctor_linked: false,
        page: page,
        size: 20,
      });
      if (page === 0) {
        this.users = response.items;
      } else {
        this.users = [...this.users, ...response.items];
      }
      this.hasMoreUsers = response.hasNext;
      return response;
    } catch (error) {
      this.toastService.showToast({
        message: 'Erro ao buscar usuários',
        type: 'error',
      });
      return {
        items: [],
        totalItems: 0,
        page: 0,
        size: 0,
        hasNext: false,
        hasPrevious: false,
      };
    } finally {
      this.loadingUsers = false;
      this.cdr.markForCheck();
    }
  }

  onSearchCouncil(query: string = '') {
    this.searchCouncils(query, 0);
  }

  onLoadMoreCouncils() {
    this.searchCouncils(this.searchCouncilTerm, this.councilPage + 1);
  }

  onSearchUser(query: string = '') {
    this.searchUsers(query, 0);
  }

  onLoadMoreUsers() {
    this.searchUsers(this.searchUserTerm, this.userPage + 1);
  }

  async onSubmit() {
    if (!this.doctorForm.valid) {
      this.toastService.showToast({
        message: 'Por favor, preencha todos os campos obrigatórios.',
        type: 'error',
      });
      this.formService.markAllAsTouched(this.doctorForm);
      return;
    }

    this.submitting = true;
    this.cdr.markForCheck();
    console.debug(this.doctorForm.value);

    try {
      const doctorData = this.prepareData();
      await (this.isEditMode
        ? updateDoctor({ data: doctorData, id: this.doctorId! })
        : createDoctor({ data: doctorData }));
      this.toastService.showToast({
        message: `Médico ${
          this.isEditMode ? 'atualizado' : 'criado'
        } com sucesso`,
        type: 'success',
      });
      if (doctorData.user_id === this.userService.getCurrentUser()?.id)
        this.userService.fetchUserData();

      this.router.navigate(['/doctors']);
    } catch (error: any) {
      this.toastService.showToast({
        message:
          error.response?.data?.message || 'Erro ao salvar dados do médico',
        type: 'error',
      });
      console.debug(error);
    }
    this.submitting = false;
    this.cdr.markForCheck();
  }

  private prepareData(): DoctorDTO {
    const formValue = this.doctorForm.value;
    return {
      name: formValue.name,
      council_number: formValue.council_number,
      council_id: formValue.council.id,
      state_id: formValue.state.id,
      user_id: formValue.user?.id,
      doctor_type: formValue.doctor_type.value,
    };
  }

  cancel(): void {
    this.router.navigate(['/doctors']);
  }

  compareById(option: { id: number }, value: { id: number }): boolean {
    return option && value ? option.id === value.id : option === value;
  }
}
