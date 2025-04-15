import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { listDoctors } from '@api_methods/doctors/list';
import { createTemplate } from '@api_methods/templates/create';
import { getTemplate } from '@api_methods/templates/get';
import { updateTemplate } from '@api_methods/templates/update';
import { AutocompleteComponent } from '@components/UI/autocomplete.component';
import { FormCardComponent } from '@components/shared/form-card/form-card.component';
import { UiModule } from '@components/ui.module';
import { Doctor, TemplateDTO } from '@models';
import { FormService } from '@services/components/form.service';
import { ToastService } from '@services/components/toast.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-create-template',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiModule,
    FormCardComponent,
    AutocompleteComponent,
  ],

  templateUrl: './create-template.component.html',
})
export class CreateTemplateComponent implements OnInit {
  [x: string]: any;
  templateForm: FormGroup;
  isEditMode = false;
  loading = false;
  submitting = false;
  templateId?: number;

  doctors: Doctor[] = [];
  loadingDoctors = false;
  private searchDoctorTerm: string = '';
  private doctorPage: number = 0;
  hasMoreDoctors: boolean = false;

  displayDoctorOption = (doctor: Doctor): string =>
    doctor
      ? `${doctor.name} (${doctor.councilNumber}-${doctor.council.acronym})`
      : '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    public formService: FormService
  ) {
    this.templateForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(255)]],
      content: ['', Validators.required],
      doctor: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadInitialData();

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.templateId = +params['id'];
        this.loadTemplateData();
      }
    });

    this.templateForm
      .get('doctor')
      ?.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value) => {
          this.searchDoctorTerm = typeof value === 'string' ? value : '';
          this.doctorPage = 0;
          this.doctors = [];
          return this.searchDoctors(this.searchDoctorTerm, this.doctorPage);
        })
      )
      .subscribe((response) => {
        this.doctors = response.items;
        this.hasMoreDoctors = response.hasNext;
        this.cdr.markForCheck();
      });
  }

  async loadInitialData() {
    this.loadingDoctors = true;
    this.cdr.markForCheck();
    try {
      const doctorsData = await this.searchDoctors('', 0);
      this.doctors = doctorsData.items;
      this.hasMoreDoctors = doctorsData.hasNext;
    } catch (error) {
      this.toastService.showToast({
        message: 'Erro ao carregar dados iniciais',
        type: 'error',
      });
    } finally {
      this.loadingDoctors = false;
      this.cdr.markForCheck();
    }
  }

  async loadTemplateData() {
    if (!this.templateId) return;
    this.loading = true;
    this.cdr.markForCheck();
    try {
      const template = await getTemplate({ id: this.templateId });
      this.templateForm.patchValue({
        description: template.description,
        content: template.content,
        doctor: template.doctor,
      });
    } catch (error) {
      this.toastService.showToast({
        message: 'Erro ao carregar dados do template',
        type: 'error',
      });
      this.router.navigate(['/templates']);
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  async searchDoctors(
    query: string = '',
    page: number = 0
  ): Promise<{ items: Doctor[]; hasNext: boolean }> {
    this.loadingDoctors = true;
    this.searchDoctorTerm = query;
    this.doctorPage = page;
    this.cdr.markForCheck();
    try {
      const response = await listDoctors({
        search: query,
        page: page,
        size: 20,
      });
      const items =
        page === 0 ? response.items : [...this.doctors, ...response.items];
      return { items: items, hasNext: response.hasNext };
    } catch (error) {
      this.toastService.showToast({
        message: 'Erro ao buscar médicos',
        type: 'error',
      });
      return { items: [], hasNext: false };
    } finally {
      this.loadingDoctors = false;
      this.cdr.markForCheck();
    }
  }

  onSearchDoctor(query: string = '') {
    this.searchDoctors(query, 0);
  }

  onLoadMoreDoctors() {
    this.searchDoctors(this.searchDoctorTerm, this.doctorPage + 1);
  }

  async onSubmit() {
    if (!this.templateForm.valid) {
      this.toastService.showToast({
        message: 'Por favor, preencha todos os campos obrigatórios.',
        type: 'error',
      });
      this.formService.markAllAsTouched(this.templateForm);
      return;
    }

    this.submitting = true;
    this.cdr.markForCheck();
    console.debug(this.templateForm.value);

    try {
      const templateData = this.prepareData();
      await (this.isEditMode
        ? updateTemplate({ data: templateData, id: this.templateId! })
        : createTemplate({ data: templateData }));
      this.toastService.showToast({
        message: `Template ${
          this.isEditMode ? 'atualizado' : 'criado'
        } com sucesso`,
        type: 'success',
      });

      this.router.navigate(['/templates']);
    } catch (error: any) {
      this.toastService.showToast({
        message:
          error.response?.data?.message || 'Erro ao salvar dados do template',
        type: 'error',
      });
      console.debug(error);
    }
    this.submitting = false;
    this.cdr.markForCheck();
  }

  private prepareData(): TemplateDTO {
    const formValue = this.templateForm.value;
    return {
      description: formValue.description,
      content: formValue.content,
      doctor_id: formValue.doctor?.id,
    };
  }

  cancel(): void {
    this.router.navigate(['/templates']);
  }

  compareById(option: { id: number }, value: { id: number }): boolean {
    return option && value ? option.id === value.id : option === value;
  }
}
