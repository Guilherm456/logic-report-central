import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full">
      <textarea
        [id]="id"
        [name]="name"
        [value]="innerValue"
        [disabled]="disabled"
        [required]="required"
        [placeholder]="placeholder"
        [rows]="rows"
        [cols]="cols"
        (input)="onInputChange($event)"
        (blur)="onTouched()"
        (focus)="onFocus()"
        [ngClass]="{
          'border-red-500 focus:border-red-500 focus:ring-red-500':
            errorMessage,
          'border-gray-300 focus:border-brand focus:ring-brand': !errorMessage
        }"
        class="peer block w-full appearance-none rounded-md
        border bg-white px-3 pt-6 pb-2
        text-sm text-gray-900 focus:outline-none focus:ring-1 disabled:bg-gray-100 placeholder:opacity-0 focus:placeholder:opacity-100 placeholder:text-gray-400
        h-32 min-h-[80px]
        {{ className }}"
      ></textarea>

      <label
        *ngIf="label"
        [attr.for]="id"
        class="absolute left-3 text-sm text-gray-500 pointer-events-none transition-all
        peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
        peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-600
        peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-gray-600
        select-none"
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
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() errorMessage: string | null = null;
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() rows: number = 3;
  @Input() cols: number = 20;
  @Input() className: string = '';
  @Output() input = new EventEmitter<Event>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();

  innerValue: string | number = '';
  onChange: (value: string | number) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private cdRef: ChangeDetectorRef) {}

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

  ngAfterViewInit() {
    setTimeout(() => {
      this.cdRef.detectChanges();
    });
  }

  writeValue(value: string | number | null): void {
    this.innerValue = value ?? '';
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdRef.markForCheck();
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.innerValue = target.value;
    this.onChange(this.innerValue);
    this.input.emit(event);
  }

  onFocus(): void {
    this.focus.emit();
  }
}
