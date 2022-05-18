import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemgroupsComponent } from './itemgroups.component';

describe('ItemgroupsComponent', () => {
  let component: ItemgroupsComponent;
  let fixture: ComponentFixture<ItemgroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemgroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
