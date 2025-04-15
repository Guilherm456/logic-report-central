import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Toast, ToastService } from '@services/components/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-6 right-6 z-50 flex flex-col gap-3">
      <div
        *ngFor="let toast of toasts"
        class="w-[320px] rounded-md border-l-4 p-4 shadow-lg bg-white text-sm flex items-start gap-3 transition-all animate-slideIn"
        [ngClass]="{
          'border-red-400 bg-red-50': toast.type === 'error',
          'border-green-400 bg-green-50': toast.type === 'success',
          'border-yellow-400 bg-yellow-50': toast.type === 'warning',
          'border-blue-400 bg-blue-50': toast.type === 'info',
          'border-gray-400 bg-gray-50': toast.type === 'default'
        }"
      >
        <div class="flex-1">
          <strong *ngIf="toast.title" class="text-gray-800">{{
            toast.title
          }}</strong>
          <div *ngIf="toast.message" class="text-gray-600 mt-1">
            {{ toast.message }}
          </div>
        </div>
        <button
          (click)="removeToast(toast.id)"
          class="text-gray-400 hover:text-gray-600 text-lg leading-none"
          aria-label="Fechar"
        >
          X
        </button>
      </div>
    </div>
  `,
})
export class ToastComponent implements OnDestroy, OnInit {
  toasts: Toast[] = [];
  private subscription?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.toasts$.subscribe((toasts) => {
      this.toasts = toasts;
    });
  }

  removeToast(id: number): void {
    this.toastService.removeToast(id);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
