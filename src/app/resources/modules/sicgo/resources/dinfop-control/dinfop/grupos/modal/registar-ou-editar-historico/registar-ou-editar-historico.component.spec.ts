import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarOuEditarHistoricoComponent } from './registar-ou-editar-historico.component';

describe('RegistarOuEditarHistoricoComponent', () => {
  let component: RegistarOuEditarHistoricoComponent;
  let fixture: ComponentFixture<RegistarOuEditarHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistarOuEditarHistoricoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistarOuEditarHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
