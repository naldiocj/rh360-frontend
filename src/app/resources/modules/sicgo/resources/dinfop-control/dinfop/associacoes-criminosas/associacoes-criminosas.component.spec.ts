import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociacoesCriminosasComponent } from './associacoes-criminosas.component';

describe('AssociacoesCriminosasComponent', () => {
  let component: AssociacoesCriminosasComponent;
  let fixture: ComponentFixture<AssociacoesCriminosasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociacoesCriminosasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociacoesCriminosasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
