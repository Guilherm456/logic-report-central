import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-delete-modal',
  template: `
    <div class="bg-white rounded-md shadow-lg p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">{{ message }}</h2>
      <div class="flex justify-end gap-2">
        <button
          type="button"
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          (click)="onCancel()"
        >
          {{ cancelButtonText }}
        </button>
        <button
          type="button"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
          (click)="onConfirm()"
        >
          {{ confirmButtonText }}
        </button>
      </div>
    </div>
  `,
})
export class ConfirmDeleteModalComponent {
  @Input() message: string = 'Tem certeza que deseja apagar este item?';
  @Input() confirmButtonText: string = 'Sim';
  @Input() cancelButtonText: string = 'Não';
  @Output() confirmed = new EventEmitter<boolean>();

  closeModal: (result?: any) => void = () => {};

  onConfirm(): void {
    this.confirmed.emit(true);
    this.closeModal(true);
  }

  onCancel(): void {
    this.confirmed.emit(false);
    this.closeModal(false);
  }
}
