import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { listDoctors } from '@api_methods/doctors/list';
import { createReport } from '@api_methods/report/create';
import { getReport } from '@api_methods/report/get';
import { updateReport } from '@api_methods/report/update';
import { listTemplates } from '@api_methods/templates/list';
import { AutocompleteComponent } from '@components/UI/autocomplete.component';
import { FormCardComponent } from '@components/shared/form-card/form-card.component';
import { UiModule } from '@components/ui.module';
import { Doctor, ReportDTO, Template } from '@models';
import { FormService } from '@services/components/form.service';
import { ToastService } from '@services/components/toast.service';
import dayjs from 'dayjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
@Component({
  selector: 'app-create-report',
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
  templateUrl: './create-report.component.html',
})
export class CreateReportComponent implements OnInit {
  reportForm: FormGroup;
  isEditMode = false;
  loading = false;
  submitting = false;
  reportId?: number;

  doctors: Doctor[] = [];
  loadingDoctors = false;
  private searchDoctorTerm: string = '';
  private doctorPage: number = 0;
  hasMoreDoctors: boolean = false;

  templates: Template[] = [];
  loadingTemplates = false;
  private searchTemplateTerm: string = '';
  private templatePage: number = 0;
  hasMoreTemplates: boolean = false;

  genderOptions = [
    { name: 'Masculino', value: 'M' },
    { name: 'Feminino', value: 'F' },
    { name: 'Outro', value: 'O' },
  ];

  displayDoctorOption = (doctor: Doctor): string =>
    doctor ? `${doctor.name} (${doctor.councilNumber})` : '';

  displayTemplateOption = (template: Template): string =>
    template ? `${template.description} - ${template.doctor.name}` : '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    public formService: FormService
  ) {
    this.reportForm = this.fb.group({
      patientName: ['', [Validators.required, Validators.maxLength(100)]],
      patientGender: [null, Validators.required],
      patientBirthDate: ['', Validators.required],
      content: new FormControl(
        { value: '', disabled: false },
        Validators.required
      ),
      doctorRequest: [null, Validators.required],
      selectedTemplate: [null],
    });
  }

  ngOnInit(): void {
    this.loadInitialData();

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.reportId = +params['id'];
        this.loadReportData();
      }
    });

    this.reportForm
      .get('doctorRequest')
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

    // Template Autocomplete
    this.reportForm
      .get('selectedTemplate')
      ?.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value) => {
          this.searchTemplateTerm = typeof value === 'string' ? value : '';
          this.templatePage = 0;
          this.templates = [];
          return this.searchTemplates(
            this.searchTemplateTerm,
            this.templatePage
          );
        })
      )
      .subscribe((response) => {
        this.templates = response.items;
        this.hasMoreTemplates = response.hasNext;
        this.cdr.markForCheck();
      });
  }

  async loadInitialData() {
    this.loadingDoctors = true;
    this.loadingTemplates = true;
    this.cdr.markForCheck();
    try {
      const [doctorsData, templatesData] = await Promise.all([
        this.searchDoctors('', 0),
        this.searchTemplates('', 0),
      ]);
      this.doctors = doctorsData.items;
      this.templates = templatesData.items;
      this.hasMoreDoctors = doctorsData.hasNext;
      this.hasMoreTemplates = templatesData.hasNext;
    } catch (error) {
      this.toastService.showToast({
        message: 'Erro ao carregar dados iniciais',
        type: 'error',
      });
    } finally {
      this.loadingDoctors = false;
      this.loadingTemplates = false;
      this.cdr.markForCheck();
    }
  }

  async loadReportData() {
    if (!this.reportId) return;
    this.loading = true;
    this.cdr.markForCheck();
    try {
      const report = await getReport({ id: this.reportId });

      const patientGender = this.genderOptions.find(
        (opt) => opt.value === report.patientGender
      );

      this.reportForm.patchValue({
        patientName: report.patientName,
        patientGender: patientGender,
        patientBirthDate: dayjs(report.patientBirthDate).format('YYYY-MM-DD'),
        content: report.content,
        doctorRequest: report.doctorRequest,
      });
    } catch (error) {
      this.toastService.showToast({
        message: 'Erro ao carregar laudo',
        type: 'error',
      });
      this.router.navigate(['/reports']);
    }
    this.loading = false;
    this.cdr.markForCheck();
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
        type: 'S',
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

  async searchTemplates(
    query: string = '',
    page: number = 0
  ): Promise<{ items: Template[]; hasNext: boolean }> {
    this.loadingTemplates = true;
    this.searchTemplateTerm = query;
    this.templatePage = page;
    this.cdr.markForCheck();
    try {
      const response = await listTemplates({
        search: query,
        page: page,
        size: 20,
      });
      const items =
        page === 0 ? response.items : [...this.templates, ...response.items];
      return { items: items, hasNext: response.hasNext };
    } catch (error) {
      this.toastService.showToast({
        message: 'Erro ao buscar templates',
        type: 'error',
      });
      return { items: [], hasNext: false };
    } finally {
      this.loadingTemplates = false;
      this.cdr.markForCheck();
    }
  }

  onSearchDoctor(query?: string) {
    this.searchDoctors(query, 0);
  }

  onLoadMoreDoctors() {
    this.searchDoctors(this.searchDoctorTerm, this.doctorPage + 1);
  }

  onSearchTemplate(query?: string) {
    this.searchTemplates(query, 0);
  }

  onLoadMoreTemplates() {
    this.searchTemplates(this.searchTemplateTerm, this.templatePage + 1);
  }

  onTemplateSelected(template: Template | null) {
    if (!template) {
      this.clearTemplate();
      return;
    }
    this.reportForm.patchValue({
      content: template.content,
    });
  }

  clearTemplate() {
    this.reportForm.patchValue({ selectedTemplate: null });
    this.reportForm.get('content')?.enable();
    this.reportForm.get('content')?.setValue('');
  }

  async onSubmit() {
    if (!this.reportForm.valid) {
      this.toastService.showToast({
        message: 'Preencha todos os campos obrigatórios',
        type: 'error',
      });
      this.formService.markAllAsTouched(this.reportForm);
      return;
    }

    this.submitting = true;
    this.cdr.markForCheck();

    try {
      const reportData = this.prepareData();

      await (this.isEditMode
        ? updateReport({ data: reportData, id: this.reportId! })
        : createReport({ data: reportData }));

      this.toastService.showToast({
        message: `Laudo ${
          this.isEditMode ? 'atualizado' : 'criado'
        } com sucesso`,
        type: 'success',
      });
      this.router.navigate(['/reports']);
    } catch (error: any) {
      this.toastService.showToast({
        message: error.response?.data?.message || 'Erro ao salvar laudo',
        type: 'error',
      });
      console.error(error);
    } finally {
      this.submitting = false;
      this.cdr.markForCheck();
    }
  }

  private prepareData(): ReportDTO {
    return {
      patient_name: this.reportForm.value.patientName,
      patient_gender: this.reportForm.value.patientGender?.value,
      patient_birth_date: this.reportForm.value.patientBirthDate,
      doctor_requester_id: this.reportForm.value.doctorRequest.id,
      report_content: this.reportForm.value.content,
    };
  }

  cancel(): void {
    this.router.navigate(['/reports']);
  }

  compareById(option: { id: number }, value: { id: number }): boolean {
    return option?.id === value?.id;
  }
}
