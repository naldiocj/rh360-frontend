import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitimaListaComponent } from './vitima-lista.component';

describe('VitimaListaComponent', () => {
  let component: VitimaListaComponent;
  let fixture: ComponentFixture<VitimaListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VitimaListaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VitimaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
