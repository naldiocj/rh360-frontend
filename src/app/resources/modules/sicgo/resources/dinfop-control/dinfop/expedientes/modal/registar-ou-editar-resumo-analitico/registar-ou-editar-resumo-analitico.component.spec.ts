import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarOuEditarResumoAnaliticoComponent } from './registar-ou-editar-resumo-analitico.component';

describe('RegistarOuEditarResumoAnaliticoComponent', () => {
  let component: RegistarOuEditarResumoAnaliticoComponent;
  let fixture: ComponentFixture<RegistarOuEditarResumoAnaliticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistarOuEditarResumoAnaliticoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistarOuEditarResumoAnaliticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
