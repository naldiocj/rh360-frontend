import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregadasComponent } from './entregadas.component';

describe('EntregadasComponent', () => {
  let component: EntregadasComponent;
  let fixture: ComponentFixture<EntregadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntregadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
