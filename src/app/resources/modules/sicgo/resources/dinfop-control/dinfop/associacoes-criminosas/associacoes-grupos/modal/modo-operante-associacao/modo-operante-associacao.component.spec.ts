import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModoOperanteAssociacaoComponent } from './modo-operante-associacao.component';

describe('ModoOperanteAssociacaoComponent', () => {
  let component: ModoOperanteAssociacaoComponent;
  let fixture: ComponentFixture<ModoOperanteAssociacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModoOperanteAssociacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModoOperanteAssociacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
