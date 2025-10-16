import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistoAssociarGrupoComponent } from './registo-associar-grupo.component';

describe('RegistoAssociarGrupoComponent', () => {
  let component: RegistoAssociarGrupoComponent;
  let fixture: ComponentFixture<RegistoAssociarGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistoAssociarGrupoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistoAssociarGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
