import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarOuEditarFormularioComponent } from './registar-ou-editar-formulario.component';

describe('RegistarOuEditarFormularioComponent', () => {
  let component: RegistarOuEditarFormularioComponent;
  let fixture: ComponentFixture<RegistarOuEditarFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistarOuEditarFormularioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistarOuEditarFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
