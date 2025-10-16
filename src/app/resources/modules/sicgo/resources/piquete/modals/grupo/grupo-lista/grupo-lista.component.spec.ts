import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoListaComponent } from './grupo-lista.component';

describe('GrupoListaComponent', () => {
  let component: GrupoListaComponent;
  let fixture: ComponentFixture<GrupoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrupoListaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
