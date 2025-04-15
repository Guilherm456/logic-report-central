import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `<span class="material-icons-outlined {{ className }}">
    {{ icon }}
  </span>`,
})
export class IconComponent {
  @Input() icon: string = '';
  @Input() className: string = '';
}
