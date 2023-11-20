import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DbCompareListComponent } from './db-compare-list/db-compare-list.component';

const routes: Routes = [
  {
    path: 'db-compare',
    component: DbCompareListComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'db-compare'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
