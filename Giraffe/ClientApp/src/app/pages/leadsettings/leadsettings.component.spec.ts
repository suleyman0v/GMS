import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsettingsComponent } from './leadsettings.component';

describe('LeadsettingsComponent', () => {
  let component: LeadsettingsComponent;
  let fixture: ComponentFixture<LeadsettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadsettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
