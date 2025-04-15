import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiModule } from '@components/ui.module';

@Component({
  selector: 'app-form-card',
  standalone: true,
  imports: [CommonModule, UiModule],
  templateUrl: './form-card.component.html',
})
export class FormCardComponent {
  @Output() handleSave = new EventEmitter<void>();
  @Output() handleCancel = new EventEmitter<void>();

  @Input() cancelText: string = 'Cancelar';
  @Input() submitText: string = 'Salvar';

  @Input() header: string = '';
  @Input() description: string = '';

  @Input() loading: boolean = false;
}
