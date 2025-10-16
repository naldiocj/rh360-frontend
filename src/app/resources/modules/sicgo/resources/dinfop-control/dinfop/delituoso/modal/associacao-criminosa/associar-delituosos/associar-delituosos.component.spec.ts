import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociarDelituososComponent } from './associar-delituosos.component';

describe('AssociarDelituososComponent', () => {
  let component: AssociarDelituososComponent;
  let fixture: ComponentFixture<AssociarDelituososComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociarDelituososComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociarDelituososComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
