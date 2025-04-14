import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounce } from 'lodash';
import { InputComponent } from './input.component';
import { SpinnerComponent } from './spinner.component';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, InputComponent, SpinnerComponent],
  template: `
    <div class="relative w-full">
      <app-input
        [id]="id"
        [type]="type"
        [name]="name"
        [label]="label"
        [disabled]="disabled"
        [required]="required"
        [placeholder]="placeholder"
        [autocomplete]="autocomplete"
        [value]="displayValue"
        (input)="onInputChange($event)"
        (blur)="handleBlur()"
        (focus)="onFocus()"
        (keydown)="onKeyDown($event)"
        [errorMessage]="errorMessage"
        class="pr-8"
      ></app-input>
      <!-- Ícone de dropdown -->
      <span
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </span>

      <!-- Dropdown -->
      <div
        *ngIf="isOpen"
        class="absolute z-20 -mt-4 w-full rounded-lg bg-white shadow-xl ring-1 ring-gray-200 transition-all duration-200 ease-in-out"
        [ngClass]="
          isOpen
            ? 'opacity-100 scale-y-100'
            : 'opacity-0 scale-y-95 pointer-events-none'
        "
      >
        <ul
          *ngIf="filteredOptions.length > 0"
          class="py-1 text-sm text-gray-900 max-h-60 overflow-auto"
        >
          <li
            *ngFor="let option of filteredOptions; let i = index"
            (mousedown)="selectOption(option)"
            (mouseenter)="highlightIndex = i"
            [ngClass]="{
              'bg-gray-50 text-gray-900': highlightIndex === i,
              'cursor-pointer': true
            }"
            class="px-4 py-2 hover:bg-gray-50 transition-colors duration-150"
          >
            {{ displayOption(option) }}
          </li>
          <li
            *ngIf="hasMore && !loading && onMore"
            (mousedown)="loadMore()"
            class="px-4 py-2 text-center text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
          >
            Buscar mais
          </li>
          <li *ngIf="loading" class="px-4 py-2 text-center text-gray-600">
            <app-spinner class="inline-block h-5 w-5"></app-spinner>
            Carregando...
          </li>
        </ul>
        <div
          *ngIf="filteredOptions.length === 0 && !loading"
          class="px-4 py-2 text-sm text-gray-600"
        >
          Nenhum resultado encontrado
        </div>
      </div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() errorMessage: string | null = null;
  @Input() id: string = `autocomplete-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  @Input() type: string = 'text';
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() autocomplete: string = 'off';
  @Input() options: Array<{ id: string | number; [key: string]: any }> = [];
  @Input() loading: boolean = false;
  @Input() onSearch?: (value?: string) => void;
  @Input() isOptionEqual?: (
    value: any,
    option: { id: string | number; [key: string]: any }
  ) => boolean;
  @Output() onChange = new EventEmitter<{
    id: string | number;
    [key: string]: any;
  } | null>();
  @Output() onMore = new EventEmitter<number>();

  private innerValue: any = null;
  private page: number = 1;
  highlightIndex: number = -1;
  filteredOptions: Array<{ id: string | number; [key: string]: any }> = [];
  isOpen: boolean = false;
  displayValue: string = '';

  private debouncedSearch: (value?: string) => void;
  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (value: any) => void = () => {};

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.debouncedSearch = debounce((value?: string) => {
      if (this.onSearch) {
        this.onSearch(value);
      } else {
        this.filterOptions(value);
      }
    }, 300);
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.onTouchedCallback();
      this.cdr.markForCheck();
    }
  }

  get value(): any {
    return this.innerValue;
  }

  set value(val: any) {
    if (
      !this.isOptionEqual ||
      !this.innerValue ||
      !this.isOptionEqual(val, this.innerValue)
    ) {
      this.innerValue = val;
      this.updateDisplayValue();
      this.onChangeCallback(val);
      this.onChange.emit(val);
      this.cdr.markForCheck();
    }
  }

  writeValue(value: any): void {
    this.innerValue = value;
    this.updateDisplayValue();
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.displayValue = target.value;
    this.isOpen = true;
    this.innerValue = null;
    this.onChangeCallback(null);
    this.onChange.emit(null);
    this.debouncedSearch(target.value);
    this.cdr.markForCheck();
  }

  onFocus(): void {
    this.isOpen = true;
    this.debouncedSearch(this.displayValue);
    this.cdr.markForCheck();
  }

  handleBlur(): void {
    // Apenas marca como touched, o fechamento é tratado pelo click fora
    this.onTouchedCallback();
    this.cdr.markForCheck();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightIndex = Math.min(
          this.highlightIndex + 1,
          this.filteredOptions.length - 1
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlightIndex = Math.max(this.highlightIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.highlightIndex >= 0) {
          this.selectOption(this.filteredOptions[this.highlightIndex]);
        }
        break;
      case 'Escape':
        this.isOpen = false;
        break;
    }
    this.cdr.markForCheck();
  }

  selectOption(option: { id: string | number; [key: string]: any }): void {
    this.value = option;
    this.isOpen = false;
    this.highlightIndex = -1;
    this.cdr.markForCheck();
  }

  private updateDisplayValue(): void {
    if (this.innerValue && typeof this.innerValue === 'object') {
      this.displayValue = this.displayOption(this.innerValue);
    } else {
      this.displayValue = this.innerValue?.toString() || '';
    }
  }

  displayOption(option: { id: string | number; [key: string]: any }): string {
    return (
      option?.['name'] || option?.['label'] || option?.id?.toString() || ''
    );
  }

  private filterOptions(searchTerm?: string): void {
    if (!searchTerm) {
      this.filteredOptions = [...this.options];
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      this.filteredOptions = this.options.filter((option) =>
        this.displayOption(option).toLowerCase().includes(lowerSearch)
      );
    }
    this.cdr.markForCheck();
  }

  loadMore(): void {
    if (!this.loading) {
      this.page++;
      this.onMore.emit(this.page);
    }
  }

  get hasMore(): boolean {
    return (
      this.options.length > 0 &&
      this.filteredOptions.length >= this.options.length
    );
  }
}
