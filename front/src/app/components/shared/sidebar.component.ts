import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '@services/user.service';

interface MenuItem {
  label: string;
  icon: string;
  routerLink: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, NgIf, NgFor],
  template: `<nav
      [class]="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
      class="fixed md:sticky top-0 left-0 h-screen w-64 bg-gray-50 border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300 ease-in-out"
    >
      <div
        class="flex items-center p-4 pb-2 md:border-b border-gray-200 min-h-14"
      >
        <img src="assets/logo.svg" alt="Logo" class="h-8 hidden md:block" />
        <button
          (click)="toggleSidebar()"
          class="md:hidden ml-auto text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand"
        >
          <span class="material-icons-outlined">close</span>
        </button>
      </div>

      <ul class="flex-1 flex flex-col gap-0.5 p-2 overflow-y-auto">
        <li *ngFor="let item of menuItems">
          <a
            [routerLink]="item.routerLink"
            routerLinkActive="bg-brand-50 text-brand border-l-4 border-brand"
            (click)="toggleSidebar()"
            class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <span class="material-icons-outlined text-lg">{{ item.icon }}</span>
            <span class="text-sm font-medium">{{ item.label }}</span>
          </a>
        </li>
      </ul>

      <div class="p-4.5 mt-auto border-t border-gray-200">
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center"
          >
            <span class="material-icons-outlined text-brand text-sm"
              >person</span
            >
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">
              {{ getUser()?.username }}
            </p>
            <p class="text-xs text-gray-500 truncate">{{ getUser()?.email }}</p>
          </div>
          <button
            (click)="logout()"
            class="text-gray-400 hover:text-brand p-1 rounded-full flex justify-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand"
            title="Sair"
          >
            <span class="material-icons-outlined text-sm">logout</span>
          </button>
        </div>
      </div>
    </nav>

    <header
      class="sticky top-0 bg-white shadow-sm p-4 flex items-center justify-between border-b border-gray-200 md:hidden z-40"
    >
      <button
        (click)="toggleSidebar()"
        class="focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand"
      >
        <span class="material-icons-outlined">menu</span>
      </button>

      <img src="assets/logo.svg" alt="Logo" class="h-6" />
    </header>

    <div
      *ngIf="isOpen"
      (click)="toggleSidebar()"
      class="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
    ></div>`,
})
export class SidebarComponent {
  constructor(private userService: UserService) {}

  isOpen = false;

  menuItems: MenuItem[] = [
    { label: 'Usuários', icon: 'people', routerLink: '/users' },
    { label: 'Médicos', icon: 'local_hospital', routerLink: '/doctors' },
    { label: 'Templates', icon: 'description', routerLink: '/templates' },
    { label: 'Laudos', icon: 'assignment', routerLink: '/reports' },
  ];

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.userService.logout();
  }

  getUser() {
    return this.userService.getCurrentUser();
  }
}
