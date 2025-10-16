import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistoSituacaoCondenadoComponent } from './registo-situacao-condenado.component';

describe('RegistoSituacaoCondenadoComponent', () => {
  let component: RegistoSituacaoCondenadoComponent;
  let fixture: ComponentFixture<RegistoSituacaoCondenadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistoSituacaoCondenadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistoSituacaoCondenadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
