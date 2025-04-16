import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SpinnerComponent } from './spinner.component';

@Component({
  selector: 'app-button',
  imports: [NgIf, SpinnerComponent],
  template: `<button
    [type]="type"
    [disabled]="disabled || loading"
    class="
 inline-flex items-center justify-center gap-2
 h-10 px-3
 bg-brand hover:bg-brand-light text-white font-bold rounded-md
 focus:outline-none focus:shadow-outline
 hover:transition-colors hover:duration-300 hover:ease-in-out
 cursor-pointer
 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
 focus:ring-2 focus:ring-offset-2 focus:ring-brand focus:ring-offset-white
 {{ loading ? 'cursor-wait' : '' }}
 {{ className }}
"
    (click)="onClick.emit($event)"
  >
    <ng-container *ngIf="loading"> <app-spinner /> </ng-container>

    <ng-container *ngIf="!loading">
      {{ label }} <ng-content></ng-content>
    </ng-container>
  </button>`,
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() className: string = '';

  @Output() onClick = new EventEmitter<MouseEvent>();
}
