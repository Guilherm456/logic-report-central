import { NgModule } from '@angular/core';
import { ButtonComponent } from './UI/button.component';
import { IconComponent } from './UI/icon.component';
import { InputComponent } from './UI/input.component';
import { SpinnerComponent } from './UI/spinner.component';

@NgModule({
  imports: [ButtonComponent, InputComponent, SpinnerComponent, IconComponent],
  exports: [ButtonComponent, InputComponent, SpinnerComponent, IconComponent],
})
export class UiModule {}
