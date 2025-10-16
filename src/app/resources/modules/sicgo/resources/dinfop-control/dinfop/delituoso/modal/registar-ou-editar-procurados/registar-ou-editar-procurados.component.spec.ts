import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarOuEditarProcuradosComponent } from './registar-ou-editar-procurados.component';

describe('RegistarOuEditarProcuradosComponent', () => {
  let component: RegistarOuEditarProcuradosComponent;
  let fixture: ComponentFixture<RegistarOuEditarProcuradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistarOuEditarProcuradosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistarOuEditarProcuradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
