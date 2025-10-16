import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacaoArmaComponent } from './informacao-arma.component';

describe('InformacaoArmaComponent', () => {
  let component: InformacaoArmaComponent;
  let fixture: ComponentFixture<InformacaoArmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformacaoArmaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformacaoArmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
