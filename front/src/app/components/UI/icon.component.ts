import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `<span class="material-icons-outlined">
    {{ icon }}
  </span>`,
})
export class IconComponent {
  @Input() icon: string = '';
  @Input() class: string = '';
}
