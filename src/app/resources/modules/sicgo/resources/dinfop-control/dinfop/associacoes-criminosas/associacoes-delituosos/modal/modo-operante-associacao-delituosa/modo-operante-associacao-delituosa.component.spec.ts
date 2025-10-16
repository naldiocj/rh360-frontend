import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModoOperanteAssociacaoDelituosaComponent } from './modo-operante-associacao-delituosa.component';

describe('ModoOperanteAssociacaoDelituosaComponent', () => {
  let component: ModoOperanteAssociacaoDelituosaComponent;
  let fixture: ComponentFixture<ModoOperanteAssociacaoDelituosaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModoOperanteAssociacaoDelituosaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModoOperanteAssociacaoDelituosaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
