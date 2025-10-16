import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarOuEditarIntegrantesComponent } from './registar-ou-editar-integrantes.component';

describe('RegistarOuEditarIntegrantesComponent', () => {
  let component: RegistarOuEditarIntegrantesComponent;
  let fixture: ComponentFixture<RegistarOuEditarIntegrantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistarOuEditarIntegrantesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistarOuEditarIntegrantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
