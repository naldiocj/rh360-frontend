import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarOuEditarInfoInicialComponent } from './registar-ou-editar-info-inicial.component';

describe('RegistarOuEditarInfoInicialComponent', () => {
  let component: RegistarOuEditarInfoInicialComponent;
  let fixture: ComponentFixture<RegistarOuEditarInfoInicialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistarOuEditarInfoInicialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistarOuEditarInfoInicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
