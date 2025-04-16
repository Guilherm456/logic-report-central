import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalService } from '@services/components/modal.service';

@Component({
  selector: 'app-confirmation-modal',
  imports: [NgIf],
  template: `
    <div class="pb-2 border-b border-gray-300 mb-4">
      <h2 *ngIf="title" class="text-xl font-semibold">{{ title }}</h2>
    </div>
    <div class="mb-6">
      <p *ngIf="message">{{ message }}</p>
    </div>
    <div class="flex justify-end gap-2">
      <button
        type="button"
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        (click)="onCancel()"
      >
        {{ cancelButtonLabel || 'Cancelar' }}
      </button>
      <button
        type="button"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        (click)="onConfirm()"
      >
        {{ confirmButtonLabel || 'Confirmar' }}
      </button>
    </div>
  `,
})
export class ConfirmationModalComponent {
  @Input() title?: string;
  @Input() message?: string;
  @Input() confirmButtonLabel?: string;
  @Input() cancelButtonLabel?: string;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  constructor(private modalService: ModalService) {}

  onConfirm(): void {
    this.confirmed.emit();
    this.modalService.closeModal();
  }

  onCancel(): void {
    this.cancelled.emit();
    this.modalService.closeModal();
  }
}
