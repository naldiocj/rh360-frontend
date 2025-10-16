import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinfopFichaDelituosoComponent } from './dinfop-ficha-delituoso.component';

describe('DinfopFichaDelituosoComponent', () => {
  let component: DinfopFichaDelituosoComponent;
  let fixture: ComponentFixture<DinfopFichaDelituosoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DinfopFichaDelituosoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DinfopFichaDelituosoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
