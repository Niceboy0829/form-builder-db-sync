import { Component, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { DbCompareListStore } from './db-compare-list.component.store';
import { tap } from 'rxjs';
import { DiffModalComponent } from '@component/diff-modal/diff-modal.component';

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
    private store: DbCompareListStore,
    private dialog: MatDialog,
  ) {

  }

  vm$ = this.store.vm$.pipe(tap(vm=>console.log({vm})))

  didChangeQuery($event: any) {
    this.store.setQuery($event.target.value);
  }
  
  didButtonClick(resultItem: any) {
    this.store.updateDestDataEffect(resultItem.src.id);
  }

  openDiffViewModal(data: any) {
    let leftLines = data.src.config ? JSON.parse(data.src.config) : undefined
    let rightLines = data.dest?.config ? JSON.parse(data.dest.config)  : undefined
    
    // if(leftLines) {
    //   leftLines.schema = leftLines?.schema ? JSON.parse(leftLines.schema): undefined
    //   leftLines = JSON.stringify(leftLines, null, 4)
    // }
    // if(rightLines) {
    //   rightLines.schema = rightLines?.schema ? JSON.parse(rightLines.schema) : undefined
    //   rightLines = JSON.stringify(rightLines, null, 4)
    // }

    const diffModalRef = this.dialog.open(DiffModalComponent, {
      width: '100%',
      height: '100vh',
      data: {
        name: data.name,
        leftLines,
        rightLines
      }
    })
    diffModalRef.afterClosed().subscribe(result => {
      console.log('modal is closed.')

    })
  }

}
