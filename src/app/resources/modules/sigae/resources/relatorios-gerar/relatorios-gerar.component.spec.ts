import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatoriosGerarComponent } from './relatorios-gerar.component';

describe('RelatoriosGerarComponent', () => {
  let component: RelatoriosGerarComponent;
  let fixture: ComponentFixture<RelatoriosGerarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatoriosGerarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatoriosGerarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
