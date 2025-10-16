import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosAcusadoComponent } from './registar-ou-editar.component';

describe('DadosAcusadoComponent', () => {
  let component: DadosAcusadoComponent;
  let fixture: ComponentFixture<DadosAcusadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DadosAcusadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DadosAcusadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
