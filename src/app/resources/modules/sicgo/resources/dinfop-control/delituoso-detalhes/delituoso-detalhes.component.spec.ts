import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelituosoDetalhesComponent } from './delituoso-detalhes.component';

describe('DelituosoDetalhesComponent', () => {
  let component: DelituosoDetalhesComponent;
  let fixture: ComponentFixture<DelituosoDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelituosoDetalhesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelituosoDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
