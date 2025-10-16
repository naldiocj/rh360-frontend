/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InformacaoForaDeEfetividadeComponent } from './informacao-fora-de-efetividade.component';

describe('InformacaoForaDeEfetividadeComponent', () => {
  let component: InformacaoForaDeEfetividadeComponent;
  let fixture: ComponentFixture<InformacaoForaDeEfetividadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacaoForaDeEfetividadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacaoForaDeEfetividadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
