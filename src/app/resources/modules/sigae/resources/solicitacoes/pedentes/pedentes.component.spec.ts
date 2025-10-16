import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedentesComponent } from './pedentes.component';

describe('PedentesComponent', () => {
  let component: PedentesComponent;
  let fixture: ComponentFixture<PedentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedentesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
