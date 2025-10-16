import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestInformacaoComponent } from './gest-informacao.component';

describe('GestInformacaoComponent', () => {
  let component: GestInformacaoComponent;
  let fixture: ComponentFixture<GestInformacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestInformacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestInformacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
