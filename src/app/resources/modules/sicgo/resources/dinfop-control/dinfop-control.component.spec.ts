import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinfopControlComponent } from './dinfop-control.component';

describe('DinfopControlComponent', () => {
  let component: DinfopControlComponent;
  let fixture: ComponentFixture<DinfopControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DinfopControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DinfopControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
