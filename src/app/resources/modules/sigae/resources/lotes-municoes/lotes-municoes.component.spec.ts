import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotesMunicoesComponent } from './lotes-municoes.component';

describe('LotesMunicoesComponent', () => {
  let component: LotesMunicoesComponent;
  let fixture: ComponentFixture<LotesMunicoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotesMunicoesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotesMunicoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
