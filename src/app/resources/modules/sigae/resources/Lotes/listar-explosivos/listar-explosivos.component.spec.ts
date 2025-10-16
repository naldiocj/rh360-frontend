import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarExplosivosComponent } from './listar-explosivos.component';

describe('ListarExplosivosComponent', () => {
  let component: ListarExplosivosComponent;
  let fixture: ComponentFixture<ListarExplosivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarExplosivosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarExplosivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
