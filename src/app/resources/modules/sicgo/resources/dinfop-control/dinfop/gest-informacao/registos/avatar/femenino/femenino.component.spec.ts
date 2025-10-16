import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FemeninoComponent } from './femenino.component';

describe('FemeninoComponent', () => {
  let component: FemeninoComponent;
  let fixture: ComponentFixture<FemeninoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FemeninoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FemeninoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
