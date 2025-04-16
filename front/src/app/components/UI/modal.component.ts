import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-modal-container',
  template: `
    <div
      class="fixed top-0 left-0 w-full h-full z-50 bg-black/50 flex justify-center items-center"
    >
      <ng-container #modalContent></ng-container>
    </div>
  `,
})
export class ModalContainerComponent implements OnInit, OnDestroy {
  @ViewChild('modalContent', { read: ViewContainerRef, static: true })
  modalContent!: ViewContainerRef;
  modalContentComponent: any;
  modalData: any;
  @Output() closeModalEvent = new EventEmitter<any>();

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    this.loadModalContent();
  }

  ngOnDestroy(): void {}

  closeModal(result?: any): void {
    this.closeModalEvent.emit(result);
  }

  private loadModalContent() {
    if (this.modalContentComponent) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        this.modalContentComponent
      );
      const componentRef = this.modalContent.createComponent(factory);
      Object.assign(componentRef.instance as any, this.modalData);
      if ((componentRef.instance as any).closeModal)
        (componentRef.instance as any).closeModal = this.closeModal.bind(this);
    }
  }
}
