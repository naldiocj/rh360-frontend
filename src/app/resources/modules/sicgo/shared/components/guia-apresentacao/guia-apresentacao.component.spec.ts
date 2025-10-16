import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiaApresentacaoComponent } from './guia-apresentacao.component';

describe('GuiaApresentacaoComponent', () => {
  let component: GuiaApresentacaoComponent;
  let fixture: ComponentFixture<GuiaApresentacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuiaApresentacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuiaApresentacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
