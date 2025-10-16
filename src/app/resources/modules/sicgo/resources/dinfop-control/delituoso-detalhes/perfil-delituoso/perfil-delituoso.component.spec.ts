import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilDelituosoComponent } from './perfil-delituoso.component';

describe('PerfilDelituosoComponent', () => {
  let component: PerfilDelituosoComponent;
  let fixture: ComponentFixture<PerfilDelituosoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilDelituosoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilDelituosoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
