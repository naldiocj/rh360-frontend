import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeometriaDeRostoComponent } from './geometria-de-rosto.component';

describe('GeometriaDeRostoComponent', () => {
  let component: GeometriaDeRostoComponent;
  let fixture: ComponentFixture<GeometriaDeRostoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeometriaDeRostoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeometriaDeRostoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
