import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmasCacaComponent } from './armas-caca.component';

describe('ArmasCacaComponent', () => {
  let component: ArmasCacaComponent;
  let fixture: ComponentFixture<ArmasCacaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArmasCacaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArmasCacaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
