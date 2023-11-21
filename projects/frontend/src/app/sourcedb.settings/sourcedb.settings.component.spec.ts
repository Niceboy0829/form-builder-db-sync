import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcedbSettingsComponent } from './sourcedb.settings.component';

describe('SourcedbSettingsComponent', () => {
  let component: SourcedbSettingsComponent;
  let fixture: ComponentFixture<SourcedbSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SourcedbSettingsComponent]
    });
    fixture = TestBed.createComponent(SourcedbSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
