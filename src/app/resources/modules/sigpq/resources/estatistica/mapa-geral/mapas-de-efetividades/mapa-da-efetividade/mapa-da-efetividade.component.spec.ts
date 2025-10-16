import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaDaEfetividadeComponent } from './mapa-da-efetividade.component';

describe('MapaDaEfetividadeComponent', () => {
  let component: MapaDaEfetividadeComponent;
  let fixture: ComponentFixture<MapaDaEfetividadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaDaEfetividadeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaDaEfetividadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
