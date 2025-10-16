import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroOuEditarEmpresaComponent } from './registro-ou-editar-empresa.component';

describe('RegistroOuEditarEmpresaComponent', () => {
  let component: RegistroOuEditarEmpresaComponent;
  let fixture: ComponentFixture<RegistroOuEditarEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroOuEditarEmpresaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroOuEditarEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
