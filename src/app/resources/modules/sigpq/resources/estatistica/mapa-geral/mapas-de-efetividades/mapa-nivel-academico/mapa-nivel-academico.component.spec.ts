import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaNivelAcademicoComponent } from './mapa-nivel-academico.component';

describe('MapaNivelAcademicoComponent', () => {
  let component: MapaNivelAcademicoComponent;
  let fixture: ComponentFixture<MapaNivelAcademicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaNivelAcademicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaNivelAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
