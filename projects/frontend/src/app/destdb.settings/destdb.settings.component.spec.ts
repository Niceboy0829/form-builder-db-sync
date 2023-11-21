import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestdbSettingsComponent } from './destdb.settings.component';

describe('DestdbSettingsComponent', () => {
  let component: DestdbSettingsComponent;
  let fixture: ComponentFixture<DestdbSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DestdbSettingsComponent]
    });
    fixture = TestBed.createComponent(DestdbSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
