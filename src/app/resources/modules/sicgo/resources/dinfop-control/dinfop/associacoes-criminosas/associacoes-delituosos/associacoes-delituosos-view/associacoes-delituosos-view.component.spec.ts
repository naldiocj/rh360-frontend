import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociacoesDelituososViewComponent } from './associacoes-delituosos-view.component';

describe('AssociacoesDelituososViewComponent', () => {
  let component: AssociacoesDelituososViewComponent;
  let fixture: ComponentFixture<AssociacoesDelituososViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociacoesDelituososViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociacoesDelituososViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
