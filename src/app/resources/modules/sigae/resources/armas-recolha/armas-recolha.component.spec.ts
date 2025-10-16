import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmasRecolhaComponent } from './armas-recolha.component';

describe('ArmasRecolhaComponent', () => {
  let component: ArmasRecolhaComponent;
  let fixture: ComponentFixture<ArmasRecolhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArmasRecolhaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArmasRecolhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
