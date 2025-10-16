import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaGeralComponent } from './mapa-geral.component';

describe('MapaGeralComponent', () => {
  let component: MapaGeralComponent;
  let fixture: ComponentFixture<MapaGeralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaGeralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaGeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
