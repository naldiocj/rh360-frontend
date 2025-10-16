import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformantesComponent } from './informantes.component';

describe('InformantesComponent', () => {
  let component: InformantesComponent;
  let fixture: ComponentFixture<InformantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformantesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
