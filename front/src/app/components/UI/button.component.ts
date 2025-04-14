import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SpinnerComponent } from './spinner.component';

@Component({
  selector: 'app-button',
  imports: [NgIf, SpinnerComponent],
  template: `<button
    [type]="type"
    [disabled]="disabled || loading"
    class="
    inline-flex items-center justify-center gap-2
    bg-brand hover:bg-brand-light text-white font-bold py-2 px-4 rounded 
    focus:outline-none focus:shadow-outline
    hover:transition-colors hover:duration-300 hover:ease-in-out
    cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    {{ loading ? 'cursor-wait' : '' }}
    {{ class }}
  "
  >
    <ng-container *ngIf="loading">
      <app-spinner />
    </ng-container>

    <span *ngIf="!loading">
      {{ label }}
      <ng-content></ng-content>
    </span>
  </button>`,
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() class: string = '';
}
