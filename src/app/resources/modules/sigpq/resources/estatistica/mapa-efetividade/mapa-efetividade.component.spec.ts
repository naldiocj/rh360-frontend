import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaEfetividadeComponent } from './mapa-efetividade.component';

describe('MapaEfetividadeComponent', () => {
  let component: MapaEfetividadeComponent;
  let fixture: ComponentFixture<MapaEfetividadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaEfetividadeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaEfetividadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
