import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmasEntradaComponent } from './armas-entrada.component';

describe('ArmasEntradaComponent', () => {
  let component: ArmasEntradaComponent;
  let fixture: ComponentFixture<ArmasEntradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArmasEntradaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArmasEntradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
