import {
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-modal-container',
  template: `
    <div
      class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center"
    >
      <div class="bg-white rounded-md shadow-lg z-51 min-w-[300px]">
        <div class="relative">
          <button
            class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            (click)="closeModalEvent.emit()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="p-4">
          <ng-container #modalContentContainer></ng-container>
        </div>
      </div>
    </div>
  `,
})
export class ModalContainerComponent implements OnInit, OnChanges {
  @Input() modalContentComponent: Type<any> | null = null;
  @Input() modalData: any;
  @Output() closeModalEvent = new EventEmitter<void>();
  @ViewChild('modalContentContainer', { read: ViewContainerRef, static: true })
  modalContentContainer!: ViewContainerRef;
  public contentComponentRef: ComponentRef<any> | null = null;

  constructor() {}

  ngOnInit(): void {
    this.renderContent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modalContentComponent']) {
      this.renderContent();
    }
  }

  renderContent(): void {
    this.modalContentContainer.clear();
    if (this.modalContentComponent) {
      this.contentComponentRef = this.modalContentContainer.createComponent(
        this.modalContentComponent
      );
      if (this.modalData) {
        Object.assign(this.contentComponentRef.instance, this.modalData);
      }
    }
  }
}
