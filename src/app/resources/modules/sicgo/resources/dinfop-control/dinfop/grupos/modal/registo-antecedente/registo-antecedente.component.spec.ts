import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistoGrupoAntecedenteComponent } from './registo-antecedente.component';

describe('RegistoAntecedenteComponent', () => {
  let component: RegistoGrupoAntecedenteComponent;
  let fixture: ComponentFixture<RegistoGrupoAntecedenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistoGrupoAntecedenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistoGrupoAntecedenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
