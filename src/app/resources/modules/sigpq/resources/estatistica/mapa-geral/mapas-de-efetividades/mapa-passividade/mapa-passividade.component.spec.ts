import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaPassividadeComponent } from './mapa-passividade.component';

describe('MapaPassividadeComponent', () => {
  let component: MapaPassividadeComponent;
  let fixture: ComponentFixture<MapaPassividadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaPassividadeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaPassividadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
