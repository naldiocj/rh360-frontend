import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmasLotesComponent } from './armas-lotes.component';

describe('ArmasLotesComponent', () => {
  let component: ArmasLotesComponent;
  let fixture: ComponentFixture<ArmasLotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArmasLotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArmasLotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
