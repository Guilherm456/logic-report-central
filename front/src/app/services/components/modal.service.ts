import {
  ApplicationRef,
  ComponentRef,
  EmbeddedViewRef,
  EnvironmentInjector,
  Injectable,
  Type,
  createComponent,
} from '@angular/core';
import { ModalContainerComponent } from '@components/UI/modal.component';

interface ModalConfig {
  component: Type<any>;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalComponentRef: ComponentRef<ModalContainerComponent> | null =
    null;

  constructor(
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector
  ) {}

  showModal<T>(config: ModalConfig): ComponentRef<T> | null {
    if (this.modalComponentRef) {
      this.closeModal();
    }

    const modalContainerComponent = createComponent(ModalContainerComponent, {
      environmentInjector: this.environmentInjector,
    });
    this.modalComponentRef = modalContainerComponent;

    this.modalComponentRef.instance.modalContentComponent = config.component;
    this.modalComponentRef.instance.closeModalEvent.subscribe(() =>
      this.closeModal()
    );

    this.appRef.attachView(this.modalComponentRef.hostView);
    document.body.appendChild(
      (this.modalComponentRef.hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement
    );

    return this.modalComponentRef.instance
      .contentComponentRef as ComponentRef<T> | null;
  }

  closeModal(): void {
    if (this.modalComponentRef) {
      this.appRef.detachView(this.modalComponentRef.hostView);
      this.modalComponentRef.destroy();
      this.modalComponentRef = null;
    }
  }
}
