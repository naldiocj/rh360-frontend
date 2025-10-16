import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarOuEditarSequenciaInformativaComponent } from './registar-ou-editar-sequencia-informativa.component';

describe('RegistarOuEditarSequenciaInformativaComponent', () => {
  let component: RegistarOuEditarSequenciaInformativaComponent;
  let fixture: ComponentFixture<RegistarOuEditarSequenciaInformativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistarOuEditarSequenciaInformativaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistarOuEditarSequenciaInformativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
