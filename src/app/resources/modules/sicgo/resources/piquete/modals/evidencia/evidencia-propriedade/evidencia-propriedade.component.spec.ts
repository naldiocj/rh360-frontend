import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenciaPropriedadeComponent } from './evidencia-propriedade.component';

describe('EvidenciaPropriedadeComponent', () => {
  let component: EvidenciaPropriedadeComponent;
  let fixture: ComponentFixture<EvidenciaPropriedadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvidenciaPropriedadeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvidenciaPropriedadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
