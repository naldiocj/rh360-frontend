import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesInformanteComponent } from './detalhes-informante.component';

describe('DetalhesInformanteComponent', () => {
  let component: DetalhesInformanteComponent;
  let fixture: ComponentFixture<DetalhesInformanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalhesInformanteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesInformanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
