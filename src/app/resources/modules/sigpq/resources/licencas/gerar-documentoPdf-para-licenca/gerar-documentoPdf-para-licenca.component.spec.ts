/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GerarDocumentoPdfParaLicencaComponent } from './gerar-documentoPdf-para-licenca.component';

describe('GerarDocumentoPdfParaLicencaComponent', () => {
  let component: GerarDocumentoPdfParaLicencaComponent;
  let fixture: ComponentFixture<GerarDocumentoPdfParaLicencaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GerarDocumentoPdfParaLicencaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GerarDocumentoPdfParaLicencaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
