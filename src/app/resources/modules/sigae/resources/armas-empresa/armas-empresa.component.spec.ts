import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmasEmpresaComponent } from './armas-empresa.component';

describe('ArmasEmpresaComponent', () => {
  let component: ArmasEmpresaComponent;
  let fixture: ComponentFixture<ArmasEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArmasEmpresaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArmasEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
