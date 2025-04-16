import { listUsers } from '@/api_methods/users/list';
import { CommonModule, DatePipe } from '@angular/common'; // Importar DatePipe
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'; // Adicionar ViewChild, ElementRef
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UiModule } from '@components/ui.module';
import { PaginationResponse, User } from '@models';
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
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, UiModule, RouterModule, DatePipe],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  pagination: PaginationResponse<User> | null = null;
  loading = false;
  searchTerm = '';
  currentPage = 0;

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  private usersSubscription?: Subscription;

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
    this.usersSubscription?.unsubscribe();
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
        switchMap((term) => this.fetchUsersObservable(0, term))
      )
      .subscribe();
  }

  private fetchUsersObservable(
    page: number,
    search?: string
  ): Observable<PaginationResponse<User> | null> {
    this.loading = true;
    const effectiveSearch = search?.trim() ? search.trim() : undefined;
    return from(listUsers({ page, search: effectiveSearch })).pipe(
      tap((data) => {
        this.users = data.items;
        this.pagination = data;
        this.currentPage = data.page;
        this.loading = false;
        this.cdr.markForCheck();
      }),
      catchError(() => {
        this.toastService.showToast({
          message: 'Falha ao carregar usuários. Tente novamente.',
          type: 'error',
        });
        this.loading = false;
        this.users = [];
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
    if (
      !this.loading &&
      page >= 0 &&
      (!this.pagination || page < this.totalPages)
    ) {
      this.loading = true;
      this.currentPage = page;
      this.cdr.markForCheck();
      this.usersSubscription?.unsubscribe();
      this.usersSubscription = this.fetchUsersObservable(
        page,
        this.searchTerm
      ).subscribe();
    }
  }

  editUser(userId: number): void {
    this.router.navigate(['/users/edit', userId]);
  }

  createUser(): void {
    this.router.navigate(['/users/new']);
  }

  onConfirmDelete(userId: number): void {}

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
