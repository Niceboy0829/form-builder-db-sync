import { Component } from '@angular/core';
import { DbCompareListStore } from './db-compare-list.component.store';
import { tap } from 'rxjs';

@Component({
  selector: 'app-db-compare-list',
  templateUrl: './db-compare-list.component.html',
  styleUrls: ['./db-compare-list.component.scss'],
  providers: [
    DbCompareListStore
  ]
})
export class DbCompareListComponent {
  constructor(
    private store: DbCompareListStore
  ) {

  }

  vm$ = this.store.vm$.pipe(tap(vm=>console.log({vm})))

  didChangeQuery($event: any) {
    this.store.setQuery($event.target.value);
  }
  
  didButtonClick(resultItem: any) {
    this.store.updateDestDataEffect(resultItem.src.id);
  }

}
