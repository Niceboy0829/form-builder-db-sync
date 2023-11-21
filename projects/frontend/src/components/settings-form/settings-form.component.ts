import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SettingsFormStore } from './settings-form.component.store';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss'],
})
export class SettingsFormComponent implements OnInit, OnDestroy {
  @Input() type: string = 'source'

  settingsForm = new FormGroup({
    user: new FormControl(''),
    password: new FormControl(''),
    server: new FormControl(''),
    database: new FormControl(''),
    port: new FormControl(1433),
    encrypt: new FormControl(true),
    trustServerCertificate: new FormControl(true),
    dialect: new FormControl('mssql'),
    dialectOptions: new FormGroup({
      instanceName: new FormControl('')
    })
  })
  dataSubscriber;

  constructor(
    private store: SettingsFormStore
  ) {

    this.dataSubscriber = this.data$.subscribe(data => {
      console.log({data})
      this.settingsForm.patchValue(data)
    })
    
  }

  vm$ = this.store.vm$;
  data$ = this.store.data$;

  onSubmit() {
    this.store.saveDbSettingsEffect(this.settingsForm.value)
  }

  testConnection(event: any) {
    this.store.testConnectionEffect()
  }

  get nextPage() {
    console.log(this.type)
    return this.type==='source' ? '/dest-db-settings' : '/db-compare'
  }

  ngOnInit(): void {
    this.store.setType(this.type)
    this.store.loadSettingsEffect();
  }

  ngOnDestroy(): void {
    this.dataSubscriber.unsubscribe();
  }
}
