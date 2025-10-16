import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontesInformacaoComponent } from './fontes-informacao.component';

describe('FontesInformacaoComponent', () => {
  let component: FontesInformacaoComponent;
  let fixture: ComponentFixture<FontesInformacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FontesInformacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FontesInformacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
