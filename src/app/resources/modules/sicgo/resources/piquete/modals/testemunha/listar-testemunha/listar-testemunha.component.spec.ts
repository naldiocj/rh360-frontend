import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarTestemunhaComponent } from './listar-testemunha.component';

describe('ListarTestemunhaComponent', () => {
  let component: ListarTestemunhaComponent;
  let fixture: ComponentFixture<ListarTestemunhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarTestemunhaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarTestemunhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
