import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPiqueteComponent } from './map-piquete.component';

describe('MapPiqueteComponent', () => {
  let component: MapPiqueteComponent;
  let fixture: ComponentFixture<MapPiqueteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapPiqueteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapPiqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
