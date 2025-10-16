import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubinformantesComponent } from './subinformantes.component';

describe('SubinformantesComponent', () => {
  let component: SubinformantesComponent;
  let fixture: ComponentFixture<SubinformantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubinformantesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubinformantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
