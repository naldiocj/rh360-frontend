import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistoModoOperanteComponent } from './registo-modo-operante.component';

describe('RegistoModoOperanteComponent', () => {
  let component: RegistoModoOperanteComponent;
  let fixture: ComponentFixture<RegistoModoOperanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistoModoOperanteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistoModoOperanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
