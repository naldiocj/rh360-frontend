import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociacoesGruposViewComponent } from './associacoes-grupos-view.component';

describe('AssociacoesGruposViewComponent', () => {
  let component: AssociacoesGruposViewComponent;
  let fixture: ComponentFixture<AssociacoesGruposViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociacoesGruposViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociacoesGruposViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
