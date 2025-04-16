import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  EmbeddedViewRef,
  EnvironmentInjector,
  Inject,
  Injectable,
  Renderer2,
  RendererFactory2,
  Type,
  createComponent,
} from '@angular/core';
import { ModalContainerComponent } from '@components/UI/modal.component';
import { Observable, Subject, take } from 'rxjs';

export interface ModalConfig {
  component: Type<any>;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalComponentRef: ComponentRef<ModalContainerComponent> | null =
    null;
  private resultSubject = new Subject<any>();
  result$: Observable<any> = this.resultSubject.asObservable();
  private renderer: Renderer2;

  constructor(
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  showModal<T>(config: ModalConfig): Observable<any> {
    this.destroyModal();
    this.resultSubject = new Subject<any>();
    this.result$ = this.resultSubject.asObservable();

    this.modalComponentRef = createComponent(ModalContainerComponent, {
      environmentInjector: this.environmentInjector,
    });

    this.modalComponentRef.instance.modalContentComponent = config.component;
    this.modalComponentRef.instance.modalData = config.data;
    this.modalComponentRef.instance.closeModalEvent.subscribe((result) => {
      this.resultSubject.next(result);
      this.destroyModal();
    });

    this.appRef.attachView(this.modalComponentRef.hostView);

    const modalElement = (
      this.modalComponentRef.hostView as EmbeddedViewRef<any>
    ).rootNodes[0] as HTMLElement;

    this.renderer.appendChild(this.document.body, modalElement);

    return this.result$.pipe(take(1));
  }

  private destroyModal(): void {
    if (this.modalComponentRef) {
      this.appRef.detachView(this.modalComponentRef.hostView);
      this.modalComponentRef.destroy();
      this.modalComponentRef = null;
    }
  }
}
