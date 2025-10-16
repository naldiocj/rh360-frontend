import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapasDeEfetividadesComponent } from './mapas-de-efetividades.component';

describe('MapasDeEfetividadesComponent', () => {
  let component: MapasDeEfetividadesComponent;
  let fixture: ComponentFixture<MapasDeEfetividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapasDeEfetividadesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapasDeEfetividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
