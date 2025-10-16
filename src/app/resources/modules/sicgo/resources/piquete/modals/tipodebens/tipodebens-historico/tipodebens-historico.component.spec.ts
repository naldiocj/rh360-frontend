import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipodebensHistoricoComponent } from './tipodebens-historico.component';

describe('TipodebensHistoricoComponent', () => {
  let component: TipodebensHistoricoComponent;
  let fixture: ComponentFixture<TipodebensHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipodebensHistoricoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipodebensHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
