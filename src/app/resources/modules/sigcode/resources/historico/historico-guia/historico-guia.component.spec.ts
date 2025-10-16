import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoGuiaComponent } from './historico-guia.component';

describe('HistoricoGuiaComponent', () => {
  let component: HistoricoGuiaComponent;
  let fixture: ComponentFixture<HistoricoGuiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricoGuiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoGuiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
