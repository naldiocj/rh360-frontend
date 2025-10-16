import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioOrdemPublicaComponent } from './formulario-ordem-publica.component';

describe('FormularioOrdemPublicaComponent', () => {
  let component: FormularioOrdemPublicaComponent;
  let fixture: ComponentFixture<FormularioOrdemPublicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioOrdemPublicaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioOrdemPublicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
