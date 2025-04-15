import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@components/shared/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  template: ` <div class="flex flex-col md:flex-row h-screen bg-gray-50">
    <app-sidebar></app-sidebar>
    <div class="flex-grow overflow-y-auto">
      <router-outlet></router-outlet>
    </div>
  </div>`,
  imports: [CommonModule, SidebarComponent, RouterOutlet],
})
export class LayoutComponent {}
