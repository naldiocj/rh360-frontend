import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplosivosLotesComponent } from './explosivos-lotes.component';

describe('ExplosivosLotesComponent', () => {
  let component: ExplosivosLotesComponent;
  let fixture: ComponentFixture<ExplosivosLotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExplosivosLotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplosivosLotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
