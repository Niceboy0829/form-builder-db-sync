import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DbCompareListComponent } from './db-compare-list/db-compare-list.component';
import { SourcedbSettingsComponent } from './sourcedb.settings/sourcedb.settings.component';
import { DestdbSettingsComponent } from './destdb.settings/destdb.settings.component';

const routes: Routes = [
  {
    path: 'source-db-settings',
    component: SourcedbSettingsComponent,
  },
  {
    path: 'dest-db-settings',
    component: DestdbSettingsComponent,
  },
  {
    path: 'db-compare',
    component: DbCompareListComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'source-db-settings'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
