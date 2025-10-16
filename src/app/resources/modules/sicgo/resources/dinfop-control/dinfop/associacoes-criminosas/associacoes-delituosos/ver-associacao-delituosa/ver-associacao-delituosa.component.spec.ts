import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerAssociacaoDelituosaComponent } from './ver-associacao-delituosa.component';

describe('VerAssociacaoDelituosaComponent', () => {
  let component: VerAssociacaoDelituosaComponent;
  let fixture: ComponentFixture<VerAssociacaoDelituosaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerAssociacaoDelituosaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerAssociacaoDelituosaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
