import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarOuEditarAnexosComponent } from './registar-ou-editar-anexos.component';

describe('RegistarOuEditarAnexosComponent', () => {
  let component: RegistarOuEditarAnexosComponent;
  let fixture: ComponentFixture<RegistarOuEditarAnexosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistarOuEditarAnexosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistarOuEditarAnexosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
