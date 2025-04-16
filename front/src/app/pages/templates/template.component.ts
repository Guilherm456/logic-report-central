import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { deleteTemplate } from '@api_methods/templates/delete';
import { listTemplates } from '@api_methods/templates/list'; // Importe a função para listar templates
import { ConfirmDeleteModalComponent } from '@components/shared/confirmation-modal.component';
import { UiModule } from '@components/ui.module';
import { PaginationResponse, Template } from '@models'; // Importe a interface Template
import { ModalService } from '@services/components/modal.service';
import { ToastService } from '@services/components/toast.service';
import { Observable, Subject, Subscription, from, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, FormsModule, UiModule, RouterModule, DatePipe],
  templateUrl: './template.component.html',
})
export class TemplatesComponent implements OnInit, OnDestroy {
  templates: Template[] = [];
  pagination: PaginationResponse<Template> | null = null;
  loading = false;
  searchTerm = '';
  currentPage = 0;

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  private templatesSubscription?: Subscription;

  @ViewChild('searchInput', { static: false })
  searchInput?: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.searchSubject.next(this.searchTerm);
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
    this.templatesSubscription?.unsubscribe();
  }

  private setupSearchDebounce(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => {
          this.loading = true;
          this.currentPage = 0;
          this.cdr.markForCheck();
        }),
        switchMap((term) => this.fetchTemplates(0, term))
      )
      .subscribe();
  }

  private fetchTemplates(
    page: number,
    search?: string
  ): Observable<PaginationResponse<Template> | null> {
    this.loading = true;
    const effectiveSearch = search?.trim() ? search.trim() : undefined;
    return from(listTemplates({ page, search: effectiveSearch })).pipe(
      tap((data) => {
        this.templates = data.items;
        this.pagination = data;
        this.currentPage = data.page;
        this.loading = false;
        this.cdr.markForCheck();
      }),
      catchError(() => {
        this.toastService.showToast({
          message: 'Falha ao carregar templates. Tente novamente.',
          type: 'error',
        });
        this.loading = false;
        this.templates = [];
        this.pagination = null;
        this.cdr.markForCheck();
        return of(null);
      })
    );
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  goToPage(page: number): void {
    if (page >= 0 && (!this.pagination || page < this.totalPages)) {
      this.loading = true;
      this.currentPage = page;
      this.cdr.markForCheck();
      this.templatesSubscription?.unsubscribe();
      this.templatesSubscription = this.fetchTemplates(
        page,
        this.searchTerm
      ).subscribe();
    }
  }

  confirmDeleteTemplate(templateId: number): void {
    this.modalService
      .showModal({
        component: ConfirmDeleteModalComponent,
        data: {
          message: `Tem certeza que deseja apagar o template?`,
          confirmButtonText: 'Apagar',
          cancelButtonText: 'Cancelar',
        },
      })
      .subscribe((result) => {
        if (result) this.onDeleteTemplate(templateId);
      });
  }

  async onDeleteTemplate(templateId: number) {
    this.loading = true;

    try {
      await deleteTemplate({ id: templateId });

      this.toastService.showToast({
        message: 'Template apagado com sucesso.',
        type: 'success',
      });
      this.goToPage(0);
    } catch (error) {
      this.toastService.showToast({
        message:
          (error as any)?.response?.data?.message || 'Erro ao apagar template.',
        type: 'error',
      });
    } finally {
      this.loading = false;
    }
  }

  editTemplate(id: number): void {
    this.router.navigate(['/templates/edit', id]);
  }
  createTemplate(): void {
    this.router.navigate(['/templates/new']);
  }

  clearSearch(): void {
    this.searchTerm = '';
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
    this.onSearchChange();
  }

  get totalPages(): number {
    return this.pagination
      ? Math.ceil(this.pagination.totalItems / this.pagination.size)
      : 0;
  }
}
