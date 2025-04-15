import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full">
      <input
        [id]="id"
        [type]="type"
        [name]="name"
        [value]="innerValue"
        [disabled]="disabled"
        [required]="required"
        [placeholder]="placeholder"
        [autocomplete]="autocomplete"
        (input)="onInputChange($event)"
        (blur)="onTouched()"
        (focus)="onFocus()"
        (keydown)="onKeyDown($event)"
        [ngClass]="{
          'border-red-500 focus:border-red-500 focus:ring-red-500':
            errorMessage,
          'border-gray-300 focus:border-brand focus:ring-brand': !errorMessage
        }"
        class="peer block w-full appearance-none rounded-md 
        border bg-white px-3 pt-6 pb-2 
        text-sm text-gray-900 focus:outline-none focus:ring-1 disabled:bg-gray-100 placeholder:opacity-0 focus:placeholder:opacity-100 placeholder:text-gray-400 
        h-10
        {{ className }}"
      />

      <label
        *ngIf="label"
        [attr.for]="id"
        class="absolute left-3 text-sm text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-600 select-none"
      >
        {{ label }}
      </label>

      <div *ngIf="errorMessage" class="mt-1 text-sm text-red-500">
        {{ errorMessage }}
      </div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() errorMessage: string | null = null;
  @Input() id: string = '';
  @Input() type: string = 'text';
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() autocomplete: string = 'off';
  @Input() className: string = '';
  @Output() input = new EventEmitter<Event>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();
  @Output() keydown = new EventEmitter<KeyboardEvent>();

  innerValue: string | number = '';
  onChange: (value: string | number) => void = () => {};

  @Input()
  set value(val: string | number) {
    if (val !== this.innerValue) {
      this.innerValue = val;
      this.onChange(val);
    }
  }

  get value(): string | number {
    return this.innerValue;
  }

  writeValue(value: string | number | null): void {
    this.innerValue = value ?? '';
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.innerValue = target.value;
    this.onChange(this.innerValue);
    this.input.emit(event);
  }

  onTouched(): void {
    this.onTouched();
    this.blur.emit();
  }

  onFocus(): void {
    this.focus.emit();
  }

  onKeyDown(event: KeyboardEvent): void {
    this.keydown.emit(event);
  }
}
