import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposaltemplateComponent } from './proposaltemplate.component';

describe('ProposaltemplateComponent', () => {
  let component: ProposaltemplateComponent;
  let fixture: ComponentFixture<ProposaltemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposaltemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposaltemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
