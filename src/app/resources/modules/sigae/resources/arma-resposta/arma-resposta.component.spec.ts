import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmaRespostaComponent } from './arma-resposta.component';

describe('ArmaRespostaComponent', () => {
  let component: ArmaRespostaComponent;
  let fixture: ComponentFixture<ArmaRespostaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArmaRespostaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArmaRespostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
