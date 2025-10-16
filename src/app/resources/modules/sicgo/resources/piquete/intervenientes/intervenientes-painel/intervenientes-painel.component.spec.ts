import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervenientesPainelComponent } from './intervenientes-painel.component';

describe('IntervenientesPainelComponent', () => {
  let component: IntervenientesPainelComponent;
  let fixture: ComponentFixture<IntervenientesPainelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntervenientesPainelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntervenientesPainelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
