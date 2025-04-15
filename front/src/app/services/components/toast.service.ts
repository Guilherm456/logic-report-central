import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastType = 'error' | 'success' | 'warning' | 'info' | 'default';

export interface Toast {
  id: number;
  message: string;
  title?: string;
  type: ToastType;
}

export interface ToastOptions {
  message: string;
  title?: string;
  type?: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();
  private idCounter = 0;

  showToast(options: ToastOptions): void {
    const toast: Toast = {
      id: this.idCounter++,
      message: options.message,
      title: options.title,
      type: options.type ?? 'info',
    };

    const currentToasts = this.toastsSubject.getValue();
    this.toastsSubject.next([...currentToasts, toast]);

    setTimeout(() => {
      this.removeToast(toast.id);
    }, 5000);
  }

  removeToast(id: number): void {
    const currentToasts = this.toastsSubject
      .getValue()
      .filter((toast) => toast.id !== id);
    this.toastsSubject.next(currentToasts);
  }

  clearToasts(): void {
    this.toastsSubject.next([]);
  }
}
