import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarOuEditarVeiculoComponent } from './registar-ou-editar-veiculo.component';

describe('RegistarOuEditarVeiculoComponent', () => {
  let component: RegistarOuEditarVeiculoComponent;
  let fixture: ComponentFixture<RegistarOuEditarVeiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistarOuEditarVeiculoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistarOuEditarVeiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
