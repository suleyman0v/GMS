import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicegroupsComponent } from './servicegroups.component';

describe('ServicegroupsComponent', () => {
  let component: ServicegroupsComponent;
  let fixture: ComponentFixture<ServicegroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicegroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicegroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
