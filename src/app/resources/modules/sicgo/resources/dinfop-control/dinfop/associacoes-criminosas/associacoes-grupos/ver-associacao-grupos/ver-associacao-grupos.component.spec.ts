import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerAssociacaoGruposComponent } from './ver-associacao-grupos.component';

describe('VerAssociacaoGruposComponent', () => {
  let component: VerAssociacaoGruposComponent;
  let fixture: ComponentFixture<VerAssociacaoGruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerAssociacaoGruposComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerAssociacaoGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
