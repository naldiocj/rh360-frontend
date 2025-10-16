import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntecedenteAssociacaoDelituosaComponent } from './antecedente-associacao-delituosa.component';

describe('AntecedenteAssociacaoDelituosaComponent', () => {
  let component: AntecedenteAssociacaoDelituosaComponent;
  let fixture: ComponentFixture<AntecedenteAssociacaoDelituosaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AntecedenteAssociacaoDelituosaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AntecedenteAssociacaoDelituosaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
