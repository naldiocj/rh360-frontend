import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSelecionadosComponent } from './ver-selecionados.component';

describe('VerSelecionadosComponent', () => {
  let component: VerSelecionadosComponent;
  let fixture: ComponentFixture<VerSelecionadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerSelecionadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerSelecionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
