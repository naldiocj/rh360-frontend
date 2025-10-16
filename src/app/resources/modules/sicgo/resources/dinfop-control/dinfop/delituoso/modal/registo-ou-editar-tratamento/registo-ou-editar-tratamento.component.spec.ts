import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistoOuEditarTratamentoComponent } from './registo-ou-editar-tratamento.component';

describe('RegistoOuEditarTratamentoComponent', () => {
  let component: RegistoOuEditarTratamentoComponent;
  let fixture: ComponentFixture<RegistoOuEditarTratamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistoOuEditarTratamentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistoOuEditarTratamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
