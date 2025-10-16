import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarOuEditarArquivosComponent } from './registar-ou-editar-arquivos.component';

describe('RegistarOuEditarArquivosComponent', () => {
  let component: RegistarOuEditarArquivosComponent;
  let fixture: ComponentFixture<RegistarOuEditarArquivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistarOuEditarArquivosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistarOuEditarArquivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
