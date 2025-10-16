import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmasEstraviadasComponent } from './armas-estraviadas.component';

describe('ArmasEstraviadasComponent', () => {
  let component: ArmasEstraviadasComponent;
  let fixture: ComponentFixture<ArmasEstraviadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArmasEstraviadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArmasEstraviadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
