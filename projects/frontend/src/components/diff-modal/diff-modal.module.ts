import { NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { DiffModalComponent } from './diff-modal.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    DiffModalComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  exports: [
    DiffModalComponent
  ]
})
export class DiffModalModule { }
