import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesDespachoComponent } from './detalhes-despacho.component';

describe('DetalhesDespachoComponent', () => {
  let component: DetalhesDespachoComponent;
  let fixture: ComponentFixture<DetalhesDespachoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalhesDespachoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesDespachoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
