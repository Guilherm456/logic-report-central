import { NgModule } from '@angular/core';
import { ButtonComponent } from './UI/button.component';
import { InputComponent } from './UI/input.component';
import { SpinnerComponent } from './UI/spinner.component';

@NgModule({
  imports: [ButtonComponent, InputComponent, SpinnerComponent],
  exports: [ButtonComponent, InputComponent, SpinnerComponent],
})
export class UiModule {}
