import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmasOrganicasComponent } from './armas-organicas.component';

describe('ArmasOrganicasComponent', () => {
  let component: ArmasOrganicasComponent;
  let fixture: ComponentFixture<ArmasOrganicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArmasOrganicasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArmasOrganicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
