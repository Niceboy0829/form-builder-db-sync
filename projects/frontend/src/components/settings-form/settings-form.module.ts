import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsFormComponent } from './settings-form.component';
import { ReactiveFormsModule } from '@angular/forms'
import { SettingsFormStore } from './settings-form.component.store';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    SettingsFormComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [
    SettingsFormStore
  ],
  exports: [
    SettingsFormComponent
  ]
})
export class SettingsFormModule { }
