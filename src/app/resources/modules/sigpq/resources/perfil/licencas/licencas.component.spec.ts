/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LicencasComponent } from './licencas.component';

describe('LicencasComponent', () => {
  let component: LicencasComponent;
  let fixture: ComponentFixture<LicencasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicencasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicencasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
