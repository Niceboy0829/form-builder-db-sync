import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DbCompareListComponent } from './db-compare-list/db-compare-list.component';
import { CommonModule, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { SourcedbSettingsComponent } from './sourcedb.settings/sourcedb.settings.component';
import { DestdbSettingsComponent } from './destdb.settings/destdb.settings.component'
import { SettingsFormModule } from '../components/settings-form/settings-form.module';
import { DiffModalModule } from '@component/diff-modal/diff-modal.module';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    AppComponent,
    DbCompareListComponent,
    SourcedbSettingsComponent,
    DestdbSettingsComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
    SettingsFormModule,
    MatDialogModule,
    DiffModalModule,
    OverlayModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
