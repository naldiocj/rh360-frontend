import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisaoViewComponent } from './decisao-view.component';

describe('DecisaoViewComponent', () => {
  let component: DecisaoViewComponent;
  let fixture: ComponentFixture<DecisaoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisaoViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecisaoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
