/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FormacoesComponent } from './formacoes.component';

describe('FormacoesComponent', () => {
  let component: FormacoesComponent;
  let fixture: ComponentFixture<FormacoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormacoesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
