import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoEChefiaComponent } from './cargo-e-chefia.component';

describe('CargoEChefiaComponent', () => {
  let component: CargoEChefiaComponent;
  let fixture: ComponentFixture<CargoEChefiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargoEChefiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargoEChefiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
