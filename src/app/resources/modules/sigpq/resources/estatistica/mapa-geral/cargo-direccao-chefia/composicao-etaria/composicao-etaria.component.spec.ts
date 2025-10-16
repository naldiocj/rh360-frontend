import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposicaoEtariaComponent } from './composicao-etaria.component';

describe('ComposicaoEtariaComponent', () => {
  let component: ComposicaoEtariaComponent;
  let fixture: ComponentFixture<ComposicaoEtariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComposicaoEtariaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComposicaoEtariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
