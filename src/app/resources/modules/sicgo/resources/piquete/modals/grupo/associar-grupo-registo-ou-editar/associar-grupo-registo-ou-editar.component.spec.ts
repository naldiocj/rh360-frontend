import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociarGrupoRegistoOuEditarComponent } from './associar-grupo-registo-ou-editar.component';

describe('AssociarGrupoRegistoOuEditarComponent', () => {
  let component: AssociarGrupoRegistoOuEditarComponent;
  let fixture: ComponentFixture<AssociarGrupoRegistoOuEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociarGrupoRegistoOuEditarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociarGrupoRegistoOuEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
