import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DenunciaPublicaComponent } from './denuncia-publica.component';

describe('DenunciaPublicaComponent', () => {
  let component: DenunciaPublicaComponent;
  let fixture: ComponentFixture<DenunciaPublicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DenunciaPublicaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DenunciaPublicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
