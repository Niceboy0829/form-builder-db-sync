import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbCompareListComponent } from './db-compare-list.component';

describe('DbCompareListComponent', () => {
  let component: DbCompareListComponent;
  let fixture: ComponentFixture<DbCompareListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DbCompareListComponent]
    });
    fixture = TestBed.createComponent(DbCompareListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
