import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinfopComponent } from './dinfop.component';

describe('DinfopComponent', () => {
  let component: DinfopComponent;
  let fixture: ComponentFixture<DinfopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DinfopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DinfopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
