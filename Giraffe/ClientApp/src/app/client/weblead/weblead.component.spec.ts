import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebleadComponent } from './weblead.component';

describe('WebleadComponent', () => {
  let component: WebleadComponent;
  let fixture: ComponentFixture<WebleadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebleadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebleadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
