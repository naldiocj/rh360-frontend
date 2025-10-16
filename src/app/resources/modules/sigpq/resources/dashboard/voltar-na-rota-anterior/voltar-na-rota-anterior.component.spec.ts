/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VoltarNaRotaAnteriorComponent } from './voltar-na-rota-anterior.component';

describe('VoltarNaRotaAnteriorComponent', () => {
  let component: VoltarNaRotaAnteriorComponent;
  let fixture: ComponentFixture<VoltarNaRotaAnteriorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoltarNaRotaAnteriorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoltarNaRotaAnteriorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
