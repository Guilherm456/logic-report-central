import { NgModule } from '@angular/core';
import { AutocompleteComponent } from './UI/autocomplete.component';
import { ButtonComponent } from './UI/button.component';
import { IconComponent } from './UI/icon.component';
import { InputComponent } from './UI/input.component';
import { SpinnerComponent } from './UI/spinner.component';
import { TextareaComponent } from './UI/textarea.component';

@NgModule({
  imports: [
    ButtonComponent,
    InputComponent,
    TextareaComponent,
    SpinnerComponent,
    IconComponent,
    AutocompleteComponent,
  ],
  exports: [
    ButtonComponent,
    InputComponent,
    SpinnerComponent,
    IconComponent,
    TextareaComponent,
    AutocompleteComponent,
  ],
})
export class UiModule {}
