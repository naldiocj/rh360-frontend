import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualisarOuImprimirComponent } from './visualisar-ou-imprimir.component';

describe('VisualisarOuImprimirComponent', () => {
  let component: VisualisarOuImprimirComponent;
  let fixture: ComponentFixture<VisualisarOuImprimirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualisarOuImprimirComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualisarOuImprimirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
