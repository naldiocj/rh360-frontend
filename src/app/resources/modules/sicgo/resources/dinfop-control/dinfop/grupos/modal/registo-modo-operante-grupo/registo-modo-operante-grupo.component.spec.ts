import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistoModoOperanteGrupoComponent } from './registo-modo-operante-grupo.component';

describe('RegistoModoOperanteGrupoComponent', () => {
  let component: RegistoModoOperanteGrupoComponent;
  let fixture: ComponentFixture<RegistoModoOperanteGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistoModoOperanteGrupoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistoModoOperanteGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
