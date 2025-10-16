import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaOcorrenciasComponent } from './ficha-ocorrencias.component';

describe('FichaOcorrenciasComponent', () => {
  let component: FichaOcorrenciasComponent;
  let fixture: ComponentFixture<FichaOcorrenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaOcorrenciasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaOcorrenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
