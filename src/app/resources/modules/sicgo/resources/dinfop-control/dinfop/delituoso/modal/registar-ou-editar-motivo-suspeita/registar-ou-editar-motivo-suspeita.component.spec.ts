import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarOuEditarMotivoSuspeitaComponent } from './registar-ou-editar-motivo-suspeita.component';

describe('RegistarOuEditarMotivoSuspeitaComponent', () => {
  let component: RegistarOuEditarMotivoSuspeitaComponent;
  let fixture: ComponentFixture<RegistarOuEditarMotivoSuspeitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistarOuEditarMotivoSuspeitaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistarOuEditarMotivoSuspeitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
